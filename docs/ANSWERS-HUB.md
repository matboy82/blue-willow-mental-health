# Answers Hub — implementation and publication checks

Implemented locally October 19, 2026 from `2026-10-19 Blue Willow Codex Spec - Answers Hub Build.md` and the canonical `BIS-Cognition/10-Projects/Completed/Blue Willow Mental Health/2026-10-19 Blue Willow Answers Hub - Approved Copy.md`. The unrelated local draft is not a content source.

The `answers` collection in `src/content/answers/` supplies twelve static pages through `src/pages/answers/[slug].astro`. The index lists them in supplied order with the first sentence of each approved answer. All direct-answer paragraphs, body wording, lists and booking paragraphs come from the approved copy; Markdown emphasis is removed only from the direct answer so it is plain text. Section headings use H2 beneath the question H1. Concise metadata titles are navigation labels; descriptions use the complete approved direct answer. Some descriptions exceed customary snippet lengths, and some supplied answers fall outside the brief's 40–60-word target. No healthcare wording was invented or padded to meet a length target.

Each answer has its own single-question FAQPage/MedicalWebPage entity, canonical, breadcrumb with BreadcrumbList schema, approved booking CTA and exact shared disclaimer. Astro's existing sitemap includes the index and twelve routes automatically. No browser JavaScript or security header changes were added. Homepage and booking-page additions link to the hub without rewriting their existing copy or changing their booking flow.

## Publication remains pending

The build is for review. Follow the existing `docs/CONTENT-REVIEW.md` release process; all thirteen new routes are included in its inventory. No human review fields or release gates have been marked approved by this implementation.

- Resolve the source conflict between the no-personal-name rule and the required responsible-provider byline. Supply the authorized provider name, verified credentials and bio link. The template contains an internal comment at the insertion point; it does not display a fabricated author or a public placeholder.
- Confirm screening, history review, discussion and plan match the current clinical workflow.
- Reconfirm $225 initial / $100 follow-up, cash pay, 60–90 minutes, Kentucky telehealth and the supplied `/request` booking destination. Existing booking destinations remain unchanged.
- The wait-time page intentionally uses the approved current-availability wording; no one-week or two-week promise was added.
- Complete human review and Matt's release authorization before publishing. Approved copy is not a completed release review.

## Verification

Run `npm run verify`, then `npx playwright test`. Run `npm run content:review` to see the current snapshot and unresolved human checks; `npm run content:release-check` must remain unsuccessful until those checks are completed by the responsible human.

The Answers Hub tests validate generated routes, canonical/metadata, visible approved answers matching FAQ schema, breadcrumb schema, disclaimers, CTA links, sitemap coverage and release inventory. Google's Rich Results Test is a separate external check of supported features, not clinical approval or a guarantee of a rich result.

### Results — October 19, 2026

- `PUBLIC_SITE_ENV=production npm run verify`: zero Astro errors/warnings/hints; 27 HTML pages built, including all thirteen new routes; all fifteen Node tests passed. The earlier preview build also passed Astro check/build and all fifteen Node tests.
- Production-mode `npx playwright test`: all eight tests passed. Accessibility/overflow checks cover 1440px and 360px for the hub and adult, cost and preparation answers, alongside all existing public pages. The first preview-mode browser run passed layout/accessibility checks but failed three production-only analytics expectations; rebuilding with the CI production setting resolved those failures without code changes.
- Independent comparison against the canonical source verified every question, direct answer and complete body across all twelve content files. All fourteen pre-existing HTML pages retain their visible wording after removing only the two requested additive hub sections. `public/_headers` is unchanged and matches the built copy.
- `npm run content:release-check` exits 1 as expected: human checks and release gates are still pending.
- Google's Rich Results Test, code input, checked the adult-process and cost pages. [Adult result](https://search.google.com/test/rich-results/result?id=J9dteG9ja1zDV9yrPTl4CA) detected valid Breadcrumbs, Local businesses and Organization, with the expected preview noindex availability warning. [Cost result](https://search.google.com/test/rich-results/result?id=0YKBWwNC8HHMYxnpd3WqIQ), using production-mode output, reported three valid items. Both surfaced the inherited practice schema's optional missing `address` and `image` fields. Google did not list FAQ as a rich-result feature; all twelve FAQPage payloads are separately parsed and compared to the visible questions/answers by the local tests. No live URL publication or indexing was tested.
- Desktop preview saved in `qa/answers-hub-desktop.png`; command logs in `qa/answers-verify.log` and `qa/answers-playwright.log` (generated, ignored files).
