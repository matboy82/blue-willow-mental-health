# Outstanding owner inputs and launch gates

The site is implemented and pushed (`ac58ada4`, Matt, 2026-10-03); test deployment live at blue-willow-mental-health.pages.dev (verified). No production cutover performed. Account rates and intake booking permissions were configured October 3. Nothing goes to production with an unresolved gate below unless its owner explicitly closes it with an approved alternative. See docs/SETUP.md for concrete instructions.

| Input / gate | Owner | Unblock condition | Status |
|---|---|---|---|
| Cloudflare Pages project and Git connection | Matt | Connected; test deployment live and verified | Closed |
| SimplePractice integration design | Matt | Essential with secure links approved October 3; external widget intentionally omitted | Closed |
| Secure inquiry and booking verification | Matt / practice | Booking availability repaired; test notification delivery, request acceptance, confirmation and native inquiry handling | Open |
| Full logo / tree-mark approval | Practice / Matt | Supply complete asset or approve existing tree mark for production | Open |
| Clinical copy sign-off | Practice | Matt confirms all supplied copy approved October 3; no unsupported exact ages/product names added | Closed |
| Screener product name | Practice | Confirm product; site currently uses generic computer-based screening wording | Open |
| Practitioner notifications / Workspace privacy | Practice | Verify recipient, native settings, BAA/privacy requirements for email | Open |
| SMS notifications | Matt / practice | Choose native email-only alerts or verify vendor-supported SMS/push with privacy review | Open |
| Google Business Profile eligibility | Matt | Telehealth-only confirmed; not applicable to current rollout; address application previously submitted, pending resolution belongs to owner | Closed: not applicable |
| Psychology Today profile | Matt | Verify URL/profile before adding link or badge | Open |
| Facebook page admin / consistency | Matt | Owner access confirmed 2026-10-03; align facts and website URL after prod cutover | In progress |
| Instagram account | Matt | Verify/link in Meta Business settings; cross-post from FB page | Open |
| Analytics decision | Matt / practice | No analytics enabled; approve disabled state or review beacon/privacy/CSP before activation | Open |
| Search Console | Matt | Verify domain and submit sitemap after production indexing is enabled | Open |
| Domain / mail / HTTPS cutover | Matt | Follow runbook, retain rollback records, preserve Workspace DNS, verify final host | Open |
| Release approval and live performance | Matt / practice | Review final revision and inputs; authorize launch; rerun checks with secure links on live domain | Open |

No invented phone, address, social profile, provider entity, availability promise, or competitor-price comparison is published. Those details require verification before addition.

## October 3 funnel configuration update

- Matt confirmed all supplied copy approved. Clinical copy approval gate closed; exact ages/product names not supplied remain generic rather than invented. Existing appointment durations preserved.
- Approved phone and email from the supplied campaign documents now appear on the site and in clinic schema.
- Google Business Profile eligibility gate closed as not applicable: Matt confirms telehealth only. No Google-review automation. Pending profile resolution belongs to its owner.
- Inquiry acknowledgment enabled and customized; optional source attribution and assessment-focused inquiry choices published in SimplePractice. Scheduling/change notification prompts enabled; existing reminders retained. Delivery tests remain open.
- Google Calendar is disconnected; native SimplePractice scheduling does not need it. Muse handoff uses generic practitioner reminders and public copy only.
- A new Louisville page and stronger conversion-page FAQs are prepared locally. Production remains gated by Matt's testing/release authorization; no DNS changes.
- See docs/FUNNEL-OPERATIONS.md for current status, automation limits and the test checklist. Three-touch nurture is not running; no supported native sequence was established.
