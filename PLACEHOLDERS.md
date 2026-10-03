# Outstanding owner inputs and launch gates

The local site is implemented. No production cutover, account configuration, commit, or push has been performed. Nothing goes to production with an unresolved gate below unless its owner explicitly closes it with an approved alternative. See docs/SETUP.md for concrete instructions.

| Input / gate | Owner | Unblock condition | Status |
|---|---|---|---|
| Cloudflare Pages project and Git connection | Matt | BIS account confirmed; repo pushed; test deployment verified | Open |
| Official SimplePractice appointment widget | Matt | Copy vendor snippet into src/components/simplepractice-booking.html, rebuild, and test; direct portal link works now | Open |
| Secure inquiry and booking verification | Matt / practice | Test native form, notification within two minutes, duplicate/spam behavior, request acceptance, confirmation | Open |
| Full logo / tree-mark approval | Practice / Matt | Supply complete asset or approve existing tree mark for production | Open |
| Clinical copy sign-off | Practice | Confirm eligible ages, credentials/scope, prescribing wording, screening, visit inclusions, fees, policies | Open |
| Screener product name | Practice | Confirm product; site currently uses generic computer-based screening wording | Open |
| Practitioner notifications / Workspace privacy | Practice | Verify recipient, native settings, BAA/privacy requirements for email | Open |
| SMS notifications | Matt / practice | Choose native email-only alerts or verify vendor-supported SMS/push with privacy review | Open |
| Google Business Profile eligibility | Matt | Telehealth-only business may be ineligible; resolve policy and document approved alternative | Open |
| Psychology Today profile | Matt | Verify URL/profile before adding link or badge | Open |
| Facebook page admin / consistency | Matt | Confirm access and align facts and website URL | Open |
| Analytics decision | Matt / practice | No analytics enabled; approve disabled state or review beacon/privacy/CSP before activation | Open |
| Search Console | Matt | Verify domain and submit sitemap after production indexing is enabled | Open |
| Domain / mail / HTTPS cutover | Matt | Follow runbook, retain rollback records, preserve Workspace DNS, verify final host | Open |
| Release approval and live performance | Matt / practice | Review final revision and inputs; authorize launch; rerun checks with real widget on live domain | Open |

No invented phone, address, social profile, provider entity, availability promise, or competitor-price comparison is published. Those details require verification before addition.
