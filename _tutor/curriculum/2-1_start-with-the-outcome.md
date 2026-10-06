# 2.1 Start With the Outcome

<!-- Source: 2026-10 Foundations/08_2.1_Start_With_the_Outcome.md + full-course video transcript 27:57-32:36 -->

## Brief

What You'll Get From This

Who the job is really for, what they need to do next, and how to split the work sixty, thirty, ten before you touch any AI.

You need: one real job you'd like help with. No setup for this one.



The correction no writing fixes

Back in 1.1, the most important correction was "don't promise the room." No amount of better writing fixes that one, because the answer lives in a calendar. The AI wrote a perfectly confident reply about a room nobody had.



Sixty, thirty, ten

Jake's rule of thumb for designing anything with AI:

60: the data, the questions and the thinking. Knowing what's actually booked and what the client really needs.

30: the tools that already exist. Your calendar, your email, a spreadsheet. Some people solve problems with Excel better than any machine learning model.

10: the AI. Writing the reply.

Most people start with the ten, then wonder why it keeps promising rooms.



Rough on purpose

The numbers are rough on purpose. It's a way to think about the work.

If you've watched Jake's older videos, he used to split it more technically: code, routing and AI calls. Same instinct. He thinks the deeper fundamental is how he describes it now, because the sixty is where people actually get stuck.



Start with the question

Before you open a chat: what are you doing for people right now, and what would you do manually? Then four quick ones about your job:

Who is this actually for?

What do they need to do next? Decide something, send something, fix something.

Where does the information come from right now?

What breaks, and who feels it when it does?



You're helping someone decide

That first question matters more than it looks. Whatever you make, the report, the deck, the reply, you're helping someone make a decision.

If your boss needs to decide whether to hire someone, what they need is the three numbers that matter, on one page, before Friday. It usually pays off in speed to the decision, cost of the decision, or, the big one now, how people interact with the decision.



Worked example from the video

Every Monday you pull a bookings export and turn it into a table for the owner.

For: the owner.

Next step: chase the bookings still pending before the week fills up.

Information: one export from the booking system.

What breaks: pending bookings slip through and nobody notices.

The split: the sixty is knowing pending is what matters, the thirty is the export and a spreadsheet, the ten is the AI writing the owner a two-line heads-up. The table part turns into a script in 3.2.



Frame it right

How people understand a problem shapes what they build. That's the big idea in Gerald Weinberg's The Psychology of Computer Programming (1971): programming is a human activity, and how people understand the problem shapes what the software turns into. AI's exactly the same.

Frame the job as "write my emails" and you build an email writer. Frame it as "my clients need clear answers about dates" and you might fix your calendar first.



Solve the problem first

Solve the problem first, then turn it into software after, if you can. Build the smallest thing that gets you close, and check what the app already does before building anything. The chat already reads spreadsheets and makes charts, a Project already holds your files, a skill already remembers your corrections.

Add the next piece only when you hit a real need: the files keep changing, it's the same steps every week, or somebody else needs to use it.

One of Jake's: when he posts videos, the outcome is people finding stuff that actually teaches them something, and maybe joining the community. The sixty is knowing what to post, which hooks actually worked and who it's for, and that comes from his numbers and a lot of questions. The thirty is Metricool, which schedules everything across YouTube, TikTok, Instagram and LinkedIn. The ten is AI helping with scripts and captions. He still picks every title himself.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

No work session needed for this one. The user does the thinking and writes it down. You can type their answers into the file for them, but the answers must be theirs.

**Step 1: Pick the job.**
- Ask: "Pick one real job you'd like help with. It can be the one from your workspace, `<ws>`, or a different one. What is it, in one line?"
- If they're on the practice folder and have no job of their own, use the Monday bookings table from the lesson: `<ws>/exports/` has two weeks of exports.

**Step 2: The opening question.**
- Ask: "What are you doing for people with this job right now, and what would you do if you did it by hand?"

**Step 3: The four questions, one at a time.**
- "Who is this actually for?"
- "What do they need to do next? Decide something, send something, or fix something?"
- "Where does the information come from right now?"
- "What breaks, and who feels it when it does?"
- Push for specifics. "My team" is weak; "Priya, the owner, every Monday morning" is strong. "It saves time" is weak; "pending bookings slip through and nobody notices until a slot goes empty" is strong.

**Step 4: Split it.**
- Ask: "Now split it. What's the sixty: the data, the questions and the thinking? What's the thirty: the tools that already exist? What's the ten: the part the AI actually does?"
- Coach: if their ten is the whole job ("the AI does the report"), ask: "What does it need to know to get that right, and where does that knowledge live?" That's usually the sixty they skipped.
- Ask: "Is there anything the app can already do here without you building anything?"

**Step 5: Write it down.**
- Save their answers to `<ws>/outcome.md`:

```
# Outcome: [job]

What I do for people now: ...
By hand, I'd: ...

For: ...
Next step they take: ...
Information comes from: ...
What breaks, and who feels it: ...

60 (data, questions, thinking): ...
30 (tools that already exist): ...
10 (the AI): ...
```

- Instruction: "I've written it to `<ws>/outcome.md`. Open it and read it. Fix anything that isn't how you'd say it."

**Artifact:** `<ws>/outcome.md`

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `<ws>/outcome.md`: all four questions answered with specifics, and a 60 / 30 / 10 split where the 10 is clearly the smallest part.

2. Ask: "Look at your sixty. If you'd skipped it and gone straight to the AI, what would have gone wrong first?"

3. Record in `_tutor/progress.md`:
   - lesson: "2-1_start-with-the-outcome"
   - artifacts_inspected: ["<ws>/outcome.md"]
   - comprehension.question: "Look at your sixty. If you'd skipped it and gone straight to the AI, what would have gone wrong first?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer names a concrete failure that comes from missing data or thinking, not from bad writing: the AI confidently gets a fact wrong, or answers the wrong question, or produces something the person can't decide anything with. That's "promising the room." A bad answer says the writing would have been worse, or that nothing would go wrong.

5. Homework (optional): "Pick one job, answer the four questions, and split it sixty, thirty, ten. Write it down, because 2.2 builds the folder around exactly that." It's in `outcome.md` now.
