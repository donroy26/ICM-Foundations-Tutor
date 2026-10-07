#!/usr/bin/env node
/* End-to-end smoke test: drives the game in headless Chromium like a player.
   Run:  NODE_PATH=$(npm root -g) PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node v2/test/e2e.mjs
   Covers: file:// load with zero console errors, Start Here + 1.1 played fully,
   reload-resume at 1.2, 1.2 and 1.3 (claude sim in a folder) played fully,
   skip-to 3.2 (practice terminal), zip download integrity, then a full
   playthrough of every lesson over http://. */

import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, extname, normalize } from "node:path";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = dirname(fileURLToPath(import.meta.url));
const indexPath = join(here, "..", "index.html");
const fileUrl = pathToFileURL(indexPath).href + "?debug=1";

let failures = 0;
function ok(cond, label) {
  console.log((cond ? "  pass  " : "  FAIL  ") + label);
  if (!cond) failures++;
}

async function beatInfo(page) {
  return page.evaluate(() => {
    const p = FC.state.data.progress;
    const beat = FC.engine._beats()[p.beat] || null;
    return {
      lesson: p.current_lesson,
      idx: p.beat,
      phase: beat && beat.phase,
      type: beat && beat.type,
      d: beat && beat.d ? JSON.parse(JSON.stringify(beat.d)) : null,
      quiz: beat && beat.quiz ? beat.quiz : null,
      total: FC.engine._beats().length
    };
  });
}

async function waitBeatChange(page, prev, timeout = 8000) {
  await page.waitForFunction(
    ([lesson, idx]) => {
      const p = FC.state.data.progress;
      return p.current_lesson !== lesson || p.beat !== idx || p.current_lesson === "complete";
    },
    [prev.lesson, prev.idx],
    { timeout }
  );
}

async function clickGuidePrimary(page) {
  const btn = page.locator("#guide-actions button.btn-primary");
  await btn.first().waitFor({ state: "visible", timeout: 8000 });
  await btn.first().click();
}

async function answerQuiz(page, quiz) {
  const correct = quiz.options.find((o) => o.correct);
  const card = page.locator("#quiz-card");
  await card.waitFor({ state: "visible", timeout: 8000 });
  await card.locator(".quiz-opt", { hasText: correct.t.slice(0, 40) }).first().click();
  // A correct answer now shows the explanation and a "Got it" button before advancing.
  const gotIt = card.locator("button", { hasText: "Got it" });
  await gotIt.waitFor({ state: "visible", timeout: 4000 });
  // Assert the explanation rendered (bug 2) and the card stayed within the viewport (bug 1).
  const withinViewport = await card.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom <= window.innerHeight + 1 && r.top >= -1;
  });
  if (!withinViewport) throw new Error("quiz card overflows the viewport");
  const hasExplain = await card.locator(".quiz-explain").count();
  if (!hasExplain) throw new Error("correct answer showed no explanation");
  await gotIt.click();
}

async function handleModalReflect(page, required) {
  const card = page.locator("#quiz-card");
  await card.waitFor({ state: "visible", timeout: 8000 });
  if (required) {
    await card.locator("textarea").fill("test reflection from the e2e player");
    await card.locator("button", { hasText: "Save it" }).click();
  } else {
    const skip = card.locator("button", { hasText: "Skip" });
    if (await skip.count()) await skip.click();
    else {
      await card.locator("textarea").fill("test reflection");
      await card.locator("button", { hasText: "Save it" }).click();
    }
  }
}

async function fillEditorAndSave(page) {
  // Wait for the scripted buffer to finish typing (save button appears).
  await page.locator("#btn-editor-save").waitFor({ state: "attached", timeout: 15000 });
  const fields = page.locator("#editor-surface .fill-field");
  const n = await fields.count();
  for (let i = 0; i < n; i++) {
    const f = fields.nth(i);
    await f.click();
    await f.pressSequentially("test value " + (i + 1), { delay: 2 });
  }
  await page.locator("#btn-editor-save").click();
}

