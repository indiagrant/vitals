import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RatingRow } from "./RatingRow";

const meta = {
  title: "Design system/RatingRow",
  component: RatingRow,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RatingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unrated: Story = {
  args: { question: "How manageable was your workload this sprint?", value: 0, onChange: () => {} },
};

export const Rated: Story = {
  args: { question: "How manageable was your workload this sprint?", value: 4, onChange: () => {} },
};

/** RatingRow is controlled — this story owns its own state so clicking a segment actually rates it. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);
    return <RatingRow {...args} value={value} onChange={setValue} />;
  },
  args: { question: "How manageable was your workload this sprint?", value: 0, onChange: () => {} },
};
