# Hosted LogNorth observability specification

Status: accepted by final owner confirmation on 2026-10-28 and published as [specification #94](https://github.com/rudeayelo/aimharder-mcp/issues/94), labeled `ready-for-agent`. The owner accepted decisions Q1–Q19 in five interview rounds and then confirmed the consolidated contract. This document authorizes no implementation, secret provisioning, configuration change or deployment. GitHub is the canonical issue/spec tracker under the [tracker convention](agents/issue-tracker.md); this file preserves the supporting repository contract.

## Purpose and scope

Provide technical diagnosis and aggregate operational understanding of the hosted AimHarder MCP service using the existing LogNorth installation while remaining on Workers Free. Cover portal, authentication, all 18 hosted MCP tools and scheduled deletion maintenance. Local stdio instrumentation, durable delivery, participant tracking, portal diagnostics, uptime pings, recurring functional journeys and alerts for missing cron executions are outside this delivery.

Telemetry is not an audit record or proof that a sporting write occurred. Existing action coordination, account isolation and independent recovery/deletion records remain authoritative. Unsampled instrumentation and aggregate metrics describe received observations, not exhaustive history or exact business totals.

See [research and installation observations](research/2026-10-28-lognorth-observability.md), the [scope/privacy ADR](adr/2026-10-28-hosted-observability-scope-and-privacy.md) and the [delivery ADR](adr/2026-10-28-best-effort-hosted-telemetry-delivery.md). Existing domain terms remain in [CONTEXT.md](../CONTEXT.md); no new domain glossary entry is needed for generic logging concepts.

## Decision record

All recommendations below were accepted on 2026-10-28:

| Decision | Accepted requirement |
| --- | --- |
| Q1 | Hosted portal, auth, MCP and scheduled maintenance; exclude local stdio. |
| Q2 | Diagnosis and aggregate usage, latency and outcomes; no audit guarantee. |
| Q3 | Per-operation correlation without persistent participant identity, including pseudonyms; no arguments or sporting results. |
| Q4 | One bounded send attempt; no persistent buffer or retries; application behavior remains authoritative. |
| Q5 | Instrument every HTTP/tool/maintenance-phase completion, including success, without sampling. |
| Q6 | Separate expected denial, partial retrieval, uncertain write and technical failure. |
| Q7 | Explicit field allowlist and static messages; exclude identifying and unfiltered data. |
| Q8 | Two seconds per send, 2 KiB per event, 64 KiB/32 events per batch; discard unaccepted remainder. |
| Q9 | Explicit default-off activation, operator-fixed HTTPS destination, platform-secret key; invalid configuration disables exporter. |
| Q10 | Safe platform-console diagnostics for exporter failure; never export those warnings recursively. |
| Q11 | New server-generated correlation per HTTP/scheduled execution; no public contract changes or cross-request action linking. |
| Q12 | Invocation-local bounded buffer; prefer technical/uncertain events on overflow; discard oversize events whole and report counts. |
| Q13 | Technical/uncertain outcomes create grouped issues and may trigger existing installation notifications. |
| Q14 | Inherit global retention/notification settings and existing authorized operator access; verify before activation without changing shared settings. |
| Q15 | Defer active uptime, OAuth/MCP synthetic monitoring and cron-absence alerts. |
| Q16 | Unknown outcomes become `unclassified` and a classifier technical issue; never assume sporting success/failure or copy unknown data. |
| Q17 | Server processing duration excludes exporter delivery and client-network time; HTTP ends when the handler returns or throws. |
| Q18 | Automated contract, privacy, isolation, timeout, rejection, partial-acceptance and overflow checks; sporting writes remain synthetic. |
| Q19 | Later native Worker read-back and before/after CPU measurement before acceptance/activation; do not accept instrumentation introducing Free-limit failures; document disable procedure. |

## Event contract

### Catalog and correlation

| `event_type` | Emit when | Meaning of duration |
| --- | --- | --- |
| `http.completed` | Hosted request handler returns or throws, including early auth/recovery failures | Server handler entry through return/throw, including awaited application cleanup; exclude exporter delivery and response-body streaming/client transfer |
| `mcp.tool.completed` | An actual registered tool callback returns or throws | Callback entry through completion, including its account queue/upstream work |
| `maintenance.main.completed` | Main scheduled deletion cleanup resolves, returns failed/overdue, or throws | Main cleanup start through its terminal outcome |
| `maintenance.memory.completed` | Existing deferred memory cleanup settles | Deferred phase start through settlement, independently of main cleanup outcome |

Generate one random opaque server-side `trace_id` per HTTP request or scheduled invocation. Carry it only through that invocation's observations, including deferred phases. Do not use participant, gym, client, request-header, activity, booking or action-reference identifiers. Preparation and later execution are distinct requests with distinct traces. Do not add response fields/headers, MCP output fields or portal UI to expose correlation.

Count tool usage from `mcp.tool.completed` only. HTTP and tool events sharing a trace are distinct measurements, not two tool uses. Aggregate maintenance work by phase, never emit an event per deleted participant. A completed no-op phase is valid; if a phase never starts, do not fabricate its success. Platform termination can prevent completion records entirely.

### Wire fields

Send plain JSON to `POST /api/v1/events/batch` using the application ingestion key. Use no LogNorth Node SDK timers, process hooks or process-global event queue. An equivalent implementation must satisfy the explicit bounded HTTP contract.

| Field | Allowed value |
| --- | --- |
| `message` | Static catalog message; never interpolate request/result/exception text |
| `timestamp` | Server completion time in UTC RFC 3339 |
| `duration_ms` | Finite nonnegative integer server elapsed milliseconds |
| `trace_id` | Generated invocation-local opaque correlation ID |
| `context.event_type` | One of the four catalog values |
| `context.environment` | Bounded operator-controlled environment label |
| `context.release` | Bounded operator-controlled build/release identifier |
| `context.path` | HTTP event only: allowlisted route template, or fixed `unmatched` fallback |
| `context.tool` | Tool event only: exact registered tool name from the static catalog |
| `context.outcome` | `success`, `denied`, `partial`, `uncertain`, `technical_failure`, or `unclassified` |
| `context.http_status` | Actual response status for HTTP events, when a response exists |
| `context.code` | Optional static closed diagnostic/domain code from an explicit mapping |
| `context.error_class`, `context.error` | Technical/uncertain/unclassified events only: static class and static safe message |

This is an allowlist, not a projection of arbitrary context. Exclude IPs, headers, cookies, tokens, OAuth codes/state, passwords, action references, personal/gym/client identifiers, raw URLs/query strings, arguments/results, sporting records and raw exception messages/stacks. Never forward the whole `safeError()` object, which can contain gym identifiers. Do not log ingestion response bodies or validation messages from LogNorth.

Normalize routes from known route templates, not by attempting to redact arbitrary paths: OAuth/client/invitation/participant identifiers can occur in path segments. Unknown route and tool input must not enter labels. Tool events omit `path` so endpoint traffic is not doubled by tool observations.

Use `http_status`, not LogNorth's reserved `context.status`: LogNorth automatically treats numeric `status >= 500` as an error, which could override a recognized expected authentication outcome. Error grouping is driven deliberately by static error fields, without traces/releases/timestamps in grouping messages. HTTP 200 containing a tool error remains HTTP transport success while the tool event records its own outcome.

### Classification requirements

Interpret trusted typed program state through per-tool/per-phase mappings. Do not read/log an arbitrary HTTP response body or JSON-RPC content string to guess its meaning. Neither HTTP status, MCP `isError` nor a generic `result.status` alone establishes all domain outcomes.

| Observation | Classification rule |
| --- | --- |
| Known valid result, including ready/draft previews, confirmed writes, supported empty/no-RM/ambiguous views | Known successful result or expected domain non-executable result according to that tool's contract; no automatic technical issue |
| Known access/configuration denial, stale/refused action or unavailable booking capacity | `denied`, with a static code; preserve distinction from a technical failure |
| Personal activity incomplete retrieval or booking history `coverage.retrieval=partial` | `partial`; no automatic error issue |
| Workout `coverage.status=incomplete`, or search/RM/history `coverage.status=limited`, by itself | Documented source-view limitation; do not classify as failed/partial retrieval solely from that flag |
| Workout optional RM `enrichment.status=incomplete` | `partial` enrichment; no automatic error issue |
| Write `uncertain` or `ACTION_OUTCOME_UNCERTAIN` | `uncertain` issue describing unconfirmed effect |
| Deletion `observed-absent` | Known observed-absence result; never assert permanent erasure |
| Execution-stage deletion `still-visible`, `conflicting-identity` or `incomplete` after possible dispatch | Explicit uncertain/nonconfirmed-write code and `uncertain` issue; do not treat as ordinary query partiality or preparation refusal |
| Internal/upstream failure, unsupported response shape, identity mismatch, main maintenance failed/overdue or deferred cleanup rejection | `technical_failure` issue; distinguish safety failure from ordinary authentication denial |
| Unknown code/status/shape without a supported mapping | `unclassified`, static classifier issue; no copied payload, no invented sporting outcome |

Known authentication-required states need safe-code-specific rules: the hosted envelope can also contain `IDENTITY_MISMATCH`, so it is not wholesale an expected denial. Main cleanup success cannot erase a sticky overdue incident or establish successful deferred cleanup. Final implementation must enumerate and test every currently supported result variant of all 18 tools and relevant route/maintenance outcomes; uncovered variants use `unclassified`, never permissive success.

## Delivery and resource bounds

| Limit | Requirement |
| --- | --- |
| Event | At most 2,048 UTF-8 bytes of serialized event JSON |
| Invocation buffer / batch | At most 32 events and 65,536 UTF-8 bytes including final JSON envelope |
| Attempts | At most one batch submission for an invocation; never replay events or sporting actions |
| Deadline | Two seconds for the complete HTTP attempt, including bounded response processing; cancel pending network work on expiry |
| Ingestion response | Read at most 4 KiB; reject malformed/oversize/nonconforming responses without logging their contents |
| Complete acceptance | HTTP 201, valid acknowledgement, `created` exactly equal to submitted count and no per-event validation errors |

Register delivery with `ctx.waitUntil()`; do not await LogNorth before returning the application response or while holding an account queue/recovery lease. Keep existing maintenance deferred work and its error propagation intact. Its observations must settle before that invocation's one final batch is submitted; telemetry scheduling must not turn incomplete cleanup into success.

Use no cross-request event buffer, persistent queue, retry timer or shutdown hook. Invocation buffers remain within both count and byte bounds while collecting events, not merely at serialization. Drop an oversize event whole. Overflow priority is technical/uncertain/unclassified first, then partial, denied and success; retain arrival order within equal priority. Do not split into extra submissions to bypass invocation limits.

Transport/auth/rate-limit/database failures, redirects, timeout, malformed acknowledgements, partial acceptance and count mismatch are failed delivery. Do not follow redirects or retry, even when LogNorth supplies `Retry-After`. Partial or unknown acceptance may mean some events were stored; do not assert all were lost. Acknowledgement is not proof of immediate search visibility.

Emit nonrecursive fixed-category console warnings for timeout, rejection, partial acceptance, invalid configuration and dropped-event counts. Include only numeric technical counters; no endpoint/key/body/exception text. Do not enable persistent platform logs or invent guaranteed warning history through this integration. Intentional disabled mode produces no traffic or warning flood.

## Configuration and shared installation

Proposed concrete configuration names implement Q9 and remain part of this final review:

| Name | Source | Contract |
| --- | --- | --- |
| `LOGNORTH_ENABLED` | Operator configuration | Default false; explicit true enables validation/export. Invalid enabled configuration disables only telemetry. |
| `LOGNORTH_URL` | Operator configuration | Fixed HTTPS origin, no userinfo/query/fragment/custom path; initially the existing installation origin. Append only the fixed ingestion path. Never derive it from a request. |
| `LOGNORTH_API_KEY` | Platform secret | Required app-ingestion key when enabled; never use an agent/admin key or print it. |
| `LOGNORTH_ENVIRONMENT` | Operator configuration | Required bounded nonpersonal environment label when enabled. |
| `LOGNORTH_RELEASE` | Operator configuration/build metadata | Required bounded nonpersonal build identifier when enabled; do not reuse placeholder server version as deployment evidence. |

Validate configuration with no remote discovery or startup ingestion request. Reject redirects during delivery. Preserve existing credentials, bindings, routes, account queues, recovery authority and cron configuration. The anonymous preview remains disabled or uses an explicit synthetic sink; it must not contact the real service accidentally.

Retention, notification destination and quiet-hours policy are installation-global. Record effective retention and notification behavior plus authorized reader scope before later activation; preserve them without changing other applications. An agent key is read-only but may cover other applications; do not claim per-app access restriction without verifying it. Add no participant/portal access. LogNorth answers returned to an AI agent may enter its provider's conversation context; field minimization applies before storage.

Technical/uncertain/unclassified issues may notify under existing settings, including new/regression behavior. Do not add channels, pings, quiet-hour changes, alert rules or monitor configuration in this delivery. Grouping is not a guarantee of notification receipt. Missing cron, total host failure and lost events require a separate observer and remain outside acceptance claims.

## Acceptance contract

### Automated, synthetic-only evidence

Use the existing hosted HTTP/MCP SDK and native local Worker harness where appropriate. No real AimHarder booking, cancellation, publication or deletion is authorized for telemetry tests.

- Cover all event catalog types, early HTTP auth/recovery exits, all 18 tools, thrown failures and maintenance main/deferred/no-op/failure/overdue paths. One tool invocation produces one tool completion observation before possible discard.
- Verify HTTP 200 with MCP error, valid MCP envelope with uncertain domain result, expected access/booking denials, true partial retrieval versus normal source-view limits, all current result variants and unknown classification. Test error grouping fields and the absence of reserved `status` overrides.
- Seed secrets/personal data in malicious paths, headers, arguments, results, errors, unexpected objects and LogNorth acknowledgements. Verify only the field allowlist reaches either sink and safe diagnostics.
- Verify concurrent-account/request and deferred-work isolation, fresh traces, no public-response changes and no cross-request preparation linkage. Do not move persistent per-account state into telemetry.
- Compare application responses/errors, confirmations, reference consumption, queue/lease ordering, upstream request counts and at-most-one write dispatch with exporter disabled, successful, unavailable and timing out.
- Verify default-off/invalid configuration, exact destination, redirect rejection, byte/count limits, overflow priority, oversize discard, response cap, full-attempt cancellation, exact acceptance count, malformed/partial replies and no retries, recursion or persistent buffering.
- Observe that response completion and recovery lease release do not wait for delivery. Preserve existing cleanup work and failure propagation; exporter failure cannot become an application failure.

### Later native acceptance and operational evidence

After separate authorization for implementation and controlled native validation activation:

1. Run appropriate project checks and record actual results, with implementation/docs/ADRs agreeing.
2. Verify effective installed retention, notifications, reader access and exact public ingestion reachability without exposing secrets. Access-protected panel availability does not establish an accessible ingestion route.
3. Compare representative actual Worker CPU before/after, including auth, MCP and maintenance paths, with exporter disabled/enabled and successful/failing delivery. Record sample size, payload/subrequests and CPU distributions/observed limit errors; report unavailable measurements rather than invent them. Passing small samples is not capacity/cost approval.
4. Send controlled, clearly identified nonpersonal validation observations from the actual Worker, using synthetic sporting outcomes only. Read them back freshly through LogNorth MCP and match expected static fields, trace grouping, error classification and absence of excluded data. Allow for asynchronous indexing; do not resend to force visibility. Existing notification side effects must be described before this validation.
5. Verify that loss/timeout behavior preserves the application, and demonstrate disabling collection/export while retaining the application's normal bindings and response behavior.
6. If instrumentation introduces Free-limit errors or incompatible overhead, do not activate it as an accepted solution. Present evidence and alternatives without purchasing an upgrade. Historical baseline resource issues remain separate and must not be concealed by a successful telemetry check.

Native read-back, measured resource overhead, notification receipt and activation have not occurred. Synthetic tests cannot stand in for those observations. The integration does not establish provider physical erasure, exhaustive history, all future delivery or exact aggregate totals.

## Delivery, activation and rollback boundaries

This task delivers the reviewed specification, research and ADRs. The confirmed self-contained spec is published in [issue #94](https://github.com/rudeayelo/aimharder-mcp/issues/94). It describes the supporting ADRs without depending on unpublished repository paths. Implementation needs a subsequent user request. Final specification confirmation is not production/deployment approval.

A later implementation delivery must include code, relevant checks, updated operator/validation documentation and an acceptance record, initially disabled. Sustained activation is a separate authorized step after native evidence; uploading secrets, changing a deployment or shared LogNorth settings is not part of this interview.

Rollback means disabling `LOGNORTH_ENABLED` in operator configuration through an authorized configuration deployment, preserving other secrets/bindings. Subsequent invocations collect/send nothing; an already submitted invocation-local batch may finish within its deadline. Disabling does not delete previously stored events or issues. No database migration, persistent-queue drain, application response change or global LogNorth reset is needed.

## Review status

Product decisions Q1–Q19 and the consolidated event/configuration, classification and bounded-export contract were confirmed by the owner on 2026-10-28. Specification #94 was published with 46 user stories and the `ready-for-agent` label; a fresh read-back verified the exact issue body and label. No implementation is validated or activated. Documentation checks cover local links, whitespace and consistency. Runtime tests are deferred until implementation.

The owner confirmed shared understanding and explicitly requested publication through `to-spec`. Normal documented source-view limits remain distinct from partial retrieval; only the latter is classified `partial` by itself. The interview is complete.
