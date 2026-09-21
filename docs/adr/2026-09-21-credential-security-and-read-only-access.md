# ADR: credentials and read-only operations

Status: accepted; updated for the local MVP on 2026-09-21.

## Decision

The server receives credentials through environment variables and keeps the session in memory, without persistence in the MVP. The user may load credentials from 1Password or another manager; 1Password is not a required dependency. Never include secrets in code, Git, documentation, or logs. When using 1Password, discover the item through metadata and read only the necessary fields.

On session expiration, perform at most one automatic reauthentication per request and retry the query once. Stop with a clear error on invalid credentials, 2FA, or restrictions; do not retry in a loop.

Exploration allows authentication and queries against the user's own account, not creating or canceling bookings, publishing results, or profile changes. Do not query other members' data in bulk. An explicit list of allowed operations is preferable to assuming every GET is safe. The login POST is an authentication exception, not permission for other POST requests.

## Client and agent access

Each client or agent must use its own authorized access to the secrets manager. Other clients' local paths and private configuration are excluded from public documentation.

## Future write operations

These require an explicit request, unambiguous identification of the date/session/person, compliance with gym rules, and a subsequent read of the booking or result. Do not bypass capacity limits, booking windows, credits, or access controls. Do not make real bookings to test connectivity.

## Verification and privacy

Sanitized evidence consists of the endpoint, HTTP status, structure, and minimal result. Do not store authentication headers, passwords, cookies, or full responses containing other users' information. Keep `evidence/` out of Git. Prepare separate anonymized samples and review them before publication.

## Account/gym implementation

Issue #2 implements this policy with fixed HTTPS login/discovery endpoints, an in-memory cookie jar, identity comparison, rejected redirects, bounded responses and timeouts, and sanitized errors. Authentication failures stop further login attempts until restart. See the [implementation ADR](2026-09-21-account-discovery-and-local-runtime.md) for the verified `.es` contract and [validation results](../validation.md) for the distinction between live and fixture-tested behavior.
