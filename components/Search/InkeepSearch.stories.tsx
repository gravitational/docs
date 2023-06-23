import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { InkeepSearch } from "./InkeepSearch";

const meta: Meta<typeof InkeepSearch> = {
  title: "components/InkeepSearch",
  component: InkeepSearch,
};
export default meta;
type Story = StoryObj<typeof InkeepSearch>;

export const SimpleSearch: Story = {
  args: {},
};

export const ClickAndSearch: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Search Input should be clear at the start", async () => {
      expect(canvas.getByTestId("search-input")).toHaveValue("");
    });
    await step("Focus and type in Search Input", async () => {
      await userEvent.click(canvas.getByTestId("search-input"));
      await userEvent.type(canvas.getByTestId("search-input"), "Some value");
      expect(canvas.getByTestId("search-input")).toHaveValue("Some value");
    });
  },
};
