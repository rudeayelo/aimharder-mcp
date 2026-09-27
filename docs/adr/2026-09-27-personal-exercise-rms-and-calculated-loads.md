# ADR: personal exercise RMs and calculated loads

Status: accepted for feature scope on 2026-09-27; source validation and implementation remain pending.

## Decision

Extend the post-MVP read-only scope to the authenticated account holder's own exercise records. Provide a query for one identified exercise and automatically enrich requested published workouts dated today or later with calculated loads for unambiguous `%RM` prescriptions. Use the latest recorded 1RM for the same source exercise ID, preserve the source prescription, and expose the selected record, unit, date, and calculation status. Return personal WOD-series data as separate context, never as an RM or a substitute calculation basis. A complete personal-exercise catalog and RM estimates from activity results are outside this feature.

The source exercise route, account identity, units, dates, record flags, search behavior, and joins require authorized read-only verification before implementation acceptance. Never forward an arbitrary user ID or guess a join from exercise names. Unknown, missing, or failed personal records leave the workout intact and its personal calculation explicitly unavailable. Do not infer an account-holder sex branch, workout-to-session link, gym-specific RM, or complete exercise history.

## Consequences

Clients can answer direct RM and progression questions and explain practical loads for current/future published prescriptions without presenting a derived number as an original prescription or achieved result. Personal record reads add work and require bounded retrieval, privacy validation, and partial-enrichment reporting. This proposal extends the scope of the [MVP security decision](2026-09-21-credential-security-and-read-only-access.md) and, once implemented, will replace only the current prohibition on personal `%RM` conversion in the [published-workout decision](2026-09-22-published-workout-applicability.md); those earlier documents remain accurate for the shipped behavior until then. See the [feature specification](../personal-rm-spec.md) for detailed behavior and acceptance.
