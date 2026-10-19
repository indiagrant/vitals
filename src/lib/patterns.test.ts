import {
  PATTERN_WINDOW_SPRINTS,
  patternDeltaDisplay,
  patternSprintWindow,
  patternsDataFrom,
  detectPatternSignals,
} from "./patterns";
import type { PatternSignal } from "./patterns";
import type { EmployeeCheckIn } from "./api";
import type { HealthMetrics } from "@/types";
import { VITALS_DIMENSIONS, VITALS_SPRINTS } from "@/data/mockData";

function makeCheckIn(overrides: Partial<EmployeeCheckIn> & { sprintId: string; order: number }): EmployeeCheckIn {
  const { order, sprintId, ...rest } = overrides;
  return {
    id: order,
    employeeId: "E001",
    sprintId,
    workLifeBalance: 3,
    communication: 3,
    managerSupport: 3,
    teamCollaboration: 3,
    workload: 3,
    jobSatisfaction: 3,
    prompts: [],
    reflections: [],
    sprint: { id: sprintId, label: sprintId, order },
    ...rest,
  };
}

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

describe("patternsDataFrom", () => {
  it("derives sprints and trendByDim together from the same sorted, windowed history", () => {
    const checkIns = [
      makeCheckIn({ sprintId: "S20", order: 0, workLifeBalance: 4, communication: 5 }),
      makeCheckIn({ sprintId: "S21", order: 1, workLifeBalance: 3, communication: 4 }),
    ];

    const { sprints, trendByDim } = patternsDataFrom(checkIns);

    expect(sprints).toEqual(["S20", "S21"]);
    expect(trendByDim.workLifeBalance).toEqual([4, 3]);
    expect(trendByDim.communication).toEqual([5, 4]);
  });

  it("orders by Sprint.order, not array position", () => {
    const checkIns = [
      makeCheckIn({ sprintId: "S21", order: 1, workload: 2 }),
      makeCheckIn({ sprintId: "S20", order: 0, workload: 4 }),
    ];

    const { sprints, trendByDim } = patternsDataFrom(checkIns);

    expect(sprints).toEqual(["S20", "S21"]);
    expect(trendByDim.workload).toEqual([4, 2]);
  });

  it("keeps only the trailing PATTERN_WINDOW_SPRINTS entries when history exceeds the window", () => {
    const checkIns = Array.from({ length: PATTERN_WINDOW_SPRINTS + 3 }, (_, i) =>
      makeCheckIn({ sprintId: `S${i}`, order: i, workload: i }),
    );

    const { sprints, trendByDim } = patternsDataFrom(checkIns);

    expect(sprints).toHaveLength(PATTERN_WINDOW_SPRINTS);
    expect(sprints[0]).toBe(`S3`); // the first 3 entries fall outside the trailing window
    expect(trendByDim.workload[0]).toBe(3);
  });

  it("returns empty arrays, not an error, for an employee with no check-in history", () => {
    const { sprints, trendByDim } = patternsDataFrom([]);

    expect(sprints).toEqual([]);
    expect(trendByDim.workload).toEqual([]);
  });
});

// detectPatternSignals is a pure function now (takes trend data directly,
// no data-source opinion of its own) — no module-reset dance needed, just
// plain fixtures. "Freshness" (reflecting a just-submitted check-in) is now
// the caller's responsibility — re-fetch and re-derive, same as any other
// data flowing through the real API rather than live mockData state.
describe("detectPatternSignals", () => {
  // A flat run at a middling score (3) isn't a notable extreme, so this is
  // a safe "no signal" baseline for every dimension not under test.
  function makeTrendByDim(
    overrides: Partial<Record<keyof HealthMetrics, number[]>> = {},
  ): Record<keyof HealthMetrics, number[]> {
    const flat3 = [3, 3, 3, 3, 3];
    return {
      workLifeBalance: flat3,
      communication: flat3,
      managerSupport: flat3,
      teamCollaboration: flat3,
      workload: flat3,
      jobSatisfaction: flat3,
      ...overrides,
    };
  }

  it("flags a dimension flat at a high value for 3+ sprints as stuck-steady", () => {
    const signals = detectPatternSignals(makeTrendByDim({ communication: [5, 5, 5, 5, 5] }));
    const communication = signals.find((s) => s.dim === "communication");
    expect(communication?.type).toBe("stuck-steady");
    expect(communication?.tag).toBe("Steady");
  });

  it("flags a dimension declining across 2+ steps with no reversal as trending-down", () => {
    const signals = detectPatternSignals(makeTrendByDim({ jobSatisfaction: [5, 4, 3, 3, 2] }));
    const jobSatisfaction = signals.find((s) => s.dim === "jobSatisfaction");
    expect(jobSatisfaction?.type).toBe("trending-down");
  });

  it("returns signals ordered by VITALS_DIMENSIONS, omitting dimensions with no detected pattern", () => {
    // Signals on the first and last dimension, nothing in between — proves
    // output order follows VITALS_DIMENSIONS, not insertion/input order.
    const signals = detectPatternSignals(
      makeTrendByDim({
        workLifeBalance: [5, 5, 5, 5, 5],
        jobSatisfaction: [5, 4, 3, 3, 2],
      }),
    );
    const dimOrder = VITALS_DIMENSIONS.map((d) => d.key);
    const signalPositions = signals.map((s) => dimOrder.indexOf(s.dim));
    for (let i = 1; i < signalPositions.length; i++) {
      expect(signalPositions[i]).toBeGreaterThan(signalPositions[i - 1]);
    }
    expect(signals).toHaveLength(2);
  });

  it("returns no signals for a trend with no notable shape in any dimension", () => {
    expect(detectPatternSignals(makeTrendByDim())).toEqual([]);
  });
});
