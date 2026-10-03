# Outstanding owner inputs and launch gates

The site is implemented and pushed (`ac58ada4`, Matt, 2026-10-03); test deployment live at blue-willow-mental-health.pages.dev (verified). No production cutover performed. Account rates and intake booking permissions were configured October 3. Nothing goes to production with an unresolved gate below unless its owner explicitly closes it with an approved alternative. See docs/SETUP.md for concrete instructions.

| Input / gate | Owner | Unblock condition | Status |
|---|---|---|---|
| Cloudflare Pages project and Git connection | Matt | Connected; test deployment live and verified | Closed |
| SimplePractice integration design | Matt | Essential with secure links approved October 3; external widget intentionally omitted | Closed |
| Secure inquiry and booking verification | Matt / practice | Test native form, notification within two minutes, duplicate/spam behavior, request acceptance, confirmation (`/request` was erroring — configure availability + bookable types first) | Open |
| Full logo / tree-mark approval | Practice / Matt | Supply complete asset or approve existing tree mark for production | Open |
| Clinical copy sign-off | Practice | Confirm eligible ages, credentials/scope, prescribing wording, screening, visit inclusions, fees, policies | Open |
| Screener product name | Practice | Confirm product; site currently uses generic computer-based screening wording | Open |
| Practitioner notifications / Workspace privacy | Practice | Verify recipient, native settings, BAA/privacy requirements for email | Open |
| SMS notifications | Matt / practice | Choose native email-only alerts or verify vendor-supported SMS/push with privacy review | Open |
| Google Business Profile | Matt | Address submitted 2026-10-03; verification pending — then upload assets, complete fields | In progress |
| Psychology Today profile | Matt | Verify URL/profile before adding link or badge | Open |
| Facebook page admin / consistency | Matt | Owner access confirmed 2026-10-03; align facts and website URL after prod cutover | In progress |
| Instagram account | Matt | Verify/link in Meta Business settings; cross-post from FB page | Open |
| Analytics decision | Matt / practice | No analytics enabled; approve disabled state or review beacon/privacy/CSP before activation | Open |
| Search Console | Matt | Verify domain and submit sitemap after production indexing is enabled | Open |
| Domain / mail / HTTPS cutover | Matt | Follow runbook, retain rollback records, preserve Workspace DNS, verify final host | Open |
| Release approval and live performance | Matt / practice | Review final revision and inputs; authorize launch; rerun checks with secure links on live domain | Open |

No invented phone, address, social profile, provider entity, availability promise, or competitor-price comparison is published. Those details require verification before addition.
