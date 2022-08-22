import { test, expect } from "@playwright/test";

import assert from "assert";
import { navigationData } from "../data/navbar-data";

test.describe.configure({ mode: "parallel" });

test("Sections in navbar contain appropriate titles and hrefs when viewed on desktop and mobile", async ({
  isMobile,
  page,
}) => {
  await page.goto("/docs");

  if (isMobile) {
    await page.locator('[data-testid="hamburger"]').click();
  }

  for (const dropdown of navigationData) {
    const element = await page.locator(
      `[data-testid="${dropdown.dropdownButton.testId}"]`
    );

    if (dropdown.dropdownMenu) {
      await expect(element).toBeVisible();
      await expect(element).toHaveText(dropdown.dropdownButton.title);
      await element.click();
      const menu = page.locator(
        `[data-testid="${dropdown?.dropdownMenu?.testId}"]:visible`
      );

      await expect(menu).toBeVisible();

      if (!isMobile) {
        const menuTitle = menu.locator("h3");
        await expect(menuTitle).toHaveText(dropdown.dropdownMenu.title);
      }

      const links = menu.locator("a");
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const expectedLink = dropdown.dropdownMenu.children[i];

        assert(expectedLink);
        await expect(link).toHaveAttribute("href", expectedLink.href);

        const strongTag = link.locator("strong");

        await expect(strongTag).toHaveText(expectedLink.title);
      }

      if (isMobile) {
        await element.click();
      }
    } else if (dropdown.href) {
      await expect(element).toHaveAttribute("href", `${dropdown.href}`);
    }
  }

  // test click away from dropdown menu
  if (!isMobile) {
    const body = page.locator("body");
    await expect(body).toBeVisible();
    await body.click();
  }
});
