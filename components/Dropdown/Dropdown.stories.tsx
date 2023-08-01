import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import Icon from "components/Icon";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "components/Dropdown",
  component: Dropdown,
  args: {
    value: "Version 2",
    options: ["Version 1", "Version 2", "Version 3"],
    bgColor: "purple",
    icon: <Icon name="clock" size="sm" />,
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const SimpleDropdown: Story = {
  args: {
    value: "Version 2",
    options: ["Version 1", "Version 2", "Version 3"],
  },
};

export const ExpandedDropdown: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Expand dropdown", async () => {
      await userEvent.click(canvas.getByTestId("listbox-input").children[0]);
    });
  },
};
