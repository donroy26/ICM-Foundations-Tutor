# 1.4 Pick Your Setup

<!-- Source: 2026-10 Foundations/06_1.4_Pick_Your_Setup.md + full-course video transcript 24:38-27:56 -->

## Brief

What You'll Get From This

The four pieces of any AI setup, what each option really costs you, and one tiny job that proves your setup works.

You need: whatever you've already got. This one's all about choosing.



A hundred ways to run AI

There are about a hundred ways to run AI right now, and every week somebody online tells you the one you're using is wrong. Most setups are fine, and your folders come with you to most of them. Knowing which piece does what tells you when switching actually buys you something.



The four pieces

The model: the brain.

The harness: the app around it, what lets it open files and run things.

The interface: the window you work in. A chat box, a terminal, an editor.

Where it runs: someone's cloud, your own computer, or a bit of both.



The menu

The Claude app is the easiest start: Chat for talking, and Code when you want it working in your folders, which is what 1.3 used.

Claude Code also runs in a terminal or right inside an editor like VS Code. Same brain, same harness, a different window with more control.

On the ChatGPT side, Codex does the same job. Cursor is an editor with AI built right in. And you can even run an open model on your own computer with something like Ollama.



Two choices people mix up

Working on your files locally, and running the model locally, are two separate choices.

Everything in 1.3 used files on your computer with the model in the cloud. A local model keeps everything on your machine, which is great for privacy or working offline, and you'll usually trade some quality and need a beefy computer.



Count the whole cost

The subscription is the part everybody looks at. Then there's the setup time, keeping it running, checking its work, and waiting on it. A cheaper tool that eats your whole Saturday costs you a Saturday.

Jake is pretty loud online about not needing fancy setups, and for most people that's true. Jake also built a custom pipeline for the psychometrics research, and that's when a custom setup earns it: when you need something none of the apps do, at a scale they can't handle.



Pick by need

New to this: the Claude app.

You live in code: Claude Code or Codex inside your editor.

Your company's on Microsoft or Google: check what's already in there before you buy anything.

Privacy is the whole point: a local model.



Setup steps (checked 6 October 2026)

These change constantly. If a step here doesn't match your screen, the linked official page wins.

Claude desktop app: tabs for Chat, Cowork and Code. Code needs Pro, Max, Team or Enterprise. In Code: Local, then select your folder.

Claude Code in a terminal or editor. macOS: curl -fsSL https://claude.ai/install.sh | bash. Windows (PowerShell): irm https://claude.ai/install.ps1 | iex. No Node needed. Pro plan and up. There's a VS Code extension, which also works in Cursor. It reads CLAUDE.md.

Codex: in the ChatGPT desktop app (pick Codex from the dropdown), plus a CLI, an editor extension and the web. It reads AGENTS.md, and /init makes one for you.

Cursor: an editor with AI built in. The Hobby plan is free.

Local models: Ollama or LM Studio. 16 GB of RAM or more helps, and a GPU or Apple Silicon. Laptop-sized models still trail hosted ones on agent work.



The tiny test

Point it at a folder with one file in it. On the free plan, attach the file instead.

Ask it to read the file, write a one-page summary, and save it next to the original (or hand it back as a file you download).

Open that summary yourself, outside the AI. If you can open it, read it and change it, your setup works.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

**Step 1: Name their setup.**
- Ask: "Name your four pieces as you're using them right now: your model, your harness, your interface, and where it runs."
- Help them if they're stuck. A typical answer here: model = Claude (whichever model their session shows), harness = Claude Code, interface = the desktop app's Code tab / VS Code / a terminal, where it runs = model in the cloud, files on their computer.
- Ask: "Is there anything about your work that would make you pick differently? Privacy, your company's tools, cost?" Take one or two sentences. Note the answer in progress.md `notes`.

**Step 2: Make the test folder.**
- Ask: "Want to use Jake's tiny-test folder, or one file of your own?"
- **Jake's:** copy `practice/tiny-test/` to `tiny-test/` at the root yourself. It holds one file, `meeting-notes.txt`. Tell them it's there.
- **Their own:** "At the root of the Foundation Companion folder, make a folder called `tiny-test`. Put exactly one file in it: any real document you've got, a page of notes, an article saved as text. Tell me when it's there."
- Inspect: `tiny-test/` exists with exactly one file.

**Step 3: Run the tiny test.**
- Instruction: "Open a session on `tiny-test` in whichever setup you picked. If that's the same as your work session, just open a new one on `tiny-test`. Ask it: `Read the file in this folder, write a one-page summary, and save it next to the original.` Tell me when it's saved."
- If they picked a setup they don't have installed yet (Codex, a local model), let them run the test in Claude Code now and try the other later. The test is the habit, not the brand.

**Step 4: Open it yourself.**
- Instruction: "Now open that summary outside the AI. Notepad, TextEdit, any editor. Change one sentence and save. Tell me when you've done it."
- Inspect: `tiny-test/` holds the original plus a summary file, and the summary reads like a real one-page summary of that file.

**Artifact:** `tiny-test/` with one original file and the summary saved next to it.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `tiny-test/`: the original file and a summary file next to it.

2. Ask: "Say a friend at your company asks which AI setup they should buy. What would you ask them before you answered, and what would you check first?"

3. Record in `_tutor/progress.md`:
   - lesson: "1-4_pick-your-setup"
   - artifacts_inspected: ["tiny-test/<original>", "tiny-test/<summary>"]
   - comprehension.question: "Say a friend at your company asks which AI setup they should buy. What would you ask them before you answered, and what would you check first?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer asks about their need first (new to this, live in code, privacy, what the company already has), checks what's already in their company's tools before buying, and counts more than the subscription (setup time, upkeep, checking, waiting). Bonus if they say their folders would come with them. A bad answer just names a favorite product with no questions, or picks on price alone.

5. Homework (optional): "Pick one setup, run the tiny test, and open the result yourself." They did. Tell them so.

6. Phase E: this is a section boundary, the end of module 1. Next up is 2.1 Start With the Outcome. Deliver the restart phrasing. Add: "Module 2 builds on your workspace, `<ws>`. Keep it."
