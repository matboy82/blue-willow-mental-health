# Blue Willow Mental Health — Website

**Client:** Jody Elbert, Blue Willow Mental Health (St. Matthews, Louisville KY) — ADHD-focused, telehealth only, cash pay ($225 intake / $100 follow-up).
**Status:** PRD approved 2026-10-03. Pre-build.

## What this is
The public website for Blue Willow Mental Health: a focused ADHD practice site that converts searchers into booked assessments. Positioning: *the focused ADHD specialist for Louisville — clear answers, honest prices, no games.*

## Stack (per PRD)
- **Astro 7.x** (pinned) + TypeScript, static output — no UI framework needed.
- **Hosting:** Cloudflare Pages (BIS-owned account).
- **Domain:** bluewillowmentalhealth.com stays registered at **Squarespace**; DNS pointed to Cloudflare Pages.
- **Scheduling/payments/clinical:** SimplePractice (Jody's system of record) — [online booking](https://jo-elbert.clientsecure.me/) + [contact widget](https://jo-elbert.clientsecure.me/contact-widget).
- **Contact path:** prefer SimplePractice's native contact widget; optional Cloudflare Worker `POST /contact` (forward-only, no storage).

## Repo layout
- `docs/PRD.md` — approved PRD (8 workstreams, SDD gates).
- `docs/brand-direction.md` — brand & design direction (palette, type, voice, homepage blueprint).
- `design/homepage-mockup.html` — approved homepage mockup (open in a browser to review).
- `PLACEHOLDERS.md` — third-party/account placeholders with owners + unblock conditions.

## Standing rules
- **HIPAA:** Jody is fully licensed and registered. No PHI in this repo, in CI logs, in analytics, or in chat. Site forms collect contact info only — clinical intake lives in SimplePractice.
- **Brand:** Jody's name stays off the brand — it's Blue Willow Mental Health, not a personal brand.
- **Canonical shared cognition:** BIS-Vault `10-Projects/Active/Blue Willow Mental Health/` (client record, plan, pricing analysis).
