import { ADMIN_NAV, type NavId } from "./AppSidebar";
import { TopBarIdentity } from "./TopBarIdentity";
import { SprintPager } from "./SprintPager";
import { getVitalsTeams, VITALS_SPRINTS } from "@/data/mockData";
import { patternSprintWindow } from "@/lib/patterns";
import type { Employee } from "@/types";

interface TopBarProps {
  view: NavId;
  employee: Employee;
  sprint: string;
  onSprintChange: (sprint: string) => void;
}

export function TopBar({ view, employee, sprint, onSprintChange }: TopBarProps) {
  const isAdminView = ADMIN_NAV.some((item) => item.id === view);
  const teams = getVitalsTeams();
  const totalPeople = teams.reduce((s, t) => s + t.checkins.length, 0);

  // Patterns and History both span every sprint rather than showing one at a
  // time, so the per-sprint pager doesn't apply — swap it for a static range
  // label. Patterns uses its capped trailing window (see CLAUDE.md "Patterns
  // page"); History deliberately shows the full, unbounded range instead —
  // it's the one page whose whole job is "everything, in order".
  const rangeSprints =
    view === "patterns" ? patternSprintWindow() : view === "history" ? [...VITALS_SPRINTS] : null;

  return (
    // min-h locked to SprintPager's rendered height — without it the bar has
    // no fixed height and just sizes to whatever's shortest (Patterns' plain
    // range text is shorter than the pager's padded chip + buttons), so the
    // whole header visibly shrinks on that page, not just the right-side
    // control.
    <div className="flex min-h-[66px] items-center justify-between px-10 py-4 border-b border-border bg-background sticky top-0 z-10">
      <TopBarIdentity
        label={
          isAdminView
            ? `All teams · ${teams.length} teams · ${totalPeople} people`
            : `${employee.name} · ${employee.role}`
        }
      />
      {rangeSprints ? (
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
          {rangeSprints[0]} → {rangeSprints[rangeSprints.length - 1]} · {rangeSprints.length} sprints
        </span>
      ) : (
        <SprintPager sprint={sprint} onChange={onSprintChange} />
      )}
    </div>
  );
}
