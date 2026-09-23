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

## Class schedule extension

Issue #3 adds only the verified gym's daily schedule GET, using the current account membership's `boid` and an explicit date. It does not request participant lists or family/other-account data. Per-gym user-confirmed time zones gate date queries, and a single retry allowance covers the complete interval. See the [class-query ADR](2026-09-22-class-schedules-and-confirmed-time-zones.md).

## Upcoming-booking extension

Issue #4 adds only the verified gym's `/api/nextBookings` GET with membership `boid`. Family/account selectors are not exposed. History included in that response is discarded, and unknown states never establish absence. See the [upcoming-view decision](2026-09-22-upcoming-bookings-and-view-coverage.md); all credential, identity and retry protections remain in effect.

## Published-workout extension

Issue #5 permits the selected gym homepage, its discovered gym-publication feed, and details for returned workout IDs. Arbitrary account selectors are not exposed; comments, profiles and personal performance information are discarded. See [the applicability decision](2026-09-22-published-workout-applicability.md). Existing origin, identity, retry and secret-handling protections continue to apply.

## Historical-booking extension

Issue #7 projects the historical array from the already permitted selected-gym `nextBookings` read. The upcoming tool continues to discard it. No new endpoint, family selector or write is added; descriptive/profile fields are discarded. See [the history decision](2026-09-22-booking-history-state-and-coverage.md).

## Personal-activity extension

Issue #8 adds only the account calendar month GET and details for IDs returned by that calendar. It supplies no athlete selector and verifies detail account identity and gym membership before returning content. Incidental profile/leaderboard fields are discarded. The 2026-09-23 activity refinement allows only the current block/result description from `chartData`, matched by block ID and activity ID after account/gym verification; historical chart rows and auxiliary fields remain excluded. The single recovery allowance spans initial discovery and all calendar/detail reads; only the failed activity read is retried after renewed identity/membership verification so recovered entries survive later failure. See [the activity coverage decision](2026-09-22-personal-activity-calendar-coverage.md).
