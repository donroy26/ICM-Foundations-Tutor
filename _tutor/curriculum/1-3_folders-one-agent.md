# 1.3 Folders and One Agent

<!-- Source: 2026-10 Foundations/05_1.3_Folders_and_One_Agent.md + full-course video transcript 17:28-24:37 -->

## Brief

What You'll Get From This

The AI working right inside your folder, reading your files and saving its work back where you can open it, one short sentence that reaches all of it, and a clear idea of what an agent actually is.

You need: Claude Code (you're in it) on a paid plan, or Codex on the ChatGPT side, plus a folder with some real work in it. Use a copy of that folder the first time.



The agent problem is mostly solved

For most people, the agent problem is already solved. One good model, a good harness, and a good set of folders. A harness is just what 1.1 called the app: everything around the brain that lets it open files and run stuff.



What an agent is

The word agent scares a lot of people off for no reason. Simon Willison put it in one line: an LLM agent runs tools in a loop to achieve a goal. LLM just means the language model, the brain.

The model reads something, does something, looks at what happened, decides what's next, and keeps going until the job's done. The tools are things like open this file, search this, save that, run this command.

A research agent, a writing agent, an email agent: that's the same model reading different instructions with different tools. Agents are just a naming convention. The value comes from the instructions you write, what it can reach, and the outcome you want.



Where to click (checked 6 October 2026)

Install: follow the desktop quickstart. The Code tab needs a Pro, Max, Team or Enterprise plan.

Open your folder: Code, then Local, then select your folder. Its name shows just above the box. Claude Code reads the map file every single time it opens that folder.

Make it ask first: the permission mode sits by the box. Set it to Manual and it asks before it edits files or runs anything, at least until you trust it.

Codex: same idea. The map file is called AGENTS.md instead of CLAUDE.md.

Your real Gmail: Customize, then Connectors.



The folder from the video

client-email/
  CLAUDE.md                          the map, read every time
  about-me.md                        who I am and how I work
  .claude/skills/how-i-reply/        the skill from 1.2
  clients/<client>/notes.md          what we've agreed with each client
  inbox/                             emails waiting for a reply
  drafts/                            replies for me to read and send myself

The reply skill from 1.2 got copied in under .claude/skills, so it travels with the folder. Open any of these files and they're just text. No secret code.



The map

The map (CLAUDE.md) is the floor plan on the wall when you walk into a building. Keep the stuff it always needs in there: what this folder is for, where things go, your naming rules, and a routing table that says, for each job, what to read, what to skip, which skill to use and where to save.

Jake's email row reads like this:

Job: reply to email ("check my email")
Read: about-me.md, the client's notes.md, each email in inbox/
Skip: other clients' notes
Use: the how-i-reply skill
Save to: drafts/, named date-client-number

Plus two rules: never send anything, and if the client's notes don't confirm something, say so in the draft. That's the whole trick, and it's all English. You don't have to write it from scratch either. Ask it to look through the folder and write you a CLAUDE.md, then read it and fix it, same as the skill.



Three words

Jake types three words: "check my email." That's almost terrible prompting. Watch it go anyway. It reads the map, opens the inbox, reads about-me, pulls the reply skill, checks each client's notes so it doesn't promise anything that isn't agreed, and writes the replies into drafts, named with the date and the client. On Manual, it asks before it saves.

Remember from 1.1: every word in a prompt is a question, and something has to answer it. "Check" is how, and the skill answers it. "My" is who, and about-me answers it. "Email" is which mailbox, and right now that's the inbox folder. Connect your actual Gmail under Connectors and it reads the real thing.



Drafts are just files

Open one in Notepad, change a word, delete the one you don't like, and when one's right, paste it into your email and hit send yourself. Nothing breaks when you edit it. It's just English.

That matters more the more you automate, because you always want a way to get in there and add your judgment, or take something out.

The map is something it reads. For anything that must never happen, like sending an email, use the settings too. More on that in 3.1.



Why folders work

It's the desk again. The map and the routing put exactly what this job needs on the desk and leave everything else in the drawers. Even if video scripts were sitting in that folder, they'd stay in the drawer while it answers email.

One sneaky trick: put naming rules in the map. Say "pull last week's draft for Maple Street" and it just knows where to look. Nine times out of ten, that's all you need. No database, nothing.

It works for way more than email. The folder that made the Foundations videos is the same pattern: a map up top, a room for each stage, each video in its own folder. A sales team's folder might hold their data, how they check it, and this week's report. A developer's holds their code and the decisions behind it. This whole pattern is what Jake's paper on Interpretable Context Methodology is about. Jake calls it ICM. The skill that builds these folders, ICM Architect, comes up in 2.2.



The bigger idea

These are just files and folders, the same idea computers have run on since the 70s. So when a better model comes out next month, and it will, all of this keeps working, maybe with a renamed file or two.

When Doug Engelbart showed the world the mouse in 1968, one little movement of your hand could drive a whole complicated system. A sentence is starting to work like that now. "Check my email" is the click, and everything underneath it is still sitting right there in folders you can open.

That's the three layers. You started simple in a chat, built the complicated stuff into a skill and a folder, and it came right back to one simple sentence.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

This is the first lesson with two windows. Before Step 1, explain the setup in two or three sentences, using "The two windows" in INSTRUCTIONS.md: this session is the tutor, the work session is the one agent, and Jake's tests only mean something in a fresh session that knows only the folder.

**Step 1: Pick the folder.**
- Ask: "Do you want to use a copy of a folder of your own real work, or Jake's practice folder? The practice folder is the exact client-email folder from the video: made-up clients, an inbox, and Jake's reply skill."
- **Practice folder** (`track: "practice"`): copy `practice/client-email/` to `client-email/` at the root of this repo yourself, but **leave out its `CLAUDE.md`**. That's Jake's finished map; writing one is the lesson, and you'll compare against Jake's at the end. Tell them: "Done. `client-email/` is your copy. I held back Jake's map so you can make your own first. The original in `practice/` stays clean in case you want to start over."
- **Their own folder** (`track: "own"`): "Make a copy of it, and put the copy here, at the root of the Foundation Companion folder (next to `_tutor/`). Use your file explorer: copy, then paste it here. Tell me its name when it's in." Then list its contents to confirm. If it's huge (thousands of files), suggest copying one corner of it instead.
- Record the track and folder name in progress.md (`track`, `workspace`). From here on in this lesson, `<ws>` means that folder.

**Step 2: Bring the skill along.**
- If `my-skills/<name>/SKILL.md` exists: copy that skill folder to `<ws>/.claude/skills/<name>/`. Say: "Your skill from 1.2 is now inside the workspace, under `.claude/skills/`, so it travels with the folder. Same move Jake makes in the video." On the practice track, the folder already has Jake's `how-i-reply`. If theirs has a different name, keep both; if it's also called `how-i-reply`, ask which one they want to use and keep that one.
- **Practice track with no skill of their own:** Jake's `how-i-reply` is already in `client-email/.claude/skills/`. Open it with them and read it: "This is the skill from 1.2, written from Jake's corrections. It travels with the folder." Skip the next bullet.
- **If the user started here and has no skill:** ask: "What's one job you do in this folder over and over, and two or three corrections you always end up making when AI does it?" Then have them make it in the work session in Step 4 instead, by asking: "Make me a skill for [job] at .claude/skills/[name]/SKILL.md, from these corrections: [their list]." Inspect the file after. If they brought a skill or saved prompt from elsewhere, have them save it as `<ws>/.claude/skills/<name>/SKILL.md` with a name and description at the top.

**Step 3: Open the work session.**
- Give the matching instructions from "How to open the work session" in INSTRUCTIONS.md, for the folder `<ws>`.
- Instruction: "Set its permission mode to Manual, so it asks before it edits files or runs anything. Tell me when it's open and the folder name shows."
- Check: if they say it greeted them as a tutor, it opened in the wrong folder. Have them reopen it on `<ws>` itself.

**Step 4: Ask it for a map.**
- Instruction: "In the work session, type: `Look through this folder and write me a CLAUDE.md.` It'll ask before it saves. Say yes. Tell me when it's done."
- Inspect `<ws>/CLAUDE.md`. Read it back to the user in a short summary.

**Step 5: Read it and fix it.**
- Go through it with them, one question at a time:
  - "Does it say what this folder is for, in a sentence or two?"
  - "Does it say where things go?"
  - "Any naming rules? How should files be named?"
  - "Anything in here that's wrong, or that you never said?"
- Instruction: "Tell the work session what to fix, in plain words. Or open the file and edit it yourself. It's just English. Tell me when it's right."
- Coach: if the map is long (more than one screen), say: "Keep the map short. A giant map puts the whole drawer back on the desk. That comes up again in 2.2."

**Step 6: Add one routing row.**
- Instruction: "Now add one routing row for one job you do. Five lines: Job, Read, Skip, Use, Save to. Jake's is on the screen in the lesson: reply to email. Ask the work session to add it, or type it in yourself. Tell me when it's in."
- On the practice track, the job is replying to email. Also suggest the two rules: never send anything, and if the client's notes don't confirm something, say so in the draft.
- Inspect: the row exists in `<ws>/CLAUDE.md`, names real files and folders that exist, names the skill, and says where to save and how to name.

**Step 7: One short request.**
- Instruction: "Start a fresh work session (close it and reopen it on the same folder, so the desk is clean). Give it one short request for that job. Jake's is three words: `check my email`. Watch what it opens. Tell me which files it read, and approve the save when it asks."
- Ask: "Did it read what your row told it to? Did it skip what it should skip? Did it say it was using your skill?"
- Inspect the saved output in `<ws>/` (on the practice track, new files in `client-email/drafts/`). On the practice track there are three emails, and each one is a trap the notes answer. Check:
  - **01 Maple Street** (move to the 14th, same room?): says the 14th is taken, offers the 21st, and does NOT promise a room for the 21st (the notes say none is booked).
  - **02 Lumen Dental** (add five more?): does NOT just say yes. The staff room seats 12 and more people means a new quote, so the reply says that and leaves it open.
  - **03 Maple Street** (laptops or phone?): the notes don't say, so the reply says Jake will confirm, or the draft flags it. It shouldn't invent an answer.
  - If a draft broke a rule, that's a great teaching moment: the fix goes in the skill or the map, not in a longer prompt.

**Step 8: Open what it saved.**
- Instruction: "Open one of the files it saved, in Notepad or any editor, outside Claude. Change a word and save it. Tell me when you've done it."
- Then: "That's the point. The work is just files. You can always get in there."

**Step 9 (practice track only): Compare with Jake's map.**
- Show them `practice/client-email/CLAUDE.md`, Jake's finished map. Ask: "What did Jake put in that yours doesn't have, and what did you put in that Jake didn't?" Things to notice: Jake's routing is a table with three jobs (reply to email, client update, bookings table); the naming rule ties each draft to its inbox number. Theirs doesn't need to match. It needs to work.

**Artifacts:** `<ws>/CLAUDE.md` with at least one routing row, `<ws>/.claude/skills/<name>/SKILL.md`, at least one output file the work session saved.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `<ws>/CLAUDE.md` (purpose, where things go, a routing row with Job / Read / Skip / Use / Save to), `<ws>/.claude/skills/<name>/SKILL.md`, and the saved output file(s).

2. Ask: "Say your request had gone wrong and it read the wrong files, or skipped the skill. Where would you look first, and what would you change?"

3. Record in `_tutor/progress.md`:
   - lesson: "1-3_folders-one-agent"
   - workspace: "<ws>"
   - artifacts_inspected: ["<ws>/CLAUDE.md", "<ws>/.claude/skills/<name>/SKILL.md", "<output path>"]
   - comprehension.question: "Say your request had gone wrong and it read the wrong files, or skipped the skill. Where would you look first, and what would you change?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer goes to the map first, specifically the routing row (what to read, what to skip, which skill), and fixes it there, or tightens the skill's description so it gets picked up. Jake: "if it reads the wrong stuff, your map is telling you what to fix." A bad answer is "write a longer, more detailed prompt" or "use a smarter model": that's back to layer 1, answering every question yourself every time.

5. Homework (optional): "Take one folder of real work and write a short map for it: what's in here, where things go, what to read for which job. Then give it one short request and watch what it reads. If it reads the wrong stuff, your map is telling you what to fix." If they used the practice folder, suggest a folder of their own for this.
