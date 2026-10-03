---
type: prd
status: approved
build: v1-demo-live
owner: Matt
created: 2026-10-02
updated: 2026-10-03
tags: [prd, blue-willow-mental-health, web-build, sdd]
related: [["Discovery Call Notes 2026-10-02"], ["Brand & Design Direction 2026-10-02"], ["Plan 2026-10-03"], ["Pricing Analysis 2026-10-02"]]
repo: https://github.com/matboy82/blue-willow-mental-health
---

# PRD: Blue Willow Mental Health — Website Build

> **Status: APPROVED 2026-10-03 by Matt · v1 BUILT, DEMO LIVE 2026-10-03.** Built from the discovery call notes, brand & design direction, and pricing analysis; structured for systematic build under the BIS AI-First Development System (spec → implementation → QA → code review → adversarial review → stakeholder review → release authorization → production verification).
>
> **Commercial:** $200 deposit received; $100/mo retainer (family discount); step-up **DECIDED 2026-10-03: 10% of site-driven monthly revenue at each gate** (≈$425/mo at 10 customers, ≈$1,063/mo at 25 staged intakes) — needs Jody's written confirmation per proposal terms. **Client:** Jody Elbert, Blue Willow Mental Health (St. Matthews, Louisville KY) — ADHD-focused, telehealth only, cash pay. Contact: 859-208-7100 · jo@bluewillowmentalhealth.com.
>
> **Repo:** https://github.com/matboy82/blue-willow-mental-health — v1 implemented (Astro 7.3.5 static, pushed `ac58ada4` by Matt 2026-10-03); test deployment live at https://blue-willow-mental-health.pages.dev (verified 2026-10-03, matches the approved mockup; SimplePractice booking links working).
>
> **Still pending:** production cutover (custom domain + `PUBLIC_SITE_ENV=production` + Squarespace DNS, needs Matt's release authorization); SimplePractice Online Booking config (`/request` was erroring — availability + bookable appointment types); GBP verification (address submitted 2026-10-03); Instagram verification/linking; Jody's proposal response (valid to 2026-11-03) + clinical copy sign-off.
>
> **Retired arch decision:** the contact path is now native SimplePractice pages via branded site buttons (Matt approved "Essential with secure links" 2026-10-03) — no embedded booking widget, no Cloudflare Worker contact form. The Worker bullet in §4 below is retired.

## 1. Background & Problem

Blue Willow Mental Health is a focused ADHD practice — adolescents to adults, telehealth across Kentucky, cash pay ($225 intake / $100 follow-up). The clinical offering is strong: objective computer-based screening plus a 60–90 minute specialist review, positioned for self-directed searchers (parents Googling at 10pm; adults failed by antidepressants seeking a real consult).

The front of the business is currently a Squarespace "under construction" parking page. There is no way to learn about the practice, no pricing, no booking path, no SEO presence. Every prospective client who finds the domain bounces. Meanwhile Jody manually checks for new inquiries daily — toil that automation should kill.

The system we build must: present the practice as the credible mid-market specialist (not cheap, not luxury), convert searchers with transparent pricing and a frictionless booking path, embed SimplePractice scheduling, notify Jody instantly of new inquiries, handle everything HIPAA-consciously, and run without babysitting on BIS-owned infrastructure.

**Positioning (from the brand direction):** *The focused ADHD specialist for Louisville — clear answers, honest prices, no games.*

## 2. Goals & Success Metrics

- **G1 — Live credible site:** bluewillowmentalhealth.com replaced with the real site; Jody approves the design (stakeholder review).
- **G2 — Booking works end-to-end:** visitor → SimplePractice booking widget → confirmed appointment; contact form → Jody notified within minutes. Zero daily manual checking.
- **G3 — SEO baseline:** indexed, `MedicalClinic`/`Physician` + FAQ schema valid, sitemap/robots/canonicals, Google Business Profile live and linked.
- **G4 — HIPAA-clean:** no PHI in the repo, analytics, logs, or notifications; contact forms collect contact info only; adversarial privacy review passes.
- **G5 — Performance:** Lighthouse ≥ 90 across categories on mobile; LCP < 2.5s.
- **G6 — Zero babysitting:** static-first build on Cloudflare Pages; no servers to tend, no WordPress to patch.

## 3. Users & Stakeholders

- **Prospective clients (two segments):** parents of adolescents (school struggles, want fast answers) and self-directed adults 25–45 (post-antidepressant, want a specialist consult + med change). Both are educated comparison-shoppers who found the site via search.
- **Jody Elbert (client/stakeholder):** approves design and copy; receives booking + inquiry notifications; pays the retainer. Her name stays off the brand (her rule).
- **Matt / BIS (builder/owner of infra):** owns the repo, hosting, DNS plan, and analytics. Holds Squarespace, SimplePractice, and Google Workspace access.
- **Future clinicians:** the setup must not assume a single provider (others may join if it gets busy).

## 4. System Architecture (target)

- **Frontend:** Astro 7.x (pinned), TypeScript, **static output**. No UI framework islands needed — this is a content + embed site, deliberately simpler than the Miller build. (Matt's Angular-over-React preference is moot here: no framework required.)
- **Hosting:** Cloudflare Pages on the **BIS-owned account** — same shape as the Miller Remodeling site.
- **Domain:** bluewillowmentalhealth.com **stays registered at Squarespace** (Matt has access); DNS records pointed from Squarespace to Cloudflare Pages. No registrar move.
- **Scheduling/payments/clinical:** SimplePractice (Jody's system of record) — Online Booking widget embedded; payments and paperwork stay entirely in SimplePractice.
- **Contact path (DECIDED 2026-10-03 — Worker retired):** native SimplePractice contact/booking pages opened via branded site buttons ("Essential with secure links," Matt-approved). No embedded widget, no custom Worker, no submission storage. Jody gets SimplePractice's native instant notifications; forms collect contact info only.
- **Analytics:** privacy-safe (Plausible or Cloudflare Web Analytics — decided in WS-0 spec); never any PHI in URLs or events; query params stripped.
- **Content:** Markdown content layer with Zod schemas (copy deck lives in the repo, Jody-editable later without code).
- **Secrets:** Worker secrets in Cloudflare secret store; never committed.

## 5. Workstreams

Each workstream is a buildable epic: it enters implementation only after its spec (intent, scope, acceptance criteria, constraints, dependencies, risks) is accepted per the AI-First Development System gate 1.

### WS-0 — Project scaffolding & infrastructure

**Intent:** a clean, BIS-owned foundation everything else builds on.
**Scope:**
- Repo setup (BIS GitHub; recommended: `matboy82/blue-willow-mental-health` — Matt confirms); CI: build, lint, typecheck, `astro check`, Lighthouse CI.
- Astro 7.x pinned + TypeScript, static output; `astro check` in CI.
- Hosting + deploy pipeline on Cloudflare Pages (BIS-owned account).
- **Live test URL from day one** (Miller pattern): Pages-assigned URL first; `test.bluewillowmentalhealth.com` via Squarespace DNS when convenient. `main` → test URL; production cutover is a separate, explicit release decision (WS-7).
- **Placeholder policy** (Miller pattern): where a third-party account or asset doesn't exist yet, ship a clearly-marked placeholder and keep building — never block. Every placeholder registered in `PLACEHOLDERS.md` at the repo root with owner + unblock condition; nothing ships to production with an open placeholder unresolved.
- DNS plan for bluewillowmentalhealth.com (registrar: Squarespace — Matt has access); cutover runbook; low-TTL plan.
- Analytics decision (Plausible vs. Cloudflare Web Analytics) + privacy configuration (no PHI in URLs, IP anonymization).
- Secrets management (Worker notification credentials in Cloudflare secret store; never committed).
- ADR: frontend stack + hosting + HIPAA posture, locked before WS-1.
**Acceptance:** repo builds via one command; empty site live on the test URL via CI; preview deploys per push; `PLACEHOLDERS.md` exists; DNS cutover runbook reviewed; analytics choice documented with privacy config.
**Constraints:** no WordPress; no committed secrets; no PHI anywhere in the repo or CI logs.
**Dependencies:** Cloudflare BIS-owned account (exists per Miller build — confirm); Squarespace DNS access (have).
**Risks:** DNS cutover downtime — mitigate with low-TTL + runbook + off-hours cutover.

### WS-1 — Design system implementation

**Intent:** the brand direction as code — tokens, type, and components the whole site is built from.
**Scope:**
- Design tokens from `Brand & Design Direction 2026-10-02`: Willow Ink `#22355C`, Willow Blue `#4A6FA5`, Powder `#B4C5DB`, Cream `#FAF8F1`, Amber `#D9A441`, Ink text `#1F2A3D` (sampled against the actual logo mark).
- Logo integration: tree mark (from the Facebook page file, cropped) + "Blue Willow / Mental Health" wordmark lockup; favicon + social/OG image derived from the mark.
- Typography: Fraunces (display) + Inter (body) via Google Fonts, with system fallbacks.
- Component library: header/nav, hero, trust strip, steps, cards, pricing cards, FAQ accordion, CTA bands, footer — mobile-first, WCAG 2.1 AA.
- Voice: direct, warm, plain-spoken per the brand direction; copy deck as Markdown content with Zod schemas.
**Acceptance:** token set renders in a styleguide page on the test URL; logo lockup approved by Matt; Lighthouse a11y ≥ 90; components responsive at 360px.
**Constraints:** Jody's name appears nowhere (brand rule); no stock-photo clichés (head-in-hands etc.).
**Dependencies:** WS-0; logo file (have).
**Risks:** logo file arrived cropped ("Bl" text sliver) — using the tree mark only; if Jody supplies the full lockup later, swap it in WS-7.

### WS-2 — Homepage build

**Intent:** the conversion engine — a 10pm Googler becomes a booked assessment.
**Scope:** Build the homepage per the approved blueprint (see `Homepage Mockup 2026-10-02.html`):
1. Hero: "Is it ADHD? Get a clear answer." + sub + dual CTA (Book / How it works) + micro-trust line.
2. Trust strip: licensed specialist · transparent pricing · telehealth statewide · objective screening.
3. How it works: 3 steps (book → screener → 60–90 min review).
4. Who it's for: parents card / adults card.
5. Pricing: $225 intake / $100 follow-up cards + $1,500–$3,500 anchor line.
6. FAQ accordion (6 questions from the mockup).
7. About the practice (no personal name).
8. Final CTA band + booking anchor; footer with HIPAA note + service area.
**Acceptance:** matches the approved mockup; all CTAs scroll to / open the booking embed; copy approved by Matt (stakeholder review); LCP < 2.5s on mobile.
**Constraints:** no health-detail collection anywhere on the page (HIPAA — contact info only, clinical intake lives in SimplePractice).
**Dependencies:** WS-1; SimplePractice booking widget snippet (Matt has SimplePractice access).
**Risks:** SimplePractice embed styling conflicts — mitigate with a sandboxed embed section + fallback link ("Book on our secure portal").

### WS-3 — Content pages

**Intent:** depth for SEO and for buyers who need more than the homepage.
**Scope:**
- Pages: How it works (expanded), Pricing, FAQ (expanded), About the practice, Contact, Privacy notice.
- Adolescent + adult audience pages ("ADHD assessment for teens", "ADHD assessment for adults") targeting "ADHD testing Louisville" / "ADHD assessment St. Matthews" / "telehealth ADHD Kentucky".
- Copy deck finalized with Jody's clinical scope (prescribing, age range, what happens if it isn't ADHD).
**Acceptance:** every page renders with valid schema; internal linking complete; copy approved.
**Constraints:** clinical claims stay inside Jody's license and approved wording; no personal name.
**Dependencies:** WS-1, WS-2.

### WS-4 — Booking + contact integration

**Intent:** the funnel actually works — booking converts, inquiries reach Jody instantly.
**Scope:**
- SimplePractice Online Booking page: **https://jo-elbert.clientsecure.me/** (verified live 2026-10-03 — "I'm a New Client / I'm an Existing Client" + Video Office). Managed in SimplePractice under **Settings → Online Booking** (booking link + widget embed code live there).
- SimplePractice contact widget: **https://jo-elbert.clientsecure.me/contact-widget** — native SimplePractice contact path; prefer this over a custom Worker form where it fits, since inquiries stay entirely in her HIPAA-covered system.
- Homepage + contact page embed the Online Booking widget, with graceful fallback link to the booking page.
- If a custom contact form is still wanted (design control), Cloudflare Worker `POST /contact` → validates (honeypot + rate limit) → emails Jody via her Google Workspace → optional SMS ping.
- Instant notifications kill the daily manual check: Jody gets pinged the moment an inquiry lands.
- Idempotency on double-submit; no submission storage on the custom path (forward-only).
**Acceptance:** end-to-end test: booking page loads from the site embed and a test booking flows; contact path → Jody receives it < 2 min; double-submit sends one notification; spam probe blocked; no PHI in Worker logs (adversarial check).
**Constraints:** HIPAA-conscious by construction — prefer the native SimplePractice contact widget (inquiries never leave her covered system); if the custom Worker path is used: no database, minimum-necessary fields, TLS; BAA coverage verified for the email path (Google Workspace BAA status confirmed with Jody).
**Dependencies:** WS-0 (Worker infra), WS-2; Jody's notification email/phone; SimplePractice Online Booking settings (Matt has access).
**Risks:** SimplePractice widget changes — mitigate with the fallback booking link always present.

### WS-5 — SEO / AI-citation readiness

**Intent:** the people actively searching actually find her.
**Scope:**
- `MedicalClinic` + `Physician` + `FAQPage` schema, sitemap, robots, canonicals.
- Google Business Profile: claim/create (St. Matthews, Louisville KY; telehealth attributes), linked from the site; review strategy noted for Jody.
- Psychology Today profile cross-linked; NAP (name/address/phone) consistency across site, GBP, Psychology Today, Facebook.
- AI-citation basics: clear entity description ("Blue Willow Mental Health is a telehealth ADHD practice in Louisville, Kentucky…"), FAQ content phrased as direct answers.
**Acceptance:** Rich Results test passes on schema; site indexed; GBP live; NAP consistent across the four surfaces.
**Constraints:** no misleading claims; service-area honesty (telehealth statewide, rooted in St. Matthews/Louisville).
**Dependencies:** WS-2, WS-3; GBP access (Matt's Workspace account).

### WS-6 — HIPAA & privacy hardening

**Intent:** prove the build is PHI-safe before it touches production.
**Scope:**
- Audit: no PHI in repo, CI logs, analytics, Worker logs, emails beyond minimum necessary; forms collect contact info only.
- Analytics privacy config verified (no query-param capture, IP anonymization, no cross-site leakage).
- Third-party inventory with BAA status: SimplePractice (covered), Google Workspace (confirm BAA), Cloudflare (Worker processes-but-doesn't-store — documented).
- Privacy notice page published; footer HIPAA note.
- **Explicit adversarial review:** attempted PHI injection via contact form, log inspection, analytics payload inspection.
**Acceptance:** adversarial review passes; privacy notice live; BAA statuses documented in the repo (not the vault — no client data).
**Constraints:** if any processor can't be confirmed HIPAA-appropriate, it doesn't touch the inquiry path.
**Dependencies:** WS-4; Jody confirms Workspace BAA.

### WS-7 — Launch QA, cutover, handover

**Intent:** a boring, verified launch.
**Scope:**
- Full QA pass against all WS acceptance criteria; Lighthouse ≥ 90 all categories on mobile.
- Production verification: real booking-widget load + test contact end-to-end on the live domain (then delete test artifacts).
- DNS cutover per the WS-0 runbook (off-hours, low TTL); Squarespace parking page retired.
- Handover doc for Jody: how booking notifications work, where to update copy, who to call when something breaks (Matt, $100/mo).
- Retainer-gate tracking note: 10-customer and 25-intake gates per the deal.
**Acceptance:** site live on bluewillowmentalhealth.com; verification tests pass on production; handover delivered; Matt authorizes release.
**Constraints:** no launch with open placeholders; stakeholder (Matt) sign-off required.
**Dependencies:** all prior WS; Matt's release authorization.

## 6. Non-functional requirements

- **Performance:** Lighthouse ≥ 90 (perf, a11y, SEO, best practices); LCP < 2.5s on mobile; no render-blocking third-party bloat; SimplePractice embed lazy-loaded below the fold.
- **Security:** OWASP basics — validated inputs, rate limits, secrets in secret store, HTTPS everywhere, security headers; no PHI in logs.
- **Privacy (HIPAA-conscious):** minimum-necessary collection; forward-only contact path (no storage); BAA statuses documented; analytics PHI-free.
- **Accessibility:** WCAG 2.1 AA.
- **Maintainability:** typed codebase, ADRs, CI on every push; copy deck editable without code (Jody-touchable later).
- **Reliability:** static-first — no servers to babysit; Cloudflare Pages + one tiny Worker.

## 7. Out of scope

- The SimplePractice configuration itself (Jody's system; we embed, we don't rebuild).
- The "Kid Level" screener integration (her clinical tooling; the site links/describes, doesn't host).
- Paid ads management; ongoing SEO retainer (baseline + structure only).
- Patient portal, telehealth video, or any clinical system — all SimplePractice.
- Native mobile app.
- Multi-clinician scheduling logic (keep the setup ready, don't build it now).

## 8. Open decisions (for Matt)

1. **Builder:** who builds it — Codex (as with Miller), Matt, or another route?
2. ~~**Repo:**~~ confirmed 2026-10-03: `matboy82/blue-willow-mental-health`.
3. **Timeline:** Phase 1 build timing (the draft plan's open decision #3).
4. **Retainer % bumps** at the 10-customer and 25-intake gates (from the deal terms).
5. **Analytics:** Plausible vs. Cloudflare Web Analytics (WS-0 spec decides; don't stall on it).
6. **SMS notifications** for new inquiries — want it, or email only?
7. **Full logo lockup:** the file arrived cropped; ask Jody for the complete file or proceed with the tree mark (recommended: proceed, swap later).

## 9. Build order & milestones

### Pre-flight (before WS-0)
- [x] **Logo file:** tree mark secured 2026-10-02 (cropped; full lockup pending — non-blocking).
- [x] **Access:** Squarespace, SimplePractice, Google Workspace account for Matt.
- [ ] **Cloudflare:** confirm the BIS-owned account from the Miller build is available for a second site.
- [x] **Repo:** `matboy82/blue-willow-mental-health` — created 2026-10-03, seeded with PRD + brand direction + mockup.
- [ ] **Builder:** Matt decides who builds.
- [x] **SimplePractice booking + contact URLs** in hand (verified 2026-10-03): booking page https://jo-elbert.clientsecure.me/ · contact widget https://jo-elbert.clientsecure.me/contact-widget. Widget embed code: pull from Settings → Online Booking.
- [ ] **Copy sign-off inputs:** Jody confirms clinical-scope wording (prescribing, age range).

```text
M0  WS-0 scaffolding + infra: repo, CI, test URL live, DNS runbook, analytics decision
M1  WS-1 design system + WS-2 homepage ................. → stakeholder review (Matt)
M2  WS-3 content pages + WS-4 booking/contact .......... → end-to-end funnel test
M3  WS-5 SEO/GBP + WS-6 HIPAA adversarial review ...... → privacy sign-off
M4  WS-7 launch QA, DNS cutover, handover ............. → release authorized
```

## 10. SDD gate mapping

| Gate | How it applies here |
|---|---|
| Spec/Story accepted | Each WS spec (this PRD's WS sections, expanded) accepted before implementation |
| Implementation complete | Against the accepted WS spec; AI-generated code held to human standard |
| QA plan executed | Per-WS QA plan vs. the acceptance criteria above |
| Code review | Correctness, architecture fit, security, no unnecessary complexity |
| Adversarial review | WS-4 (contact/PII path) and WS-6 (PHI audit) get explicit adversarial passes |
| Stakeholder review | Matt signs off: design system + homepage (M1), funnel (M2); Jody approves clinical copy; silence ≠ approval |
| Release authorized | DNS cutover is an explicit Matt decision |
| Production verification | Real booking-widget load + test contact on the live domain; not "pipeline was green" |
| Preserve knowledge | ADRs, runbooks, and this PRD updated with as-built notes |
