import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import type { default as tlEvent } from "@testing-library/user-event";

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
      // This stubs out the browser clipboard, which is necessary to avoid
      // permission issues. The @storybook/testing-library userEvent extends the
      // one from @testing-library/user-event, but the "setup" method is not
      // part of its type declaration.
      const user = (userEvent as typeof tlEvent).setup();
      await user.hover(canvas.getByTestId("copy-button"));
      await user.click(canvas.getByTestId("copy-button"));
    });
  },
};
