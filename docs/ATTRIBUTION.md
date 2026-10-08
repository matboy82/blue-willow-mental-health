# PT verification and booking attribution — October 8, 2026

Matt requested these additions and confirmed the approved website details stay: Blue Willow Mental Health, Louisville positioning, 859-208-7100 and $225/$100 cash pay. The practitioner will update the conflicting Psychology Today profile. Do not copy its Winchester location, $150/$75 fees or insurance claims into the website.

## Badges

`TrustRow.astro` appears near the homepage hero and beside the primary booking CTA at `/booking/`. Its slot accepts future verified badges; no GBP badge is invented. The image is the unchanged official 186 × 60 SVG from the supplied Psychology Today seal API (profile 1589949, badge 17). The supplied JS callback only populates the first matching anchor, so the authorized image-only fallback handles two placements without third-party JavaScript. Recheck badge validity after profile updates.

## Cloudflare setup

Pages **Metrics → Web Analytics** was enabled in the authenticated dashboard. Pages injects one beacon on the next deployment; do not add a duplicate manual snippet. CSP allows the official script and beacon destination. Cloudflare Web Analytics supports neither UTMs nor custom events, so booking clicks use a separate same-origin Pages Function and Analytics Engine dataset.

Production settings verified: `PUBLIC_SITE_ENV=production`, `SITE_URL=https://www.bluewillowmentalhealth.com`. Production Analytics Engine binding **BOOKING_ANALYTICS** → dataset **blue_willow_booking** was saved; redeployment applies it. Keep this binding out of previews. `public/_routes.json` invokes Functions only for `/api/booking-event`; content stays static.

Only three registered public UTM codes are kept in `sessionStorage`. Ordinary navigation preserves them; a newly tagged visit replaces them. Storage failure does not block scheduling. Link activation and WebMCP share the same helper. On activation, scheduling links append those codes, with source `direct` as fallback. Contact links remain untagged. Other URL parameters and referrers are not forwarded.

The collector accepts only `booking_link_click`, allowlisted public page, appointment category, link/WebMCP channel and registered campaign codes. It rejects extra fields, unknown values, bodies over 1 KB, malformed JSON and cross-origin requests. No API key is exposed, and no names, contact details, symptoms, full URLs, IP addresses, referrers or visitor/session IDs are saved in event records. The function never logs request bodies. Hosting still processes technical request metadata as described in the public privacy notice.

## Campaign links for the client assistant

Use the website as the destination so it captures attribution before the secure handoff:

`https://www.bluewillowmentalhealth.com/booking/?utm_source=psychologytoday&utm_medium=directory&utm_campaign=profile_link`

- Sources: `direct`, `psychologytoday`, `psychology-today`, `pt`, `google`, `gbp`, `facebook`, `instagram`, `referral`, `newsletter`.
- Mediums: `directory`, `referral`, `organic`, `social`, `organic_social`, `email`, `cpc`.
- Campaigns: `profile_link`, `profile`, `pt-profile`, `launch`, `fall-2026`, `october-2026`, `social-october-2026`, `referral-outreach`.

Register new public codes in `src/lib/attribution-policy.mjs` before sharing links. Unknown values are discarded to avoid persisting arbitrary private text. Never use names, emails, symptoms or patient-specific codes. These examples do not authorize paid advertising or a GBP listing. Muse was not accessed or changed.

## Source in practitioner booking notifications

Automatic notification-level attribution is **unverified and not implemented**. SimplePractice controls completion and alerts. Its documented notification macros do not identify a UTM/source macro. Appending a query parameter does not prove that SimplePractice stores it or inserts `Source: psychologytoday` into Jody's email.

The existing optional “How did you hear about us?” question was previously configured on native new-client requests and inquiries. It remains the actual-booking fallback. The website cannot silently populate cross-origin hidden fields. There is no on-site form to add a hidden field to; Essential secure links remain the approved design.

Ask SimplePractice support whether it supports prefilling that native question from `utm_source` and including the answer in the **practitioner** appointment notification. Do not invent a macro or parameter. If confirmed, configure it and test a clearly labeled synthetic request, checking Jody's received notification. No booking was submitted here, no patient emails were parsed and no outside notification automation was created.

## Revenue and reporting

Source-bearing clicks meet the requested minimum logging, but are not confirmed appointments, unique clients or collected revenue. Repeated clicks, bots, blocked scripts and delivery loss affect totals. Use SimplePractice's source answers and actual collected receipts for the step-up; never multiply clicks by $225 or automatically change fees. No attribution dashboard was created.

For optional aggregate click reporting, Analytics Engine's SQL API uses `blob5` source, `blob6` medium and `blob7` campaign. Sum `_sample_interval * double1` to account for sampling:

```sql
SELECT blob5 AS source, blob6 AS medium, blob7 AS campaign,
       SUM(_sample_interval * double1) AS booking_link_clicks
FROM blue_willow_booking
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY source, medium, campaign
```

Sources: [PT profile](https://www.psychologytoday.com/profile/1589949), [Cloudflare FAQ](https://developers.cloudflare.com/web-analytics/faq/), [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [SimplePractice macros](https://support.simplepractice.com/hc/en-us/articles/9807719131661-Using-macros-in-client-emails-and-reminders).

## Production verification — October 8, 2026

Main commit `3940fa4` deployed successfully as `7168df3b-b532-4fbc-ad96-4a8862868835` at the production domain. Initial deployments built successfully but failed publishing the Function because account-level Analytics Engine was disabled; enabling it resolved the error. The binding and dataset are active.

Live checks confirmed both official badge placements, one injected Cloudflare beacon, beacon responses of 204, no browser console/CSP errors, canonical PT query parameters on the SimplePractice handoff, and a 204 receipt from the source-bearing click collector. A retained-page test observed the beacon response; immediate handoff tests observed the request but could not observe its response after navigation. Nine static/collector tests and eight browser tests passed. Live mobile Lighthouse scored 96 performance and 100 accessibility/best practices/SEO, with FCP 1.5 seconds, LCP 2.6 seconds and CLS 0 in one run; measurements vary.

Verification generated synthetic anonymous click records on October 8 (two `direct` submissions and one confirmed PT submission, plus two PT handoff attempts with unobserved delivery). Exclude these from real lead totals. No appointment or inquiry was submitted. The source line in practitioner completion notifications remains unverified as described above.
