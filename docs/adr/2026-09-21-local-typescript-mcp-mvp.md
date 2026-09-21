# ADR: local TypeScript MCP MVP

Status: accepted by the user on 2026-09-21; validation clarified the same day to require an MCP-compatible client or harness without naming a specific agent.

## Context

Personal exploration evolved into a reusable MCP server. The definition interview settled scope, format, operation, validation, and future development. This supersedes the provisional scope of [the initial pause](2026-09-21-initial-scope-and-project-pause.md); the user subsequently authorized implementation of issue #2. Account/gym discovery is implemented; see the [implementation ADR](2026-09-21-account-discovery-and-local-runtime.md).

## Decision

Adopt the scope and acceptance criteria in [the MVP](../mvp.md): a local TypeScript server, a separate API client, one account per instance, read-only access, on-demand queries, credentials through environment variables, and initial distribution from a repository under the MIT license.

TypeScript reflects the user's maintenance preference. The Python reference helps investigate the API; it does not require reusing that language. No performance advantage between languages has been measured; the planned operations are primarily HTTP requests.

## Consequences

Validate responses at runtime as well as defining their types. The design does not depend on a particular agent, client, harness, or secrets manager. Acceptance requires automated tests and live read-only queries validated in at least one MCP-compatible client or harness, with the environment and observed results recorded. Write operations and a remote service belong to later phases. Publication is subsequently authorized through [the public repository ADR](2026-09-21-public-repository-and-mit-license.md).

## Validation clarification

The user confirmed behavioral testing through the public MCP interface with the real API client, substituting only upstream HTTP responses with anonymized fixtures. This keeps the principal test boundary external while testing the layers together. Separate live read-only checks establish whether those fixtures and interpretations match AimHarder; passing fixture-based tests alone does not establish integration acceptance. Recent-training summaries and period counts are part of personal activity queries, with grouping and coverage verified before claiming a training-session total.
