import { render, screen } from "@testing-library/react";
import { DimensionBar } from "./DimensionBar";

describe("DimensionBar", () => {
  it("renders the label and value", () => {
    render(<DimensionBar label="Workload" value={2} />);
    expect(screen.getByText("Workload")).toBeInTheDocument();
    expect(screen.getByText("2.0")).toBeInTheDocument();
  });

  it("shows a positive delta in sage when the score improved", () => {
    render(<DimensionBar label="Team collaboration" value={5} prevValue={4} />);
    expect(screen.getByText("+1")).toHaveClass("text-sage");
  });

  it("shows a negative delta in clay when the score dropped", () => {
    render(<DimensionBar label="Workload" value={2} prevValue={3} />);
    expect(screen.getByText("-1")).toHaveClass("text-clay");
  });

  it("omits the delta when the score is unchanged", () => {
    render(<DimensionBar label="Manager support" value={3} prevValue={3} />);
    expect(screen.queryByText("+0")).not.toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("omits the delta when there is no previous sprint", () => {
    render(<DimensionBar label="Manager support" value={3} />);
    expect(screen.getByText("3.0")).toBeInTheDocument();
  });
});
