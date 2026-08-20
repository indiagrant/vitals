import type { Meta, StoryObj } from "@storybook/react-vite";
import { PatternSparkline } from "./PatternSparkline";

const values = [3, 3.5, 3, 4, 4.5];
const sprints = ["S20", "S21", "S22", "S23", "S24"];

const meta = {
  title: "Design system/PatternSparkline",
  component: PatternSparkline,
  parameters: { layout: "centered" },
  args: { values, sprints, tone: "sage" },
  argTypes: {
    tone: { control: "select", options: ["sage", "clay", "neutral"] },
    variant: { control: "select", options: ["mini", "full"] },
  },
} satisfies Meta<typeof PatternSparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mini: Story = { args: { variant: "mini" } };
export const Full: Story = { args: { variant: "full" } };
export const Clay: Story = { args: { variant: "full", tone: "clay", values: [4, 3.5, 3, 2.5, 2] } };
export const Neutral: Story = { args: { variant: "full", tone: "neutral", values: [3, 3, 3.5, 3, 3] } };
