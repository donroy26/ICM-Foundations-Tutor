# 1.2 Skills (and Projects)

<!-- Source: 2026-10 Foundations/04_1.2_Skills_and_Projects_.md + full-course video transcript 11:17-17:27 -->

## Brief

What You'll Get From This

Your first skill, made from your own corrections and working in a brand new chat without you retyping a thing, plus a Project set up for your files.

You need: your list of corrections from 1.1, or any chat where you had to correct the AI a couple of times. On Claude, the free plan works.



A process can be written down

Back in 1.1 you heard about pasting prompts in by hand, in order, and then writing scripts to fire them off at scale. At some point you realize all of that is a process. And a process can be written down.

Somebody goes through all the back and forth, figures out the right instructions in the right order, the stuff that makes the output actually good, and packages it up so the AI can run it. That's a skill.



What a skill is

A skill is a process written down so the AI can run it. It's a folder with one file inside called SKILL.md.

At the top: a name, and a description of what it's for and when to use it.

Under that: the steps, in plain English, the way you'd brief a new hire on day one.

Sometimes: templates or small scripts in the same folder. But the heart of it is that one file.



Markdown, and the clean desk

The .md means markdown: a text file with a tiny bit of formatting, dashes for bullets and # for headers. John Gruber came up with it in 2004. Your AI already writes in it. All those bold words and bullet points in its answers? That's markdown.

The AI only sees the names and descriptions of your skills until your request matches one. Then it opens that skill and follows it. That's the desk from 1.1, kept clean. You can have a hundred skills and it only pulls the one this job needs.



Where to click (checked 6 October 2026)

See your skills in Claude: Customize in the left sidebar, then Skills. Some are from Anthropic, some from other companies: PowerPoint, PDFs, designs, spreadsheets. And you can make your own.

No skills showing: turn on code execution in Settings, under Capabilities. Skills need it.

Add a skill someone else made: download it, then Customize, Skills, the + button, and upload.

ChatGPT and Codex use skills in nearly the same format, so what you build travels with you.

Projects: Projects in the sidebar, then a new project. Project knowledge holds your files, and the instructions apply to every chat in that project.



Make your first skill

Start a new chat and say: "I want a skill for replying to client emails." Paste in your corrections from 1.1.

Claude actually interviews you. Answer its questions: what it should do, when it should kick in, a reply you liked. Then it writes the SKILL.md file and hands it to you to save.

Read it. Seriously, read it. Sometimes it writes down a rule you never said, or turns one example into a law for everything. This is your process now, so it should sound like you. Tell it what to fix and it rewrites the file. It's all just English.



Jake's skill, from the video

---
name: how-i-reply
description: Use when replying to client emails. Writes a short, casual reply in Jake's voice and never promises a date, room or price that the client's notes don't confirm.
---
# How I reply
1. Match their length. A three-line email gets a three-line reply.
2. Keep it short and casual. Never open with "I hope this email finds you well".
3. Answer what they asked, first.
4. Never promise a date, a room or a price unless the client's notes confirm it. If they don't, say we'll confirm it and by when.
5. Sign it "Jake".

That's literally the list of corrections from 1.1, written down once, plus a couple of things it picked up when it interviewed him.



The test

New chat, empty desk. Paste in the next email and type "reply to this". That's it. No speech about tone, nothing.

It should say it's using your skill, and the draft comes back short and casual, nothing promised that isn't booked, signed right. None of your corrections need retyping.

It's the same move for anything you do over and over: how you write a proposal, how you check a spreadsheet before it goes to your boss, how you turn a call into meeting notes, how you review code. Jake trained a team at a company in Dubai, people who barely touched AI. In their first four days they mapped 38 of their own workflows, which is this exact move: writing down how they actually do the job. In three weeks they'd turned a three-day pre-sales estimate into six hours.



Skill or project

A skill is how you do a kind of job. How I reply to anybody.

A project holds one area of your work. Everything about one client, your newsletter, the course you're building.

Keep the client's facts in the project and the skill still works for the next client. Mix them and your skill starts promising every client the 21st. When a project gets big, not every file makes it onto the desk, so mention the one that matters by name.

The instructions box in your settings is for things true in every chat, like your name. And if you've got a doc full of saved prompts, that's still layer 2. A skill's just the cleaner version the AI can pick up on its own.



