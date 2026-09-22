# ADR: personal activity calendar coverage

Status: accepted for issue #8; live interval and detail comparison passed on 2026-09-22.

## Decision

Use the authenticated account's `GET https://aimharder.es/api/activityCalendar?month=<zero-based>&year=<year>` and `GET /api/activity/workout?SEID=<returned-id>` to query personal activity. The official month renderer supplies a finite date partition with `rates.ids` linking to workout details. This deliberately replaces a publication-feed scan for this feature: feed continuation is observed, but publication ordering cannot establish exhaustive record-date coverage. No arbitrary athlete, account, membership, date-filter or URL selector is forwarded.

Require the existing verified gym selection and user-confirmed zone. Validate dates and reject more than 31 inclusive dates before authentication. Retrieve each intersecting calendar month (at most three), then only the requested dates' details. Verify each detail's account identity and filter by membership `boid` using detail `boxId`. Validate full `recordDate` against the calendar date; do not use publication times or infer training start times. Preserve distinct source activity IDs, original available notes/exercises and prescription encodings. Session grouping and attendance are unverified.

Validate each complete calendar envelope and date partition before using it. The empty upstream array represents an empty month. Identical ID references within one date collapse; an ID assigned to conflicting dates invalidates the partition. Unknown envelope/day/rates metadata, including prospective continuation flags, is rejected pending investigation. Calendar detail containers are not projected: only separately validated detail fields are returned. Bound detail reads at 500 per query and disclose incomplete coverage if exceeded.

Represent coverage using `completedDates`, which lists only requested dates whose calendar partition and all referenced details were successfully interpreted and filtered. A failed first calendar partition is an error. A later partition or detail failure returns recovered entries with incomplete status and a sanitized reason, even when a partially recovered day has entries but no completed-date guarantee. Successful prior partitions are not discarded. Retrieval is not an atomic snapshot.

Extend the shared query context with one recovery allowance. Activity retries only the expired read after reauthentication and renewed verification of the same account and gym membership. Discovery expiry consumes the same allowance. Repeated expiry, failed authentication, changed identity or membership preserves earlier activity as incomplete. Other query families retain their established whole-query retry behavior. This refines the activity-specific recovery application of the [security decision](2026-09-21-credential-security-and-read-only-access.md); it does not increase retry allowances.

## Consequences

Month partitions give finite, independently verified interval coverage without guessing a feed's chronological stopping boundary. Date queries can reach older months directly; longer periods require explicit client queries. Calendar coverage concerns the available personal workout records shown by AimHarder, not attendance, unpublished/deleted records or an immutable history. The calendar is account-wide; records from another gym are excluded only after detail identity verification. Within-day training order and distinct training-session grouping remain unknown. Notes/exercises are retained; no workout title was present in the observed detail, so titles remain empty. Broader locales/account variants and upstream rate limits remain unverified. See [API research](../api-research.md) and [validation](../validation.md).
