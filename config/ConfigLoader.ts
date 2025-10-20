import { STAGING_CONFIG as stagingConfig } from "./environments/staging";
// import DEV_CONFIG, PROD_CONFIG etc.

export interface EnvironmentConfig {
  baseUrl: string;
  startPath: string;
}

const CONFIG_MAP: Record<string, EnvironmentConfig> = {
  staging: stagingConfig,
  // dev: DEV_CONFIG,
  // production: PROD_CONFIG,
};

export function loadConfig(envName: string): EnvironmentConfig {
  return CONFIG_MAP[envName] ?? stagingConfig; // default to staging
}
