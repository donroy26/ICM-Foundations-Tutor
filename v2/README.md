# Foundation Companion: Desktop (v2 addon)

Jake's Foundations course (Start Here plus lessons 1.1 to 3.3) as a browser game.
A simulated desktop (file explorer, text editor, and a scripted "Claude Code
(simulated)" window) walks you through the same curriculum the Claude Code tutor
teaches, tutorial-NPC style: guide popups prompt each click, files type themselves
in, self-checks follow each step, and levels unlock at the section boundaries.

The game plays the practice track, on Jake's own practice folders from the videos
(`practice/` in the repo; the game's copy is generated from those files): you
correct a chat, turn the corrections into a skill, give the skill a folder and one
agent (`client-email`), run the tiny test, design the messy `newsletter-mess`
folder, then split `weekly-report` into stages, script the steady part, and keep
it all from going stale.

Everything you build in the game maps 1:1 to real files. Download your workspace
as a zip at any time, drop it on your actual machine, and point the real Claude
Code at it.

## Play it

No install, no build step, no network calls:

- **Locally**: open `v2/index.html` in Chrome, Edge, or Firefox (double-click works — the app is `file://`-safe).
- **Hosted**: serve the `v2/` folder from any static host (GitHub Pages works as-is).

Progress autosaves in the browser (`localStorage`). Leave and come back — the
Continue button picks up mid-lesson. The menu (top right) has save export/import
as a backup, the workspace zip download, reduced motion, and restart.

## How it relates to the CLI tutor

This is a parallel track, not a replacement. The prose the guide teaches is
compiled verbatim from `_tutor/curriculum/*.md` — the curriculum stays the
single source of truth. Lesson slugs and the progress vocabulary mirror
`_tutor/progress.md`, and the game mirrors the five-phase Lesson Loop from
`_tutor/INSTRUCTIONS.md`: Open, Teach (with comprehension checks), Build
(one step at a time, inspected), Check-in (gating quiz), Close (section
boundaries after 1.2, 1.4 and 2.3, the same places the CLI tutor asks for a
fresh session).

One difference: the CLI tutor starts most people at 1.3 and uses two Claude Code
sessions (a tutor and a work session). The game has no real terminal, so it plays
every lesson in order, and the simulated Claude window stands in for the work
session.

## Editing content

- **Jake's prose** lives in `_tutor/curriculum/*.md`. After editing, regenerate:

  ```
  node v2/tools/build-content.mjs
  ```

  This rewrites `v2/js/data/content.js` and lints the game script — it fails
  loudly if a lesson's chunking shifted under existing references, if any copy
  uses a banned persona phrase or emoji, or if a path is missing `${ws}`
  (`my-skills/`, `setup-test/` and `practice/` live outside the workspace, as in
  the CLI tutor, and are allowed).

- **The game script** (build steps, quizzes, Claude-sim scripts, XP) is
  hand-authored in `v2/js/data/directives.js`, one entry per lesson.

- **The brand** lives entirely in `v2/css/theme.css` (Don's Bookshelf tokens).
  Swap the variables there to restyle everything.

## Architecture notes

Plain HTML/CSS/JS, no framework, no runtime dependencies. Classic `<script>`
tags on a single `window.FC` namespace — ES modules and `fetch()` are blocked
under `file://`, so all data ships as `.js` files. The zip download is a
dependency-free ZIP writer (STORE + CRC32). Sounds are WebAudio-synthesized —
no audio assets. The simulated Claude window is fully scripted and says so in
its title bar; it never pretends to be the real thing.

```
v2/
├── index.html            skeleton + script load order
├── css/theme.css         brand tokens (colors, fonts, motion) — edit to restyle
├── css/app.css           component styles
├── js/data/content.js    GENERATED from the curriculum — do not edit
├── js/data/directives.js hand-authored game script (per-lesson beats)
├── js/engine.js          lesson-loop state machine (Open→Teach→Build→Check-in→Close)
├── js/windows.js         desktop shell: explorer, editor, window management
├── js/claudesim.js       "Claude Code (simulated)": scripted chat + terminal
├── js/guide.js           tutorial popup + spotlight
├── js/quiz.js            multiple-choice gates + reflections
├── js/vfs.js             simulated file tree
├── js/state.js           autosave, save export/import
├── js/xp.js              XP, levels, achievements, toasts
├── js/audio.js           synthesized sounds + mute
├── js/zip.js             workspace zip download
├── js/main.js            boot + title screen + menu
├── tools/build-content.mjs   content compiler + persona linter
└── test/e2e.mjs          Playwright bot that plays the whole game
```

## Tests

The e2e bot plays Start Here and 1.1 fully under `file://`, checks reload-resume,
plays 1.2 and 1.3 (the Claude sim working in a folder), drives the practice
terminal in 3.2, verifies the zip with real `unzip`, then plays **every lesson end
to end** over `http://` and asserts the finale:

```
NODE_PATH=$(npm root -g) PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node v2/test/e2e.mjs
```

Any environment with Playwright works. To use an installed Chrome instead of a
downloaded Chromium (handy on Windows), set `PW_CHANNEL=chrome`.