Worth grabbing, and what's next

humanizer: a skill that strips the AI-sounding stuff out of writing. Jake recommends it to basically everybody. Anthropic's skills on GitHub are worth opening and reading too. They're just folders and English.

You'll notice you're still dragging files in by hand. A client sends a new brief, you upload it again. The AI writes a draft, you copy it out of the chat. And all your actual work lives on your computer. That's layer 3, folders and one agent, and it's where skills get really powerful, because they stop floating around and get wired into the actual work.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

This lesson happens in the Claude chat app, not in Claude Code. See "Lessons that happen in the chat app" in INSTRUCTIONS.md.

**If the user started here (skipped 1.1):** ask them to paste the corrections from the chat they mentioned at Start Here. Save them to `my-skills/corrections.md` in the 1.1 shape before Step 1.

**Step 1: Read back the corrections.**
- Read `my-skills/corrections.md` aloud to them. "These are what we're turning into a skill. Anything to add before we start?"

**Step 2: Ask for the skill.**
- Instruction: "In claude.ai, start a new chat. Say: 'I want a skill for [your job].' Then paste in your corrections. Tell me when it starts asking you questions."

**Step 3: Answer its interview.**
- Instruction: "Answer its questions: what it should do, when it should kick in, and an example you liked. Tell me when it hands you a SKILL.md."
- If it doesn't interview them and just writes a file, that's fine. Move on.

**Step 4: Read it like it's yours.**
- Instruction: "Paste the SKILL.md here. Let's read it together."
- Inspect with them: Is there a `name` and a `description` at the top, between `---` lines? Does the description say when to use it? Are the steps plain English? Then the important one: "Is there any rule in here you never actually said? Any one example that got turned into a law for everything?" If yes: "Tell it what to fix in that chat and paste me the new version."
- When they're happy, save it to `my-skills/<skill-name>/SKILL.md`, using the `name` from its frontmatter as the folder name.

**Step 5: Install it and test it.**
- Instruction: "Now make sure it's saved as a skill in Claude. If it offered to save it, say yes. If it gave you a file, go to Customize, Skills, the + button, and upload it. Tell me when it shows up in your skills list."
- If no skills show: "Turn on code execution in Settings, under Capabilities. Skills need it."
- Instruction: "Start a brand new chat. Paste in the next piece of work (another email, the next document) and type only: '[do the job] this'. Jake's was 'reply to this'. Tell me: did it say it's using your skill? Did you have to retype any correction?"
- If it didn't pick up the skill: the description is probably too vague. Have them make the description say exactly what the job is and when to use it, re-upload, and test again in a new chat.

**Step 6: Set up a Project.**
- Instruction: "Last piece. In claude.ai, open Projects in the sidebar and make a new project for one area of your work: one client, your newsletter, whatever fits. Drop in one or two files that belong to it and write one line in its instructions. Tell me what you called it and what you put in."
- Then: "Facts about that area go in the project. How you do the job goes in the skill. That's why your skill still works for the next client."

**Artifact:** `my-skills/<skill-name>/SKILL.md` (and the user's report of the fresh-chat test and the Project)

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `my-skills/<skill-name>/SKILL.md`. Verify: frontmatter with `name` and `description`; the description says what it's for and when to use it; numbered or bulleted steps in plain English; the user's own corrections are visible in the steps. Confirm the user reported the fresh-chat test working.

2. Ask: "You get a second client tomorrow. What changes in your skill, what changes in the project, and why?"

3. Record in `_tutor/progress.md`:
   - lesson: "1-2_skills"
   - artifacts_inspected: ["my-skills/<skill-name>/SKILL.md"]
   - comprehension.question: "You get a second client tomorrow. What changes in your skill, what changes in the project, and why?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer leaves the skill alone (it's how you do the job, for anybody) and puts the new client's facts in a new or separate project. A bad answer edits the skill to add the new client's details, which is exactly the "promising every client the 21st" mistake. If they get it backwards, walk through Jake's 21st example again.

5. Homework (optional): "Turn your corrections from 1.1 into your first skill, then test it in a fresh chat." They just did. Tell them so.

6. Phase E: this is a section boundary. Next up is 1.3 Folders and One Agent, which happens back here in Claude Code. Deliver the restart phrasing.
