import { render, screen } from "@testing-library/react";
import { SprintView } from "./SprintView";
import { getEmployeeCheckIns, ApiError } from "@/lib/api";
import type { EmployeeCheckIn } from "@/lib/api";
import type { Employee } from "@/types";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, getEmployeeCheckIns: vi.fn() };
});

const employee: Employee = {
  id: "E001",
  name: "Maya Chen",
  role: "Senior Engineer",
  initials: "MC",
  tenure: "3y",
};

function makeCheckIn(sprintId: string, order: number): EmployeeCheckIn {
  return {
    id: order,
    employeeId: "E001",
    sprintId,
    workLifeBalance: 4,
    communication: 4,
    managerSupport: 4,
    teamCollaboration: 4,
    workload: 4,
    jobSatisfaction: 4,
    prompts: [],
    reflections: [],
    sprint: { id: sprintId, label: sprintId, order },
  };
}

describe("SprintView", () => {
  beforeEach(() => {
    vi.mocked(getEmployeeCheckIns).mockReset();
  });

  it("shows a loading state before the fetch resolves", () => {
    vi.mocked(getEmployeeCheckIns).mockReturnValue(new Promise(() => {})); // never resolves
    render(<SprintView employee={employee} sprint="S24" />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders real check-in data once loaded", async () => {
    vi.mocked(getEmployeeCheckIns).mockResolvedValue([makeCheckIn("S24", 4)]);
    render(<SprintView employee={employee} sprint="S24" />);

    // Score 4 across all six dimensions lands in headlineForScore's "steady" bucket.
    expect(await screen.findByText("A steady sprint")).toBeInTheDocument();
    expect(screen.getByText("Six dimensions, this sprint")).toBeInTheDocument();
  });

  it("shows an error message instead of crashing when the fetch fails", async () => {
    vi.mocked(getEmployeeCheckIns).mockRejectedValue(new ApiError("No employee with id \"E001\"", 404));
    render(<SprintView employee={employee} sprint="S24" />);

    expect(await screen.findByText("No employee with id \"E001\"")).toBeInTheDocument();
  });

  it("shows a specific message when there's no check-in for the requested sprint", async () => {
    vi.mocked(getEmployeeCheckIns).mockResolvedValue([makeCheckIn("S20", 0)]); // only S20, not S24
    render(<SprintView employee={employee} sprint="S24" />);

    expect(await screen.findByText("No check-in recorded for this sprint yet.")).toBeInTheDocument();
  });
});