async function createInExplorer(page, kind, name) {
  const btn = page.locator(kind === "folder" ? "#btn-new-folder" : "#btn-new-file");
  await page.waitForFunction(
    (sel) => !document.querySelector(sel).disabled,
    kind === "folder" ? "#btn-new-folder" : "#btn-new-file",
    { timeout: 8000 }
  );
  await btn.click();
  const input = page.locator(".tree-input");
  await input.waitFor({ state: "visible", timeout: 4000 });
  await input.fill(name);
  await input.press("Enter");
}

// One step of gameplay: look at the current beat and act like a player would.
async function playBeat(page, info) {
  const resolve = (p) => page.evaluate((t) => FC.util.resolvePath(t), p);

  switch (info.type) {
    case "open":
    case "teach-page":
    case "note":
    case "seed-files":
      await clickGuidePrimary(page);
      break;

    case "check":
      await answerQuiz(page, info.quiz);
      break;

    case "quiz":
      await answerQuiz(page, info.d.quiz);
      break;

    case "create-folder": {
      const name = info.d.name === "player-choice"
        ? (info.d.storeAs === "workspaceName" ? "my-blog" : "second-room-" + info.lesson.slice(0, 2))
        : info.d.name;
      await createInExplorer(page, "folder", name);
      // Possible convention nudge for player-choice names is avoided (lowercase).
      break;
    }

    case "create-file": {
      const name = info.d.name === "player-choice"
        ? "player-file-" + info.lesson.slice(0, 2) + ".md"
        : (await resolve(info.d.path)).split("/").pop();
      await createInExplorer(page, "file", name);
      await fillEditorAndSave(page);
      break;
    }

    case "edit-file":
      await clickGuidePrimary(page);
      await fillEditorAndSave(page);
      break;

    case "open-file": {
      const path = await resolve(info.d.path);
      await page.locator(`.tree-row[data-path="${path}"]`).first().click();
      break;
    }

    case "picker": {
      const card = page.locator("#quiz-card");
      await card.waitFor({ state: "visible", timeout: 8000 });
      await card.locator(".quiz-opt").first().click();
      // A follow-up question may appear (e.g. Windows architecture) — but only
      // while we're still on the SAME picker beat. Don't bleed into the next card.
      await page.waitForTimeout(300);
      const stillPicker = await page.evaluate(() => {
        const b = FC.engine._beats()[FC.state.data.progress.beat];
        return !!b && b.type === "picker";
      });
      if (stillPicker && await card.isVisible()) {
        await card.locator(".quiz-opt").first().click();
      }
      break;
    }

    case "claude-open": {
      const isOpen = await page.evaluate(() => FC.windows.isOpen("claude"));
      if (!isOpen) await page.locator("#task-claude").click();
      if (info.d.expectFolder) {
        const folder = await resolve(info.d.expectFolder);
        await page.waitForTimeout(200);
        await page.selectOption("#claude-folder", folder);
      }
      break;
    }

    case "claude-term":
      await page.locator("#claude-input").fill(info.d.command);
      await page.locator("#claude-input").press("Enter");
      break;

    case "claude-chat": {
      const prompt = await resolve(info.d.script[0].suggestedPrompt);
      await page.locator("#claude-input").fill(prompt);
      await page.locator("#claude-input").press("Enter");
      break;
    }

    case "reflect":
      await handleModalReflect(page, info.d.optional === false);
      break;

    case "checkin": {
      const ci = await page.evaluate(() => {
        const d = FC.directives[FC.state.data.progress.current_lesson];
        return JSON.parse(JSON.stringify(d.checkin));
      });
      await answerQuiz(page, ci.quiz);
      if (ci.reflect) await handleModalReflect(page, false);
      if (ci.quiz2) await answerQuiz(page, ci.quiz2);
      break;
    }

    case "close": {
      // Either a guide "Go" button or a section level-up screen.
      const level = page.locator("#level-screen");
      await page.waitForTimeout(300);
      if (await level.isVisible()) {
        await level.locator("button.btn-primary").click();
      } else {
        await clickGuidePrimary(page);
      }
      break;
    }

    default:
      throw new Error("player bot has no move for beat type: " + info.type);
  }
}

