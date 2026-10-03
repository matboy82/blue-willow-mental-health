import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage and content pages are accessible at desktop and mobile sizes', async ({ page }) => {
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/how-it-works/', '/pricing/', '/faq/', '/about/', '/contact/', '/privacy/', '/adhd-assessment-for-teens/', '/adhd-assessment-for-adults/']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${width}: ${route}`).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}: ${route} overflow`).toBe(true);
    }
  }
});
test('mobile navigation, FAQ, and booking paths work', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await page.getByLabel('Navigation menu').click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/\/pricing\//);
  await page.goto('/faq/');
  const question = page.getByText('How soon can I be seen?', { exact: true });
  await question.click();
  await expect(page.getByText(/Check the secure booking portal/)).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: 'Book your assessment', exact: true }).first().click();
  await expect(page).toHaveURL(/#book$/);
  await expect(page.getByRole('link', { name: 'Book your $225 assessment' })).toHaveAttribute('href', 'https://jo-elbert.clientsecure.me/');
});
test('secure form is user initiated and no health data reaches a site endpoint', async ({ page }) => {
  let loaded = false;
  await page.route('https://jo-elbert.clientsecure.me/**', route => { loaded = true; return route.fulfill({ contentType: 'text/html', body: '<h1>Mock secure contact form</h1>' }); });
  await page.goto('/contact/?sensitive=test');
  expect(loaded).toBe(false);
  await page.getByRole('button', { name: 'Load secure contact form' }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', 'https://jo-elbert.clientsecure.me/contact-widget');
  await expect(page.locator('iframe')).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(page.getByRole('button', { name: 'Load secure contact form' })).toBeHidden();
});
