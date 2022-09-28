import "jsdom-global";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Tabs, TabItem } from "components/Tabs";
import { describe, expect, test } from "@jest/globals";

describe("components/Tabs", () => {
  test("only shows tab items for the selected dropdown option", () => {
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

    userEvent.click(screen.getByText("Kubernetes"));
    userEvent.click(screen.getByText("Executable"));
    userEvent.click(screen.getByText("Latest release"));

    expect(() => {
      screen.getByText(
        "Installing the latest release using an executable"
      );
    }).toThrow();
  });
});
