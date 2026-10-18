# Helpful-content implementation and human review

Prepared October 13, 2026. Local implementation only; no new clinical approval, publication, or compliance certification.

Source: `BIS-Cognition/08-Technology/2026-10-13 Google Helpful-Content and Gen-AI Compliance Spec - BIS and Blue Willow.md`.

Matt's current instruction: provider publication is **not approved** pending the client; do not edit any visible website content. This supersedes the spec's visible additions for this task. Existing Markdown, homepage prose, FAQs, alt text, titles, descriptions, imagery, and dates stay intact. BIS Part A was handled in a separate task and is not modified here.

## Implemented within that scope

- Non-visible page schema identifies the canonical page, language, title, existing description, and practice publisher. About and contact use their matching page types; informational assessment/process/pricing/FAQ pages use MedicalWebPage. Pages with visible FAQs carry FAQPage on that same entity and use the existing shared answers.
- No Person, invented credential, author, clinician review, citation, or publication/update date is added. The publisher is the practice, not a substitute clinician author.
- Review inventory covers all eleven public routes, including shared FAQ output and booking/contact/privacy metadata. Styleguide and 404 are excluded from editorial publication review.
- The explicit release review command fails until human review and release gates are recorded for the current source. It never writes approvals. Ordinary builds remain available for local review.

## Human pre-publication workflow

1. Run `npm run verify` and inspect built pages. Confirm JSON-LD against visible content; use Google's Rich Results Test for supported rich-result features. MedicalWebPage is descriptive schema, not a promise of a search feature.
2. Run `npm run content:review`. This prints the current sourceSnapshot and outstanding checks. It exits successfully as an inventory command even while review is pending.
3. A human reviews **each route** in `content-review.json`: factual claims (including prices, durations, scope and location), title, description, structured data, image alt text, and clinical scope. The clinician must confirm health claims and license/scope; Matt can review technical and practice facts with supporting evidence. Leave a field false until completed. Prior copy sign-off does not imply sign-off of this revision.
4. Record the named human reviewer(s), completed review date, current sourceSnapshot and completed checks in `content-review.json`. Preserve detailed evidence/approval references below or in the existing practice approval record. Never enter patient information or credentials.
5. Resolve every release gate below. Run `npm run content:release-check`; exit 1 means pending or stale review. A passing result checks the record's completeness, not the truth of claims. Source changes invalidate review, including shared FAQ/schema/metadata, images, styles, app scripts, public headers, functions, build configuration and the review validator. Line-ending conversion does not invalidate review. The JSON review record itself is excluded from the snapshot so recording approval does not invalidate it.
6. Obtain Matt's release authorization and follow the existing deployment runbook. These commands do not deploy or change hosting, and are not automatically wired into CI or Cloudflare publishing.

## Deferred acceptance and gates

| Gate | Evidence required before recording true |
|---|---|
| providerPublication | Client authorizes the public clinician name and resolves the existing no-personal-name rule. Currently explicitly withheld by Matt. |
| providerCredentials | Confirm actual license type/state and responsibility for each informational page; implement authorized bylines and bio. No inferred credentials or false reviewed-by attribution. |
| medicalDisclaimers | Client/Matt authorize and approve plain informational-only disclaimer; implement on informational pages and shared FAQs. Visible change deferred. |
| healthSources | Clinician reviews source mapping below and approves visible source links or specific claim corrections. External sources do not verify the practice's prices, services or credentials. Visible changes deferred. |
| aiDisclosure | Confirm creation process and approve one truthful disclosure at the information entry point. No resources/blog index exists; do not create an SEO page just to house disclosure. Do not claim human review before it occurs. Visible change deferred. |
| imageProvenance | Practice confirms origin of all imagery. For confirmed AI images, embed IPTC/XMP DigitalSourceType `http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` in delivered images, including generated WebP derivatives, and inspect the final files. Do not label supplied imagery as AI based on appearance. |
| testimonialPermissions | Confirm there are no patient testimonials, or verify genuine feedback and explicit permission for each. The directory badge is not patient feedback. No reviews added. |
| honestDates | Confirm no silent re-dating; no article dates or sitemap lastmod are generated here. A future substantive update needs an approved change note and an actual date, not build time. Footer copyright year is not an article freshness date. |
| clientApproval | Client/clinician approves the final clinical content, attribution, image provenance and practice facts for this source snapshot. |
| mattReleaseApproval | Matt authorizes shipping the reviewed snapshot. Local review request is not deployment permission. |

