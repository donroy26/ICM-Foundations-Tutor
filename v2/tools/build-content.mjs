#!/usr/bin/env node
/* Compiles _tutor/curriculum/*.md Brief sections into v2/js/data/content.js and
   lints v2/js/data/directives.js against the generated chunks + persona rules.

   Run from anywhere:  node v2/tools/build-content.mjs
   The curriculum stays the single source of truth for Jake's prose — edit a
   lesson file, re-run this, the game updates. No npm dependencies. */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..");
const curriculumDir = join(repo, "_tutor", "curriculum");
const outFile = join(repo, "v2", "js", "data", "content.js");
const directivesFile = join(repo, "v2", "js", "data", "directives.js");

// Lesson names come from the routing table in CLAUDE.md — one source of truth.
function readRoutingTable() {
  const md = readFileSync(join(repo, "CLAUDE.md"), "utf8");
  const rows = [...md.matchAll(/^\|\s*`([\w-]+)`\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|/gm)];
  return rows.map((r) => ({ slug: r[1], name: r[2].replace(/\s*⚑\s*$/, "").trim(), file: r[3] }));
}

const SECTION_OF = (i) => (i < 2 ? 1 : i < 5 ? 2 : i < 10 ? 3 : 4);
const BOUNDARIES = new Set(["02_prompt-structure", "05_common-mistakes", "10_where-this-goes"]);

