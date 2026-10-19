import { sprintDataFor } from "./sprintData";
import type { EmployeeCheckIn } from "./api";

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

describe("sprintDataFor", () => {
  it("finds the current sprint and the one before it, splitting reflections by kind", () => {
    const checkIns = [
      makeCheckIn({ sprintId: "S20", order: 0, workload: 4 }),
      makeCheckIn({
        sprintId: "S21",
        order: 1,
        workload: 2,
        prompts: ["What would help?"],
        reflections: [
          { id: 1, checkInId: 2, kind: "WIN", tag: "shipped", title: "Shipped the thing", detail: "" },
          { id: 2, checkInId: 2, kind: "PAIN", tag: "workload", title: "Workload dropped", detail: "" },
        ],
      }),
    ];

    const result = sprintDataFor(checkIns, "S21");

    expect(result).not.toBeNull();
    expect(result!.current.workload).toBe(2);
    expect(result!.previous?.workload).toBe(4);
    expect(result!.previousSprintId).toBe("S20");
    expect(result!.wins).toEqual([{ tag: "shipped", title: "Shipped the thing", detail: "" }]);
    expect(result!.pains).toEqual([{ tag: "workload", title: "Workload dropped", detail: "" }]);
    expect(result!.prompts).toEqual(["What would help?"]);
  });

  it("returns a null previous (not an error) for the very first sprint in the history", () => {
    const checkIns = [makeCheckIn({ sprintId: "S20", order: 0 })];

    const result = sprintDataFor(checkIns, "S20");

    expect(result!.previous).toBeNull();
    expect(result!.previousSprintId).toBeNull();
  });

  it("returns null when the requested sprint isn't in the history at all", () => {
    const checkIns = [makeCheckIn({ sprintId: "S20", order: 0 })];

    expect(sprintDataFor(checkIns, "S99")).toBeNull();
  });

  it("orders by Sprint.order, not array position — the API makes no promise about row order", () => {
    // S21 listed BEFORE S20 here, deliberately out of chronological order.
    const checkIns = [
      makeCheckIn({ sprintId: "S21", order: 1, workload: 2 }),
      makeCheckIn({ sprintId: "S20", order: 0, workload: 4 }),
    ];

    const result = sprintDataFor(checkIns, "S21");

    expect(result!.previousSprintId).toBe("S20");
    expect(result!.previous?.workload).toBe(4);
  });
});
