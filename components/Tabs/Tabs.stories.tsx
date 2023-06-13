import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { TabItem } from "./TabItem";
import { Tabs } from "./Tabs";

export const DefaultTabsWithSelected = () => (
  <Tabs>
    <TabItem label="Source">Instructions for building from source.</TabItem>
    <TabItem label="Helm">
      Instructions for installing release using a Helm chart.
    </TabItem>
    <TabItem label="Shell" selected>
      Instructions for installing release using shell commands.
    </TabItem>
  </Tabs>
);

const meta: Meta<typeof Tabs> = {
  title: "components/Tabs",
  component: DefaultTabsWithSelected,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const InitialStateTab: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Should be the text for the selected option", async () => {
      expect(
        canvas.findByText(
          "Instructions for installing release using shell commands."
        )
      ).toBeTruthy();
    });
    await step(
      "Selected option should be disabled for re-selection",
      async () => {
        expect(canvas.getByText("Shell")).toBeDisabled();
      }
    );
  },
};

export const ChangeTab: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Select another option", async () => {
      expect(canvas.getByText("Helm")).toBeEnabled();
      await userEvent.click(canvas.getByText("Helm"));
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 300)));
      expect(
        canvas.findByText(
          "Instructions for installing release using a Helm chart."
        )
      ).toBeTruthy();
    });
  },
};
