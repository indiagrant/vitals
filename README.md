# Vitals

A calm sprint check-in tool. Engineers reflect after each sprint;
managers see warmth-first sentiment trends without surveillance vibes.

Built with **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui**.

## Setup

```bash
npm install      
npm run dev      
```

## What's here

```
src/
├─ index.css                          # Tailwind v4 + Vitals theme tokens (warm cream + sage)
├─ main.tsx
├─ App.tsx                            # shell — sidebar + topbar + main
├─ lib/utils.ts                       # cn() for className merging
├─ types/index.ts                     # Domain types (Employee, HealthMetrics, …)
├─ data/mockData.ts                   # Employees, sprints, surveys, helpers
└─ components/
   ├─ ui/                             # shadcn primitives (button, card)
   └─ vitals/
      ├─ AppSidebar.tsx               # Role-aware sidebar nav
      ├─ TopBar.tsx                   # Sticky topbar w/ sprint pager
      ├─ SprintPager.tsx
      ├─ UserSwitcher.tsx             # Modal user picker
      └─ Eyebrow.tsx                  # Mono-caps section label
```

## Next up

The main content area is a placeholder. Build out:

1. **Sprint view** (Employee) — check-in, ticket list, wins/pains, prompts
2. **Team overview** (Admin) — sortable team list with gentle flags
3. **Check-in form** — submit a new survey
4. **Patterns / Retro prep / History** tabs

The role toggle in the placeholder card is dev-only — replace with a proper
admin route once auth is in.