## Health-claim evidence prepared for clinician review

Sources retrieved October 13, 2026. This mapping is preparation, not a completed human fact-check. No visible source text or links were added to the website.

| Existing claim / location | Evidence and limit |
|---|---|
| Screening alone is not a diagnosis; history and clinical assessment matter. Shared FAQ, how-it-works, Louisville and teen pages. | [CDC: Diagnosing ADHD](https://www.cdc.gov/adhd/diagnosis/index.html) explains multiple diagnostic steps, no single diagnostic test, and similar symptoms from other conditions. CDC page focuses on children; do not generalize its pediatric criteria to adults. |
| Adult assessment considers history/current concerns; focus, organization and daily responsibilities can be difficult. Adult page and homepage. | [NIMH: ADHD in Adults: 4 Things to Know](https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know) describes symptoms, clinical interviews, history and evaluation of alternative diagnoses. It does not validate the practice's unnamed screening product or assessment completeness. |
| Teen difficulties with school/routines do not establish ADHD; assessment may consider other explanations. Teen page and homepage. | CDC diagnostic guidance above supports the need for assessment and considering other causes. Clinician must confirm the practice's actual assessment protocol. |
| $225 initial / $100 follow-up, 60–90 minutes, cash pay, Kentucky telehealth, license and service scope. All commercial pages, shared components and schema. | Approved local practice copy and October 3 owner confirmations in PRD/PLACEHOLDERS/FUNNEL-OPERATIONS are historical evidence; re-confirm with the practice before release. CDC/NIMH do not substantiate these business claims. |
| Focused assessment differs from comprehensive neuropsychological evaluation; school/work documentation fit is conditional. Pricing and Louisville pages. | Specific service boundary requires clinician confirmation. No independent source for this practice-specific claim was established; leave clinicalScope pending. |
| Homepage headline “Get a clear answer,” “objective screening,” “specialist” and “licensed psychiatric provider.” | Clinician must confirm these are supportable and do not imply a guaranteed outcome or invented qualification. Preserved per Matt's instruction; no claim correction authorized. |

## Image and alt-text inventory

| Asset/use | Existing description | Review status |
|---|---|---|
| `src/assets/willow-mark.jpg` and four Astro-generated WebP sizes | Hero: “A blue willow tree with long, flowing branches.” Logo/about artwork use empty alt with adjacent brand text/decorative treatment. | Supplied tree mark per PRD; descriptive/non-stuffed wording observed. Human accuracy and origin confirmation pending. |
| `public/willow-mark.jpg`, `willow-mark.webp`, `willow-mark-q75.webp` | Open Graph image description: “Blue Willow tree mark.” Retained public variants. | Same provenance gap; no AI-generation assumption or metadata added. |
| `public/psychology-today-verified.svg` | TrustRow uses the existing directory verification description. | Badge/profile verification recorded October 8; practice revalidation pending. This is not a provider headshot or patient review. |
| `public/favicon.svg` | Browser favicon; no inline content alt required. | Brand artwork provenance included in image gate. |

Google's [generative-AI guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) calls for manual review of generated content and metadata. Its explicit IPTC mandate describes Merchant Center images; the supplied spec independently adopts tagging confirmed AI imagery for this site. [Helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) supports honest authorship, creation context and dates. No Google certification or ranking guarantee is implied.

## Human review evidence / approvals

Pending. Record reviewer, approval reference, date and exact sourceSnapshot here when supplied. Do not fabricate approvals or mark deferred visible requirements complete.

## Local verification — October 13, 2026

- `npm run verify`: Astro check completed with zero diagnostics; static build generated thirteen HTML pages; all twelve Node tests passed.
- All thirteen built HTML pages match the pre-change build byte-for-byte after removing JSON-LD script blocks. Visible HTML, title/meta wording, styles, asset references and navigation are preserved.
- Review validation tests cover missing/incomplete/stale review, unapproved provider publication, missing reviewer, invalid/future dates and content/image changes invalidating the snapshot.
- `npm run content:release-check` returns exit 1 as expected because approvals remain pending. No human review fields were marked complete.
- No commits, pushes, deployment or edits to the BIS website checkout. JEV advisory audit records remain uncommitted in BIS-Cognition under Matt's no-commit instruction; no human labels added.
