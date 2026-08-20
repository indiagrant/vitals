# Vitals

A calm sprint check-in tool. Engineers reflect after each sprint;
managers see warmth-first sentiment trends without surveillance vibes.

Built with **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui**.

## Setup

```bash
pnpm install      # or npm install / yarn
pnpm dev          # start dev server at http://localhost:5173
```

## Testing

```bash
pnpm test           # run once
pnpm test:watch     # watch mode
pnpm test:coverage  # with a coverage report
```

Vitest + React Testing Library, colocated `*.test.ts(x)` files next to the
source they cover. See CLAUDE.md's "Testing" section for the full convention
— in particular, the `mockData.ts` isolation pattern (`vi.resetModules()`)
needed by any test touching its mutable seed state.

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

## Retro prep page

`pages/RetroPrepView.tsx` — the Employee "Retro prep" nav item. A corkboard,
not a stat surface: every other page is bars/sparklines/structured text, this
one is draggable sticky notes, built for standing in front of a screen-share
before (or during) a retro and moving things around. Pre-seeded from that
sprint's wins, pains, prompts, and the single largest dimension delta vs. the
previous sprint (`lib/retroBoard.ts` — a lightweight one-sprint-back
comparison, deliberately *not* Patterns' multi-sprint algorithm; see
CLAUDE.md's "Patterns page" for why the two stay non-overlapping).

Notes drag freely, edit inline, cycle through a small color palette, delete,
and can be starred (gold border + glow) to flag "definitely raising this."
Drag two notes substantially onto each other and a dashed boundary appears
around the group with an editable name — lightweight affinity-mapping.
Toolbar actions: **Tidy board** (snap into a grid), **Reset board** (discard
edits, reload the sprint's seed), **Copy as agenda** (plain-text bulleted
summary, ready to paste into a meeting doc). The expand icon on the board
itself is **present mode** — hides the sidebar/topbar/header so the board can
fill the screen while screen-sharing.

The one deliberate type-system departure in the app: note body text uses a
handwritten accent font (Caveat) instead of Geist/JetBrains Mono, to read as
scribbled rather than typeset.

## What's here

```
src/
├─ index.css                          # Tailwind v4 wiring — imports design-system/ tokens +
│                                      # typography, the @theme mapping, global base styles
├─ main.tsx
├─ App.tsx                            # Shell: sidebar + topbar + page routing
├─ types/index.ts                     # Domain types (Employee, HealthMetrics, Ticket, …)
├─ data/mockData.ts                   # Employees, sprints, surveys, tickets, reflections
│
├─ design-system/
│  ├─ tokens.css                      # Source of truth: every color + radius token (:root/.dark)
│  └─ typography.css                  # Font-family token values (Geist, Instrument Serif, …)
│
├─ lib/
│  ├─ utils.ts                        # cn() for className merging
│  ├─ teamPulse.ts                    # Team overview scoring/tone helpers
│  ├─ patterns.ts                     # Pattern-detection algorithm for the Patterns page
│  └─ retroBoard.ts                   # Seed-note generation, clustering, tidy layout, agenda text
│
├─ pages/
│  ├─ SprintView.tsx                  # Employee · Sprint home (the main page)
│  ├─ CheckInView.tsx                 # Employee · Check-in form (writes to mockData.ts)
│  ├─ PatternsView.tsx                # Employee · Recurring cross-sprint patterns
│  ├─ RetroPrepView.tsx               # Employee · Corkboard talking-points board
│  ├─ TeamOverviewView.tsx            # Admin · Team overview pulse-monitor
│  └─ PlaceholderView.tsx             # Generic "coming soon" view
│
└─ components/
   ├─ ui/                             # The design system — generic, tokenized, no domain knowledge.
   │                                  # Each folder: Component.tsx + index.ts + .stories.tsx + .test.tsx
   │  ├─ Button/
   │  ├─ Card/
   │  ├─ Badge/                       # Tone-based status label (extracted from TicketList)
   │  ├─ Eyebrow/                     # Mono-caps section label
   │  ├─ DimensionBar/                # Single 5-step bar (sage/clay tone)
   │  ├─ RatingRow/                   # Interactive counterpart to DimensionBar
   │  └─ PatternSparkline/            # Per-dimension sprint-over-sprint sparkline
   └─ vitals/                         # Domain composition — consumes components/ui/, knows about
      │                               # Vitals' actual data (Employee, Ticket, HealthMetrics, …)
      ├─ AppSidebar.tsx               # Role-aware sidebar nav
      ├─ TopBar.tsx                   # Sticky topbar w/ sprint pager
      ├─ SprintPager.tsx              # ← / → between sprints
      ├─ UserSwitcher.tsx             # Modal user picker
      ├─ StickyNote.tsx               # Draggable/editable corkboard note (Retro prep)
      │
      │ Sprint page parts:
      ├─ HeroCheckIn.tsx              # Headline + score + team avg + trend
      ├─ DimensionGrid.tsx            # Six dimension bars w/ deltas vs prev sprint
      ├─ TicketList.tsx               # Tickets w/ estimate-vs-actual bar + notes
      ├─ WinsAndPains.tsx             # Sage / clay reflection columns
      └─ Prompts.tsx                  # Three open prompts for next 1:1
```

## Design system

`src/components/ui/` is a small, in-house design system — not a kitchen sink:
Button, Card, Badge, Eyebrow, DimensionBar, RatingRow, PatternSparkline, each
consumed exactly where the app actually needs it (see the file tree above).
Import from the component's own folder:

```tsx
import { Button } from "@/components/ui/Button";

<Button size="lg" disabled={!allRated} onClick={handleSubmit}>
  Submit check-in
</Button>
```

`src/design-system/tokens.css` and `typography.css` are its source of truth
for color and type; `src/index.css` just wires them into Tailwind v4's
`@theme inline`. Every component, plus MDX docs for Colors/Typography/Spacing,
is browsable and live-editable in Storybook:

```bash
pnpm storybook        # localhost:6006
pnpm build-storybook  # static build, e.g. for hosting
```

**This grows with the app.** New generic UI goes in `components/ui/` with a
story, not inline in a page. See CLAUDE.md's "Growing the design system" for
the full rule — the short version: if Storybook stops matching what's
shipped, fix that in the same change, not later.

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
pnpm dlx shadcn@latest add dialog dropdown-menu
```

shadcn writes flat, lowercase files into `components/ui/` — manually relocate
whatever it generates into a `PascalCase/` folder (`Component.tsx` + `index.ts`,
matching Button/Card/etc.) before using it. Vitals already has its own
hand-rolled `Badge` (sage/clay/muted tone-based, not shadcn's default color
system) — don't regenerate one from the CLI.

## Next up

- **Real persistence (local DB)** — everything today lives in memory only.
  `mockData.ts`'s module-level objects (what Check-in writes into) reset on
  every reload, and Retro prep's board doesn't even survive navigating away
  from the page and back (see `RetroPrepView` — no `localStorage`, no
  backend, state dies the moment the component unmounts). Plan is a local,
  free-tier database (e.g. SQLite) that Check-in, History, and Retro prep
  all read/write through, so a check-in, a retro board, and an employee's
  history actually survive a reload or an app restart, not just the
  current session.
- **History** view — browse past check-ins
- **Admin views** — Team overview is built; by-dimension, sprint-health, sentiment-trend, and settings are still placeholders
- **Team initialization (admin)** — admin sets each team's retro cadence: a start date plus weekly/bi-weekly/monthly recurrence. Employees should get notified a few days before their check-in window opens. No team-creation flow exists yet; this depends on it.
