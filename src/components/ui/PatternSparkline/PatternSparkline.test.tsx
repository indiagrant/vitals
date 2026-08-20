import { render, screen, fireEvent } from "@testing-library/react";
import { PatternSparkline } from "./PatternSparkline";

const values = [3, 3.5, 3, 4, 4.5];
const sprints = ["S20", "S21", "S22", "S23", "S24"];

describe("PatternSparkline", () => {
  it("renders one point per value, plus a glow circle behind the last point", () => {
    const { container } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="full" />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(values.length + 1);
  });

  it("shows a tooltip with the sprint label and value on hover, in the full variant", () => {
    const { container } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="full" />,
    );
    const circles = container.querySelectorAll("circle");
    const lastPoint = circles[circles.length - 1];

    fireEvent.mouseEnter(lastPoint, { clientX: 100, clientY: 50 });

    expect(screen.getByText("S24")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("clears the tooltip on mouse leave", () => {
    const { container } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="full" />,
    );
    const point = container.querySelectorAll("circle")[0];

    fireEvent.mouseEnter(point, { clientX: 10, clientY: 10 });
    expect(screen.getByText("S20")).toBeInTheDocument();

    fireEvent.mouseLeave(point);
    expect(screen.queryByText("S20")).not.toBeInTheDocument();
  });

  it("has no hover tooltip wiring in the mini variant", () => {
    const { container } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="mini" />,
    );
    const point = container.querySelectorAll("circle")[0];

    fireEvent.mouseEnter(point, { clientX: 10, clientY: 10 });

    expect(screen.queryByText("S20")).not.toBeInTheDocument();
  });

  it("hides the decorative svg from assistive tech in both variants", () => {
    const { container: mini } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="mini" />,
    );
    const { container: full } = render(
      <PatternSparkline values={values} sprints={sprints} tone="sage" variant="full" />,
    );
    expect(mini.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(full.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes every point's real value as text in the full variant", () => {
    render(<PatternSparkline values={values} sprints={sprints} tone="sage" variant="full" />);
    expect(screen.getByText("S20: 3.0 out of 5")).toBeInTheDocument();
    expect(screen.getByText("S24: 4.5 out of 5")).toBeInTheDocument();
  });

  it("has no text-alternative list in the mini variant (redundant with adjacent prose)", () => {
    render(<PatternSparkline values={values} sprints={sprints} tone="sage" variant="mini" />);
    expect(screen.queryByText("S20: 3.0 out of 5")).not.toBeInTheDocument();
  });
});
