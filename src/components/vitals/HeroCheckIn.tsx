import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { vitalsAvg } from "@/data/mockData";
import { headlineForScore } from "@/lib/headline";
import type { HealthMetrics } from "@/types";

interface HeroCheckInProps {
  current: HealthMetrics;
  previous: HealthMetrics | null;
}

export function HeroCheckIn({ current, previous }: HeroCheckInProps) {
  const score = vitalsAvg(current);
  const { eyebrow, line } = headlineForScore(score);

  // tone of the ribbon: sage if good, clay if low, neutral otherwise
  const ribbonTone =
    score >= 4 ? "sage" : score <= 2.8 ? "clay" : "neutral";

  return (
    <section
      className={cn(
        "rounded-2xl border p-8 flex flex-col gap-6",
        ribbonTone === "sage"   && "bg-sage-soft border-sage/20",
        ribbonTone === "clay"   && "bg-clay-soft border-clay/20",
        ribbonTone === "neutral"&& "bg-card border-border",
      )}
    >
      <div className="flex flex-col gap-2.5">
        <Eyebrow tone={ribbonTone === "sage" ? "sage" : ribbonTone === "clay" ? "clay" : "muted"}>
          {eyebrow}
        </Eyebrow>
        <h1 className="text-[34px] leading-[1.15] font-semibold tracking-tight max-w-2xl">
          {line}
        </h1>
      </div>

      <div className="flex items-end gap-10 pt-2">
        <Stat label="Your check-in" value={score.toFixed(1)} accent />
        <Divider />
        <Stat
          label="Trend"
          value={<TrendArrow current={current} previous={previous} />}
        />
      </div>
    </section>
  );
}

function Divider() {
  return <span className="h-10 w-px bg-border self-end" aria-hidden />;
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-[28px] font-semibold leading-none tabular-nums",
          accent ? "text-foreground" : "text-foreground/70",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function TrendArrow({ current, previous }: { current: HealthMetrics; previous: HealthMetrics | null }) {
  if (!previous) return <span className="text-foreground/50">—</span>;
  const delta = vitalsAvg(current) - vitalsAvg(previous);
  if (Math.abs(delta) < 0.1) {
    return <span className="text-foreground/70">→</span>;
  }
  return (
    <span className={cn(delta > 0 ? "text-sage" : "text-clay")}>
      {delta > 0 ? "↗" : "↘"}{" "}
      <span className="text-[15px] font-mono align-middle">
        {delta > 0 ? "+" : ""}
        {delta.toFixed(1)}
      </span>
    </span>
  );
}
