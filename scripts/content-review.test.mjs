import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pageChecks, releaseGates, routes, reviewGaps, sourceSnapshot } from './content-review.mjs';

function completedRecord() {
  return {
    sourceSnapshot: 'snapshot', reviewer: 'Synthetic test reviewer', reviewedOn: '2026-01-01',
    pages: Object.fromEntries(routes.map(route => [route, Object.fromEntries(pageChecks.map(check => [check, true]))])),
    gates: Object.fromEntries(releaseGates.map(gate => [gate, true])),
  };
}
test('release review fails closed for missing, incomplete and stale human records', () => {
  assert.ok(reviewGaps({}, 'snapshot').length > 0);
  assert.deepEqual(reviewGaps(completedRecord(), 'snapshot'), []);
  assert.ok(reviewGaps(completedRecord(), 'changed').some(gap => /stale/.test(gap)));
  const record = completedRecord();
  record.pages['/faq/'].structuredData = false;
  record.gates.providerPublication = false;
  record.reviewer = '';
  record.reviewedOn = '2099-01-01';
  const gaps = reviewGaps(record, 'snapshot');
  for (const term of ['structuredData', 'providerPublication', 'reviewer', 'date']) assert.ok(gaps.some(gap => gap.includes(term)));
  record.reviewedOn = '2026-02-31';
  assert.ok(reviewGaps(record, 'snapshot').some(gap => gap.includes('date')));
});
test('source changes invalidate review, and line-ending conversion does not', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'blue-willow-review-'));
  try {
    for (const dir of ['src', 'public', 'functions']) await mkdir(path.join(root, dir));
    await mkdir(path.join(root, 'scripts'));
    await writeFile(path.join(root, 'scripts/content-review.mjs'), '// fixture');
    for (const file of ['astro.config.mjs', 'package.json', 'package-lock.json']) await writeFile(path.join(root, file), '{}');
    const file = path.join(root, 'src/page.astro');
    await writeFile(file, '<h1>Original</h1>\r\n');
    const baseline = await sourceSnapshot(root);
    await writeFile(file, '<h1>Original</h1>\n');
    assert.equal(await sourceSnapshot(root), baseline);
    await writeFile(file, '<h1>Changed</h1>\n');
    assert.notEqual(await sourceSnapshot(root), baseline);
    await writeFile(file, '<h1>Original</h1>\n');
    await writeFile(path.join(root, 'public/image.webp'), Buffer.from([1, 2, 3]));
    assert.notEqual(await sourceSnapshot(root), baseline);
  } finally { await rm(root, { recursive: true, force: true }); }
});
test('page schema identifies visible content without inventing authors or freshness', async () => {
  for (const route of routes) {
    const html = await readFile(path.join('dist', route.slice(1), 'index.html'), 'utf8');
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const page = graph.find(node => node['@id']?.endsWith('#webpage'));
    assert.ok(page, route);
    assert.equal(page.publisher['@id'], graph[0]['@id']);
    assert.equal(page.name, html.match(/<title>(.*?)<\/title>/s)[1].replaceAll('&amp;', '&'));
    for (const key of ['author', 'reviewedBy', 'lastReviewed', 'datePublished', 'dateModified', 'citation']) assert.equal(page[key], undefined, `${route} ${key}`);
    if ([].concat(page['@type']).includes('FAQPage')) {
      for (const question of page.mainEntity) {
        assert.ok(html.includes(question.name.replaceAll('&', '&amp;')) || html.includes(question.name), route);
        assert.ok(html.includes(question.acceptedAnswer.text.replaceAll('&', '&amp;')) || html.includes(question.acceptedAnswer.text), route);
      }
    }
  }
});
