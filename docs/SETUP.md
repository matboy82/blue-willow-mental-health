# Cloudflare and integration setup

The site is implemented locally. Matt confirmed supplied clinical/campaign copy is approved on October 3. Native inquiry acknowledgment and source attribution are configured. End-to-end delivery and production hosting still need verification. Matt tests first, then authorizes production and connects the domain. Domain registration stays at Squarespace. See [FUNNEL-OPERATIONS.md](FUNNEL-OPERATIONS.md) for the current channel rollout and Muse handoff; its dated decisions supersede older account setup notes below.

## 1. Review the local site

Requires Node 22.12+ (Node 22 LTS recommended) and npm.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:4322. For a production-output check:

```powershell
npm run verify
npm run preview
```

Copy lives in `src/content/pages/*.md`, shared FAQs/practice URLs in `src/lib/practice.ts`, homepage in `src/pages/index.astro`, and prices in `src/components/Pricing.astro`. Update shared prices and any mentions in Markdown together. Brand colors and layout are in `src/styles/global.css`. `/styleguide/` shows the tokens and shared elements; it is excluded from indexing.

## 2. Connect GitHub to Cloudflare Pages

> **Done 2026-10-03:** working tree pushed by Matt (`ac58ada4`); Pages project connected via Git integration; test deployment live at https://blue-willow-mental-health.pages.dev (verified — matches the approved mockup). Steps 2–5 below are complete; the remaining production cutover is step 6+.
2. ~~In the BIS-owned Cloudflare account, open **Workers & Pages**, create a **Pages** project, and connect the repository.~~ Done.
3. ~~Choose Astro: build command **`npm run build`**, output directory **`dist`**.~~ Done (`NODE_VERSION=22`, `ASTRO_TELEMETRY_DISABLED=1`, `PUBLIC_SITE_ENV=preview`).
4. ~~Deploy and review the assigned `*.pages.dev` URL.~~ Done — live and verified. Pages automatic Web Analytics stays disabled.
5. **Production cutover (needs Matt's release authorization):** add the custom domain under **Pages → Custom domains**; set **`PUBLIC_SITE_ENV=production`** on the production deployment; point Squarespace DNS (apex → Cloudflare per the PRD note that the apex Pages domain requires Cloudflare DNS nameservers — confirm the exact record plan before touching Workspace mail DNS); verify HTTPS, indexing enabled, and sitemap; keep preview deployments on `PUBLIC_SITE_ENV=preview`.

Cloudflare's [Astro Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) describes the deployment flow. The repo includes GitHub CI for type checks, static route/privacy tests, browser accessibility checks, and mobile Lighthouse thresholds. Pages deployment is separate from GitHub CI; only promote a reviewed revision with passing checks.

## 3. SimplePractice: approved Essential setup

Matt chose to keep Essential and use secure links on October 3, 2026. External booking/contact widgets require Plus; no embed code or upgrade is needed for the approved design. The website buttons use Blue Willow's amber/blue styling; the destination forms retain SimplePractice's own interface, which website CSS cannot change.

- Booking/client portal: https://jo-elbert.clientsecure.me/
- Contact: https://jo-elbert.clientsecure.me/contact-widget

### Account settings verified or updated

1. **Settings → Scheduling and inquiries → Client portal permissions:** Client Portal and Online appointment requests are enabled. New clients are allowed. Existing policy is 24-hour notice and a one-week booking horizon; these were preserved.
2. **Settings → Services and products → Services:** Existing intake code 99205 now has the agreed **$225** rate, its existing **60-minute** duration, online requests enabled, and **Allow for New Clients enabled**. Existing follow-up code 99214 now has the agreed **$100** rate, its existing **30-minute** duration, online requests enabled, and new-client requests disabled. Code identities/descriptions and appointment durations were preserved. These are service defaults; existing client-specific fees and historical appointments were not edited.
3. The public new-client flow was checked after the change: it now offers the intake service, Video Office, and selectable appointment times. No appointment was submitted.
4. **Settings → Scheduling and inquiries → Contact form:** Practice contact form is enabled and the supplied contact URL opens the native form. Existing inquiry recipient/routing was preserved.
5. **Settings → Profile → Notification preferences → Scheduling:** Both existing-client and prospective-client appointment-request notifications are enabled. These controls establish configuration, not proof of email delivery.
6. **Settings → Client notifications → Email:** Approved Blue Willow inquiry acknowledgment saved with secure booking/contact links and an unmonitored-address notice. **Settings → Scheduling and inquiries → Contact form:** inquiry confirmation enabled, with native save confirmation.
7. **Settings → Scheduling and inquiries → Prescreener:** Existing referral-source field renamed to "How did you hear about Blue Willow Mental Health?", optional, and published on both contact and new-client requests. Inquiry reason choices now match assessment services. Native public contact rendering verified without a submission.
8. **Settings → Scheduling and inquiries → Calendar:** Scheduling/change notification prompts enabled. Existing cancellation policy preserved. Email reminders remain at 48 hours plus native 10-minute telehealth reminders, subject to client-level settings.
9. Google Calendar remains disconnected. Patient scheduling stays in SimplePractice. A future connection requires the practice's Google Workspace BAA/privacy configuration and explicitly authorized calendar access, including telehealth links. Essential basic sync does not import personal Google events to block booking availability; that advanced capability requires Plus. No upgrade was made.

### What the practice should test before launch

1. Open the website booking button, select New Client, confirm the intake and Video Office, and inspect available times. Provider acceptance is still required; an appointment request is not a confirmed visit.
2. With the practice's approval, submit a clearly labeled synthetic booking request and contact inquiry using no real patient data. Verify the practice receives alerts within two minutes, then accepts the test request and receives the expected client confirmation. Test duplicate submission/spam handling within SimplePractice. Remove test records using its normal supported recovery/deletion workflow.
3. Confirm the existing contact recipient is the intended practice inbox and email privacy/BAA requirements are met. Client reminders and practitioner request alerts are separate settings.
4. Existing clients should use the portal sign-in path. Confirm client-specific fees reflect the intended treatment plan if they differ from service defaults.

### If embedded widgets are wanted later

The account quoted Plus at $49.50/month during its 50% promotion, then $99/month plus applicable tax. The screen labels the offer first 12 months; remaining promotion duration and prorated upgrade cost were not established. No subscription change was made. If upgrading later, obtain the official codes under Settings → Scheduling and inquiries → Widgets. The retired snippet file is not rendered. Adding an embed will require updating the integration, CSP, privacy copy, and tests.

Sources: [appointment widgets](https://support.simplepractice.com/hc/en-us/articles/115004734123-Adding-the-appointment-request-widget-to-your-website), [native contact forms](https://support.simplepractice.com/hc/en-us/articles/33457058133901-Managing-the-integrated-contact-form).

## 4. Point the public domain to Pages

**The apex/root domain requires Cloudflare DNS nameservers.** It can remain *registered* at Squarespace. A subdomain can use external DNS, which is why the optional test CNAME works. See [Cloudflare custom domain requirements](https://developers.cloudflare.com/pages/configuration/custom-domains/).

1. Before changes, export or screenshot **every** current Squarespace DNS record and the current nameservers. Preserve MX, SPF, DKIM, DMARC, verification TXT records, and other service records. Record the existing parking-site A/CNAME values for rollback. Lower editable website-record TTLs to approximately 300 seconds ahead of the cutover, if supported.
2. Add `bluewillowmentalhealth.com` as a Cloudflare zone in the same BIS account as the Pages project. Review imported records against the export; import missing mail records exactly. Keep mail/service records DNS-only. Do not create a second SPF record.
3. If DNSSEC is active at Squarespace, follow the providers' migration procedure to remove the old DS record before switching nameservers. Re-enable DNSSEC with Cloudflare's new DS after the zone is active; a stale DS can break resolution.
4. In Squarespace's domain nameserver settings, replace the old nameservers with the two **exact values Cloudflare assigns**. This is a DNS-host change, not a domain transfer. Wait until Cloudflare reports the zone active; nameserver propagation may take substantially longer than a 300-second record TTL.
5. In the Pages project, add **both** `bluewillowmentalhealth.com` and `www.bluewillowmentalhealth.com` through **Custom domains**. Let Cloudflare create the required records; replace old web A/AAAA/CNAME records only when they conflict. Do not replace email records. Wait for domain and HTTPS certificate activation. Review existing CAA records if certificate issuance fails.
6. Configure a Cloudflare redirect rule from `www.bluewillowmentalhealth.com` to `https://bluewillowmentalhealth.com`, preserving paths. Drop query strings for this public healthcare site unless a separately reviewed need exists. The site's canonical URLs use the apex domain. Redirect aliases/Pages-host traffic only after the production hostname works, preserving a usable preview hostname.
7. After Matt authorizes release and clinical/notification checks pass, set the **production build environment** to **`PUBLIC_SITE_ENV=production`** and **`SITE_URL=https://bluewillowmentalhealth.com`**. Rebuild the approved revision. Leave branch/PR previews at `preview`.
8. Verify root and www HTTPS, redirects, each route, `robots.txt`, `/sitemap-index.xml`, canonical tags, headers, mobile navigation, the secure booking/contact links, contact alerts, and test booking confirmation. Confirm Workspace receives and sends email.
9. Retire the old Squarespace parking site only after verification. Keep domain registration, renewal, and Workspace service active. Changing website hosting is not permission to cancel unrelated subscriptions.

**Rollback:** restore the previous website records in the active Cloudflare zone to route web traffic back to the saved Squarespace destination. Keep all mail records. If necessary, restore the original nameservers at Squarespace, coordinating DNSSEC and allowing propagation. Do not destroy the previous site before the new one passes verification. A Pages code rollback can be performed from the project's deployment history.

## 5. Search and external profiles

- **Search Console:** verify a Domain property using Google's DNS TXT in Cloudflare (or Squarespace before nameserver migration, carrying the record forward). Submit `https://bluewillowmentalhealth.com/sitemap-index.xml` only after production indexing is enabled. Inspect the homepage and two audience routes.
- **Schema:** run Google's Rich Results Test and Schema.org validator on the live homepage/FAQ. MedicalClinic and FAQPage are included; no personal Physician entity, invented phone, office address, or credentials are published. Add verified provider data only if the brand rule is explicitly revised. Rich-result display is never guaranteed.
- **Google Business Profile:** Matt confirmed no in-person service on October 3. Google's [business eligibility policy](https://support.google.com/business/answer/13763036?hl=en-en) excludes online-only businesses. This channel and Google-review automation are not applicable to the current rollout. No office/service-area model should be fabricated; the owner should resolve any pending application with Google.
- **Psychology Today / Facebook:** obtain verified profile URLs and admin access, then align the practice name, website, pricing, scope, and service area. Do not publish invented badges or profile links. No social links are rendered until supplied.

## 6. Analytics and privacy

The build intentionally has **no analytics enabled**, including on previews. Cloudflare Web Analytics is the preferred optional choice, subject to the practice's privacy review. Its [FAQ](https://developers.cloudflare.com/web-analytics/faq/) says it does not currently log query strings; this alone is not a compliance assessment.

Before enabling it, inventory actual beacon fields (including path and referrer), confirm they are acceptable for this healthcare site, and check applicable account/contracts settings. Do not track portal actions, inquiry contents, user IDs, medical details, or session recordings. If analytics cannot pass that review, keep it disabled. Enabling a beacon also requires a narrow CSP allowlist update and a matching revision of `src/content/pages/privacy.md`; Pages automatic injection alone is not configured or approved by this build. Hosting access logs may still receive URLs, so query stripping at analytics does not make website URLs a secure intake channel.

## 7. Launch checklist

- [x] Matt confirms all supplied copy approved (October 3); do not invent exact eligible ages or new clinical services. Review the current 60-minute slot versus approved 60–90 minute review wording during testing.
- [ ] Tree mark approved for production or replaced with the complete supplied logo.
- [ ] Secure-link design approved (completed October 3); verify final-domain links.
- [ ] Real booking request → provider acceptance → client confirmation tested on the final domain.
- [ ] Inquiry alert received within two minutes; duplicate/spam behavior checked within SimplePractice.
- [ ] Workspace notification privacy/BAA status and optional SMS decision recorded.
- [ ] Profile URLs verified; Google Business Profile eligibility resolved.
- [ ] CI passes; live mobile Lighthouse scores ≥90 and LCP <2.5s checked with the approved secure-link design.
- [ ] Preview and production indexing settings verified; no test inquiry details in repo, chat, analytics, or logs.
- [ ] Public domain/HTTPS/mail checked; Matt authorizes cutover; rollback values retained.
- [ ] All placeholders resolved or explicitly closed with an approved alternative.

## Handover for the practice

Appointments and inquiries arrive in SimplePractice. Keep its notification preferences and practice inbox working; website updates do not change availability. Update availability, fees, paperwork, and payment policies in SimplePractice as needed, then ask Matt to keep website wording consistent. Ask Matt for copy/layout/integration changes. Do not email clinical details for website edits. The ongoing support arrangement remains the retainer described in the PRD.