async function playLesson(page, expectSlug) {
  let info = await beatInfo(page);
  if (expectSlug) ok(info.lesson === expectSlug, `at lesson ${expectSlug}`);
  const startLesson = info.lesson;
  let guard = 0;
  while (info.lesson === startLesson && info.lesson !== "complete") {
    if (++guard > 200) throw new Error("player bot stuck at " + JSON.stringify(info));
    await playBeat(page, info);
    await waitBeatChange(page, info, 15000);
    info = await beatInfo(page);
  }
  return info;
}

async function main() {
  // PW_CHANNEL=chrome uses an installed Chrome instead of a downloaded Chromium.
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  console.log("loading " + fileUrl);
  await page.goto(fileUrl);
  await page.waitForSelector("#title-screen.show", { timeout: 8000 });
  ok(true, "title screen shows under file://");

  await page.locator("#title-actions button.btn-primary").click();

  // --- Start Here and 1.1, played fully ---
  console.log("\nplaying Start Here and 1.1…");
  let info = await playLesson(page, "0-0_start-here");
  ok(info.lesson === "1-1_chat", "advanced to 1.1 after Start Here");
  info = await playLesson(page, "1-1_chat");
  ok(info.lesson === "1-2_skills", "advanced to 1.2 after close");

  const check = await page.evaluate(() => ({
    xp: FC.state.data.xp.total,
    done: FC.state.data.progress.lessons_completed.length,
    corrections: FC.vfs.readFile("my-skills/corrections.md"),
    saved: localStorage.getItem("fc-v2-save") !== null
  }));
  ok(check.xp > 50, `xp accumulated (${check.xp})`);
  ok(check.done === 2, "lessons_completed has 2 entries");
  ok(!!check.corrections && check.corrections.includes("test value"), "corrections.md saved with filled fields");
  ok(check.saved, "autosave written to localStorage");

  // --- Reload mid-lesson: resume ---
  console.log("\nreload and resume…");
  await page.reload();
  await page.waitForSelector("#title-screen.show", { timeout: 8000 });
  const continueBtn = page.locator("#title-actions button.btn-primary");
  const label = await continueBtn.textContent();
  ok(/Continue/.test(label), `continue button offered ("${label.trim()}")`);
  await continueBtn.click();
  const resumed = await beatInfo(page);
  ok(resumed.lesson === "1-2_skills", "resumed at 1.2");
  const treeVisible = await page.locator('.tree-row[data-path="my-skills"]').count();
  ok(treeVisible > 0, "vfs tree restored from save");

  // --- 1.2, then 1.3: the claude sim working inside a folder ---
  console.log("\nplaying 1.2 and 1.3 (claude sim in a folder)…");
  info = await playLesson(page, "1-2_skills");
  ok(info.lesson === "1-3_folders-one-agent", "advanced to 1.3 after the section boundary");
  info = await playLesson(page, "1-3_folders-one-agent");
  ok(info.lesson === "1-4_pick-your-setup", "1.3 completed through the claude sim");
  const ws = await page.evaluate(() => ({
    name: FC.state.data.player.workspaceName,
    map: FC.vfs.readFile("client-email/CLAUDE.md"),
    draft: FC.vfs.readFile("client-email/drafts/2026-10-06-maple-street-bakery-01.md"),
    jakesMap: FC.vfs.readFile("practice/client-email/CLAUDE.md"),
    skill: FC.vfs.readFile("client-email/.claude/skills/how-i-reply/SKILL.md")
  }));
  ok(ws.name === "client-email", "workspace is client-email");
  ok(!!ws.map && ws.map.includes("## Routing") && ws.map.includes("test value"), "map has the routing row with the filled blank");
  ok(!!ws.draft && !/room will be ready/i.test(ws.draft) && /21st/.test(ws.draft), "check-my-email draft saved: offers the 21st, no room promised");
  ok(!!ws.jakesMap && !/\| Job \| Read \|/.test(ws.map), "player wrote their own map; Jake's is kept aside to compare");
  ok(!!ws.skill && ws.skill.includes("name: how-i-reply"), "skill travelled into the workspace");

  // --- 3.2: terminal mode ---
  console.log("\nskipping to 3.2 (terminal)…");
  await page.evaluate(() => FC.debug.skipTo("3-2_steady-parts-into-code"));
  info = await playLesson(page, "3-2_steady-parts-into-code");
  ok(info.lesson === "3-3_keep-it-useful", "3.2 completed through the practice terminal");
  const script = await page.evaluate(() => FC.vfs.readFile("weekly-report/scripts/make-table.py"));
  ok(!!script && script.includes("csv.DictReader"), "script written by the claude sim");

  // --- Zip download ---
  console.log("\nzip export…");
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 8000 }),
    page.evaluate(() => FC.zip.downloadWorkspace())
  ]);
  const dir = mkdtempSync(join(tmpdir(), "fc-zip-"));
  const zipPath = join(dir, download.suggestedFilename());
  await download.saveAs(zipPath);
  let unzipOk = true, listing = "";
  try {
    execFileSync("unzip", ["-t", zipPath], { stdio: "pipe" });
    listing = execFileSync("unzip", ["-l", zipPath], { encoding: "utf8" });
  } catch (e) {
    unzipOk = false;
  }
  ok(unzipOk, "zip passes unzip -t");
  ok(listing.includes("CLAUDE.md"), "zip contains CLAUDE.md");
  ok(listing.includes("make-table.py"), "zip contains files written by the claude sim");

  // --- Console errors (catches module/fetch mistakes under file://) ---
  const realErrors = consoleErrors.filter((e) => !/AudioContext|autoplay|fonts.googleapis|net::ERR/i.test(e));
  ok(realErrors.length === 0, "zero console errors under file://" + (realErrors.length ? "\n    " + realErrors.join("\n    ") : ""));

  await context.close();

  // ==========================================================================
  // Full playthrough: all 11 lessons over http:// (GitHub Pages simulation)
  // ==========================================================================
  console.log("\nfull playthrough over http://…");
  const server = await startServer(join(here, ".."));
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  const errors2 = [];
  page2.on("console", (m) => { if (m.type() === "error") errors2.push(m.text()); });
  page2.on("pageerror", (e) => errors2.push(String(e)));
  page2.on("response", (r) => { if (r.status() === 404) errors2.push("404: " + r.url()); });

  await page2.goto(`http://127.0.0.1:${server.port}/index.html?debug=1`);
  await page2.waitForSelector("#title-screen.show", { timeout: 8000 });
  await page2.locator("#title-actions button.btn-primary").click();

  const slugs = await page2.evaluate(() => FC.content.lessons.map((l) => l.slug));
  let cursor = await beatInfo(page2);
  for (const slug of slugs) {
    if (cursor.lesson === "complete") break;
    process.stdout.write("  " + slug + " … ");
    cursor = await playLesson(page2, slug);
    console.log("done");
  }
  ok(cursor.lesson === "complete", "every lesson completed");

  const finale = await page2.evaluate(() => ({
    level: FC.state.data.xp.level,
    xp: FC.state.data.xp.total,
    achievements: FC.state.data.achievements,
    done: FC.state.data.progress.lessons_completed.length,
    screenText: document.querySelector("#level-card") ? document.querySelector("#level-card").textContent : ""
  }));
  ok(finale.done === 11, `11 lessons recorded (${finale.done})`);
  ok(finale.level === 5, `final level reached (${finale.level})`);
  ok(finale.achievements.includes("foundation-complete"), "foundation-complete achievement awarded");
  ok(/Happy learning\./.test(finale.screenText), "persona sign-off on the finale screen");
  console.log("  xp total: " + finale.xp + " · achievements: " + finale.achievements.join(", "));

  const realErrors2 = errors2.filter((e) => !/AudioContext|autoplay|fonts.googleapis|net::ERR/i.test(e));
  ok(realErrors2.length === 0, "zero console errors under http://" + (realErrors2.length ? "\n    " + realErrors2.join("\n    ") : ""));

  await browser.close();
  server.close();

  console.log(failures ? `\n${failures} FAILURES` : "\nall checks passed");
  process.exit(failures ? 1 : 0);
}

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json" };

function startServer(rootDir) {
  return new Promise((resolve) => {
    const srv = createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = normalize(join(rootDir, urlPath === "/" ? "index.html" : urlPath));
      if (!file.startsWith(rootDir) || !existsSync(file)) {
        res.writeHead(404); res.end("not found"); return;
      }
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
      res.end(readFileSync(file));
    });
    srv.listen(0, "127.0.0.1", () => resolve({ port: srv.address().port, close: () => srv.close() }));
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
