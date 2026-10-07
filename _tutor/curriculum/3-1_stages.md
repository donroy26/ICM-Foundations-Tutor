# 3.1 Stages You Can Step Into

<!-- Source: 2026-10 Foundations/12_3.1_Stages_You_Can_Step_Into.md + full-course video transcript 40:55-45:21 -->

## Brief

What You'll Get From This

Work split into stages that each leave a file you can open, the spots where your judgment actually changes the result, and the AI waiting for you when it matters.

You need: a job you already do in steps, or the folder you built in module 2.



One stage, one file

In Jake's animation folder each stage leaves one file behind: the voice stage leaves an audio file, the words stage a transcript with every word timed, the storyboard a plain text file, then the scene, then the render.

Nothing moves to the next stage until somebody has looked at the last file, and that rule sits right in the map. The full tour of that folder is Jake's YouTube video How to Make AI Videos That Don't Feel Like AI Slop.



Why it matters

In this course's own script for 1.1, the first draft said Jake had been doing this for two years, when it's closer to four. Caught in the script, that's one line in a text file and a ten-second fix. Caught after the animation, it's a new voice take, new timings and new frames.

When the work sits in files between steps, your judgment lands early, while changes are cheap. One giant run from prompt to finished thing leaves the very end as the only place to fix anything, and the end is the most expensive place there is.

Stages stop what Jake calls the narrow funnel: the AI doing too much all at once. And you can still automate the whole process when you want to.



Set it up

Write the job as stages, each with the single file it makes. A weekly client report might be gather, draft, check, send.

Give each stage a short contract: what it reads, what it makes, and who checks it before it moves on. Plain English, in the stage's folder.



Tell it where to stop

There are three strengths:

In the map: "Stop after each stage and wait for me." It reads that and pretty much always follows it. But that's still something it reads.

In the settings: Manual mode asks before it edits files or runs anything. Plan mode only lays out a plan without touching anything.

A hook: a hard rule that blocks an action no matter what. Use it for anything that truly can't happen without you, like sending or deleting.



Put your eyes where it counts

You don't need to watch every step. Jake doesn't watch it transcribe; that's a script doing the same thing every time. Jake listens to the whole voice take, reads the storyboard, and watches the stills, because that's where taste changes the result. Put your eyes where your judgment matters and let the rest run.

And stepping in is more than yes or no. Add a line, stretch a beat that's rushing, and the one Jake uses most: delete stuff. A scene that doesn't teach anything, a paragraph that's clearly just showing off, gone.



The bigger idea

Doug Engelbart's 1962 report, Augmenting Human Intellect, was about computers making people more capable with the person right there, steering. That's what these stages are for. The AI does more and more of the work, and you keep a way in.

Pencils and scissors and glue, then the keyboard and the word processor, then the mouse: each made the work simpler to drive while the stuff underneath got more complicated. A sentence is the next step. Since the model interprets it, the same sentence won't always run the same way, so good setups keep the complicated part right underneath, where you can open it up and check.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

**Step 1: Pick the job and name the stages.**
- Ask: "Pick one job you do in steps. It can be from your routing table. What are the stages, and what's the single file each stage makes?"
- Practice track: the weekly report from 2.1, in `weekly-report/` (copy it from `practice/` if it isn't at the root yet; `<ws>` is `weekly-report/`). Stages: `01_gather` (reads the newest export in `exports/`, makes `table.md`), `02_draft` (reads the table, makes `heads-up.md`, two lines for the owner on what's still pending), `03_check` (you read it, makes nothing, or a one-line `approved.md`), then send is you.
- Take their answer stage by stage. Push back on any stage that makes more than one file, or none.

**Step 2: Mark the judgment points.**
- Ask: "Which one or two of these stages is where your judgment actually changes the result? Where would you want to read it before it moves on?"
- Ask: "And which stage would you never watch, because it comes out the same every time?" (That one is a 3.2 candidate. Note it in `<ws>/outcome.md` under `## Tools, not the model`.)

**Step 3: Write the contracts.**
- Instruction: "In the work session, ask it to make a `stages/` folder with one subfolder per stage, and in each one a short CONTRACT.md: what this stage reads, what it makes, and who checks it before it moves on. Plain English. Mark your judgment stages with your own name as the checker. Tell me when it's done."
- Inspect each `<ws>/stages/<stage>/CONTRACT.md`: reads, makes (one file), and a checker. The judgment stages name the user as the checker.

**Step 4: Tell it where to stop.**
- Instruction: "Now ask it to add a routing row for this job to CLAUDE.md that points at the stages, plus this line: `Stop after each stage and wait for me.` Tell me when it's in."
- Inspect `<ws>/CLAUDE.md` for the row and the stop line.
- Confirm the work session is on Manual. Mention Plan mode as the other setting: it lays out a plan and touches nothing.

**Optional: a hook.** If there's something that truly can't happen without them (sending, deleting), they can ask the work session: "Set up a hook in this folder's .claude/settings.json that blocks [action]." Inspect `<ws>/.claude/settings.json` afterward. Optional; skip if they're not interested.

**Step 5: Run it and step in.**
- Instruction: "Fresh work session on `<ws>`. Ask for the job in one short sentence. It should stop after the first stage. When it does, open the file it made."
- Then: "Now step in. Change something: add a line, fix a number, or delete something that doesn't belong. Then tell it to go on." Have them run through to the end, stopping at each stage.
- Inspect: each stage's file exists where its contract says, and the user's edit carried through to the later files.
- If it ran straight through without stopping: the map line isn't being read or isn't clear. Check the row and the line, tighten, rerun.

**Artifacts:** `<ws>/stages/*/CONTRACT.md`, the stage output files, `<ws>/CLAUDE.md` with the row and stop rule.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect the contracts, the stage outputs (including the user's edit carried forward), and the map row with the stop rule.

2. Ask: "Pick the most expensive mistake that could happen in this job. Which stage would you want to catch it in, and why that one and not the end?"

3. Record in `_tutor/progress.md`:
   - lesson: "3-1_stages"
   - artifacts_inspected: ["<ws>/stages/...", "<ws>/CLAUDE.md"]
   - comprehension.question: "Pick the most expensive mistake that could happen in this job. Which stage would you want to catch it in, and why that one and not the end?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer catches it at the earliest stage where it shows up in a file you can read, because fixing it there is cheap and everything downstream is built on it (Jake's "two years vs four" caught in the script, not after the render). Bonus: they'd use settings or a hook, not just the map, for anything that must never happen. A bad answer says they'd check the final output, or that the AI should just get it right.

5. Homework (optional): "Take one job and split it into stages. Name the one file each stage makes, and mark the one or two where your judgment changes the result. That's where it stops and waits for you."
