import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { vitalsAvg, vitalsTeamAvg, VITALS_SURVEYS } from "@/data/mockData";
import type { Employee } from "@/types";

interface HeroCheckInProps {
  employee: Employee;
  sprint: string;
}

function headlineFor(score: number): { eyebrow: string; line: string } {
  if (score >= 4.3) return { eyebrow: "A strong sprint",  line: "Most things felt right." };
  if (score >= 3.5) return { eyebrow: "A steady sprint",  line: "Some bright spots, some edges." };
  if (score >= 2.8) return { eyebrow: "A quiet sprint",   line: "Nothing on fire, but nothing lifted either." };
  return              { eyebrow: "A heavy sprint",        line: "Worth sitting with what's wearing on you." };
}

export function HeroCheckIn({ employee, sprint }: HeroCheckInProps) {
  const metrics = VITALS_SURVEYS[employee.id]?.[sprint];
  if (!metrics) return null;

  const score = vitalsAvg(metrics);
  const teamScore = vitalsTeamAvg(sprint);
  const { eyebrow, line } = headlineFor(score);

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
        <Stat label="Team average" value={teamScore.toFixed(1)} />
        <Divider />
        <Stat
          label="Trend"
          value={
            <TrendArrow
              empId={employee.id}
              sprint={sprint}
            />
          }
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

function TrendArrow({ empId, sprint }: { empId: string; sprint: string }) {
  const surveys = VITALS_SURVEYS[empId];
  const sprints = ["S20", "S21", "S22", "S23", "S24"];
  const idx = sprints.indexOf(sprint);
  const prev = idx > 0 ? sprints[idx - 1] : null;
  if (!prev || !surveys[prev]) return <span className="text-foreground/50">—</span>;
  const delta = vitalsAvg(surveys[sprint]) - vitalsAvg(surveys[prev]);
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
