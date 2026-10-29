# ADR: hosted observability scope and privacy

Status: accepted for scope and privacy on 2026-10-28. The owner confirmed the consolidated specification, published as [issue #94](https://github.com/rudeayelo/aimharder-mcp/issues/94); implementation and deployment are not authorized by this ADR.

## Context

The owner wants LogNorth to support diagnosis and aggregate operational understanding of the hosted AimHarder MCP service while remaining on Workers Free. Cross-request participant tracking would aid individual support but would create additional persistent identifying telemetry outside the minimal operational purpose.

## Decision

Cover hosted portal, authentication, MCP tools and scheduled maintenance. Exclude local stdio instrumentation from this specification. Collect technical evidence for diagnosis, tool usage, latency and correct/failed/uncertain outcomes, with correlation within one operation and no persistent participant identifier, including a pseudonym. Do not collect tool arguments or sporting results.

Telemetry is not an audit record and does not prove the effect of a sporting write. Existing action coordination, account isolation and independent recovery/deletion records remain authoritative. Preserve the [credential policy](2026-09-21-credential-security-and-read-only-access.md) and [hosted credential-custody boundary](2026-10-15-hosted-identity-and-credential-custody.md).

## Consequences

An operator can reconstruct an instrumented operation but cannot automatically retrieve a participant's cross-request history. Aggregate metrics and diagnostic events cannot be used to claim complete sporting activity or confirmed write effects. Adding participant-level correlation requires a later explicit decision. The later [best-effort delivery decision](2026-10-28-best-effort-hosted-telemetry-delivery.md) settles delivery semantics. The consolidated [specification](../lognorth-observability-spec.md) records the event allowlist, inherited global retention/notification policy, preserved operator-only access and automated/native acceptance requirements. No current ADR is superseded by these additive scope/privacy decisions.

## Implementation review (2026-10-29)

The later owner request authorized implementation on an integration branch. The [implementation ledger](../hosted-observability.md) now covers hosted HTTP, all 18 tool callbacks and both scheduled phases through an invocation-local technical allowlist. Synthetic native Worker/SDK checks exercise privacy, classification and preserved application behavior. No participant reader, identity correlation, sporting-data store, upstream contract or local stdio instrumentation is added; the accepted scope/privacy decision is unchanged. Actual Worker receipt/settings/access/CPU and remote-disable evidence remain pending under #102, which requires separate controlled validation authorization. This review authorizes no deployment or sustained activation.
