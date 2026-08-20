# Vitals

A personal, prototype-phase team health app. No enterprise constraints — this
file exists to keep design/dev decisions coherent across sessions, not to
impose process for its own sake.

## Docs and skills grow with the project

This file and the README are living documents, not a fixed spec written once.
As new areas of the app take shape, add sections here (or split into
additional `.md` files) rather than letting context live only in chat
history. Likewise, package up recurring workflows as skills once a pattern
repeats rather than re-explaining it each session. Keep the README's
"What's here" tree and "Next up" list in sync with what's actually shipped —
stale docs are worse than no docs. The same rule applies to the design system
specifically — see "Growing the design system" below: it grows with the app
or it becomes misleading.

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

## Patterns page

The employee "Patterns" nav item (`src/pages/PatternsView.tsx`) detects
recurring shape across an employee's six dimension scores — stuck/steady
plateaus, recovered dips, trending runs, inconsistent swings — and surfaces
the ones worth noticing as signal cards above a full six-row sparkline grid.

**Patterns vs. History — non-overlapping jobs.** Patterns and History are
both employee nav items but must not duplicate each other:
- **Patterns** — recurring *shape* across sprints, computed from the six
  `HealthMetrics` dimensions. No wins/pains text, no ticket data, no
  chronological reading.
- **History** — chronological journal/diary of past check-ins (wins, pains,
  prompts, tickets). Anything that reads as "scroll through what happened,
  in order" belongs here, not in Patterns.

If a feature idea is chronological/narrative, it belongs in History. If it's
cross-sprint pattern detection on the numeric dimensions, it belongs in
Patterns. Don't let History gain analytics, or Patterns gain a timeline —
that duplicates the other page's job.

**Bounded sprint window, not full history.** Patterns looks at a capped
trailing window of sprints (`PATTERN_WINDOW_SPRINTS = 10` in
`src/lib/patterns.ts`), not everything an employee has ever submitted.

**Why:** an unbounded window would (a) duplicate History's job — "browse
everything from the beginning" is History's, not Patterns' — (b) surface
stale streaks that resolved long ago as if they were current, and (c)
degrade sparkline legibility past what's actually readable at a glance.
Pattern-detection rules only look 3-4 sprints deep to fire in the first
place, so a wider window wouldn't change what gets detected — only how much
irrelevant history surrounds it.

**How to apply:** the window is a named constant that trims each dimension's
trend to its trailing N sprints before running detection — not a UI toggle,
not per-employee. The seed data (currently 5 sprints, `VITALS_SPRINTS` in
`mockData.ts`) doesn't exercise the cap yet since it hasn't grown past 10 —
the constant exists so behavior is already defined for when it does.

## Where things live

- `src/data/mockData.ts` — all seed data (employees, surveys, tickets,
  reflections, teams). Everything in the app is mock data; that's expected at
  this phase. Prefer deriving new mock data from existing helpers
  (`vitalsAvg`, `vitalsEmpAvg`, `vitalsTeamAvg`) over hardcoding numbers that
  duplicate them.
- `src/lib/` — pure helper logic shared across components (tone/status
  thresholds, formatting), not tied to one page.
- `src/components/ui/` — the design system: generic, tokenized, no domain
  knowledge (Button, Card, Badge, Eyebrow, DimensionBar, RatingRow,
  PatternSparkline). One PascalCase folder per component
  (`Component.tsx` + `index.ts` + `.stories.tsx` + `.test.tsx`), imported as
  `@/components/ui/ComponentName`. Kept deliberately small — only what the
  app actually consumes, not a speculative kitchen sink. `npm run storybook`
  browses every component plus MDX Foundations docs (Colors/Typography/
  Spacing) that render live from `src/design-system/`'s actual CSS custom
  properties.
- `src/design-system/tokens.css` / `typography.css` — the design system's
  source of truth for color, radius, and font-family tokens. `src/index.css`
  imports both and wires them into Tailwind v4's `@theme inline` mapping —
  edit the values here, not in index.css.
- `src/components/vitals/` — domain composition: page-specific pieces
  (HeroCheckIn, TicketList, AppSidebar, …) that consume `components/ui/` and
  know about Vitals' actual data (Employee, Ticket, HealthMetrics). If a
  piece has zero domain knowledge and could plausibly be reused outside this
  app, it belongs in `components/ui/` instead.
- `src/pages/` — page-level composition for a specific role/view.
- `src/types/index.ts` — the domain model. Extend it when new data shapes are
  needed rather than passing loosely-typed objects around.

## Growing the design system

