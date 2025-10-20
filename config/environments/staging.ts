// This file is committed to Git.
// It defines static, non-secret configurations for the STAGING environment.

export interface EnvironmentConfig {
  baseUrl: string;
  startPath: string;
  timeout?: number;
}

export const STAGING_CONFIG: EnvironmentConfig = {
  baseUrl: "https://request.na.test.1800gotjunk.dev",
  startPath: "/us_en/onlinebooking",
  timeout: 45000,
};

// You will import and use STAGING_CONFIG in your ConfigLoader.ts
