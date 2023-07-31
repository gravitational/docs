import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { replaceClipboardWithCopyBuffer } from "utils/clipboard";

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
    replaceClipboardWithCopyBuffer();
    const canvas = within(canvasElement);
    await step("Hover and click on copy button", async () => {
      await userEvent.hover(canvas.getByTestId("copy-button"));
      await userEvent.click(canvas.getByTestId("copy-button"));
    });
  },
};
