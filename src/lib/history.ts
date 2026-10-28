import { VITALS_DIMENSIONS, vitalsAvg } from "@/data/mockData";
import { headlineForScore } from "@/lib/headline";
import { extractMetrics, toReflection } from "@/lib/sprintData";
import type { EmployeeCheckIn } from "@/lib/api";
import type { Tone } from "@/lib/teamPulse";
import type { HealthMetrics, Reflection, Ticket } from "@/types";

export interface HistoryEntry {
  sprint: string;
  dates: string;
  moods: number[]; // one per VITALS_DIMENSIONS, in that order
  tone: Tone; // overall entry tone, for the sprint-jump strip
  title: string;
  synopsis: string;
  wins: Reflection[];
  pains: Reflection[];
  tickets: Ticket[];
  prompts: string[];
}

// Same per-dimension tone rule PatternsView uses for its dimension rows —
// a single score, not an aggregate, so it reads at a stricter threshold than
// teamPulse's toneForScore (which buckets averages).
export function dimensionTone(score: number): Tone {
  if (score >= 4) return "sage";
  if (score <= 2) return "clay";
  return "neutral";
}

export function entryTone(moods: number[]): Tone {
  if (moods.some((m) => m <= 2)) return "clay";
  if (moods.every((m) => m >= 4)) return "sage";
  return "neutral";
}

function toMoods(metrics: HealthMetrics): number[] {
  return VITALS_DIMENSIONS.map((d) => metrics[d.key]);
}

// Data-derived, not hand-authored — same spirit as lib/patterns.ts's
// sentence generation, just comparing one sprint back instead of a
// multi-sprint trend. Names whichever dimension moved most.
function buildSynopsis(moods: number[], prevMoods: number[] | null): string {
  if (!prevMoods) {
    let topIdx = 0;
    let bottomIdx = 0;
    moods.forEach((m, i) => {
      if (m > moods[topIdx]) topIdx = i;
      if (m < moods[bottomIdx]) bottomIdx = i;
    });
    if (moods[topIdx] === moods[bottomIdx]) {
      return `Every dimension landed at ${moods[topIdx]} to start.`;
    }
    return `${VITALS_DIMENSIONS[topIdx].label} led at ${moods[topIdx]}; ${VITALS_DIMENSIONS[bottomIdx].label} lagged at ${moods[bottomIdx]}.`;
  }

  const deltas = VITALS_DIMENSIONS.map((d, i) => ({
    label: d.label,
    delta: moods[i] - prevMoods[i],
    score: moods[i],
  }));
  const improved = deltas.filter((d) => d.delta > 0).sort((a, b) => b.delta - a.delta)[0];
  const declined = deltas.filter((d) => d.delta < 0).sort((a, b) => a.delta - b.delta)[0];

  if (improved && declined) {
    return `${improved.label} climbed to ${improved.score}, while ${declined.label} slipped to ${declined.score}.`;
  }
  if (improved) return `${improved.label} climbed to ${improved.score} — the clearest move this sprint.`;
  if (declined) return `${declined.label} slipped to ${declined.score} — the clearest move this sprint.`;
  return "Nothing moved much — every dimension held where it was.";
}

// Builds the journal from one employee's real check-in history (the same
// GET /api/employees/:id/checkins payload Sprint and Patterns use).
// "Previous sprint" means this employee's previous check-in by
// Sprint.order — the same rule as sprintDataFor(), so a sprint's synopsis
// here and its deltas on the Sprint page always compare against the same
// baseline.
//
// Tickets are injected rather than read from the check-ins: there's no
// tickets endpoint yet, so the caller still supplies them from mockData.ts
// — a deliberate, flagged gap (same as the Sprint page's TicketList), and
// swapping in a real source later only touches the call site.
//
// Newest first, matching the journal's reading order.
export function historyEntriesFrom(
  checkIns: EmployeeCheckIn[],
  ticketsFor: (sprintId: string) => Ticket[],
): HistoryEntry[] {
  const sorted = [...checkIns].sort((a, b) => a.sprint.order - b.sprint.order);

  return sorted
    .map((c, idx) => {
      const metrics = extractMetrics(c);
      const moods = toMoods(metrics);
      const prevMoods = idx > 0 ? toMoods(extractMetrics(sorted[idx - 1])) : null;

      return {
        sprint: c.sprintId,
        dates: c.sprint.label,
        moods,
        tone: entryTone(moods),
        title: headlineForScore(vitalsAvg(metrics)).line,
        synopsis: buildSynopsis(moods, prevMoods),
        wins: c.reflections.filter((r) => r.kind === "WIN").map(toReflection),
        pains: c.reflections.filter((r) => r.kind === "PAIN").map(toReflection),
        tickets: ticketsFor(c.sprintId),
        prompts: c.prompts,
      };
    })
    .reverse();
}
