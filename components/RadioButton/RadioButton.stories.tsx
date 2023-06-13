import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";

import { RadioButton } from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "components/RadioButton",
  component: RadioButton,
  args: {
    name: "default",
    id: "radio-0",
    value: "Button",
    variant: "gray",
    icon: "calendar",
  },
};
export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Gray: Story = {
  args: {
    name: "gray-radio",
    id: "radio-1",
    value: "Gray button",
    variant: "gray",
  },
};

export const Green: Story = {
  args: {
    name: "green-radio",
    id: "radio-2",
    value: "Green button",
    variant: "green",
    checked: true,
  },
};

export const Blue: Story = {
  args: {
    name: "blue-radio",
    id: "radio-3",
    value: "Blue button",
    variant: "blue",
    icon: "calendar",
  },
};

export const ClickAndCheck: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Click on radio button should check it", async () => {
      await userEvent.click(canvas.getByRole("radio"));
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 300)));
      expect(canvas.getByRole("radio")).toBeChecked();
    });
  },
};
