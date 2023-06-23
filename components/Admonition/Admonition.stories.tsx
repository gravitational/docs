import type { Meta, StoryObj } from "@storybook/react";

import Admonition from "./Admonition";

const meta: Meta<typeof Admonition> = {
  title: "components/Admonition",
  component: Admonition,
};
export default meta;
type Story = StoryObj<typeof Admonition>;

export const WarningAdmonition: Story = {
  args: {
    type: "warning",
    title: "Warning",
    children: <span>Login Rules are currently in Preview mode.</span>,
  },
};

export const TipAdmonition: Story = {
  args: {
    type: "tip",
    title: "Tip",
    children: <span>Login Rules are currently in Preview mode.</span>,
  },
};

export const NoteAdmonition: Story = {
  args: {
    type: "note",
    title: "Note",
    children: <span>Login Rules are currently in Preview mode.</span>,
  },
};

export const DangerAdmonition: Story = {
  args: {
    type: "danger",
    title: "Danger",
    children: <span>Login Rules are currently in Preview mode.</span>,
  },
};
