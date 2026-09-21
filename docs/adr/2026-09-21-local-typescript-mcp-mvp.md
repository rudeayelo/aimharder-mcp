# ADR: local TypeScript MCP MVP

Status: accepted by the user on 2026-09-21.

## Context

Personal exploration evolved into a reusable MCP server. The definition interview settled scope, format, operation, validation, and future development. This supersedes the provisional scope of [the initial pause](2026-09-21-initial-scope-and-project-pause.md); current work remains limited to documentation.

## Decision

Adopt the scope and acceptance criteria in [the MVP](../mvp.md): a local TypeScript server, a separate API client, one account per instance, read-only access, on-demand queries, credentials through environment variables, and initial distribution from a repository under the MIT license.

TypeScript reflects the user's maintenance preference. The Python reference helps investigate the API; it does not require reusing that language. No performance advantage between languages has been measured; the planned operations are primarily HTTP requests.

## Consequences

Validate responses at runtime as well as defining their types. The design does not depend on Ona or a particular secrets manager. Acceptance requires automated tests and live read-only queries; Ona validation comes later. Write operations and a remote service belong to later phases. Publication is subsequently authorized through [the public repository ADR](2026-09-21-public-repository-and-mit-license.md).
