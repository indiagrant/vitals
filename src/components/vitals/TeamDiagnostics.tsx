import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DimensionBar } from "@/components/ui/DimensionBar";
import { TeamTrace } from "./TeamTrace";
import {
  formatTrend,
  orgAverage,
  statusForScore,
  teamScore,
  teamTrend,
  toneForScore,
  trendGlyph,
  trendTone,
} from "@/lib/teamPulse";
import { VITALS_DIMENSIONS, getVitalsTeams } from "@/data/mockData";
import type { Team } from "@/types";

interface TeamDiagnosticsProps {
  team: Team;
  onBack: () => void;
}

export function TeamDiagnostics({ team, onBack }: TeamDiagnosticsProps) {
  const score = teamScore(team);
  const trend = teamTrend(team);
  const tone = toneForScore(score);
  const status = statusForScore(score);
  const tTone = trendTone(trend);
  const org = orgAverage(getVitalsTeams());

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sage w-fit cursor-pointer"
      >
        ← All teams
      </button>

      <section
        className={cn(
          "rounded-2xl border p-8 flex flex-col gap-6",
          tone === "sage" && "bg-sage-soft border-sage/20",
          tone === "clay" && "bg-clay-soft border-clay/20",
          tone === "neutral" && "bg-card border-border",
        )}
      >
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2.5">
            <Eyebrow tone={tone === "neutral" ? "muted" : tone}>{status.word}</Eyebrow>
            <h2 className="text-[28px] font-semibold tracking-tight">{team.name}</h2>
          </div>
          <Eyebrow>
            {team.pod} · {team.checkins.length} people
          </Eyebrow>
        </div>

        <div className="flex flex-col gap-2">
          <TeamTrace team={team} size="lg" />
          <div className="flex">
            {team.checkins.map((c) => (
              <span
                key={c.name}
                title={`${c.name} · ${c.score.toFixed(1)}`}
                className="flex-1 text-center font-mono text-[10px] tracking-wide text-muted-foreground"
              >
                {c.initials}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-10 pt-2 flex-wrap">
          <Stat label="This sprint" value={score.toFixed(1)} accent />
          <Divider />
          <Stat label="Org average" value={org.toFixed(1)} />
          <Divider />
          <Stat
            label="Trend"
            value={
              <span className={cn(tTone === "sage" && "text-sage", tTone === "clay" && "text-clay")}>
                {trendGlyph(trend)} {formatTrend(trend)}
              </span>
            }
          />
        </div>
      </section>

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-semibold">
          Six dimensions, this sprint · team average vs. S23
        </span>
        <div className="grid grid-cols-3 gap-x-7 gap-y-5 rounded-2xl border border-border bg-card p-6">
          {VITALS_DIMENSIONS.map((dim) => {
            const [value, prev] = team.dims[dim.key];
            return <DimensionBar key={dim.key} label={dim.label} value={value} prevValue={prev} />;
          })}
        </div>
      </div>

      <p className="text-[12.5px] text-muted-foreground italic">
        In the full build: this drill-down would carry the same ticket list, wins &amp; pains, and
        prompts as the individual Sprint page — aggregated for the team.
      </p>
    </div>
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
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-[26px] font-semibold leading-none tabular-nums",
          accent ? "text-foreground" : "text-foreground/70",
        )}
      >
        {value}
      </span>
    </div>
  );
}
