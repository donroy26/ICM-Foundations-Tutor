/* The engine: compiles a lesson (brief content + hand-authored directives) into
   an ordered list of beats and runs the five-phase Lesson Loop across them:
   A Open → B Teach → C Build → D Check-in → E Close. The cursor
   (lesson, beat index) lives in FC.state and survives reloads. */

FC.engine = (function () {
  var U = FC.util;

  var beats = [];
  var lesson = null;     // FC.content lesson record
  var directives = null; // FC.directives record
  var offs = [];         // active event unsubscribers for the current beat

  var CONTINUE_LABELS = ["Keep going", "Next", "With you so far", "Makes sense"];

  function data() { return FC.state.data; }
  function progress() { return data().progress; }

  // ---------------------------------------------------------------------------
  // Lesson compilation
  // ---------------------------------------------------------------------------

  function paginate(group) {
    // group.chunks = indices into lesson.chunks. Hard cap 3 paragraphs per page.
    var pages = [];
    group.chunks.forEach(function (ci) {
      var chunk = lesson.chunks[ci];
      if (!chunk) return;
      for (var i = 0; i < chunk.paras.length; i += 3) {
        pages.push({
          title: i === 0 ? chunk.title : null,
          paras: chunk.paras.slice(i, i + 3)
        });
      }
    });
    return pages;
  }

  // Teaching is woven into the doing: a short intro, then for each build step
  // the "here's why" (learn) is delivered right before the instruction, and its
  // comprehension check (optional, skippable) fires right after the action.
  function teachPages(chunkIndices, tail) {
    var pages = paginate({ chunks: chunkIndices || [] });
    return pages.map(function (page, i) {
      return { phase: "B", type: "teach-page", page: page, groupEnd: tail && i === pages.length - 1 };
    });
  }

  function emitTeachGroup(group) {
    teachPages(group.chunks, !group.clarifier).forEach(function (b) { beats.push(b); });
    // The old "gating clarifier" is now an optional, skippable self-check.
    if (group.clarifier) beats.push({ phase: "B", type: "check", quiz: group.clarifier });
  }

  function emitBuildStep(d) {
    if (d.learn && d.learn.length) teachPages(d.learn, false).forEach(function (b) { beats.push(b); });
    beats.push({ phase: "C", type: d.type, d: d });
    if (d.check) beats.push({ phase: "C", type: "check", quiz: d.check });
  }

  function compile(slug) {
    lesson = FC.content.bySlug[slug];
    directives = FC.directives[slug];
    beats = [{ phase: "A", type: "open" }];
    if (!lesson || !directives) { beats.push({ phase: "E", type: "close" }); return; }

    // Interleave teaching with doing: explain a concept, then act on it, then the
    // next concept, then the next action — instead of front-loading all the theory.
    // Zip the teach groups against the build steps in order.
    if (directives.intro && directives.intro.length) {
      teachPages(directives.intro, true).forEach(function (b) { beats.push(b); });
    }
    var groups = directives.teach || [];
    var steps = directives.build || [];
    var n = Math.max(groups.length, steps.length);
    for (var i = 0; i < n; i++) {
      if (groups[i]) emitTeachGroup(groups[i]);   // "here's why"
      if (steps[i]) emitBuildStep(steps[i]);       // "now do it"
    }

    beats.push({ phase: "D", type: "checkin" });
    beats.push({ phase: "E", type: "close" });
  }

  // ---------------------------------------------------------------------------
  // Cursor + flow
  // ---------------------------------------------------------------------------

  function cleanupBeat() {
    offs.forEach(function (off) { off(); });
    offs = [];
    FC.windows.explorer.disarm();
    FC.guide.clearSpot();
  }

  function listen(event, fn) { offs.push(U.on(event, fn)); }

  function advance() {
    cleanupBeat();
    progress().beat++;
    FC.state.persist(); // beat transitions save immediately — a reload must resume here
    runBeat();
  }

  function runBeat() {
    var beat = beats[progress().beat];
    renderHeader();
    U.emit("engine:render", {});
    if (!beat) { finishGame(); return; }
    progress().phase = beat.phase;
    FC.state.save();
    var handler = handlers[beat.type];
    if (!handler) {
      console.error("no handler for beat type " + beat.type + " — skipping");
      advance();
      return;
    }
    handler(beat);
  }

  function progressLabel(word) {
    // Lessons carry their course number in the name (1.3, 2.2), so use it.
    return lesson ? lesson.name + " · " + word : "";
  }

  function renderHeader() {
    var t = U.q("#lesson-title");
    if (!t || !lesson) return;
    U.clear(t);
    t.appendChild(U.el("span", { class: "spine-dot", style: "background: var(--spine-" + lesson.spine + ")" }));
    t.appendChild(document.createTextNode(lesson.name));
    FC.xp.renderHeader();
  }

  // ---------------------------------------------------------------------------
  // Small helpers used by handlers
  // ---------------------------------------------------------------------------

  function guideParts(d) {
    // Directive guide text: string or array of strings; ${ws} resolved.
    var texts = Array.isArray(d.guide) ? d.guide : [d.guide];
    var parts = texts.map(function (t) { return { t: "p", text: U.resolveText(t) }; });
    if (d.snippet) parts.push({ t: "pre", text: U.resolveText(d.snippet) });
    if (d.guideAfter) parts.push({ t: "p", text: U.resolveText(d.guideAfter) });
    return parts;
  }

  function dirname(path) {
    var i = path.lastIndexOf("/");
    return i < 0 ? "" : path.slice(0, i);
  }

  function basename(path) {
    return path.split("/").pop();
  }

  function beatXP(beat, fallback) {
    return (beat.d && beat.d.xp != null) ? beat.d.xp : fallback;
  }

  function completeBuildBeat(beat, label) {
    FC.audio.play("step");
    FC.xp.add(beatXP(beat, 10), label || "Step done");
    if (beat.d && beat.d.achievement) FC.xp.award(beat.d.achievement);
    advance();
  }

  // ---------------------------------------------------------------------------
  // Beat handlers
  // ---------------------------------------------------------------------------

  var handlers = {};

  // ---- Phase A: Open ----
  handlers["open"] = function () {
    var done = progress().lessons_completed.length;
    var greeting = done === 0
      ? "Welcome in. I'm the teaching assistant for Jake's Foundations course. I'll walk you through every lesson right here on this desktop: the three layers, building around your work, and automating it."
      : "Back at it. " + lesson.name + ".";
    FC.guide.show({
      progress: progressLabel("open"),
      parts: [
        { t: "p", text: greeting },
        { t: "p", text: "Here's what you'll get from this one: " + lesson.hook }
      ],
      buttons: [{ label: "Ready to start", primary: true, onClick: advance }]
    });
  };

  // ---- Phase B: Teach ----
  handlers["teach-page"] = function (beat) {
    var parts = [];
    if (beat.page.title) parts.push({ t: "title", text: beat.page.title });
    beat.page.paras.forEach(function (p) { parts.push({ t: p.pre ? "pre" : "p", text: p.text }); });
    var label = CONTINUE_LABELS[progress().beat % CONTINUE_LABELS.length];
    FC.guide.show({
      progress: progressLabel("reading"),
      parts: parts,
      buttons: [{ label: label, primary: true, onClick: function () {
        if (beat.groupEnd) FC.xp.add(5, "Read through");
        advance();
      } }]
    });
  };

  // Optional, non-gating self-check. Skipping never blocks; answering earns XP
  // and the "why" is always shown so it teaches rather than interrogates.
  handlers["check"] = function (beat) {
    FC.guide.hide();
    FC.quiz.ask({
      eyebrow: "Quick self-check — skip anytime",
      q: beat.quiz.q,
      options: beat.quiz.options,
      explain: beat.quiz.explain,
      spine: lesson.spine,
      skippable: true
    }, function (result) {
      if (!result.skipped) FC.xp.add(result.firstTry ? 10 : 5, result.firstTry ? "First try" : "Got there");
      advance();
    });
  };

  // ---- Phase C: Build ----

  handlers["note"] = function (beat) {
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(beat.d),
      buttons: [{ label: beat.d.button || "Done", primary: true, onClick: function () {
        completeBuildBeat(beat);
      } }]
    });
  };

  // An optional mini self-check in the middle of a build.
  handlers["quiz"] = function (beat) {
    FC.guide.hide();
    FC.quiz.ask({
      eyebrow: (beat.d.eyebrow || "Quick check") + " — skip anytime",
      q: beat.d.quiz.q,
      options: beat.d.quiz.options,
      explain: beat.d.quiz.explain,
      spine: lesson.spine,
      skippable: true
    }, function (result) {
      if (!result.skipped) {
        FC.xp.add(result.firstTry ? 10 : 5, result.firstTry ? "First try" : "Got there");
        if (beat.d.achievement) FC.xp.award(beat.d.achievement);
      }
      advance();
    });
  };

  handlers["create-folder"] = function (beat) {
    var d = beat.d;
    var parent = U.resolvePath(d.parent || "");
    var isChoice = d.name === "player-choice";
    var fixedName = isChoice ? null : d.name;

    // Already there (resume, or replay) — move on quietly.
    if (!isChoice && FC.vfs.exists(parent ? parent + "/" + fixedName : fixedName)) { advance(); return; }
    if (isChoice && d.storeAs === "workspaceName" && data().player.workspaceName &&
        FC.vfs.exists(data().player.workspaceName)) { advance(); return; }

    FC.windows.show("explorer");
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      spotlight: "#btn-new-folder"
    });

    FC.windows.explorer.arm({
      kind: "folder",
      parent: parent,
      placeholder: isChoice ? "your-folder-name" : fixedName,
      validate: function (name) {
        var full = parent ? parent + "/" + name : name;
        if (!isChoice && name.toLowerCase() !== fixedName.toLowerCase()) {
          return { ok: false, reason: "This one needs to be called exactly " + fixedName + " — that's the name the lesson builds on." };
        }
        if (!isChoice && name !== fixedName) {
          return { ok: false, reason: "Close — match the capitalization exactly: " + fixedName };
        }
        if (FC.vfs.exists(full)) return { ok: false, reason: "Something with that name is already there." };
        return { ok: true };
      },
      onDone: function (name) {
        function finalize(finalName) {
          FC.windows.explorer.disarm();
          FC.vfs.mkdir(parent ? parent + "/" + finalName : finalName);
          if (d.storeAs === "workspaceName") data().player.workspaceName = finalName;
          else if (d.storeAs) data().player.chosenNames[d.storeAs] = finalName;
          FC.state.save();
          completeBuildBeat(beat, "Folder created");
        }
        if (isChoice && (/\s/.test(name) || /[A-Z]/.test(name))) {
          FC.guide.show({
            progress: progressLabel("building"),
            parts: [{ t: "p", text: "“" + name + "” works. Lowercase with dashes is the convention — my-blog, client-work. Your call." }],
            buttons: [
              { label: "Keep it", primary: true, onClick: function () { finalize(name); } },
              { label: "Rename", onClick: function () { runBeat(); } }
            ]
          });
        } else {
          finalize(name);
        }
      }
    });
  };

  handlers["create-file"] = function (beat) {
    var d = beat.d;
    var isChoice = d.name === "player-choice";
    var parent = U.resolvePath(isChoice ? d.pathParent : dirname(d.path));
    var fixedName = isChoice ? null : basename(d.path);

    function startTyping(path) {
      FC.guide.hide();
      FC.windows.editor.typeIn({
        path: path,
        content: U.resolveText(d.typedContent),
        fillFields: d.fillFields || [],
        mode: "replace",
        onSaved: function () {
          completeBuildBeat(beat, "File saved");
        }
      });
    }

    // Resume midway: file node exists (or was fully saved) — go straight to the editor.
    if (!isChoice) {
      var existingPath = U.resolvePath(d.path);
      if (FC.vfs.exists(existingPath)) {
        var content = FC.vfs.readFile(existingPath);
        if (content && content.length && (!d.fillFields || d.fillFields.every(function (f) {
          return content.indexOf("[" + f + "]") < 0;
        }))) { advance(); return; } // already completed
        startTyping(existingPath);
        return;
      }
    } else if (d.storeAs && data().player.chosenNames[d.storeAs]) {
      var chosenPath = parent + "/" + data().player.chosenNames[d.storeAs];
      if (FC.vfs.exists(chosenPath) && FC.vfs.readFile(chosenPath)) { advance(); return; }
    }

    // Make sure the parent folder is visible so the inline input has a home.
    if (parent && !FC.vfs.exists(parent)) FC.vfs.mkdir(parent);

    FC.windows.show("explorer");
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      spotlight: "#btn-new-file"
    });

    FC.windows.explorer.arm({
      kind: "file",
      parent: parent,
      placeholder: isChoice ? "file-name.md" : fixedName,
      validate: function (name) {
        if (!isChoice) {
          if (name.toLowerCase() !== fixedName.toLowerCase()) {
            return { ok: false, reason: "Call it exactly " + fixedName + " — Claude looks for that name." };
          }
          if (name !== fixedName) {
            return { ok: false, reason: "Almost — capitalization matters here. It's " + fixedName };
          }
        }
        return { ok: true };
      },
      onDone: function (name) {
        FC.windows.explorer.disarm();
        var finalName = name;
        if (isChoice && finalName.indexOf(".") < 0) finalName += ".md";
        if (isChoice && d.storeAs) {
          data().player.chosenNames[d.storeAs] = finalName;
          FC.state.save();
        }
        var path = parent ? parent + "/" + finalName : finalName;
        FC.vfs.writeFile(path, "");
        startTyping(path);
      }
    });
  };

  handlers["edit-file"] = function (beat) {
    var d = beat.d;
    var path = U.resolvePath(d.path);
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      buttons: [{ label: d.button || "Open " + basename(path), primary: true, onClick: function () {
        FC.guide.hide();
        FC.windows.editor.typeIn({
          path: path,
          content: U.resolveText(d.typedContent),
          fillFields: d.fillFields || [],
          mode: d.mode || "append",
          onSaved: function () { completeBuildBeat(beat, "File updated"); }
        });
      } }]
    });
  };

  handlers["open-file"] = function (beat) {
    var d = beat.d;
    var path = U.resolvePath(d.path);
    FC.windows.show("explorer");
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      spotlight: '.tree-row[data-path="' + path + '"]'
    });
    listen("explorer:file-opened", function (info) {
      if (info.path === path) completeBuildBeat(beat, "Checked your work");
    });
  };

  handlers["seed-files"] = function (beat) {
    var d = beat.d;
    (d.files || []).forEach(function (f) {
      var p = U.resolvePath(f.path);
      if (!FC.vfs.exists(p)) FC.vfs.writeFile(p, U.resolveText(f.content));
    });
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      buttons: [{ label: d.button || "Got them", primary: true, onClick: function () {
        completeBuildBeat(beat, "Files in place");
      } }]
    });
  };

  handlers["picker"] = function (beat) {
    var d = beat.d;
    FC.guide.hide();
    function askOne(spec, done) {
      FC.quiz.pick({ eyebrow: d.eyebrow || "Your setup", q: spec.q, options: spec.options, spine: lesson.spine }, done);
    }
    askOne(d, function (value) {
      var opt = null;
      d.options.forEach(function (o) { if ((o.value !== undefined ? o.value : o.t) === value) opt = o; });
      if (d.storeAs) data().player.chosenNames[d.storeAs] = value;
      FC.state.save();
      if (opt && opt.followUp) {
        askOne(opt.followUp, function (v2) {
          if (opt.followUp.storeAs) data().player.chosenNames[opt.followUp.storeAs] = v2;
          FC.state.save();
          completeBuildBeat(beat);
        });
      } else {
        if (d.defaultFor) {
          // e.g. Mac needs no architecture answer — record the default.
          Object.keys(d.defaultFor).forEach(function (k) {
            if (!data().player.chosenNames[k]) data().player.chosenNames[k] = d.defaultFor[k];
          });
          FC.state.save();
        }
        completeBuildBeat(beat);
      }
    });
  };

  handlers["claude-open"] = function (beat) {
    var d = beat.d;
    var wantFolder = d.expectFolder ? U.resolvePath(d.expectFolder) : null;

    function afterOpen() {
      FC.claudesim.setMode(d.mode || "chat");
      if (d.mode === "terminal") { completeBuildBeat(beat, "Terminal ready"); return; }
      if (!wantFolder) { completeBuildBeat(beat, "Claude window open"); return; }
      FC.claudesim.refreshFolders();
      var sel = U.q("#claude-folder");
      if (sel && sel.value === wantFolder) { completeBuildBeat(beat, "Folder connected"); return; }
      FC.guide.show({
        progress: progressLabel("building"),
        parts: [{ t: "p", text: U.resolveText(d.folderPrompt || "Point it at your workspace — the folder selector at the top of the Claude window.") }],
        spotlight: "#claude-folder"
      });
      listen("claude:folder-selected", function (info) {
        if (info.path === wantFolder) completeBuildBeat(beat, "Folder connected");
        else FC.claudesim.addSystem("that folder works, but the lesson uses " + wantFolder + "/ — switch over.");
      });
    }

    if (FC.windows.isOpen("claude")) { afterOpen(); return; }
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      spotlight: "#task-claude"
    });
    listen("window:opened", function (info) {
      if (info.id === "claude") afterOpen();
    });
  };

  handlers["claude-chat"] = function (beat) {
    var d = beat.d;
    FC.windows.show("claude");
    var item = d.script[0];
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      onShown: function () {
        FC.claudesim.runScript({
          suggestedPrompt: item.suggestedPrompt ? U.resolveText(item.suggestedPrompt) : null,
          acceptIf: item.acceptIf,
          rejectHint: item.rejectHint,
          reply: item.reply,
          onAccepted: function () {
            completeBuildBeat(beat, "Task ran");
          }
        });
      }
    });
  };

  handlers["claude-term"] = function (beat) {
    var d = beat.d;
    FC.windows.show("claude");
    FC.guide.show({
      progress: progressLabel("building"),
      parts: guideParts(d),
      onShown: function () {
        FC.claudesim.expectCommand({
          command: d.command,
          output: d.output.map(U.resolveText),
          onDone: function () { completeBuildBeat(beat, "Command ran"); }
        });
      }
    });
  };

  handlers["reflect"] = function (beat) {
    var d = beat.d;
    FC.guide.hide();
    FC.quiz.reflect({
      eyebrow: d.eyebrow || "Make it yours",
      prompt: U.resolveText(d.prompt),
      spine: lesson.spine,
      optional: d.optional !== false
    }, function (text) {
      if (text && d.saveTo) {
        FC.vfs.writeFile(U.resolvePath(d.saveTo), text + "\n");
      }
      completeBuildBeat(beat, text ? "Noted" : undefined);
    });
  };

  // ---- Phase D: Check-in ----
  handlers["checkin"] = function (beat) {
    var ci = directives.checkin;
    var artifacts = (ci.artifacts || []).map(U.resolvePath);
    var missing = artifacts.filter(function (p) { return !FC.vfs.readFile(p); });
    if (missing.length) {
      // Only reachable with a hand-edited save; send the player back into the build.
      FC.guide.say(
        "Hold on — I checked your workspace and " + missing[0] + " isn't there yet. Let's rebuild it.",
        "Go back",
        function () {
          progress().beat = beats.findIndex(function (b) { return b.phase === "C"; });
          FC.state.save();
          runBeat();
        }
      );
      return;
    }

    // The real gate is the artifact (built above). The quiz is an optional
    // self-check — answer it for XP, or skip it and still complete the lesson.
    function askGate(quiz, eyebrow, next) {
      FC.quiz.ask({
        eyebrow: eyebrow,
        q: quiz.q,
        options: quiz.options,
        explain: quiz.explain,
        spine: lesson.spine,
        skippable: true
      }, next);
    }

    FC.guide.hide();
    askGate(ci.quiz, "Check-in — skip anytime", function (result) {
      if (!result.skipped) FC.xp.add(result.firstTry ? 25 : 15, "Check-in passed");

      function afterGates(answerText) {
        if (ci.quiz2) {
          askGate(ci.quiz2, "Check-in — part two", function (r2) {
            if (!r2.skipped) FC.xp.add(r2.firstTry ? 25 : 15, "Final gate passed");
            finishInner(answerText);
          });
        } else {
          finishInner(answerText);
        }
      }

      function finishInner(answerText) {
        FC.state.recordLessonComplete(lesson.slug, artifacts, ci.quiz.q, answerText);
        FC.xp.add(directives.xpLessonComplete || 50, lesson.name + " complete");
        advance();
      }

      if (ci.reflect) {
        FC.quiz.reflect({
          eyebrow: "One more thing — in your own words",
          prompt: U.resolveText(ci.reflect.prompt),
          spine: lesson.spine,
          optional: true
        }, function (text) {
          if (text && ci.reflect.saveTo) FC.vfs.writeFile(U.resolvePath(ci.reflect.saveTo), text + "\n");
          afterGates(text);
        });
      } else {
        afterGates(null);
      }
    });
  };

  // ---- Phase E: Close ----
  var LEVEL_AFTER = { "1-2_skills": 2, "1-4_pick-your-setup": 3, "2-3_one-model-different-jobs": 4, "3-3_keep-it-useful": 5 };
  var FINAL_LESSON = "3-3_keep-it-useful";

  handlers["close"] = function () {
    var slug = lesson.slug;
    var idx = FC.content.lessons.indexOf(lesson);
    var next = FC.content.lessons[idx + 1];

    if (slug === FINAL_LESSON) { finishGame(); return; }

    if (lesson.boundary) {
      if (data().quizStats.sectionClean) FC.xp.award("clean-sweep");
      data().quizStats.sectionClean = true;
      FC.xp.setLevel(LEVEL_AFTER[slug]);
      FC.audio.play("levelup");
      showLevelScreen(next);
    } else {
      FC.guide.show({
        progress: progressLabel("done"),
        parts: [
          { t: "p", text: lesson.name + " is done and your work checked out." },
          { t: "p", text: "Next up is " + next.name + ". Whenever you're ready, say go." }
        ],
        buttons: [
          { label: "Download my files", onClick: function () { FC.zip.downloadWorkspace(); } },
          { label: "Go", primary: true, onClick: function () { startLesson(next.slug); } }
        ]
      });
    }
  };

  function showLevelScreen(next) {
    var screen = U.q("#level-screen");
    var card = U.q("#level-card");
    U.clear(card);

    var books = U.el("div", { class: "level-books" });
    for (var i = 1; i <= 5; i++) {
      var s = U.el("span", { style: "background: var(--spine-" + i + ")" });
      if (i < FC.xp.levelInfo().level) s.classList.add("earned");
      books.appendChild(s);
    }
    setTimeout(function () {
      var spans = U.qa("span", books);
      var target = spans[FC.xp.levelInfo().level - 2];
      if (target) target.classList.add("earned");
    }, 500);

    card.appendChild(books);
    card.appendChild(U.el("h1", { text: "Level " + FC.xp.levelInfo().level + " — " + FC.xp.levelInfo().name }));
    card.appendChild(U.el("div", { class: "sub", text: lesson.name + " closes this section. In the real Claude Code you'd open a fresh session here: a clean desk, no leftovers. In the game: take a breath. Your desktop reloads clean when you come back." }));
    card.appendChild(U.el("div", { class: "actions" }, [
      U.el("button", { onclick: function () { FC.zip.downloadWorkspace(); } }, [U.icon("download", "icon-sm"), U.el("span", { text: " Download workspace so far" })]),
      U.el("button", { class: "btn-primary", text: "On to " + next.name, onclick: function () {
        screen.classList.remove("show");
        startLesson(next.slug);
      } })
    ]));
    card.appendChild(U.el("div", { class: "fineprint", text: "Progress saved. You can close this tab and pick up right here." }));
    screen.classList.add("show");
  }

  function finishGame() {
    progress().current_lesson = "complete";
    FC.xp.setLevel(5);
    FC.xp.award("foundation-complete");
    FC.state.persist();
    FC.audio.play("levelup");

    var screen = U.q("#level-screen");
    var card = U.q("#level-card");
    U.clear(card);
    var books = U.el("div", { class: "level-books" });
    for (var i = 1; i <= 5; i++) {
      books.appendChild(U.el("span", { class: "earned", style: "background: var(--spine-" + i + ")" }));
    }
    card.appendChild(books);
    card.appendChild(U.el("h1", { text: "Foundations is yours" }));
    card.appendChild(U.el("div", { class: "sub", text: "Every lesson. " + data().xp.total + " xp. A workspace built with your own hands. Download it, drop it on your real machine, and point the real Claude Code at it. That's the actual next step." }));
    card.appendChild(U.el("div", { class: "actions" }, [
      U.el("button", { class: "btn-primary", onclick: function () { FC.zip.downloadWorkspace(); } }, [U.icon("download", "icon-sm"), U.el("span", { text: " Download my workspace" })]),
      U.el("button", { text: "Start over", onclick: function () {
        if (confirm("Wipe this save and start a fresh run?")) { FC.state.reset(); location.reload(); }
      } })
    ]));
    card.appendChild(U.el("div", { class: "fineprint", text: "Happy learning." }));
    screen.classList.add("show");
  }

  // ---------------------------------------------------------------------------
  // Entry points
  // ---------------------------------------------------------------------------

  function startLesson(slug) {
    cleanupBeat();
    FC.quiz.closeAll();
    FC.guide.hide();
    progress().current_lesson = slug;
    progress().phase = "A";
    progress().beat = 0;
    FC.state.persist();
    compile(slug);
    runBeat();
  }

  function start() {
    var slug = progress().current_lesson;
    if (slug === "complete") {
      lesson = FC.content.lessons[FC.content.lessons.length - 1];
      finishGame();
      return;
    }
    compile(slug);
    if (progress().beat >= beats.length) progress().beat = 0;
    renderHeader();
    runBeat();
  }

  return { start: start, startLesson: startLesson, _beats: function () { return beats; } };
})();
