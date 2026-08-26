import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryView } from "./HistoryView";
import { VITALS_EMPLOYEES } from "@/data/mockData";

const maya = VITALS_EMPLOYEES.find((e) => e.id === "E001")!;

describe("HistoryView", () => {
  it("renders one entry per seeded sprint", () => {
    render(<HistoryView employee={maya} />);
    // One "Flag for retro" star per entry — a stable count independent of
    // headline text, which can repeat across sprints.
    expect(screen.getAllByRole("button", { name: "Flag for retro" })).toHaveLength(5);
  });

  it("expands only the most recent sprint by default", () => {
    render(<HistoryView employee={maya} />);
    expect(screen.getByText(/TTFB win shipped under estimate/)).toBeInTheDocument();
    expect(screen.queryByText(/Billing webhooks v2 kicked off clean/)).not.toBeInTheDocument();
  });

  it("surfaces a recurring prompt callout when one repeats across sprints", () => {
    // E001's "What's one thing you'd hand off if you could?" is seeded on
    // both S22 and S24 — it appears twice in the DOM (once in the callout,
    // once in S24's expanded prompt list), so assert at least one match
    // rather than uniqueness.
    render(<HistoryView employee={maya} />);
    expect(screen.getByText("Worth asking again")).toBeInTheDocument();
    expect(screen.getAllByText(/What's one thing you'd hand off if you could\?/).length).toBeGreaterThan(0);
    expect(screen.getByText(/You were asked this in S22 and S24/)).toBeInTheDocument();
  });

  it("expands a collapsed entry when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<HistoryView employee={maya} />);
    // "Most things felt right." is S20's headline, the only Maya sprint that
    // hits the top score bucket — safe to query without ambiguity.
    const header = screen.getByText("Most things felt right.").closest('[role="button"]');
    expect(header).not.toBeNull();

    await user.click(header!);

    expect(screen.getByText(/Billing webhooks v2 kicked off clean/)).toBeInTheDocument();
  });

  it("filters entries by search text, leaving only sprints that match", async () => {
    const user = userEvent.setup();
    render(<HistoryView employee={maya} />);

    await user.type(screen.getByPlaceholderText("Search your entries…"), "schema review");

    expect(screen.getAllByRole("button", { name: "Flag for retro" })).toHaveLength(1);
    expect(screen.getByText(/PLT-471 stalled on schema review/)).toBeInTheDocument();
  });

  it("shows an empty state when the search matches no entries", async () => {
    const user = userEvent.setup();
    render(<HistoryView employee={maya} />);

    await user.type(screen.getByPlaceholderText("Search your entries…"), "zzz-no-such-entry-zzz");

    expect(screen.getByText(/No entries match/)).toBeInTheDocument();
  });

  it("dims non-matching sections when a filter chip is active, without removing them", async () => {
    const user = userEvent.setup();
    render(<HistoryView employee={maya} />);

    await user.click(screen.getByRole("button", { name: "Wins" }));

    const painsHeading = screen.getAllByText("Worth sitting with")[0];
    const winsHeading = screen.getAllByText("Wins worth keeping")[0];
    expect(painsHeading.parentElement).toHaveClass("opacity-30");
    expect(winsHeading.parentElement).not.toHaveClass("opacity-30");
  });

  it("toggles the flag-for-retro star's pressed state on click, without toggling the entry", async () => {
    const user = userEvent.setup();
    render(<HistoryView employee={maya} />);
    const star = screen.getAllByRole("button", { name: "Flag for retro" })[0];
    expect(star).toHaveAttribute("aria-pressed", "false");

    await user.click(star);

    expect(star).toHaveAttribute("aria-pressed", "true");
    // Starring shouldn't also expand/collapse the entry underneath it.
    expect(screen.queryByText(/Billing webhooks v2 kicked off clean/)).not.toBeInTheDocument();
  });
});
