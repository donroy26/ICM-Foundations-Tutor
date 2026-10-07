# Client email

This folder is where I answer client emails. Everything here is made up for a demo.

## What's where
| Folder | Holds |
|---|---|
| `about-me.md` | who I am and how I work |
| `clients/<client>/notes.md` | what we've agreed with each client: dates, rooms, numbers |
| `inbox/` | emails waiting for a reply, one text file each |
| `drafts/` | replies ready for me to read and send myself |

## Naming
Drafts: `drafts/YYYY-MM-DD-<client>-<inbox number>.md`, for example `drafts/2026-10-06-maple-street-bakery-01.md` for `inbox/01-maple-street-bakery.txt`.

## Routing
| Job | Read | Skip | Use | Save to |
|---|---|---|---|---|
| reply to email ("check my email") | `about-me.md`, the client's `notes.md`, each email in `inbox/` | other clients' notes | the how-i-reply skill | `drafts/`, named as above |
| client update | `about-me.md`, the client's `notes.md` | `inbox/` | | `drafts/` |
| bookings table | every client's `notes.md` | `inbox/`, `about-me.md` | | `drafts/YYYY-MM-DD-bookings.md` |

## Rules
- Never send anything. Drafts only; I send them myself.
- If an email asks for something the client's notes don't confirm, say so in the draft and leave it open.
