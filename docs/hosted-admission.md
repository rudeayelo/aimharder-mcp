# Invited password portal

Implementation for [ticket #71](https://github.com/rudeayelo/aimharder-mcp/issues/71), part of [specification #69](https://github.com/rudeayelo/aimharder-mcp/issues/69). No production pilot is deployed. Synthetic checks do not complete the ticket's actual-email-delivery criterion; #71 remains open until sender setup and delivery evidence exist. A separately authorized [isolated test environment](hosted-test-environment.md) records deployment setup and actual provider observations. Architecture: [admission decision](adr/2026-10-18-invited-password-admission.md).

## Participant and administrator behavior

The administrator opens `/admin/invitations`, enters a participant's portal email and sends an invitation. It expires in seven days. The list shows at most 100 recent invitations with recipient, status and expiry; unused invitations can be revoked. Invitations accepted by ordinary participants grant `user`, irrespective of supplied role fields. There is no diagnostics, credential-viewing, sporting-data or impersonation panel.

The participant follows their emailed invitation to `/accept-invitation`, enters that same email and chooses a separate portal password. The verification email must be followed before password sign-in. A direct native signup request is also gated by the invitation; using the HTML form is not the security boundary. Uninvited, wrong-address, expired or revoked attempts cannot join. Revocation/expiry between signup and verification prevents admission. Ask the administrator for a new invitation; accepting it replaces only the earlier unverified pending identity and its credentials. An old delivery cannot verify the replacement.

`/sign-in`, `/resend-verification`, `/recover` and `/reset-password` provide maintained login, verification resend and recovery. Verification and recovery links last one hour. Recovery messages are generic; mail is attempted only for an active, verified participant who already has a portal password. With a configured sender, eligible, unknown, pending and social-only addresses receive the same native/HTML status and message even if delivery fails; the HTML copy conditions receipt on eligibility and delivery availability and offers retry/help without claiming delivery. Recovery preserves the portal identity, works after an already-accepted invitation expires and signs out existing sessions. Google-only accounts must use explicit linking in the later Google slice rather than obtain a password through recovery. Reused/expired reset links fail. Missing mail configuration produces a uniform safe unavailable outcome; invitation/verification delivery failures also report unavailable. Provider errors are not logged.

## Local checks and anonymous preview

Install root and `hosted/` dependencies as described in [hosted setup](../hosted/README.md), then run from `hosted/`:

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

The preview starts the production entry at `http://127.0.0.1:8787` with disposable D1, a fresh random secret, no identity, no mail sender and a deny-all external network boundary. It cannot contact AimHarder, Google or email providers. Stop it to discard its state. Set `PREVIEW_PORT` if needed. For a shared review, preserve existing Tailscale routes, proxy a free Tailscale Serve path/port to this loopback port, and set `PREVIEW_BASE_URL` to the corresponding HTTPS origin before starting. Share the Tailscale URL rather than a local-only link. This is a local anonymous review, not permission to deploy Cloudflare or enable a sender.

## Required runtime and sender setup

Supply `AUTH_DB`, a platform-secret `AUTH_SECRET` and a fixed HTTPS-origin `BASE_URL`. Apply `hosted/migrations/0001-auth.sql` and `0002-invitations.sql` in order to the intended database only after environment authorization. The generated maintained auth schema is separate from application admission tables. Native password hashing is unchanged. The [runtime gate](hosted-feasibility.md) still applies; the production account resolver remains unconnected. The [test-environment record](hosted-test-environment.md) distinguishes actually performed isolated setup from the sender work still pending below.

Selected delivery method: Cloudflare Email Service's structured [Workers binding](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/), available with the accepted Workers Paid candidate. It avoids new provider-account and sending-key provisioning. Add a `send_email` binding named `EMAIL`, restricted by its [sender settings](https://developers.cloudflare.com/email-service/configuration/send-bindings/) to the owner-approved address, and set `MAIL_FROM` to that address. `noreply@ahmcp.link` remains an example, not a configured or approved identity. No fallback console sender or public mail-inspection route exists.

In a separately authorized environment:

1. Inspect existing Cloudflare Email Service access/eligibility and the actual Workers plan without changing billing. If account activation or purchase is required, request that precise owner action before proceeding.
2. Choose/confirm the sender identity under `ahmcp.link`. Follow [sending-domain onboarding](https://developers.cloudflare.com/email-service/get-started/send-emails/); inspect existing DNS before changes. Configure exactly the provider-required ownership, DKIM and SPF/Mail-From records, preserve unrelated mail records, and record verification status. Do not invent record values from documentation examples.
3. Install the restricted `EMAIL` binding and `MAIL_FROM` only after sender verification. Do not put secret values, raw email links, cookies or real participant data in source, terminal output, tracker comments or logs. Platform send success is not mailbox-delivery evidence.
4. Prepare/apply the one-time owner bootstrap below and deliver its private invitation using the configured sender through a trusted operator context. Prove mailbox ownership through the normal verification flow; there is no public admin signup.
5. Record receipt of invitation, verification and recovery in an owner-approved mailbox, including sanitized timestamps/outcomes and any still-required activation. Verify all three flows without publishing links/recipient details. Distinguish requested delivery, provider acceptance, mailbox receipt and successful public auth behavior. Leave unobserved stages pending.

The selected [pricing](https://developers.cloudflare.com/email-service/platform/pricing/) includes 3,000 outbound messages/month on Workers Paid, then USD 0.35/1,000. The pilot estimate allows at most 200/month; the beta's actual account eligibility, quotas, abuse protections, taxes/currency, bill and deliverability are not measured. This is USD 0 incremental within the inclusion, not a verified cost or spending cap. A material eligibility/cost failure requires revisiting the sender choice.

## Read-only provider readiness (2026-10-18)

After the local implementation, a separate operator check used the existing 1Password service-account environment and Cloudflare credential in memory. Only metadata and Cloudflare GET requests were used; secret values, account/zone identifiers and raw provider responses were not retained in repository evidence. The account-owned token is active, verified through the account-token endpoint. The user-token verification endpoint is inapplicable to this token type.

| Boundary | Observed result |
| --- | --- |
| Account and `ahmcp.link` zone discovery | HTTP 200; the intended account matches and the zone is active, not paused |
| Workers subdomain and script listing | HTTP 200; subdomain configured, three existing scripts, no proposed test worker |
| D1 lookup for proposed test database | HTTP 200; no matching database |
| Zone Worker routes and DNS listing | HTTP 200; no routes or DNS records in this zone |
| Account subscriptions | HTTP 403 / code 10000; paid-plan and billing status remain unknown |
| Email Sending subdomain listing | HTTP 403 / code 10000; sender configuration and effective email access remain unknown |

Successful reads do not prove creation, deployment, secret injection or DNS-write permissions. No token permission was expanded, resource created, DNS changed, email sent or billing enabled. Sender/DNS setup and real delivery still require the authorized environment and sufficient provider access. The [subscription API](https://developers.cloudflare.com/api/resources/accounts/subresources/subscriptions/methods/get/) requires Billing Read or Write; read-only visibility is sufficient for the prerequisite plan check. Email Sending access must be checked against the account's current capability rather than inferred from generic DNS access.

The concrete proposed test environment is a new Worker `aimharder-mcp-pilot-test`, a dedicated D1 database `aimharder-mcp-pilot-test-auth`, and HTTPS origin `https://pilot-test.ahmcp.link`. It would apply the two committed migrations, use a fresh platform-secret `AUTH_SECRET`, and bind only the owner-approved email sender. `noreply@ahmcp.link` is the proposed sender; the receiving owner mailbox had not yet been identified at that inspection. The user subsequently supplied it privately; it is excluded from repository evidence. Existing scripts and the root service origin would remain outside this test environment. Real upstream credentials, Google integration and MCP client onboarding belong to later tickets.

This was the reviewable proposal at the time of the read-only inspection. The user subsequently authorized creating the isolated test environment without purchases or plan changes. Its [separate runbook and evidence](hosted-test-environment.md) record the dedicated D1 and Worker deployment, actual anonymous HTTPS checks and remaining sender gate. The mail binding stays absent while access/eligibility is unresolved. Any paid activation or broader token grant still needs its own precise owner approval. The ticket must eventually observe invitation, verification and recovery receipt; provider acceptance alone is insufficient.

## Trusted owner bootstrap

There is no HTTP bootstrap endpoint. From a trusted local checkout, set `PORTAL_OWNER_EMAIL`, the fixed HTTPS `BASE_URL` and an absolute `OWNER_BOOTSTRAP_OUTPUT_DIR` outside the checkout, then run `pnpm owner:prepare` from `hosted/`. Its trusted parent directory must already exist. Use securely supplied environment configuration; do not paste real values into shared commands/logs. The command requires a fresh output directory and creates files with mode `0600` under a directory created with mode `0700`; existing output directories are rejected without writing or changing their permissions:

- `owner-bootstrap.sql`: a single atomic insert with email and invitation digest, no raw token. The unique owner-bootstrap constraint prevents multiple owner invitations or public role selection. Apply this only to the authorized database, after its migrations.
- `owner-invitation.json`: the private recipient/link/delivery artifact, expiring seven days after preparation. Deliver it via the configured sender from a trusted operator context and delete the artifact after use; never commit, display or attach it to a ticket.

Preparation has no network side effects, applies no SQL and sends no email. Re-running into existing files fails; after a lost/expired bootstrap, recovery is an offline operator task rather than a public bypass. Do not change the role/index to create another public owner. The owner becomes admin only after the normal verification/admission claim.

## Public HTTP contract

HTML forms use `/portal/*` POST routes with same-origin checks and maintained auth handlers. The maintained `/api/auth/*` routes remain public, and enforce the same admission/session policy. Programmatic signup sends the invitation capability in `x-portal-invitation`; neither listing nor subsequent account/session APIs return it. Email matching lowercases strings without alias expansion.

| Route | Access / behavior |
| --- | --- |
| `GET /api/portal/invitations` | Current verified active admin; returns recent recipients, status and expiry, never token digests/links |
| `POST /api/portal/invitations` | Same-origin admin; JSON `{ "email": "participant@example.invalid" }`; ordinary role only; 201 after sender accepts, 503 on failure |
| `POST /api/portal/invitations/:id/revoke` | Same-origin admin; atomically revoke unused invitation; 409 if already accepted/revoked/missing |
| `POST /api/auth/sign-up/email` | Maintained signup plus current email-bound invitation; verification required; no signup session |
| `GET /api/auth/verify-email` | Maintained token validation plus bound delivered capability/current invitation claim |
| `POST /api/auth/request-password-reset` | Generic result; recovery mail only for existing verified admitted credential identity |
| `POST /api/auth/reset-password` | Maintained one-use reset, current admission/credential check, stable ID and session revocation |

## Local evidence and remaining acceptance

The workerd/D1 HTTP harness uses real Better Auth handlers and durable admission decisions. Only the external sending boundary is replaced; captured messages stay in test-process memory. Eleven portal scenarios cover owner verification, invited users, role injection, anonymous/user admin denial, uninvited/wrong-address signup, revoke before signup/verification, expiry at both stages, accepted-invite expiry recovery, revoke-versus-verify/concurrent verify, reinvitation generation, recovery/session revocation/replay/expiry, social-only recovery denial, delivery failure/resend, HTML forms/CSRF, production missing-sender/fixture-route denial, and identical native/HTML recovery outcomes across eligibility classes during a configured sender failure. The three prior hosted OAuth/MCP scenarios still pass. The production bundle excludes test provisioning and has no email-inspection endpoint.

Limited native Chrome QA separately checked the anonymous sign-in layout and recovery form through Tailscale HTTPS. The actual form submission reaches the safe unavailable-email result. Pages use origin-only `strict-origin` referrers: this protects URL capabilities while preserving same-origin form POST Origin headers; null/foreign origins remain rejected. No verified browser login was performed.

The automated journeys remain synthetic local checks, not actual mailbox, Google, ChatGPT, Hermes or live AimHarder acceptance. The root stdio package remains separately checked. Remaining ticket #71 acceptance is actual sender/DNS setup and all three real email receipts in an authorized environment. Subsequent tickets retain Google/linking, vault/configuration, full MCP OAuth/client journeys, role/lifecycle controls and deployed cost/security validation. The read-only inspection above preceded the separately authorized [isolated environment work](hosted-test-environment.md); remote resource observations are recorded there. No real email was sent.
