import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VITALS_SPRINTS, SPRINT_DATES } from "@/data/mockData";

interface SprintPagerProps {
  sprint: string;
  onChange: (sprint: string) => void;
}

export function SprintPager({ sprint, onChange }: SprintPagerProps) {
  const idx = VITALS_SPRINTS.indexOf(sprint as typeof VITALS_SPRINTS[number]);
  const canPrev = idx > 0;
  const canNext = idx < VITALS_SPRINTS.length - 1;

  return (
    <div className="flex items-center gap-1">
      <PagerButton
        disabled={!canPrev}
        onClick={() => canPrev && onChange(VITALS_SPRINTS[idx - 1])}
        aria-label="Previous sprint"
      >
        <ChevronLeft className="size-3.5" />
      </PagerButton>
      <div className="px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground tracking-[0.06em] uppercase">
        Sprint {sprint.replace("S", "")} · {SPRINT_DATES[sprint]}
      </div>
      <PagerButton
        disabled={!canNext}
        onClick={() => canNext && onChange(VITALS_SPRINTS[idx + 1])}
        aria-label="Next sprint"
      >
        <ChevronRight className="size-3.5" />
      </PagerButton>
    </div>
  );
}

function PagerButton({
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "size-7 rounded-md border border-border bg-card grid place-items-center transition-colors",
        disabled
          ? "text-border cursor-default"
          : "text-foreground hover:bg-accent/40 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
