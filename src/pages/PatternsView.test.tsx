import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatternsView } from "./PatternsView";
import { getEmployeeCheckIns, ApiError } from "@/lib/api";
import type { EmployeeCheckIn } from "@/lib/api";
import type { Employee } from "@/types";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, getEmployeeCheckIns: vi.fn() };
});

const employee: Employee = {
  id: "E004",
  name: "Lukas Berg",
  role: "Engineer",
  initials: "LB",
  tenure: "8mo",
};

function makeCheckIn(sprintId: string, order: number, overrides: Partial<EmployeeCheckIn> = {}): EmployeeCheckIn {
  return {
    id: order,
    employeeId: "E004",
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
    ...overrides,
  };
}

// communication flat at 2 for all five sprints — a real "stuck-concerning"
// signal, same shape as E004's actual seeded data (see README).
const STUCK_COMMUNICATION = [
  makeCheckIn("S20", 0, { communication: 2 }),
  makeCheckIn("S21", 1, { communication: 2 }),
  makeCheckIn("S22", 2, { communication: 2 }),
  makeCheckIn("S23", 3, { communication: 2 }),
  makeCheckIn("S24", 4, { communication: 2 }),
];

describe("PatternsView", () => {
  beforeEach(() => {
    vi.mocked(getEmployeeCheckIns).mockReset();
  });

  it("shows a loading state before the fetch resolves", () => {
    vi.mocked(getEmployeeCheckIns).mockReturnValue(new Promise(() => {}));
    render(<PatternsView employee={employee} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows an error message instead of crashing when the fetch fails", async () => {
    vi.mocked(getEmployeeCheckIns).mockRejectedValue(new ApiError("No employee with id \"E004\"", 404));
    render(<PatternsView employee={employee} />);
    expect(await screen.findByText("No employee with id \"E004\"")).toBeInTheDocument();
  });

  it("shows the no-signals headline when nothing in the real data stands out", async () => {
    const flat = Array.from({ length: 5 }, (_, i) => makeCheckIn(`S${20 + i}`, i));
    vi.mocked(getEmployeeCheckIns).mockResolvedValue(flat);
    render(<PatternsView employee={employee} />);
    expect(await screen.findByText("Nothing stood out yet.")).toBeInTheDocument();
  });

  it("detects a real signal from the fetched data and renders it as a card", async () => {
    vi.mocked(getEmployeeCheckIns).mockResolvedValue(STUCK_COMMUNICATION);
    render(<PatternsView employee={employee} />);

    expect(await screen.findByText("1 thing kept showing up.")).toBeInTheDocument();
    expect(screen.getByText(/Communication has sat at 2 for 5 sprints running/)).toBeInTheDocument();
    expect(screen.getByText("Stuck")).toBeInTheDocument();
  });

  it("clicking a signal card highlights it, and clicking again un-highlights it", async () => {
    const user = userEvent.setup();
    vi.mocked(getEmployeeCheckIns).mockResolvedValue(STUCK_COMMUNICATION);
    render(<PatternsView employee={employee} />);

    const card = await screen.findByRole("button", {
      name: /Communication has sat at 2 for 5 sprints running/,
    });
    expect(card).not.toHaveClass("border-clay");

    await user.click(card);
    expect(card).toHaveClass("border-clay");

    await user.click(card);
    expect(card).not.toHaveClass("border-clay");
  });
});
