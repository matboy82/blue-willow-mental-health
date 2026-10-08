import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage and content pages are accessible at desktop and mobile sizes', async ({ page }) => {
  test.setTimeout(90_000); // Eighteen page/viewport audits can exceed the default thirty seconds.
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/booking/', '/how-it-works/', '/pricing/', '/faq/', '/about/', '/contact/', '/privacy/', '/adhd-assessment-for-teens/', '/adhd-assessment-for-adults/', '/adhd-assessment-louisville-ky/']) {
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
  await expect(page.getByRole('link', { name: 'Book your assessment', exact: true }).first()).toHaveAttribute('href', 'https://jo-elbert.clientsecure.me/');
  await expect(page.getByRole('link', { name: 'Book your $225 assessment' })).toHaveAttribute('href', 'https://jo-elbert.clientsecure.me/');
});
test('contact uses the native secure link without loading third-party forms', async ({ page }) => {
  let loaded = false;
  await page.route('https://jo-elbert.clientsecure.me/**', route => { loaded = true; return route.fulfill({ contentType: 'text/html', body: '<h1>Mock secure contact form</h1>' }); });
  await page.goto('/contact/?sensitive=test');
  expect(loaded).toBe(false);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Send a secure inquiry' })).toHaveAttribute('href', 'https://jo-elbert.clientsecure.me/contact-widget');
  await expect(page.getByRole('link', { name: 'Send a secure inquiry' })).toHaveAttribute('rel', 'noreferrer');
});

test('first render loads two font files and appropriately sized cached brand assets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /\.woff2/.test(r.name)).map(r => r.name));
  expect(fonts).toHaveLength(2);
  const logo = page.locator('.brand img');
  const hero = page.locator('.hero-art img');
  await expect(logo).toHaveJSProperty('complete', true);
  await expect(hero).toHaveJSProperty('complete', true);
  expect(await logo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeLessThanOrEqual(92);
  for (const image of [logo, hero]) {
    const src = await image.evaluate((img: HTMLImageElement) => img.currentSrc);
    expect(new URL(src).pathname).toMatch(/^\/_astro\/.*\.webp$/);
  }
  expect(await hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.goto('/pricing/');
  await expect(page.locator('.brand img')).toHaveJSProperty('complete', true);
});

test('main content stays visible when font downloads fail', async ({ page }) => {
  await page.route('**/*.woff2', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Book your assessment', exact: true }).first()).toBeVisible();
});

test('PT badges are visible and campaign source survives navigation into the booking handoff', async ({ page }) => {
  const events: unknown[] = [];
  await page.route('**/api/booking-event', async route => { events.push(route.request().postDataJSON()); await route.fulfill({ status: 204 }); });
  let destination = '';
  await page.route('https://jo-elbert.clientsecure.me/**', async route => { destination = route.request().url(); await route.fulfill({ contentType: 'text/html', body: '<h1>Synthetic portal</h1>' }); });
  await page.goto('/?utm_source=psychologytoday&utm_medium=referral&utm_campaign=pt-profile&private=test');
  const badge = page.getByRole('img', { name: /Verified by Psychology Today/ });
  await expect(badge).toBeVisible();
  expect(await badge.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(186);
  await page.getByRole('link', { name: /Before you book/ }).click();
  await expect(page).toHaveURL(/\/booking\/$/);
  await expect(badge).toBeVisible();
  const saved = await page.evaluate(() => sessionStorage.getItem('blue-willow-attribution'));
  expect(JSON.parse(saved!)).toEqual({ utm_source: 'psychologytoday', utm_medium: 'referral', utm_campaign: 'pt-profile' });
  await page.getByRole('link', { name: 'Book your $225 assessment' }).click();
  await expect(page.getByRole('heading', { name: 'Synthetic portal' })).toBeVisible();
  expect(new URL(destination).searchParams.get('utm_source')).toBe('psychologytoday');
  expect(new URL(destination).searchParams.has('private')).toBe(false);
  expect(events).toEqual([{ event: 'booking_link_click', page: '/booking/', service: 'initial-assessment', channel: 'link', utm_source: 'psychologytoday', utm_medium: 'referral', utm_campaign: 'pt-profile' }]);
});

test('unregistered URL values are discarded and unavailable session storage does not block direct booking', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked'); } }); });
  const events: any[] = [];
  await page.route('**/api/booking-event', async route => { events.push(route.request().postDataJSON()); await route.fulfill({ status: 204 }); });
  await page.route('https://jo-elbert.clientsecure.me/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Synthetic portal</h1>' }));
  await page.goto('/booking/?utm_source=unregistered-private-text&utm_campaign=private-text');
  await page.getByRole('link', { name: 'Book your $225 assessment' }).click();
  await expect(page).toHaveURL('https://jo-elbert.clientsecure.me/?utm_source=direct');
  expect(events[0]).toMatchObject({ utm_source: 'direct' });
  expect(events[0]).not.toHaveProperty('utm_campaign');
});

test('a newly tagged visit replaces session campaign and WebMCP uses the same attributed handoff', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).publicTools = {};
    Object.defineProperty(document, 'modelContext', { value: { registerTool(tool: any) { (window as any).publicTools[tool.name] = tool; } } });
  });
  const events: any[] = [];
  await page.route('**/api/booking-event', async route => { events.push(route.request().postDataJSON()); await route.fulfill({ status: 204 }); });
  await page.route('https://jo-elbert.clientsecure.me/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Synthetic portal</h1>' }));
  await page.goto('/?utm_source=psychologytoday&utm_medium=referral&utm_campaign=pt-profile');
  await page.goto('/booking/?utm_source=instagram&utm_medium=social');
  const result = await page.evaluate(() => (window as any).publicTools.open_booking_flow.execute({ service: 'follow-up' }));
  expect(new URL(result.url).searchParams.get('utm_source')).toBe('instagram');
  expect(new URL(result.url).searchParams.has('utm_campaign')).toBe(false);
  await expect(page.getByRole('heading', { name: 'Synthetic portal' })).toBeVisible();
  expect(events).toEqual([{ event: 'booking_link_click', page: '/booking/', service: 'follow-up', channel: 'webmcp', utm_source: 'instagram', utm_medium: 'social' }]);
});
