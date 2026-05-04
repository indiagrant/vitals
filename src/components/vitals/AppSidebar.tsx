import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  MessageSquareQuote,
  History,
  Users,
  BarChart3,
  Settings,
  ChevronsUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { UserSwitcher } from "./UserSwitcher";
import type { Employee, ViewRole } from "@/types";

export type EmployeeNavId = "sprint" | "checkin" | "patterns" | "retro" | "history";
export type AdminNavId    = "team" | "dimensions" | "sprint-health" | "trend" | "settings";
export type NavId         = EmployeeNavId | AdminNavId;

interface AppSidebarProps {
  role: ViewRole;
  view: NavId;
  onViewChange: (view: NavId) => void;
  employee: Employee;
  employees: Employee[];
  onEmployeeChange: (id: string) => void;
}

const EMPLOYEE_NAV: Array<{ id: EmployeeNavId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "sprint",   label: "Sprint",     icon: LayoutDashboard },
  { id: "checkin",  label: "Check-in",   icon: ClipboardCheck },
  { id: "patterns", label: "Patterns",   icon: Activity },
  { id: "retro",    label: "Retro prep", icon: MessageSquareQuote },
  { id: "history",  label: "History",    icon: History },
];

const ADMIN_NAV: Array<{ id: AdminNavId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "team",          label: "Team overview",  icon: Users },
  { id: "dimensions",    label: "By dimension",   icon: BarChart3 },
  { id: "sprint-health", label: "Sprint health",  icon: Activity },
  { id: "trend",         label: "Sentiment trend",icon: History },
  { id: "settings",      label: "Settings",       icon: Settings },
];

export function AppSidebar({ role, view, onViewChange, employee, employees, onEmployeeChange }: AppSidebarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const items = role === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;

  return (
    <aside className="bg-sidebar border-r border-sidebar-border flex flex-col gap-6 px-4 py-5 w-60 shrink-0">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-md bg-sage text-primary-foreground grid place-items-center text-[13px] font-semibold leading-none">
          v
        </div>
        <span className="text-base font-semibold tracking-tight">Vitals</span>
        {role === "admin" && (
          <span className="ml-auto font-mono text-[9px] tracking-[0.1em] uppercase bg-foreground text-background px-1.5 py-0.5 rounded">
            Admin
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-left transition-colors cursor-pointer",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2.5">
        <Eyebrow>{role === "admin" ? "Signed in as" : "You"}</Eyebrow>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2.5 p-2 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors text-left cursor-pointer"
        >
          <div className="size-8 rounded-full bg-sage-soft text-sage grid place-items-center text-[11px] font-semibold shrink-0">
            {employee.initials}
          </div>
          <div className="flex flex-col gap-px min-w-0 flex-1">
            <span className="text-[13px] font-medium text-foreground truncate">{employee.name}</span>
            <span className="text-[11px] text-muted-foreground truncate">{employee.role}</span>
          </div>
          <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />
        </button>
      </div>

      <UserSwitcher
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        currentId={employee.id}
        employees={employees}
        onPick={(id) => { onEmployeeChange(id); setPickerOpen(false); }}
      />
    </aside>
  );
}
