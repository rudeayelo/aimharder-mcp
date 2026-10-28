# ADR: Resend transactional delivery

Status: accepted on 2026-10-18 after the user supplied an existing Resend credential for the authorized isolated test environment, with no purchases or plan changes. Supersedes only the native Cloudflare email-provider selection in the [invited password decision](2026-10-18-invited-password-admission.md). Complements the [test-environment boundary](2026-10-18-isolated-cloudflare-test-environment.md).

## Context

The authenticated Cloudflare dashboard established Workers Free as the current plan. Native Email Sending requires Paid, while the user excludes purchases and plan changes. The owner then supplied an existing Resend token through 1Password. Admission, maintained Better Auth password hashing, verified-email policy and generic recovery must remain unchanged.

## Decision

Use Resend's documented `POST https://api.resend.com/emails` endpoint for invitation, verification and recovery mail. Configure only a platform-secret `RESEND_API_KEY` and verified `MAIL_FROM`; remove the native `EMAIL` adapter and avoid fallback selection. Restrict the existing token to the sending domain where supported. Missing, blank, partial or header-injection configuration fails closed uniformly.

Send one bearer-authenticated plain-text JSON message per explicit delivery, with a 16 KiB body limit and ten-second timeout. Reject redirects and non-success statuses. Require a nonempty message ID from at most 4 KiB of success JSON; discard error bodies. Never log or expose provider diagnostics, recipient details, authentication links or credentials. Never retry automatically after uncertainty. A successful acknowledgement means provider acceptance, not mailbox receipt; preserve safe invitation failure/revocation and generic recovery behavior.

Verify the authorized sending domain with exact provider-returned DNS records, preserving unrelated/root receiving-mail configuration. Disable open/click tracking and request enforced TLS where supported. Record requested settings separately from actual read-back. The existing account, quotas, domain verification, retention and cost must be checked without a purchase or upgrade. Current [Resend pricing](https://resend.com/pricing) lists Free as 3,000 messages/month, 100/day, three domains and 30-day retention; this is a documented allowance, not observed account capacity, retention enforcement or a bill.

Exercise production mail HTTP through the public portal and real workerd/D1 authentication policy, substituting only external provider responses. Configured-mail anonymous smoke checks omit enrollment/recovery probes entirely. Keep the original disabled-mail stage explicit rather than attempting real sends to synthetic addresses.

## Observed isolated activation

The operator created the authorized sending domain in `eu-west-1`, installed exactly four provider-returned DNS records and read back the domain/all records as verified. Open/click tracking read back disabled; an enforced-TLS update succeeded but its GET read-back is unavailable. Root receiving MX and unrelated records were preserved. The reviewed bundle and Resend configuration are deployed on unchanged Workers Free, with the existing authentication secret preserved and eleven configured-mail anonymous HTTPS checks passing.

One private owner invitation was acknowledged with HTTP 200 and later read back as provider-delivered. That provider event alone establishes no mailbox receipt or verified identity. Subsequently, the owner reported invitation and verification mailbox receipts plus successful verification/password login; separate provider metadata also reported verification delivery. Fresh database read-back then confirmed one verified identity and one active admitted credential administrator. The public recovery form returned HTTP 200 and its provider event read back delivered; the owner subsequently confirmed recovery mailbox receipt and successful access recovery after being asked to reset the password and sign in again. These user-reported mailbox/authentication journeys complete #71 alongside independent provider/D1 evidence and synthetic policy tests. They are not CPU, concurrency, load or operating-cost measurements. No purchase, plan change or permission expansion occurred. See [operator evidence](../hosted-admission.md#configured-resend-stage-2026-10-18).

## Consequences

Support-channel product amendment, 2026-10-28: the owner accepted Resend Inboxes as the intended human-operated support channel for `support@ahmcp.link`, accessed through the provider dashboard. This extends the product direction beyond transactional sending; configuration, account-specific pricing/quota, receiving-mail routing and an inbound/reply test remain pending. It does not change the existing mail adapter or activate an inbox, agent, DNS change, purchase or plan change. See the [product experience record](../product-experience.md#support-inbox-assessment) for the researched provider capabilities and pending activation evidence.

The sender can be configured without enabling Cloudflare Paid or changing maintained authentication. The provider receives recipient addresses and capability-bearing message content; tracking, token scope, retention and deletion remain material security/acceptance concerns. The real invitation, verification and recovery mailbox/authentication requirement for #71 is complete as recorded above. Workers Free's CPU suitability for default scrypt, measured full-pilot cost, Google, client onboarding and later isolation/lifecycle gates remain unresolved. No local stdio or upstream AimHarder contract changes.

Sources: [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email), [API keys](https://resend.com/docs/dashboard/api-keys/introduction), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), and [pricing](https://resend.com/pricing), checked 2026-10-18.
