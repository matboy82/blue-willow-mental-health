# Local verification and release status

Verified October 2, 2026 (America/Denver). This is local build verification, not production verification or a compliance certification.

## Results

- Astro/TypeScript checks: zero errors and zero warnings. Deprecated Astro Zod re-export replaced with a pinned direct Zod import.
- Static build: 11 pages, including nine public content routes, styleguide, and custom 404; sitemap and robots generated.
- Five static checks passed: required output routes, internal links/assets, schema JSON and privacy/search defaults, user-initiated contact frame, preview robots rules.
- Three browser suites passed: accessibility and overflow at 1440px and 360px across all nine public routes; mobile navigation/FAQ/booking anchors; contact frame activation and no-referrer policy using a mocked vendor response.
- Axe WCAG 2 A/AA and 2.1 AA checks found no violations on the tested pages. This automated result does not replace manual or assistive-technology review.
- Desktop/mobile screenshots reviewed. Supplied tree mark, blue/cream palette, amber actions, responsive pricing/cards, navigation, and footer rendered correctly.
- Lighthouse mobile audit of the production-mode static homepage: **performance 96, accessibility 100, best practices 100, SEO 100; LCP 2.207 seconds**. Configured ≥90 category thresholds and <2.5-second LCP assertion passed. Local Chrome and simulated throttling were used; rerun on the deployed site after the real widget is configured.
- Production build/static tests passed. Final local output restored to preview/noindex defaults.
- `git diff --check` passed (line-ending conversion notices only).

Commands: `npm run verify`, `npx playwright test`, `npx lhci autorun`. Browser checks used the existing installed Chromium via BROWSER_EXECUTABLE_PATH; Lighthouse used CHROME_PATH. Generated reports/screenshots are ignored under qa, .lighthouseci, and test-results. CI uses Node 22 and installs Chromium itself.

## Review findings addressed

- Hidden contact-loader button initially stayed visible because button display styling overrode the native hidden state; added an explicit hidden rule and reran the failing browser suite successfully.
- Preserved actual practice facts while removing unsupported wait-time, cancellation, insurance-record privacy, prescribing, and school-documentation promises from the mockup.
- Public pages collect no health or payment data; no storage/API/email forwarding is implemented. Portal links and frames send no referrer, and no analytics or remote font requests are made.
- Official booking snippet is a local trusted-code integration slot; its script is activated only after a visitor requests appointment options. Direct portal fallback is always available. The actual vendor snippet remains an owner input.
- Cloudflare CSP/security headers are present in dist. Header enforcement and the vendor-domain allowlist must be checked on actual Pages hosting.
- Root-domain DNS requirements and telehealth-only Google Business Profile eligibility are corrected in the setup guide.

## Dependency audit limitation

The npm audit at build time reported 16 advisories (13 high, one moderate, two low). The non-dev dependency path reports Astro → http-cache-semantics 4.2.0, with no compatible patched package available from the registry at the check. Other findings primarily concern the Lighthouse audit toolchain. No forced downgrade or unsupported override was applied. The published site consists solely of static files: Astro, its HTTP cache, and Lighthouse do not execute on Pages or in the visitor's browser. Recheck advisories and update build tools as compatible patches become available; do not extend this setup into SSR or clinical processing without a separate review.

## Outstanding live checks

Cloudflare deployment/custom domain/headers, official booking widget, contact framing against the live vendor, real appointment acceptance, inquiry notification latency, duplicate/spam behavior in SimplePractice, email/BAA status, clinical approval, verified external profiles, indexing, and public-domain mail/HTTPS have **not** been verified. See SETUP.md and PLACEHOLDERS.md. No DNS, external account, or production release changes were made.
