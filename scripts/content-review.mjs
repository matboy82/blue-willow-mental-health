import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const pageChecks = ['claims', 'title', 'description', 'structuredData', 'imageAlt', 'clinicalScope'];
export const releaseGates = ['providerPublication', 'providerCredentials', 'medicalDisclaimers', 'healthSources', 'aiDisclosure', 'imageProvenance', 'testimonialPermissions', 'honestDates', 'clientApproval', 'mattReleaseApproval'];
export const routes = ['/', '/about/', '/adhd-assessment-for-adults/', '/adhd-assessment-for-teens/', '/adhd-assessment-louisville-ky/', '/how-it-works/', '/pricing/', '/faq/', '/booking/', '/contact/', '/privacy/'];
const answerFiles = await readdir(fileURLToPath(new URL('../src/content/answers/', import.meta.url)));
routes.push('/answers/', ...answerFiles.filter(file => file.endsWith('.md')).sort().map(file => `/answers/${file.slice(0, -3)}/`));

// Normalize line endings so the same revision hashes equally on Windows and CI.
export async function sourceSnapshot(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
      const name = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await walk(name);
      else if (entry.isFile()) files.push(name);
    }
  }
  for (const dir of ['src', 'public', 'functions']) await walk(dir);
  files.push('astro.config.mjs', 'package.json', 'package-lock.json', 'scripts/content-review.mjs');
  const hash = createHash('sha256');
  for (const file of files.sort()) {
    let bytes = await readFile(path.join(root, file));
    if (/\.(astro|ts|js|mjs|css|md|json|txt|svg)$/.test(file) || /\/_headers$/.test(file)) {
      bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));
    }
    hash.update(file).update('\0').update(bytes).update('\0');
  }
  return hash.digest('hex');
}

export function reviewGaps(record, snapshot) {
  const gaps = [];
  if (record.sourceSnapshot !== snapshot) gaps.push('Review is missing or stale: sourceSnapshot must match the current source.');
  if (!record.reviewer?.trim()) gaps.push('Named human reviewer required.');
  const date = Date.parse(record.reviewedOn);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedOn ?? '') || !Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== record.reviewedOn || record.reviewedOn > new Date().toISOString().slice(0, 10)) gaps.push('Valid completed human review date required.');
  for (const route of routes) {
    for (const check of pageChecks) {
      if (record.pages?.[route]?.[check] !== true) gaps.push(`${route}: ${check} awaits human review.`);
    }
  }
  for (const gate of releaseGates) {
    if (record.gates?.[gate] !== true) gaps.push(`Release gate pending: ${gate}.`);
  }
  return gaps;
}

async function main() {
  const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
  const snapshot = await sourceSnapshot(root);
  const record = JSON.parse(await readFile(path.join(root, 'docs/content-review.json'), 'utf8'));
  const gaps = reviewGaps(record, snapshot);
  console.log(`Current sourceSnapshot: ${snapshot}`);
  console.log('Human review record: docs/content-review.json');
  if (gaps.length) console.log(gaps.join('\n'));
  else console.log('Recorded human review covers this source snapshot. This validates the record, not medical accuracy or deployment.');
  if (process.argv.includes('--release') && gaps.length) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
