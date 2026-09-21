# ADR: API client separated from interfaces

Status: accepted for the MVP; implementation pending. See [the local TypeScript MCP MVP](2026-09-21-local-typescript-mcp-mvp.md).

## Context

FitBot serves as a reference for accessing AimHarder but focuses on automated bookings. Sources and observations are recorded in [API research](../api-research.md). This project aims to support conversational queries and potentially a custom UI.

## Decision

Create a reusable TypeScript API client, separate from the MCP layer, with runtime response validation. Ona uses the server as an MCP client without a dedicated adapter. Use FitBot as a reference; do not deploy its scheduler or execute the repository without review. The MVP is local and uses no database; a standalone CLI and UI are outside the agreed scope.

## Consequences

Keep authentication, transport, models, and response validation decoupled from presentation. Start with individual queries, without bulk synchronization. The observed API is internal and not publicly documented: contracts and errors must be tested rather than assumed stable.

## Uncertainties

FitBot uses .com; the provided gym uses .es. The user believes they are equivalent, but cookies, redirects, and authentication across domains remain unverified. WODs require investigating additional operations; per-exercise personal record analysis is outside the MVP.
