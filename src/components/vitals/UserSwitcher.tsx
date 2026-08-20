import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { vitalsEmpAvg } from "@/data/mockData";
import type { Employee } from "@/types";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface UserSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentId: string;
  employees: Employee[];
  onPick: (id: string) => void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function UserSwitcher({ open, onOpenChange, currentId, employees, onPick }: UserSwitcherProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog on open, trap Tab within it, close on Escape, and
  // return focus to whatever triggered it on close — the ARIA APG modal
  // dialog pattern. Hooks run unconditionally regardless of `open`; the
  // early `if (!open) return null` below only affects what's rendered.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 bg-foreground/30 grid place-items-center z-50 p-8"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-card border border-border rounded-xl p-5 w-[380px] max-h-[80%] overflow-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3.5">
          <Eyebrow id={titleId}>Switch user</Eyebrow>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {employees.map((e) => {
            const avg = vitalsEmpAvg(e.id);
            const isCurrent = e.id === currentId;
            return (
              <button
                key={e.id}
                onClick={() => onPick(e.id)}
                aria-current={isCurrent ? "true" : undefined}
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
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium truncate">{e.name}</span>
                    {e.isAdmin && (
                      <span className="font-mono text-[9px] tracking-[0.1em] uppercase bg-foreground text-background px-1.5 py-0.5 rounded shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
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
