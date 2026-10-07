# Weekly report

Every Monday the bookings export lands in `exports/`, and I turn it into a summary table. Everything here is made up for a demo.

## What's where
| Folder | Holds |
|---|---|
| `exports/` | one bookings export per week, `YYYY-MM-DD-bookings.csv` |
| `summaries/` | one summary per week, `YYYY-MM-DD-summary.md` |

## Routing
| Job | Read | Save to |
|---|---|---|
| weekly table | the newest file in `exports/` | `summaries/`, same date as the export |

## The table
One row per client: confirmed seats, confirmed revenue (seats × price per seat), pending seats. Then a total row. Only confirmed bookings count as revenue.
