import { dimensionTone, entryTone, historyEntriesFrom } from "./history";
import type { EmployeeCheckIn } from "./api";
import type { Ticket } from "@/types";

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

// historyEntriesFrom is pure — it takes the API payload and a tickets
// lookup as plain params, so no mockData isolation dance is needed here.
describe("historyEntriesFrom", () => {
  // Dimension order: bal, comm, support, collab, workload, satisfaction.
  function checkIn(
    sprintId: string,
    order: number,
    scores: [number, number, number, number, number, number],
    extras: Partial<Pick<EmployeeCheckIn, "prompts" | "reflections">> = {},
  ): EmployeeCheckIn {
    const [workLifeBalance, communication, managerSupport, teamCollaboration, workload, jobSatisfaction] = scores;
    return {
      id: order,
      employeeId: "E001",
      sprintId,
      workLifeBalance,
      communication,
      managerSupport,
      teamCollaboration,
      workload,
      jobSatisfaction,
      prompts: extras.prompts ?? [],
      reflections: extras.reflections ?? [],
      sprint: { id: sprintId, label: `${sprintId} dates`, order },
    };
  }

  function reflection(kind: "WIN" | "PAIN", title: string): EmployeeCheckIn["reflections"][number] {
    return { id: 0, checkInId: 0, kind, tag: "shipped", title, detail: "" };
  }

  const noTickets = () => [];

  it("maps a check-in to an entry: moods in dimension order, wins/pains split by kind, prompts, label as dates", () => {
    const [entry] = historyEntriesFrom(
      [
        checkIn("S23", 3, [3, 4, 3, 4, 2, 3], {
          prompts: ["A prompt"],
          reflections: [reflection("WIN", "A win"), reflection("PAIN", "A pain")],
        }),
      ],
      noTickets,
    );
    expect(entry.moods).toEqual([3, 4, 3, 4, 2, 3]);
    expect(entry.dates).toBe("S23 dates");
    expect(entry.wins).toEqual([{ tag: "shipped", title: "A win", detail: "" }]);
    expect(entry.pains).toEqual([{ tag: "shipped", title: "A pain", detail: "" }]);
    expect(entry.prompts).toEqual(["A prompt"]);
    expect(entry.tone).toBe("clay"); // workload at 2
  });

  it("fills tickets from the injected lookup, per sprint", () => {
    const ticket: Ticket = {
      id: "PLT-1",
      title: "A ticket",
      status: "done",
      estimate: 1,
      actual: 1,
      points: 1,
      type: "feature",
      note: "",
    };
    const entries = historyEntriesFrom([checkIn("S20", 0, [3, 3, 3, 3, 3, 3]), checkIn("S21", 1, [3, 3, 3, 3, 3, 3])], (id) =>
      id === "S21" ? [ticket] : [],
    );
    expect(entries.find((e) => e.sprint === "S21")!.tickets).toEqual([ticket]);
    expect(entries.find((e) => e.sprint === "S20")!.tickets).toEqual([]);
  });

  it("returns entries newest first, by sprint order rather than input order", () => {
    const entries = historyEntriesFrom(
      [checkIn("S22", 2, [3, 3, 3, 3, 3, 3]), checkIn("S20", 0, [3, 3, 3, 3, 3, 3]), checkIn("S21", 1, [3, 3, 3, 3, 3, 3])],
      noTickets,
    );
    expect(entries.map((e) => e.sprint)).toEqual(["S22", "S21", "S20"]);
  });

  it("names the dimension that moved most since the previous check-in in the synopsis", () => {
    // S22->S23: managerSupport and jobSatisfaction both drop 4->3;
    // managerSupport comes first in VITALS_DIMENSIONS order and wins the tie.
    const [latest] = historyEntriesFrom(
      [checkIn("S22", 2, [3, 4, 4, 4, 2, 4]), checkIn("S23", 3, [3, 4, 3, 4, 2, 3])],
      noTickets,
    );
    expect(latest.synopsis).toContain("Manager support");
    expect(latest.synopsis).toContain("3");
  });

  it("diffs against the employee's previous check-in even when a sprint in between is missing", () => {
    // No S21 check-in — S22 compares against S20, not against nothing.
    const [latest] = historyEntriesFrom(
      [checkIn("S20", 0, [3, 3, 3, 3, 3, 3]), checkIn("S22", 2, [3, 3, 3, 3, 5, 3])],
      noTickets,
    );
    expect(latest.synopsis).toBe("Workload climbed to 5 — the clearest move this sprint.");
  });

  it("falls back to a lead/lag synopsis for the first check-in, with nothing to diff against", () => {
    const [entry] = historyEntriesFrom([checkIn("S20", 0, [4, 5, 4, 5, 4, 5])], noTickets);
    expect(entry.synopsis).toMatch(/led at|landed at/);
  });

  it("returns an empty list for an employee with no check-ins", () => {
    expect(historyEntriesFrom([], noTickets)).toEqual([]);
  });
});
