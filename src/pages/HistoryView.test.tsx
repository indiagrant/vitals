import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryView } from "./HistoryView";
import { getEmployeeCheckIns, ApiError, type EmployeeCheckIn } from "@/lib/api";
import { SPRINT_DATES, VITALS_EMPLOYEES, VITALS_REFLECTIONS, VITALS_SPRINTS, VITALS_SURVEYS } from "@/data/mockData";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, getEmployeeCheckIns: vi.fn() };
});

const maya = VITALS_EMPLOYEES.find((e) => e.id === "E001")!;

// Maya's API payload, built from mockData exactly the way prisma/seed.ts
// builds her DB rows — so these tests assert against the same content the
// real endpoint returns, without hand-copying it.
function seededCheckIns(empId: string): EmployeeCheckIn[] {
  return VITALS_SPRINTS.flatMap((sprintId, order) => {
    const metrics = VITALS_SURVEYS[empId]?.[sprintId];
    if (!metrics) return [];
    const reflection = VITALS_REFLECTIONS[empId]?.[sprintId];
    return [
      {
        id: order,
        employeeId: empId,
        sprintId,
        ...metrics,
        prompts: reflection?.prompts ?? [],
        reflections: [
          ...(reflection?.wins ?? []).map((r) => ({ id: 0, checkInId: order, kind: "WIN" as const, ...r })),
          ...(reflection?.pains ?? []).map((r) => ({ id: 0, checkInId: order, kind: "PAIN" as const, ...r })),
        ],
        sprint: { id: sprintId, label: SPRINT_DATES[sprintId], order },
      },
    ];
  });
}

// Renders and waits for the fetch to resolve — the journal header only
// appears once entries are loaded.
async function renderLoaded() {
  render(<HistoryView employee={maya} />);
  await screen.findByText("Every sprint, in your words.");
}

describe("HistoryView", () => {
  beforeEach(() => {
    vi.mocked(getEmployeeCheckIns).mockReset();
    vi.mocked(getEmployeeCheckIns).mockResolvedValue(seededCheckIns("E001"));
  });

  it("shows a loading state before the fetch resolves", () => {
    vi.mocked(getEmployeeCheckIns).mockReturnValue(new Promise(() => {})); // never resolves
    render(<HistoryView employee={maya} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows an error message instead of crashing when the fetch fails", async () => {
    vi.mocked(getEmployeeCheckIns).mockRejectedValue(new ApiError('No employee with id "E001"', 404));
    render(<HistoryView employee={maya} />);
    expect(await screen.findByText('No employee with id "E001"')).toBeInTheDocument();
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    vi.mocked(getEmployeeCheckIns).mockRejectedValue(new TypeError("Failed to fetch"));
    render(<HistoryView employee={maya} />);
    expect(await screen.findByText("Couldn't load your history.")).toBeInTheDocument();
  });

  it("renders one entry per seeded sprint", async () => {
    await renderLoaded();
    // One "Flag for retro" star per entry — a stable count independent of
    // headline text, which can repeat across sprints.
    expect(screen.getAllByRole("button", { name: "Flag for retro" })).toHaveLength(5);
  });

  it("expands only the most recent sprint by default", async () => {
    await renderLoaded();
    expect(screen.getByText(/TTFB win shipped under estimate/)).toBeInTheDocument();
    expect(screen.queryByText(/Billing webhooks v2 kicked off clean/)).not.toBeInTheDocument();
  });

  it("expands a collapsed entry when its header is clicked", async () => {
    const user = userEvent.setup();
    await renderLoaded();
    // "Most things felt right." is S20's headline, the only Maya sprint that
    // hits the top score bucket — safe to query without ambiguity.
    const header = screen.getByText("Most things felt right.").closest('[role="button"]');
    expect(header).not.toBeNull();

    await user.click(header!);

    expect(screen.getByText(/Billing webhooks v2 kicked off clean/)).toBeInTheDocument();
  });

  it("toggles a sprint-jump pill: expands on first click, collapses on second", async () => {
    const user = userEvent.setup();
    await renderLoaded();
    const sprintNav = screen.getByRole("navigation", { name: "Jump to sprint" });
    const pill = within(sprintNav).getByRole("button", { name: /Sprint 20 · Jun 24 → Jul 7/ });

    await user.click(pill);
    expect(screen.getByText(/Billing webhooks v2 kicked off clean/)).toBeInTheDocument();

    await user.click(pill);
    expect(screen.queryByText(/Billing webhooks v2 kicked off clean/)).not.toBeInTheDocument();
  });

  it("filters entries by search text, leaving only sprints that match", async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.type(screen.getByPlaceholderText("Search your entries…"), "schema review");

    expect(screen.getAllByRole("button", { name: "Flag for retro" })).toHaveLength(1);
    expect(screen.getByText(/PLT-471 stalled on schema review/)).toBeInTheDocument();
  });

  it("shows an empty state when the search matches no entries", async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.type(screen.getByPlaceholderText("Search your entries…"), "zzz-no-such-entry-zzz");

    expect(screen.getByText(/No entries match/)).toBeInTheDocument();
  });

  it("dims non-matching sections when a filter chip is active, without removing them", async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.click(screen.getByRole("button", { name: "Wins" }));

    const painsHeading = screen.getAllByText("Worth sitting with")[0];
    const winsHeading = screen.getAllByText("Wins worth keeping")[0];
    expect(painsHeading.parentElement).toHaveClass("opacity-30");
    expect(winsHeading.parentElement).not.toHaveClass("opacity-30");
  });

  it("toggles the flag-for-retro star's pressed state on click, without toggling the entry", async () => {
    const user = userEvent.setup();
    await renderLoaded();
    const star = screen.getAllByRole("button", { name: "Flag for retro" })[0];
    expect(star).toHaveAttribute("aria-pressed", "false");

    await user.click(star);

    expect(star).toHaveAttribute("aria-pressed", "true");
    // Starring shouldn't also expand/collapse the entry underneath it.
    expect(screen.queryByText(/Billing webhooks v2 kicked off clean/)).not.toBeInTheDocument();
  });
});
