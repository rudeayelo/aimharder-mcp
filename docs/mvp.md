# AimHarder MCP server MVP

Date: 2026-09-21. Status: scope confirmed by the user; [implementation specification published as GitHub issue #1](https://github.com/rudeayelo/aimharder-mcp/issues/1); account/gym, class-query, upcoming-booking, published-workout, consuming-client composition and booking-history slices implemented; class and upcoming-booking live acceptance passed (see [validation](validation.md)); published future-content live acceptance and remaining MVP slices pending. See [validation results](validation.md).

## Product and users

A local TypeScript MCP server, with one account per instance. The initial use case is personal, with possible later validation by a small group already familiar with connecting an MCP server. The server targets MCP-compatible clients and harnesses without depending on a particular agent or requiring a dedicated integration.

Distribution: a repository with setup and startup instructions, plus a public npm package as the final MVP milestone. Package implementation and publication are pending; see [the npm distribution decision](adr/2026-09-22-npm-distribution-for-mvp.md). License: [MIT](../LICENSE). A public repository has been created on [GitHub](https://github.com/rudeayelo/aimharder-mcp); see [the publication ADR](adr/2026-09-21-public-repository-and-mit-license.md). All project content is maintained in English. Setup and startup instructions for account/gym discovery are in the [README](../README.md). Potential collaboration with AimHarder will be considered once a useful, viable product exists, without assuming platform interest or endorsement.

Domain terms are defined in the root [glossary](../CONTEXT.md).

## Features

- Query the gym's classes by date: schedules, type, occupancy, capacity, and other relevant information available to the account.
- Retrieve published workout details, including future workouts, when available. A workout may apply to several class sessions on the same day rather than one uniquely linked session. If unavailable, say so. Publication from 21:00 onward is the user's observation about 9NBC, not a validated global rule.
- Query upcoming bookings and available history, distinguishing states only once their meaning has been verified.
- Query personal activity by date, including available workout details. Support any period AimHarder allows retrieving, with a maximum of 31 consecutive calendar dates per query, counting both endpoints, and clear notices for partial results. Searching or analyzing specific exercises is excluded.

Example questions: “What does tomorrow's WOD look like?”, “What classes are available this week?”, “How many people are booked for Wednesday's 07:00 Metcon?”, “What were my last five training sessions like?”, “How many times did I train last month?”, and “What bookings do I have?”. Distinguish times when multiple sessions exist. Occupancy does not equal actual attendance.

The MVP provides reusable query capabilities across all these examples, not a single hard-coded WOD answer. Recent-training summaries and activity counts are in scope; exercise-specific performance analysis remains excluded. For the last five training sessions or a monthly total, verify how activity entries group into distinct training sessions before making that claim. Distinguish session counts, days with activity, and entry counts, and disclose incomplete coverage or unresolved grouping. Clients may make multiple explicit activity queries to search older history without exceeding the per-query date limit.

## Reference experience: tomorrow's WOD

When the user asks "What are we doing in tomorrow's WOD?", return the exercises and training instructions from the gym feed when a workout is published for that date and can be identified as the requested class type. Also report whether the account holder has a booking for the relevant sessions and at what time or times.

The user reports that, at 9NBC, the daily WOD published in the gym feed is repeated across the day's WOD class sessions. This does not require a unique workout-to-session link. Treat it as a reported gym-specific convention to verify during integration, not a universal AimHarder rule. A post's publication timestamp alone does not establish the workout date.

Only report that the user has no relevant booking when a successful query provides sufficient coverage and verified booking-state meaning. If booking lookup fails or is incomplete, preserve available workout information and clearly state that booking status could not be confirmed.

If multiple distinct feed workouts appear to apply to the requested date and class type, return the alternatives with their titles and provenance and explain the ambiguity. Do not select the latest post as a replacement unless it can be verified as a correction. Report relevant booking times separately without assigning an ambiguous workout to a booked session.

## First functional delivery

The first end-to-end delivery must answer "What are we doing in tomorrow's WOD, and when am I booked?" through an MCP client using the user's actual account. It includes authentication, gym selection, class sessions, published future workout content from the gym feed, and upcoming bookings. It also includes reproducible setup, automated tests, safe authentication errors, and explicit handling of missing, ambiguous, or incomplete information.

Personal activity and booking history follow in later deliveries within the same MVP. This delivery order does not remove either feature from the acceptance scope. The first delivery is verified against AimHarder from at least one MCP-compatible client or harness. The implemented consuming-client example combines the existing queries; current available content, next-day unavailable content and an actual reservation have live verification. Actual published future content was unavailable during verification and remains an explicit first-delivery acceptance gap. See [the runnable example](../README.md#combined-workout-and-booking-example) and [validation](validation.md).

## Implementation tickets

The approved slices are published in GitHub Issues with the `ready-for-agent` label and native blocking relationships. A ticket can start when all its blockers are complete. The specification remains the parent reference; this table records the approved dependency plan rather than live issue status.

| Ticket | Blocked by |
| --- | --- |
| [#2: Connect an account and select an accessible gym](https://github.com/rudeayelo/aimharder-mcp/issues/2) | None |
| [#3: Query class schedules and session occupancy](https://github.com/rudeayelo/aimharder-mcp/issues/3) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#4: Query upcoming bookings](https://github.com/rudeayelo/aimharder-mcp/issues/4) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#5: Query published workouts by date and class type](https://github.com/rudeayelo/aimharder-mcp/issues/5) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#6: Answer workout and booking questions together](https://github.com/rudeayelo/aimharder-mcp/issues/6) | [#3](https://github.com/rudeayelo/aimharder-mcp/issues/3), [#4](https://github.com/rudeayelo/aimharder-mcp/issues/4), [#5](https://github.com/rudeayelo/aimharder-mcp/issues/5) |
| [#7: Query booking history with verified states](https://github.com/rudeayelo/aimharder-mcp/issues/7) | [#4](https://github.com/rudeayelo/aimharder-mcp/issues/4) |
| [#8: Query personal activity over a date interval](https://github.com/rudeayelo/aimharder-mcp/issues/8) | [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2) |
| [#9: Retrieve the latest training sessions](https://github.com/rudeayelo/aimharder-mcp/issues/9) | [#8](https://github.com/rudeayelo/aimharder-mcp/issues/8) |
| [#10: Summarize training frequency for a period](https://github.com/rudeayelo/aimharder-mcp/issues/10) | [#8](https://github.com/rudeayelo/aimharder-mcp/issues/8) |

Prioritize account/gym access, class sessions, upcoming bookings, and published workouts before the combined WOD experience. Booking history and personal activity complete the remaining MVP; their independent dependency branches do not impose an artificial dependency on the combined experience.

Every slice includes behavioral tests at the MCP interface, separate live read-only validation in a compatible client or harness, and updated documentation. Ticket publication does not demonstrate implementation or API validation. Native dependencies and published issue content were verified when this plan was recorded.

## npm distribution tickets

The user approved these additional slices on 2026-09-22. Both are published with `ready-for-agent`; the publication ticket has native GitHub blockers. The functional ticket plan above is unchanged.

| Ticket | Blocked by |
| --- | --- |
| [#11: Run the MCP server from an installable package](https://github.com/rudeayelo/aimharder-mcp/issues/11) | None pending; #2 is complete |
| [#12: Publish and verify the MVP on npm](https://github.com/rudeayelo/aimharder-mcp/issues/12) | #11, #6, #7, #9, #10 |

The terminal functional blockers include their transitive prerequisites. Package preparation can proceed before those features are complete; public release requires complete MVP acceptance. The preferred name is `aimharder-mcp`, subject to publishability and account access. See [the distribution ADR](adr/2026-09-22-npm-distribution-for-mvp.md).

## Operation

Keep the AimHarder client independent of the MCP layer, with runtime validation of external responses. Supply credentials through environment variables; the user may inject them from 1Password or another manager. Configuration variables and commands for the implemented account/gym slice are documented in the [README](../README.md).

Query AimHarder on demand, without a database or persistent cache; reuse the session in memory. On session expiration, allow one automatic reauthentication per request and a single query retry. On invalid credentials, 2FA, or restrictions, return a clear error and stop retrying. Rate limits have not been verified.

Select the gym automatically when the account has only one. If there are several, require a default gym in configuration. Each query may optionally select another gym without restarting the server; use the default when omitted and accept only gyms whose accessibility for the account has been verified. The `.es` client membership discovery contract has live validation for one account and gym; broader account variants remain unverified.

## Query semantics

- Interpret dates in the gym's time zone, including when the user is traveling. The conversational client resolves relative expressions such as "tomorrow" into explicit dates in that zone. The server returns dates and times with explicit time-zone information. Class queries require an explicit per-gym, user-confirmed IANA zone in configuration and report that provenance. Automatic discovery remains unresolved; see the [class-query decision](adr/2026-09-22-class-schedules-and-confirmed-time-zones.md).
- Personal activity queries accept at most 31 consecutive calendar dates, with inclusive start and end dates. Larger periods require multiple explicit queries by the client.
- If a later activity page fails after earlier pages were retrieved, return the recovered entries marked incomplete, explain the reason, and describe only the coverage that can be established. A failed first page is an error, not an empty result. Do not infer complete coverage from the dates of returned entries alone.
- Preserve AimHarder content in its original language, including class names and workout instructions. Server field names and messages are in English; the consuming assistant may explain the content in the user's language.

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

Exercise the public MCP interface with the real API client and replace only AimHarder's HTTP responses with anonymized fixtures. Assert observable query results, errors, coverage, and security-relevant outbound behavior rather than private implementation details. The account/gym slice establishes this test boundary in `tests/context.test.ts`; extend it for subsequent slices.

Include weekly schedules, specific-session occupancy, recent-training summaries, monthly counts with a verified counting basis, and the WOD-plus-booking experience. Test ambiguous publications, pagination and duplicate records, date boundaries, gym selection, authentication retry limits, and incomplete results. Fixture-based tests do not establish the real upstream contract.

Run separate, explicit live read-only checks against AimHarder using the user's account, with sanitized results. Automated tests must not depend on real credentials. The user confirmed this testing strategy during specification preparation.

## Outside the MVP and future development

Out of scope: creating and canceling bookings, automation, per-exercise or progress analysis, a UI, and a remote service.

Next priority: creating and canceling bookings through explicit requests, with unambiguous validation of the session and outcome. A remote service and other integrations will be decided later.

## Technical validation

See [API research](api-research.md) for sources, observed endpoints, user-provided samples, and unresolved validation questions. The account/gym observations distinguish live-verified contracts from unresolved assumptions; upcoming-booking observations and view-only coverage are recorded there; published-workout current-view content is live-verified; exhaustive feed/history coverage and activity families remain unverified. Available history has separate live evidence in the API research and validation records.
