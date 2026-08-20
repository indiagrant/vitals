import type { Meta, StoryObj } from "@storybook/react-vite";
import { DimensionBar } from "./DimensionBar";

const meta = {
  title: "Design system/DimensionBar",
  component: DimensionBar,
  parameters: { layout: "centered" },
  args: { label: "Team collaboration", value: 3 },
} satisfies Meta<typeof DimensionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { value: 3 } };
export const SageWithPositiveDelta: Story = {
  name: "Sage — improved",
  args: { label: "Team collaboration", value: 5, prevValue: 4 },
};
export const ClayWithNegativeDelta: Story = {
  name: "Clay — dropped",
  args: { label: "Workload", value: 2, prevValue: 3 },
};
export const NoPreviousSprint: Story = {
  args: { label: "Manager support", value: 3, prevValue: undefined },
};

export const AllThreeTones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 260 }}>
      <DimensionBar label="Team collaboration" value={5} prevValue={4} />
      <DimensionBar label="Manager support" value={3} />
      <DimensionBar label="Workload" value={2} prevValue={3} />
    </div>
  ),
};