function extractBrief(md) {
  const start = md.indexOf("## Brief");
  if (start < 0) throw new Error("no ## Brief section");
  let body = md.slice(start + "## Brief".length);
  // End at the Build heading (and the rule above it). A bare "---" alone is not
  // an end marker: example SKILL.md frontmatter inside a Brief uses it.
  const end = body.search(/\n---[ \t]*\n+## Build|\n## Build/);
  if (end >= 0) body = body.slice(0, end);
  return body.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function looksPre(text) {
  return text.includes("\n") || /^[|#]|^├|^└|.*\/$/.test(text) && text.length < 60;
}

function parseBrief(brief) {
  // Sections are separated by 2+ blank lines; paragraphs inside by one.
  const rawSections = brief.split(/\n[ \t]*\n[ \t]*\n+/).map((s) => s.trim()).filter(Boolean);
  const chunks = [];
  for (const raw of rawSections) {
    const paras = raw
      .split(/\n[ \t]*\n/)
      .map((p) => p.replace(/[ \t]+$/gm, "").trim())
      .filter(Boolean)
      .map((p) => ({ text: p, pre: p.includes("\n") }));
    if (!paras.length) continue;
    const first = paras[0];
    const isTitle = paras.length > 1 && !first.pre && first.text.length < 90 && !/[.:]$/.test(first.text.trim());
    const prev = chunks[chunks.length - 1];
    if (isTitle) {
      chunks.push({ title: first.text.trim(), paras: paras.slice(1) });
    } else if (prev && !/what you.?ll get/i.test(prev.title || "")) {
      prev.paras.push(...paras); // stray fragment — glue to previous section
    } else {
      // Never glue into the hook chunk — it gets stripped, and content would vanish.
      chunks.push({ title: null, paras });
    }
  }
  return chunks;
}

function firstSentence(text) {
  const m = text.match(/^.*?[.!?](?=\s|$)/s);
  return (m ? m[0] : text).replace(/\s+/g, " ").trim();
}

function buildLesson(row, index) {
  const md = readFileSync(join(curriculumDir, row.file.split("/").pop()), "utf8");
  const brief = extractBrief(md);
  let chunks = parseBrief(brief);

  // The opening "What You'll Get From This" block becomes the Phase A hook.
  let hook = "";
  if (chunks.length && /what you.?ll get/i.test(chunks[0].title || "")) {
    hook = firstSentence(chunks[0].paras.map((p) => p.text).join(" "));
    chunks = chunks.slice(1);
  } else if (chunks.length) {
    hook = firstSentence(chunks[0].paras[0].text);
  }

  return {
    slug: row.slug,
    name: row.name,
    section: SECTION_OF(index),
    spine: SECTION_OF(index),
    boundary: BOUNDARIES.has(row.slug),
    hash: createHash("sha256").update(brief).digest("hex").slice(0, 12),
    hook,
    chunks
  };
}

// ---------------------------------------------------------------------------
// Directive linting
// ---------------------------------------------------------------------------

const BANNED = /\b(certainly|absolutely|great question|i['’]d be happy to)\b/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;

function collectStrings(value, path, out) {
  if (typeof value === "string") out.push({ path, value });
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) collectStrings(value[k], `${path}.${k}`, out);
  }
}

function lintDirectives(lessons) {
  if (!existsSync(directivesFile)) {
    console.log("note: directives.js not found yet — skipping lint.");
    return [];
  }
  const code = readFileSync(directivesFile, "utf8");
  const FC = {};
  new Function("FC", code)(FC);
  const directives = FC.directives || {};
  const errors = [];
  const bySlug = Object.fromEntries(lessons.map((l) => [l.slug, l]));

  for (const lesson of lessons) {
    if (!directives[lesson.slug]) errors.push(`${lesson.slug}: no directives authored`);
  }
  for (const slug of Object.keys(directives)) {
    const d = directives[slug];
    const lesson = bySlug[slug];
    if (!lesson) { errors.push(`${slug}: directives exist but lesson is not in the routing table`); continue; }

    // Validate every chunk reference (intro, teach groups, per-step learn) is in range.
    const checkChunks = (indices, where) => {
      for (const ci of indices || []) {
        if (ci < 0 || ci >= lesson.chunks.length) {
          errors.push(`${slug}: ${where} references chunk ${ci} but the brief has ${lesson.chunks.length} chunks (curriculum may have changed — re-check groupings)`);
        }
      }
    };
    checkChunks(d.intro, "intro");
    for (const [gi, group] of (d.teach || []).entries()) checkChunks(group.chunks, `teach[${gi}]`);
    for (const [bi, step] of (d.build || []).entries()) checkChunks(step.learn, `build[${bi}].learn`);

    const strings = [];
    collectStrings(d, slug, strings);
    for (const s of strings) {
      if (BANNED.test(s.value)) errors.push(`${s.path}: banned persona phrase in "${s.value.slice(0, 60)}…"`);
      if (EMOJI.test(s.value)) errors.push(`${s.path}: emoji found (brand rule: no emoji)`);
    }

    // Paths that build inside the workspace must thread through ${ws}.
    for (const s of strings) {
      const key = s.path.split(".").pop().replace(/\[\d+\]$/, "");
      if (["path", "pathParent", "saveTo", "writeFile", "expectFolder"].includes(key) ||
          /artifacts\[\d+\]$/.test(s.path)) {
        if (!s.value.includes("${ws}")) {
          errors.push(`${s.path}: path "${s.value}" is missing \${ws} — hardcoded workspace names break user-chosen folders`);
        }
      }
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------

const rows = readRoutingTable();
if (rows.length !== 11) {
  console.error(`expected 11 lessons in CLAUDE.md routing table, found ${rows.length}`);
  process.exit(1);
}

const lessons = rows.map(buildLesson);

const header = `/* GENERATED by v2/tools/build-content.mjs — do not edit by hand.
   Source of truth: _tutor/curriculum/*.md (Brief sections) + CLAUDE.md routing table.
   Regenerate with: node v2/tools/build-content.mjs */\n\n`;

const payload = { lessons };
let js = header + "FC.content = " + JSON.stringify(payload, null, 2) + ";\n";
js += "\nFC.content.bySlug = {};\nFC.content.lessons.forEach(function (l) { FC.content.bySlug[l.slug] = l; });\n";
writeFileSync(outFile, js);

console.log(`content.js written: ${lessons.length} lessons`);
for (const l of lessons) {
  console.log(`  ${l.slug}: ${l.chunks.length} chunks, hook="${l.hook.slice(0, 60)}"`);
}

const errors = lintDirectives(lessons);
if (errors.length) {
  console.error("\nDIRECTIVE LINT FAILURES:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("directives lint: clean");
