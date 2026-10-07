/* Game state: single source of truth, autosaved to localStorage, exportable as a
   JSON save file. Progress vocabulary mirrors _tutor/progress.md (lesson slugs,
   lessons_completed) so the game and the CLI tutor speak the same language. */

FC.state = (function () {
  var U = FC.util;
  var KEY = "fc-v2-save";
  var VERSION = 1;

  var storageOk = true;
  var memoryFallback = null;

  function freshData() {
    return {
      version: VERSION,
      startedAt: new Date().toISOString(),
      player: {
        workspaceName: null,
        chosenNames: {}
      },
      progress: {
        current_lesson: "0-0_start-here",
        phase: "A",
        beat: 0,
        lessons_completed: []
      },
      vfs: null,
      xp: { total: 0, level: 1 },
      achievements: [],
      quizStats: { firstTryCorrect: 0, attempts: 0, sectionClean: true },
      settings: { muted: false, reducedMotion: false },
      savedAt: null
    };
  }

  var api = { data: freshData() };

  function persist() {
    api.data.vfs = FC.vfs.serialize();
    api.data.savedAt = new Date().toISOString();
    var json = JSON.stringify(api.data);
    memoryFallback = json;
    if (!storageOk) return;
    try {
      localStorage.setItem(KEY, json);
    } catch (e) {
      storageOk = false;
      U.emit("state:storage-broken", e);
    }
  }

  var save = U.debounce(persist, 400);

  // Never lose a debounced write on tab close/reload.
  window.addEventListener("beforeunload", function () {
    try { persist(); } catch (e) { /* closing anyway */ }
  });

  function hasSave() {
    try {
      return !!localStorage.getItem(KEY);
    } catch (e) {
      return !!memoryFallback;
    }
  }

  function loadRaw() {
    try {
      return localStorage.getItem(KEY) || memoryFallback;
    } catch (e) {
      storageOk = false;
      return memoryFallback;
    }
  }

  function migrate(data) {
    // Room for future save-format migrations, gated on data.version.
    return data;
  }

  function validate(data) {
    return data && typeof data === "object" &&
      data.progress && typeof data.progress.current_lesson === "string" &&
      data.player && data.xp;
  }

  function load() {
    var raw = loadRaw();
    if (!raw) return false;
    try {
      var data = migrate(JSON.parse(raw));
      if (!validate(data)) return false;
      api.data = data;
      FC.vfs.load(data.vfs);
      return true;
    } catch (e) {
      console.error("could not load save", e);
      return false;
    }
  }

  function reset() {
    api.data = freshData();
    FC.vfs.reset();
    try { localStorage.removeItem(KEY); } catch (e) { /* fine */ }
    memoryFallback = null;
  }

  function exportSave() {
    persist();
    var blob = new Blob([JSON.stringify(api.data, null, 2)], { type: "application/json" });
    U.download("foundation-companion-save.json", blob);
  }

  function importSave(text) {
    try {
      var data = migrate(JSON.parse(text));
      if (!validate(data)) return { ok: false, reason: "That file doesn't look like a Foundation Companion save." };
      api.data = data;
      FC.vfs.load(data.vfs);
      persist();
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: "Couldn't read that file as a save." };
    }
  }

  // Record a completed lesson the same way the CLI tutor records it.
  function recordLessonComplete(slug, artifacts, question, answer) {
    api.data.progress.lessons_completed.push({
      lesson: slug,
      completed_at: new Date().toISOString(),
      artifacts_inspected: artifacts,
      comprehension: { question: question, answer: answer || "(answered via quiz)", pass: true }
    });
    persist();
  }

  function storageBroken() { return !storageOk; }

  api.save = save;
  api.persist = persist;
  api.hasSave = hasSave;
  api.load = load;
  api.reset = reset;
  api.exportSave = exportSave;
  api.importSave = importSave;
  api.recordLessonComplete = recordLessonComplete;
  api.storageBroken = storageBroken;
  return api;
})();
