/* HAND-AUTHORED game script. One entry per lesson. Translates each curriculum
   file's Build/Check-in runtime instructions into playable beats. Voice follows
   _tutor/PERSONA.md: plain, direct, no filler, no banned phrases, no emoji.
   Every workspace path threads through ${ws}, the linter enforces it. The only
   exceptions are the fixed folders that live outside the workspace, exactly as
   in the CLI tutor: my-skills/, setup-test/ and practice/.
   Lint + regenerate content with: node v2/tools/build-content.mjs

   The game plays every lesson on the practice folder (practice/client-email in
   the repo), so the simulated Claude's replies can be scripted around it. */

(function () {

  // ---- practice folder contents (mirror of practice/client-email/) ----------
  var ABOUT_ME = "# About me\n\nI'm Sam Ortiz. I run hands-on workshops for small teams: half-day and full-day sessions, in person at a rented studio or at the client's office.\n\nHow I work:\n\n- I book the studio room separately, after a client confirms a date. Until the room is booked, I never promise it.\n- Prices: half day $1,200, full day $2,000. Travel outside the city is extra and quoted separately.\n- I answer email in the morning. Clients usually hear back within one working day.\n- I write short and plain. First names. I sign off \"Sam\".\n";
  var HARBOR_NOTES = "# Harbor Bakery\n\nContact: Priya Nair, owner. Prefers first names, short emails.\n\nAgreed so far:\n\n- Half-day workshop for 8 staff, \"Getting your recipes and orders into one place\".\n- Originally booked for Wednesday 14 October, 9am to 1pm.\n- Price agreed: $1,200 (half day). Invoice goes out after the session.\n- Studio room: NOT booked yet. I hold off until the date is final.\n\nOpen questions:\n\n- Whether they want the session recorded.\n";
  var NORTHWIND_NOTES = "# Northwind Studio\n\nContact: Marcus Lee, operations lead. A bit more formal than most, but still first names.\n\nAgreed so far:\n\n- Full-day workshop for 12 people, at their office (not the studio).\n- Date confirmed: Friday 30 October, 9am to 5pm.\n- Price agreed: $2,000 (full day). 50% deposit paid on 1 October.\n- They provide the room and the screen. I bring printed handouts.\n\nOpen questions:\n\n- Final headcount. They said \"12, maybe 14\". Handouts need the number by 27 October.\n";
  var HARBOR_EMAIL = "From: Priya Nair <priya@harborbakery.example>\nSubject: Moving our workshop?\n\nHi Sam,\n\nSomething's come up with a supplier delivery on the 14th and half the team won't be in. Any chance we can move the workshop to later in the month? We're flexible on the day.\n\nAlso, will we still be in the same room as last time? The team liked it.\n\nThanks,\nPriya\n";
  var NORTHWIND_EMAIL = "From: Marcus Lee <marcus@northwind.example>\nSubject: Headcount + parking\n\nHi Sam,\n\nQuick update: we're now at 14 for the 30th, not 12. Hope that's still fine.\n\nTwo questions. Is there anything people should bring? And do you need a parking spot? We can reserve one in the garage if you let me know by Friday.\n\nBest,\nMarcus\n";
  var BOOKINGS_0929 = "booking_id,client,session,date,status,attendees,price\nB-1041,Harbor Bakery,Half day,2026-10-14,confirmed,8,1200\nB-1042,Northwind Studio,Full day,2026-10-30,confirmed,12,2000\nB-1043,Fernhill Library,Half day,2026-10-09,pending,10,1200\nB-1044,Kettle & Co,Full day,2026-10-22,pending,6,2000\nB-1045,Bright Path Tutoring,Half day,2026-10-16,cancelled,5,1200\n";
  var BOOKINGS_1006 = "booking_id,client,session,date,status,attendees,price\nB-1041,Harbor Bakery,Half day,2026-10-14,confirmed,8,1200\nB-1042,Northwind Studio,Full day,2026-10-30,confirmed,14,2000\nB-1043,Fernhill Library,Half day,2026-10-09,confirmed,10,1200\nB-1044,Kettle & Co,Full day,2026-10-22,pending,6,2000\nB-1045,Bright Path Tutoring,Half day,2026-10-16,cancelled,5,1200\nB-1046,Oak Lane Dental,Half day,2026-10-28,pending,9,1200\nB-1047,Riverside Makers,Full day,2026-11-04,pending,15,2000\n";

  var SKILL = "---\nname: how-i-reply\ndescription: Use when replying to client emails. Writes a short, casual reply in Sam's voice and never promises a date, room or price that the client's notes don't confirm.\n---\n# How I reply\n1. Match their length. A three-line email gets a three-line reply.\n2. Keep it short and casual. Never open with \"I hope this email finds you well\".\n3. Answer what they asked, first.\n4. Never promise a date, a room or a price unless the client's notes confirm it. If they don't, say we'll confirm it and by when.\n5. Sign it \"Sam\".\n";

  var MAP_FIRST = "# client-email\n\nSam Ortiz's client email folder. Workshops for small teams.\n\n## What's here\n- about-me.md: who Sam is and how Sam works\n- clients/<client>/notes.md: what's agreed with each client\n- inbox/: emails waiting for a reply\n- drafts/: replies for Sam to read and send\n- exports/: bookings exports from the booking system\n- .claude/skills/how-i-reply/: the reply skill\n\n## Naming\n- Drafts: drafts/YYYY-MM-DD-client-N.md\n";

  var MAP_ROUTED = "# client-email\n\nSam Ortiz's client email folder. Workshops for small teams.\n\n## What's here\n- about-me.md: who Sam is (method + facts)\n- clients/<client>/notes.md: facts, one home per client\n- inbox/: work waiting\n- drafts/, heads-up/: outputs for Sam to read\n- exports/: facts from the booking system\n- .claude/skills/how-i-reply/: method\n\n## Naming\n- Drafts: drafts/YYYY-MM-DD-client-N.md\n- Heads-ups: heads-up/YYYY-MM-DD.md\n\n## Routing\nJob: reply to email (\"check my email\")\nRead: about-me.md, the client's notes.md, each email in inbox/\nSkip: other clients' notes, exports/\nUse: how-i-reply\nSave to: drafts/\n\nJob: weekly bookings heads-up (\"make the heads-up\")\nRead: the newest file in exports/\nSkip: clients/, inbox/, drafts/\nUse: nothing extra. Two lines for the owner: what's still pending\nSave to: heads-up/\n\n## Rules\n- Never send anything.\n- If the client's notes don't confirm something, say so in the draft.\n";

  var MAKE_TABLE = "\"\"\"Turn a bookings export into the weekly table.\n\nUsage: python scripts/make-table.py exports/bookings-YYYY-MM-DD.csv\nOne input (the export), one output (tables/YYYY-MM-DD.md).\n\"\"\"\nimport csv, os, sys\n\nsrc = sys.argv[1]\ndate = os.path.basename(src).replace(\"bookings-\", \"\").replace(\".csv\", \"\")\nwith open(src, newline=\"\") as f:\n    rows = list(csv.DictReader(f))\n\nlines = [\"# Bookings, week of \" + date, \"\",\n         \"| Client | Session | Date | Status |\", \"|---|---|---|---|\"]\nfor r in rows:\n    lines.append(\"| {client} | {session} | {date} | {status} |\".format(**r))\npending = [r[\"client\"] for r in rows if r[\"status\"] == \"pending\"]\nlines += [\"\", \"Pending: \" + str(len(pending)) + \" (\" + \", \".join(pending) + \")\"]\n\nos.makedirs(\"tables\", exist_ok=True)\nout = os.path.join(\"tables\", date + \".md\")\nwith open(out, \"w\") as f:\n    f.write(\"\\n\".join(lines) + \"\\n\")\nprint(\"wrote \" + out)\n";

  var TABLE_1006 = "# Bookings, week of 2026-10-06\n\n| Client | Session | Date | Status |\n|---|---|---|---|\n| Harbor Bakery | Half day | 2026-10-14 | confirmed |\n| Northwind Studio | Full day | 2026-10-30 | confirmed |\n| Fernhill Library | Half day | 2026-10-09 | confirmed |\n| Kettle & Co | Full day | 2026-10-22 | pending |\n| Bright Path Tutoring | Half day | 2026-10-16 | cancelled |\n| Oak Lane Dental | Half day | 2026-10-28 | pending |\n| Riverside Makers | Full day | 2026-11-04 | pending |\n\nPending: 3 (Kettle & Co, Oak Lane Dental, Riverside Makers)\n";

  FC.directives = {

  // ===========================================================================
  "0-0_start-here": {
    intro: [0],
    build: [
      { type: "note",
        learn: [1],
        guide: ["One thing before we start. The real tutor runs in Claude Code, a coding environment, so it starts most people at 1.3, where the AI works inside your files.",
          "In here, everything is simulated, so we play all of it in order: the chat layers first, then the folders. You'll see why each layer exists by feeling the one before it."],
        button: "Makes sense", xp: 5,
        check: {
          q: "What are the three layers really about?",
          options: [
            { t: "How you organize and reuse your work: chat, then skills, then folders with one agent.", correct: true },
            { t: "Three paid tiers of the same AI app." },
            { t: "Three different AI models, from weakest to strongest." },
            { t: "Beginner, intermediate and expert prompting." }
          ],
          explain: "The layers are about organizing and reusing your work, not about the model. That's why there's no ceiling on them. Layer 3 goes as advanced as you want."
        } },
      { type: "picker", storeAs: "00-entry", eyebrow: "Where are you at?",
        learn: [2, 3],
        q: "On your real machine, which fits you best right now?",
        options: [
          { t: "I've only really asked AI questions so far." },
          { t: "I correct AI in chats a lot, but I've never made a skill." },
          { t: "I already use skills, saved prompts or Projects." }
        ],
        xp: 5 }
    ],
    checkin: {
      artifacts: [],
      quiz: {
        q: "You retype the same instructions into a fresh chat every Monday. Which layer are you at, and what's the next move?",
        options: [
          { t: "Layer 1. Write the instructions down once, somewhere the AI picks them up on its own: a skill.", correct: true },
          { t: "Layer 3. You're already using AI every week." },
          { t: "Layer 1. Switch to a smarter model so it remembers." },
          { t: "None. Retyping is just how AI works." }
        ],
        explain: "Retyping into a blank chat is layer 1: you answer every question yourself, every time. Writing it down once is layer 2."
      },
      reflect: {
        prompt: "Name one thing you do every week that you'd love to hand off.",
        saveTo: "my-skills/.notes/weekly-job.md"
      }
    },
    xpLessonComplete: 30
  },

  // ===========================================================================
  "1-1_chat": {
    intro: [0],
    build: [
      { type: "seed-files",
        guide: "I put a practice email on the desktop: a client asking to move a workshop. Everything in the practice folder is made up. Open it in the explorer and read it before we start.",
        button: "Read it",
        files: [
          { path: "practice/client-email/inbox/2026-10-06-harbor-bakery.md", content: HARBOR_EMAIL }
        ],
        xp: 5 },
      { type: "claude-open", mode: "chat",
        learn: [1, 2],
        guide: "Open the Claude window from the taskbar. For this lesson it's the chat app: no folder, just the box.",
        xp: 5,
        check: {
          q: "The same model feels smarter in one app than another. Why?",
          options: [
            { t: "The model is the brain. The app around it decides what it can open, run and save.", correct: true },
            { t: "Each app runs a secretly different model." },
            { t: "Paid apps get a bigger brain." },
            { t: "It doesn't. That's just a feeling." }
          ],
          explain: "Same brain, different app around it. An app that can touch your files lets the same brain do more. That's 1.3."
        } },
      { type: "claude-chat",
        learn: [3, 4],
        guide: "New job, new chat. Ask for the reply the way you'd normally ask. Jake's was short: write a reply, the 14th doesn't work but the 21st does, keep it short.",
        script: [{
          suggestedPrompt: "Write a reply. I can't do the 14th but the 21st works. Keep it short.",
          acceptIf: { mentionsAnyOf: ["reply", "write", "21"], mentionsAllOf: [] },
          rejectHint: "Ask it for the reply, and give it the one fact only you know: which date works.",
          reply: {
            thinkingLines: ["reading the email you pasted"],
            text: "Dear Priya, I hope this email finds you well. Thank you for reaching out. Unfortunately the 14th is no longer possible, however I am pleased to confirm Wednesday the 21st, and yes, the same studio room will be ready for your team. Kind regards.",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "\"Write a reply\" looks like a clear prompt. What's hiding in it?",
          options: [
            { t: "Questions: reply how, reply as who, promise what. Something has to answer each one.", correct: true },
            { t: "Nothing. Short prompts are always clear." },
            { t: "A request for a longer email." },
            { t: "A hidden instruction to be formal." }
          ],
          explain: "Every word in a prompt is a question. In a chat, the answer is you, every time."
        } },
      { type: "claude-chat",
        learn: [5],
        guide: "Read it like you're about to send it. It's stiff, and it promised the room, which isn't booked. Correct it in plain words, the way you'd tell a person.",
        script: [{
          suggestedPrompt: "Too formal, I'd never say that. Don't promise the room yet. Just sign it Sam.",
          acceptIf: { mentionsAnyOf: ["formal", "room", "sign", "casual", "short"], mentionsAllOf: [] },
          rejectHint: "Tell it what's off: the tone, the promise about the room, how you sign off.",
          reply: {
            thinkingLines: ["rewriting"],
            text: "Hi Priya, no problem. The 14th won't work now, but the 21st does. I'll confirm the room once the date's locked in and get back to you by Friday. Sam",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "\"Don't promise the room yet\" is the big correction. Why?",
          options: [
            { t: "It's about what you actually know. A wrong promise costs far more than a stiff sentence.", correct: true },
            { t: "Rooms are always a sensitive topic with clients." },
            { t: "It makes the email shorter." },
            { t: "The AI isn't allowed to talk about rooms." }
          ],
          explain: "Too formal is your voice. The room is what you actually know. The sign-off is who you are to this person. Each correction was a decision."
        } },
      { type: "create-file", path: "my-skills/corrections.md",
        learn: [6],
        guide: "Write the corrections down. Next week the same job comes in and you'd type them all again. The list types itself in. Tag each one, then save.",
        typedContent: "# Corrections\n\nJob: reply to client emails\n\n- Too formal, I'd never say that  ([VOICE, FACTS OR WHO])\n- Don't promise the room yet  ([VOICE, FACTS OR WHO])\n- Sign it Sam  ([VOICE, FACTS OR WHO])\n",
        fillFields: ["VOICE, FACTS OR WHO"],
        xp: 20, achievement: "first-corrections",
        check: {
          q: "Both apps can remember a little about you now. Why write the corrections down anyway?",
          options: [
            { t: "The app decides what it keeps. Your way of doing the job still isn't written down anywhere you could hand to someone.", correct: true },
            { t: "Memory only works on the paid plan." },
            { t: "You don't need to. Memory covers it." },
            { t: "Written corrections make the model faster." }
          ],
          explain: "Memory is nice, but it isn't your process. Written down once, the corrections become a skill. That's 1.2."
        } }
    ],
    checkin: {
      artifacts: ["my-skills/corrections.md"],
      quiz: {
        q: "Next week another client email comes in. What happens if all you have is the chat?",
        options: [
          { t: "You type the same corrections again. The desk is wiped every chat.", correct: true },
          { t: "Claude remembers last week's corrections automatically." },
          { t: "The second reply is always better on its own." },
          { t: "Nothing. One good reply trains the model." }
        ],
        explain: "A chat only sees what's on its desk. Every new chat starts clean. That's where layer one starts to hurt."
      },
      reflect: {
        prompt: "What's one correction you find yourself typing into AI over and over in your real work?",
        saveTo: "my-skills/.notes/1-1-reflection.md"
      }
    },
    xpLessonComplete: 50
  },

  // ===========================================================================
  "1-2_skills": {
    intro: [0],
    build: [
      { type: "open-file", path: "my-skills/corrections.md",
        learn: [1, 2],
        guide: "Open your corrections from 1.1. That list is about to become a skill.",
        xp: 5,
        check: {
          q: "You have a hundred skills installed. Why doesn't that clutter the desk?",
          options: [
            { t: "The AI only sees names and descriptions until a request matches one. Then it opens just that one.", correct: true },
            { t: "It reads all hundred every time, but very fast." },
            { t: "Only ten skills can be installed at once." },
            { t: "Skills don't use the desk at all." }
          ],
          explain: "Names and descriptions sit on the desk. The full skill opens only when your request matches. That's the desk, kept clean."
        } },
      { type: "claude-chat",
        learn: [3, 4],
        guide: "New chat. Ask for a skill for this job and paste in your corrections. It will interview you.",
        script: [{
          suggestedPrompt: "I want a skill for replying to client emails. My corrections: too formal, don't promise the room yet, sign it Sam.",
          acceptIf: { mentionsAnyOf: ["skill"], mentionsAllOf: [] },
          rejectHint: "Ask for a skill, by name: \"I want a skill for...\", then paste the corrections.",
          reply: {
            thinkingLines: ["drafting a skill from your corrections"],
            text: "A few questions first. When should this kick in: every client email, or only replies? Show me a reply you liked. And is there anything you never promise, beyond the room? Got it. Here's your SKILL.md. Read it before you save it.",
            effects: []
          }
        }],
        xp: 15 },
      { type: "create-file", path: "my-skills/how-i-reply/SKILL.md",
        learn: [5],
        guide: "Save the skill it handed you. It types itself in. Read it as it goes: is there any rule you never actually said? Fill the one blank with a rule of your own, then save.",
        typedContent: SKILL.replace("5. Sign it \"Sam\".\n", "5. Sign it \"Sam\".\n6. [ONE MORE RULE OF YOUR OWN]\n"),
        fillFields: ["ONE MORE RULE OF YOUR OWN"],
        xp: 25, achievement: "first-skill",
        check: {
          q: "The skill comes back with a rule you never said. What do you do?",
          options: [
            { t: "Tell it what to fix. It's your process now, so it should sound like you.", correct: true },
            { t: "Keep it. The AI probably knows best." },
            { t: "Delete the whole skill and start over." },
            { t: "Nothing. Extra rules can't hurt." }
          ],
          explain: "Sometimes it writes down a rule you never said, or turns one example into a law. Read it, and tell it what to fix. It's all just English."
        } },
      { type: "claude-chat",
        learn: [6],
        guide: "The test. Brand new chat, empty desk. Paste the next email and type only: reply to this.",
        script: [{
          suggestedPrompt: "reply to this",
          acceptIf: { mentionsAnyOf: ["reply"], mentionsAllOf: [] },
          rejectHint: "Keep it to the bare request. The skill is supposed to answer the rest.",
          reply: {
            thinkingLines: ["using skill: how-i-reply"],
            text: "Hi Marcus, 14 is fine, thanks for the update. Nothing to bring, I'll have printed handouts for everyone. I'll check on parking and let you know by Friday. Sam",
            effects: []
          }
        }],
        xp: 20,
        check: {
          q: "It said it was using your skill and you retyped nothing. What did the skill answer?",
          options: [
            { t: "The questions hiding in \"reply\": how, as who, and what never to promise.", correct: true },
            { t: "Which email client to use." },
            { t: "Nothing. The model just got lucky." },
            { t: "The client's facts, like the date and the price." }
          ],
          explain: "The skill answers how you reply to anybody. The client's facts belong somewhere else: a project."
        } },
      { type: "open-file", path: "my-skills/how-i-reply/SKILL.md",
        learn: [7, 8],
        guide: "Open your skill one more time. Is there any one client's fact in it, like a date or a price? There shouldn't be. Facts go in the project. Method goes in the skill.",
        xp: 5,
        check: {
          q: "Why keep the client's facts out of the skill?",
          options: [
            { t: "So the skill still works for the next client. Mix them and it starts promising every client the 21st.", correct: true },
            { t: "Skills have a strict length limit." },
            { t: "Facts make skills slower to load." },
            { t: "Client facts are private and skills are public." }
          ],
          explain: "A skill is how you do a kind of job. A project holds one area of your work. Keep them apart."
        } }
    ],
    checkin: {
      artifacts: ["my-skills/how-i-reply/SKILL.md"],
      quiz: {
        q: "You get a second client tomorrow. What changes?",
        options: [
          { t: "Nothing in the skill. The new client's facts go in their own project.", correct: true },
          { t: "You add the new client's details to the skill." },
          { t: "You write a second skill for the second client." },
          { t: "You turn the skill off for the new client." }
        ],
        explain: "The skill is how you reply to anybody. Each client's facts live with that client."
      },
      reflect: {
        prompt: "What's the next process from your real work you'd turn into a skill?",
        saveTo: "my-skills/.notes/1-2-reflection.md"
      }
    },
    xpLessonComplete: 50
  },

  // ===========================================================================
  "1-3_folders-one-agent": {
    intro: [0],
    build: [
      { type: "create-folder", parent: "", name: "client-email", storeAs: "workspaceName",
        learn: [1],
        guide: ["Layer 3. The AI works right inside a folder, so we need a folder. Use a copy the first time.",
          "Click New folder in the explorer and call it client-email. This is your copy of the practice folder."],
        xp: 15, achievement: "workspace-named",
        check: {
          q: "What is an agent, in one line?",
          options: [
            { t: "A model running tools in a loop to achieve a goal: read, do, look, decide, again.", correct: true },
            { t: "A separate, more expensive AI with its own personality." },
            { t: "A chatbot with a name and an avatar." },
            { t: "Software that only programmers can use." }
          ],
          explain: "Simon Willison's line. Research agent, writing agent, email agent: same model, different instructions, different tools."
        } },
      { type: "seed-files",
        learn: [3],
        guide: "I copied the practice files in, plus your skill from 1.2 under .claude/skills, so it travels with the folder. Open a couple in the explorer. They're just text.",
        button: "Had a look",
        files: [
          { path: "${ws}/about-me.md", content: ABOUT_ME },
          { path: "${ws}/clients/harbor-bakery/notes.md", content: HARBOR_NOTES },
          { path: "${ws}/clients/northwind-studio/notes.md", content: NORTHWIND_NOTES },
          { path: "${ws}/inbox/2026-10-06-harbor-bakery.md", content: HARBOR_EMAIL },
          { path: "${ws}/inbox/2026-10-06-northwind-studio.md", content: NORTHWIND_EMAIL },
          { path: "${ws}/exports/bookings-2026-09-29.csv", content: BOOKINGS_0929 },
          { path: "${ws}/exports/bookings-2026-10-06.csv", content: BOOKINGS_1006 },
          { path: "${ws}/.claude/skills/how-i-reply/SKILL.md", content: SKILL }
        ],
        xp: 10 },
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        learn: [2],
        guide: "Open the Claude window again. This time it's Claude Code, working in a folder. In the real setup this is your work session: a second window on just this folder.",
        folderPrompt: "Point it at client-email with the folder selector at the top. That's Code, then Local, then select your folder.",
        xp: 10 },
      { type: "claude-chat",
        learn: [4],
        guide: "You don't write the map from scratch. Ask it to look through the folder and write you one.",
        script: [{
          suggestedPrompt: "Look through this folder and write me a CLAUDE.md.",
          acceptIf: { mentionsAnyOf: ["claude.md", "map"], mentionsAllOf: [] },
          rejectHint: "Ask for the map by name: write me a CLAUDE.md.",
          reply: {
            thinkingLines: ["listing client-email/", "reading about-me.md", "reading clients/*/notes.md", "found skill: how-i-reply", "writing CLAUDE.md"],
            text: "Wrote CLAUDE.md: what the folder is for, what's where, and a naming rule for drafts. It has no routing yet. Read it and tell me what to fix.",
            effects: [{ writeFile: "${ws}/CLAUDE.md", content: MAP_FIRST }]
          }
        }],
        xp: 15 },
      { type: "edit-file", path: "${ws}/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        guide: "Read it, then add the most important part: one routing row. Five lines, plus the two rules. It types in below. Fill the blank and save.",
        typedContent: "\n## Routing\nJob: reply to email (\"check my email\")\nRead: about-me.md, the client's notes.md, each email in inbox/\nSkip: other clients' notes\nUse: how-i-reply\nSave to: [WHERE THE REPLIES GO]\n\n## Rules\n- Never send anything.\n- If the client's notes don't confirm something, say so in the draft.\n",
        fillFields: ["WHERE THE REPLIES GO"],
        xp: 20, achievement: "first-route",
        check: {
          q: "What does a routing row tell the agent?",
          options: [
            { t: "For this job: what to read, what to skip, which skill to use, and where to save.", correct: true },
            { t: "Which model to run for this job." },
            { t: "The exact words to put in every reply." },
            { t: "How fast to work." }
          ],
          explain: "That's the whole trick, and it's all English. The map is the floor plan on the wall."
        } },
      { type: "claude-chat",
        learn: [5],
        guide: "Now three words. Almost terrible prompting. Type check my email and watch what it opens.",
        script: [{
          suggestedPrompt: "check my email",
          acceptIf: { mentionsAnyOf: ["email", "inbox", "mail"], mentionsAllOf: [] },
          rejectHint: "Keep it short. Three words: check my email.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: routing row 'reply to email'", "reading about-me.md", "reading inbox/ (2 emails)", "reading clients/harbor-bakery/notes.md", "reading clients/northwind-studio/notes.md", "using skill: how-i-reply", "skipping exports/", "writing drafts/2026-10-06-harbor-bakery-1.md", "writing drafts/2026-10-06-northwind-studio-1.md"],
            text: "Two drafts in drafts/. Harbor Bakery: happy to move it, offered the 21st or 23rd, and said I'll confirm the room once the date's set, because their notes say it isn't booked. Northwind: 14 is fine, nothing to bring, parking question flagged for you. Nothing sent.",
            effects: [
              { writeFile: "${ws}/drafts/2026-10-06-harbor-bakery-1.md",
                content: "Hi Priya,\n\nNo problem at all. Would the 21st or the 23rd work for the team? Same time, 9 to 1.\n\nI'll confirm the room once we've locked the date in, and get back to you by Friday.\n\nSam\n" },
              { writeFile: "${ws}/drafts/2026-10-06-northwind-studio-1.md",
                content: "Hi Marcus,\n\n14 is fine, thanks for the heads-up. I'll bring printed handouts for everyone, so nothing to bring.\n\nOn parking: [SAM, DO YOU WANT THE GARAGE SPOT? ANSWER BY FRIDAY.]\n\nSam\n" }
            ]
          }
        }],
        xp: 25, achievement: "check-my-email",
        check: {
          q: "\"Check my email\" worked. What answered each word?",
          options: [
            { t: "Check: the skill. My: about-me. Email: the inbox folder. The folder answered the questions.", correct: true },
            { t: "The model guessed well." },
            { t: "A hidden longer prompt Claude adds for you." },
            { t: "Nothing needed answering. It's a simple request." }
          ],
          explain: "Every word in a prompt is a question. In layer 1 you answered them. Now files you wrote answer them."
        } },
      { type: "open-file", path: "${ws}/drafts/2026-10-06-harbor-bakery-1.md",
        learn: [6, 7, 8],
        guide: "Open the Harbor Bakery draft. It's just a file. You can change a word, delete it, or paste it into your email and send it yourself.",
        xp: 10,
        check: {
          q: "Your video scripts were sitting in this same folder. Why didn't they get in the way of the email job?",
          options: [
            { t: "The map put only what this job needs on the desk. Everything else stayed in the drawers.", correct: true },
            { t: "Claude can't read video scripts." },
            { t: "They would have. Never mix work in one folder." },
            { t: "It read them but ignored them, which costs nothing." }
          ],
          explain: "It's the desk again. Routing loads what this job needs and leaves the rest in the drawers."
        } }
    ],
    checkin: {
      artifacts: ["${ws}/CLAUDE.md", "${ws}/drafts/2026-10-06-harbor-bakery-1.md"],
      quiz: {
        q: "Your request reads the wrong files. Where do you look first?",
        options: [
          { t: "The routing row in the map. If it reads the wrong stuff, the map is telling you what to fix.", correct: true },
          { t: "Write a much longer, more detailed prompt." },
          { t: "Switch to a bigger model." },
          { t: "Delete the folder and start again." }
        ],
        explain: "Fix the row, not the prompt. A longer prompt is back to layer 1, answering everything yourself every time."
      },
      reflect: {
        prompt: "Which folder of your real work would you write a map for first, and what's the one job its first routing row would cover?",
        saveTo: "${ws}/.notes/1-3-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "1-4_pick-your-setup": {
    intro: [0],
    build: [
      { type: "picker", storeAs: "14-interface", eyebrow: "The four pieces",
        learn: [1, 2],
        q: "On your real machine, which window do you expect to work in?",
        options: [
          { t: "The Claude desktop app" },
          { t: "Claude Code in VS Code or Cursor" },
          { t: "Claude Code in a terminal" },
          { t: "Codex, on the ChatGPT side" }
        ],
        xp: 5 },
      { type: "note",
        learn: [3, 4, 5],
        guide: "Whatever you picked: the model is the brain, the harness is the app around it, the interface is the window, and where it runs is the cloud, your computer, or both. Your folders come with you to most of them.",
        button: "Got it", xp: 5,
        check: {
          q: "You keep your files on your laptop and use Claude in the cloud. Is that a local setup?",
          options: [
            { t: "Your files are local, the model isn't. Those are two separate choices.", correct: true },
            { t: "Yes, fully local." },
            { t: "No, everything is in the cloud." },
            { t: "It depends on your internet speed." }
          ],
          explain: "Working on files locally and running the model locally are different choices. A local model trades some quality for privacy."
        } },
      { type: "create-folder", parent: "", name: "setup-test",
        learn: [6],
        guide: "Now prove a setup works with one tiny job. Make a folder at the top level called setup-test.",
        xp: 5 },
      { type: "seed-files",
        guide: "I dropped one file in it: a page of notes. One file, that's the whole test.",
        button: "Next",
        files: [
          { path: "setup-test/notes.md", content: "# Notes from the Oct 2 team call\n\n- Workshop sign-ups are up, mostly half days.\n- Two clients asked about recording sessions. Decide a policy before the 14th.\n- The studio raised its rate from November. Check before quoting anything after Oct.\n- Handouts: switch to one page per module, people lose the long packets.\n- Next call: Oct 16.\n" }
        ],
        xp: 5 },
      { type: "claude-open", mode: "chat", expectFolder: "setup-test",
        guide: "Point the Claude window at setup-test.",
        folderPrompt: "Switch the folder selector to setup-test.",
        xp: 5 },
      { type: "claude-chat",
        learn: [7],
        guide: "Ask it to read the file, write a one-page summary, and save it next to the original.",
        script: [{
          suggestedPrompt: "Read the file in this folder, write a one-page summary, and save it next to the original.",
          acceptIf: { mentionsAnyOf: ["summary", "summarize", "summarise"], mentionsAllOf: [] },
          rejectHint: "Ask for a summary, saved next to the original.",
          reply: {
            thinkingLines: ["reading notes.md", "writing summary.md"],
            text: "Saved summary.md next to notes.md. Open it yourself and check it.",
            effects: [{ writeFile: "setup-test/summary.md", content: "# Summary: Oct 2 team call\n\nSign-ups are up, mostly half days. Two things need a decision soon: a recording policy (two clients asked, decide before the 14th), and quotes for November onward, since the studio rate goes up. Handouts move to one page per module. Next call is Oct 16.\n" }]
          }
        }],
        xp: 15 },
      { type: "open-file", path: "setup-test/summary.md",
        guide: "Open the summary yourself. If you can open it, read it and change it, your setup works.",
        xp: 10, achievement: "tiny-test" }
    ],
    checkin: {
      artifacts: ["setup-test/summary.md"],
      quiz: {
        q: "A friend asks which AI setup to buy. What do you ask first?",
        options: [
          { t: "What they need, and what their company already has. Then count the whole cost, not just the subscription.", correct: true },
          { t: "Nothing. Tell them the one you use." },
          { t: "Which one is cheapest this month." },
          { t: "Which one has the newest model." }
        ],
        explain: "Pick by need. Check what's already in your company's tools. A cheaper tool that eats your Saturday costs you a Saturday."
      },
      reflect: {
        prompt: "Which setup will you run the tiny test on, on your real machine?",
        saveTo: "setup-test/.notes/1-4-reflection.md"
      }
    },
    xpLessonComplete: 40
  },

  // ===========================================================================
  "2-1_start-with-the-outcome": {
    intro: [0],
    build: [
      { type: "open-file", path: "${ws}/exports/bookings-2026-10-06.csv",
        learn: [1, 2],
        guide: "Module 2: build around a real job. Here's one. Every Monday, a bookings export gets turned into a table for the owner. Open this week's export.",
        xp: 5,
        check: {
          q: "Sixty, thirty, ten. Which part is the AI?",
          options: [
            { t: "The ten. The sixty is the data and the thinking, the thirty is the tools that already exist.", correct: true },
            { t: "The sixty. AI should do most of the work." },
            { t: "All of it, split three ways." },
            { t: "The thirty, because it's a tool." }
          ],
          explain: "Most people start with the ten, then wonder why it keeps promising rooms."
        } },
      { type: "create-file", path: "${ws}/outcome.md",
        learn: [3, 4, 5],
        guide: "Before any AI: the four questions. The outline types in. Fill every blank for this job, in your own words, then save.",
        typedContent: "# Outcome: weekly bookings heads-up\n\nFor: [WHO IS THIS ACTUALLY FOR]\nNext step they take: [WHAT THEY NEED TO DO NEXT]\nInformation comes from: [WHERE IT COMES FROM NOW]\nWhat breaks, and who feels it: [WHAT BREAKS]\n\n60 (data, questions, thinking): [THE SIXTY]\n30 (tools that already exist): [THE THIRTY]\n10 (the AI): [THE TEN]\n",
        fillFields: ["WHO IS THIS ACTUALLY FOR", "WHAT THEY NEED TO DO NEXT", "WHERE IT COMES FROM NOW", "WHAT BREAKS", "THE SIXTY", "THE THIRTY", "THE TEN"],
        xp: 30, achievement: "outcome-first",
        check: {
          q: "Why ask \"who is this actually for\" first?",
          options: [
            { t: "Whatever you make, you're helping someone make a decision. What they need decides what you build.", correct: true },
            { t: "So you know who to send the invoice to." },
            { t: "It's a formality before the real work." },
            { t: "So the AI can use their name." }
          ],
          explain: "If your boss needs to decide on a hire, they need the three numbers that matter, on one page, before Friday."
        } },
      { type: "open-file", path: "${ws}/outcome.md",
        learn: [6, 7],
        guide: "Read your outcome back. Is there anything the app already does here, without you building anything?",
        xp: 5,
        check: {
          q: "\"Write my emails\" versus \"my clients need clear answers about dates.\" Why does the framing matter?",
          options: [
            { t: "How you understand the problem shapes what you build. The second might mean fixing the calendar first.", correct: true },
            { t: "It doesn't. Both build the same thing." },
            { t: "The second one is just a longer prompt." },
            { t: "AI prefers longer descriptions." }
          ],
          explain: "Solve the problem first, then turn it into software after, if you can. Build the smallest thing that gets you close."
        } }
    ],
    checkin: {
      artifacts: ["${ws}/outcome.md"],
      quiz: {
        q: "You skip the sixty and go straight to the AI. What goes wrong first?",
        options: [
          { t: "It writes something confident and wrong, because the facts it needed were never on the desk.", correct: true },
          { t: "The writing is a bit worse." },
          { t: "Nothing. AI fills in the gaps." },
          { t: "It refuses to answer." }
        ],
        explain: "No amount of better writing fixes \"don't promise the room.\" The answer lives in the calendar: the sixty."
      },
      reflect: {
        prompt: "Pick one real job of yours. Who is it actually for, and what do they need to do next?",
        saveTo: "${ws}/.notes/2-1-reflection.md"
      }
    },
    xpLessonComplete: 50
  },

  // ===========================================================================
  "2-2_design-your-folder": {
    intro: [0],
    build: [
      { type: "edit-file", path: "${ws}/outcome.md", mode: "append", button: "Open outcome.md",
        learn: [1, 2],
        guide: "List the jobs that get you to the outcome. For each one: what it reads, what it makes. That list is basically your folder already. Fill the blanks and save.",
        typedContent: "\n## Jobs\n- Reply to client emails. Reads: about-me, the client's notes, the inbox. Makes: drafts.\n- Weekly bookings heads-up. Reads: [WHAT IT READS]. Makes: [WHAT IT MAKES].\n",
        fillFields: ["WHAT IT READS", "WHAT IT MAKES"],
        xp: 15,
        check: {
          q: "When Jake says ICM, what does he mean?",
          options: [
            { t: "The method, the way of thinking that builds the folder, so it comes out shaped like your work.", correct: true },
            { t: "A specific folder layout everyone should copy." },
            { t: "A paid tool you install." },
            { t: "A type of AI model." }
          ],
          explain: "Stages, records, a wiki: three shapes, one way of thinking. Your folder won't look like his."
        } },
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Open the Claude window on client-email. In the real setup, that is your work session.",
        folderPrompt: "Point it at client-email with the folder selector.",
        xp: 5 },
      { type: "claude-chat",
        learn: [3, 4],
        guide: "Now the split. Ask the work session to label every file as instructions, state, or both.",
        script: [{
          suggestedPrompt: "List every file in this folder and label it instructions, state, or both.",
          acceptIf: { mentionsAnyOf: ["label", "instructions", "state"], mentionsAllOf: [] },
          rejectHint: "Ask it to label each file: instructions, state, or both.",
          reply: {
            thinkingLines: ["listing client-email/"],
            text: "Instructions: CLAUDE.md, the how-i-reply skill. State: clients/*/notes.md, inbox/, exports/, drafts/. Both: about-me.md, since it's how Sam works and facts like prices. outcome.md is your notes for designing the folder. Every file is one or the other, so nothing to question yet.",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "A file in your folder is neither instructions nor state. What's that telling you?",
          options: [
            { t: "It's the first file to question. Does it need to be here?", correct: true },
            { t: "It's the most important file." },
            { t: "The model will figure out what it's for." },
            { t: "Nothing. Every folder has a few." }
          ],
          explain: "In your folder the model runs things. The instructions and the state are yours to write. Anything else is clutter on the way to the desk."
        } },
      { type: "claude-chat",
        learn: [5, 6],
        guide: "Rewrite the map as a short routing file: what's here, where things go, naming, and one row per job. One screen.",
        script: [{
          suggestedPrompt: "Rewrite CLAUDE.md as a short routing map: what's here, where things go, naming rules, and one routing row per job in outcome.md. Keep it to one screen.",
          acceptIf: { mentionsAnyOf: ["claude.md", "map", "routing"], mentionsAllOf: [] },
          rejectHint: "Ask for the map rewrite: short, one routing row per job.",
          reply: {
            thinkingLines: ["reading outcome.md: 2 jobs", "rewriting CLAUDE.md"],
            text: "Rewrote CLAUDE.md. Two routing rows, reply to email and the weekly heads-up, plus naming and the two rules. It fits on one screen.",
            effects: [{ writeFile: "${ws}/CLAUDE.md", content: MAP_ROUTED }]
          }
        }],
        xp: 20, achievement: "routed",
        check: {
          q: "The most common mistake in the community is a giant map. Why is that a problem?",
          options: [
            { t: "It puts the whole drawer back on the desk.", correct: true },
            { t: "Big files are slow to save." },
            { t: "Claude only reads the first ten lines." },
            { t: "It isn't. More detail is always better." }
          ],
          explain: "Keep the map short. It routes. The details live in the rooms it routes to."
        } },
      { type: "claude-chat",
        learn: [7],
        guide: "Test it. One real job, one short sentence. Watch what it opens and what it skips.",
        script: [{
          suggestedPrompt: "make the heads-up",
          acceptIf: { mentionsAnyOf: ["heads-up", "heads up", "bookings", "owner"], mentionsAllOf: [] },
          rejectHint: "Ask for the weekly heads-up in a few words.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: routing row 'weekly bookings heads-up'", "reading exports/bookings-2026-10-06.csv (newest)", "skipping clients/, inbox/, drafts/", "writing heads-up/2026-10-06.md"],
            text: "Saved heads-up/2026-10-06.md. Three bookings still pending: Kettle & Co, Oak Lane Dental, Riverside Makers.",
            effects: [{ writeFile: "${ws}/heads-up/2026-10-06.md", content: "Three bookings still pending this week: Kettle & Co (22 Oct), Oak Lane Dental (28 Oct), Riverside Makers (4 Nov).\nWorth chasing Kettle & Co first, it's the soonest.\n" }]
          }
        }],
        xp: 20,
        check: {
          q: "It opened the right file and skipped the rest. What would it mean if it had wandered through everything?",
          options: [
            { t: "The map is too vague. Tighten that one row and try again.", correct: true },
            { t: "The model is broken." },
            { t: "That's normal and fine." },
            { t: "You need a second agent." }
          ],
          explain: "Nothing's built right the first time. The test tells you which row to tighten."
        } }
    ],
    checkin: {
      artifacts: ["${ws}/CLAUDE.md", "${ws}/heads-up/2026-10-06.md"],
      quiz: {
        q: "A new client signs on, and you change how you write replies. What changes for each?",
        options: [
          { t: "New client: a new notes file (facts). New reply style: the skill (method). Neither touches the other.", correct: true },
          { t: "Both go into the skill." },
          { t: "Rewrite the whole map both times." },
          { t: "Start a new folder for each change." }
        ],
        explain: "Method carries to the next client. Facts stay with this one. That's the skill and project split from 1.2, as a folder."
      },
      reflect: {
        prompt: "List the jobs in one area of your real work. What does each one read, and what does it make?",
        saveTo: "${ws}/.notes/2-2-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "2-3_one-model-different-jobs": {
    intro: [0],
    build: [
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Open the Claude window on client-email. In the real setup, that is your work session.",
        folderPrompt: "Point it at client-email with the folder selector.",
        xp: 5 },
      { type: "claude-chat",
        learn: [1, 2],
        guide: "Two different jobs, back to back, same model. First job: reply to the Northwind email.",
        script: [{
          suggestedPrompt: "reply to the Northwind email",
          acceptIf: { mentionsAnyOf: ["northwind", "reply", "marcus"], mentionsAllOf: [] },
          rejectHint: "Ask for the Northwind reply.",
          reply: {
            thinkingLines: ["routing row: reply to email", "reading about-me.md", "reading clients/northwind-studio/notes.md", "reading inbox/2026-10-06-northwind-studio.md", "using skill: how-i-reply", "writing drafts/2026-10-06-northwind-studio-2.md"],
            text: "Draft saved. 14 confirmed, handouts covered, parking left for you to answer.",
            effects: [{ writeFile: "${ws}/drafts/2026-10-06-northwind-studio-2.md", content: "Hi Marcus,\n\n14 works. I'll bring printed handouts for all 14, so people don't need to bring anything.\n\nParking: [SAM TO ANSWER BY FRIDAY]\n\nSam\n" }]
          }
        }],
        xp: 15,
        check: {
          q: "Someone says they need a writing agent. What do they usually need?",
          options: [
            { t: "The instructions for that job written down, and a map that sends the request to them.", correct: true },
            { t: "A separate AI subscription for writing." },
            { t: "A model trained only on writing." },
            { t: "A name for their agent." }
          ],
          explain: "The role comes from what it reads. A name on the door adds zero instructions and zero access."
        } },
      { type: "claude-chat",
        learn: [3],
        guide: "Second job, same session: make me a table of every booking this month. Watch what it opens this time.",
        script: [{
          suggestedPrompt: "make me a table of every booking this month",
          acceptIf: { mentionsAnyOf: ["table", "booking"], mentionsAllOf: [] },
          rejectHint: "Ask for the bookings table.",
          reply: {
            thinkingLines: ["no routing row for tables yet, closest: weekly bookings heads-up", "reading exports/bookings-2026-10-06.csv", "skipping clients/, inbox/, drafts/", "writing tables/2026-10.md"],
            text: "Saved tables/2026-10.md: six October bookings. Riverside Makers is November, so it's left out. Different row, different files, same model.",
            effects: [{ writeFile: "${ws}/tables/2026-10.md", content: "# October bookings\n\n| Client | Date | Status |\n|---|---|---|\n| Fernhill Library | 2026-10-09 | confirmed |\n| Harbor Bakery | 2026-10-14 | confirmed |\n| Bright Path Tutoring | 2026-10-16 | cancelled |\n| Kettle & Co | 2026-10-22 | pending |\n| Oak Lane Dental | 2026-10-28 | pending |\n| Northwind Studio | 2026-10-30 | confirmed |\n" }]
          }
        }],
        xp: 15,
        check: {
          q: "In Jake's folder, the model picks what to post and a Metricool connection schedules it. Why split it that way?",
          options: [
            { t: "The model reads the situation and chooses. The tools do the doing.", correct: true },
            { t: "The model can't tell time." },
            { t: "Metricool is cheaper than tokens." },
            { t: "No reason, it's just habit." }
          ],
          explain: "Not every job is the model's. 3.2 turns more of your own steps into tools."
        } },
      { type: "reflect", optional: false, eyebrow: "Could it run on its own?",
        learn: [4, 5, 6],
        prompt: "Is there one job in your work that could run on its own, at the same time as everything else, because it needs nothing from the others? \"Not yet\" is a fine answer.",
        saveTo: "${ws}/.notes/2-3-parallel.md",
        xp: 10,
        check: {
          q: "When does a second agent actually earn its keep?",
          options: [
            { t: "Independent work that can run at once, a job big enough to bury the desk, or something live to watch.", correct: true },
            { t: "Whenever a job has a different name." },
            { t: "Always. More agents are faster." },
            { t: "Never." }
          ],
          explain: "Every extra agent costs tokens, waiting, and more places to go sideways. Start with one. Split off a helper when you can point at the job it takes off the desk."
        } }
    ],
    checkin: {
      artifacts: ["${ws}/drafts/2026-10-06-northwind-studio-2.md", "${ws}/tables/2026-10.md"],
      quiz: {
        q: "Your team wants a research agent, a writing agent and a scheduling agent. What do you suggest?",
        options: [
          { t: "One folder: each job's instructions written down, a routing row each, scheduling handed to a tool.", correct: true },
          { t: "Three agents, as planned." },
          { t: "Three separate folders that never share anything." },
          { t: "Wait for a better model." }
        ],
        explain: "Same model, different rows. Anthropic's Building effective agents says it too: start with the simplest setup that works."
      }
    },
    xpLessonComplete: 50
  },

  // ===========================================================================
  "3-1_stages": {
    intro: [0],
    build: [
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Open the Claude window on client-email. In the real setup, that is your work session.",
        folderPrompt: "Point it at client-email with the folder selector.",
        xp: 5 },
      { type: "claude-chat",
        learn: [1, 2],
        guide: "Module 3. Split the weekly heads-up into stages, each leaving one file, each with a short contract.",
        script: [{
          suggestedPrompt: "Make a stages folder for the weekly heads-up: 01_gather, 02_draft, 03_check. In each, a short CONTRACT.md: what it reads, what it makes, who checks it.",
          acceptIf: { mentionsAnyOf: ["stage", "contract"], mentionsAllOf: [] },
          rejectHint: "Ask for the stages folder, with a contract per stage.",
          reply: {
            thinkingLines: ["writing stages/01_gather/CONTRACT.md", "writing stages/02_draft/CONTRACT.md", "writing stages/03_check/CONTRACT.md"],
            text: "Three stages, three contracts. Each one makes a single file. 03_check is you.",
            effects: [
              { writeFile: "${ws}/stages/01_gather/CONTRACT.md", content: "# 01 gather\n\nReads: the newest file in exports/\nMakes: table.md (every booking, with status)\nChecked by: nobody, it comes out the same every time\n" },
              { writeFile: "${ws}/stages/02_draft/CONTRACT.md", content: "# 02 draft\n\nReads: ../01_gather/table.md\nMakes: heads-up.md (two lines for the owner: what's still pending)\nChecked by: Sam, in 03\n" },
              { writeFile: "${ws}/stages/03_check/CONTRACT.md", content: "# 03 check\n\nReads: ../02_draft/heads-up.md\nMakes: nothing. Sam reads it, edits it, and sends it.\nChecked by: Sam\n" }
            ]
          }
        }],
        xp: 20, achievement: "staged",
        check: {
          q: "Why does each stage leave a file?",
          options: [
            { t: "So your judgment lands early, while a fix is one line in a text file and not a full redo.", correct: true },
            { t: "So the folder looks organized." },
            { t: "Files make the AI think harder." },
            { t: "It's required by Claude Code." }
          ],
          explain: "Two years versus four, caught in the script: a ten-second fix. Caught after the render: a new voice take, new timings, new frames."
        } },
      { type: "edit-file", path: "${ws}/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        learn: [3],
        guide: "Tell it where to stop. This line goes in the map. Fill your name in as the checker, then save.",
        typedContent: "\n## Weekly heads-up stages\nRun stages/ in order. Stop after each stage and wait for me.\nChecker for 03_check: [YOUR NAME]\n",
        fillFields: ["YOUR NAME"],
        xp: 15,
        check: {
          q: "The map says \"stop after each stage.\" When do you need more than the map?",
          options: [
            { t: "For anything that truly can't happen without you, like sending or deleting: settings, or a hook.", correct: true },
            { t: "Never. The map is a hard rule." },
            { t: "Only on the free plan." },
            { t: "When the folder gets big." }
          ],
          explain: "The map is something it reads, and it pretty much always follows it. Manual mode asks first. Plan mode only plans. A hook blocks no matter what."
        } },
      { type: "claude-chat",
        guide: "Run it. One short sentence. It should stop after the first stage.",
        script: [{
          suggestedPrompt: "make the weekly heads-up",
          acceptIf: { mentionsAnyOf: ["heads-up", "heads up", "weekly"], mentionsAllOf: [] },
          rejectHint: "Ask for the weekly heads-up.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: weekly heads-up stages", "stage 01_gather: reading exports/bookings-2026-10-06.csv", "writing stages/01_gather/table.md"],
            text: "Stage 01 done: stages/01_gather/table.md. Stopping here, as the map says. Look it over and tell me to go on.",
            effects: [{ writeFile: "${ws}/stages/01_gather/table.md", content: TABLE_1006 }]
          }
        }],
        xp: 15 },
      { type: "edit-file", path: "${ws}/stages/01_gather/table.md", mode: "append", button: "Open table.md",
        learn: [4],
        guide: "Step in. Stepping in is more than yes or no. Add a line the export can't know, then save.",
        typedContent: "\nNote: [SOMETHING YOU KNOW THAT THE EXPORT DOESN'T]\n",
        fillFields: ["SOMETHING YOU KNOW THAT THE EXPORT DOESN'T"],
        xp: 15, achievement: "stepped-in",
        check: {
          q: "Jake doesn't watch it transcribe, but he reads every storyboard. Why?",
          options: [
            { t: "Put your eyes where your judgment changes the result, and let the steady parts run.", correct: true },
            { t: "Transcription is never wrong." },
            { t: "Storyboards are longer." },
            { t: "He watches everything equally." }
          ],
          explain: "Add a line, stretch a beat, and the one he uses most: delete stuff."
        } },
      { type: "claude-chat",
        learn: [5],
        guide: "Now tell it to go on.",
        script: [{
          suggestedPrompt: "go on",
          acceptIf: { mentionsAnyOf: ["go", "next", "continue", "on"], mentionsAllOf: [] },
          rejectHint: "Tell it to carry on to the next stage.",
          reply: {
            thinkingLines: ["stage 02_draft: reading stages/01_gather/table.md (including your note)", "writing stages/02_draft/heads-up.md"],
            text: "Stage 02 done: stages/02_draft/heads-up.md, and it uses your note. Stopping again. 03 is yours.",
            effects: [{ writeFile: "${ws}/stages/02_draft/heads-up.md", content: "Three bookings still pending: Kettle & Co (22 Oct), Oak Lane Dental (28 Oct), Riverside Makers (4 Nov).\nSee the note in the table before chasing.\n" }]
          }
        }],
        xp: 15 }
    ],
    checkin: {
      artifacts: ["${ws}/stages/02_draft/heads-up.md"],
      quiz: {
        q: "Where do you want to catch the most expensive mistake in a job?",
        options: [
          { t: "At the earliest stage where it shows up in a file you can read.", correct: true },
          { t: "At the end, in the finished output." },
          { t: "Nowhere. The AI should just get it right." },
          { t: "After it's sent." }
        ],
        explain: "The end is the most expensive place there is. Stages give your judgment somewhere cheaper to land."
      },
      reflect: {
        prompt: "Take one job of yours. What are its stages, and which one is where your judgment changes the result?",
        saveTo: "${ws}/.notes/3-1-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "3-2_steady-parts-into-code": {
    intro: [0],
    build: [
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Open the Claude window on client-email. In the real setup, that is your work session.",
        folderPrompt: "Point it at client-email with the folder selector.",
        xp: 5 },
      { type: "claude-chat",
        learn: [1, 2],
        guide: "Stage 01 comes out the same every week. That's a job for code. Ask for a script.",
        script: [{
          suggestedPrompt: "Write me a script that turns the newest export into the weekly table, and put it in a scripts folder. Use whatever's already installed.",
          acceptIf: { mentionsAnyOf: ["script"], mentionsAllOf: [] },
          rejectHint: "Ask for a script that turns the export into the table.",
          reply: {
            thinkingLines: ["checking what's installed: python found", "writing scripts/make-table.py"],
            text: "Wrote scripts/make-table.py. One input, the export. One output, tables/<date>.md. Let's test it on last week's export first.",
            effects: [{ writeFile: "${ws}/scripts/make-table.py", content: MAKE_TABLE }]
          }
        }],
        xp: 20,
        check: {
          q: "Which of these is a job for code, not the AI?",
          options: [
            { t: "Turning the same export into the same table every week.", correct: true },
            { t: "Replying to a worried client." },
            { t: "Deciding what a video should show." },
            { t: "Choosing which hook to post." }
          ],
          explain: "Same input, same output, every time: code. Reading between the lines: the AI and you."
        } },
      { type: "claude-open", mode: "terminal",
        learn: [3],
        guide: "Test it on something you already did by hand: last week's export. Switch the Claude window to its terminal.",
        xp: 5 },
      { type: "claude-term", command: "python scripts/make-table.py exports/bookings-2026-09-29.csv",
        guide: "Run it on last week's export, exactly: python scripts/make-table.py exports/bookings-2026-09-29.csv",
        output: ["wrote tables/2026-09-29.md", "Pending: 2 (Fernhill Library, Kettle & Co)", "(simulated. On your machine it runs for real.)"],
        xp: 15,
        check: {
          q: "Last week by hand, you counted two pending. The script says two. Why check this carefully once?",
          options: [
            { t: "A wrong script is wrong the same way every time. Check it properly once.", correct: true },
            { t: "Scripts are usually wrong." },
            { t: "You'll check it every week anyway." },
            { t: "No reason. Scripts don't make mistakes." }
          ],
          explain: "Once it matches what you did by hand, you can trust it on the hundredth run."
        } },
      { type: "edit-file", path: "${ws}/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        learn: [4],
        guide: "Now the map line, so the AI uses the script instead of thinking. It types in. Save it.",
        typedContent: "\n## Scripts\nFor the weekly table, run python scripts/make-table.py on the newest export in exports/.\n",
        fillFields: [],
        xp: 15, achievement: "scripted",
        check: {
          q: "Because the script has one clear input and one clear output, what can you do later?",
          options: [
            { t: "Swap it out, make it faster, change the format, without touching anything else.", correct: true },
            { t: "Nothing. It's locked in now." },
            { t: "Delete the map." },
            { t: "Stop checking outputs forever." }
          ],
          explain: "The old Unix rule from the 70s: make each program do one thing well."
        } },
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Back to chat mode, on client-email.",
        xp: 5 },
      { type: "claude-chat",
        learn: [5, 6],
        guide: "Next week you just say it. Try it.",
        script: [{
          suggestedPrompt: "make this week's table",
          acceptIf: { mentionsAnyOf: ["table"], mentionsAllOf: [] },
          rejectHint: "Ask for this week's table.",
          reply: {
            thinkingLines: ["map says: run python scripts/make-table.py on the newest export", "running scripts/make-table.py exports/bookings-2026-10-06.csv"],
            text: "Ran your script. tables/2026-10-06.md: 7 bookings, 3 pending. Same way, every time.",
            effects: [{ writeFile: "${ws}/tables/2026-10-06.md", content: TABLE_1006 }]
          }
        }],
        xp: 15,
        check: {
          q: "You don't plan all your automations up front. How do you find the next one?",
          options: [
            { t: "Keep doing the work by hand, automate one piece at a time, and let the work show you the next one.", correct: true },
            { t: "Automate everything in week one." },
            { t: "Ask the AI to guess." },
            { t: "Wait until something breaks." }
          ],
          explain: "And whenever you can get at the back end of something, an export or an API, use it, and skip having the AI click around a website."
        } }
    ],
    checkin: {
      artifacts: ["${ws}/scripts/make-table.py", "${ws}/tables/2026-10-06.md"],
      quiz: {
        q: "Which step of the heads-up would you never hand to a script?",
        options: [
          { t: "Deciding what the owner needs to hear, and how to say it. That's reading between the lines.", correct: true },
          { t: "Counting the pending bookings." },
          { t: "Reading the CSV." },
          { t: "Writing the table." }
        ],
        explain: "Code for the same answer every time. The AI and you for judgment. That's the thirty and the ten."
      },
      reflect: {
        prompt: "What's a step in your real work you've done the same way three times?",
        saveTo: "${ws}/.notes/3-2-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "3-3_keep-it-useful": {
    intro: [0],
    build: [
      { type: "claude-open", mode: "chat", expectFolder: "${ws}",
        guide: "Open the Claude window on client-email. In the real setup, that is your work session.",
        folderPrompt: "Point it at client-email with the folder selector.",
        xp: 5 },
      { type: "claude-chat",
        learn: [1],
        guide: "The fresh-session test. A brand new session, one question.",
        script: [{
          suggestedPrompt: "What is this folder, what's in progress, and what's next?",
          acceptIf: { mentionsAnyOf: ["what is this", "in progress", "next"], mentionsAllOf: [] },
          rejectHint: "Ask the three questions: what is this folder, what's in progress, what's next.",
          reply: {
            thinkingLines: ["reading CLAUDE.md", "listing drafts/, stages/, tables/"],
            text: "It's Sam's client email folder: replies, a weekly bookings heads-up in three stages, and a script for the table. In progress: two drafts waiting in drafts/, and this week's heads-up stopped at stage 03 for Sam. Next: Sam checks the heads-up and answers the Northwind parking question.",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "The fresh session gets the folder wrong. What does that tell you?",
          options: [
            { t: "The map is out of date. Better to learn that from a test than from a confused client.", correct: true },
            { t: "The model is having a bad day." },
            { t: "You need a bigger model." },
            { t: "Nothing. Fresh sessions always get it wrong." }
          ],
          explain: "If a fresh session can't tell what the folder is and what's next, neither can a new teammate."
        } },
      { type: "claude-chat",
        learn: [2],
        guide: "One home for every fact. Ask it to find any fact that lives in more than one place.",
        script: [{
          suggestedPrompt: "Find any fact that lives in more than one file here, like a price or a date, and list where each copy is.",
          acceptIf: { mentionsAnyOf: ["fact", "more than one", "duplicate", "copy", "copies"], mentionsAllOf: [] },
          rejectHint: "Ask it to find facts that live in more than one file.",
          reply: {
            thinkingLines: ["scanning for repeated prices, dates, names"],
            text: "Prices: $1,200 and $2,000 are in about-me.md and repeated in both clients' notes. The clients' copies are what each one agreed, so they're their own facts. The standard rate lives once, in about-me.md. Your skill has no prices in it, which is right: it's method.",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "The way you write replies changes. Where do you make the change?",
          options: [
            { t: "In the skill file, once. Every job that uses it picks up the change.", correct: true },
            { t: "In every draft." },
            { t: "In each client's notes." },
            { t: "In a new map." }
          ],
          explain: "Prices in three files will drift. Keep each fact in one place and point everything else to it. Same with skills."
        } },
      { type: "create-folder", parent: "${ws}", name: "_archive",
        learn: [0, 3],
        guide: "Make a folder called _archive in client-email. Retired work goes there, out of the way.",
        xp: 10 },
      { type: "edit-file", path: "${ws}/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        guide: "Five words in the map, so the AI never wastes a second on it. Save it.",
        typedContent: "\n## _archive\nRetired work, never read it.\n",
        fillFields: [],
        xp: 10, achievement: "archived",
        check: {
          q: "Clearing out, what do you leave alone?",
          options: [
            { t: "The originals, your sources, and anything that belongs to someone else.", correct: true },
            { t: "Nothing. Delete freely." },
            { t: "Only the newest files." },
            { t: "Whatever the AI made." }
          ],
          explain: "Delete the generated stuff nobody will use, and don't be afraid to restart. Files don't take as long to make as they used to."
        } },
      { type: "reflect", optional: false, eyebrow: "Hand it on",
        learn: [4, 5],
        prompt: "If the AI were turned off tomorrow, could someone find their way around this folder from the map alone? What's the first thing that would trip them up?",
        saveTo: "${ws}/.notes/3-3-handoff.md",
        xp: 15,
        check: {
          q: "A better model comes out next month from a different company. What happens to your folder?",
          options: [
            { t: "Point the new model at the same folder, maybe rename the map file, and keep going.", correct: true },
            { t: "Rebuild everything for the new model." },
            { t: "The folder stops working." },
            { t: "Stay on the old model forever." }
          ],
          explain: "What stays yours is your files, your context, your data. That's the bet on folders."
        } },
      { type: "note",
        learn: [6],
        guide: ["That's Foundations. Your workspace is real files: download it from the menu, drop it on your real machine, and point the real Claude Code at it.",
          "Then go build something, and post it in the Clief Notes community. Jake loves seeing what people make."],
        button: "Finish", xp: 10 }
    ],
    checkin: {
      artifacts: ["${ws}/CLAUDE.md", "${ws}/.notes/3-3-handoff.md"],
      quiz: {
        q: "Your folder felt great in week one and is a swamp by week six. What's the first check?",
        options: [
          { t: "A fresh session: what is this folder, what's in progress, what's next. Then fix the map.", correct: true },
          { t: "Start a brand new folder." },
          { t: "Add more instructions to the map." },
          { t: "Switch models." }
        ],
        explain: "Fresh-session test, one home for every fact, clear stuff out. Simple, then complex, then simple again."
      }
    },
    xpLessonComplete: 80
  }

  };
})();
