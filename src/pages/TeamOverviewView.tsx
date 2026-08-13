import { useState } from "react";
import { TeamMonitorCard } from "@/components/vitals/TeamMonitorCard";
import { TeamDiagnostics } from "@/components/vitals/TeamDiagnostics";
import { orgAverage, teamScore } from "@/lib/teamPulse";
import { VITALS_TEAMS } from "@/data/mockData";

/**
 * Admin "Team overview" — each team's pulse trace is built from real
 * per-person check-in scores, not a live feed: a spike is one positive
 * check-in, a dip is one negative check-in. Click a card to drill in.
 */
export function TeamOverviewView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = VITALS_TEAMS.find((t) => t.id === selectedId) ?? null;

  if (selected) {
    return <TeamDiagnostics team={selected} onBack={() => setSelectedId(null)} />;
  }

  const totalPeople = VITALS_TEAMS.reduce((s, t) => s + t.checkins.length, 0);
  const needAttention = VITALS_TEAMS.filter((t) => teamScore(t) <= 2.8).length;
  const org = orgAverage(VITALS_TEAMS);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 flex-wrap text-[13px] text-muted-foreground">
        <span>
          <b className="text-foreground font-semibold">{VITALS_TEAMS.length}</b> teams
        </span>
        <span className="opacity-50">·</span>
        <span>
          <b className="text-foreground font-semibold">{totalPeople}</b> people
        </span>
        <span className="opacity-50">·</span>
        <span>
          org average <b className="text-foreground font-semibold">{org.toFixed(1)}</b>
        </span>
        {needAttention > 0 && (
          <>
            <span className="opacity-50">·</span>
            <span className="text-clay font-medium">
              {needAttention} team{needAttention > 1 ? "s" : ""} needs attention
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {VITALS_TEAMS.map((team) => (
          <TeamMonitorCard key={team.id} team={team} onSelect={setSelectedId} />
        ))}
      </div>
    </div>
  );
}
