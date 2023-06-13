import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";

import Command from "./Command";

const commandText = "yarn install";

const meta: Meta<typeof Command> = {
  title: "components/Command",
  component: Command,
  args: {
    children: <span>{commandText}</span>,
  },
};
export default meta;
type Story = StoryObj<typeof Command>;

export const SimpleCommand: Story = {
  args: {
    children: <span>{commandText}</span>,
  },
};

export const CopyButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Hover and click on copy button", async () => {
      await userEvent.hover(canvas.getByTestId("copy-button"));
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 300)));
      await userEvent.click(canvas.getByTestId("copy-button"));
    });
  },
};
