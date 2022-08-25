import { test, expect } from "@playwright/test";

import { navigationData } from "../data/navbar-data";

test.describe.configure({ mode: "parallel" });

test("All urls are valid", async ({ request }) => {
  const allUrls: string[] = [];

  navigationData.forEach((dropdown) => {
    const dropdownMenu = dropdown.menu;

    if (!dropdownMenu) {
      return;
    }

    dropdownMenu.children.forEach((child) => {
      const url = child.href;

      if (child.isExternal) {
        return;
      }
      allUrls.push(url);
    });
  });

  await Promise.all(
    allUrls.map(async (url) => {
      const pageExists = await request.get(url);
      expect(
        pageExists.ok(),
        `Failed to get an okay response from ${url}`
      ).toBeTruthy();
    })
  );
});
