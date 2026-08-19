import {
  formatTrend,
  orgAverage,
  PULSE_BASELINE,
  statusForScore,
  teamScore,
  teamTrend,
  toneForScore,
  trendGlyph,
  trendTone,
} from "./teamPulse";
import type { Team } from "@/types";

const DUMMY_DIMS: Team["dims"] = {
  workLifeBalance: [3, 3],
  communication: [3, 3],
  managerSupport: [3, 3],
  teamCollaboration: [3, 3],
  workload: [3, 3],
  jobSatisfaction: [3, 3],
};

function makeTeam(checkins: Team["checkins"], prevAvg: number): Team {
  return { id: "t1", name: "Team", pod: "Pod", prevAvg, checkins, dims: DUMMY_DIMS };
}

describe("teamScore", () => {
  it("averages checkin scores", () => {
    const team = makeTeam(
      [
        { name: "A", initials: "A", score: 4 },
        { name: "B", initials: "B", score: 2 },
      ],
      3,
    );
    expect(teamScore(team)).toBe(3);
  });
});

describe("teamTrend", () => {
  it("is teamScore minus prevAvg", () => {
    const team = makeTeam([{ name: "A", initials: "A", score: 4 }], 3);
    expect(teamTrend(team)).toBe(1);
  });
});

describe("orgAverage", () => {
  it("averages teamScore across teams", () => {
    const t1 = makeTeam([{ name: "A", initials: "A", score: 4 }], 3);
    const t2 = makeTeam([{ name: "B", initials: "B", score: 2 }], 3);
    expect(orgAverage([t1, t2])).toBe(3);
  });

  it("returns that team's own score for a single-team array", () => {
    const t1 = makeTeam([{ name: "A", initials: "A", score: 4 }], 3);
    expect(orgAverage([t1])).toBe(4);
  });
});

describe("toneForScore", () => {
  it("is sage at and above 3.6", () => {
    expect(toneForScore(3.6)).toBe("sage");
    expect(toneForScore(4.5)).toBe("sage");
  });

  it("is clay at and below 2.8", () => {
    expect(toneForScore(2.8)).toBe("clay");
    expect(toneForScore(1.5)).toBe("clay");
  });

  it("is neutral in between", () => {
    expect(toneForScore(3.0)).toBe("neutral");
  });
});

describe("statusForScore", () => {
  it("returns the strong-signal copy at and above 3.6", () => {
    expect(statusForScore(3.6)).toEqual({ word: "Strong signal", line: "Clear, steady rhythm." });
  });

  it("returns the irregular-signal copy at and below 2.8", () => {
    expect(statusForScore(2.8)).toEqual({ word: "Irregular signal", line: "Worth a closer look." });
  });

  it("returns the uneven-signal copy in between", () => {
    expect(statusForScore(3.0)).toEqual({ word: "Uneven signal", line: "Reading's mixed this sprint." });
  });
});

describe("trendTone", () => {
  it("is neutral for deltas within 0.1", () => {
    expect(trendTone(0.05)).toBe("neutral");
    expect(trendTone(-0.05)).toBe("neutral");
  });

  it("is sage for positive deltas at/above 0.1", () => {
    expect(trendTone(0.15)).toBe("sage");
  });

  it("is clay for negative deltas with magnitude at/above 0.1", () => {
    expect(trendTone(-0.15)).toBe("clay");
  });
});

describe("trendGlyph", () => {
  it("mirrors trendTone's thresholds", () => {
    expect(trendGlyph(0.05)).toBe("→");
    expect(trendGlyph(0.15)).toBe("↗");
    expect(trendGlyph(-0.15)).toBe("↘");
  });
});

describe("formatTrend", () => {
  it("reads steady within the 0.1 threshold", () => {
    expect(formatTrend(0.05)).toBe("steady");
  });

  it("formats a positive delta with a leading plus", () => {
    expect(formatTrend(1.2)).toBe("+1.2");
  });

  it("formats a negative delta without a double negative", () => {
    expect(formatTrend(-1.2)).toBe("-1.2");
  });
});

describe("PULSE_BASELINE", () => {
  it("is the midpoint of the 1-5 scale", () => {
    expect(PULSE_BASELINE).toBe(3);
  });
});
