# Blue Willow funnel configuration and assistant handoff

Updated October 3, 2026. Sources: the five October 3 channel/strategy/copy/calendar/plan documents supplied by Matt; his subsequent approvals; native SimplePractice settings inspected today. Patient records were not opened. This document contains configuration and public copy only.

## Decisions

- Keep Essential with secure links. SimplePractice is the scheduling, inquiry, clinical and payment system of record.
- Matt confirms all supplied copy is approved. Scheduling capacity is managed by the practice. Preserve existing 60-minute intake and 30-minute follow-up slots; approved marketing describes a 60–90 minute clinical review. The practice should verify this difference during testing; no duration was changed.
- Muse is already configured by the client. Do not connect its account or examine its capabilities as part of this task. It handles public content, the social calendar and generic reminders to the practitioner.
- Keep Google Calendar disconnected until Workspace contractual/privacy settings and calendar access are established. Native SimplePractice scheduling works without Google. Essential basic Google sync exports appointments and secure video links; Plus advanced sync imports personal Google events to block availability. No upgrade authorized.
- Telehealth only: Google Business Profile and Google-review automation are not part of this rollout. No address is published or fabricated. Confirm how to resolve any pending profile directly with Google; no listing was changed by this task.
- Matt tests preview first, then authorizes production indexing and connects the domain. No production cutover, DNS modification or publishing to social channels is included in this configuration pass.

## Native configuration

| Function | Status | Verification |
|---|---|---|
| Intake $225; follow-up $100 | Configured in earlier session | Native service defaults; intake allowed for new clients |
| Request notification preferences | Existing settings enabled | Delivery remains a test requirement |
| Contact form inquiry confirmation | Enabled today | Native success notification; customized template saved |
| Optional source attribution | Published today | Existing referral-source question renamed and shown on both contact and new-client request forms; native public contact field verified |
| Inquiry reason choices | Updated today | Assessment cost/payment, process, first appointment, availability, teen eligibility, other; removed generic therapy/insurance/free-consultation options |
| Scheduling/change notification prompts | Enabled today | Calendar settings saved; practitioner still chooses whether to send the prompted notification |
| Email appointment reminders | Existing 48-hour schedule | Client-level opt-in/settings still apply; native telehealth reminder also sent 10 minutes before |
| Three-touch non-booker sequence | Not configured; no supported native sequence established | Do not substitute appointment or billing reminders for nurture |
| Google sync | Disconnected | No new external patient-data access granted |

The automatic acknowledgment uses the approved inquiry copy, $225/$100 pricing, the tested secure booking URL, and a secure contact URL. The demo website URL was omitted so the same email works before and after domain cutover. SimplePractice sends from an unmonitored address; the footer directs questions to the secure contact form instead of suggesting replies reach Jody.

## Patient-free Muse workflow

Provide the public approved channel/copy/calendar documents and these workflow rules to the existing assistant. Configuration in Muse is performed by its owner; these are ready-to-use instructions, not a running automation created here.

> Manage Blue Willow's public social content using the approved calendar and brand assets. Use America/New_York for the Tue 10:00am, Thu 7:00pm and Sat 9:00am schedule. Use https://jo-elbert.clientsecure.me/ for booking until Matt supplies the verified production website URL. Keep patient data out of posts, tasks, memory and reports. Do not connect to SimplePractice, read inquiry emails, or inspect clinical-calendar events. Remind Jody to check inquiries in SimplePractice and send appropriate follow-ups there. Remind her to review due non-booker follow-ups on days 1, 4 and 10 using SimplePractice records. The reminder itself must not contain names, contact information, appointment details, health information or patient-specific identifiers. Never infer a patient list or send client messages from these generic reminders. Do not request Google reviews or republish patient testimonials. Exact supplied copy is approved; newly generated clinical claims need Jody's review. Use current portal availability rather than promising fixed wait times. Report public channel activity and aggregated performance only.

