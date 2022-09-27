import "jsdom-global";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Tabs } from "components/Tabs/Tabs";
import { TabItem } from "components/Tabs/TabItem";
import { suite } from "uvu";

const Suite = suite("components/Tabs");

Suite("only shows tab items for the selected dropdown option", () => {
  render(
    <Tabs dropdownSelected="Kubernetes" dropdownCaption="Environment">
      <TabItem label="Latest release" options="Kubernetes">
        Installing the latest release on Kubernetes
      </TabItem>
      <TabItem label="From source" options="Kubernetes">
        Building from source on Kubernetes
      </TabItem>
      <TabItem label="Latest release" options="Executable">
        Installing the latest release using an executable
      </TabItem>
      <TabItem label="From source" options="Executable">
        Building from source using an executable
      </TabItem>
    </Tabs>
  );

  await userEvent.click(screen.getByText("Kubernetes"));
  await userEvent.click(screen.getByText("Executable"));
  await userEvent.click(screen.getByText("Latest release"));

  assert.not.throws(() => {
    await screen.getByText("Installing the latest release using an executable");
  });
});

Suite.run();
