# Vitals

A calm sprint check-in tool. Engineers reflect after each sprint;
managers see warmth-first sentiment trends without surveillance vibes.

Built with **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui**.

## Setup

```bash
pnpm install      # or npm install / yarn
pnpm dev          # start dev server at http://localhost:5173
```

## Check-in form

`pages/CheckInView.tsx` — the Employee "Check-in" data entry point. Captures
the six dimensions plus wins/pains and writes the result back into
`mockData.ts`'s in-memory store, which is what feeds the Sprint page's
history for that employee.

## Patterns page

`pages/PatternsView.tsx` — the Employee "Patterns" nav item. Algorithmically
detects recurring shape across a trailing window of sprints (stuck/steady
plateaus, recovered dips, trending runs, inconsistent swings — see
`lib/patterns.ts`) and surfaces the notable ones as signal cards above a
full six-dimension sparkline grid; clicking a card highlights its row.
Deliberately scoped away from History's job (a chronological read of past
check-ins) — see CLAUDE.md's "Patterns page" section for the full rationale,
including why the sprint window is capped rather than unbounded.

## What's here

```
src/
├─ index.css                          # Tailwind v4 + Vitals theme tokens (warm cream + sage)
├─ main.tsx
├─ App.tsx                            # Shell: sidebar + topbar + page routing
├─ types/index.ts                     # Domain types (Employee, HealthMetrics, Ticket, …)
├─ data/mockData.ts                   # Employees, sprints, surveys, tickets, reflections
│
├─ lib/
│  ├─ utils.ts                        # cn() for className merging
│  ├─ teamPulse.ts                    # Team overview scoring/tone helpers
│  └─ patterns.ts                     # Pattern-detection algorithm for the Patterns page
│
├─ pages/
│  ├─ SprintView.tsx                  # Employee · Sprint home (the main page)
│  ├─ CheckInView.tsx                 # Employee · Check-in form (writes to mockData.ts)
│  ├─ PatternsView.tsx                # Employee · Recurring cross-sprint patterns
│  ├─ TeamOverviewView.tsx            # Admin · Team overview pulse-monitor
│  └─ PlaceholderView.tsx             # Generic "coming soon" view
│
└─ components/
   ├─ ui/                             # shadcn primitives (button, card)
   └─ vitals/
      ├─ AppSidebar.tsx               # Role-aware sidebar nav
      ├─ TopBar.tsx                   # Sticky topbar w/ sprint pager
      ├─ SprintPager.tsx              # ← / → between sprints
      ├─ UserSwitcher.tsx             # Modal user picker
      ├─ Eyebrow.tsx                  # Mono-caps section label
      ├─ PatternSparkline.tsx         # Per-dimension sprint-over-sprint sparkline
      │
      │ Sprint page parts:
      ├─ HeroCheckIn.tsx              # Headline + score + team avg + trend
      ├─ DimensionGrid.tsx            # Six dimension bars w/ deltas vs prev sprint
      ├─ DimensionBar.tsx             # Single 5-step bar (sage/clay tone)
      ├─ TicketList.tsx               # Tickets w/ estimate-vs-actual bar + notes
      ├─ WinsAndPains.tsx             # Sage / clay reflection columns
      └─ Prompts.tsx                  # Three open prompts for next 1:1
```

## The Sprint page

The Employee "Sprint" home — `pages/SprintView.tsx` — lays out one sprint's
reflection from highest-level signal down to actionable nudges:

1. **Hero check-in** — overall headline ("A heavy sprint", "A steady sprint"…),
   the employee's average score, team average, and trend vs. previous sprint.
   Background ribbon goes sage/clay/neutral based on score.
2. **Dimension grid** — six 5-step bars (Balance, Comms, Support, Collab,
   Workload, Satisfaction) with deltas vs. previous sprint.
3. **Ticket list** — what they worked on. Each row has an estimate-vs-actual
   bar with a tick at the estimate (no "you missed by 30%" red flags), plus an
   optional reflection note.
4. **Wins & pains** — color-blocked sage / clay panels. Wins are always paired
   with pains so the page never reads as judgmental.
5. **Prompts** — three open-ended questions to take into the next 1:1 or retro.

Try it across employees via the user switcher in the sidebar:
- **Maya (E001)** — steady, with workload at 2 for three sprints
- **Daniel (E002)** — improving; led his first incident
- **Priya (E003)** — strong & consistent
- **Lukas (E004)** — communication score stuck at 2
- **Aiko (E007)** — trending down across multiple dimensions

Use the sprint pager (top-right) to flip through S20–S24.

## Theme

Tailwind v4 config lives in `src/index.css` via `@theme inline`.
The Vitals palette overrides shadcn's tokens — `--primary` is **sage**,
`--destructive` is **clay** (softer than red — better for "pain" framing),
`--background` is a warm cream.

Custom tokens: `bg-sage`, `bg-sage-soft`, `bg-clay`, `bg-clay-soft`,
`bg-line-soft`, plus `text-sage` and `text-clay`.

## Adding shadcn components

Already configured for shadcn (`components.json` in repo root):

```bash
pnpm dlx shadcn@latest add badge dialog dropdown-menu
```

## Next up

- **Retro prep** view — talking points synthesized from a check-in, for the actual retro meeting
- **History** view — browse past check-ins
- **Admin views** — Team overview is built; by-dimension, sprint-health, sentiment-trend, and settings are still placeholders
- **Team initialization (admin)** — admin sets each team's retro cadence: a start date plus weekly/bi-weekly/monthly recurrence. Employees should get notified a few days before their check-in window opens. No team-creation flow exists yet; this depends on it.
