# ADR: read-only cancellation preparation from a daily reservation

Status: accepted for issue #24 on 2026-09-25. Cancellation execution and live contract validation remain pending in #25–#27.

## Decision

Expose `prepare_booking_cancellation` as a read-only MCP tool with the exact class name, gym-local date, start and end time, and optional accessible gym. Require the configured account's current membership and a user-confirmed IANA gym zone. Read its daily schedule and validate the complete response. A unique exact row receives a short-lived reference only when it reports booked state, a positive schedule reservation `idres`, and explicit supported cancellation flags. An upcoming-booking ID is not treated as a schedule reservation join. Ambiguous, missing, cancelled, waitlisted, inaccessible, or unsupported rows receive no executable reference. Source identifiers remain internal.

The preview shows the gym, class, local times, current booked state, possible credit loss, and unknown balance/entitlement period. At 9NBC, warn at or inside its published 90-minute credit-loss boundary using the possible instants of gym-local wall time. At a daylight-saving transition, warn if any possible instant is inside the boundary; do not claim the source supplied an exact UTC class instant. Do not extend this rule to other gyms or turn it into a claim about exact API enforcement. A 256-bit in-memory reference expires after two minutes, binds the account, gym, reservation and preview, and is single-use. The initial cancellation POST is never used as a preflight because the official frontend indicates it may itself cancel.

## Consequences

No cancellation POST or late attempt is available under this issue. Fixtures establish public MCP behavior but do not verify live `idres` shape, eligibility, credit balance, or cancellation response semantics. The published npm package remains read-only; the checkout's cancellation preview is a later feature phase. Issue #25 must recheck the reservation and obtain explicit action-time confirmation before any cancellation write.
