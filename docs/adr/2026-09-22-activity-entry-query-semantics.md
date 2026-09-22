# ADR: activity entries as the recent-query and frequency unit

Status: accepted by the user on 2026-09-22; supersedes the recent and period composition semantics in [the calendar decision](2026-09-22-personal-activity-calendar-coverage.md). Calendar access, coverage and recovery decisions remain in effect.

## Decision

Interpret the conversational request for the last five training sessions in issue #9 as the last five **activity entries**, as explicitly clarified by the user. The user also confirmed that the previous-month frequency question in issue #10 means the number of **activity entries** recorded in that period. No grouping into physical training sessions, class matching or attendance inference is required. Distinct source IDs count separately on the same date; repeated references to one source ID count once, and conflicting identities remain invalid.

Recent queries keep bounded backward windows of at most 31 inclusive gym-local dates, but stop after recovering the requested number of entries rather than days. Return a flat entry list of at most the requested count with original details. Sort by record date descending and use source ID ascending only for deterministic same-date presentation. Within-date chronology is unverified. If the requested cutoff splits a date tie, explicitly report the selected/omitted counts and date, and do not claim a uniquely verified latest selection. Complete newer coverage remains necessary for any verified latest claim. Empty, sparse and partial results keep their retrieval limits.

Period queries use activity entries as the primary counting basis; retain days with activity as a separate supplementary measure. Exact entry totals, including zero, require complete interval coverage. Incomplete results keep recovered counts with null exact totals. The former blocked training-session result is removed from both consuming-client outputs because physical-session reconstruction is not the requested feature.

## Consequences

Issues #9 and #10 can be accepted using the existing independently verified account calendar/detail contract, entry identities and coverage. The scope clarification removes the former grouping blocker; it does not claim new upstream session, attendance or timestamp semantics. The source activity tool can still expose null physical-session/time fields as honest data limitations. Authentication, read-only access, gym selection, the 31-date query limit and partial recovery remain unchanged. Consumers must update from the former day-based #9 output and must use the explicit entry basis. Tests and separate live MCP comparisons validate the revised unit before closure.
