import React from "react";
import { Tabs } from "./Tabs";
import { TabItem } from "./TabItem";
import { render } from "@testing-library/react";

describe("Tabs", () => {
  it("renders correctly", () => {
    const component = render(
      <Tabs>
        <TabItem label="First label">First tab.</TabItem>
        <TabItem label="Second label">Second tab.</TabItem>
      </Tabs>
    );
  });
});
