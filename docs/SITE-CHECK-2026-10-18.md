# Website check — October 18, 2026

Checked the deployed site at https://www.bluewillowmentalhealth.com, both bare-domain schemes, 11 public pages, the styleguide, missing-page handling, page assets, and all distinct external website destinations. Also inspected tracked local source and ran `npm run verify`. This is an audit; no website content or hosting settings were changed.

## Findings

| Check | Result | Evidence |
| --- | --- | --- |
| Exposed API keys | No common secret patterns found within inspected material | Scanned tracked source and fetched public HTML/JavaScript. `/.env`, `/.git/config`, and `/package.json` return 404. The Cloudflare beacon's public site identifier is present as expected; it is not an account API credential. This is not an exhaustive secret/history or infrastructure audit. |
| HTTPS | Main site passes; bare-domain forwarding needs correction | `https://www...` returns 200 with `Strict-Transport-Security: max-age=31536000`. HTTP www upgrades to HTTPS. However, HTTPS bare domain returns 301 to **HTTP** www, then upgrades again. `/pricing/` is preserved; the bare-domain forward drops its query string. |
| Terms | Missing | `/terms/` and `/terms-of-service/` return 404. No source Terms page or footer Terms link exists. The privacy notice is a separate page. |
| Cookies / banner | Main site has no observed cookies; bare domain is an exception | Clean browser visits to the www pages left the cookie jar empty; tagged visits also showed no document cookies or localStorage. The bare-domain forwarding response sets a `crumb` cookie. No banner is present. Do not describe the whole domain journey as cookie-free while that forwarding remains. This audit does not determine legal consent requirements. |
| Other browser storage | Present and disclosed | A registered tagged visit creates `blue-willow-attribution` in sessionStorage. The privacy notice describes this campaign attribution. No advertising pixels or session recording were found. |
| Favicon | Pass | `/favicon.svg` returns 200 with SVG content type and is linked from the pages. |
| Meta titles / descriptions | Present, unique, descriptive; some titles are long | All 11 public pages have unique titles and descriptions. Homepage title is 85 characters; booking 73; audience/location titles 66–68. These may truncate in results. Descriptions range from 117 to 160 characters. |
| Social preview | Exists; presentation could improve | All pages declare an HTTPS `og:image` resolving to `/willow-mark.jpg` (200, JPEG, 440 × 508). OG title, description, URL, type and image alt exist. The portrait tree mark is the shared preview, rather than a dedicated landscape branded card. No Twitter-specific card metadata was found; actual platform rendering was not tested. |
| Sitemap / robots | Pass on deployment | Both sitemap files return valid XML and contain all 11 public www HTTPS URLs, excluding styleguide and 404. robots.txt allows public crawling, excludes styleguide, and references the sitemap index. Public pages use `index, follow` and matching www canonical URLs. |
| Broken links | None found within checked scope | All public destinations linked from the crawled site return 200. SimplePractice booking/contact and Psychology Today profile resolve successfully. Same-page fragment targets exist. Mail and telephone links were inspected, not dialed or sent. No appointment/inquiry was submitted. |
| Images / alt | Pass | All referenced image resources return 200. All rendered images have an alt attribute; informative tree/badge images have descriptive text. Empty alt on the adjacent wordmark's image and decorative repeated tree is appropriate. A lazy image initially reported unloaded, then decoded successfully when loaded; it is not broken. Desktop/mobile screenshots were visually inspected; mobile has no horizontal overflow. |
| Custom 404 | Pass | An arbitrary nonexistent URL returns an actual HTTP 404, branded content, a Return home link, and `noindex, nofollow`. |

## Next work to scope

1. Correct the bare-domain forward to point directly to HTTPS www; recheck path handling and the forwarding cookie. The existing cookie originates in that redirect response, not the Astro site's observed browser code.
2. Prepare a Terms page and footer link with practice-approved wording before publication.
3. Consider shorter long titles and a dedicated landscape social card with explicit card metadata.

Keep the existing approved analytics and public clinical copy intact while addressing these items. This site-check request has not been treated as authorization to publish new legal copy or change registrar/hosting behavior.

## Verification and limitations

- `npm run verify`: Astro check has zero errors/warnings/hints; build succeeds; all 12 Node tests pass.
- Read-only Edge browser crawl and independent HTTP fetches completed October 18, 2026. No failed browser requests were observed in this run.
- Evidence: `qa/site-audit.json`, `qa/site-audit.mjs`, `qa/live-home-desktop.png`, `qa/live-home-mobile.png`, and `qa/live-404.png`. The qa directory is ignored by Git; this report is the durable summary.
- Existing uncommitted source changes were preserved. Local default builds are intentionally previews, use the configured apex fallback, and block indexing. The live production build correctly uses www and allows indexing; do not infer live settings from those local defaults. README/setup notes still contain older launch/canonical guidance.
- No authenticated hosting/registrar configuration, historical Git secret scan, third-party portal storage audit, platform share debugger, or full penetration test was performed.
- BIS advisory review: `jev-codex-74c5164ddb364d3d9938901ccb391ded`; audit-only disposition, awaiting the existing human classification process.

## Authorized fixes — October 18 follow-up

Matt subsequently requested “Fix please.” Website commit `e2d7af81d35bd04a11c26ee478f30998931e6112` was pushed to main and Cloudflare Pages reported a successful deployment.

- `/terms/` now returns 200, with a shared footer link. The new website terms explain general information, secure scheduling, privacy, external services, responsible use, and urgent needs; they do not introduce clinical or payment policies.
- All 12 public routes now have unique titles under 60 characters. Existing headings, descriptions, clinical copy, and analytics behavior were preserved.
- `/social-preview.png` is a supplied-brand 1200 × 630 PNG, verified live with HTTP 200 and `image/png`. Every public page declares it with Open Graph dimensions and Twitter large-image metadata.
- The live sitemap now includes `/terms/`; every public page retains its matching HTTPS www canonical. No public response in the follow-up fetch set cookies.
- The new footer link is underlined. The new Terms page and all existing public routes passed desktop/mobile accessibility and overflow checks after that correction.
- The exact staged release was built and tested separately from existing uncommitted helpful-content work: zero Astro errors/warnings/hints, build successful, 10 release Node tests passed. The local working copy's additional existing review checks also passed (13 tests total before the footer CSS adjustment). Seven existing browser checks passed; the accessibility check passed on rerun after fixing the footer link.
- Bare-domain forwarding remains pending a Squarespace change. The available browser session required sign-in; Matt is logged into another browser and requested instructions. Supplied the official Squarespace steps to edit the existing @ forward, retain permanent redirect/path preservation, and enable SSL/HTTPS if available. No registrar, nameserver, or mail DNS changes were made by Codex. The forwarding `crumb` cookie remains unremediated until separately rechecked.
- Fix implementation advisory review: `jev-codex-52246450c7b34bf9b7455b98b0afcf7c`; no human adjudication was fabricated.
- GitHub Actions run `39171082513` completed successfully, including `npm run verify`, all Playwright browser tests, and Lighthouse CI.

Forwarding reference: [Squarespace — Forwarding a domain](https://support.squarespace.com/hc/en-us/articles/214767107-Forwarding-a-domain). Terms scope reference: [HHS — Notice of Privacy Practices](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/privacy-practices-for-protected-health-information/index.html).
