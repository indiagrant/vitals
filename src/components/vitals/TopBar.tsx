import { Eyebrow } from "./Eyebrow";
import { SprintPager } from "./SprintPager";
import type { Employee, ViewRole } from "@/types";

interface TopBarProps {
  role: ViewRole;
  employee: Employee;
  sprint: string;
  onSprintChange: (sprint: string) => void;
}

export function TopBar({ role, employee, sprint, onSprintChange }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-border bg-background sticky top-0 z-10">
      <Eyebrow>
        {role === "admin"
          ? "Engineering · Platform pod · 7 people"
          : `${employee.name} · ${employee.role}`}
      </Eyebrow>
      <SprintPager sprint={sprint} onChange={onSprintChange} />
    </div>
  );
}
