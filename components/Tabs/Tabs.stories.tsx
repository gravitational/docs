import { Meta, Story } from "@storybook/react";
import { TabItem, Tabs, TabsProps } from "./Tabs";
import { screen, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

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

const differentOptsTemplate = (args) => (
  <Tabs dropdownCaption="Environment type" dropdownSelected="Kubernetes">
    <TabItem options="Kubernetes" label="Connect to the Auth Service">
      Here is how to connect to the Auth Service on Kubernetes
    </TabItem>
    <TabItem options="Kubernetes" label="Connect to the Proxy Service">
      Here is how to connect to the Proxy Service on Kubernetes
    </TabItem>
    <TabItem options="Executable" label="Connect to the Auth Service">
      Here is how to connect to the Auth Service on Kubernetes
    </TabItem>
    <TabItem options="Executable" label="Connect to the Proxy Service">
      Here is how to connect to the Proxy Service on Kubernetes
    </TabItem>
  </Tabs>
);

export const DifferentOptionsIdenticalTabLabels = differentOptsTemplate.bind(
  {}
);

DifferentOptionsIdenticalTabLabels.differentOptsTemplate.bind({});

DifferentOptionsIdenticalTabLabels.play = async () => {
  await userEvent.click(screen.getByText("Kubernetes"));
  await userEvent.click(screen.getbyText("Executable"));
  await expect();
  // TODO: Add an assertion. Look at the storybook/jest package docs
};
