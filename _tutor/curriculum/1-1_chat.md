# 1.1 Chat

<!-- Source: 2026-10 Foundations/03_1.1_Chat.md + full-course video transcript 4:23-11:16 -->

## Brief

What You'll Get From This

A real piece of work out of a chat, corrected until it's actually right, and a list of the corrections worth keeping. That list is what 1.2 is built on.

You need: Claude, ChatGPT or any mainstream AI. The free plan is fine.



What a chat can do right now

People are building real stuff in a chat. Little working apps: a pricing calculator, a dashboard off a spreadsheet, a game for their kid. They drop in a messy spreadsheet and get the chart and the summary back. Slide decks, research write-ups with the sources linked, all from one box.

Jake has been working with these models since the original BERT models, before ChatGPT existed. Back then he'd paste prompts in by hand, in a specific order, wait for the answer, check it, paste the next one. For his psychometrics research he wrote Python scripts that fired prompts at a bunch of models at once, over ten thousand responses. The stuff he built the hard way back then, he can now kick off with one short sentence, because all the complicated parts got written down into skills and folders underneath it.

That's the shape of the whole course. You start simple in a chat, build up the complicated stuff, and it folds back into one simple sentence with all that work behind it.



Where to click (checked 6 October 2026)

Go to claude.ai or chatgpt.com, or open the app, and sign in. The moves are almost the same in both.

The box in the middle is where everything goes.

The + on the box is how you hand it stuff: a PDF, a spreadsheet, a screenshot, a photo of your whiteboard. The microphone lets you talk instead of type. Jake uses it half the time.

Ask for something bigger (a one-pager, a chart, a small app) and it opens in a panel next to the chat. Claude calls these artifacts, ChatGPT calls its version canvas. Keep shaping it by talking: "make the header blue", "add a column for the date".

New chat sits at the top of the sidebar. New job, new chat.



The model is the brain

The model is the brain, the app is everything around it: what it can open, run and save. The same brain feels smarter in an app that can touch your files. This comes back in 1.3.



The desk

The AI only sees what's on its desk for this conversation. That's what you typed, what you attached, and a little memory. It has no idea who your clients are, how you like your emails, or what you meant by "the usual."

If it's not on the desk, it guesses. If you dump everything on the desk, it guesses which one you meant.

That's why an old chat drags the last job into the new one. If it has ever randomly brought up something from an hour ago, that's why. New job, new chat.



Every word in a prompt is a question

"Write a reply" hides reply how, reply as who, promise what. Formal or casual? Long or short? What do you usually promise people?

Something has to answer each one: a file you wrote, a connection to your stuff, or you. In a chat, the answer is you, every time.



The worked example

In the video it's a client email asking to move a workshop. Jake pastes it in and types: "Write a reply. I can't do the 14th but the 21st works. Keep it short."

What comes back is fine, but weirdly formal. It opens with "I hope this email finds you well," which nobody in history has ever meant. And it promises them the room, which isn't booked. So he corrects it in plain words: "too formal, I'd never say that", "don't promise the room yet", "just sign it Jake". Three corrections, and now it's something he'd send.

Every correction was a decision. Too formal is about his voice. The room is about what he actually knows, and that one's a big deal, because a wrong promise costs way more than a stiff sentence. The sign-off is about who he is to this person.



Where layer one starts to hurt

Next week another email comes in, and he's typing "too formal" again. "Don't promise things we haven't booked" again. "Sign it Jake" again.

Both apps can remember a little about you now, which is nice. But the app decides what it keeps, and your way of doing this job still isn't written down step by step anywhere you could hand to somebody else.

People fix that with saved prompts: a big one they paste in every time, or a doc full of favorites. That's the start of layer two. But you're still the one carrying everything from chat to chat. The move is to take the corrections you keep typing and write them down once, somewhere the AI can pick them up on its own. That's a skill, and that's 1.2.

One more word you'll hear a lot: agent. For now, just know that when the AI starts using tools on its own (opening files, running things, checking its own work, going again), that's what people mean. It's way less mysterious than it sounds. That's 1.3.

---

## Build

<!-- Runtime instructions for Claude, not prose delivered to the user -->

This lesson happens in the Claude chat app (claude.ai, or the Chat tab in the desktop app), not in Claude Code. See "Lessons that happen in the chat app" in INSTRUCTIONS.md. The free plan is fine.

**Step 1: Pick a real job.**
- Instruction: "Pick one real job you do, something small. A reply you owe someone, a summary of a document, a post you need to write. What's yours? If nothing comes to mind, use Jake's: a client asking to move a meeting."
- If they choose Jake's example, they can use `practice/client-email/inbox/2026-10-06-harbor-bakery.md` as the email. Show them its contents so they can paste it.

**Step 2: Open a new chat.**
- Instruction: "Open claude.ai (or the Chat tab in the desktop app) and start a new chat. New job, new chat. Tell me when it's open."

**Step 3: Paste in the job.**
- Instruction: "Paste in the material and ask for what you want in one or two lines, the way you'd normally ask. Jake's was: 'Write a reply. I can't do the 14th but the 21st works. Keep it short.' Send it and tell me what came back. Paste it here if you like."

**Step 4: Correct it until you'd actually use it.**
- Instruction: "Read it like you're about to send it. What's off? Tell it in plain words, like you'd tell a person. Keep going until it's something you'd actually send. Tell me each correction you make."
- Coach: if they accept the first draft, push once: "Would you send that exactly as is? Read it out loud. What would you change?" Most people find at least two.

**Step 5: Write the corrections down.**
- Instruction: "Paste me the corrections you made, one per line. I'll save them to `my-skills/corrections.md`."
- Save them to `my-skills/corrections.md` in this shape:

```
# Corrections

Job: [the job, one line]

- [correction 1]  (voice / facts / who I am to them)
- [correction 2]  (...)
```

- Then ask the user to tag each one: "For each correction, which kind of decision was it: your voice, what you actually know, or who you are to this person?" Add their tag in brackets.

**Artifact:** `my-skills/corrections.md`

---

## Check-in

<!-- Runtime instructions for Claude -->

1. Inspect `my-skills/corrections.md`. Verify: a named job, at least two corrections, and each correction tagged as voice, facts or who.

2. Ask: "Next week the same job comes in again. Which of these corrections would you have to type again, and what would it take so you didn't have to?"

3. Record in `_tutor/progress.md`:
   - lesson: "1-1_chat"
   - artifacts_inspected: ["my-skills/corrections.md"]
   - comprehension.question: "Next week the same job comes in again. Which of these corrections would you have to type again, and what would it take so you didn't have to?"
   - comprehension.answer: "[user's verbatim response]"
   - comprehension.pass: [true/false]

4. A good answer sees that most or all of the corrections would repeat (the desk is wiped every chat), and that the fix is writing them down once somewhere the AI picks them up. Any wording of "save it", "a saved prompt" or "a skill" passes. A bad answer assumes the app will just remember, or blames the AI ("it should know by now").

5. Homework (optional, Jake's not checking): "Pick one thing you do every week. Do it in a chat, and every time you correct it, write the correction down. Bring that list to 1.2. It's basically your first skill already."
