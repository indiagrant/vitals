import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckInView } from "./CheckInView";
import { submitCheckIn, getEmployeeCheckIns, ApiError } from "@/lib/api";
import type { EmployeeCheckIn } from "@/lib/api";
import type { Employee } from "@/types";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, submitCheckIn: vi.fn(), getEmployeeCheckIns: vi.fn() };
});

const employee: Employee = {
  id: "E001",
  name: "Maya Chen",
  role: "Senior Engineer",
  initials: "MC",
  tenure: "3y",
};

function makeCheckIn(overrides: Partial<EmployeeCheckIn> = {}): EmployeeCheckIn {
  return {
    id: 1,
    employeeId: "E001",
    sprintId: "S24",
    workLifeBalance: 3,
    communication: 3,
    managerSupport: 3,
    teamCollaboration: 3,
    workload: 3,
    jobSatisfaction: 3,
    prompts: [],
    reflections: [],
    sprint: { id: "S24", label: "S24", order: 4 },
    ...overrides,
  };
}

async function rateAllSix(user: ReturnType<typeof userEvent.setup>, rating = 4) {
  const questions = [
    "How was your work-life balance?",
    "How connected did you feel with the team?",
    "Did you feel supported by your manager?",
    "How was working with the team?",
    "How manageable was your workload?",
    "How satisfied did you feel with your work?",
  ];
  for (const q of questions) {
    await user.click(screen.getByRole("button", { name: `${q} — ${rating} of 5` }));
  }
}

describe("CheckInView", () => {
  beforeEach(() => {
    vi.mocked(submitCheckIn).mockReset();
    vi.mocked(getEmployeeCheckIns).mockReset();
    // Default: no existing check-in for this sprint — most tests exercise
    // the blank-form path; the summary/edit tests override this per-test.
    vi.mocked(getEmployeeCheckIns).mockResolvedValue([]);
  });

  it("shows a loading state before the initial fetch resolves", () => {
    vi.mocked(getEmployeeCheckIns).mockReturnValue(new Promise(() => {}));
    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders the blank form and disables submit until every dimension is rated", async () => {
    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    expect(await screen.findByText("How was this sprint?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit check-in" })).toBeDisabled();
  });

  it("submits real data and shows the success screen on a successful save", async () => {
    const user = userEvent.setup();
    vi.mocked(submitCheckIn).mockResolvedValue({
      id: 1, employeeId: "E001", sprintId: "S24",
      workLifeBalance: 4, communication: 4, managerSupport: 4,
      teamCollaboration: 4, workload: 4, jobSatisfaction: 4,
      prompts: [], reflections: [],
    });
    // After submit, CheckInView refetches — this second call should now
    // report the check-in as existing.
    vi.mocked(getEmployeeCheckIns).mockResolvedValueOnce([]).mockResolvedValueOnce([makeCheckIn()]);

    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    await screen.findByText("How was this sprint?");
    await rateAllSix(user);
    await user.type(screen.getByPlaceholderText("One thing that felt good…"), "Great sprint");
    await user.type(screen.getByPlaceholderText("One thing that didn't…"), "Too many meetings");
    await user.click(screen.getByRole("button", { name: "Submit check-in" }));

    expect(submitCheckIn).toHaveBeenCalledWith(
      "E001", "S24",
      { workLifeBalance: 4, communication: 4, managerSupport: 4, teamCollaboration: 4, workload: 4, jobSatisfaction: 4 },
      "Great sprint", "Too many meetings",
    );
    expect(await screen.findByText("Logged for Sprint 24.")).toBeInTheDocument();
  });

  it("shows an error and re-enables the button instead of the success screen when the save fails", async () => {
    const user = userEvent.setup();
    vi.mocked(submitCheckIn).mockRejectedValue(new ApiError("Invalid request body", 400));

    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    await screen.findByText("How was this sprint?");
    await rateAllSix(user);
    await user.click(screen.getByRole("button", { name: "Submit check-in" }));

    expect(await screen.findByText("Invalid request body")).toBeInTheDocument();
    expect(screen.queryByText("Logged for Sprint 24.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit check-in" })).toBeEnabled();
  });

  it("falls back to a generic message for a non-ApiError failure (e.g. the network itself dropping)", async () => {
    const user = userEvent.setup();
    vi.mocked(submitCheckIn).mockRejectedValue(new TypeError("Failed to fetch"));

    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    await screen.findByText("How was this sprint?");
    await rateAllSix(user);
    await user.click(screen.getByRole("button", { name: "Submit check-in" }));

    expect(await screen.findByText("Couldn't save your check-in. Please try again.")).toBeInTheDocument();
  });

  describe("when a check-in already exists for this sprint", () => {
    const existing = makeCheckIn({
      workLifeBalance: 5, communication: 5, managerSupport: 5,
      teamCollaboration: 5, workload: 5, jobSatisfaction: 5,
      reflections: [
        { id: 1, checkInId: 1, kind: "WIN", tag: "check-in", title: "Previous win", detail: "" },
        { id: 2, checkInId: 1, kind: "PAIN", tag: "check-in", title: "Previous pain", detail: "" },
        { id: 3, checkInId: 1, kind: "WIN", tag: "shipped", title: "Seeded, not form-owned", detail: "" },
      ],
    });

    it("shows the already-submitted summary instead of the blank form, on load", async () => {
      vi.mocked(getEmployeeCheckIns).mockResolvedValue([existing]);
      render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);

      expect(await screen.findByText("Logged for Sprint 24.")).toBeInTheDocument();
      expect(screen.getByText("5.0")).toBeInTheDocument();
      expect(screen.queryByText("How was this sprint?")).not.toBeInTheDocument();
    });

    it("clicking Edit shows the form pre-filled with the existing ratings and check-in-owned notes only", async () => {
      const user = userEvent.setup();
      vi.mocked(getEmployeeCheckIns).mockResolvedValue([existing]);
      render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);

      await user.click(await screen.findByRole("button", { name: "Edit your check-in" }));

      expect(screen.getByText("Edit your check-in")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Previous win")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Previous pain")).toBeInTheDocument();
      // All six already rated from the existing data, so submit is enabled immediately.
      expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    });

    it("Cancel from edit mode returns to the summary without submitting anything", async () => {
      const user = userEvent.setup();
      vi.mocked(getEmployeeCheckIns).mockResolvedValue([existing]);
      render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);

      await user.click(await screen.findByRole("button", { name: "Edit your check-in" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(await screen.findByText("Logged for Sprint 24.")).toBeInTheDocument();
      expect(submitCheckIn).not.toHaveBeenCalled();
    });
  });
});
