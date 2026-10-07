/* XP, levels, achievements. Pure listener on engine events — no game logic here.
   Levels are fixed at the curriculum's section boundaries, not XP thresholds. */

FC.xp = (function () {
  var U = FC.util;

  var LEVELS = [
    { level: 1, name: "Getting started" },
    { level: 2, name: "Skill writer" },        // after 1.2, the chat layers
    { level: 3, name: "Folder builder" },      // after 1.4, end of module 1
    { level: 4, name: "Architect" },           // after 2.3, end of module 2
    { level: 5, name: "Foundations complete" } // after 3.3
  ];

  var ACHIEVEMENTS = {
    "first-corrections": { title: "Every correction is a decision", sub: "Your corrections from a real chat, written down." },
    "first-skill": { title: "First skill", sub: "Your corrections, written down once as a SKILL.md." },
    "workspace-named": { title: "First folder", sub: "A workspace for one agent to work in." },
    "first-route": { title: "On the map", sub: "Your first routing row: read, skip, use, save." },
    "check-my-email": { title: "Three words", sub: "One short sentence reached the whole folder." },
    "tiny-test": { title: "Setup works", sub: "You opened, read and could change the result yourself." },
    "outcome-first": { title: "Sixty, thirty, ten", sub: "The outcome before the AI." },
    "routed": { title: "Routed", sub: "A short map with a row for every job." },
    "staged": { title: "Stages", sub: "Every stage leaves one file you can open." },
    "stepped-in": { title: "Stepped in", sub: "Your judgment, landed early, carried through." },
    "scripted": { title: "Steady parts", sub: "A step that comes out the same, turned into code." },
    "archived": { title: "Out of the swamp", sub: "Retired work, never read it." },
    "clean-sweep": { title: "Clean sweep", sub: "Every quiz in a section, first try." },
    "packed-up": { title: "Packed up", sub: "You downloaded your workspace as real files." },
    "foundation-complete": { title: "Foundations", sub: "Every lesson. The system is yours." }
  };

  function data() { return FC.state.data; }

  function add(amount, label) {
    if (!amount) return;
    data().xp.total += amount;
    FC.state.save();
    U.emit("xp:changed", { total: data().xp.total, delta: amount, label: label });
    toastXP(amount, label);
  }

  function setLevel(n) {
    if (data().xp.level >= n) return;
    data().xp.level = n;
    FC.state.save();
    U.emit("xp:level", levelInfo());
  }

  function levelInfo() {
    var lv = data().xp.level;
    var def = LEVELS[Math.min(lv, LEVELS.length) - 1];
    return { level: lv, name: def.name };
  }

  function award(id) {
    if (!ACHIEVEMENTS[id]) return;
    if (data().achievements.indexOf(id) >= 0) return;
    data().achievements.push(id);
    FC.state.save();
    FC.audio.play("achievement");
    toastAchievement(ACHIEVEMENTS[id]);
    U.emit("xp:achievement", { id: id });
  }

  // ---- toasts ---------------------------------------------------------------
  var toastRoot = null;
  function ensureRoot() {
    if (!toastRoot) toastRoot = U.q("#toasts");
    return toastRoot;
  }

  function toast(children, ms) {
    var rootEl = ensureRoot();
    if (!rootEl) return;
    var t = U.el("div", { class: "toast" }, children);
    rootEl.appendChild(t);
    setTimeout(function () { t.classList.add("fade"); }, ms || 3200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, (ms || 3200) + 500);
  }

  function spineColor() {
    var l = FC.content && FC.content.bySlug[data().progress.current_lesson];
    var idx = l ? l.spine : 1;
    return "var(--spine-" + idx + ")";
  }

  function toastXP(amount, label) {
    toast([
      U.el("div", { class: "toast-spine", style: "background:" + spineColor() }),
      U.el("div", {}, [
        U.el("div", { class: "toast-title", text: label || "Nice work" })
      ]),
      U.el("div", { class: "toast-xp", text: "+" + amount + " xp" })
    ], 2400);
  }

  function toastAchievement(a) {
    toast([
      U.icon("star"),
      U.el("div", {}, [
        U.el("div", { class: "toast-title", text: a.title }),
        U.el("div", { class: "toast-sub", text: a.sub })
      ])
    ], 4200);
  }

  // ---- header strip ---------------------------------------------------------
  function renderHeader() {
    var num = U.q("#xp-num"), fill = U.q("#xp-fill"), lvl = U.q("#xp-level");
    if (!num) return;
    num.textContent = data().xp.total;
    lvl.textContent = "Level " + data().xp.level + " — " + levelInfo().name;
    // Bar shows progress through every lesson.
    var done = data().progress.lessons_completed.length;
    var total = (FC.content && FC.content.lessons.length) || 11;
    fill.style.width = Math.round((done / total) * 100) + "%";
  }

  U.on("xp:changed", renderHeader);
  U.on("xp:level", renderHeader);
  U.on("engine:render", renderHeader);

  return {
    add: add, award: award, setLevel: setLevel, levelInfo: levelInfo,
    renderHeader: renderHeader, ACHIEVEMENTS: ACHIEVEMENTS
  };
})();
