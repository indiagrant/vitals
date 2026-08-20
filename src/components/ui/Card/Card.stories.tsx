import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "@/components/ui/Button";

const meta = {
  title: "Design system/Card",
  component: Card,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anatomy: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>CardDescription sits directly under the title.</CardDescription>
      </CardHeader>
      <CardContent>CardContent holds the body — text, a list, a chart.</CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

/** Not imported anywhere in the shipped app yet — documented ahead of need. */
export const NotYetUsed: Story = {
  name: "Honest gap — unused in-app",
  render: () => (
    <Card style={{ width: 320 }}>
      <CardContent>
        Card is exported and fully styled, but no page in Vitals imports it yet.
      </CardContent>
    </Card>
  ),
};
