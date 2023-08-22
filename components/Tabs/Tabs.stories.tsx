import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { default as Pre } from "../MDX/Pre";
import { TabContextProvider } from "./TabContext";
import { DocsContextProvider } from "layouts/DocsPage/context";

import { TabItem } from "./TabItem";
import { Tabs } from "./Tabs";

export const DefaultTabsWithSelected = () => (
  <TabContextProvider>
    <Tabs>
      <TabItem label="Source">Instructions for building from source.</TabItem>
      <TabItem label="Helm">
        Instructions for installing release using a Helm chart.
      </TabItem>
      <TabItem label="Shell" selected>
        Instructions for installing release using shell commands.
      </TabItem>
    </Tabs>
  </TabContextProvider>
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
        await canvas.findByText(
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
      expect(
        await canvas.findByText(
          "Instructions for installing release using a Helm chart."
        )
      ).toBeTruthy();
    });
  },
};

export const TabsWithDropdownView: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform" dropdownView>
          <TabItem label="Option 1">Instructions for Option 1.</TabItem>
          <TabItem label="Option 2">Instructions for Option 2.</TabItem>
          <TabItem label="Option 3">Instructions for Option 3.</TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    step("View the initial tab", async () => {
      expect(await canvas.findByText("Instructions for Option 1.")).not.toBe(
        null
      );
    });
  },
};

export const TabsWithDropdownAndIdenticalLabels: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform">
          <TabItem options="Kubernetes Option" label="OSS">
            Kubernetes/OSS
          </TabItem>
          <TabItem options="Linux Server Option" label="OSS">
            Linux Server/OSS
          </TabItem>
          <TabItem options="Kubernetes Option" label="Enterprise">
            Kubernetes/Enterprise
          </TabItem>
          <TabItem options="Linux Server Option" label="Enterprise">
            Linux Server/Enterprise
          </TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    step("Switch dropdown tabs", async () => {
      await userEvent.click(canvas.getByTestId("listbox-input"));
      await userEvent.click(await canvas.findByText("Linux Server Option"));
      const tabs = canvas.getAllByTestId("tabitem");
      const visibleTabs = tabs.filter((tab) => {
        return !tab.parentElement.className.includes("hidden");
      });
      expect(visibleTabs.length).toBe(1);
    });
  },
};

export const TabsWithDropdownIdenticalLabelsAndMultipleOptionValues: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform">
          <TabItem options="Kubernetes Option" label="OSS">
            Kubernetes/OSS
          </TabItem>
          <TabItem options="Linux Server Option" label="OSS">
            Linux Server/OSS
          </TabItem>
          <TabItem options="Kubernetes Option" label="Enterprise">
            Kubernetes/Enterprise
          </TabItem>
          <TabItem options="Linux Server Option" label="Enterprise">
            Linux Server/Enterprise
          </TabItem>
          <TabItem
            options="Linux Server Option,Kubernetes Option"
            label="Cloud Label"
          >
            Cloud instructions
          </TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Cloud Label"));
    expect(
      canvas.getByText("Cloud instructions").parentElement.className
    ).not.toContain("hidden");
  },
};

// Ensure the dropdown appears above the code snippet
export const DropdownWithCodeSnippet: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform" dropdownView>
          <TabItem label="Option 1">
            <Pre>
              <code>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </code>
            </Pre>
          </TabItem>
          <TabItem label="Option 2">
            Instructions for the second option.
          </TabItem>
          <TabItem label="Option 3">Instructions for the third option.</TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
};

export const TabItemsWithTheSameLabelsChangeTogether: Story = {
  render: () => {
    return (
      <DocsContextProvider>
        <TabContextProvider>
          <Tabs>
            <TabItem label="Kubernetes Label">
              Initial Kubernetes instructions
            </TabItem>
            <TabItem label="Linux VM Label">
              Initial Linux VM instructions.
            </TabItem>
            <TabItem label="Another Platform Label">
              Instructions for another platform.
            </TabItem>
          </Tabs>
          <Tabs>
            <TabItem label="Self-Hosted">Self-Hosted instructions</TabItem>
            <TabItem label="Linux VM Label">
              These instructions should remain hidden.
            </TabItem>
            <TabItem label="Cloud Label">Cloud instructions</TabItem>
          </Tabs>
          <Tabs>
            <TabItem label="Kubernetes Label">
              More Kubernetes instructions
            </TabItem>
            <TabItem label="Another Platform Label">
              Instructions for another platform.
            </TabItem>
            <TabItem label="Linux VM Label">More Linux VM instructions</TabItem>
          </Tabs>
        </TabContextProvider>
      </DocsContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const linuxLabels = canvas.getAllByText("Linux VM Label");
    await userEvent.click(linuxLabels[0]);
    expect(
      canvas.getByText("More Linux VM instructions").parentElement.className
    ).not.toContain("hidden");
    expect(
      canvas.getByText("These instructions should remain hidden.").parentElement
        .className
    ).toContain("hidden");
  },
};

export const TabsWithIdenticalDropdownsChangeTogether: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform">
          <TabItem options="Kubernetes Option" label="OSS">
            Kubernetes/OSS
          </TabItem>
          <TabItem options="Linux Server Option" label="OSS">
            Linux Server/OSS
          </TabItem>
          <TabItem options="Kubernetes Option" label="Enterprise label">
            Kubernetes/Enterprise
          </TabItem>
          <TabItem options="Linux Server Option" label="Enterprise label">
            Linux Server/Enterprise
          </TabItem>
        </Tabs>

        <Tabs dropdownCaption="Platform">
          <TabItem options="Kubernetes Option" label="OSS">
            Kubernetes/OSS 2
          </TabItem>
          <TabItem options="Linux Server Option" label="OSS">
            Linux Server/OSS 2
          </TabItem>
          <TabItem options="Kubernetes Option" label="Enterprise label">
            Kubernetes/Enterprise 2
          </TabItem>
          <TabItem options="Linux Server Option" label="Enterprise label">
            Linux Server/Enterprise 2
          </TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const ents = canvas.getAllByText("Enterprise label");
    await userEvent.click(ents[0]);
    const dropdowns = canvas.getAllByTestId("listbox-input");
    await userEvent.click(dropdowns[0].children[0]);
    const linuxOptions = await canvas.findAllByText("Linux Server Option");
    await userEvent.click(linuxOptions[0]);

    expect(
      canvas.getByText("Linux Server/Enterprise 2").parentElement.className
    ).not.toContain("hidden");
  },
};

export const TabsWithDropdownViewChangeTogether: Story = {
  render: () => {
    return (
      <TabContextProvider>
        <Tabs dropdownCaption="Platform" dropdownView>
          <TabItem label="Option 1">First instructions for Option 1.</TabItem>
          <TabItem label="Option 2">First instructions for Option 2.</TabItem>
        </Tabs>
        <Tabs dropdownCaption="Platform" dropdownView>
          <TabItem label="Option 1">Second instructions for Option 1.</TabItem>
          <TabItem label="Option 2">Second instructions for Option 2.</TabItem>
        </Tabs>
      </TabContextProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const dropdowns = canvas.getAllByTestId("listbox-input");
    await userEvent.click(dropdowns[0].children[0]);
    const options = await canvas.findAllByText("Option 2");
    await userEvent.click(options[0]);

    expect(
      canvas.getByText("Second instructions for Option 2.").parentElement
        .className
    ).not.toContain("hidden");
  },
};
