import { ADMIN_NAV, type NavId } from "./AppSidebar";
import { Eyebrow } from "./Eyebrow";
import { SprintPager } from "./SprintPager";
import { getVitalsTeams } from "@/data/mockData";
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

  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-border bg-background sticky top-0 z-10">
      <Eyebrow>
        {isAdminView
          ? `All teams · ${teams.length} teams · ${totalPeople} people`
          : `${employee.name} · ${employee.role}`}
      </Eyebrow>
      <SprintPager sprint={sprint} onChange={onSprintChange} />
    </div>
  );
}
