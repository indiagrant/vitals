import { cn } from "@/lib/utils";
import { TeamTrace } from "./TeamTrace";
import {
  formatTrend,
  statusForScore,
  teamScore,
  teamTrend,
  toneForScore,
  trendGlyph,
  trendTone,
} from "@/lib/teamPulse";
import type { Team } from "@/types";

interface TeamMonitorCardProps {
  team: Team;
  onSelect: (id: string) => void;
}

export function TeamMonitorCard({ team, onSelect }: TeamMonitorCardProps) {
  const score = teamScore(team);
  const trend = teamTrend(team);
  const tone = toneForScore(score);
  const status = statusForScore(score);
  const tTone = trendTone(trend);

  return (
    <button
      onClick={() => onSelect(team.id)}
      aria-label={`Open diagnostics for ${team.name}`}
      className="flex flex-col gap-3.5 text-left rounded-2xl border border-border bg-card p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-2"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold tracking-tight">{team.name}</span>
        <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
          {team.pod} · {team.checkins.length} people
        </span>
      </div>

      <TeamTrace team={team} size="sm" />

      <div className="flex items-end justify-between gap-2.5">
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-[26px] font-semibold leading-none tabular-nums">
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2 py-0.5 text-[11.5px] font-medium",
              tone === "sage" && "bg-sage-soft text-sage",
              tone === "clay" && "bg-clay-soft text-clay",
              tone === "neutral" && "bg-line-soft text-foreground/75",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                tone === "sage" && "bg-sage",
                tone === "clay" && "bg-clay",
                tone === "neutral" && "bg-foreground/50",
              )}
            />
            {status.word.replace(" signal", "")}
          </span>
          <span
            className={cn(
              "font-mono text-[12.5px]",
              tTone === "sage" && "text-sage",
              tTone === "clay" && "text-clay",
            )}
          >
            {trendGlyph(trend)} {formatTrend(trend)}
          </span>
        </div>
      </div>
    </button>
  );
}
