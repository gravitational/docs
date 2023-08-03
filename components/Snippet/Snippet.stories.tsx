import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { Var } from "../Variables/Var";
import { default as Snippet } from "./Snippet";
import Command, { CommandLine, CommandComment } from "../Command/Command";
import { CodeLine } from "../Code";
import { replaceClipboardWithCopyBuffer } from "utils/clipboard";

export const SimpleCommand = () => (
  <Snippet>
    <Command>
      <CommandLine data-content="$ ">echo Hello world!</CommandLine>
    </Command>
  </Snippet>
);

const meta: Meta<typeof Snippet> = {
  title: "components/Snippet",
  component: SimpleCommand,
};
export default meta;
type Story = StoryObj<typeof Snippet>;

export const CopyCommandVar: Story = {
  render: () => {
    return (
      <Snippet>
        <Command>
          <CommandLine data-content="$ ">
            curl https://
            <Var name="example.com" isGlobal={false} description="" />
            /v1/webapi/saml/acs/azure-saml
          </CommandLine>
        </Command>
      </Snippet>
    );
  },
  play: async ({ canvasElement, step }) => {
    replaceClipboardWithCopyBuffer();
    const canvas = within(canvasElement);

    await step("Copy the content", async () => {
      await userEvent.hover(canvas.getByText("example.com"));
      await userEvent.click(canvas.getByTestId("copy-button"));
      expect(navigator.clipboard.readText()).toEqual(
        "curl https://example.com/v1/webapi/saml/acs/azure-saml"
      );
      await userEvent.click(canvas.getByTestId("copy-button-all"));
      expect(navigator.clipboard.readText()).toEqual(
        "curl https://example.com/v1/webapi/saml/acs/azure-saml"
      );
    });
  },
};

// A code snippet with commands should only copy the commands.
export const CopyCommandVarWithOutput: Story = {
  render: () => {
    return (
      <Snippet>
        <Command>
          <CommandLine data-content="$ ">
            curl https://
            <Var name="example.com" isGlobal={false} description="" />
            /v1/webapi/saml/acs/azure-saml
          </CommandLine>
        </Command>
        <CodeLine>
          The output of curling <Var name="example.com" />
        </CodeLine>
      </Snippet>
    );
  },
  play: async ({ canvasElement, step }) => {
    replaceClipboardWithCopyBuffer();
    const canvas = within(canvasElement);

    await step("Copy the content", async () => {
      await userEvent.click(canvas.getByTestId("copy-button-all"));
      expect(navigator.clipboard.readText()).toEqual(
        "curl https://example.com/v1/webapi/saml/acs/azure-saml"
      );
    });
  },
};

// A code snippet with no commands should copy all content within the snippet.
export const CopyCodeLineVar: Story = {
  render: () => {
    return (
      <Snippet>
        <CodeLine>
          curl https://
          <Var name="example.com" isGlobal={false} description="" />
          /v1/webapi/saml/acs/azure-saml
        </CodeLine>
      </Snippet>
    );
  },
  play: async ({ canvasElement, step }) => {
    replaceClipboardWithCopyBuffer();

    const canvas = within(canvasElement);

    await step("Copy the content", async () => {
      await userEvent.hover(canvas.getByText("example.com"));
      await userEvent.click(canvas.getByTestId("copy-button-all"));
      expect(navigator.clipboard.readText()).toEqual(
        "curl https://example.com/v1/webapi/saml/acs/azure-saml"
      );
    });
  },
};
