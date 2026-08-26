import {
  SPRINT_DATES,
  VITALS_DIMENSIONS,
  VITALS_SPRINTS,
  VITALS_SURVEYS,
  vitalsAvg,
  vitalsReflection,
  vitalsTickets,
} from "@/data/mockData";
import { headlineForScore } from "@/lib/headline";
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

export function buildHistoryEntry(empId: string, sprint: string): HistoryEntry | null {
  const metrics = VITALS_SURVEYS[empId]?.[sprint];
  if (!metrics) return null;

  const moods = toMoods(metrics);

  const idx = (VITALS_SPRINTS as readonly string[]).indexOf(sprint);
  const prevSprint = idx > 0 ? VITALS_SPRINTS[idx - 1] : null;
  const prevMetrics = prevSprint ? VITALS_SURVEYS[empId]?.[prevSprint] : undefined;
  const prevMoods = prevMetrics ? toMoods(prevMetrics) : null;

  const reflection = vitalsReflection(empId, sprint);

  return {
    sprint,
    dates: SPRINT_DATES[sprint] ?? "",
    moods,
    tone: entryTone(moods),
    title: headlineForScore(vitalsAvg(metrics)).line,
    synopsis: buildSynopsis(moods, prevMoods),
    wins: reflection?.wins ?? [],
    pains: reflection?.pains ?? [],
    tickets: vitalsTickets(empId, sprint),
    prompts: reflection?.prompts ?? [],
  };
}

// Newest first, matching the journal's reading order — the reverse of
// VITALS_SPRINTS/vitalsTrend's chronological (oldest-first) order.
export function buildHistoryEntries(empId: string): HistoryEntry[] {
  return [...VITALS_SPRINTS]
    .reverse()
    .map((sprint) => buildHistoryEntry(empId, sprint))
    .filter((entry): entry is HistoryEntry => entry !== null);
}

// A prompt asked in two or more sprints — "worth asking again" is more
// telling than any single sprint's prompt list on its own.
export function findRecurringPrompt(entries: HistoryEntry[]): { prompt: string; sprints: string[] } | null {
  const bySprints = new Map<string, string[]>();
  // entries is newest-first; iterate oldest-first so the recorded sprint
  // order in the result reads chronologically.
  [...entries].reverse().forEach((entry) => {
    entry.prompts.forEach((prompt) => {
      const sprints = bySprints.get(prompt) ?? [];
      sprints.push(entry.sprint);
      bySprints.set(prompt, sprints);
    });
  });

  let best: { prompt: string; sprints: string[] } | null = null;
  bySprints.forEach((sprints, prompt) => {
    if (sprints.length >= 2 && (!best || sprints.length > best.sprints.length)) {
      best = { prompt, sprints };
    }
  });
  return best;
}
