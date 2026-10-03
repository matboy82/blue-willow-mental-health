# Cloudflare and integration setup

The site is implemented locally. Accounts, DNS, widget settings, notifications, and clinical copy still need owner verification. Do not switch the public domain until the launch checklist below is complete. Domain registration stays at Squarespace.

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

1. Push this working tree and its lockfile to the existing `matboy82/blue-willow-mental-health` repository after review. No commit or push was performed by the build task.
2. In the BIS-owned Cloudflare account, open **Workers & Pages**, create a **Pages** project, and connect the repository. Use the Pages Git integration, not an SSR Worker template.
3. Choose Astro (or enter settings manually): build command **`npm run build`**, output directory **`dist`**, repository root unchanged. No adapter, database, Worker, or secret is needed.
4. Use `main` initially as the test deployment branch, following the PRD. Set **`NODE_VERSION=22`**, **`ASTRO_TELEMETRY_DISABLED=1`**, **`PUBLIC_SITE_ENV=preview`**, **`SITE_URL=https://bluewillowmentalhealth.com`**. Preview deployments must retain `PUBLIC_SITE_ENV=preview` after launch.
5. Deploy and review the assigned `*.pages.dev` URL. Keep Pages automatic Web Analytics disabled. Builds default to `noindex, nofollow` and a blocking `robots.txt` unless production is explicitly selected.
6. Optional test domain: add `test.bluewillowmentalhealth.com` under **Pages → Custom domains** first. Then add a Squarespace DNS CNAME named `test` pointing to the exact assigned `YOUR-PROJECT.pages.dev` host, without `https://` or a path. Review the HTTPS test URL after validation.

Cloudflare's [Astro Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) describes the deployment flow. The repo includes GitHub CI for type checks, static route/privacy tests, browser accessibility checks, and mobile Lighthouse thresholds. Pages deployment is separate from GitHub CI; only promote a reviewed revision with passing checks.

## 3. Finish SimplePractice

The working direct paths are:

- Booking/client portal: https://jo-elbert.clientsecure.me/
- Contact: https://jo-elbert.clientsecure.me/contact-widget

The site never receives a booking, payment, or contact submission. The contact page can load the supplied SimplePractice URL after a visitor clicks; a direct link remains available if framing is blocked. Framed contact delivery has not been certified by a live inquiry test.

### Appointment widget

1. Sign in to the practice account. Enable online appointment requests and new-client availability for the intended services and video office.
2. Current official navigation is **Settings → Scheduling and inquiries → Widgets** (older interfaces may say Appointment request widget / Online Booking).
3. Copy the **complete official appointment-request widget snippet**. The external widget currently requires the SimplePractice Plus plan; check the account's entitlement.
4. Replace the comment in **`src/components/simplepractice-booking.html`** with that exact snippet. Preserve its `data-spwidget-scope` attribute; the site uses it to detect configuration. Use practice-level routing if multiple clinicians will join. Do not invent a widget ID.
5. Rebuild. The booking section displays the widget alongside the direct portal fallback. The code is placed below the fold and loads only after a visitor selects Load appointment options. If the snippet uses another CDN/domain, review and narrowly update `public/_headers` instead of removing the content security policy.
6. Verify the widget opens at 360px and desktop sizes, available services have the correct $225/$100 prices, appointment times use the intended timezone, and confirmation follows provider acceptance. Do not describe a request as an already confirmed booking.

