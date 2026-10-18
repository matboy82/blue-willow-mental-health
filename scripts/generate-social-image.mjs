import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Rebuild the static share card from supplied brand assets; no remote resources.
const root = new URL('../', import.meta.url);
const data = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, root))).toString('base64')}`;
const [tree, inter, fraunces] = await Promise.all([
  data('public/willow-mark.webp', 'image/webp'),
  data('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'font/woff2'),
  data('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'font/woff2'),
]);
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE_PATH });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:Inter;src:url('${inter}')}@font-face{font-family:Fraunces;src:url('${fraunces}')}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#faf8f1;color:#22355c;font-family:Inter,sans-serif;border-bottom:14px solid #d9a441;display:flex;align-items:center;padding:64px;gap:56px}
    .copy{width:690px}.brand{font:600 43px Fraunces,serif;line-height:1.15}.brand small{display:block;font:500 14px Inter,sans-serif;letter-spacing:5px;margin-top:12px}
    h1{font:600 62px/1.12 Fraunces,serif;margin:55px 0 22px;letter-spacing:-1.5px}p{font-size:25px;line-height:1.5;margin:0;color:#5b6b82}.location{font-size:18px;margin-top:30px;color:#4a6fa5}
    .art{width:310px;height:380px;display:flex;align-items:center;justify-content:center}.art img{width:290px;height:335px;object-fit:contain;mix-blend-mode:multiply}
  </style></head><body><div class="copy"><div class="brand">Blue Willow<small>MENTAL HEALTH</small></div><h1>Is it ADHD?<br>Get a clear answer.</h1><p>Assessments for teens &amp; adults.<br>Telehealth across Kentucky.</p><p class="location">Louisville roots. Kentucky reach.</p></div><div class="art"><img src="${tree}" alt=""></div></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await page.screenshot({ path: fileURLToPath(new URL('public/social-preview.png', root)) });
} finally { await browser.close(); }
