import { render, screen } from "@testing-library/react";
import { TeamTrace } from "./TeamTrace";
import type { Team } from "@/types";

// jsdom doesn't implement ResizeObserver at all (this is the only component
// that uses it) — stub it so the component's mount effect doesn't throw.
// Canvas rendering itself isn't exercised here — jsdom has no real 2D
// context or layout, so `draw()` no-ops safely (see its `if (!ctx) return`).
// This covers what jsdom *can* verify: the canvas is marked decorative and
// the real accessible content (the sr-only per-check-in list) is correct.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);
const team: Team = {
  id: "T1",
  name: "Platform",
  pod: "Core",
  prevAvg: 3.4,
  checkins: [
    { name: "Maya Chen", initials: "MC", score: 3.5 },
    { name: "Daniel Kim", initials: "DK", score: 4.5 },
  ],
  dims: {} as Team["dims"],
};

describe("TeamTrace", () => {
  it("hides the canvas from assistive tech", () => {
    const { container } = render(<TeamTrace team={team} />);
    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes each check-in's name and score as real text", () => {
    render(<TeamTrace team={team} />);
    expect(screen.getByText("Maya Chen: 3.5 out of 5")).toBeInTheDocument();
    expect(screen.getByText("Daniel Kim: 4.5 out of 5")).toBeInTheDocument();
  });
});
