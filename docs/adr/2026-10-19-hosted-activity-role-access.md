# ADR: hosted activity role access

Status: accepted on 2026-10-19 for [#79](https://github.com/rudeayelo/aimharder-mcp/issues/79) and [#80](https://github.com/rudeayelo/aimharder-mcp/issues/80).

## Context

The accepted hosted design allows only activity publication and deletion switches by role. Tool discovery can be cached and a prepared action can outlive a policy change, so discovery and preparation checks alone cannot authorize a later sporting write.

## Decision

Store exactly two role policies, `admin` and `user`, with independent publication and deletion bits. Initially both are enabled for administrators and disabled for users. There are no individual exceptions and no switches for queries or booking actions. An authenticated active verified service administrator can edit a role's activity access in the portal; enforce the same current durable policy at preparation, execution and the final pre-dispatch guard. Cached tool discovery or an existing reference grants no exception. A setting change after dispatch cannot undo an admitted upstream request; any possibly sent action still uses read-only reconciliation and never retries the write.

The final dispatch guard joins the current role policy with admission, exact client grant/generation and connection revision in one authoritative D1 snapshot. Sequential awaited permission and grant queries would leave a stale-check window, reproduced by the public synthetic regression.

## Consequences

Migration `0007-activity-role-policy.sql` is required before activation. The policy contains no sporting data. Role controls do not replace exact account-holder confirmation, original-account read-back or the existing activity source, score, load, audience and provenance limits. Synthetic portal/MCP evidence and provider activation are separate.

The [publication runbook](../hosted-activity-publication.md) records implementation and limits. Per-user overrides and authorization inferred from tool visibility were rejected because they contradict the settled role-only policy or allow cached access to bypass it.