`components/ui/` and `design-system/` are not a fixed deliverable — they grow
the same way the rest of this file does (see "Docs and skills grow with the
project" above). A design system that stops changing while the app keeps
changing is worse than no design system: it starts lying about what's
actually shipped. So as part of building a feature, not as cleanup after:

- **New generic UI** (no domain knowledge — types are just primitives/enums,
  no `Employee`/`Ticket`/`HealthMetrics`, no `mockData` import) belongs in
  `components/ui/<PascalCase>/`, not inline in a page or added to
  `components/vitals/`. Give it `Component.tsx` + `index.ts` +
  `.stories.tsx` + a test (smoke, or interaction if it has real state — see
  the Testing section's calibration list below).
- **New token** (a color, radius, or font value used more than once, or
  meaningful enough to name) goes in `design-system/tokens.css` or
  `typography.css`, referenced via `var()` — never a hardcoded oklch/hex/px
  value duplicated inline. If it's foundational enough to explain (not just
  a one-off), add it to the matching Storybook Foundations MDX page
  (Colors/Typography/Spacing) so the live docs keep matching reality.
- **New recurring pattern that isn't (yet) a component** — a hand-rolled
  recipe like the app already has a few of (a stat readout, a status-tone
  mapping) — doesn't have to be extracted immediately, but note in the
  nearest component's story or doc where it lives and that it's duplicated,
  the way this project already flags Card as "exported, not yet consumed" or
  Button's unused variants as "documented ahead of need." An honest gap
  beats a silently stale doc.
- Before calling UI work done, ask: *does Storybook already show this, or
  does it need a new/updated story?* If the app's behavior and Storybook's
  story for it have diverged, fix that in the same change — don't leave it
  for later.

## Testing

Vitals uses **Vitest** (not Jest) — it reuses `vite.config.ts`'s transform and
`@` alias with zero duplicate config, and has a Jest-compatible `describe`/
`it`/`expect` API. Test config lives in `vite.config.ts`'s `test` block, not
a separate `vitest.config.ts` — keep it there so alias/plugin config can
never drift between build and test.

**Run tests:** `npm test` (single run) · `npm run test:watch` (watch mode) ·
`npm run test:coverage` (with coverage report).

**Colocate test files** next to the source they cover:
`src/lib/teamPulse.ts` → `src/lib/teamPulse.test.ts`,
`src/components/vitals/DimensionBar.tsx` → `DimensionBar.test.tsx`. No
separate `__tests__/` tree.

**mockData isolation.** `src/data/mockData.ts`'s seed objects are shared,
mutable module-level singletons — `submitCheckIn` writes into them directly,
and several read helpers (`vitalsEmpAvg`, `vitalsTrend`, `getVitalsTeams`,
`detectPatternSignals`, `buildSeedNotes`) read that live, possibly-mutated
state. Vitest isolates module registries **per test file** by default, but
NOT between tests within the same file — so any test (or `describe` block)
whose tests touch `submitCheckIn` or read from something that reads
`VITALS_SURVEYS`/`VITALS_REFLECTIONS` must reset the module registry before
every test:

```ts
let mockData: typeof import("@/data/mockData");

beforeEach(async () => {
  vi.resetModules();
  mockData = await import("@/data/mockData");
});
```

If the module under test itself imports `mockData` (e.g. `patterns.ts`,
`retroBoard.ts`), dynamically re-import *that* module too in the same
`beforeEach` — a statically-imported module closes over the stale pre-reset
`mockData` instance. Pure functions taking plain params need none of this —
see `src/lib/patterns.test.ts` and `src/data/mockData.test.ts` for the
pattern applied to only the functions that need it, scoped to their own
`describe` block, in an otherwise-static-import test file.

**What needs a test, going forward:**
- Every new function in `src/lib/` or a new pure/read helper in
  `src/data/mockData.ts` gets a test file: happy path, a boundary value, and
  — if bad input is possible — the actual current behavior on bad input
  (even if that's "throws").
- Every new page (`src/pages/`) or component (`src/components/vitals/`,
  `src/components/ui/`) gets at least a render-smoke test.
- Components with real internal state/interaction beyond a trivial toggle
  (calibrate against `RatingRow`/`AppSidebar`/`UserSwitcher`/`PatternsView`/
  `CheckInView`/`TeamOverviewView`) get interaction tests, not just a smoke
  test — `@testing-library/user-event` for realistic user gestures (click,
  hover, type). `PatternSparkline` is the one exception worth knowing about:
  its hover state is driven by raw `clientX`/`clientY` on SVG `<circle>`
  points, so its test uses `fireEvent.mouseEnter(circle, { clientX, clientY
  })` directly instead — `user-event` isn't a better fit for asserting a
  specific synthetic-event payload.
- Components driven by real browser geometry/timing jsdom can't fake —
  canvas (`TeamTrace`), `getBoundingClientRect`-driven drag math
  (`RetroPrepView`), `scrollHeight`-dependent effects (`StickyNote`) — get a
  smoke test only, plus full coverage of any logic extracted into a pure
  `src/lib/` function instead (the existing pattern: `RetroPrepView`'s
  cluster/layout math already lives in `retroBoard.ts` specifically so it's
  unit-testable). Full drag/interaction coverage for these is out of scope
  for unit tests — leave a one-line comment noting what's deliberately not
  covered and why; defer to a future e2e tool if that's ever added.
- If new code calls `submitCheckIn` (or anything downstream of mutable
  mockData state), use the isolation pattern above.
