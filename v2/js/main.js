/* Boot: wire the chrome (icons, menu, mute), show the title screen, then hand
   off to the engine — fresh game or resume from the autosave. */

(function () {
  var U = FC.util;

  function setMuteIcon() {
    var btn = U.q("#btn-mute");
    U.clear(btn);
    btn.appendChild(U.icon(FC.audio.muted() ? "volume-x" : "volume-2", "icon-sm"));
  }

  function buildChrome() {
    // toolbar + taskbar icons
    var nf = U.q("#btn-new-folder");
    nf.appendChild(U.icon("folder-plus", "icon-sm"));
    nf.appendChild(U.el("span", { text: "New folder" }));
    var nfi = U.q("#btn-new-file");
    nfi.appendChild(U.icon("file-plus", "icon-sm"));
    nfi.appendChild(U.el("span", { text: "New file" }));

    U.q("#claude-send").appendChild(U.icon("send", "icon-sm"));
    U.qa(".win-min").forEach(function (b) { b.appendChild(U.icon("minus", "icon-sm")); });
    U.q("#btn-menu").appendChild(U.icon("menu", "icon-sm"));
    setMuteIcon();

    U.q("#btn-mute").addEventListener("click", function () {
      FC.audio.toggleMute();
      setMuteIcon();
    });

    // menu
    var menu = U.q("#menu-pop");
    function item(iconName, label, onClick) {
      var b = U.el("button", {}, [U.icon(iconName, "icon-sm"), U.el("span", { text: label })]);
      b.addEventListener("click", function () { menu.classList.remove("open"); onClick(); });
      return b;
    }
    menu.appendChild(item("download", "Download workspace (zip)", function () { FC.zip.downloadWorkspace(); }));
    menu.appendChild(U.el("div", { class: "menu-sep" }));
    menu.appendChild(item("download", "Export save file", function () { FC.state.exportSave(); }));
    menu.appendChild(item("upload", "Import save file", function () { U.q("#import-file").click(); }));
    menu.appendChild(U.el("div", { class: "menu-sep" }));
    menu.appendChild(item("play", "Reduce motion on/off", function () {
      var on = document.body.classList.toggle("reduced-motion");
      FC.state.data.settings.reducedMotion = on;
      FC.state.save();
    }));
    menu.appendChild(item("rotate-ccw", "Restart from scratch", function () {
      if (confirm("Wipe this save and start over from the beginning?")) {
        FC.state.reset();
        location.reload();
      }
    }));

    U.q("#btn-menu").addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) menu.classList.remove("open");
    });

    U.q("#import-file").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var res = FC.state.importSave(String(reader.result));
        if (res.ok) location.reload();
        else alert(res.reason);
      };
      reader.readAsText(file);
    });

    U.on("state:storage-broken", function () {
      U.q("#save-note").textContent = "browser storage unavailable — use Export save from the menu";
    });
    if (FC.state.storageBroken()) {
      U.q("#save-note").textContent = "browser storage unavailable — use Export save from the menu";
    } else {
      U.q("#save-note").textContent = "progress saves automatically";
    }
  }

  function begin(resumed) {
    U.q("#title-screen").classList.remove("show");
    if (FC.state.data.settings.reducedMotion) document.body.classList.add("reduced-motion");
    setMuteIcon();
    FC.xp.renderHeader();
    FC.windows.explorer.render();
    FC.claudesim.refreshFolders();
    if (resumed && FC.state.data.progress.phase === "C") {
      // Coming back mid-build: the beat re-arms itself, but say hello first.
      FC.engine.start();
    } else {
      FC.engine.start();
    }
  }

  function showTitle() {
    var actions = U.q("#title-actions");
    U.clear(actions);
    var has = FC.state.hasSave();
    if (has && FC.state.load()) {
      var done = FC.state.data.progress.lessons_completed.length;
      actions.appendChild(U.el("button", { class: "btn-primary", text: "Continue — " + done + " of 11 lessons done", onclick: function () {
        begin(true);
      } }));
      actions.appendChild(U.el("button", { text: "New game", onclick: function () {
        if (confirm("Start over? Your current save gets wiped.")) {
          FC.state.reset();
          location.reload();
        }
      } }));
    } else {
      actions.appendChild(U.el("button", { class: "btn-primary", text: "Start", onclick: function () {
        begin(false);
      } }));
    }
    U.q("#title-screen").classList.add("show");
  }

  // Debug hooks for tests — only with ?debug=1.
  function installDebug() {
    if (!/[?&]debug=1/.test(location.search)) return;
    document.body.classList.add("reduced-motion"); // instant animations for tests
    FC.debug = {
      skipTo: function (slug) {
        var d = FC.state.data;
        // Seed the minimum earlier lessons would have left behind.
        if (!FC.vfs.exists("my-skills/corrections.md")) {
          FC.vfs.writeFile("my-skills/corrections.md", "# Corrections\n\nJob: reply to client emails\n\n- Too formal  (voice)\n");
          FC.vfs.writeFile("my-skills/how-i-reply/SKILL.md", "---\nname: how-i-reply\ndescription: Use when replying to client emails.\n---\n# How I reply\n1. Keep it short.\n");
        }
        if (!d.player.workspaceName) {
          d.player.workspaceName = "client-email";
          FC.vfs.mkdir("client-email");
          FC.vfs.writeFile("client-email/CLAUDE.md", "# client-email\n\nTest map.\n");
          FC.vfs.writeFile("client-email/exports/bookings-2026-10-06.csv", "booking_id,client,session,date,status,attendees,price\nB-1044,Kettle & Co,Full day,2026-10-22,pending,6,2000\n");
          FC.vfs.writeFile("client-email/outcome.md", "# Outcome\n\nTest outcome.\n");
        }
        U.q("#title-screen").classList.remove("show");
        U.q("#level-screen").classList.remove("show");
        FC.engine.startLesson(slug);
      },
      state: FC.state,
      vfs: FC.vfs,
      engine: FC.engine
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    FC.windows.init();
    FC.claudesim.init();
    installDebug();
    showTitle();
  });
})();
