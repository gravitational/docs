import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { default as Pre } from "./Pre";
import { replaceClipboardWithCopyBuffer } from "utils/clipboard";
import { Var } from "../Variables/Var";

export const SimplePre = () => (
  <Pre>
    <code className="hljs language-yaml">
      <span className="hljs-attr">key1:</span>{" "}
      <span className="hljs-string">value</span>
      {"\n"}
      <span className="hljs-attr">key2:</span>{" "}
      <span className="hljs-string">value</span>
      {"\n"}
      <span className="hljs-attr">key3:</span>
      {"\n "}
      <span className="hljs-bullet">-</span>{" "}
      <span className="hljs-string">value</span>
      {"\n "}
      <span className="hljs-bullet">-</span>{" "}
      <span className="hljs-string">value2</span>
      {"\n "}
      <span className="hljs-bullet">-</span>{" "}
      <span className="hljs-string">value3</span>
    </code>
  </Pre>
);

const meta: Meta<typeof Pre> = {
  title: "components/MDX/Pre",
  component: SimplePre,
};
export default meta;
type Story = StoryObj<typeof Pre>;

export const CopySimplePre: Story = {
  render: () => {
    return <SimplePre />;
  },
  play: async ({ canvasElement, step }) => {
    replaceClipboardWithCopyBuffer();
    const canvas = within(canvasElement);

    await step("Copy the content", async () => {
      await userEvent.hover(canvas.getByText("value3"));
      await userEvent.click(canvas.getByTestId("copy-button-all"));
      expect(navigator.clipboard.readText()).toEqual(
        `key1: value
key2: value
key3:
 - value
 - value2
 - value3`
      );
    });
  },
};

export const CopyVarInPre: Story = {
  render: () => {
    return (
      <Pre>
        <code className="hljs language-yaml">
          <span className="hljs-attr">key1:</span>{" "}
          <span className="hljs-string">value</span>
          {"\n"}
          <span className="hljs-attr">key2:</span> <Var name="value" />
          {"\n"}
          <span className="hljs-attr">key3:</span>
          {"\n "}
          <span className="hljs-bullet">-</span>{" "}
          <span className="hljs-string">value</span>
          {"\n "}
          <span className="hljs-bullet">-</span>{" "}
          <span className="hljs-string">value2</span>
          {"\n "}
          <span className="hljs-bullet">-</span>{" "}
          <span className="hljs-string">value3</span>
        </code>
      </Pre>
    );
  },
  play: async ({ canvasElement, step }) => {
    replaceClipboardWithCopyBuffer();
    const canvas = within(canvasElement);

    await step("Copy the content", async () => {
      await userEvent.hover(canvas.getByText("value3"));
      await userEvent.click(canvas.getByTestId("copy-button-all"));
      expect(navigator.clipboard.readText()).toEqual(
        `key1: value
key2: value
key3:
 - value
 - value2
 - value3`
      );
    });
  },
};
