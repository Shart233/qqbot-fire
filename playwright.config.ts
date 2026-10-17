import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "ui.spec.ts",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:19989",
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),
      args: process.platform==='linux' ? ["--no-sandbox"] : [],
    },
  },
  webServer: {
    command: "node --import tsx tests/ui-server.ts",
    url: "http://127.0.0.1:19989/health",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
