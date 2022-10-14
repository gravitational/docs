import "jsdom-global";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Tabs, TabItem } from "components/Tabs";
import { describe, expect, test } from "@jest/globals";
import { NavigationCategory } from "layouts/DocsPage/types";
import { default as DocsPage } from "layouts/DocsPage/";

describe("components/Tabs", () => {
  test("only shows tab items for the selected dropdown option", () => {
    const pageMeta = {
      h1: "My nifty page",
      title: "My nifty site",
      description: "Here is my page.",
      layout: "doc",
      navigation: [],
      versions: {
        current: "10",
        latest: "11",
        available: ["9", "10", "11"],
      },
      githubUrl: "example.com",
      scopes: ["noScope"]
    };
    render(
      <DocsPage tableOfConents={[]} meta={pageMeta}>
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
      </DocsPage>
    );

    userEvent.click(screen.getByText("Kubernetes"));
    userEvent.click(screen.getByText("Executable"));
    userEvent.click(screen.getByText("Latest release"));

    expect(() => {
      screen.getByText("Installing the latest release using an executable");
    }).toThrow();
  });
});
