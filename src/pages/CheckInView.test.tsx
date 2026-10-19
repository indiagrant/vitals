import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckInView } from "./CheckInView";
import { submitCheckIn, ApiError } from "@/lib/api";
import type { Employee } from "@/types";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, submitCheckIn: vi.fn() };
});

const employee: Employee = {
  id: "E001",
  name: "Maya Chen",
  role: "Senior Engineer",
  initials: "MC",
  tenure: "3y",
};

async function rateAllSix(user: ReturnType<typeof userEvent.setup>) {
  const questions = [
    "How was your work-life balance?",
    "How connected did you feel with the team?",
    "Did you feel supported by your manager?",
    "How was working with the team?",
    "How manageable was your workload?",
    "How satisfied did you feel with your work?",
  ];
  for (const q of questions) {
    await user.click(screen.getByRole("button", { name: `${q} — 4 of 5` }));
  }
}

describe("CheckInView", () => {
  beforeEach(() => {
    vi.mocked(submitCheckIn).mockReset();
  });

  it("renders all six questions and disables submit until every dimension is rated", () => {
    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);

    expect(screen.getByText("How was this sprint?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit check-in" })).toBeDisabled();
  });

  it("submits real data and shows the success screen on a successful save", async () => {
    const user = userEvent.setup();
    vi.mocked(submitCheckIn).mockResolvedValue({
      id: 1,
      employeeId: "E001",
      sprintId: "S24",
      workLifeBalance: 4,
      communication: 4,
      managerSupport: 4,
      teamCollaboration: 4,
      workload: 4,
      jobSatisfaction: 4,
      prompts: [],
      reflections: [],
    });

    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
    await rateAllSix(user);
    await user.type(screen.getByPlaceholderText("One thing that felt good…"), "Great sprint");
    await user.type(screen.getByPlaceholderText("One thing that didn't…"), "Too many meetings");
    await user.click(screen.getByRole("button", { name: "Submit check-in" }));

    expect(submitCheckIn).toHaveBeenCalledWith(
      "E001",
      "S24",
      {
        workLifeBalance: 4,
        communication: 4,
        managerSupport: 4,
        teamCollaboration: 4,
        workload: 4,
        jobSatisfaction: 4,
      },
      "Great sprint",
      "Too many meetings",
    );
    expect(await screen.findByText("Logged for Sprint 24.")).toBeInTheDocument();
  });

  it("shows an error and re-enables the button instead of the success screen when the save fails", async () => {
    const user = userEvent.setup();
    vi.mocked(submitCheckIn).mockRejectedValue(new ApiError("Invalid request body", 400));

    render(<CheckInView employee={employee} sprint="S24" onDone={vi.fn()} />);
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
    await rateAllSix(user);
    await user.click(screen.getByRole("button", { name: "Submit check-in" }));

    expect(await screen.findByText("Couldn't save your check-in — please try again.")).toBeInTheDocument();
  });
});
