# 3.2 Turn the Steady Parts Into Code

<!-- Source: 2026-10 Foundations/13_3.2_Turn_the_Steady_Parts_Into_Code.md + full-course video transcript 45:22-49:54 -->

## Brief

What You'll Get From This

One step you've done the same way three or four times running as a script, written into your map so the AI uses it, and a clear sense of which steps should stay with the AI.

You need: a workspace with at least one step you've done the same way three or four times. You don't need to know how to code.



Most of it is plain old code

Something that surprises people about Jake's animation folder: most of the work behind these videos is plain old code. One command turns the voice into timed words, one lines the storyboard up to those words, one renders every frame, and the AI doesn't think for any of it. Each command does one stage and stops.



Code for the same answer every time

The reason is consistency, or determinism if you want the fancy word. When the same input should give the same output every time (timing words, rendering frames, totaling a spreadsheet), that's a job for code. A script does it the same way on the hundredth run as the first.

Keep the AI on the parts that need judgment, like writing the script for a lesson, or deciding what goes on screen.

In Jake's psychometrics research the models answered the questions, but scoring the answers was arithmetic. Researchers worked out those scoring keys decades ago, so a script did it, the same way, across ten thousand responses. That's the thirty in sixty, thirty, ten.



Spot one

Ask yourself: can I do this the same way, consistently? If you've done a step the same way three or four times and the right answer doesn't depend on taste, it's a candidate.

Renaming a pile of files, turning an export into the same summary table every week, pulling the numbers out of a report, resizing images. The bookings table from 2.1 is a perfect one.



Build it

Ask: "Write me a script that turns this export into the weekly table, put it in a scripts folder, and add a line to the map saying when to use it." It writes the code, runs it and shows you the result. You don't have to write the code yourself, though you'll start reading it after a while, and that's a good thing.

Test it on something you already did by hand, like last week's export, and compare the two. A wrong script is wrong the same way every time, so check it properly once. Ask it to walk you through anything you don't follow, line by line if you need to.



The map line

Jake's: "For the weekly table, run python scripts/make-table.py on the newest export." Next week you just say "make this week's table", and it runs your script, the same way, every time.

One clear input and one clear output means you can swap the script later (make it faster, change the format) without touching anything else in the folder. That's the old Unix rule from the 70s: make each program do one thing well.



Make it run on its own (checked 6 October 2026)

The desktop app can run a task on a schedule, like every Monday morning. You set when and write what it should do. Tasks that work on files on your computer need the app open and the computer awake. Monday comes around and the table's already sitting there waiting for you.

In Cowork: Scheduled in the sidebar, then New task.

In Code: Routines, then New routine, then Local.



What stays with the AI and you

If a step needs reading between the lines, like replying to a client or deciding what a video should show, keep it with the AI and with you.

You don't have to plan this up front. Keep doing the work by hand and automate one piece at a time, and the work will show you the next best automation.

Pro tip: whenever you can get at the back end of something, an export or an API, use it, and skip having the AI click around a website.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

**Step 1: Spot the step.**
- Read `<ws>/outcome.md` under `## Tools, not the model` back to them. Ask: "Which of these have you done the same way three or four times, where the right answer doesn't depend on taste?"
- Practice track: in `weekly-report/` (`<ws>`), turning the newest bookings export into the weekly summary table. Jake's map already spells out the table: one row per client with confirmed seats, confirmed revenue (seats times price per seat) and pending seats, then a total row; only confirmed bookings count as revenue.
- Ask: "What goes in, and what should come out? One input, one output."

**Step 2: Ask for the script.**
- Instruction: "In a fresh work session on `<ws>`, ask: `Write me a script that turns [input] into [output], put it in a scripts folder, and add a line to the map saying when to use it. Use whatever's already installed on this computer.` Approve its steps. Tell me when it's run."
- The last sentence matters: the user may not have Python. The work session will check what's there (Python, Node, PowerShell) and pick one.
- Inspect: a file under `<ws>/scripts/`, and the output it produced.

**Step 3: Test it against last time.**
- Instruction: "Now test it on something you already did by hand. Run it on last week's input and compare it with what you made before. Do they match?"
- Practice track: this is what Jake's folder is built for. `summaries/2026-09-28-summary.md` was made by hand. Run the script on `exports/2026-09-28-bookings.csv` and compare: it must match the hand-made table exactly (total 45 confirmed seats, $1,750 confirmed revenue, 10 pending seats; Maple Street 8 confirmed and 4 pending, Northside Cycles 0 confirmed and 6 pending). Then run it on `2026-10-05-bookings.csv`: total 29 confirmed seats, $1,080, 17 pending seats (Lumen Dental 5 pending, Harper & Lane 12 pending, Riverbend Library 15 confirmed across two rows).
- If there's a mismatch, have them tell the work session exactly what's wrong and rerun. "A wrong script is wrong the same way every time, so check it properly once."
- Instruction: "Ask it to walk you through the script, in plain English. Anything you don't follow, ask about that line."

**Step 4: The map line.**
- Inspect `<ws>/CLAUDE.md` for a line saying when to run the script, on which input. If the work session didn't add it or it's vague, have them fix it: "For [job], run [script] on [input]."
- If the 3.1 stages exist, the `01_gather` contract should now say it runs the script. Have them update the contract if it doesn't.

**Step 5: Prove the one short sentence.**
- Instruction: "Fresh work session. Say only: `make this week's table` (or your job's short version). Did it run the script, or did it try to do it by thinking?"
- Inspect the new output.

**Optional: schedule it.** Mention the desktop app's scheduled tasks (Cowork: Scheduled, New task; Code: Routines, New routine, Local), and that the app has to be open and the computer awake. Don't require it.

**Artifacts:** `<ws>/scripts/<script>`, its outputs, `<ws>/CLAUDE.md` with the line that runs it.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect the script, its output on both inputs, and the map line.

2. Ask: "Look at the rest of the job this script is part of. Which other step would you turn into code next, and which one would you never hand to a script? Why?"

3. Record in `_tutor/progress.md`:
   - lesson: "3-2_steady-parts-into-code"
   - artifacts_inspected: ["<ws>/scripts/<script>", "<output>", "<ws>/CLAUDE.md"]
   - comprehension.question: "Look at the rest of the job this script is part of. Which other step would you turn into code next, and which one would you never hand to a script? Why?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer picks a next step whose right answer doesn't depend on taste and that they've done the same way several times, and keeps a judgment step (the reply, deciding what matters to the owner) with the AI and with them, because it needs reading between the lines. A bad answer wants to script everything, including the judgment, or can't name a reason.

5. Homework (optional): "Find one step you've done the same way three times, ask for a script, test it against last time, and add the line to your map."
