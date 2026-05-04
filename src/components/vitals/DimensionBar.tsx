import { cn } from "@/lib/utils";

interface DimensionBarProps {
  label: string;
  value: number;          // 1-5
  prevValue?: number;     // previous sprint value (for delta)
  className?: string;
}

/**
 * Dimension score rendered as a 5-step bar with optional delta.
 * Sage when score >= 4, clay when <= 2, neutral in between.
 */
export function DimensionBar({ label, value, prevValue, className }: DimensionBarProps) {
  const tone = value >= 4 ? "sage" : value <= 2 ? "clay" : "neutral";
  const delta = prevValue !== undefined ? value - prevValue : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[13px] tabular-nums text-foreground">
            {value}.0
          </span>
          {delta !== undefined && delta !== 0 && (
            <span
              className={cn(
                "font-mono text-[12px] tabular-nums",
                delta > 0 ? "text-sage" : "text-clay",
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => {
          const filled = step <= value;
          return (
            <div
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                filled
                  ? tone === "sage"
                    ? "bg-sage"
                    : tone === "clay"
                    ? "bg-clay"
                    : "bg-foreground/40"
                  : "bg-line-soft",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
