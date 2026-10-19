# ADR: hosted activity role access

Status: accepted on 2026-10-19 for [#79](https://github.com/rudeayelo/aimharder-mcp/issues/79) and [#80](https://github.com/rudeayelo/aimharder-mcp/issues/80).

## Decision

Store exactly two role policies, `admin` and `user`, with independent publication and deletion bits. Initially both are enabled for administrators and disabled for users. There are no individual exceptions and no switches for queries or booking actions. An authenticated active verified service administrator can edit a role's activity access in the portal; enforce the same current durable policy at preparation, execution and the final pre-dispatch guard. Cached tool discovery or an existing reference grants no exception. A setting change after dispatch cannot undo an admitted upstream request; any possibly sent action still uses read-only reconciliation and never retries the write.

The final activity dispatch authorization includes the chosen capability in the same SQL snapshot as active admission, verified email, client/grant generation and connection revision. Preparation and execution also reject disabled capabilities before source reads. The independent deletion controls and own-entry execution/recovery are documented in the [deletion guide](../hosted-activity-deletion.md).

## Consequences

Migration `0007-activity-role-policy.sql` is required before activation. The policy contains no sporting data. Role controls do not replace exact account-holder confirmation, original-account read-back or the existing activity source, score, load, audience and provenance limits. Synthetic portal/MCP evidence and provider activation are separate.
