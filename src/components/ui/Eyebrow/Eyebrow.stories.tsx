import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Design system/Eyebrow",
  component: Eyebrow,
  parameters: { layout: "centered" },
  argTypes: {
    tone: { control: "select", options: ["muted", "sage", "clay", "fg"] },
  },
  args: { children: "Your check-in", tone: "muted" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sage: Story = { args: { tone: "sage" } };
export const Clay: Story = { args: { tone: "clay" } };
export const Foreground: Story = { args: { tone: "fg" } };

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <Eyebrow tone="muted">Muted</Eyebrow>
      <Eyebrow tone="sage">Sage</Eyebrow>
      <Eyebrow tone="clay">Clay</Eyebrow>
      <Eyebrow tone="fg">Fg</Eyebrow>
    </div>
  ),
};
