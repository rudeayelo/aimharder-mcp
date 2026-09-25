# ADR: read-only booking creation preparation

Status: accepted for issue #22 on 2026-09-25. Fixture-tested execution followed under [issue #23](2026-09-25-booking-creation-execution.md); live write validation remains pending.

## Decision

Add `prepare_booking_creation` as a read-only MCP tool. The caller supplies an optional accessible gym ID and an exact gym-local date, class name, start time, and end time. The API client authenticates the configured account, checks current membership, requires a user-confirmed IANA zone, and reads the requested daily schedule. The public tool does not accept an account, family, session, or reservation source ID.

The client validates the whole schedule before matching. Zero exact matches return `missing`; multiple exact matches return `ambiguous` with alternatives. One match yields a reference only when the official schedule's observed booking-button conditions have explicit supported values: `enabled=1`, `bookState=null`, `cancelledId=null`, `resadmin=0`, and `hidden=0`. Missing fields, booked, waitlisted, unknown, or unsupported rows receive no reference. These frontend conditions are evidence of an offered action, not a guarantee that the account can book or that the write contract is verified.

The preview names the gym and zone, exact class and wall times, observed state, possible credit use, unknown balance and period, and source uncertainty. An opaque 256-bit reference lives only in the server process for two minutes. Its stored snapshot binds action, account, gym, source session, and preview. A reference is consumed on inspection, including a wrong action/account/gym attempt, and cannot be reused. Issue #22 itself exposed no execution tool. The later execution tool requires explicit account-holder confirmation, consumes the reference, and rechecks membership and schedule before one candidate write. Its upstream contract remains unverified live.

For a ready 9NBC class within a two-hour gym-local wall-clock window before its start, the reported one-hour booking cutoff is shown as a gym-specific warning rather than imposed as a local rejection. The wider warning window avoids claiming an exact enforcement boundary, especially around daylight-saving transitions. Gym-local wall times are not converted to invented UTC instants. No available credit balance or entitlement period is inferred.

## Consequences

The existing read tools may still use an explicitly marked assumed zone under the [default-zone decision](2026-09-24-default-gym-time-zone.md); booking preparation requires confirmation under [the manual booking decision](2026-09-24-manual-booking-writes.md). The current public package remains read-only. Fixture tests establish tool behavior and outbound request limits, not live booking eligibility or the creation request/response contract. References are lost on restart and are not portable between server instances.
