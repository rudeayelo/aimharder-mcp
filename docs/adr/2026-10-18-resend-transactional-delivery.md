# ADR: Resend transactional delivery

Status: accepted on 2026-10-18 after the user supplied an existing Resend credential for the authorized isolated test environment, with no purchases or plan changes. Supersedes only the native Cloudflare email-provider selection in the [invited password decision](2026-10-18-invited-password-admission.md). Complements the [test-environment boundary](2026-10-18-isolated-cloudflare-test-environment.md).

## Context

The authenticated Cloudflare dashboard established Workers Free as the current plan. Native Email Sending requires Paid, while the user excludes purchases and plan changes. The owner then supplied an existing Resend token through 1Password. Admission, maintained Better Auth password hashing, verified-email policy and generic recovery must remain unchanged.

## Decision

Use Resend's documented `POST https://api.resend.com/emails` endpoint for invitation, verification and recovery mail. Configure only a platform-secret `RESEND_API_KEY` and verified `MAIL_FROM`; remove the native `EMAIL` adapter and avoid fallback selection. Restrict the existing token to the sending domain where supported. Missing, blank, partial or header-injection configuration fails closed uniformly.

Send one bearer-authenticated plain-text JSON message per explicit delivery, with a 16 KiB body limit and ten-second timeout. Reject redirects and non-success statuses. Require a nonempty message ID from at most 4 KiB of success JSON; discard error bodies. Never log or expose provider diagnostics, recipient details, authentication links or credentials. Never retry automatically after uncertainty. A successful acknowledgement means provider acceptance, not mailbox receipt; preserve safe invitation failure/revocation and generic recovery behavior.

Verify the authorized sending domain with exact provider-returned DNS records, preserving unrelated/root receiving-mail configuration. Disable open/click tracking and request enforced TLS where supported. Record requested settings separately from actual read-back. The existing account, quotas, domain verification, retention and cost must be checked without a purchase or upgrade. Current [Resend pricing](https://resend.com/pricing) lists Free as 3,000 messages/month, 100/day, three domains and 30-day retention; this is a documented allowance, not observed account capacity, retention enforcement or a bill.

Exercise production mail HTTP through the public portal and real workerd/D1 authentication policy, substituting only external provider responses. Configured-mail anonymous smoke checks omit enrollment/recovery probes entirely. Keep the original disabled-mail stage explicit rather than attempting real sends to synthetic addresses.

## Consequences

The sender can be configured without enabling Cloudflare Paid or changing maintained authentication. The provider receives recipient addresses and capability-bearing message content; tracking, token scope, retention and deletion remain material security/acceptance concerns. Real invitation, verification and recovery mailbox receipts and successful public auth flows remain required for #71. Workers Free's CPU suitability for default scrypt, measured full-pilot cost, Google, client onboarding and later isolation/lifecycle gates remain unresolved. No local stdio or upstream AimHarder contract changes.

Sources: [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email), [API keys](https://resend.com/docs/dashboard/api-keys/introduction), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), and [pricing](https://resend.com/pricing), checked 2026-10-18.
