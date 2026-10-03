import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []))).flat();
}
const files = await htmlFiles('dist');
test('all required public routes are generated', async () => {
  for (const route of ['', 'how-it-works', 'pricing', 'faq', 'about', 'contact', 'privacy', 'adhd-assessment-for-teens', 'adhd-assessment-for-adults', 'styleguide']) {
    await access(path.join('dist', route, 'index.html'));
  }
  await access('dist/404.html');
  await access('dist/sitemap-index.xml');
  await access('dist/_headers');
});
test('generated navigation links and assets resolve', async () => {
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const [, raw] of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)) {
      const url = raw.split(/[?#]/)[0];
      if (!url) continue;
      const asset = path.join('dist', decodeURIComponent(url));
      await access(url.endsWith('/') ? path.join(asset, 'index.html') : asset);
    }
  }
});
test('pages use correct privacy and search defaults', async () => {
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /name="referrer" content="no-referrer"/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    assert.doesNotMatch(html, /googletagmanager|google-analytics|cloudflareinsights|fonts\.googleapis|fonts\.gstatic/);
    assert.doesNotMatch(html, /<form(?:\s|>)/);
    assert.doesNotMatch(html, /Jody Elbert|Jo Elbert|guaranteed diagnosis|Seen this week|Free cancellation/);
    const robots = process.env.PUBLIC_SITE_ENV === 'production' && !/styleguide|404/.test(file) ? 'index, follow' : 'noindex, nofollow';
    assert.ok(html.includes(`content="${robots}"`), file);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(json);
  }
});
test('contact form waits for explicit user interaction', async () => {
  const html = await readFile('dist/contact/index.html', 'utf8');
  assert.doesNotMatch(html, /<iframe/);
  assert.match(html, /id="load-contact"/);
  assert.match(html, /https:\/\/jo-elbert\.clientsecure\.me\/contact-widget/);
});
test('preview robots blocks indexing unless production is explicit', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.match(robots, process.env.PUBLIC_SITE_ENV === 'production' ? /Allow: \// : /Disallow: \/\n/);
});
