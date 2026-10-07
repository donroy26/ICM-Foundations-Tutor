# Start Here

<!-- Source: 2026-10 Foundations/01_Start_Here.md + full-course video transcript 1:09-4:22 -->

## Opening

<!-- Runtime instructions for Claude, delivered in Phase A. This replaces the plain hook-and-ready opening for Start Here only. -->

**1. The opening message.** Right after you greet them, before the hook, say this in these words or very close to them:

> "Since you're working in Claude Code, a coding environment, 1.3 Folders and One Agent is the natural place to start. That's where the AI starts working right inside your files, and it's what this setup is built for. But 1.3 builds on two things from the first lessons: a list of corrections you made in a chat (1.1) and a skill you made from them (1.2). If you haven't done 1.1 and 1.2 yet, I'll walk you through them first. They happen in the Claude chat app, and I'll keep track of everything here."

**2. Ask where they are.** Ask one question with three answers:

> "So which one fits you?
> 1. I've only really asked AI questions so far.
> 2. I've done 1.1 (or I already correct AI in chats a lot), but I haven't made a skill.
> 3. I've done 1.1 and 1.2, or I already have a skill, saved prompts or a Project I use."

Route:
- **Answer 1** → `entry_point: "1-1_chat"`. Tell them: "Then we start at 1.1. Even if you think you know chat, there are a couple of things in there most people miss."
- **Answer 2** → `entry_point: "1-2_skills"`. Ask: "Do you have a chat where you corrected the AI a couple of times, or a written list of corrections?" If they don't, route to 1.1 instead and say why in one sentence: 1.2 is built on that list. Otherwise add 1.1 to `lessons_skipped[]`.
- **Answer 3** → `entry_point: "1-3_folders-one-agent"`. Add 1.1 and 1.2 to `lessons_skipped[]`. Ask: "Have you got a skill you can bring along? A SKILL.md file, or a saved prompt you use for one job?" Note the answer in progress.md `notes`. If they have none, that's fine: 1.3 has a short step to make one.

If the user says they already work in folders with Claude Code and asks to skip to module 2, Jake allows that in the classroom. Here, hold at 1.3: "1.3 is short, and it sets up the workspace every later lesson builds in. Let's do it together and you'll fly through it."

**3. Then the hook.** Once they've answered, deliver the Brief's hook and ask "Ready to start?" as usual. Everyone gets the Start Here map, whatever their entry point: it's short, and every later lesson refers back to the three layers.

## Brief

What You'll Get From This

Foundations gets AI working inside your own files, on your own work. By the end, one short sentence kicks off real work, and you can open up every piece of it.



Why this course

Most people use AI like a really smart search bar. They ask it something, copy the answer, paste it somewhere, and then tomorrow they start over with a blank chat. That works. It's also about the smallest thing you can do with it.

Case in point: the Foundations videos themselves. The script, the animation, the little pixel Jake pointing at stuff. All of it came out of one folder on his computer. Later in the course he opens that folder up and shows how it's built, so you can build one around whatever you do, videos or not.

You don't need to know how to code. Almost everything you'll see is plain English sitting in text files.



The map: three layers

Layer 1, chat: you and a chatbot going back and forth, copying and pasting. That's 1.1.

Layer 2, skills and saved prompts: the stuff you keep retyping, written down once. That's 1.2.

Layer 3, folders and one agent: the AI works right inside the files on your computer, and one sentence can reach all of it. That's 1.3.

The layers are about how you organize and reuse your work, so there's no ceiling on them. Layer 3 goes as advanced as you want.



The modules

Module 1, The Three Layers: one hands-on lesson per layer, plus 1.4 on picking your setup.

Module 2, Build It Around Your Work: start with the outcome you want, design a folder around it, then give that folder different jobs.

Module 3, Automate It: stages you can step into, code for the steady parts, and keeping the whole thing useful. You still step in wherever your judgment matters.



What you need

A Claude or ChatGPT account. On Claude, the free plan covers 1.1 and 1.2. From 1.3 on you'll want the Claude desktop app on a paid plan, or Codex if you're on the ChatGPT side. You're already in Claude Code, so you've got what 1.3 needs.

Apps change every couple of weeks, so each lesson keeps the current setup details with a date on them. If a button has moved, the official page wins.

Two extra sections live in the Skool classroom: Live Lessons, longer recordings of Jake working through real stuff with people, and History and Concepts, where he digs into Engelbart, Unix and why any of this works in the first place. Dip into either one whenever you want to go deeper.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

Start Here has no file to build. The entry point was chosen in the Opening.

**Step 1: Confirm.** Read back their starting lesson by its full name (e.g., "So we start at 1.3 Folders and One Agent.").

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect: nothing on disk. Confirm `entry_point` is decided.

2. Ask: "Think of one thing you do every week that you'd love to hand off. Which of the three layers is it sitting at right now, and what would moving it up one layer look like?"

3. Record in `_tutor/progress.md`:
   - `entry_point`: the chosen slug
   - `lessons_skipped`: any skipped lessons, each with a reason
   - `current_lesson`: the entry point slug
   - Under `lessons_completed`: lesson "0-0_start-here", artifacts_inspected: [], the question, the verbatim answer, pass true/false

4. A good answer names a real weekly job and places it honestly (most people are at layer 1: retyping it in a chat each time). The "move it up" part should point toward writing something down once (a skill) or letting the AI reach the files. A bad answer is abstract ("I'd use AI more") or skips the job entirely. If it's weak, help them find a real job; it will be useful in 1.1 and 2.1.

5. Phase E: Start Here is not a section boundary. Name the entry lesson and wait for "go".
