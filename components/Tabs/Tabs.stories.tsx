import { Meta, Story } from "@storybook/react";
import { TabItem, Tabs, TabsProps } from "./Tabs";

const generateStoryComponent = () => {
  const StoryComponent: Story<TabsProps> = (args) => <Tabs {...args} />;

  return StoryComponent;
};

const meta: Meta = {
  component: Tabs,
  title: "Tabs",
};

export default meta;

export const Default = generateStoryComponent();

Default.args = {
  children: (
    <TabItem label="Amazon Linux">
      We recommend using `Amazon Linux 2` to install and use Linux kernel 4.19
      using `sudo amazon-linux-extras install kernel-ng` and rebooting your
      instance.
    </TabItem>
  ),
};
