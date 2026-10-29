# ADR: best-effort hosted telemetry delivery

Status: accepted for delivery semantics on 2026-10-28. Implementation and deployment remain outside this design interview's authorization.

## Context

Hosted LogNorth instrumentation should provide diagnosis and aggregate technical metrics while the owner keeps Workers Free. Durable queues, persistent buffers and retries improve delivery resilience but introduce additional storage, lifecycle and operational work. Diagnostic delivery must not become a dependency of confirmed sporting actions or account recovery.

## Decision

Use one bounded HTTP send attempt registered with the appropriate Worker execution context. Do not persist unsent diagnostic events or retry their submission in this initial integration. Preserve application responses, account ordering, recovery semantics and at-most-one sporting-write dispatch regardless of telemetry outcome.

The owner subsequently accepted a two-second send limit, 2 KiB per event, and 64 KiB or 32 events per batch. Partial acceptance is a delivery failure with no retry of the remainder. Activation is explicit and disabled by default; the fixed HTTPS destination is operator-configured and the ingestion key is a platform secret. Invalid enabled configuration disables the exporter without taking down the application. Exporter failures produce safe, nonrecursive platform-console diagnostics, without adding persistent storage.

Use an invocation-local bounded buffer. Discard oversize events in full; prioritize technical/uncertain events over partial/denied/success outcomes on overflow, and report discard counts safely. Each request or scheduled execution receives its own server-generated correlation identifier, with no public-response changes or cross-request preparation/execution join. Server processing latency excludes exporter delivery; HTTP timing ends at handler return/throw, not at client receipt. Unknown outcomes are `unclassified` and create a static classifier issue without assuming a sporting result. The owner confirmed the concrete contract in the consolidated [specification](../lognorth-observability-spec.md), published as [issue #94](https://github.com/rudeayelo/aimharder-mcp/issues/94).

Instrument every hosted HTTP completion, tool completion and maintenance-phase completion, including successes, initially without sampling. Distinguish expected denials, partial results, uncertain writes and technical failures. Technical failures and uncertain writes create grouped error issues and may notify under the existing shared installation settings; ordinary denials and partial results must not automatically become error issues. Inherit global retention and notification configuration without changing it, preserve existing operator-only access, and verify effective settings before activation. Active uptime/functional/cron-absence monitoring is deferred.

## Consequences

Lost events are permitted. Unsampled instrumentation does not establish exhaustive received history, exact aggregate totals or an audit trail. Exporter failure must never replay an AimHarder action. Moving to durable delivery, retries or sampling requires an explicit revision of this decision. Native resource overhead and end-to-end delivery remain unverified; no plan upgrade or deployment is implied.

The owner accepted automated privacy/classification/isolation/failure checks using synthetic sporting writes, followed by separately authorized actual-Worker LogNorth read-back and before/after CPU measurement. Instrumentation that introduces incompatible Free-limit failures must not be activated as accepted; report evidence and alternatives rather than purchasing an upgrade. Rollback disables collection/export without changing existing service bindings. This ADR records acceptance requirements, not passed runtime checks.

## Implementation evidence (2026-10-29)

The later owner request to implement specification #94 authorizes the initially
disabled implementation; it does not authorize deployment or activation. The
initial HTTP/account-context slice implements the accepted invocation-local,
bounded one-attempt delivery through Worker `waitUntil`, with synthetic native
Worker/SDK evidence recorded in [validation](../validation.md#initial-hosted-observability-path-97-2026-10-29).
The decision and its loss/uncertainty boundaries are unchanged. Subsequent read-tool and maintenance instrumentation has local native-harness evidence in [validation](../validation.md); separately authorized actual-Worker acceptance remains pending; the original design-interview authorization boundary above is
historical context.

The activity slice [#100](https://github.com/rudeayelo/aimharder-mcp/issues/100)
now explicitly classifies preparation, publication and deletion read-back through
the same trusted account result boundary. [Synthetic activity evidence](../hosted-activity-observability.md)
preserves observed calendar absence as a narrow success and continued visibility,
identity conflict and incomplete execution read-back as distinct uncertainty
issues. This does not change the accepted delivery decision or authorize activation.


The #99 booking slice applies this decision to all five hosted booking tools.
Typed non-executable preparations, capacity/state refusals, stale references and
pending credit-loss confirmation are expected denials; uncertain execution and
unknown variants retain separate static issue classes. No sporting payload or
action reference enters either telemetry sink, and no preparation/execution
correlation crosses requests. Public native synthetic HTTP/SDK evidence covers
all current booking variants and delivery-mode preservation in
[validation](../validation.md#booking-tool-observations-99-2026-10-29).
This adds no architectural, authentication, scope, storage or dispatch decision;
real Worker export/CPU acceptance and activation remain separate.
