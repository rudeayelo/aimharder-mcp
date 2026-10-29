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

## Controlled native review (2026-10-29)

The owner subsequently authorized one isolated validation deployment, existing protected app-key provisioning and temporary activation bounded to two hours, followed by disabling. The [actual receipt](../hosted-telemetry-native-receipt.md) records provider read-back, effective shared settings/access, observed delivery/privacy, CPU estimates and verified disabling. No shared LogNorth setting, plan, participant access or sporting-write scope changed. The destination's dot-path filter prevents discovery-event storage; missing maintenance CPU and current-plan evidence leave native acceptance incomplete. The existing decision is unchanged, and sustained activation remains a subsequent decision. Earlier authorization statements describe their historical stage.

## Temporary destination compatibility decision (2026-10-29)

Status: accepted by the owner's explicit request to apply the prepared patch until an official fixed LogNorth release is available.

Decision: deploy the tested local 0.29.0 image containing only the exact `/.well-known/` filter exception, already merged upstream in PR #94. Pin the local image with `pull_policy: never`, preserve existing Compose resources/environment/data/global policy, retain a verified backup and original image/configuration, and verify delivery through a separately bounded ten-minute Worker activation with independent disabling. This is a temporary operational distribution choice, not a permanent fork, new telemetry field or delivery-policy change.

Consequences: the [actual follow-up](../hosted-telemetry-compatibility-validation.md) verifies all twenty discovery observations and final disabling in under three minutes. Later official replacement requires the normal reviewed upgrade and repeat checks; no automatic update or sustained activation is scheduled. Stored events are retained across code rollback. The prior missing CPU/current-plan/baseline evidence still prevents complete native acceptance. The original best-effort, privacy and account/recovery boundaries are unchanged; no previous ADR is superseded.

## Owner-selected Paid capacity reference (2026-10-29)

Status: accepted amendment to the Free-only planning premise, based on the owner's report that they have completed the Cloudflare upgrade to Paid. The agent did not purchase or change the plan. At this amendment's original checkpoint, independent current-subscription verification was unavailable: the subscription read returned 403 and the browser required sign-in. The later [authenticated dashboard verification](../hosted-telemetry-resource-followup.md#authenticated-dashboard-verification-2026-10-29) independently confirms Paid as the current plan. The upgrade's exact effective time remains unknown.

Use the owner-selected Paid plan as the reference for subsequent capacity investigation, subject to confirming actual subscription and effective Worker limits. This supersedes only the earlier requirement to remain on Free in this ADR and the scope/privacy ADR's planning context; it does not retroactively establish a plan for earlier measurements. Preserve historical Free observations and distinguish them from later observations under the owner-reported Paid state. The existing service-budget target has not been revised or proven feasible by this report.

Delivery bounds, privacy, account/recovery safety, representative before/after resource measurements and the separate sustained-activation gate remain unchanged. A successful upgrade does not supply missing scheduled CPU or acceptance evidence. No new deployment, logging observer, resource-limit increase, additional purchase or sustained telemetry activation follows from the report.

The [fresh Paid follow-up](../hosted-telemetry-resource-followup.md#owner-reported-upgrade-to-paid-2026-10-29) records unchanged module/bindings/effective cron, disabled export, a new successful main-maintenance receipt and still-empty scheduled CPU views. The full native acceptance remains open.

### Authenticated Paid verification review (2026-10-29)

The signed-in Workers plans view now confirms Paid as the current subscription. The same Worker's Cron events view still has no CPU rows, despite independently successful maintenance. This resolves the subscription-evidence gap without resolving scheduled CPU or the baseline comparison. No decision, delivery/privacy bound, budget target or activation authority changes; earlier unavailable-plan statements remain historical. The [dashboard receipt](../hosted-telemetry-dashboard-validation.json) records the current evidence and unchanged disabled service configuration.

## Temporary scheduled CPU observer (2026-10-29)

Status: accepted for the owner-authorized bounded measurement only, after the owner accepted the proposed temporary capture/comparison. The [capture procedure](../hosted-telemetry-cpu-capture.md) uses runtime Tail Worker CPU getters with verified integer-millisecond units, a scheduled-only technical projection, a transient consumer tail and no public endpoint/storage/persistent platform logging. It is separate from the production LogNorth exporter and its event schema.

The observer does not modify either producer artifact or the diagnostic delivery decision. Native comparison can switch between the retained pre-instrumentation and reviewed production artifacts while preserving resources; final cleanup restores the reviewed artifact, exact original LogNorth settings with export disabled, and removes the owned observer/tail. The maximum whole-run bound is two hours, with independent cleanup starting five minutes earlier. No recurring monitor or permanent tail destination is added. The existing Paid plan is used; no new subscription, permission expansion, shared LogNorth change, sporting write or sustained activation is authorized. The observer's own CPU is separate, and cost/capacity remains evidence-dependent.

This scoped validation choice resolves how to investigate the unavailable scheduled metrics; it is not evidence that capture or native acceptance has passed. Results and actual cleanup must be recorded after execution. Scope/privacy, original delivery limits, recovery authority and budget target remain unchanged.

### Actual partial observer result (2026-10-29)

The [bounded scheduled CPU capture](../hosted-telemetry-cpu-capture.md) establishes the native timing source, five baseline, five disabled and five reachable samples plus five received maintenance pairs. The transient capture connection closed after only two unavailable samples; the controller stopped and independently verified restoration/deletion within the unchanged two-hour whole-run bound. Native acceptance remains incomplete for that cell. A prepared 35-minute unavailable-only repetition is unexecuted and requires separate owner authorization; it does not extend the original window. Scope/privacy, recovery authority, delivery bounds, budget target and the separate sustained-activation gate are unchanged.
