import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { routes } from './content-review.mjs';

const contentFiles = (await readdir('src/content/answers')).filter(file => file.endsWith('.md'));
const decode = text => text.replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = html => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const disclaimer = 'This page is for general information only. It is not medical advice. Talk with a qualified provider about your own health questions.';

test('all twelve answers match supplied content, page-specific schema and release inventory', async () => {
  assert.equal(contentFiles.length, 12);
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  const index = await readFile('dist/answers/index.html', 'utf8');
  const review = JSON.parse(await readFile('docs/content-review.json', 'utf8'));
  assert.ok(routes.includes('/answers/'));
  assert.ok(review.pages['/answers/']);
  assert.match(sitemap, /<loc>https:\/\/[^<]+\/answers\/<\/loc>/);
  for (const file of contentFiles) {
    const source = (await readFile(`src/content/answers/${file}`, 'utf8')).replace(/\r\n/g, '\n');
    const [, frontmatter, body] = source.split('---');
    const data = Object.fromEntries(frontmatter.trim().split('\n').map(line => {
      const split = line.indexOf(':');
      return [line.slice(0, split), JSON.parse(line.slice(split + 1))];
    }));
    const route = `/answers/${file.slice(0, -3)}/`;
    const html = await readFile(`dist${route}index.html`, 'utf8');
    assert.equal(text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]), data.question);
    assert.equal(text(html.match(/<p class="lead"[^>]*>(.*?)<\/p>/s)[1]), data.directAnswer);
    assert.equal(decode(html.match(/name="description" content="([^"]*)"/)[1]), data.directAnswer);
    const canonical = html.match(/rel="canonical" href="([^"]*)"/)[1];
    assert.equal(new URL(canonical).pathname, route);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
    const faqPages = schemas.flatMap(schema => schema['@graph'] ?? [schema]).filter(node => [].concat(node['@type']).includes('FAQPage'));
    assert.equal(faqPages.length, 1);
    assert.deepEqual(faqPages[0].mainEntity, [{ '@type': 'Question', name: data.question, acceptedAnswer: { '@type': 'Answer', text: data.directAnswer } }]);
    const crumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList').itemListElement;
    assert.deepEqual(crumbs.map(item => item.name), ['Home', 'Answers', data.question]);
    assert.deepEqual(crumbs.map(item => item.position), [1, 2, 3]);
    assert.equal(crumbs[2].item, canonical);
    assert.ok(text(html).includes(disclaimer));
    assert.match(html, /<section class="answer-booking">/);
    assert.match(html, /href="https:\/\/jo-elbert\.clientsecure\.me\/request"/);
    assert.ok(text(html).includes('$225 flat'));
    // Compare every approved body paragraph and bullet with rendered text.
    for (const paragraph of body.split(/\n\n+/)) {
      if (!paragraph.trim() || /^<\/?section/.test(paragraph.trim())) continue;
      for (const line of paragraph.split('\n')) {
        const plain = line.replace(/^## |^- /, '').replaceAll('**', '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
        const normalizeQuotes = value => value.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
        assert.ok(normalizeQuotes(text(html)).includes(normalizeQuotes(plain)), `${route}: missing supplied copy: ${plain}`);
      }
    }
    assert.ok(index.includes(`href="${route}"`));
    assert.ok(text(index).includes(data.summary));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
    assert.ok(routes.includes(route));
    assert.ok(review.pages[route]);
  }
});

test('homepage and booking link to the hub and security headers are copied unchanged', async () => {
  for (const file of ['dist/index.html', 'dist/booking/index.html']) {
    assert.match(await readFile(file, 'utf8'), /href="\/answers\/"/);
  }
  assert.deepEqual(await readFile('dist/_headers'), await readFile('public/_headers'));
});
