import { PATTERN_WINDOW_SPRINTS, patternDeltaDisplay, patternSprintWindow } from "./patterns";
import type { PatternSignal } from "./patterns";
import { VITALS_DIMENSIONS, VITALS_SPRINTS } from "@/data/mockData";

describe("patternSprintWindow", () => {
  it("returns all seeded sprints unchanged since there are fewer than the window cap", () => {
    expect(VITALS_SPRINTS.length).toBeLessThan(PATTERN_WINDOW_SPRINTS);
    expect(patternSprintWindow()).toEqual([...VITALS_SPRINTS]);
  });
});

describe("patternDeltaDisplay", () => {
  const signal: PatternSignal = {
    dim: "communication",
    type: "stuck-steady",
    tone: "sage",
    tag: "Steady",
    sentence: "Communication has held steady.",
    deltaLabel: "3 sprints flat",
  };

  it("uses the signal's own deltaLabel/tone verbatim when a signal is present, ignoring values", () => {
    expect(patternDeltaDisplay([1, 2, 3], signal)).toEqual({ text: "3 sprints flat", tone: "sage" });
  });

  it("shows an em dash for flat values with no signal", () => {
    expect(patternDeltaDisplay([3, 3, 3], undefined)).toEqual({ text: "—", tone: "neutral" });
  });

  it("shows a plus-prefixed delta for rising values with no signal", () => {
    expect(patternDeltaDisplay([2, 3, 4], undefined)).toEqual({ text: "+2.0", tone: "sage" });
  });

  it("shows an en-dash-prefixed delta (not a hyphen) for falling values with no signal", () => {
    const result = patternDeltaDisplay([4, 3, 2], undefined);
    expect(result.tone).toBe("clay");
    expect(result.text).toBe("−2.0");
    expect(result.text.charAt(0)).not.toBe("-");
  });
});

// detectPatternSignals reads live mockData state (via vitalsTrend), so this
// block resets the module registry before every test — see CLAUDE.md
// "Testing" for why. Both mockData and patterns.ts itself are re-imported,
// since a statically-imported patterns.ts would close over the stale
// pre-reset mockData instance.
describe("detectPatternSignals", () => {
  let mockData: typeof import("@/data/mockData");
  let patterns: typeof import("./patterns");

  beforeEach(async () => {
    vi.resetModules();
    mockData = await import("@/data/mockData");
    patterns = await import("./patterns");
  });

  it("flags a dimension flat at a high value for 3+ sprints as stuck-steady", () => {
    // E003's communication is seeded flat at 5 across all 5 sprints.
    const signals = patterns.detectPatternSignals("E003");
    const communication = signals.find((s) => s.dim === "communication");
    expect(communication?.type).toBe("stuck-steady");
    expect(communication?.tag).toBe("Steady");
  });

  it("flags a dimension declining across 2+ steps with no reversal as trending-down", () => {
    // E007's jobSatisfaction is seeded 5,4,3,3,2 — three down-steps, none up.
    const signals = patterns.detectPatternSignals("E007");
    const jobSatisfaction = signals.find((s) => s.dim === "jobSatisfaction");
    expect(jobSatisfaction?.type).toBe("trending-down");
  });

  it("returns signals ordered by VITALS_DIMENSIONS, omitting dimensions with no detected pattern", () => {
    const signals = patterns.detectPatternSignals("E001");
    const dimOrder = VITALS_DIMENSIONS.map((d) => d.key);
    const signalPositions = signals.map((s) => dimOrder.indexOf(s.dim));
    for (let i = 1; i < signalPositions.length; i++) {
      expect(signalPositions[i]).toBeGreaterThan(signalPositions[i - 1]);
    }
    expect(signals.length).toBeLessThanOrEqual(VITALS_DIMENSIONS.length);
  });

  it("reflects a fresh submitCheckIn immediately — reads live state, not cached", () => {
    mockData.submitCheckIn(
      "E003",
      "S24",
      { ...mockData.VITALS_SURVEYS.E003.S24, communication: 2 },
      "",
      "",
    );
    const signals = patterns.detectPatternSignals("E003");
    const communication = signals.find((s) => s.dim === "communication");
    expect(communication).toBeUndefined();
  });
});
