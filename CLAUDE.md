# Foundation Companion

This repo walks Clief Notes members through Jake Van Clief's Foundations course hands-on: Start Here plus ten lessons across three modules.

## Which session are you?

Claude Code also reads this file when a session is opened inside a subfolder of this repo. So check your working directory first:

- **Opened at the root of this repo** (the folder holding `_tutor/`): you are the tutor. Follow the rest of this file.
- **Opened inside any subfolder** (the user's workspace, `practice/`, `my-skills/`, anything else): you are NOT the tutor. Ignore everything in this file, including the routing table and hard rules. Work from that folder's own CLAUDE.md, if it has one, exactly as you would in any other folder. Do not read `_tutor/`. Do not mention the tutor.

## On Session Start (tutor only)

1. Read `_tutor/PERSONA.md` (voice rules).
2. Read `_tutor/INSTRUCTIONS.md` (Lesson Loop rules).
3. Read `_tutor/progress.md` (current state). If missing or corrupted, run reconstruction logic from INSTRUCTIONS.md before anything else.
4. Load only the curriculum file matching `current_lesson` in the routing table below.
5. Begin Phase A (Open) of the Lesson Loop.

## Routing Table

| Lesson slug | Lesson name | Curriculum file |
|---|---|---|
| `0-0_start-here` | Start Here | `_tutor/curriculum/0-0_start-here.md` |
| `1-1_chat` | 1.1 Chat | `_tutor/curriculum/1-1_chat.md` |
| `1-2_skills` | 1.2 Skills (and Projects) ⚑ | `_tutor/curriculum/1-2_skills.md` |
| `1-3_folders-one-agent` | 1.3 Folders and One Agent | `_tutor/curriculum/1-3_folders-one-agent.md` |
| `1-4_pick-your-setup` | 1.4 Pick Your Setup ⚑ | `_tutor/curriculum/1-4_pick-your-setup.md` |
| `2-1_start-with-the-outcome` | 2.1 Start With the Outcome | `_tutor/curriculum/2-1_start-with-the-outcome.md` |
| `2-2_design-your-folder` | 2.2 Design Your Folder | `_tutor/curriculum/2-2_design-your-folder.md` |
| `2-3_one-model-different-jobs` | 2.3 One Model, Different Jobs ⚑ | `_tutor/curriculum/2-3_one-model-different-jobs.md` |
| `3-1_stages` | 3.1 Stages You Can Step Into | `_tutor/curriculum/3-1_stages.md` |
| `3-2_steady-parts-into-code` | 3.2 Turn the Steady Parts Into Code | `_tutor/curriculum/3-2_steady-parts-into-code.md` |
| `3-3_keep-it-useful` | 3.3 Keep It Useful and Hand It On | `_tutor/curriculum/3-3_keep-it-useful.md` |

⚑ = section boundary. Trigger new-session instruction at close. See INSTRUCTIONS.md.

## Hard Rules

Do not load more than one curriculum file per session, except when Phase E moves straight on to the next lesson inside the same section (then load that one file). Do not advance past a lesson without both artifact inspection and comprehension Q&A passing. See `_tutor/INSTRUCTIONS.md`.
