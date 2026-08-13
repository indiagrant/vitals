# Vitals

A personal, prototype-phase team health app. No enterprise constraints — this
file exists to keep design/dev decisions coherent across sessions, not to
impose process for its own sake.

## Design/dev workflow: mock first, then translate

New visual concepts and page-level features get prototyped as a self-contained
HTML file published via the Artifact tool **before** they get built into the
real codebase. Two separate things exist side by side on purpose:

1. **The mock** — a single-file HTML/CSS/JS artifact. No build step, no
   framework, instant visual feedback. This is where the actual design
   thinking happens: layout, motion (or the decision to remove motion),
   interaction, data shape. It's disposable and fast to throw away or redo.
2. **The real app** — `E:\Projects\vitals`, the Vite + React 19 + TypeScript +
   Tailwind v4 + shadcn/ui codebase. This is where a concept lands once it's
   been validated in the mock, translated into the app's actual components,
   types, and mock data conventions.

**Why this order:** iterating on a rendered artifact is much faster than
iterating on React components — no component boundaries to guess at yet, no
type errors, no build. Bad ideas die cheap in the mock. Only validated
direction gets the more expensive translation into real code.

**How to translate a mock into the app:**
- Pull the mock's color/spacing/type decisions from `src/index.css`'s actual
  tokens (`--sage`, `--clay`, `--line-soft`, etc.) rather than re-deriving
  them — the mock should already be using these exact values (see below).
- Reuse existing components (`Eyebrow`, `DimensionBar`, the `HeroCheckIn`
  stat/divider pattern) instead of re-implementing their look.
- Reuse or extend `src/data/mockData.ts` conventions — derive computed values
  from real per-employee data where possible (e.g. `vitalsEmpAvg`,
  `vitalsTeamAvg`) rather than hand-typing numbers that duplicate them, so the
  mock data stays internally consistent and doesn't drift from the app's
  actual seed data.
- Vanilla-JS canvas/interaction logic ports fairly directly into a React
  component (`useRef` + `useEffect` + `ResizeObserver` in place of manual
  DOM queries and resize listeners).
- Once translated, keep the artifact open and up to date rather than
  abandoning it — it's the fast surface for the *next* iteration, the app is
  the record of what's actually shipped.

**When building the mock**, match the real app's design system exactly rather
than inventing a fresh palette:
- Colors: the exact `oklch()` values from `src/index.css` (`--background`,
  `--sage`, `--sage-soft`, `--clay`, `--clay-soft`, `--line-soft`, etc.),
  including both the light `:root` values and the `.dark` values, ported to
  the artifact's `prefers-color-scheme` / `data-theme` pattern.
- Type: Geist for UI text, JetBrains Mono for eyebrows/labels/numeric
  readouts (system-font fallbacks are fine in the mock since the Artifact CSP
  blocks font CDNs — note the substitution rather than silently drifting).
- Chrome: mirror the real `AppSidebar`/`TopBar` structure so the mock reads
  as "this app, with one page changed" rather than a disconnected concept.

## Scope discipline

Features get built scoped to the specific role/view they affect. Vitals has
two roles (`employee`, `admin`) and each has its own nav (`AppSidebar`'s
`EMPLOYEE_NAV` / `ADMIN_NAV`). When building a feature for one nav item:
- Only wire it into `App.tsx`'s routing for that exact `role`/`view`
  combination — leave every other combination rendering `PlaceholderView`
  exactly as before.
- Don't touch employee-facing views while building an admin-only feature, or
  vice versa.
- A shared component (`DimensionBar`, `Eyebrow`, `TopBar`) can be edited if
  the change is genuinely backward-compatible (e.g. fixing a display bug that
  produces identical output for existing inputs) — but call this out
  explicitly rather than folding it in silently, since it's the one case
  where a "scoped" feature touches shared surface area.

## Where things live

- `src/data/mockData.ts` — all seed data (employees, surveys, tickets,
  reflections, teams). Everything in the app is mock data; that's expected at
  this phase. Prefer deriving new mock data from existing helpers
  (`vitalsAvg`, `vitalsEmpAvg`, `vitalsTeamAvg`) over hardcoding numbers that
  duplicate them.
- `src/lib/` — pure helper logic shared across components (tone/status
  thresholds, formatting), not tied to one page.
- `src/components/vitals/` — reusable page-building blocks, one concern each.
- `src/pages/` — page-level composition for a specific role/view.
- `src/types/index.ts` — the domain model. Extend it when new data shapes are
  needed rather than passing loosely-typed objects around.
