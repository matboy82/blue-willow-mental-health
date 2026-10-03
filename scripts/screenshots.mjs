import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH });
await mkdir('qa', { recursive: true });
const page = await browser.newPage();
for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 360, 800]]) {
  await page.setViewportSize({ width, height });
  await page.goto('http://127.0.0.1:4322/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `qa/home-${label}.png`, fullPage: true });
}
await browser.close();
