# AimHarder MCP server MVP

Scope confirmed 2026-09-21 in [issue #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). All planned query features are implemented. The user accepted first-release functional QA on 2026-09-24 using the evidence in [validation](validation.md). The package is published on npm and the exact registry artifact passed a live MCP check. Recent and period summaries count **activity entries**, as the user clarified.

## Product and users

A local TypeScript MCP server for one AimHarder account per instance. It works through compatible MCP clients without a dedicated app integration.

Distribution: [GitHub](https://github.com/rudeayelo/aimharder-mcp) under [MIT](../LICENSE) and the public [`aimharder-mcp`](https://www.npmjs.com/package/aimharder-mcp) npm package. See the [distribution ADR](adr/2026-09-22-npm-distribution-for-mvp.md) and [README](../README.md).

Domain terms are defined in the root [glossary](../CONTEXT.md).

## Features

- Query class schedules, occupancy and capacity by date.
- Retrieve published workouts, difficulty variants and verified prescription units. A workout may cover several sessions; publication time does not establish its intended date. The reported 21:00 publication pattern at 9NBC is not a general rule.
- Query upcoming bookings and available booking history, preserving state and coverage limits.
- Query personal activity with recorded block results and source prescriptions. Each call covers at most 31 inclusive dates; clients can compose longer periods. Exercise-specific analysis is outside scope.

Example questions include tomorrow's WOD, this week's classes, Wednesday's 07:00 Metcon occupancy, upcoming bookings, the last five activity entries and last month's entry count. Occupancy is not attendance.

The user defined recent/frequency questions as queries over distinct **activity entries**. Several entries on one day count separately; days with activity are supplementary. Entries do not prove physical training sessions or attendance. Expose incomplete coverage and unknown within-day order.

## Reference experience: tomorrow's WOD

For tomorrow's WOD, return applicable published instructions and any confirmed relevant booking times.

At 9NBC, the user reports one daily WOD shared across class sessions. Do not infer a unique workout-to-session link or apply that convention to every gym. Use the workout's intended date, not its publication timestamp.

The upcoming-booking view has no verified date horizon, so an absent match cannot prove no booking on a given date. If booking lookup fails, retain available workout content and mark booking status unconfirmed.

If several workouts match, show each with provenance; do not guess that the newest corrects another. Keep booking times separate from ambiguous workouts.

## First functional delivery

The first delivery covers authentication, gym selection, classes, future workout content, upcoming bookings, safe errors, setup and tests. A client composes “What is tomorrow's WOD, and when am I booked?” from those tools.

Booking history and personal activity followed within the same MVP. Separate live checks covered current and future publications, an actual booking and the combined client's uncertainty handling. The user accepted aggregate evidence and manual Hermes QA for [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). The exact single-run combined future-content check was **not performed**. See [examples](development.md#run-and-inspect-locally), [validation](validation.md) and the [QA decision](adr/2026-09-24-functional-qa-evidence-for-first-release.md).

## Implementation tickets

This is the approved dependency plan in GitHub Issues, not a live status table.

| Ticket | Blocked by |
| --- | --- |
| [#2: Connect an account and select an accessible gym](https://github.com/rudeayelo/aimharder-mcp/issues/2) | None |
| [#3: Query class schedules and session occupancy](https://github.com/rudeayelo/aimharder-mcp/issues/3) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#4: Query upcoming bookings](https://github.com/rudeayelo/aimharder-mcp/issues/4) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#5: Query published workouts by date and class type](https://github.com/rudeayelo/aimharder-mcp/issues/5) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#6: Answer workout and booking questions together](https://github.com/rudeayelo/aimharder-mcp/issues/6) | [#3](https://github.com/rudeayelo/aimharder-mcp/issues/3), [#4](https://github.com/rudeayelo/aimharder-mcp/issues/4), [#5](https://github.com/rudeayelo/aimharder-mcp/issues/5) |
| [#7: Query booking history with verified states](https://github.com/rudeayelo/aimharder-mcp/issues/7) | [#4](https://github.com/rudeayelo/aimharder-mcp/issues/4) |
| [#8: Query personal activity over a date interval](https://github.com/rudeayelo/aimharder-mcp/issues/8) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#9: Retrieve the latest activity entries](https://github.com/rudeayelo/aimharder-mcp/issues/9) | [#8](https://github.com/rudeayelo/aimharder-mcp/issues/8) |
| [#10: Summarize training frequency for a period](https://github.com/rudeayelo/aimharder-mcp/issues/10) | [#8](https://github.com/rudeayelo/aimharder-mcp/issues/8) |

Each slice requires MCP-level behavior tests, separate read-only live validation and documentation. Issue creation alone is not validation.

## Final functional QA

The user moved #6's remaining future-workout check to [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13) on 2026-09-23. A separate MCP query then verified future WOD and Metcon content. On 2026-09-24 the user accepted the aggregate evidence in place of one combined run; see the [QA decision](adr/2026-09-24-functional-qa-evidence-for-first-release.md). The subsequent exact npm release check is recorded in [validation](validation.md).

## npm distribution tickets

The user approved packaging and release tickets on 2026-09-22:

| Ticket | Blocked by |
| --- | --- |
| [#11: Run the MCP server from an installable package](https://github.com/rudeayelo/aimharder-mcp/issues/11) | None pending; #2 is complete |
| [#12: Publish and verify the MVP on npm](https://github.com/rudeayelo/aimharder-mcp/issues/12) | #13, #11, #6, #7, #9, #10 |

Local packaging and the public registry artifact were verified. See the [distribution ADR](adr/2026-09-22-npm-distribution-for-mvp.md).

## Operation

Keep the API client separate from MCP and validate external responses. Supply credentials through environment variables; see [configuration](configuration.md).

Query on demand without persistent storage. Reuse the in-memory session; allow one reauthentication and query retry after expiry. Stop on invalid credentials, unsupported challenges or restrictions. Rate limits remain unverified.

Select the sole gym automatically. Multiple gyms require a configured default; queries may override it with a verified accessible gym. Live membership discovery was checked with one account/location.

## Query semantics

- Resolve relative dates in the reported gym zone, even when traveling. Unmapped gyms assume `Europe/Madrid` and report `assumed`; configured IANA zones report `user-confirmed`. AimHarder zone discovery remains unresolved; see the [zone decision](adr/2026-09-24-default-gym-time-zone.md).
- Personal activity queries accept at most 31 consecutive calendar dates, with inclusive start and end dates. Larger periods require multiple explicit queries by the client.
- On later activity retrieval failure, preserve recovered entries with incomplete coverage. A first-partition failure is an error; entry dates alone do not establish coverage.
- Preserve AimHarder class names and instructions in their source language; field names and server messages are English.

## Acceptance criteria

- Automated tests using anonymized responses and error cases, covering response interpretation, dates, partial results, pagination, authentication, and retries where applicable.
- Live read-only queries using the user's account to check classes, occupancy, published workouts, bookings, and activity by date against AimHarder.
- Responses distinguish unpublished information, no records, incomplete results, and access failures; they do not invent states or workouts.
- The reference WOD query returns available future workout content and the account holder's relevant booking times, distinguishing unavailable workout information from unverified booking status.
- Tests cover inclusive date boundaries, the 31-date activity limit, gym time-zone handling, partial pagination failures, preservation of source content, gym selection, ambiguous workout publications, and workout responses when booking lookup fails.
- Reproducible setup and startup instructions in the repository, including version-pinned execution of the public npm package.
- An installable compiled package verified outside the checkout, with explicitly limited contents and automated packaged-install coverage. Publish the first public version after functional acceptance and verify that exact registry version in a compatible MCP client or harness, including a live read-only account/gym query.
- Validate the supported query experiences in at least one MCP-compatible client or harness. Record the client or harness used and the observed results; no particular agent or product is required.

## Testing strategy

Test the public MCP interface and real API client with anonymized HTTP fixtures. Check results, errors, coverage and outbound safety rather than implementation details.

Cover schedules, occupancy, workouts and bookings, entry summaries/counts, ambiguity, duplicates, date boundaries, gym selection, retry limits and partial results. Fixtures do not establish live upstream behavior.

Run separate, authorized read-only live comparisons and record sanitized outcomes. Automated tests use no real credentials.

## Outside the MVP and future development

Current scope excludes booking writes, automation, exercise/progress analysis, a UI and a remote service.

The [roadmap](../README.md#roadmap) lists booking writes, personal RM lookups with optional calculated loads beside original `%RM`, recording results, broader gym support and mobile exploration. No dates or versions are promised.

## Technical validation

See [API research](api-research.md) for observed contracts and [validation](validation.md) for live results and their limits. Feed/history horizons and physical-session grouping remain unverified; grouping is outside the clarified entry-based #9/#10 acceptance.
