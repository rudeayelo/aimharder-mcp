# AimHarder MCP server MVP

Date: 2026-09-21. Status: scope confirmed by the user; implementation pending.

## Product and users

A local TypeScript MCP server, with one account per instance. The initial use case is personal, with possible later validation by a small group already familiar with connecting an MCP server. Ona can use it as a client from the start, without a dedicated integration or mandatory validation before MVP release.

Distribution: a repository with setup and startup instructions. License: [MIT](../LICENSE). A public repository has been created on [GitHub](https://github.com/rudeayelo/aimharder-mcp); see [the publication ADR](adr/2026-09-21-public-repository-and-mit-license.md). All project content is maintained in English. Setup and startup instructions will be added when the server is implemented. Potential collaboration with AimHarder will be considered once a useful, viable product exists, without assuming platform interest or endorsement.

## Features

- Query the gym's classes by date: schedules, type, occupancy, capacity, and other relevant information available to the account.
- Retrieve the associated detailed workout when published. If unavailable, say so. Publication from 21:00 onward is the user's observation about 9NBC, not a validated global rule.
- Query upcoming bookings and available history, distinguishing states only once their meaning has been verified.
- Query personal activity by date, including available workout details. Support any period AimHarder allows retrieving, with a maximum of one month per query and clear notices for partial results. Searching or analyzing specific exercises is excluded.

Example questions: “What does tomorrow's WOD look like?”, “Is there Metcon on Wednesday?”, “How many people are booked for Friday's WOD?”, “What bookings do I have?”, and “What activity do I have in this period?”. Distinguish times when multiple sessions exist. Occupancy does not equal actual attendance.

## Operation

Keep the AimHarder client independent of the MCP layer, with runtime validation of external responses. Supply credentials through environment variables; the user may inject them from 1Password or another manager. Variable names and commands await implementation.

Query AimHarder on demand, without a database or persistent cache; reuse the session in memory. On session expiration, allow one automatic reauthentication per request and a single query retry. On invalid credentials, 2FA, or restrictions, return a clear error and stop retrying. Rate limits have not been verified.

Select the gym automatically when the account has only one. If there are several, require a default gym in configuration. Account and gym discovery still need technical validation.

## Acceptance criteria

- Automated tests using anonymized responses and error cases, covering response interpretation, dates, partial results, pagination, authentication, and retries where applicable.
- Live read-only queries using the user's account to check classes, occupancy, published workouts, bookings, and activity by date against AimHarder.
- Responses distinguish unpublished information, no records, incomplete results, and access failures; they do not invent states or workouts.
- Reproducible setup and startup instructions in the repository.
- Validation through Ona may be deferred: it does not block acceptance; subsequent failures are reported as bugs.

## Outside the MVP and future development

Out of scope: creating and canceling bookings, automation, per-exercise or progress analysis, a UI, a remote service, and publishing an installable package.

Next priority: creating and canceling bookings through explicit requests, with unambiguous validation of the session and outcome. A remote service and other integrations will be decided later.

## Technical validation

See [API research](api-research.md) for sources, observed endpoints, user-provided samples, and unresolved validation questions. These observations do not establish a verified API contract or completed integration tests.
