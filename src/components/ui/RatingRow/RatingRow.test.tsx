import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RatingRow } from "./RatingRow";

describe("RatingRow", () => {
  it("renders the question and shows — when unrated", () => {
    render(<RatingRow question="How was your workload?" value={0} onChange={vi.fn()} />);
    expect(screen.getByText("How was your workload?")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows the committed value as N/5", () => {
    render(<RatingRow question="How was your workload?" value={4} onChange={vi.fn()} />);
    expect(screen.getByText("4/5")).toBeInTheDocument();
  });

  it("calls onChange with the clicked step", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingRow question="How was your workload?" value={0} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "How was your workload? — 4 of 5" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("shows a live preview on hover before a value is committed", async () => {
    const user = userEvent.setup();
    render(<RatingRow question="How was your workload?" value={0} onChange={vi.fn()} />);

    await user.hover(screen.getByRole("button", { name: "How was your workload? — 3 of 5" }));

    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  it("clears the hover preview on mouse leave, falling back to unrated", async () => {
    // The label only reflects the hover preview while unrated (value=0) — once a
    // value is committed, the label pins to it and only the bar fill previews on
    // hover. See RatingRow's render: `value ? ... : preview ? ... : "—"`.
    const user = userEvent.setup();
    render(<RatingRow question="How was your workload?" value={0} onChange={vi.fn()} />);

    const segment = screen.getByRole("button", { name: "How was your workload? — 5 of 5" });
    await user.hover(segment);
    expect(screen.getByText("5/5")).toBeInTheDocument();

    await user.unhover(segment);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
