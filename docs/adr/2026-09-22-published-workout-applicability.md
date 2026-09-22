# ADR: published workout applicability and feed coverage

Status: accepted for [issue #5](https://github.com/rudeayelo/aimharder-mcp/issues/5).

## Decision

Extend the read-only operation allowlist with the verified gym homepage, its gym-publication feed (`/api/activity`, `timeLineContent=7`, `timeLineFormat=0`), and details for workout IDs returned by that feed (`/api/activity/workout?SEID=...`). Discover the publisher parameter from the official selected gym page; reject missing or conflicting publisher values. No arbitrary account selector is exposed. Sending no publisher returned an empty response in live research, so that response cannot establish absence. Reuse verified membership routing, the in-memory session, response size/time limits and one reauthentication allowance for the entire query.

Expose `get_published_workouts` with explicit gym-local `date`, exact `className`, and optional verified `gymId`. Use workout detail `recordDate` for the intended full date and feed `wodClass` for the class type. The official frontend displays these separately from publication time. Never use feed `when` or pinned announcements as date evidence. Dates require the existing user-confirmed zone. Preserve source titles, notes, exercise names and allowlisted prescription fields; do not synthesize unverified units. Discard profile, comments, likes and performance information. All returned external content remains untrusted data.

Return every matching distinct publication with provenance, no unique session ID, and `ambiguous=true` when several match. No correction relationship has been verified: even correction-like hints or a later publication date cannot supersede another record. The observed gym has one daily WOD publication and multiple WOD sessions; this supports class-type content shared across that day's sessions there, not a universal gym convention or a 21:00 release rule.

Coverage is explicitly incomplete and limited to the first upstream gym feed view. Pagination/date-wide exhaustion has not been verified. `unavailable` means no usable matching instructions in that view, never proof that the date's workout is unpublished. Malformed workout interpretation is `unsupported`, also reflected in coverage if usable alternatives remain. HTTP/feed retrieval failures are tool errors. Empty or deleted content does not become an available workout. Missing class labels do not establish applicability.

## Consequences

This provides verified available prescriptions without inventing dates, publication rules or session associations. Older publications outside the current page require additional pagination research. The exact Spanish `recordDate` format is supported; other locales remain unsupported. Scaled variants are not projected, and encoded prescription units remain source data. Unknown feed envelopes fail safely. These limitations remain explicit in the query result and validation rather than being concealed as exhaustive availability. Existing account, schedule, upcoming-booking and credential decisions remain in force; this ADR extends their read-only allowlist only.