Suggested generic reminders: "Check new inquiries in SimplePractice" during the practice's chosen working windows; "Review follow-ups due in SimplePractice" once per working day. Jody selects recipients, checks booking/reply/opt-out status, and sends the approved follow-up through the supported clinical workflow. Muse can automate these reminders without knowing who contacted the practice.

Automatic patient-specific nurture cannot be patient-free: the sender needs recipients, inquiry timing, and booking/opt-out status. SimplePractice has no public API. An external implementation therefore remains a separate project requiring an explicitly authorized data flow, a supported integration, appropriate contracts and suppression controls. Do not parse booking emails or export patient lists as a workaround.

If that future implementation is approved: send each day-1/4/10 message at most once; stop on booking, reply pending personal handling, opt-out, invalid address, decline, ineligibility or staff pause; verify immediately before sending; disable tracking/open pixels; keep audit records in the approved clinical system. A BAA alone does not establish permitted use or recipient consent.

## Channels and revenue

- Site: new Louisville landing page, price-first adult/teen introductions, visible FAQs with matching schema, verified public contact details, direct secure CTAs. No visitor tracking or custom inquiry forms.
- Search: verify Search Console after domain connection, submit the production sitemap, inspect homepage/Louisville/adult/teen URLs. Google/AI rankings and citations are not guaranteed.
- Psychology Today and Meta: owner verifies current profile facts, exact public URLs and access. Muse handles approved scheduling. Website links to unknown profiles remain absent.
- Referrals: practice conducts outreach and receives clinical referral details securely. No autonomous messages to practices were sent.
- Attribution: source remains in SimplePractice. Aggregate monthly inquiries, requests, accepted appointments, attended intakes, follow-ups, collected revenue, refunds and outstanding balances by channel. A source answer is self-reported, not proof that the website caused the sale. No patient rows or small identifying breakdowns go to Muse or this repository.
- Revenue model: collected intake revenue = completed, paid intakes × $225; collected follow-up revenue = completed, paid follow-ups × $100, adjusted for refunds and actual receipts. Do not assume two follow-ups per intake or apply the proposed retainer step-up automatically.

## Matt's preview test

1. Review desktop/mobile site, verified contact details, price/clinical wording, Louisville page, FAQs and all secure buttons. Preview must remain noindex.
2. Submit one clearly labeled synthetic contact inquiry with owner-controlled test contact details and no real patient data. Confirm the practice alert arrives promptly and the branded acknowledgment arrives once. Confirm the optional source field is saved in SimplePractice. Do not paste submissions or screenshots of recipient records into project files/chat.
3. Submit a synthetic new-client request. Confirm $225 intake, Video Office, source field, current timezone and available slots. Verify request receipt, practitioner notification, provider acceptance and client confirmation; distinguish request from confirmed booking.
4. Verify 48-hour/telehealth reminders with a suitably timed synthetic appointment and client-level reminder settings. Verify document reminders only where deliberately enabled. Never change real appointments to test.
5. Have Muse deliver a generic inquiry/follow-up reminder with no patient data. Confirm public content scheduling uses Eastern time and the secure booking URL.
6. Review test records using SimplePractice's supported recovery/deletion policy; permanent deletion requires explicit approval. No tests were submitted by this agent.
7. After tests pass, Matt authorizes production; follow SETUP.md for custom domain, production-only environment variables, HTTPS/mail/redirects, live checks and Search Console. Preserve preview indexing settings.

References: [native contact confirmations](https://support.simplepractice.com/hc/en-us/articles/33457058133901-Managing-the-integrated-contact-form), [appointment reminders](https://support.simplepractice.com/hc/en-us/articles/42052535058957-Setting-up-appointment-reminders), [calendar sync](https://support.simplepractice.com/hc/en-us/articles/33641781380365-Getting-started-with-calendar-sync), [plan/API limitations](https://support.simplepractice.com/hc/en-us/articles/360034957931-Comparing-SimplePractice-features-by-plan), [Google Business Profile eligibility](https://support.google.com/business/answer/13763036?hl=en), [HHS marketing guidance](https://www.hhs.gov/hipaa/for-professionals/faq/marketing/index.html).
