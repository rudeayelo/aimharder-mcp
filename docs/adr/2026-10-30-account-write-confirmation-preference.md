# ADR: one account preference for sporting-write confirmations

Status: accepted on 2026-10-30 for [issue #120](https://github.com/rudeayelo/aimharder-mcp/issues/120).

## Context

The owner first requested removal of the booking confirmation, then clarified that confirmation must be optional through one preference per account for all sporting writes and MCP clients. This replaces the previous requirement to ask separately for every write, rather than merely removing a credit warning.

## Decision

Keep confirmations enabled by default. Add `requireWriteConfirmation` to the hosted account's encrypted AimHarder connection configuration and its existing settings form/API. It applies to creation, standard and late cancellation, activity publication, and activity deletion for all clients of that account. Local stdio uses `AIMHARDER_REQUIRE_WRITE_CONFIRMATION=true|false`, defaulting to true for its single configured account. Missing fields in earlier stored configurations mean true. Omitted settings updates preserve the stored value. Password updates and upstream account replacement retain it unless explicitly changed; disconnection deletes the connection configuration, so a new connection defaults to true.

Expose the effective `writeConfirmationRequired` in account context, every preparation result and late-cancellation warnings. Execution markers remain optional literal true fields in the public schema: the current account policy requires `confirmed: true`, or `confirmedCreditLoss: true` for a late cancellation, only when enabled. A false marker is invalid in either mode. Check policy before consuming a reference or entering hosted durable coordination, and again in the shared API client. Changing hosted settings changes connection revision and discards outstanding preparations.

With confirmations enabled, the client shows the complete exact preview and obtains separate account-holder confirmation. With confirmations disabled, an explicit request to perform the exact action authorizes its prepare/execute flow without a second question. A query or request for a preview never authorizes execution. The policy is account configuration; tool callers cannot disable it in execution arguments.

Preserve exact target identification, user-confirmed gym zone, membership and ownership checks, hosted role/grant policy, short-lived single-use references, fresh preflight checks, at-most-one dispatch and fresh read-back. Standard cancellation never automatically issues `late=1`: a new late reference and fresh check remain necessary. When confirmations are disabled, the cancellation request permits that fresh late attempt without another question; possible credit-loss information remains visible. Unknown outcomes are never automatically replayed. Actual kilogram and achieved-result input semantics are unchanged; disabling action confirmation does not turn a prescription or suggestion into achieved performance.

This partially supersedes the confirmation requirements in the [manual booking scope](2026-09-24-manual-booking-writes.md), [creation preparation](2026-09-25-booking-creation-preparation.md), [creation execution](2026-09-25-booking-creation-execution.md), [cancellation preparation](2026-09-25-booking-cancellation-preparation.md), [cancellation execution](2026-09-25-booking-cancellation-execution.md), [late cancellation](2026-09-25-late-cancellation-confirmation.md), [credit-warning amendment](2026-10-07-booking-creation-without-credit-warning.md), [activity writes](2026-09-28-manual-activity-publication-and-deletion.md) and [hosted coordination](2026-10-19-confirmed-hosted-action-coordination.md). Their other protections and historical evidence remain in force. It also amends only the per-write confirmation requirement in the pending #108/#115 UX slices.

## Consequences

Existing accounts and clients retain confirmation by default; existing true markers remain compatible. The user can reduce interaction for all sporting writes, including deletion and late credit loss, with one setting. MCP annotations remain truthful write/destructive hints: a client may independently enforce its own approvals. No arbitrary third-party client's prompting behavior is guaranteed.

The small settings addition follows the existing portal form, labels, native select and save action. The reference lock preserves its current type, colors and layout. Refero's [Hello Ivy preferences](https://refero.design/pages/4fd0f520-5564-47d4-9d6d-d91df1a53ac4) informed a labeled preference with adjacent explanatory copy; the [imgs.so reference](https://imgs.so) informed restraint and no decorative additions. No layout, branding or media redesign is included.

Automated MCP/HTTP fixtures establish both policy modes, persistence and isolation, not actual upstream writes or actual ChatGPT/Hermes acceptance. Release and deployment remain separate from implementation. See the [confirmation contract](../write-confirmations.md) and [validation](../validation.md).
