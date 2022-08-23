import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  webServer: {
    command: "yarn playwright-dev",
    url: "http://localhost:3000/docs/",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
    baseURL: "http://localhost:3000/docs/",
    viewport: { width: 1280, height: 2000 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        channel: "chrome",
      },
      testMatch: [/single-browser/, /all-browsers/, /api-tests/],
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
      testMatch: /all-browsers/,
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
      testMatch: /all-browsers/,
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 13 Pro"],
      },
      testMatch: /all-browsers/,
    },
  ],
};

export default config;
