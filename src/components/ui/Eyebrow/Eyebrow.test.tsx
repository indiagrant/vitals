import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders its children", () => {
    render(<Eyebrow>Your check-in</Eyebrow>);
    expect(screen.getByText("Your check-in")).toBeInTheDocument();
  });

  it("defaults to muted tone", () => {
    render(<Eyebrow>Label</Eyebrow>);
    expect(screen.getByText("Label")).toHaveClass("text-muted-foreground");
  });

  it.each([
    ["sage", "text-sage"],
    ["clay", "text-clay"],
    ["fg", "text-foreground"],
  ] as const)("applies the %s tone class", (tone, expectedClass) => {
    render(<Eyebrow tone={tone}>Label</Eyebrow>);
    expect(screen.getByText("Label")).toHaveClass(expectedClass);
  });
});
