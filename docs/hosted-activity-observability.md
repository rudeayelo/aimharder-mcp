# Hosted activity outcome observations

Issue [#100](https://github.com/rudeayelo/aimharder-mcp/issues/100) implements the four hosted activity tool observations under the [observability specification](lognorth-observability-spec.md) and [delivery decision](adr/2026-10-28-best-effort-hosted-telemetry-delivery.md). Collection remains disabled by default. This adds no sporting permission, deployment or live activity-write authorization.

The classifier reads the trusted parsed account result before MCP serialization. It exports only source-defined outcomes and codes, never the draft, results, achieved loads, audience, source provenance, rejection diagnostics, sporting identifiers or action references. Preparation and execution retain independent invocation traces.

| Tool | Outcome |
| --- | --- |
| Publication preparation | Draft and ready succeed; missing and unsupported are expected denials. A draft has no executable reference. |
| Publication execution | Confirmed succeeds; rejected and stale are denied; uncertain creates an uncertainty issue. |
| Deletion preparation | Ready succeeds; missing, ambiguous and unsupported are denied. Incomplete calendar retrieval is a technical failure before any dispatch. Foreign owner/gym is an identity safety failure. |
| Deletion execution | Stale is denied before dispatch. Observed absence succeeds with `observed_absent`, meaning only absence from the fresh own calendar. Still visible, conflicting identity, incomplete read-back and uncertain each receive distinct uncertainty codes. None is ordinary query partiality. |

Role denial and invalid references remain expected denials. The existing `ACTION_OUTCOME_UNCERTAIN` recovery error remains uncertainty. Unknown or missing result variants create a static classifier issue without exporting the unknown value. Technical failures and uncertainty use the existing static issue grouping; expected refusal does not create an error issue.

## Synthetic validation

The existing authenticated HTTP/MCP SDK journeys run against the native Worker, D1 and account Durable Object with synthetic upstream responses. Every returned activity result in these journeys is checked against its telemetry classification, including restart/recovery, held preflight, role changes, foreign identity, changed source, overlapping execution and uncertain read-back. Additional preparation cases cover publication draft/missing/unsupported and deletion missing/ambiguous/incomplete/unsupported.

The exporter matrix compares complete public structured previews (excluding fresh opaque references and expiration) and execution results across disabled, accepting, rejecting and two-second timeout receivers. It checks role gates, explicit confirmation, overlapping execution, consumed-reference rejection and exactly one POST/DELETE. Hostile sporting text and private-detail markers must be absent from received events and platform-warning output. Each preparation/execution trace remains separate. These observations establish synthetic behavior only; they do not establish deployed ingestion, native provider CPU overhead, permanent erasure or RM effects.

Verified commands on 2026-10-29:

- `pnpm --dir hosted exec vitest run tests/activity-publication.test.ts --no-file-parallelism --testTimeout=30000`: 23 tests passed.
- `pnpm --dir hosted exec vitest run tests/activity-deletion.test.ts --no-file-parallelism --testTimeout=30000`: 20 tests passed.
- `pnpm --dir hosted exec vitest run tests/activity-deletion.test.ts tests/telemetry.test.ts --no-file-parallelism --testTimeout=30000`: 30 tests passed after integrating the read-tool slice, including unknown/missing activity-state fallback through the synthetic HTTP receiver harness.
- `pnpm --dir hosted exec tsc --noEmit`: passed.

The existing activity feature contracts, confirmation model and local stdio behavior are unchanged. The delivery ADR remains applicable without a new architecture decision. Actual controlled validation remains separately gated by [the native procedure](hosted-telemetry-native-validation.md).
