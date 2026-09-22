# ADR: upcoming bookings and view coverage

Status: accepted implementation decision for [issue #4](https://github.com/rudeayelo/aimharder-mcp/issues/4); live MCP acceptance passed on 2026-09-22.

## Context

The official gym `/diary` frontend requests `/api/nextBookings` with membership `boid` as `box`. It renders `nextClasses` as upcoming reservations, labels state 1 as booked and 0 as waitlisted, and treats an empty collection as no pending classes. Its separate `history` collection is not the upcoming view. No upcoming pagination control or calendar horizon was observed. The live upcoming identifier did not equal the matching daily schedule's session or class-type identifier.

## Decision

Add only GET `/api/nextBookings?box=<verified-membership-boid>` at the selected verified gym to the client's operation allowlist. Do not supply family/account selectors. Reuse identity checks, per-query membership discovery, serialization, bounded bodies, sanitized errors, and one reauthentication allowance. This extends the allowlist in the [account runtime decision](2026-09-21-account-discovery-and-local-runtime.md) and [class decision](2026-09-22-class-schedules-and-confirmed-time-zones.md); their other behavior remains unchanged.

Expose `get_upcoming_bookings` separately from the reusable client, with optional `gymId`. Require the existing confirmed gym zone. Return `sourceBookingId`, but keep `sessionId` and class-type ID null: the observed ID is not a verified session join key. Preserve source class names when available, otherwise return null. Do not use source gym names or postal addresses as access identifiers.

Normalize only the observed Spanish full-date label, validating the calendar date and weekday; reject unsupported locales rather than guessing. Preserve its original label and time label alongside gym-local date, start time and named zone. Do not synthesize offsets or resolve DST ambiguity.

Map 1 to `booked`, 0 to `waitlisted`, and every other/missing state to `unknown`. `bookingStatus` is `booked` when at least one confirmed reservation exists, otherwise `unknown` if any state is unknown, otherwise `none`. The entries retain every state independently; a booked result does not establish that all other entries are understood. Waitlisting is not a confirmed reservation; neither state establishes attendance.

Coverage is `complete` only for the successfully validated `upstream-upcoming-view`, with null date endpoints. It is **not** a verified interval or unlimited future horizon. `none` is scoped to that view and cannot establish no relevant booking for an arbitrary requested date. A later combined query must obtain adequate date coverage before making that stronger claim. Unknown envelope fields (including potential pagination), malformed rows, duplicate IDs, restrictions or failures return an error without a partial/empty successful result. History is discarded without interpretation.

## Consequences

This preserves usable upcoming reservations without inventing session links, dates or state meanings. A consuming client can compare gym, date, time and class name, but must retain ambiguous matches. Unrecognized locales require further evidence and implementation. Strict envelope validation may reject an upstream extension until investigated. There is no implemented partial-page recovery for this non-paginated view; the personal-activity partial-page requirement is unchanged.

The frontend and one real account/gym establish the observed contract. Multi-gym routing, waitlist/unknown/empty responses, expiry and failure variants are fixture-tested; they were not manufactured against the live account. The official SDK stdio harness compared the actual reservation against both the upcoming response and an independent daily schedule without equating their identifiers. See [validation](../validation.md).
