# Blue Willow Mental Health

The public website for a focused telehealth ADHD practice rooted in St. Matthews, Louisville, serving Kentucky. Built from docs/PRD.md, docs/brand-direction.md, and the approved design/homepage-mockup.html.

## Run locally

Requires Node 22.12+ and npm. Astro 7.3.5 is pinned; commit the lockfile with changes.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:4322. `npm run verify` runs type checks, builds dist, and verifies routes, links, metadata, and privacy defaults. `npm run preview` serves built output. Browser checks: `npx playwright install chromium`, then `npx playwright test`. `npx lhci autorun` audits mobile Lighthouse thresholds (use a production-mode build for SEO; previews intentionally block indexing).

In restricted environments set ASTRO_TELEMETRY_DISABLED=1. CI does this automatically. Existing local browsers can be selected via BROWSER_EXECUTABLE_PATH for Playwright and CHROME_PATH for Lighthouse.

## Build and integration status

Implemented: homepage, process, pricing, FAQ, about, contact, privacy, teen/adult audience pages, styleguide, custom 404, self-hosted fonts, supplied tree mark, favicon, structured data, sitemap, security headers, and CI.

Booking and contact open the native secure SimplePractice pages using branded site buttons. Matt approved keeping Essential with secure links on October 3, 2026. No external widgets or forms load on the website. No patient data backend, custom contact Worker, analytics, or marketing trackers are included.

**Test deployment live:** https://blue-willow-mental-health.pages.dev (verified 2026-10-03 — matches the approved mockup; SimplePractice booking links working). **Production cutover pending:** custom domain + `PUBLIC_SITE_ENV=production` + Squarespace DNS + Matt's release authorization. Preview builds stay noindex; production enables indexing.

**Start with [docs/SETUP.md](docs/SETUP.md)** for Cloudflare Pages configuration, Squarespace/Cloudflare DNS migration, SimplePractice widget and notifications, search integrations, privacy review, launch checklist, and rollback.

## Editing

- Informational copy: src/content/pages/*.md (validated by Zod).
- Homepage: src/pages/index.astro.
- Shared FAQs and practice URLs: src/lib/practice.ts.
- Pricing cards: src/components/Pricing.astro; keep amounts in Markdown/homepage/schema in sync.
- Retired widget slot: src/components/simplepractice-booking.html (not rendered).
- Shared design: src/styles/global.css; approved blue/amber tokens follow the mockup and PRD.

See [PLACEHOLDERS.md](PLACEHOLDERS.md), [architecture decisions](docs/ADR-001-static-site.md), and [QA results](docs/QA.md).

Standing rules: no patient data or credentials in code, logs, analytics, or chat; clinical intake stays in SimplePractice. The practice brand does not use a personal provider name. Domain registration stays at Squarespace; the apex Pages domain requires Cloudflare DNS nameservers. The PRD's production cutover requires Matt's authorization and clinical copy approval.
