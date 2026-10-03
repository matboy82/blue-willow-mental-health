import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4322', launchOptions: { executablePath: process.env.BROWSER_EXECUTABLE_PATH } },
  webServer: { command: 'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4322', url: 'http://127.0.0.1:4322', reuseExistingServer: !process.env.CI },
});
