# Performance pass — October 5, 2026

Deployed implementation: `4240511` on Cloudflare Pages.

## Production measurement

Audited `https://www.bluewillowmentalhealth.com/` before and after deployment using the same Lighthouse mobile defaults and Chrome executable on the same machine. These are individual lab runs, not field-user percentiles.

| Metric | Before | After |
| --- | --- | --- |
| Performance score | 93 | 99 |
| First contentful paint | 2.19 s | 1.09 s |
| Largest contentful paint | 2.64 s | 1.87 s |
| Speed index | 3.79 s | 3.13 s |
| Cumulative layout shift | 0.037 | 0 |
| Transferred page resources | 205 KiB | 133 KiB |
| Accessibility / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

A separate unthrottled live browser check after deployment measured 744 ms first contentful paint on its first mobile visit and 128 ms on a repeat visit. Font and image transfers were zero on the repeat visit. The reported 3.6-second warm first paint was not reproduced here; DNS, redirects, browser overhead, and network conditions can affect other measurements.

## Changes

- Two self-hosted variable WOFF2 files replace seven per-weight font files, preserving Inter and Fraunces and all existing CSS weights.
- Font preloads begin both downloads in the HTML head; `font-display: swap` keeps fallback text visible during loading.
- Astro builds appropriately sized WebP images for the header, mobile artwork, and larger artwork from the original source image.
- Generated images use content-hashed `/_astro/` URLs with the existing immutable cache policy.
- Desktop-only artwork preloading prioritizes the hero when it is visible beside the heading; mobile font downloads no longer compete with that image preload.

## Verification

- Production Astro check/build and all six static checks passed.
- All five Playwright tests passed, covering desktop/mobile accessibility, navigation, secure links, two-font loading, valid responsive image assets, and fallback text when font requests fail.
- Local Lighthouse assertions passed: all four categories scored 100.
- Production returned `index, follow`, loaded the expected fonts, and passed desktop/mobile visual inspection.

Raw Lighthouse reports and screenshots are retained under ignored `qa/performance-*` files. Reproduce the live audit with:

```powershell
# Set CHROME_PATH to an installed Chrome or Playwright Chromium executable.
node node_modules/lighthouse/cli/index.js https://www.bluewillowmentalhealth.com/ --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=qa/performance-live.json --quiet
```
