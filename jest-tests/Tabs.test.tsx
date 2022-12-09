import "jsdom-global";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "@jest/globals";
import * as TabsDropdownIdentical from "./testdata/TabsDropdownIdentical.mdx";

console.log("TabsDropdownIdentical:", TabsDropdownIdentical);

describe("components/Tabs", () => {
  test("only shows tab items for the selected dropdown option", () => {
    render(TabsDropdownIdentical);

    // console.log("screen.debug() after render:\n", screen.debug());

    userEvent.click(screen.getByText("Kubernetes"));
    userEvent.click(screen.getByText("Executable"));
    userEvent.click(screen.getByText("Latest release"));

    expect(() => {
      screen.getByText("Installing the latest release using an executable");
    }).toThrow();
  });
});
