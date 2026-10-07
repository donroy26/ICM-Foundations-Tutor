# 2.2 Design Your Folder

<!-- Source: 2026-10 Foundations/09_2.2_Design_Your_Folder.md + full-course video transcript 32:37-37:25 -->

## Brief

What You'll Get From This

A workspace shaped around your own job, a short map that sends each job to what it needs, and one real request that proves it works.

You need: the job you wrote down in 2.1 (who it's for, their next step, the sixty, thirty, ten), plus the setup from module 1.



Three shapes, one way of thinking

Three folders that all work and look nothing alike:

Stages: Jake's animation folder, one step after another.

Records: the client email folder from module 1, a folder per client.

A wiki the AI keeps up: Andrej Karpathy's idea, raw sources in one place and the pages it writes and links in another.

Three totally different shapes, because they're three totally different jobs.



ICM is the method

They all come from the same method: ICM, interpretable context methodology, from the paper in 1.3. People started calling the folders themselves ICMs. When Jake says ICM, it means the way of thinking that builds the folder, so your folder comes out shaped like your work, and it won't look like Jake's.



List the jobs

Start from what you wrote in 2.1, and list the jobs that get you to that outcome. The email folder has two: replying to clients and sending them updates. For Jake's videos, it's plan, voice, words, storyboard, scene and render.

For each job, write what it reads and what it makes. That list is basically your folder already. The folder becomes your app, honestly, and there's no simpler interface than a folder.



Split by what things are

Method: how you do the job (skills and instructions).

Facts: clients, prices, sources.

Work: in progress.

Outputs: finished.

The method carries to the next client and the facts stay with this one. It's the skill and project split from 1.2.



Instructions, state, or both

Here's a lens from Jake's lectures. A program has three parts: the instructions, something that runs them, and the state it reads and changes. Nothing in that needs a computer. A loom had all three. So did a room full of clerks with a ledger. (And yes, that's a different three from the three layers.)

In your folder the model is the thing that runs, and the other two are yours to write. Label each file as instructions, state, or both, like notes it reads and then updates. A file that's neither is the first one to question.



Write the map

Keep it short. It's a routing file: what's here, where things go, your naming rules, and the routing table from 1.3. That's traditional software routing that's been around for decades, except now it's plain English.

The most common mistake Jake sees in the community is a giant map with everything crammed in, which puts the whole drawer back on the desk. The email folder's map fits on one screen, with two rules: never send anything, and if the client's notes don't confirm something, say so. And remember, it's the setting that actually stops a send.



Let ICM Architect draft it

You don't have to design all of this by hand. Jake made a free skill called ICM Architect, on GitHub. Point it at your messy folder and say "make this an ICM". It looks at what's there, asks you about the work, and proposes a structure and a map. It knows six shapes a workspace can take, including the three above.

Then read what it proposed, same as the skill in 1.2. It might give you rooms you don't need yet. Start with the smallest version that does today's job, and add a folder when the work actually asks for one.



Test it

New session, ask for one real job, and watch what it reads. If it opens the right few files and skips the rest, your routing works. If it wanders around reading everything, your map is too vague, so tighten that row and try again.

Nothing's built right the first time. And most things built the seventh time aren't great either.

This stuff is worth real money. Somebody in the community runs a cafe. They built a five-folder system for a newsletter and sold it to an engineering firm in Australia. Five folders.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

The user redesigns a folder around their work. The work session does the edits; you inspect.

**Which folder.** Own-work track: their workspace, designed around the job in their `outcome.md`. Practice track: Jake's messy folder. Copy `practice/newsletter-mess/` to `newsletter-mess/` at the root yourself; `<ws>` is `newsletter-mess/` for this lesson. Tell them: "This is the messy folder Jake points ICM Architect at in the video: two drafts of the same newsletter, an Untitled 3, a folder of old stuff. The job here is the monthly newsletter." Their 2.1 outcome was a different job, and that's fine: the method is the same.

**Step 1: List the jobs.**
- Own-work track: read their `outcome.md` back to them in two lines. Practice track: have them open `how we write these.md` and `old stuff/notes from meeting.txt`; between them they say what the newsletter is and how it gets made.
- Ask: "List the jobs that get you to that outcome. For each one: what does it read, and what does it make?" Take them one at a time.
- On the practice track, expect something like: write the monthly newsletter (reads the how-we-write guide, ideas, confirmed dates and hours; makes a draft) and check dates and hours with Dana (reads the draft; makes a list of what needs confirming). Keeping the subscriber list is a fair third.
- Write the list into `<ws>/jobs.md` (or under a `## Jobs` heading in their `outcome.md` on the own-work track) so it's on file.

**Step 2: Split by what things are.**
- Ask: "Go through what's in your folder. Which files are method (how you do the job), which are facts (clients, prices, sources), which are work in progress, and which are finished outputs?"
- Ask: "Does your folder keep those apart? If not, what would you move?"
- Instruction: "Ask the work session to move things so method, facts, work and outputs each have a clear home. Keep it small: move only what needs moving. It'll ask before it changes anything. Tell me when it's done."
- Inspect the new layout. Make sure no original source files were deleted.
- On the practice track there are real traps to catch: two October drafts that disagree (pumpkin loaf on the 7th vs the 14th, Saturday hours until 3 vs 4), and the confirmed answer hiding in `Untitled 3.txt` (9 to 4 from Oct 11, confirmed with Dana). A good split keeps one current draft in work, moves the older one out of the way, and gives the confirmed hours a single home under facts. If they miss it, ask: "If the AI read both drafts, which hours would it use?"

**Step 3: Label instructions and state.**
- Instruction: "Ask the work session: `List every file in this folder and label it instructions, state, or both.` Read what it says. Is there any file that's neither? Tell me."
- If there's a file that's neither: "That's the first one to question. Does it need to be here?"

**Step 4: Rewrite the map.**
- Instruction: "Now ask it to rewrite CLAUDE.md as a short routing map: what's here, where things go, naming rules, and one routing row per job from your list. One screen, no more. Tell me when it's done."
- Inspect `<ws>/CLAUDE.md`: a row for every job in the list (Job / Read / Skip / Use / Save to), every path named exists, naming rules present, and it fits on about one screen (roughly 40 lines or fewer). If it's bloated, have them cut it.

**Optional: ICM Architect.**
- If the user wants to try it, it's free at https://github.com/RinDig/icm-architect. They'd install it into the work session as a skill and say "make this an ICM". The practice track's `newsletter-mess/` is exactly the folder Jake demos it on. Remind them to read what it proposes and keep the smallest version that does today's job. This is optional; the lesson works without it.

**Step 5: Test it.**
- Instruction: "Open a fresh work session on `<ws>` so the desk is clean. Ask for one real job from your list in one short sentence. Watch what it opens. Tell me which files it read."
- Ask: "Did it open the right few files and skip the rest?" If it wandered, have them tighten that one row and test again. One retest is plenty.

**Artifacts:** `<ws>/CLAUDE.md` with one routing row per job; the jobs list on file; the folder split into method, facts, work and outputs.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `<ws>/CLAUDE.md` (short, a row per job, real paths) and the folder layout (method, facts, work and outputs have distinct homes).

2. Ask: "Your business adds a new client next month, and you change how you write replies. Which files change for each of those, and which stay exactly as they are?"

3. Record in `_tutor/progress.md`:
   - lesson: "2-2_design-your-folder"
   - artifacts_inspected: ["<ws>/CLAUDE.md", "<jobs list file>"]
   - comprehension.question: "Your business adds a new client next month, and you change how you write replies. Which files change for each of those, and which stay exactly as they are?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer keeps the two changes apart: a new client adds a facts file (a new client folder and notes) and touches nothing in the method; a new way of replying changes the skill (the method) and touches no client facts. The map probably doesn't change for either, or gains at most a line. On the practice track, the newsletter version: a new month adds a new draft (work) and maybe new confirmed hours (facts); a new way of writing changes `how we write these.md` (method). Translate to their own folder's terms if they're on their own work. A bad answer edits everything for both, or puts the new client's details into the skill.

5. Homework (optional): "List your jobs, split method, facts, work and outputs, write a short map with a routing table, and test it with one real request."
