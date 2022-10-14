import "jsdom-global";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Tabs, TabItem } from "components/Tabs";
import { describe, expect, test } from "@jest/globals";
import { NavigationCategory } from "layouts/DocsPage/types";
import { default as DocsPage } from "layouts/DocsPage/";
import { TabsDropdownIdentical } from "./testdata/TabsDropdownIdentical.mdx";

describe("components/Tabs", () => {
  test("only shows tab items for the selected dropdown option", () => {
    render(<TabsDropdownIdentical />);

    userEvent.click(screen.getByText("Kubernetes"));
    userEvent.click(screen.getByText("Executable"));
    userEvent.click(screen.getByText("Latest release"));

    expect(() => {
      screen.getByText("Installing the latest release using an executable");
    }).toThrow();
  });
});
