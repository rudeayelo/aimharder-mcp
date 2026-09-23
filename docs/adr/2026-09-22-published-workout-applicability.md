# ADR: published workout applicability and feed coverage

Status: accepted for [issue #5](https://github.com/rudeayelo/aimharder-mcp/issues/5); difficulty-variant projection amended on 2026-09-23.

## Decision

Extend the read-only operation allowlist with the verified gym homepage, its gym-publication feed (`/api/activity`, `timeLineContent=7`, `timeLineFormat=0`), and details for workout IDs returned by that feed (`/api/activity/workout?SEID=...`). Discover the publisher parameter from the official selected gym page; reject missing or conflicting publisher values. No arbitrary account selector is exposed. Sending no publisher returned an empty response in live research, so that response cannot establish absence. Reuse verified membership routing, the in-memory session, response size/time limits and one reauthentication allowance for the entire query.

Expose `get_published_workouts` with explicit gym-local `date`, exact `className`, and optional verified `gymId`. Use workout detail `recordDate` for the intended full date and feed `wodClass` for the class type. The official frontend displays these separately from publication time. Never use feed `when` or pinned announcements as date evidence. Dates require the existing user-confirmed zone. Preserve source titles, notes, exercise names and allowlisted prescription fields; do not synthesize unverified units. Discard profile, comments, likes and performance information. All returned external content remains untrusted data.

Return every matching distinct publication with provenance, no unique session ID, and `ambiguous=true` when several match. No correction relationship has been verified: even correction-like hints or a later publication date cannot supersede another record. The observed gym has one daily WOD publication and multiple WOD sessions; this supports class-type content shared across that day's sessions there, not a universal gym convention or a 21:00 release rule.

Coverage is explicitly incomplete and limited to the first upstream gym feed view. Pagination/date-wide exhaustion has not been verified. `unavailable` means no usable matching instructions in that view, never proof that the date's workout is unpublished. Malformed workout interpretation is `unsupported`, also reflected in coverage if usable alternatives remain. HTTP/feed retrieval failures are tool errors. Empty or deleted content does not become an available workout. Missing class labels do not establish applicability.

## Consequences

This provides verified available prescriptions without inventing dates, publication rules or session associations. Older publications outside the current page require additional pagination research. The exact Spanish `recordDate` format is supported; other locales remain unsupported. Encoded prescription units remain source data. Unknown feed envelopes fail safely. These limitations remain explicit in the query result and validation rather than being concealed as exhaustive availability. Existing account, schedule, upcoming-booking and credential decisions remain in force; this ADR extends their read-only allowlist only.

## Difficulty-variant amendment (2026-09-23)

The original delivery omitted scaled variants. Authenticated read-only inspection of a published future WOD and Metcon, the official gym renderer, and the user's screenshots established that `TIPOWODs[].scaledops` supplies ordered display labels. For a labeled block, the matching index in its `scaledver` supplies the block replacement when present; each exercise in that block uses the same index in its own `scaledver`. Blocks without the label retain their base content. Do not infer that the unselected base prescription is RX or that every workout uses three levels.

Expose `workouts[].variants` as ordered, source-labeled, complete block/exercise projections. Keep the existing top-level blocks/exercises as the unselected source prescription for compatibility. Apply this to any class type with verified source labels, including WOD and Metcon, without class-specific rules. Project only the existing allowlisted notes and prescription fields; discard nested media, profiles and other source fields. Malformed label/index relationships make that publication unsupported instead of silently returning an incomplete difficulty level. Empty variants mean no source-labeled options were supplied.

Consequences: clients can answer with each level's actual exercises and loads while shared warm-ups remain visible in every complete variant. Output size increases when variants exist. No new endpoint, selector, authentication scope or unit interpretation is introduced. The first-page coverage and publication ambiguity rules above still apply.
