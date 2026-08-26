import { dimensionTone, entryTone, findRecurringPrompt } from "./history";
import type { HistoryEntry } from "./history";

describe("dimensionTone", () => {
  it("is sage at and above 4", () => {
    expect(dimensionTone(4)).toBe("sage");
    expect(dimensionTone(5)).toBe("sage");
  });

  it("is clay at and below 2", () => {
    expect(dimensionTone(2)).toBe("clay");
    expect(dimensionTone(1)).toBe("clay");
  });

  it("is neutral for the middle value", () => {
    expect(dimensionTone(3)).toBe("neutral");
  });
});

describe("entryTone", () => {
  it("is sage when every dimension is 4 or above", () => {
    expect(entryTone([4, 5, 4, 5, 4, 5])).toBe("sage");
  });

  it("is clay when any single dimension is 2 or below, even if others are high", () => {
    expect(entryTone([5, 5, 5, 5, 2, 5])).toBe("clay");
  });

  it("is neutral for a mixed-but-not-low sprint", () => {
    expect(entryTone([3, 4, 3, 4, 3, 4])).toBe("neutral");
  });
});

describe("findRecurringPrompt", () => {
  function entry(sprint: string, prompts: string[]): HistoryEntry {
    return {
      sprint,
      dates: "",
      moods: [3, 3, 3, 3, 3, 3],
      tone: "neutral",
      title: "",
      synopsis: "",
      wins: [],
      pains: [],
      tickets: [],
      prompts,
    };
  }

  it("finds a prompt repeated across two entries, reporting sprints oldest-first", () => {
    // Input is newest-first, matching buildHistoryEntries' order.
    const entries = [
      entry("S22", ["Repeat me"]),
      entry("S21", ["Something else"]),
      entry("S20", ["Repeat me"]),
    ];
    expect(findRecurringPrompt(entries)).toEqual({ prompt: "Repeat me", sprints: ["S20", "S22"] });
  });

  it("picks the prompt with the most repeats when several recur", () => {
    const entries = [
      entry("S23", ["A", "B"]),
      entry("S22", ["B"]),
      entry("S21", ["A"]),
      entry("S20", ["A"]),
    ];
    expect(findRecurringPrompt(entries)?.prompt).toBe("A");
    expect(findRecurringPrompt(entries)?.sprints).toEqual(["S20", "S21", "S23"]);
  });

  it("returns null when no prompt repeats", () => {
    const entries = [entry("S21", ["One"]), entry("S20", ["Two"])];
    expect(findRecurringPrompt(entries)).toBeNull();
  });

  it("returns null for an empty entry list", () => {
    expect(findRecurringPrompt([])).toBeNull();
  });
});

// buildHistoryEntry/buildHistoryEntries read live mockData state — reset the
// module registry before every test, and re-import history.ts itself too
// (it statically imports mockData, so it would otherwise close over the
// stale pre-reset instance). See CLAUDE.md "Testing".
describe("buildHistoryEntry / buildHistoryEntries", () => {
  let mockData: typeof import("@/data/mockData");
  let history: typeof import("./history");

  beforeEach(async () => {
    vi.resetModules();
    mockData = await import("@/data/mockData");
    history = await import("./history");
  });

  it("builds an entry with moods in VITALS_DIMENSIONS order and real wins/pains/tickets/prompts", () => {
    const entry = history.buildHistoryEntry("E001", "S23");
    expect(entry).not.toBeNull();
    expect(entry!.moods).toEqual([3, 4, 3, 4, 2, 3]); // E001 S23: bal, comm, support, collab, workload, satisfaction
    expect(entry!.wins).toEqual(mockData.VITALS_REFLECTIONS.E001.S23.wins);
    expect(entry!.pains).toEqual(mockData.VITALS_REFLECTIONS.E001.S23.pains);
    expect(entry!.tickets).toEqual(mockData.VITALS_TICKETS.E001.S23);
    expect(entry!.prompts).toEqual(mockData.VITALS_REFLECTIONS.E001.S23.prompts);
  });

  it("names the dimension that moved most since the previous sprint in the synopsis", () => {
    // E001 S22->S23: managerSupport and jobSatisfaction both drop 4->3;
    // managerSupport comes first in VITALS_DIMENSIONS order and wins the tie.
    const entry = history.buildHistoryEntry("E001", "S23");
    expect(entry!.synopsis).toContain("Manager support");
    expect(entry!.synopsis).toContain("3");
  });

  it("falls back to a lead/lag synopsis for the first sprint, with no previous sprint to diff against", () => {
    const entry = history.buildHistoryEntry("E001", "S20");
    expect(entry!.synopsis).toMatch(/led at|landed at/);
  });

  it("returns null for an unknown employee id", () => {
    expect(history.buildHistoryEntry("nope", "S24")).toBeNull();
  });

  it("returns null for a known employee but unseeded sprint", () => {
    expect(history.buildHistoryEntry("E001", "S99")).toBeNull();
  });

  it("returns all five seeded sprints, newest first", () => {
    const entries = history.buildHistoryEntries("E001");
    expect(entries.map((e) => e.sprint)).toEqual(["S24", "S23", "S22", "S21", "S20"]);
  });
});
