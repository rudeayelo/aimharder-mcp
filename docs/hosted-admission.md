# Invited password portal

Implementation for [ticket #71](https://github.com/rudeayelo/aimharder-mcp/issues/71), part of [specification #69](https://github.com/rudeayelo/aimharder-mcp/issues/69). No production pilot is deployed. The current Workers plan is verified as Free. The user supplied an existing Resend token to replace the unavailable native sender without purchases or plan changes. The Resend sending domain is verified and the owner invitation is provider-confirmed delivered. Actual mailbox receipt and the verification/recovery authentication flows remain a separate acceptance gate. Synthetic checks do not complete the ticket's actual-email-delivery criterion; #71 remains open until sender setup and delivery evidence exist. A separately authorized [isolated test environment](hosted-test-environment.md) records deployment setup and actual provider observations. Architecture: [admission decision](adr/2026-10-18-invited-password-admission.md) and its [Resend delivery replacement](adr/2026-10-18-resend-transactional-delivery.md).

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

Selected delivery method: Resend's maintained [send-email HTTP API](https://resend.com/docs/api-reference/emails/send-email). Supply `RESEND_API_KEY` as a platform secret and `MAIL_FROM` as the verified sending address. Restrict the key to sending from the selected domain when supported by the existing account. The production code has one fixed `https://api.resend.com/emails` destination and no native-mail or console fallback. Missing, blank or partial configuration disables enrollment, verification resend and recovery uniformly. There is no public mail-inspection route.

Each send uses one HTTPS POST with bearer authentication, JSON recipient array and plain-text content. Requests are limited to 16 KiB and ten seconds; redirects are rejected. A successful response must contain a nonempty bounded message ID within a 4 KiB JSON acknowledgement. Error bodies are discarded; provider messages, links, credentials and recipient details are neither logged nor exposed. Acknowledgement establishes provider acceptance, not mailbox receipt. Sends are not retried automatically, including after ambiguous transport failure. A failed invitation is revoked; recovery retains generic eligible/ineligible outcomes.

1. Use the existing owner-supplied Resend credential through 1Password in a trusted operator process. Inspect account/domain eligibility and existing DNS without changing a plan or purchasing capacity.
2. Verify the chosen `ahmcp.link` sending domain using only exact provider-returned DNS records. Preserve existing unrelated DNS and root receiving-mail records. Disable click/open tracking so authentication capabilities are not rewritten or tracked; request enforced TLS where available. Record actual settings read-back and verification separately from requested changes.
3. After verification, inject the restricted `RESEND_API_KEY` platform secret and verified `MAIL_FROM` into the dedicated test Worker. Do not place secrets, raw links, cookies or real participant data in source, terminal output, tracker comments or logs.
4. Prepare/apply the one-time owner bootstrap below and deliver its private invitation through a trusted operator context. Prove mailbox ownership through normal verification; there is no public admin signup.
5. Record actual invitation, verification and recovery receipt in the approved mailbox and successful public authentication flows. Distinguish request, provider acknowledgement, mailbox receipt and completed auth behavior. Leave unobserved stages pending.

Current [Resend Free pricing](https://resend.com/pricing), checked 2026-10-18, lists 3,000 messages/month, 100/day, three domains and 30-day data retention. The pilot planning allowance is at most 200/month, but actual account eligibility, shared usage, retention/deletion controls, delivered volume and bill remain unverified. No paid fallback or upgrade is authorized. Free email availability does not establish that Workers Free's CPU allowance supports maintained password hashing or that the complete pilot fits its cost target.

## Configured Resend stage (2026-10-18)

The authorized operator created the `ahmcp.link` sending domain in Resend's `eu-west-1` region and installed exactly four provider-returned Cloudflare DNS records: a DKIM TXT at `resend._domainkey`, SPF/mail-from MX and TXT at `send`, and a CNAME at `rsend`. Public DNS matched the returned records. Fresh Resend reads reported the domain and all four records verified, with open and click tracking disabled. Enforced TLS was accepted by the provider update API, but subsequent domain reads omit the field, so its persisted read-back is unconfirmed. No root receiving MX or unrelated records were changed.

The reviewed production bundle was deployed to the dedicated Worker on the unchanged Workers Free plan. Fresh settings read-back confirmed exactly the existing database/auth/base-origin bindings plus `MAIL_FROM` and a secret-text `RESEND_API_KEY`; the existing `AUTH_SECRET` was preserved. Private temporary upload-secret files were removed. All eleven configured-mail anonymous checks passed at the actual HTTPS origin, with no enrollment/recovery probes or additional mail sends.

One private singleton-owner bootstrap insert was applied to the dedicated D1. Its invitation send returned HTTP 200 with a message acknowledgement; a later outgoing-message read reported `last_event: delivered`. This is provider evidence of delivery to the recipient's mail system, not confirmation that the owner received/read it. At the last operator read before the owner journey, there were zero users, verified identities and participants: creating the invitation does not create an administrator account. Owner acceptance, choosing the private password, mailbox verification and sign-in remain pending. No verification or recovery message has yet been observed. No purchase, plan change, permission expansion, real AimHarder credential or upstream action occurred. #71 stays open.

## Read-only provider readiness (2026-10-18)

After the local implementation, a separate operator check used the existing 1Password service-account environment and Cloudflare credential in memory. Only metadata and Cloudflare GET requests were used; secret values, account/zone identifiers and raw provider responses were not retained in repository evidence. The account-owned token is active, verified through the account-token endpoint. The user-token verification endpoint is inapplicable to this token type.

| Boundary | Observed result |
| --- | --- |
| Account and `ahmcp.link` zone discovery | HTTP 200; the intended account matches and the zone is active, not paused |
| Workers subdomain and script listing | HTTP 200; subdomain configured, three existing scripts, no proposed test worker |
| D1 lookup for proposed test database | HTTP 200; no matching database |
| Zone Worker routes and DNS listing | HTTP 200; no routes or DNS records in this zone |
| Account subscriptions | HTTP 403 / code 10000; plan/billing status unknown at this API-only inspection; later UI evidence below establishes Free |
| Email Sending subdomain listing | HTTP 403 / code 10000; sender configuration and effective email access remain unknown |

Successful reads do not prove creation, deployment, secret injection or DNS-write permissions. No token permission was expanded, resource created, DNS changed, email sent or billing enabled. Sender/DNS setup and real delivery still require the authorized environment and sufficient provider access. The [subscription API](https://developers.cloudflare.com/api/resources/accounts/subresources/subscriptions/methods/get/) requires Billing Read or Write; read-only visibility is sufficient for the prerequisite plan check. Email Sending access must be checked against the account's current capability rather than inferred from generic DNS access.

The concrete proposed test environment is a new Worker `aimharder-mcp-pilot-test`, a dedicated D1 database `aimharder-mcp-pilot-test-auth`, and HTTPS origin `https://pilot-test.ahmcp.link`. It would apply the two committed migrations, use a fresh platform-secret `AUTH_SECRET`, and bind only the owner-approved email sender. `noreply@ahmcp.link` is the proposed sender; the receiving owner mailbox had not yet been identified at that inspection. The user subsequently supplied it privately; it is excluded from repository evidence. Existing scripts and the root service origin would remain outside this test environment. Real upstream credentials, Google integration and MCP client onboarding belong to later tickets.

This was the reviewable proposal at the time of the read-only inspection. The user subsequently authorized creating the isolated test environment without purchases or plan changes. Its [separate runbook and evidence](hosted-test-environment.md) record the dedicated D1 and Worker deployment, actual anonymous HTTPS checks and remaining sender gate. At that initial deployment the mail configuration stayed absent. A later authenticated dashboard inspection established Workers Free as the current plan and Email Sending as a Paid capability. No upgrade was selected; native delivery was blocked by the no-plan-change instruction. The later owner-supplied Resend choice above supersedes that sender selection. Any paid activation or broader token grant still needs its own precise owner approval. The ticket must eventually observe invitation, verification and recovery receipt; provider acceptance alone is insufficient.

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

The workerd/D1 HTTP harness uses real Better Auth handlers and durable admission decisions. The production Resend HTTP request is exercised with only external provider responses substituted; captured messages stay in test-process memory. Fourteen portal scenarios cover owner verification, invited users, role injection, anonymous/user admin denial, uninvited/wrong-address signup, revoke before signup/verification, expiry at both stages, accepted-invite expiry recovery, revoke-versus-verify/concurrent verify, reinvitation generation, recovery/session revocation/replay/expiry, social-only recovery denial, delivery failure/resend, HTML forms/CSRF, production missing-sender/fixture-route denial, identical native/HTML recovery outcomes across eligibility classes during a configured sender failure, Resend redirect/credential/rate-limit rejection without retries, partial configuration and bounded provider acknowledgement. The three prior hosted OAuth/MCP scenarios still pass. The production bundle excludes test provisioning and has no email-inspection endpoint.

Limited native Chrome QA separately checked the anonymous sign-in layout and recovery form through Tailscale HTTPS. The actual form submission reaches the safe unavailable-email result. Pages use origin-only `strict-origin` referrers: this protects URL capabilities while preserving same-origin form POST Origin headers; null/foreign origins remain rejected. No verified browser login was performed.

The automated journeys remain synthetic local checks, not actual mailbox, Google, ChatGPT, Hermes or live AimHarder acceptance. The root stdio package remains separately checked. Sender/DNS setup now has separate operator evidence above; remaining ticket #71 acceptance is actual invitation mailbox receipt and complete verification/recovery mailbox and authentication flows in the authorized environment. Subsequent tickets retain Google/linking, vault/configuration, full MCP OAuth/client journeys, role/lifecycle controls and deployed cost/security validation. The read-only inspection above preceded the separately authorized [isolated environment work](hosted-test-environment.md); remote resource observations are recorded there. The earlier synthetic/local stage sent no real email; the later configured stage above records the single owner invitation.
