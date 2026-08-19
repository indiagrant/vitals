import { vitalsAvg, vitalsEmployee } from "./mockData";

describe("vitalsAvg", () => {
  it("averages the six HealthMetrics fields", () => {
    const metrics = {
      workLifeBalance: 4,
      communication: 4,
      managerSupport: 4,
      teamCollaboration: 4,
      workload: 4,
      jobSatisfaction: 4,
    };
    expect(vitalsAvg(metrics)).toBe(4);
  });

  it("computes the exact mean for mixed values", () => {
    const metrics = {
      workLifeBalance: 5,
      communication: 4,
      managerSupport: 3,
      teamCollaboration: 2,
      workload: 1,
      jobSatisfaction: 3,
    };
    expect(vitalsAvg(metrics)).toBeCloseTo(3, 5);
  });
});

describe("vitalsEmployee", () => {
  it("finds a known seeded employee by id", () => {
    expect(vitalsEmployee("E001")?.name).toBe("Maya Chen");
  });

  it("returns undefined for an unknown id", () => {
    expect(vitalsEmployee("nope")).toBeUndefined();
  });
});

// Everything below reads or mutates the shared VITALS_SURVEYS/
// VITALS_REFLECTIONS module state — reset the module registry before every
// test so tests can't see each other's mutations. See CLAUDE.md "Testing".
describe("impure survey helpers", () => {
  let mockData: typeof import("./mockData");

  beforeEach(async () => {
    vi.resetModules();
    mockData = await import("./mockData");
  });

  describe("vitalsEmpAvg", () => {
    it("matches vitalsAvg for a known employee/sprint", () => {
      const metrics = mockData.VITALS_SURVEYS.E001.S24;
      expect(mockData.vitalsEmpAvg("E001", "S24")).toBe(mockData.vitalsAvg(metrics));
    });

    it("defaults to sprint S24 when omitted", () => {
      expect(mockData.vitalsEmpAvg("E001")).toBe(mockData.vitalsEmpAvg("E001", "S24"));
    });

    it("throws for an unknown employee id (current unguarded behavior)", () => {
      expect(() => mockData.vitalsEmpAvg("nope")).toThrow();
    });
  });

  describe("vitalsTeamAvg", () => {
    it("averages vitalsEmpAvg across all seeded employees for a sprint", () => {
      const ids = Object.keys(mockData.VITALS_SURVEYS);
      const expected = ids.reduce((s, id) => s + mockData.vitalsEmpAvg(id, "S24"), 0) / ids.length;
      expect(mockData.vitalsTeamAvg("S24")).toBeCloseTo(expected, 8);
    });
  });

  describe("vitalsTrend", () => {
    it("returns one value per seeded sprint, in order, ending with the current sprint's value", () => {
      const trend = mockData.vitalsTrend("E001", "communication");
      expect(trend).toHaveLength(mockData.VITALS_SPRINTS.length);
      expect(trend[trend.length - 1]).toBe(mockData.VITALS_SURVEYS.E001.S24.communication);
    });
  });

  describe("getVitalsTeams", () => {
    it("returns four teams", () => {
      expect(mockData.getVitalsTeams()).toHaveLength(4);
    });

    it("derives the Engineering team's checkin scores from vitalsEmpAvg", () => {
      const eng = mockData.getVitalsTeams().find((t) => t.name === "Engineering");
      const maya = eng?.checkins.find((c) => c.name === "Maya Chen");
      expect(maya?.score).toBeCloseTo(mockData.vitalsEmpAvg("E001", "S24"), 8);
    });

    it("reflects a submitCheckIn mutation on the next call rather than caching", () => {
      const flatMetrics = {
        workLifeBalance: 1,
        communication: 1,
        managerSupport: 1,
        teamCollaboration: 1,
        workload: 1,
        jobSatisfaction: 1,
      };
      mockData.submitCheckIn("E001", "S24", flatMetrics, "", "");
      const eng = mockData.getVitalsTeams().find((t) => t.name === "Engineering");
      const maya = eng?.checkins.find((c) => c.name === "Maya Chen");
      expect(maya?.score).toBe(1);
    });
  });

  describe("submitCheckIn", () => {
    it("writes metrics into VITALS_SURVEYS for a brand-new sprint key", () => {
      const metrics = {
        workLifeBalance: 5,
        communication: 5,
        managerSupport: 5,
        teamCollaboration: 5,
        workload: 5,
        jobSatisfaction: 5,
      };
      mockData.submitCheckIn("E001", "S99", metrics, "", "");
      expect(mockData.VITALS_SURVEYS.E001.S99).toEqual(metrics);
    });

    it("creates a fresh survey bucket for an employee with no prior surveys", () => {
      const metrics = {
        workLifeBalance: 3,
        communication: 3,
        managerSupport: 3,
        teamCollaboration: 3,
        workload: 3,
        jobSatisfaction: 3,
      };
      mockData.submitCheckIn("E999", "S24", metrics, "", "");
      expect(mockData.VITALS_SURVEYS.E999.S24).toEqual(metrics);
    });

    it("prepends a win without dropping existing wins", () => {
      const before = mockData.VITALS_REFLECTIONS.E001.wins.length;
      mockData.submitCheckIn("E001", "S24", mockData.VITALS_SURVEYS.E001.S24, "Shipped the thing", "");
      expect(mockData.VITALS_REFLECTIONS.E001.wins).toHaveLength(before + 1);
      expect(mockData.VITALS_REFLECTIONS.E001.wins[0].title).toBe("Shipped the thing");
    });

    it("leaves wins/pains untouched when win/pain are empty strings", () => {
      const beforeWins = mockData.VITALS_REFLECTIONS.E002.wins.length;
      const beforePains = mockData.VITALS_REFLECTIONS.E002.pains.length;
      mockData.submitCheckIn("E002", "S24", mockData.VITALS_SURVEYS.E002.S24, "", "");
      expect(mockData.VITALS_REFLECTIONS.E002.wins).toHaveLength(beforeWins);
      expect(mockData.VITALS_REFLECTIONS.E002.pains).toHaveLength(beforePains);
    });

    it("seeds a fresh reflection record for an employee with none, then applies the new win/pain", () => {
      mockData.submitCheckIn("E999", "S24", mockData.VITALS_SURVEYS.E001.S24, "First win", "First pain");
      expect(mockData.VITALS_REFLECTIONS.E999.wins).toHaveLength(1);
      expect(mockData.VITALS_REFLECTIONS.E999.pains).toHaveLength(1);
      expect(mockData.VITALS_REFLECTIONS.E999.prompts).toEqual([]);
    });
  });

  it("proves resetModules isolation: a mutation from an earlier test is not visible here", () => {
    // If isolation were broken, S99 (written in the "brand-new sprint key"
    // test above) would still be present on this fresh mockData import.
    expect(mockData.VITALS_SURVEYS.E001.S99).toBeUndefined();
  });
});
