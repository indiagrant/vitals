import { ADMIN_NAV, type NavId } from "./AppSidebar";
import { Eyebrow } from "./Eyebrow";
import { SprintPager } from "./SprintPager";
import { getVitalsTeams } from "@/data/mockData";
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

  // Patterns spans a window of sprints rather than showing one at a time, so
  // the per-sprint pager doesn't apply — swap it for a static range label.
  // See CLAUDE.md "Patterns page" for why this view doesn't use `sprint`.
  const patternsWindow = view === "patterns" ? patternSprintWindow() : null;

  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-border bg-background sticky top-0 z-10">
      <Eyebrow>
        {isAdminView
          ? `All teams · ${teams.length} teams · ${totalPeople} people`
          : `${employee.name} · ${employee.role}`}
      </Eyebrow>
      {patternsWindow ? (
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
          {patternsWindow[0]} → {patternsWindow[patternsWindow.length - 1]} · {patternsWindow.length} sprints
        </span>
      ) : (
        <SprintPager sprint={sprint} onChange={onSprintChange} />
      )}
    </div>
  );
}
