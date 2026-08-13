import { Eyebrow } from "./Eyebrow";
import { SprintPager } from "./SprintPager";
import { VITALS_TEAMS } from "@/data/mockData";
import type { Employee, ViewRole } from "@/types";

interface TopBarProps {
  role: ViewRole;
  employee: Employee;
  sprint: string;
  onSprintChange: (sprint: string) => void;
}

export function TopBar({ role, employee, sprint, onSprintChange }: TopBarProps) {
  const totalPeople = VITALS_TEAMS.reduce((s, t) => s + t.checkins.length, 0);

  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-border bg-background sticky top-0 z-10">
      <Eyebrow>
        {role === "admin"
          ? `All teams · ${VITALS_TEAMS.length} teams · ${totalPeople} people`
          : `${employee.name} · ${employee.role}`}
      </Eyebrow>
      <SprintPager sprint={sprint} onChange={onSprintChange} />
    </div>
  );
}
