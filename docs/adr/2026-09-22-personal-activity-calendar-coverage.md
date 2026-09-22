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

## Recent activity composition (issue #9)

Status: accepted implementation boundary; distinct-training-session acceptance remains blocked.

Compose existing MCP queries in a consuming client, keeping the API client and MCP server unchanged. The requested recent-session experience cannot be claimed from current evidence. Return a separately labelled days-with-activity alternative, with an explicit blocked training-session result. A date may represent several sessions or several records from one session; no grouping is inferred from matching dates, exercises or bookings.

Search backward from an explicit gym-local end date using nonoverlapping intervals of at most 31 inclusive dates, defaulting to three windows and limiting configuration to twelve. Stop when enough distinct days are recovered, a window fails/is incomplete, or the bound is reached. Return every entry on each selected date, deduplicate source identity, reject conflicting repeated identities and make no within-day chronology claim. Retain earlier recovered alternatives after failure, but never verify a latest result over a newer gap. Return window coverage and the searched start date; sparse/empty bounded history does not prove exhaustion. These limits bound client work and are not upstream retention limits.

Consequences: useful recent content is available without silently substituting entries/days for training sessions. Session grouping, attendance and within-day time remain blockers for #9. No new allowed endpoint, authentication policy, persistent cache, natural-language tool or server coupling is introduced. Live comparison validates five recent days, not five training sessions.

## Period frequency composition (issue #10)

Status: accepted implementation boundary; distinct-training-session-total acceptance remains blocked.

Compose the same existing MCP queries in a consuming client. Resolve the previous full calendar month only after establishing the selected gym and confirmed zone. Explicit intervals are partitioned into consecutive windows of at most 31 dates, without overlap; repeated calendar month reads are filtered to each window. Deduplicate source identity and reject conflicting repeated identities without collapsing different IDs with matching content. A shared runtime validator checks gym, zone, requested interval and completed-date coverage for both recent and period consumers.

Expose separate observed activity-entry and day counts, with exact alternative totals only when every requested date has complete coverage. Stop on a failed/incomplete window and preserve earlier/recovered entries. A configurable 1–12-window budget (default 12) also stops retrieval with incomplete coverage when needed. This is a consuming-client work bound, not an upstream access/history limit. Incomplete counts are labelled recovered lower bounds, never exact period totals. Return entries, individual window coverage and completed dates so another compatible client can explain the alternative accurately.

Consequences: calendar coverage can establish available entry/day counts, including zero for complete empty periods, but cannot establish a distinct training-session total or attendance. Always return an explicitly blocked training-session result with a null count. No new endpoint, account scope, authentication, server tool, or persistence decision is introduced. Issue #10 remains open until grouping/counting semantics can be verified. The separate live check verifies previous-month empty coverage and an additional nonempty period's record/day basis; it does not substitute either for the unmet training-session requirement.
