# ADR: API client separated from interfaces

Status: accepted for the MVP; implemented for account/gym discovery in issue #2 and extended with consuming-client composition in issue #6. See [the local TypeScript MCP MVP](2026-09-21-local-typescript-mcp-mvp.md).

Time-zone amendment: the explicit confirmed-zone gate described below was superseded by the [2026-09-24 default-zone decision](2026-09-24-default-gym-time-zone.md). Other decisions and historical validation evidence remain unchanged.

## Context

FitBot serves as a reference for accessing AimHarder but focuses on automated bookings. Sources and observations are recorded in [API research](../api-research.md). This project aims to support conversational queries and potentially a custom UI.

## Decision

Create a reusable TypeScript API client, separate from the MCP layer, with runtime response validation. MCP-compatible clients and harnesses consume the server without an agent-specific adapter. Use FitBot as a reference; do not deploy its scheduler or execute the repository without review. The MVP is local and uses no database; a standalone CLI and UI are outside the agreed scope.

## Consequences

Keep authentication, transport, models, and response validation decoupled from presentation. Start with individual queries, without bulk synchronization. The observed API is internal and not publicly documented: contracts and errors must be tested rather than assumed stable.

## Uncertainties

FitBot uses .com; the provided gym uses .es. The user believes they are equivalent, but cross-domain equivalence remains unverified. The `.es` authentication and account/gym flow is now verified; see the [implementation ADR](2026-09-21-account-discovery-and-local-runtime.md). Published workout queries now use verified gym-feed/detail operations; per-exercise personal record analysis is outside the MVP.


## Consuming-client composition (2026-09-22)

Issue #6 composes the existing public MCP queries in `src/consumer.ts`, with a runnable stdio SDK example. The independent AimHarder API client remains unaware of conversational dates and aggregation. No combined tomorrow-specific server tool or standalone CLI product is introduced.

Discover the selected gym before resolving tomorrow using its user-confirmed zone and calendar arithmetic. Pass that gym explicitly to each independent query and validate response gym, zone, date and class type before presenting them together. A query failure preserves valid results from the others, including bookings when the class schedule fails. Keep every matching reservation time and every workout alternative, without fabricating unique session associations. The tested gym's daily sharing evidence does not establish a universal convention.

An empty or failed upcoming query cannot establish date-specific absence because its calendar horizon remains unknown. The composition therefore reports known positive reservations or unconfirmed status, with completeness unconfirmed even when some bookings are known. Workout results retain first-page coverage and provenance. No authentication, operation allowlist, account scope, distribution, or existing booking/workout interpretation decision changes. Tests exercise composition through the real MCP interface with only upstream HTTP replaced. Future content was pending at the original composition check; a later separate live query verified future WOD and Metcon publications while the combined acceptance audit remains with QA #13.
