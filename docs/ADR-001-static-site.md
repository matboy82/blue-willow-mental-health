# ADR 001: Static Astro site and native clinical integrations

Status: Implemented locally; infrastructure and clinical approval pending.

- Astro 7.3.5 pinned with TypeScript; static `dist` output. Cloudflare Pages Git integration is the intended deployment. No SSR adapter or patient data backend.
- PRD and approved mockup's blue palette override the earlier green brand tokens. Use the supplied tree mark, amber CTAs, Fraunces/Inter self-hosted fonts, and accessible native disclosure elements.
- Zod-validated Markdown content collection supplies the six informational/audience/privacy routes. Shared FAQs, fees, and integration components avoid inconsistent main-page content.
- Native SimplePractice booking/contact paths are the clinical boundary. Official booking snippet remains an explicit integration slot with a working direct portal fallback. Contact frame is user-initiated, with no-referrer and a direct fallback. No custom Worker or Google email API added.
- Preview is the default; indexing requires `PUBLIC_SITE_ENV=production`. Account validation and launch remain owner actions.
- No analytics in the as-built site. Optional Cloudflare Web Analytics requires a privacy payload review and matching privacy/CSP changes before activation.
- MedicalClinic/FAQPage entities describe verified practice facts. Physician identity, unverified location/phone, prescribing promises, comparison-price anchors, short wait claims, insurance-record privacy promises, and cancellation guarantees are omitted pending evidence and clinical approval.
- DNS distinction corrected: root Pages hosting requires Cloudflare nameservers; Squarespace registration remains. Optional test subdomain supports Squarespace-managed CNAME.
- Telehealth-only Google Business Profile eligibility must be resolved under Google's policy; this build does not fabricate an in-person office.

See SETUP.md for account actions, approval gates, and verification.

## Update — October 3, 2026
Matt chose Essential with secure links. The website no longer embeds contact or booking forms; the retired booking HTML is not imported. The CSP now blocks frames and third-party scripts/connections. Account intake/follow-up defaults updated to $225/$100 per Matt, and intake new-client requests enabled. Native contact and appointment-request alerts were already enabled. Delivery and actual booking submissions remain untested.
