import { vitalsEmpAvg } from "@/data/mockData";
import type { Employee } from "@/types";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

interface UserSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentId: string;
  employees: Employee[];
  onPick: (id: string) => void;
}

export function UserSwitcher({ open, onOpenChange, currentId, employees, onPick }: UserSwitcherProps) {
  if (!open) return null;
  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 bg-foreground/30 grid place-items-center z-50 p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl p-5 w-[380px] max-h-[80%] overflow-auto shadow-2xl"
      >
        <Eyebrow className="mb-3.5 block">Switch user · prototype</Eyebrow>
        <div className="flex flex-col gap-1">
          {employees.map((e) => {
            const avg = vitalsEmpAvg(e.id);
            const isCurrent = e.id === currentId;
            return (
              <button
                key={e.id}
                onClick={() => onPick(e.id)}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-colors",
                  isCurrent
                    ? "border-sage bg-sage-soft"
                    : "border-transparent hover:bg-accent/40",
                )}
              >
                <div className="size-8 rounded-full bg-muted grid place-items-center text-[11px] font-semibold">
                  {e.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground">{e.role}</div>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{avg.toFixed(1)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
