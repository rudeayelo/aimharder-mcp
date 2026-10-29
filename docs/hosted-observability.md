# Hosted completion telemetry

The integration implements [specification #94](https://github.com/rudeayelo/aimharder-mcp/issues/94) in stages on `codex/94-lognorth-integration`. Collection and export are disabled by default. The [configuration contract](configuration.md#optional-hosted-lognorth-configuration) describes the five operator settings; the [native validation procedure](hosted-telemetry-native-validation.md) is staged separately from implementation.

## Runtime boundaries

`hosted/src/telemetry.ts` owns an invocation-local buffer, static route/tool/message catalogs, privacy allowlist and bounded single-attempt HTTP exporter. The production HTTP wrapper records after application cleanup and recovery-lease release, then registers export with `waitUntil`. Tool classifiers inspect trusted account state before MCP serialization. Local stdio is outside this integration.

Only registered tool callbacks count as tool usage. HTTP transport completion is a separate observation: an MCP tool error inside HTTP 200 must retain both transport success and its independently classified tool outcome. Invalid arguments rejected before callback execution produce no fabricated tool event. Preparation and execution have different request traces; no participant, account, client, gym, booking, activity or action-reference identity joins them.

Use `context.http_status` for actual HTTP status. Technical, uncertain and classifier outcomes carry static issue fields; ordinary denials and partial retrieval do not automatically produce issues. An uncertain sporting effect remains unconfirmed even if a later independent check finds that it happened. Deletion's observed absence does not establish permanence or physical erasure. Documented feed/history/search limits alone do not establish partial retrieval.

The exporter collects at most 32 events and 65,536 UTF-8 bytes including the JSON envelope. Events above 2,048 bytes are discarded whole. Priority is technical/uncertain/unclassified, partial, denied, then success, preserving arrival order within ties. One attempt has a two-second deadline including acknowledgement processing and a 4 KiB acknowledgement cap. Complete acceptance requires HTTP 201, the exact submitted `created` count and no event errors. No redirect, retry, persistent buffer, durable queue, shutdown hook or recursive exporter event is used.

Only fixed warning categories and numeric counters reach the platform console. Logs, events and notifications can be missing; neither a successful acknowledgement nor unsampled collection establishes exhaustive history, an audit trail, exact totals, business effects or notification receipt.

## Delivery evidence

| Ticket | Local implementation evidence | Native acceptance |
| --- | --- | --- |
| [#97](https://github.com/rudeayelo/aimharder-mcp/issues/97) | HTTP/account-context and bounded exporter implemented; focused native workerd/SDK and affected regression checks recorded in [validation](validation.md#initial-hosted-observability-path-97-2026-10-29) | Not performed |
| [#98](https://github.com/rudeayelo/aimharder-mcp/issues/98) | Read-tool slice in progress | Not performed |
| [#99](https://github.com/rudeayelo/aimharder-mcp/issues/99) | Booking slice in progress; synthetic writes only | Not performed |
| [#100](https://github.com/rudeayelo/aimharder-mcp/issues/100) | Activity slice in progress; synthetic writes only | Not performed |
| [#101](https://github.com/rudeayelo/aimharder-mcp/issues/101) | Maintenance slice pending | Not performed |
| [#102](https://github.com/rudeayelo/aimharder-mcp/issues/102) | Controlled validation/rollback procedure staged | Separate authorization required |

The [scope/privacy ADR](adr/2026-10-28-hosted-observability-scope-and-privacy.md) and [delivery ADR](adr/2026-10-28-best-effort-hosted-telemetry-delivery.md) remain applicable. No participant diagnostics surface, reader grant, account schema, AimHarder API contract or local stdio behavior is added. Actual Worker ingestion/read-back, effective shared retention/notification/access checks, measured provider CPU overhead and demonstrated remote disabling remain outstanding under #102. The staged procedure identifies possible existing notification effects before any validation activation.

Sustained activation is a later authorized step. Rollback disables `LOGNORTH_ENABLED` through an authorized configuration deployment, preserving other secrets/bindings/routes/cron/recovery authority. Subsequent invocations collect and send nothing; an existing submission can finish within its deadline. Previously stored LogNorth events/issues are retained. There is no migration, queue drain or shared LogNorth reset.
