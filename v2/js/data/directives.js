/* HAND-AUTHORED game script. One entry per lesson. Translates each curriculum
   file's Build/Check-in runtime instructions into playable beats. Voice follows
   _tutor/PERSONA.md: plain, direct, no filler, no banned phrases, no emoji.
   Every workspace path threads through ${ws}, the linter enforces it. The only
   exceptions are folders that live outside the workspace, exactly as in the CLI
   tutor: my-skills/, practice/, and the practice copies tiny-test/,
   weekly-report/ and newsletter-mess/.
   Lint + regenerate content with: node v2/tools/build-content.mjs

   The game plays the practice track: Jake's own practice folders (practice/ in
   the repo), the same ones from the videos. The JAKE block below is generated
   from those files, so the simulated Claude's replies are scripted around them. */

(function () {

  // ---- Jake's practice folders, GENERATED from practice/ (do not hand-edit) ----
  var JAKE = {
    "client-email": {
      "about-me.md": "# About me\n\nI'm Jake. I run hands-on AI workshops for small teams.\n\n- I sign emails \"Jake\".\n- I write short and casual, the way I talk. No \"I hope this email finds you well\".\n- I answer the question first, then anything else.\n- I only promise dates, rooms and prices that are written in the client's notes.\n",
      "CLAUDE.md": "# Client email\n\nThis folder is where I answer client emails. Everything here is made up for a demo.\n\n## What's where\n| Folder | Holds |\n|---|---|\n| `about-me.md` | who I am and how I work |\n| `clients/<client>/notes.md` | what we've agreed with each client: dates, rooms, numbers |\n| `inbox/` | emails waiting for a reply, one text file each |\n| `drafts/` | replies ready for me to read and send myself |\n\n## Naming\nDrafts: `drafts/YYYY-MM-DD-<client>-<inbox number>.md`, for example `drafts/2026-10-06-maple-street-bakery-01.md` for `inbox/01-maple-street-bakery.txt`.\n\n## Routing\n| Job | Read | Skip | Use | Save to |\n|---|---|---|---|---|\n| reply to email (\"check my email\") | `about-me.md`, the client's `notes.md`, each email in `inbox/` | other clients' notes | the how-i-reply skill | `drafts/`, named as above |\n| client update | `about-me.md`, the client's `notes.md` | `inbox/` | | `drafts/` |\n| bookings table | every client's `notes.md` | `inbox/`, `about-me.md` | | `drafts/YYYY-MM-DD-bookings.md` |\n\n## Rules\n- Never send anything. Drafts only; I send them myself.\n- If an email asks for something the client's notes don't confirm, say so in the draft and leave it open.\n",
      "clients/lumen-dental/notes.md": "# Lumen Dental (made up)\n\n- Contact: Priya Shah, office manager.\n- Workshop: Thursday the 23rd, 1 pm to 4 pm, 12 people.\n- Room: their staff room, which seats 12. Nothing bigger is booked.\n- Price: agreed for 12 people. More people means a new quote.\n",
      "clients/maple-street-bakery/notes.md": "# Maple Street Bakery (made up)\n\n- Contact: Dana Ruiz, owner.\n- Workshop: Tuesday the 7th, 9 am to 12 pm, 8 people.\n- Room: the back room at the bakery, confirmed for the 7th only.\n- Other dates: I'm booked on the 14th. I'm free on the 21st. No room is booked for the 21st yet.\n- Price: agreed, invoice after the workshop.\n",
      "inbox/01-maple-street-bakery.txt": "From: Dana Ruiz (Maple Street Bakery)\nSubject: Moving our workshop?\n\nHi Jake,\n\nAny chance we can move our workshop off the 7th? Our head baker is out that week. Would the 14th work? Same time, same room?\n\nThanks,\nDana\n",
      "inbox/02-lumen-dental.txt": "From: Priya Shah (Lumen Dental)\nSubject: Five more people?\n\nHi Jake,\n\nGood news, five more of the team want in on the workshop on the 23rd. Can we just add them? I'm assuming the staff room is fine for everyone.\n\nPriya\n",
      "inbox/03-maple-street-bakery.txt": "From: Dana Ruiz (Maple Street Bakery)\nSubject: Quick one\n\nHey Jake, do we need to bring laptops, or is a phone okay?\n\nDana\n",
      ".claude/skills/how-i-reply/SKILL.md": "---\nname: how-i-reply\ndescription: Use when replying to client emails. Writes a short, casual reply in Jake's voice and never promises a date, room or price that the client's notes don't confirm.\n---\n\n# How I reply\n\n1. Match their length. A three-line email gets a three-line reply.\n2. Keep it short and casual. Never open with \"I hope this email finds you well\".\n3. Answer what they asked, first.\n4. Never promise a date, a room or a price unless the client's notes confirm it. If they don't, say we'll confirm it and by when.\n5. Sign it \"Jake\".\n"
    },
    "tiny-test": {
      "meeting-notes.txt": "Team meeting, Monday (made up for a demo)\n\n- Spring menu launches on the 3rd. Photos due the week before.\n- Saturday hours move to 9 to 4 from next month.\n- Dana wants one person to own the newsletter. Nobody volunteered yet.\n- New oven arrives Thursday. Bakery closes early that day, at 2.\n- Next meeting in two weeks.\n"
    },
    "weekly-report": {
      "CLAUDE.md": "# Weekly report\n\nEvery Monday the bookings export lands in `exports/`, and I turn it into a summary table. Everything here is made up for a demo.\n\n## What's where\n| Folder | Holds |\n|---|---|\n| `exports/` | one bookings export per week, `YYYY-MM-DD-bookings.csv` |\n| `summaries/` | one summary per week, `YYYY-MM-DD-summary.md` |\n\n## Routing\n| Job | Read | Save to |\n|---|---|---|\n| weekly table | the newest file in `exports/` | `summaries/`, same date as the export |\n\n## The table\nOne row per client: confirmed seats, confirmed revenue (seats \u00d7 price per seat), pending seats. Then a total row. Only confirmed bookings count as revenue.\n",
      "exports/2026-09-28-bookings.csv": "date,client,seats,price_per_seat,status\n2026-09-22,Maple Street Bakery,8,45,confirmed\n2026-09-23,Lumen Dental,12,45,confirmed\n2026-09-24,Northside Cycles,6,45,pending\n2026-09-25,Harper & Lane Accounting,10,40,confirmed\n2026-09-26,Maple Street Bakery,4,45,pending\n2026-09-27,Riverbend Library,15,30,confirmed\n",
      "exports/2026-10-05-bookings.csv": "date,client,seats,price_per_seat,status\n2026-09-29,Lumen Dental,5,45,pending\n2026-09-30,Northside Cycles,6,45,confirmed\n2026-10-01,Riverbend Library,10,30,confirmed\n2026-10-02,Maple Street Bakery,8,45,confirmed\n2026-10-03,Harper & Lane Accounting,12,40,pending\n2026-10-04,Riverbend Library,5,30,confirmed\n",
      "summaries/2026-09-28-summary.md": "# Week of 2026-09-28 (made by hand)\n\n| Client | Confirmed seats | Confirmed revenue | Pending seats |\n|---|---|---|---|\n| Harper & Lane Accounting | 10 | $400 | 0 |\n| Lumen Dental | 12 | $540 | 0 |\n| Maple Street Bakery | 8 | $360 | 4 |\n| Northside Cycles | 0 | $0 | 6 |\n| Riverbend Library | 15 | $450 | 0 |\n| **Total** | **45** | **$1,750** | **10** |\n"
    },
    "newsletter-mess": {
      "draft - october newsletter FINAL v2.md": "# October at the Bakery (made-up draft)\n\nHey friends! Big month. The pumpkin loaf is back on the 14th, and we're trying Saturday hours until 4.\n\n(need photo here)\n(check hours with Dana before sending!!)\n",
      "draft - october newsletter.md": "# October newsletter (older draft, made up)\n\nPumpkin loaf returns on the 7th. Saturday hours until 3.\n",
      "how we write these.md": "# How we write the newsletter (made up)\n- Short. Three sections max.\n- Sound like a person behind the counter, not a brand.\n- Always check dates and hours with Dana before it goes out.\n- One photo per section.\n",
      "ideas.txt": "newsletter ideas (made up)\n- spring menu launch, photos from Tuesday\n- interview with our head baker??\n- the sourdough starter story, people loved it last year\n- holiday hours!!! don't forget\n",
      "old stuff/notes from meeting.txt": "meeting notes (made up): newsletter goes out first monday of the month. dana approves hours + dates.\n",
      "old stuff/september newsletter SENT.md": "# September (sent, made up)\nBack-to-school muffins, 20% off for teachers.\n",
      "subscribers export.csv": "email,joined\nreader1@example.com,2026-01-04\nreader2@example.com,2026-03-19\nreader3@example.com,2026-08-02\n",
      "Untitled 3.txt": "saturday hours: 9-4 starting oct 11 (confirmed w Dana)\n"
    }
  };
  // Seed list for a practice folder copied to the root as `dest` (skip = files held back).
  function practiceFiles(folder, dest, skip) {
    return Object.keys(JAKE[folder]).filter(function (k) { return !(skip || []).includes(k); })
      .map(function (k) { return { path: dest + "/" + k, content: JAKE[folder][k] }; });
  }

  var MAP_FIRST = "# client-email\n\nWhere I answer client emails. Everything here is made up for a demo.\n\n## What's here\n- about-me.md: who I am and how I work\n- clients/<client>/notes.md: what's agreed with each client\n- inbox/: emails waiting for a reply\n- drafts/: replies for me to read and send myself\n- .claude/skills/how-i-reply/: the reply skill\n\n## Naming\n- Drafts: drafts/YYYY-MM-DD-<client>-<inbox number>.md\n";

  var NEWSLETTER_MAP = "# Newsletter\n\nThe bakery's monthly newsletter. Goes out the first Monday of the month. Everything here is made up for a demo.\n\n## What's here\n- how we write these.md: method (how the newsletter sounds and looks)\n- facts/hours-and-dates.md: confirmed hours and dates, one home\n- ideas.txt: ideas for future issues\n- drafts/: work in progress, one draft per month\n- sent/: finished issues\n- subscribers export.csv: the list\n- _archive/: retired work, never read it\n\n## Routing\n| Job | Read | Skip | Save to |\n|---|---|---|---|\n| write the newsletter | how we write these.md, facts/, ideas.txt | _archive/, sent/ | drafts/YYYY-MM.md |\n| check dates and hours | the current draft, facts/ | everything else | checks/YYYY-MM.md |\n\n## Rules\n- Dana approves every date and hour before it goes out.\n- Anything not in facts/ is unconfirmed. Say so.\n";

  var MAKE_TABLE = "\"\"\"Turn a bookings export into the weekly summary table.\n\nUsage: python scripts/make-table.py exports/YYYY-MM-DD-bookings.csv\nOne input (the export), one output (summaries/YYYY-MM-DD-summary.md).\nOnly confirmed bookings count as revenue.\n\"\"\"\nimport csv, os, sys\nfrom collections import defaultdict\n\nsrc = sys.argv[1]\ndate = os.path.basename(src).replace(\"-bookings.csv\", \"\")\nseats, revenue, pending = defaultdict(int), defaultdict(int), defaultdict(int)\nwith open(src, newline=\"\") as f:\n    for r in csv.DictReader(f):\n        client, n = r[\"client\"], int(r[\"seats\"])\n        if r[\"status\"] == \"confirmed\":\n            seats[client] += n\n            revenue[client] += n * int(r[\"price_per_seat\"])\n        else:\n            pending[client] += n\n\nlines = [\"# Week of \" + date, \"\",\n         \"| Client | Confirmed seats | Confirmed revenue | Pending seats |\",\n         \"|---|---|---|---|\"]\nfor c in sorted(set(seats) | set(pending)):\n    lines.append(\"| %s | %d | $%s | %d |\" % (c, seats[c], format(revenue[c], \",\"), pending[c]))\nlines.append(\"| **Total** | **%d** | **$%s** | **%d** |\" % (\n    sum(seats.values()), format(sum(revenue.values()), \",\"), sum(pending.values())))\n\nos.makedirs(\"summaries\", exist_ok=True)\nout = os.path.join(\"summaries\", date + \"-summary.md\")\nwith open(out, \"w\") as f:\n    f.write(\"\\n\".join(lines) + \"\\n\")\nprint(\"wrote \" + out)\n";

  var SUMMARY_1005 = "# Week of 2026-10-05\n\n| Client | Confirmed seats | Confirmed revenue | Pending seats |\n|---|---|---|---|\n| Harper & Lane Accounting | 0 | $0 | 12 |\n| Lumen Dental | 0 | $0 | 5 |\n| Maple Street Bakery | 8 | $360 | 0 |\n| Northside Cycles | 6 | $270 | 0 |\n| Riverbend Library | 15 | $450 | 0 |\n| **Total** | **29** | **$1,080** | **17** |\n";

  var SKILL = JAKE["client-email"][".claude/skills/how-i-reply/SKILL.md"];

  function openOn(folder, label) {
    return { type: "claude-open", mode: "chat", expectFolder: folder,
      guide: "Open the Claude window on " + label + ". In the real setup, that is your work session.",
      folderPrompt: "Point it at " + label + " with the folder selector.",
      xp: 5 };
  }

  FC.directives = {

  // ===========================================================================
  "0-0_start-here": {
    intro: [0],
    build: [
      { type: "note",
        learn: [1],
        guide: ["One thing before we start. The real tutor runs in Claude Code, a coding environment, so it starts most people at 1.3, where the AI works inside your files.",
          "In here, everything is simulated, so we play all of it in order, on Jake's own practice folders from the videos: the chat layers first, then the folders."],
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
        guide: "Here's the email from the video: Maple Street Bakery asking to move their workshop. It's from Jake's practice folders, and everything in them is made up. Open it in the explorer and read it.",
        button: "Read it",
        files: [
          { path: "practice/client-email/inbox/01-maple-street-bakery.txt", content: JAKE["client-email"]["inbox/01-maple-street-bakery.txt"] }
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
            text: "Dear Dana, I hope this email finds you well. Thank you for reaching out. Unfortunately the 14th is not possible, however I am pleased to offer the 21st, and yes, the same room will be ready for your team. Kind regards.",
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
        guide: "Read it like you're about to send it. It's stiff, and it promised the room, which isn't booked for the 21st. Correct it in plain words, the way you'd tell a person.",
        script: [{
          suggestedPrompt: "Too formal, I'd never say that. Don't promise the room yet. Just sign it Jake.",
          acceptIf: { mentionsAnyOf: ["formal", "room", "sign", "casual", "short"], mentionsAllOf: [] },
          rejectHint: "Tell it what's off: the tone, the promise about the room, how you sign off.",
          reply: {
            thinkingLines: ["rewriting"],
            text: "Hi Dana, no problem. The 14th won't work, but the 21st does, same time. I'll confirm the room for the 21st and get back to you by Friday. Jake",
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
        typedContent: "# Corrections\n\nJob: reply to client emails\n\n- Too formal, I'd never say that  ([VOICE, FACTS OR WHO])\n- Don't promise the room yet  ([VOICE, FACTS OR WHO])\n- Sign it Jake  ([VOICE, FACTS OR WHO])\n",
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
          suggestedPrompt: "I want a skill for replying to client emails. My corrections: too formal, don't promise the room yet, sign it Jake.",
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
        guide: "Save the skill it handed you. It types itself in: this is Jake's, from the video. Read it as it goes. Is there any rule you never actually said? Fill the one blank with a rule of your own, then save.",
        typedContent: SKILL.replace("5. Sign it \"Jake\".\n", "5. Sign it \"Jake\".\n6. [ONE MORE RULE OF YOUR OWN]\n"),
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
        guide: "The test. Brand new chat, empty desk. Paste the next email (Lumen Dental, asking to add five people) and type only: reply to this.",
        script: [{
          suggestedPrompt: "reply to this",
          acceptIf: { mentionsAnyOf: ["reply"], mentionsAllOf: [] },
          rejectHint: "Keep it to the bare request. The skill is supposed to answer the rest.",
          reply: {
            thinkingLines: ["using skill: how-i-reply"],
            text: "Hi Priya, great that more of the team want in. I can't confirm 17 yet: the room and the price were agreed for 12. I'll check what works and come back to you by Friday. Jake",
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
          explain: "The skill answers how you reply to anybody. The client's facts belong somewhere else: a project, or a notes file."
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
          "Click New folder in the explorer and call it client-email. It becomes your copy of Jake's practice folder."],
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
        guide: "I copied Jake's client-email folder in: two clients, three emails, and the reply skill under .claude/skills, so it travels with the folder. I held back Jake's map. Writing one is the lesson. Open a couple of files: they're just text.",
        button: "Had a look",
        files: practiceFiles("client-email", "${ws}", ["CLAUDE.md"])
          .concat([{ path: "practice/client-email/CLAUDE.md", content: JAKE["client-email"]["CLAUDE.md"] }]),
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
            thinkingLines: ["reading CLAUDE.md: routing row 'reply to email'", "reading about-me.md", "reading inbox/ (3 emails)", "reading clients/maple-street-bakery/notes.md", "reading clients/lumen-dental/notes.md", "using skill: how-i-reply", "writing drafts/2026-10-06-maple-street-bakery-01.md", "writing drafts/2026-10-06-lumen-dental-02.md", "writing drafts/2026-10-06-maple-street-bakery-03.md"],
            text: "Three drafts in drafts/. Maple Street: the 14th is taken, offered the 21st, and said you'll confirm a room, because none is booked for the 21st. Lumen Dental: didn't just add five. Their staff room seats 12 and more people means a new quote, so the draft says so. Maple Street's laptop question isn't in the notes, so it's flagged for you. Nothing sent.",
            effects: [
              { writeFile: "${ws}/drafts/2026-10-06-maple-street-bakery-01.md",
                content: "Hi Dana,\n\nThe 14th's taken, sorry. I'm free on the 21st, same time, 9 to 12.\n\nNo room is booked for the 21st yet, so I'll confirm one and get back to you by Friday.\n\nJake\n" },
              { writeFile: "${ws}/drafts/2026-10-06-lumen-dental-02.md",
                content: "Hi Priya,\n\nGreat that more of the team want in. The staff room seats 12, and the price was agreed for 12, so I can't just add five. Let me work out a room and a new quote, and I'll come back to you by Friday.\n\nJake\n" },
              { writeFile: "${ws}/drafts/2026-10-06-maple-street-bakery-03.md",
                content: "[JAKE: THE NOTES DON'T SAY. LAPTOPS OR PHONES?]\n\nHey Dana, good question. I'll confirm and let you know before the day.\n\nJake\n" }
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
      { type: "open-file", path: "${ws}/drafts/2026-10-06-maple-street-bakery-01.md",
        learn: [6, 7, 8],
        guide: "Open the Maple Street draft. It's just a file. You can change a word, delete it, or paste it into your email and send it yourself.",
        xp: 10,
        check: {
          q: "Video scripts were sitting in this same folder. Why wouldn't they get in the way of the email job?",
          options: [
            { t: "The map puts only what this job needs on the desk. Everything else stays in the drawers.", correct: true },
            { t: "Claude can't read video scripts." },
            { t: "They would. Never mix work in one folder." },
            { t: "It reads them but ignores them, which costs nothing." }
          ],
          explain: "It's the desk again. Routing loads what this job needs and leaves the rest in the drawers."
        } },
      { type: "open-file", path: "practice/client-email/CLAUDE.md",
        guide: "Now compare: open Jake's own map, in practice/client-email. The routing there is a table with three jobs, and the naming ties each draft to its inbox number. Yours doesn't have to match. It has to work.",
        xp: 10 }
    ],
    checkin: {
      artifacts: ["${ws}/CLAUDE.md", "${ws}/drafts/2026-10-06-maple-street-bakery-01.md"],
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
      { type: "create-folder", parent: "", name: "tiny-test",
        learn: [6],
        guide: "Now prove a setup works with one tiny job. Make a folder at the top level called tiny-test, same as Jake's.",
        xp: 5 },
      { type: "seed-files",
        guide: "I copied in the one file from Jake's tiny-test folder: notes from a team meeting. One file, that's the whole test.",
        button: "Next",
        files: practiceFiles("tiny-test", "tiny-test"),
        xp: 5 },
      openOn("tiny-test", "tiny-test"),
      { type: "claude-chat",
        learn: [7],
        guide: "Ask it to read the file, write a one-page summary, and save it next to the original.",
        script: [{
          suggestedPrompt: "Read the file in this folder, write a one-page summary, and save it next to the original.",
          acceptIf: { mentionsAnyOf: ["summary", "summarize", "summarise"], mentionsAllOf: [] },
          rejectHint: "Ask for a summary, saved next to the original.",
          reply: {
            thinkingLines: ["reading meeting-notes.txt", "writing summary.md"],
            text: "Saved summary.md next to meeting-notes.txt. Open it yourself and check it.",
            effects: [{ writeFile: "tiny-test/summary.md", content: "# Summary: team meeting\n\nThe spring menu launches on the 3rd, with photos due the week before. Saturday hours move to 9 to 4 from next month. The new oven arrives Thursday, so the bakery closes early that day, at 2. Still open: Dana wants one person to own the newsletter, and nobody has volunteered. Next meeting in two weeks.\n" }]
          }
        }],
        xp: 15 },
      { type: "open-file", path: "tiny-test/summary.md",
        guide: "Open the summary yourself. If you can open it, read it and change it, your setup works.",
        xp: 10, achievement: "tiny-test" }
    ],
    checkin: {
      artifacts: ["tiny-test/summary.md"],
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
        saveTo: "tiny-test/.notes/1-4-reflection.md"
      }
    },
    xpLessonComplete: 40
  },

  // ===========================================================================
  "2-1_start-with-the-outcome": {
    intro: [0],
    build: [
      { type: "create-folder", parent: "", name: "weekly-report",
        guide: "Module 2: build around a real job. Here's the one from the video. Make a folder called weekly-report, for your copy of Jake's.",
        xp: 5 },
      { type: "seed-files",
        guide: "Jake's weekly-report folder is in: two weeks of bookings exports, a short map, and last week's summary table, made by hand.",
        button: "Next",
        files: practiceFiles("weekly-report", "weekly-report"),
        xp: 5 },
      { type: "open-file", path: "weekly-report/summaries/2026-09-28-summary.md",
        learn: [1, 2],
        guide: "Open last week's summary. Every Monday the export becomes this table for the owner.",
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
      { type: "create-file", path: "weekly-report/outcome.md",
        learn: [3, 4, 5],
        guide: "Before any AI: the four questions. The outline types in. Fill every blank for this job, in your own words, then save.",
        typedContent: "# Outcome: weekly bookings summary\n\nFor: [WHO IS THIS ACTUALLY FOR]\nNext step they take: [WHAT THEY NEED TO DO NEXT]\nInformation comes from: [WHERE IT COMES FROM NOW]\nWhat breaks, and who feels it: [WHAT BREAKS]\n\n60 (data, questions, thinking): [THE SIXTY]\n30 (tools that already exist): [THE THIRTY]\n10 (the AI): [THE TEN]\n",
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
      { type: "open-file", path: "weekly-report/outcome.md",
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
      artifacts: ["weekly-report/outcome.md"],
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
        saveTo: "weekly-report/.notes/2-1-reflection.md"
      }
    },
    xpLessonComplete: 50
  },

  // ===========================================================================
  "2-2_design-your-folder": {
    intro: [0],
    build: [
      { type: "create-folder", parent: "", name: "newsletter-mess",
        guide: "This is the folder Jake points ICM Architect at in the video: a messy newsletter folder. Make a folder called newsletter-mess for your copy.",
        xp: 5 },
      { type: "seed-files",
        guide: "It's in. Have a look around: two drafts of the same newsletter, an Untitled 3, a folder of old stuff. Sound familiar?",
        button: "Had a look",
        files: practiceFiles("newsletter-mess", "newsletter-mess"),
        xp: 5 },
      { type: "create-file", path: "newsletter-mess/jobs.md",
        learn: [1, 2],
        guide: "List the jobs this folder exists for. For each: what it reads, what it makes. That list is basically your folder already. Fill the blanks and save.",
        typedContent: "# Jobs\n\n- Write the monthly newsletter. Reads: how we write these, ideas, confirmed dates and hours. Makes: [WHAT IT MAKES].\n- Check dates and hours with Dana. Reads: [WHAT IT READS]. Makes: a list of what needs confirming.\n",
        fillFields: ["WHAT IT MAKES", "WHAT IT READS"],
        xp: 15,
        check: {
          q: "When Jake says ICM, what does that mean?",
          options: [
            { t: "The method, the way of thinking that builds the folder, so it comes out shaped like your work.", correct: true },
            { t: "A specific folder layout everyone should copy." },
            { t: "A paid tool you install." },
            { t: "A type of AI model." }
          ],
          explain: "Stages, records, a wiki: three shapes, one way of thinking. Your folder won't look like Jake's."
        } },
      openOn("newsletter-mess", "newsletter-mess"),
      { type: "claude-chat",
        learn: [3, 4],
        guide: "Now the split. Ask the work session to label every file as instructions, state, or both.",
        script: [{
          suggestedPrompt: "List every file in this folder and label it instructions, state, or both.",
          acceptIf: { mentionsAnyOf: ["label", "instructions", "state"], mentionsAllOf: [] },
          rejectHint: "Ask it to label each file: instructions, state, or both.",
          reply: {
            thinkingLines: ["listing newsletter-mess/ (9 files)"],
            text: "Instructions: how we write these.md. State: ideas.txt, subscribers export.csv, both October drafts, Untitled 3.txt, old stuff/. Two problems. The drafts disagree: one says pumpkin loaf on the 7th and hours until 3, the other the 14th and hours until 4. And the only confirmed fact, Saturday hours 9 to 4 from Oct 11, is hiding in a file called Untitled 3. If I read both drafts, I'd have to guess which hours are right.",
            effects: []
          }
        }],
        xp: 15,
        check: {
          q: "The AI finds two drafts with different hours. What's the real fix?",
          options: [
            { t: "Give the confirmed hours one home under facts, keep one current draft, and move the old one out of the way.", correct: true },
            { t: "Tell the AI to always pick the newest file." },
            { t: "Delete both drafts and start over." },
            { t: "Nothing. The AI will figure it out." }
          ],
          explain: "A file that's neither instructions nor state, or two copies of the same fact, is the first thing to question."
        } },
      { type: "claude-chat",
        learn: [5, 6],
        guide: "Make it an ICM: a short map that routes each job, with method, facts, work and outputs each in their own place. One screen.",
        script: [{
          suggestedPrompt: "Make this an ICM: split method, facts, work and outputs, and write a short CLAUDE.md with one routing row per job in jobs.md. Keep it to one screen.",
          acceptIf: { mentionsAnyOf: ["icm", "claude.md", "map", "routing"], mentionsAllOf: [] },
          rejectHint: "Ask it to make this an ICM: a short map with a routing row per job.",
          reply: {
            thinkingLines: ["reading jobs.md: 2 jobs", "writing facts/hours-and-dates.md (from Untitled 3.txt)", "proposing: drafts/, sent/, _archive/ (older October draft, old stuff/)", "writing CLAUDE.md"],
            text: "Wrote CLAUDE.md: two routing rows, method in how we write these, confirmed facts in facts/hours-and-dates.md, drafts and sent issues apart, and an _archive the map says never to read. The older October draft goes in the archive. It fits on one screen. Read it before you trust it.",
            effects: [
              { writeFile: "newsletter-mess/CLAUDE.md", content: NEWSLETTER_MAP },
              { writeFile: "newsletter-mess/facts/hours-and-dates.md", content: "# Confirmed hours and dates\n\n- Saturday hours: 9 to 4, starting Oct 11. Confirmed with Dana.\n\nAnything not listed here is unconfirmed. Check with Dana.\n" }
            ]
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
          suggestedPrompt: "check the october draft's dates and hours",
          acceptIf: { mentionsAnyOf: ["check", "dates", "hours", "october"], mentionsAllOf: [] },
          rejectHint: "Ask it to check the October draft's dates and hours.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: routing row 'check dates and hours'", "reading draft - october newsletter FINAL v2.md", "reading facts/hours-and-dates.md", "skipping the older draft, old stuff/, sent/", "writing checks/2026-10.md"],
            text: "Saved checks/2026-10.md. Saturday hours until 4 matches what's confirmed, but the draft should say 9 to 4 from Oct 11. Pumpkin loaf on the 14th isn't in facts, so it's flagged for Dana.",
            effects: [{ writeFile: "newsletter-mess/checks/2026-10.md", content: "# October draft: dates and hours\n\n- Saturday hours \"until 4\": matches facts. Say \"9 to 4 from Oct 11\".\n- Pumpkin loaf back on the 14th: NOT in facts. Check with Dana.\n- Photo placeholder still in the draft.\n" }]
          }
        }],
        xp: 20,
        check: {
          q: "It opened the right few files and skipped the rest. What would it mean if it had wandered through everything?",
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
      artifacts: ["newsletter-mess/CLAUDE.md", "newsletter-mess/checks/2026-10.md"],
      quiz: {
        q: "Next month's newsletter, and Dana changes how she wants it written. What changes for each?",
        options: [
          { t: "Next month: a new draft (work), maybe new confirmed hours (facts). New style: how we write these (method).", correct: true },
          { t: "Both go into the map." },
          { t: "Rewrite the whole folder both times." },
          { t: "Start a new folder for each month." }
        ],
        explain: "Method carries to the next issue. Facts get one home. That's the skill and project split from 1.2, as a folder."
      },
      reflect: {
        prompt: "List the jobs in one area of your real work. What does each one read, and what does it make?",
        saveTo: "newsletter-mess/.notes/2-2-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "2-3_one-model-different-jobs": {
    intro: [0],
    build: [
      openOn("${ws}", "client-email"),
      { type: "edit-file", path: "${ws}/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        learn: [1, 2],
        guide: "Back in client-email. Jake's map has a second row this lesson needs, for the bookings table. Add it to yours. It types in. Save it.",
        typedContent: "\nJob: bookings table (\"make me a table of every booking\")\nRead: every client's notes.md\nSkip: inbox/, about-me.md\nSave to: drafts/YYYY-MM-DD-bookings.md\n",
        fillFields: [],
        xp: 10,
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
        guide: "Two different jobs, back to back, same model. First job: reply to the Lumen Dental email.",
        script: [{
          suggestedPrompt: "reply to the Lumen Dental email",
          acceptIf: { mentionsAnyOf: ["lumen", "reply", "priya"], mentionsAllOf: [] },
          rejectHint: "Ask for the Lumen Dental reply.",
          reply: {
            thinkingLines: ["routing row: reply to email", "reading about-me.md", "reading clients/lumen-dental/notes.md", "skipping clients/maple-street-bakery/", "reading inbox/02-lumen-dental.txt", "using skill: how-i-reply", "writing drafts/2026-10-07-lumen-dental-02.md"],
            text: "Draft saved. It doesn't add the five: the staff room seats 12 and the price was for 12, so it offers a new quote.",
            effects: [{ writeFile: "${ws}/drafts/2026-10-07-lumen-dental-02.md", content: "Hi Priya,\n\nLove that more of the team want in. The staff room seats 12 and we agreed the price for 12, so for 17 I'll need to sort a bigger room and a new quote. I'll send both by Friday.\n\nJake\n" }]
          }
        }],
        xp: 15 },
      { type: "claude-chat",
        learn: [3],
        guide: "Second job, same session: make me a table of every booking this month. Watch what it opens this time.",
        script: [{
          suggestedPrompt: "make me a table of every booking this month",
          acceptIf: { mentionsAnyOf: ["table", "booking"], mentionsAllOf: [] },
          rejectHint: "Ask for the bookings table.",
          reply: {
            thinkingLines: ["routing row: bookings table", "reading clients/maple-street-bakery/notes.md", "reading clients/lumen-dental/notes.md", "skipping inbox/, about-me.md", "writing drafts/2026-10-07-bookings.md"],
            text: "Saved drafts/2026-10-07-bookings.md. Different row, different files, same model.",
            effects: [{ writeFile: "${ws}/drafts/2026-10-07-bookings.md", content: "# Bookings\n\n| Client | Date | Time | People | Room |\n|---|---|---|---|---|\n| Maple Street Bakery | the 7th | 9 am to 12 pm | 8 | back room, confirmed for the 7th only |\n| Lumen Dental | the 23rd | 1 pm to 4 pm | 12 | their staff room (seats 12) |\n\nOpen: Maple Street asked to move off the 7th. Lumen Dental asked to add five.\n" }]
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
      artifacts: ["${ws}/drafts/2026-10-07-lumen-dental-02.md", "${ws}/drafts/2026-10-07-bookings.md"],
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
      openOn("weekly-report", "weekly-report"),
      { type: "claude-chat",
        learn: [1, 2],
        guide: "Module 3. Back in weekly-report. Split the weekly job into stages, each leaving one file, each with a short contract.",
        script: [{
          suggestedPrompt: "Make a stages folder for the weekly report: 01_gather, 02_draft, 03_check. In each, a short CONTRACT.md: what it reads, what it makes, who checks it.",
          acceptIf: { mentionsAnyOf: ["stage", "contract"], mentionsAllOf: [] },
          rejectHint: "Ask for the stages folder, with a contract per stage.",
          reply: {
            thinkingLines: ["writing stages/01_gather/CONTRACT.md", "writing stages/02_draft/CONTRACT.md", "writing stages/03_check/CONTRACT.md"],
            text: "Three stages, three contracts. Each one makes a single file. 03_check is you.",
            effects: [
              { writeFile: "weekly-report/stages/01_gather/CONTRACT.md", content: "# 01 gather\n\nReads: the newest file in exports/\nMakes: table.md (the summary table, per the map)\nChecked by: nobody, it comes out the same every time\n" },
              { writeFile: "weekly-report/stages/02_draft/CONTRACT.md", content: "# 02 draft\n\nReads: ../01_gather/table.md\nMakes: heads-up.md (two lines for the owner: what's still pending)\nChecked by: me, in 03\n" },
              { writeFile: "weekly-report/stages/03_check/CONTRACT.md", content: "# 03 check\n\nReads: ../02_draft/heads-up.md\nMakes: nothing. I read it, edit it, and send it myself.\nChecked by: me\n" }
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
      { type: "edit-file", path: "weekly-report/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
        learn: [3],
        guide: "Tell it where to stop. This goes in Jake's map. Fill your name in as the checker, then save.",
        typedContent: "\n## Stages\nRun stages/ in order. Stop after each stage and wait for me.\nChecker for 03_check: [YOUR NAME]\n",
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
          suggestedPrompt: "do this week's report",
          acceptIf: { mentionsAnyOf: ["report", "week", "table"], mentionsAllOf: [] },
          rejectHint: "Ask for this week's report.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: stages", "stage 01_gather: reading exports/2026-10-05-bookings.csv", "writing stages/01_gather/table.md"],
            text: "Stage 01 done: stages/01_gather/table.md. Stopping here, as the map says. Look it over and tell me to go on.",
            effects: [{ writeFile: "weekly-report/stages/01_gather/table.md", content: SUMMARY_1005 }]
          }
        }],
        xp: 15 },
      { type: "edit-file", path: "weekly-report/stages/01_gather/table.md", mode: "append", button: "Open table.md",
        learn: [4],
        guide: "Step in. Stepping in is more than yes or no. Add a line the export can't know, then save.",
        typedContent: "\nNote: [SOMETHING YOU KNOW THAT THE EXPORT DOESN'T]\n",
        fillFields: ["SOMETHING YOU KNOW THAT THE EXPORT DOESN'T"],
        xp: 15, achievement: "stepped-in",
        check: {
          q: "Jake doesn't watch it transcribe, but reads every storyboard. Why?",
          options: [
            { t: "Put your eyes where your judgment changes the result, and let the steady parts run.", correct: true },
            { t: "Transcription is never wrong." },
            { t: "Storyboards are longer." },
            { t: "Jake watches everything equally." }
          ],
          explain: "Add a line, stretch a beat, and the one Jake uses most: delete stuff."
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
            effects: [{ writeFile: "weekly-report/stages/02_draft/heads-up.md", content: "17 seats still pending this week: Harper & Lane Accounting (12) and Lumen Dental (5). Confirmed revenue so far: $1,080.\nSee the note in the table before chasing.\n" }]
          }
        }],
        xp: 15 }
    ],
    checkin: {
      artifacts: ["weekly-report/stages/02_draft/heads-up.md"],
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
        saveTo: "weekly-report/.notes/3-1-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "3-2_steady-parts-into-code": {
    intro: [0],
    build: [
      openOn("weekly-report", "weekly-report"),
      { type: "claude-chat",
        learn: [1, 2],
        guide: "Stage 01 comes out the same every week. That's a job for code. Ask for a script.",
        script: [{
          suggestedPrompt: "Write me a script that turns this export into the weekly table, and put it in a scripts folder. Use whatever's already installed.",
          acceptIf: { mentionsAnyOf: ["script"], mentionsAllOf: [] },
          rejectHint: "Ask for a script that turns the export into the table.",
          reply: {
            thinkingLines: ["reading CLAUDE.md: the table rules", "checking what's installed: python found", "writing scripts/make-table.py"],
            text: "Wrote scripts/make-table.py, following the table rules in your map. One input, the export. One output, summaries/<date>-summary.md. Test it on last week's export first: you made that one by hand.",
            effects: [{ writeFile: "weekly-report/scripts/make-table.py", content: MAKE_TABLE }]
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
        guide: "Test it on something you already did by hand: last week. Switch the Claude window to its terminal.",
        xp: 5 },
      { type: "claude-term", command: "python scripts/make-table.py exports/2026-09-28-bookings.csv",
        guide: "Run it on last week's export, exactly: python scripts/make-table.py exports/2026-09-28-bookings.csv",
        output: ["wrote summaries/2026-09-28-summary.md", "Total: 45 confirmed seats, $1,750, 10 pending. Same as the table made by hand.", "(simulated. On your machine it runs for real.)"],
        xp: 15,
        check: {
          q: "The script's table matches the one made by hand. Why check this carefully once?",
          options: [
            { t: "A wrong script is wrong the same way every time. Check it properly once.", correct: true },
            { t: "Scripts are usually wrong." },
            { t: "You'll check it every week anyway." },
            { t: "No reason. Scripts don't make mistakes." }
          ],
          explain: "Once it matches what you did by hand, you can trust it on the hundredth run."
        } },
      { type: "edit-file", path: "weekly-report/CLAUDE.md", mode: "append", button: "Open CLAUDE.md",
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
      openOn("weekly-report", "weekly-report"),
      { type: "claude-chat",
        learn: [5, 6],
        guide: "Next week you just say it. Try it.",
        script: [{
          suggestedPrompt: "make this week's table",
          acceptIf: { mentionsAnyOf: ["table"], mentionsAllOf: [] },
          rejectHint: "Ask for this week's table.",
          reply: {
            thinkingLines: ["map says: run python scripts/make-table.py on the newest export", "running scripts/make-table.py exports/2026-10-05-bookings.csv"],
            text: "Ran your script. summaries/2026-10-05-summary.md: 29 confirmed seats, $1,080, 17 pending. Same way, every time.",
            effects: [{ writeFile: "weekly-report/summaries/2026-10-05-summary.md", content: SUMMARY_1005 }]
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
      artifacts: ["weekly-report/scripts/make-table.py", "weekly-report/summaries/2026-10-05-summary.md"],
      quiz: {
        q: "Which step of the weekly report would you never hand to a script?",
        options: [
          { t: "Deciding what the owner needs to hear, and how to say it. That's reading between the lines.", correct: true },
          { t: "Adding up the confirmed seats." },
          { t: "Reading the CSV." },
          { t: "Writing the table." }
        ],
        explain: "Code for the same answer every time. The AI and you for judgment. That's the thirty and the ten."
      },
      reflect: {
        prompt: "What's a step in your real work you've done the same way three times?",
        saveTo: "weekly-report/.notes/3-2-reflection.md"
      }
    },
    xpLessonComplete: 60
  },

  // ===========================================================================
  "3-3_keep-it-useful": {
    intro: [0],
    build: [
      openOn("${ws}", "client-email"),
      { type: "claude-chat",
        learn: [1],
        guide: "The fresh-session test, back in client-email. A brand new session, one question.",
        script: [{
          suggestedPrompt: "What is this folder, what's in progress, and what's next?",
          acceptIf: { mentionsAnyOf: ["what is this", "in progress", "next"], mentionsAllOf: [] },
          rejectHint: "Ask the three questions: what is this folder, what's in progress, what's next.",
          reply: {
            thinkingLines: ["reading CLAUDE.md", "listing drafts/"],
            text: "It's where Jake answers client emails, with routing for replies and a bookings table. In progress: five drafts waiting in drafts/, two of them older replies to Lumen Dental. Next: Jake reads the replies and sends them, and answers Maple Street's laptop question.",
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
        guide: "One home for every fact. Ask it to find any fact or rule that lives in more than one place.",
        script: [{
          suggestedPrompt: "Find any fact or rule that lives in more than one file here, and list where each copy is.",
          acceptIf: { mentionsAnyOf: ["fact", "rule", "more than one", "duplicate", "copy", "copies"], mentionsAllOf: [] },
          rejectHint: "Ask it to find facts or rules that live in more than one file.",
          reply: {
            thinkingLines: ["comparing about-me.md with .claude/skills/how-i-reply/SKILL.md"],
            text: "Three rules live twice: sign it Jake, never open with 'I hope this email finds you well', and only promise what the notes confirm. They're in about-me.md and in the how-i-reply skill. Change one and they drift. Suggest: the skill is the one home for how to reply, and about-me points to it.",
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
        guide: "Make a folder called _archive in client-email. Retired work goes there, out of the way: the older Lumen Dental draft, for one.",
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
        guide: ["That's Foundations. Your folders are real files: download them from the menu, drop them on your real machine, and point the real Claude Code at them.",
          "Then go build something of your own, and post it in the Clief Notes community. Jake loves seeing what people make."],
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
