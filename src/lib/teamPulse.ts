import type { Team } from "@/types";

export const PULSE_BASELINE = 3; // midpoint of the 1-5 check-in scale

export type Tone = "sage" | "clay" | "neutral";

export function teamScore(team: Team): number {
  const sum = team.checkins.reduce((s, c) => s + c.score, 0);
  return sum / team.checkins.length;
}

export function teamTrend(team: Team): number {
  return teamScore(team) - team.prevAvg;
}

export function orgAverage(teams: Team[]): number {
  return teams.reduce((s, t) => s + teamScore(t), 0) / teams.length;
}

export function toneForScore(score: number): Tone {
  if (score >= 3.6) return "sage";
  if (score <= 2.8) return "clay";
  return "neutral";
}

export function statusForScore(score: number): { word: string; line: string } {
  if (score >= 3.6) return { word: "Strong signal", line: "Clear, steady rhythm." };
  if (score <= 2.8) return { word: "Irregular signal", line: "Worth a closer look." };
  return { word: "Uneven signal", line: "Reading's mixed this sprint." };
}

export function trendTone(delta: number): Tone {
  if (Math.abs(delta) < 0.1) return "neutral";
  return delta > 0 ? "sage" : "clay";
}

export function trendGlyph(delta: number): string {
  if (Math.abs(delta) < 0.1) return "→";
  return delta > 0 ? "↗" : "↘";
}

export function formatTrend(delta: number): string {
  if (Math.abs(delta) < 0.1) return "steady";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}
