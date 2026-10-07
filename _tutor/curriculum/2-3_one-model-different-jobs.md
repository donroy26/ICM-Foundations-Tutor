# 2.3 One Model, Different Jobs

<!-- Source: 2026-10 Foundations/10_2.3_One_Model_Different_Jobs.md + full-course video transcript 37:26-40:54 -->

## Brief

What You'll Get From This

How one model plays every role your work needs, where code and connections fit in, and the handful of times a team of separate agents actually earns its keep.

You need: the folder you designed in 2.2.



The role comes from what it reads

Back in 1.3, agents were called a naming convention. Here's what that looks like for real.

Jake's animation folder's map has a row for each job: make a new video, write a Short, schedule a finished one, fix the animation kit, make a video in the hand-drawn style. Completely different jobs, and it's the same model every time, reading a different row.



A name on the door

So when people say they need a writing agent, a scheduling agent and a research agent, most of the time what they need is the instructions for each job written down and a map that sends each request to the right ones.

A lot of frameworks push you to build a separate agent for every job. Jake would rather have Claude Code become the agent you need, right there in the workspace. The role comes from what it reads. A name on the door adds zero instructions and zero access.



Try it

Give your folder two different jobs back to back, for example "reply to this email" and then "make me a table of every booking this month". Watch what it opens for each. Different rows, different files, same model.



Not every job is the model's

In Jake's folder the model lines up what Jake's picked to post, a connection to Metricool does the scheduling, and rendering is a command that does the exact same thing every time.

The model's great at reading the situation and choosing. The tools do the doing. 3.2 turns more of your own steps into tools.



When more than one agent earns it

Lots of independent work that can run at the same time, like researching ten companies at once.

One job big enough to bury everything else on the desk.

Something live that needs watching the whole time.

While Jake was writing this course, one helper pulled quotes out of old talks and another checking the product facts, both at the same time, because neither job needed the other.



The simplest version

The simplest version is opening a second session on the same folder, so one writes while the other does something else. Same folder, no framework. You've already been doing a version of this with your tutor and your work session.

Claude Code can also hand a chunk of work to a sub-agent and get back just the answer, so its own desk stays clean.



Every extra agent costs you

More tokens, more waiting, more places for things to go sideways as they hand work to each other.

Start with one, and split off a helper when you can point at the exact job it takes off the desk. Anthropic's Building effective agents says the same: start with the simplest setup that works, and sometimes that means no agent at all.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

**Step 1: Two jobs, back to back.**
- Pick two different jobs from the routing table in their map. Practice track: back to `client-email/` (`<ws>` is `client-email/` again). Put Jake's full map in now: copy `practice/client-email/CLAUDE.md` over theirs, after saving theirs as `client-email/_my-first-map.md` so nothing is lost. Jake's map has the bookings-table row this lesson needs. The two jobs, as in the video: "reply to the Lumen Dental email" and "make me a table of every booking this month".
- Instruction: "Open a fresh work session on `<ws>`. Give it the first job in one short sentence. Watch what it opens and tell me the files. Approve the save."
- Instruction: "Now, same session, give it the second job. Watch what it opens. Tell me the files."
- Inspect both outputs in `<ws>`.

**Step 2: Compare.**
- Ask: "Different rows, different files, same model. What did it read for the first job that it didn't touch for the second?"
- If both jobs read the same pile of files, the routing rows are too loose. Have them tighten whichever row over-reads, then repeat that one job.

**Step 3: Find the doing.**
- Ask: "In either job, was there a part that should be a tool, not the model? Something that does the exact same thing every time, or a connection to an app you already use?" Write their answer into their `outcome.md` (practice track: `weekly-report/outcome.md`) under `## Tools, not the model`. This sets up 3.2.

**Step 4: Find the job that could run on its own.**
- Ask: "Is there one job in your list that could run on its own, at the same time as everything else, because it doesn't need anything from the others?" Add it to their `outcome.md` (practice track: `weekly-report/outcome.md`) under `## Could run in parallel`. It's fine if the honest answer is "not yet". Jake: start with one.

**Artifacts:** two outputs in `<ws>` from two different jobs; their `outcome.md` (practice track: `weekly-report/outcome.md`) with the two new sections.

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect the two outputs and the two new sections of their `outcome.md` (practice track: `weekly-report/outcome.md`).

2. Ask: "Someone on your team says, 'We should set up a research agent, a writing agent and a scheduling agent.' What would you ask them, and what would you suggest instead?"

3. Record in `_tutor/progress.md`:
   - lesson: "2-3_one-model-different-jobs"
   - artifacts_inspected: ["<output 1>", "<output 2>", "<ws>/outcome.md"]
   - comprehension.question: "Someone on your team says, 'We should set up a research agent, a writing agent and a scheduling agent.' What would you ask them, and what would you suggest instead?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer suggests one folder with the instructions for each job written down and a routing row per job, so one model plays each role; scheduling probably goes to a tool or connection, not a model. They'd only split off a separate agent for independent parallel work, a job that would bury the desk, or something live, and they can name which. A bad answer agrees to three agents with no reason, or thinks the agent's name is what makes it good at the job.

5. Homework (optional): "Give your folder two different jobs and watch what it reads for each. Then find one job that could run on its own, at the same time as everything else."

6. Phase E: this is a section boundary, the end of module 2. Next up is 3.1 Stages You Can Step Into. Deliver the restart phrasing.
