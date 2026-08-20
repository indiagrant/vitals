import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserSwitcher } from "./UserSwitcher";
import type { Employee } from "@/types";

const employees: Employee[] = [
  { id: "E001", name: "Maya Chen", initials: "MC", role: "Senior Engineer", tenure: "3y" },
  { id: "E002", name: "Daniel Kim", initials: "DK", role: "Engineer", tenure: "1y" },
];

describe("UserSwitcher", () => {
  it("renders nothing when closed", () => {
    render(
      <UserSwitcher open={false} onOpenChange={vi.fn()} currentId="E001" employees={employees} onPick={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders as a labelled, modal dialog when open", () => {
    render(
      <UserSwitcher open={true} onOpenChange={vi.fn()} currentId="E001" employees={employees} onPick={vi.fn()} />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Switch user");
  });

  it("marks the current employee with aria-current", () => {
    render(
      <UserSwitcher open={true} onOpenChange={vi.fn()} currentId="E002" employees={employees} onPick={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /Maya Chen/ })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: /Daniel Kim/ })).toHaveAttribute("aria-current", "true");
  });

  it("calls onPick when an employee is clicked", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(
      <UserSwitcher open={true} onOpenChange={vi.fn()} currentId="E001" employees={employees} onPick={onPick} />,
    );

    await user.click(screen.getByRole("button", { name: /Daniel Kim/ }));

    expect(onPick).toHaveBeenCalledWith("E002");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <UserSwitcher open={true} onOpenChange={onOpenChange} currentId="E001" employees={employees} onPick={vi.fn()} />,
    );

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when the explicit close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <UserSwitcher open={true} onOpenChange={onOpenChange} currentId="E001" employees={employees} onPick={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("moves focus into the dialog on open", () => {
    render(
      <UserSwitcher open={true} onOpenChange={vi.fn()} currentId="E001" employees={employees} onPick={vi.fn()} />,
    );
    // First focusable element inside the dialog is the close button.
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });
});
