import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { Var } from "../Variables/Var";
import { VarsProvider } from "../Variables/context";

export const SimpleVar = () => <Var name="myvar" initial="myval" />;

const meta: Meta<typeof Var> = {
  title: "components/Var",
  component: SimpleVar,
};
export default meta;
type Story = StoryObj<typeof Var>;

export const EnterValueIntoVariable: Story = {
  render: () => {
    return (
      <VarsProvider>
        <Var name="myvar" />
      </VarsProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Enter a value", async () => {
      await userEvent.click(canvas.getByTestId("var-input"));
      await userEvent.keyboard("newval");
      // The test should not throw, i.e., the component's value should be
      // "newval".
      await canvas.findByDisplayValue("newval");
    });
  },
};

export const ShowDefaultValueWithOneVar: Story = {
  render: () => {
    return (
      <VarsProvider>
        <Var name="myvar" initial="myval" />
      </VarsProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Examine the initial value", async () => {
      canvas.getByDisplayValue("myval");
    });
  },
};

export const ShowDefaultValueWithMultipleVarsAndOneInitial: Story = {
  render: () => {
    return (
      <VarsProvider>
        <Var name="myvar" initial="val1" />
        <Var name="myvar" />
        <Var name="myvar" />
      </VarsProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Examine the initial values", async () => {
      await waitFor(() => {
        const inputs = canvas.getAllByDisplayValue("val1");
        expect(inputs.length).toBe(3);
      });
    });
  },
};

// Expecting the last initial value is arbitrary and based on observation. While
// authors should avoid setting multiple initial values, throwing an exception
// would only hurt readers when they attempt to load the page.
export const ShowDefaultValueWithMultipleVarsAndMultipleInitials: Story = {
  render: () => {
    return (
      <VarsProvider>
        <Var name="myvar" initial="val1" />
        <Var name="myvar" initial="val2" />
        <Var name="myvar" />
      </VarsProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Examine the initial values", async () => {
      await waitFor(() => {
        const inputs = canvas.getAllByDisplayValue("val2");
        expect(inputs.length).toBe(3);
      });
    });
  },
};
