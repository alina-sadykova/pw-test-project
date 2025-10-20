// playwright.config.ts

// NOTE: Adjust the path below based on your actual file structure
import { EnvironmentConfig, loadConfig } from "./config/ConfigLoader";
import { defineConfig, devices } from "@playwright/test";

// 1. Determine runtime environment and load configuration
const TARGET_ENV = process.env.TARGET_ENV || "staging";
const config: EnvironmentConfig = loadConfig(TARGET_ENV);

// Set environment flags and retry policy
const isCI = !!process.env.CI;

export default defineConfig({
  // ----------------------------------------------------
  // BASIC SETTINGS
  // ----------------------------------------------------
  testDir: "./tests", // Central location for all test scenarios
  timeout: 60000, // Use environment-specific timeout, default 60s
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,

  // ----------------------------------------------------
  // REPORTERS (No changes needed)
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // USE BLOCK (Dynamic Configuration Injection)
  // ----------------------------------------------------
  use: {
    // 1. DYNAMIC BASE URL: Essential for portable tests
    baseURL: config.baseUrl,

    // General Settings
    headless: true,
    viewport: { width: 1440, height: 900 },

    // ARTIFACTS
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Pass the current environment name directly to the browser context
    launchOptions: {
      args: [`--env=${TARGET_ENV}`],
    },
  },

  // ----------------------------------------------------
  // PROJECTS (Cross-Browser Execution - No changes needed)
  // ----------------------------------------------------
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
