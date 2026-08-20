import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Design system/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    tone: { control: "select", options: ["sage", "clay", "muted"] },
  },
  args: { tone: "sage", children: "shipped" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sage: Story = { args: { tone: "sage", children: "shipped" } };
export const Clay: Story = { args: { tone: "clay", children: "blocked" } };
export const Muted: Story = { args: { tone: "muted", children: "in flight" } };

/** The real usage this was extracted from — Vitals' four ticket statuses. */
export const TicketStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Badge tone="sage">shipped</Badge>
      <Badge tone="muted">in flight</Badge>
      <Badge tone="clay">blocked</Badge>
      <Badge tone="clay">carried over</Badge>
    </div>
  ),
};
