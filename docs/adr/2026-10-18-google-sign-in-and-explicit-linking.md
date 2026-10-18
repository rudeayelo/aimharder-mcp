# ADR: Google sign-in and explicit portal account linking

Status: accepted local implementation decision on 2026-10-18 for [ticket #72](https://github.com/rudeayelo/aimharder-mcp/issues/72). Complements [hosted identity requirements](2026-10-15-hosted-identity-and-credential-custody.md), [invited password admission](2026-10-18-invited-password-admission.md) and [Resend delivery](2026-10-18-resend-transactional-delivery.md). Exact provider origin/callback update has separate operator evidence in the runbook; runtime integration and actual Google login/linking acceptance remain pending; the [runbook](../hosted-google.md) separates it from synthetic evidence.

## Context

The accepted portal supports Google and password access to one stable identity. Email equality does not prove control of an existing portal account. A library's default linking behavior alone also does not establish that the original portal session remains current while the participant completes a provider redirect. Google-only password addition must require control proof and must not use generic recovery as an admission shortcut.

## Decision

Use the existing pinned Better Auth Google redirect provider and its maintained state, S256 PKCE, code exchange, account linking and native password handling. Request only the three identity scopes. Require a strictly verified Google email, the same normalized invitation email on admission, and the same portal email on returning login/linking. Disable implicit linking, different-email linking and provider profile overwrites. Additional scopes, arbitrary authorization parameters and direct ID-token login are outside this supported flow and fail closed.

Carry the invitation capability and original linking-session ID in maintained server-controlled OAuth state. Recheck/claim the invitation atomically with the existing D1 admission policy before issuing a new participant's session. Google does not bypass revoked/expired invitations or current participant status. An accepted invitation need not be replayed for returning login.

Explicit Google linking requires the participant's original admitted session both when starting and finishing the redirect, and a session created within five minutes. Callback completion after sign-out, session revocation, account switching or freshness expiry is denied. The successful provider flow proves control of the same verified email without merging existing portal identities or changing their configuration keys.

Expose a narrow same-origin password-add adapter for a fresh, current admitted Google-only session. Delegate password policy/hashing/account creation to Better Auth's server-only setter. Keep recovery restricted to accounts that already have a password; adding the password is a separate explicit action. Add an application-owned unique `(providerId, accountId)` index to protect subject ownership/password-method creation under concurrency; fail migration rather than silently repairing duplicate identities.

Inject the existing OAuth client ID/secret through trusted platform secrets, preserving the accepted password/Resend environment. Add the isolated test origin/callback deliberately in provider configuration rather than using wildcard redirects or a preview origin. Keep the app's current Testing scope and record actual admission/consent. No deployment, purchase or plan change is authorized by this ADR alone.

## Consequences

Google and password methods share the existing portal ID. Profile preservation is observable now; later AimHarder settings/grants must continue to use that ID. The five-minute linking/addition window introduces an explicit sign-in-again step and requires restarting a flow if it expires. The original provider session cannot approve a link after portal sign-out.

The new unique index requires migration review before activation and does not merge/delete existing accounts. Maintained Google access/refresh token encryption uses the existing auth secret; this is distinct from the future AimHarder vault/key-rotation design. Native password hash parameters and local stdio behavior remain unchanged.

Public HTTP tests use real workerd/D1/Better Auth with synthetic external Google and Resend responses. They prove policy and stable identity, not actual Google setup or owner consent. Exact callback read-back, Testing eligibility, real Google sign-in and explicit linking remain separate required #72 evidence. Full client, vault, lifecycle and deployed feasibility gates remain current.
