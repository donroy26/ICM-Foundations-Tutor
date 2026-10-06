# 3.3 Keep It Useful and Hand It On

<!-- Source: 2026-10 Foundations/14_3.3_Keep_It_Useful_and_Hand_It_On.md + 24_Where_to_Go_Next.md + full-course video transcript 49:55-54:04 -->

## Brief

What You'll Get From This

A way to check if your workspace has gone stale, what to clear out, one home for every fact, and how to hand the whole thing to someone who can actually pick it up.

You need: a workspace you've been using for a while, or the one you built in module 2.



The swamp

AI makes it really easy to make a lot of stuff: drafts, versions, notes, summaries of the summaries. The folder that felt amazing in week one can be a swamp by week six, where the AI finds three prices for the same thing and picks the old one.

Jake's workspace has a folder called _archive, and the map describes it in five words: retired work, never read it. Old versions, old experiments, stuff that worked once and doesn't anymore, all go there, out of the way, and the AI never wastes a second on it.



Check one: the fresh-session test

A cousin of the routing test from 2.2. Open a brand new session and ask: what is this folder, what's in progress, and what's next?

If it gets that wrong, your map is out of date. Better to learn that from a test than from a confused client.



Check two: one home for every fact

Prices in three files will drift. Keep each fact in one place and point everything else to it.

Same with skills. When the way you do something changes, fix the skill file, and every job that uses it picks up the change.



Check three: clear stuff out

Retired work goes in an archive. Delete the generated stuff nobody will use, and don't be afraid to delete and restart. We get attached to files because of how long they used to take to make, and they just don't take that long anymore.

Keep your hands off the originals, your sources, and anything that belongs to someone else. On Manual mode it asks before it changes anything.



Hand it on

The map that tells the AI where everything is tells a new person the same thing. Somebody joins your team, you hand them the folder, they read CLAUDE.md, and they know what's where and what to do first. Same as the AI did.

The test Jake gives people: if he turned off the AI tomorrow, could you still find your way around these files and do the work? If yes, that's a good structure.

Hand over a copy: zip it or drop it in a shared drive. Great for templates. Or work in one shared place: a synced drive, or Git if you want every change tracked. That's more powerful, and you'll need to agree on who changes what. Who can open it at all is a permissions question. The folder doesn't decide that for you.



Why Jake bets on folders

Files and folders have been around since the sixties. Unix made them the backbone of computing in the seventies, and they've made it through every big shift since: the PC, the internet, phones, the cloud.

Next week some other company will have the better model. What stays yours is your files, your context, your data. Point the new model at the same folder, maybe rename the map file, maybe tweak a skill, and keep going. It's a bet, and it's one Jake's happy to make, because he wants to teach the stuff that lasts.



That's Foundations

You started in a chat, saved what worked as a skill, gave it a folder and one agent, designed a workspace around your own outcome, put your judgment where it counts, turned the steady parts into code, and now you can keep it alive and hand it on.

Simple, then complex, then simple again, with all your work sitting right underneath.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

**Step 1: The fresh-session test.**
- Instruction: "Open a brand new work session on `<ws>`. Ask it exactly this: `What is this folder, what's in progress, and what's next?` Paste me its answer."
- Compare its answer with what you know from progress.md and the files. Ask the user: "Did it get that right?" If anything's wrong or missing, that's the map telling them what to fix. Have them fix the map in the work session and rerun the question once.

**Step 2: One home for every fact.**
- Instruction: "In the work session, ask: `Find any fact that lives in more than one file here, like a price, a date or a name, and list where each copy is.` Tell me what it finds."
- For the practice folder, prices live in `about-me.md` and in each client's notes. A fair answer: keep the standard prices in one place and have the notes point to it, or treat each client's agreed price as a separate fact (it's what that client agreed). Let the user decide which and have the work session make the change.
- If the skill repeats facts (a price, a name) that also live elsewhere, have them take the fact out of the skill. The skill is method; facts live in one home.

**Step 3: Make the archive.**
- Instruction: "Ask the work session to make an `_archive/` folder and add a line to the map describing it in five words: `retired work, never read it.` Tell me when it's in."
- Instruction: "Now look around your folder. Old drafts, test outputs, earlier versions? Move anything retired into `_archive/`. Delete generated stuff nobody will use. Leave originals, sources, and anything that's someone else's alone. It'll ask before it changes anything."
- Inspect: `<ws>/_archive/` exists, the map line is there, no source files were deleted (for the practice folder: `about-me.md`, `clients/`, `inbox/` and `exports/` are all intact).

**Step 4: The hand-on test.**
- Ask: "Imagine the AI is turned off tomorrow. Open your CLAUDE.md yourself and read it like you've never seen this folder. Could you find your way around and do the work? What's the first thing that would trip someone up?"
- If they name something, have them fix it in the map.
- Ask: "If you handed this to someone, would you hand them a copy, or work in one shared place? Why?"

**Artifacts:** `<ws>/_archive/` with its map line; the map corrected after the fresh-session test; facts consolidated.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `<ws>/CLAUDE.md` (archive line present, accurate after the fresh-session test), `<ws>/_archive/`, and spot-check that each repeated fact now has one home.

2. Ask: "Six months from now a better model comes out from a different company. Walk me through what you'd actually do with this folder."

3. Record in `_tutor/progress.md`:
   - lesson: "3-3_keep-it-useful"
   - artifacts_inspected: ["<ws>/CLAUDE.md", "<ws>/_archive/"]
   - comprehension.question: "Six months from now a better model comes out from a different company. Walk me through what you'd actually do with this folder."
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]
   - current_lesson: "done"

4. A good answer points the new tool at the same folder, maybe renames the map file (CLAUDE.md to AGENTS.md, say), maybe tweaks a skill, runs the fresh-session test, and keeps going. The work, the context and the data are theirs and don't change. A bad answer rebuilds from scratch, or thinks the work lives inside the AI app.

## Final Close

<!-- Runtime instructions for Claude. This replaces Phase E for the last lesson. -->

1. Write progress.md with `current_lesson: "done"`.

2. Congratulate them in one or two plain sentences. Name what they built, using their actual files: the corrections and skill (if they did 1.1 and 1.2), their workspace `<ws>` with its map, the stages, the script, the archive.

3. Give Jake's homework, one line: "Go build something, then show him: post it in the community. He loves seeing what people make."

4. Where to go next. Offer these routes from Jake's Where to Go Next page, briefly, and let them pick:
   - Redo any lesson on your own work: 1.3 for a new folder, 2.1 and 2.2 to build around a real job, 3.2 to automate a steady step.
   - More examples, in the Skool classroom: AI Animations & Workflows (an idea through a brief, voice, storyboard and finished video), Set Up Codex for Browser Work, Custom UI, Remote Access (check the current setup and permissions before making a workspace reachable remotely).
   - Working with a team: start with a folder that does one job well; 2.3, 3.1 and 3.3 cover when another agent earns its place, keeping work inspectable, and handing it over.
   - Going deeper: Live Lessons (including The Full Walkthrough) and History and Concepts.
   - Learning from other members: Bas Rosario (The Wise Architect, prompt and context engineering), David Vogel (David's Corner, curated tools and member workflows), and Don Roy (The Master Builder, Back to Basics) in the Legends section.

5. If they started at 1.3 and skipped 1.1 and 1.2, mention those are in the Skool classroom whenever they want them.

6. Sign off: "That's Foundations. Happy learning."
