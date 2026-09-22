# ADR: historical booking state and coverage

Status: accepted for issue #7; available-view live validation passed on 2026-09-22.

## Decision

Expose history separately through `get_booking_history`, using the already allowed selected-gym `nextBookings` GET and verified membership `boid`. Reuse account identity, session retry and confirmed gym-zone protections. Upcoming history discarding remains specific to the upcoming tool; this decision extends the [upcoming-view decision](2026-09-22-upcoming-bookings-and-view-coverage.md).

Apply the independently inspected official historical renderer: `lateCancel=1` takes precedence over booked/waitlisted labels. Preserve numeric `assist`, `lateCancel` and `bookState`; attendance remains unverified for every combination. Return no invented session link. Sort dates/times newest first and preserve source language.

Represent the returned history view as limited, with null date endpoints, because no pagination contract or historical horizon is established. Distinguish complete retrieval of that view from partial interpretation: deduplicate identical projected IDs, omit conflicting identities and malformed rows, and retain valid rows with an explicit partial notice. If no row can be recovered from malformed data, or the envelope/access fails, return an error rather than empty history. Unknown envelope extensions fail closed pending investigation.

## Consequences

Clients can consult available history without treating reservations or conflicting flags as attendance. Even a successfully retrieved empty view cannot establish empty lifetime history. An observed 30 records is not a promised limit. This deliberately favors truthful limited availability over invented pagination or completeness; exhaustive history remains unverified. Fixture-tested recovery is separate from live contract evidence in [validation](../validation.md).
