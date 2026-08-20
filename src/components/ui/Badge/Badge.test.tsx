import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge tone="sage">shipped</Badge>);
    expect(screen.getByText("shipped")).toBeInTheDocument();
  });

  it.each([
    ["sage", "text-sage"],
    ["clay", "text-clay"],
    ["muted", "text-muted-foreground"],
  ] as const)("applies the %s tone class", (tone, expectedClass) => {
    render(<Badge tone={tone}>label</Badge>);
    expect(screen.getByText("label")).toHaveClass(expectedClass);
  });
});
