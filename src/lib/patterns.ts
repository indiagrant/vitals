import { VITALS_DIMENSIONS, VITALS_SPRINTS, vitalsTrend } from "@/data/mockData";
import type { HealthMetrics } from "@/types";
import type { Tone } from "@/lib/teamPulse";

// Patterns only looks at a trailing window of sprints, not full history —
// see CLAUDE.md "Patterns page" for why.
export const PATTERN_WINDOW_SPRINTS = 10;

export type PatternType =
  | "stuck-concerning"
  | "stuck-steady"
  | "recovered"
  | "trending-up"
  | "trending-down"
  | "inconsistent";

export interface PatternSignal {
  dim: keyof HealthMetrics;
  type: PatternType;
  tone: Tone;
  tag: string;
  sentence: string;
  deltaLabel: string;
}

function trailingFlatStreak(values: number[]): number {
  const last = values[values.length - 1];
  let streak = 1;
  for (let i = values.length - 2; i >= 0; i--) {
    if (values[i] !== last) break;
    streak++;
  }
  return streak;
}

function detectForDimension(
  dim: keyof HealthMetrics,
  label: string,
  values: number[],
): PatternSignal | null {
  if (values.length < 3) return null;

  const current = values[values.length - 1];

  // Stuck / steady: flat for 3+ sprints, at a notable extreme — a flat
  // middling score (3) isn't worth surfacing as a signal.
  const flatStreak = trailingFlatStreak(values);
  if (flatStreak >= 3 && (current >= 4 || current <= 2)) {
    const steady = current >= 4;
    return {
      dim,
      type: steady ? "stuck-steady" : "stuck-concerning",
      tone: steady ? "sage" : "clay",
      tag: steady ? "Steady" : "Stuck",
      sentence: steady
        ? `${label} has held steady at ${current} for ${flatStreak} sprints running.`
        : `${label} has sat at ${current} for ${flatStreak} sprints running — worth naming in your next check-in.`,
      deltaLabel: `${flatStreak} sprints flat`,
    };
  }

  const deltas: number[] = [];
  for (let i = 1; i < values.length; i++) deltas.push(values[i] - values[i - 1]);
  const upCount = deltas.filter((d) => d > 0).length;
  const downCount = deltas.filter((d) => d < 0).length;

  // Trending: movement is one-directional across the window — at least two
  // steps down (or up) and none back the other way. Real data rarely moves
  // every single sprint, so a flat pause in the middle doesn't break this;
  // what disqualifies it is an actual reversal (that's "inconsistent" below).
  if (downCount >= 2 && upCount === 0) {
    return {
      dim,
      type: "trending-down",
      tone: "clay",
      tag: "Declining",
      sentence: `${label} has slipped from ${values[0]} to ${current} over the last ${values.length} sprints.`,
      deltaLabel: "trending down",
    };
  }
  if (upCount >= 2 && downCount === 0) {
    return {
      dim,
      type: "trending-up",
      tone: "sage",
      tag: "Improving",
      sentence: `${label} has climbed from ${values[0]} to ${current} over the last ${values.length} sprints.`,
      deltaLabel: "trending up",
    };
  }

  // Recovered: dipped below the window's starting value at some point, then
  // came back to at or above it by the most recent sprint.
  const start = values[0];
  const minVal = Math.min(...values);
  if (minVal < start && current >= start) {
    return {
      dim,
      type: "recovered",
      tone: "sage",
      tag: "Recovered",
      sentence: `${label} dipped to ${minVal}, then recovered to ${current} this sprint.`,
      deltaLabel: "recovered",
    };
  }

  // Inconsistent: no plateau, no one-directional run, no recovery shape —
  // direction reverses somewhere in the window.
  if (upCount > 0 && downCount > 0) {
    return {
      dim,
      type: "inconsistent",
      tone: "neutral",
      tag: "Inconsistent",
      sentence: `${label} has moved without a clear direction over the last ${values.length} sprints.`,
      deltaLabel: "no clear trend",
    };
  }

  return null;
}

export function detectPatternSignals(empId: string): PatternSignal[] {
  return VITALS_DIMENSIONS.reduce<PatternSignal[]>((signals, d) => {
    const windowed = vitalsTrend(empId, d.key).slice(-PATTERN_WINDOW_SPRINTS);
    const signal = detectForDimension(d.key, d.label, windowed);
    if (signal) signals.push(signal);
    return signals;
  }, []);
}

export function patternSprintWindow(): string[] {
  return VITALS_SPRINTS.slice(-PATTERN_WINDOW_SPRINTS);
}

// Non-signal dimensions fall back to a plain S(first)->S(last) delta, colored
// by sign rather than by a pattern's tone (there's no "story" being told).
export function patternDeltaDisplay(
  values: number[],
  signal: PatternSignal | undefined,
): { text: string; tone: Tone } {
  if (signal) return { text: signal.deltaLabel, tone: signal.tone };
  const delta = values[values.length - 1] - values[0];
  if (delta === 0) return { text: "—", tone: "neutral" };
  return { text: `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}`, tone: delta > 0 ? "sage" : "clay" };
}