Source: [SimplePractice appointment widget instructions](https://support.simplepractice.com/hc/en-us/articles/115004734123-Adding-the-appointment-request-widget-to-your-website).

### Contact and immediate notifications

1. Under **Settings → Scheduling and inquiries → Contact form**, verify the native form and practice routing. If the copied official contact embed has a different URL than the supplied `/contact-widget`, update `practice.contact` in `src/lib/practice.ts`.
2. Enable practitioner notifications for **new appointment requests and contact inquiries** in the account's notification preferences. Client reminder settings are separate and do not prove practitioner inquiry alerts work.
3. Confirm the recipient email is the intended practice inbox; confirm mobile/push or SMS options available on the subscribed plan. Start with native email alerts; optional SMS is still an owner decision. Do not include clinical content in alert messages.
4. With practice approval, send a clearly identified synthetic inquiry and appointment request, using no real patient data. Measure delivery to the practice inbox (target under two minutes), provider acceptance, and client confirmation. Check junk filters. Remove test records in SimplePractice afterward.
5. Check repeated submission behavior in SimplePractice. The website cannot enforce idempotency inside the vendor's form; do not mark the PRD's double-submit criterion passed without the account test.

Source: [SimplePractice scheduling/contact settings](https://support.simplepractice.com/hc/en-us/articles/24683475477261-Navigating-your-Client-Care-settings). No custom forwarding Worker was added because the PRD prefers the native contact path. Google Workspace BAA confirmation is still required for any notification flow containing sensitive information. Email forwarding or SMS automation needs a separate reviewed scope.

## 4. Point the public domain to Pages

**The apex/root domain requires Cloudflare DNS nameservers.** It can remain *registered* at Squarespace. A subdomain can use external DNS, which is why the optional test CNAME works. See [Cloudflare custom domain requirements](https://developers.cloudflare.com/pages/configuration/custom-domains/).

1. Before changes, export or screenshot **every** current Squarespace DNS record and the current nameservers. Preserve MX, SPF, DKIM, DMARC, verification TXT records, and other service records. Record the existing parking-site A/CNAME values for rollback. Lower editable website-record TTLs to approximately 300 seconds ahead of the cutover, if supported.
2. Add `bluewillowmentalhealth.com` as a Cloudflare zone in the same BIS account as the Pages project. Review imported records against the export; import missing mail records exactly. Keep mail/service records DNS-only. Do not create a second SPF record.
3. If DNSSEC is active at Squarespace, follow the providers' migration procedure to remove the old DS record before switching nameservers. Re-enable DNSSEC with Cloudflare's new DS after the zone is active; a stale DS can break resolution.
4. In Squarespace's domain nameserver settings, replace the old nameservers with the two **exact values Cloudflare assigns**. This is a DNS-host change, not a domain transfer. Wait until Cloudflare reports the zone active; nameserver propagation may take substantially longer than a 300-second record TTL.
5. In the Pages project, add **both** `bluewillowmentalhealth.com` and `www.bluewillowmentalhealth.com` through **Custom domains**. Let Cloudflare create the required records; replace old web A/AAAA/CNAME records only when they conflict. Do not replace email records. Wait for domain and HTTPS certificate activation. Review existing CAA records if certificate issuance fails.
6. Configure a Cloudflare redirect rule from `www.bluewillowmentalhealth.com` to `https://bluewillowmentalhealth.com`, preserving paths. Drop query strings for this public healthcare site unless a separately reviewed need exists. The site's canonical URLs use the apex domain. Redirect aliases/Pages-host traffic only after the production hostname works, preserving a usable preview hostname.
7. After Matt authorizes release and clinical/notification checks pass, set the **production build environment** to **`PUBLIC_SITE_ENV=production`** and **`SITE_URL=https://bluewillowmentalhealth.com`**. Rebuild the approved revision. Leave branch/PR previews at `preview`.
8. Verify root and www HTTPS, redirects, each route, `robots.txt`, `/sitemap-index.xml`, canonical tags, headers, mobile navigation, the actual widget, contact alerts, and test booking confirmation. Confirm Workspace receives and sends email.
9. Retire the old Squarespace parking site only after verification. Keep domain registration, renewal, and Workspace service active. Changing website hosting is not permission to cancel unrelated subscriptions.

**Rollback:** restore the previous website records in the active Cloudflare zone to route web traffic back to the saved Squarespace destination. Keep all mail records. If necessary, restore the original nameservers at Squarespace, coordinating DNSSEC and allowing propagation. Do not destroy the previous site before the new one passes verification. A Pages code rollback can be performed from the project's deployment history.

## 5. Search and external profiles

- **Search Console:** verify a Domain property using Google's DNS TXT in Cloudflare (or Squarespace before nameserver migration, carrying the record forward). Submit `https://bluewillowmentalhealth.com/sitemap-index.xml` only after production indexing is enabled. Inspect the homepage and two audience routes.
- **Schema:** run Google's Rich Results Test and Schema.org validator on the live homepage/FAQ. MedicalClinic and FAQPage are included; no personal Physician entity, invented phone, office address, or credentials are published. Add verified provider data only if the brand rule is explicitly revised. Rich-result display is never guaranteed.
- **Google Business Profile:** first verify eligibility. Google's [business eligibility policy](https://support.google.com/business/answer/13763036?hl=en-en) excludes online-only businesses. The supplied PRD says telehealth only, so do not fabricate an office or an in-person service area to obtain a listing. If the practice has a real eligible in-person service model, confirm the facts before claiming or creating a listing. Otherwise document this PRD requirement as not applicable.
- **Psychology Today / Facebook:** obtain verified profile URLs and admin access, then align the practice name, website, pricing, scope, and service area. Do not publish invented badges or profile links. No social links are rendered until supplied.

## 6. Analytics and privacy

The build intentionally has **no analytics enabled**, including on previews. Cloudflare Web Analytics is the preferred optional choice, subject to the practice's privacy review. Its [FAQ](https://developers.cloudflare.com/web-analytics/faq/) says it does not currently log query strings; this alone is not a compliance assessment.

Before enabling it, inventory actual beacon fields (including path and referrer), confirm they are acceptable for this healthcare site, and check applicable account/contracts settings. Do not track portal actions, inquiry contents, user IDs, medical details, or session recordings. If analytics cannot pass that review, keep it disabled. Enabling a beacon also requires a narrow CSP allowlist update and a matching revision of `src/content/pages/privacy.md`; Pages automatic injection alone is not configured or approved by this build. Hosting access logs may still receive URLs, so query stripping at analytics does not make website URLs a secure intake channel.

## 7. Launch checklist

- [ ] Matt reviews the layout and copy; Jody approves clinical scope, exact eligible ages, assessment inclusions, follow-up services, and cancellation/payment policies.
- [ ] Tree mark approved for production or replaced with the complete supplied logo.
- [ ] Official booking snippet configured (or explicitly approve direct-portal booking as the final design).
- [ ] Real booking request → provider acceptance → client confirmation tested on the final domain.
- [ ] Inquiry alert received within two minutes; duplicate/spam behavior checked within SimplePractice.
- [ ] Workspace notification privacy/BAA status and optional SMS decision recorded.
- [ ] Profile URLs verified; Google Business Profile eligibility resolved.
- [ ] CI passes; live mobile Lighthouse scores ≥90 and LCP <2.5s checked after widget configuration.
- [ ] Preview and production indexing settings verified; no test inquiry details in repo, chat, analytics, or logs.
- [ ] Public domain/HTTPS/mail checked; Matt authorizes cutover; rollback values retained.
- [ ] All placeholders resolved or explicitly closed with an approved alternative.

## Handover for the practice

Appointments and inquiries arrive in SimplePractice. Keep its notification preferences and practice inbox working; website updates do not change availability. Update availability, fees, paperwork, and payment policies in SimplePractice as needed, then ask Matt to keep website wording consistent. Ask Matt for copy/layout/integration changes. Do not email clinical details for website edits. The ongoing support arrangement remains the retainer described in the PRD.
