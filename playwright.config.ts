// playwright.config.ts
import { EnvironmentConfig, loadConfig } from "./config/ConfigLoader";
import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";

dotenv.config();

const TARGET_ENV = process.env.TARGET_ENV || "staging";
const config: EnvironmentConfig = loadConfig(TARGET_ENV);

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,

  reporter: [
    ["list"],
    ["junit", { outputFile: "test-results/e2e-junit.xml" }],
    [
      "html",
      {
        outputFolder: "test-results/html-report",
        open: isCI ? "never" : "on-failure",
      },
    ],
    ...(process.env.GITHUB_ACTIONS ? [["github"] as const] : []),
  ],

  outputDir: "test-results/artifacts",

  use: {
    baseURL: config.baseUrl,
    headless: true,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
