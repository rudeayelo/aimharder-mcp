# ADR: hosted participant suspension

Status: accepted on 2026-10-19 for [issue #82](https://github.com/rudeayelo/aimharder-mcp/issues/82). Synthetic implementation; production activation and actual client acceptance remain separate.

## Context

The [hosted identity decision](2026-10-15-hosted-identity-and-credential-custody.md) requires suspension to block portal/MCP use, retain configuration and require fresh MCP consent after reactivation. Current grants and pending authorization codes carry per-client revocation generations. The [action coordinator](2026-10-19-confirmed-hosted-action-coordination.md) owns whole prepare/execute/read-back operations, including a current-grant check immediately before an external dispatch. Queueing the access-denial transition behind a held external request would leave suspension unable to take effect promptly.

## Decision

Provide an administrator-only participant projection containing name, portal email, role, admission status and saved connection presence. Read only encrypted-row presence: do not decrypt, contact upstream, expose diagnostics/private sporting data, impersonate participants, edit roles or introduce per-user feature policy. Prevent suspending the current administrator. Reuse the same strict-origin implementation for browser and API state transitions.

Commit suspension/reactivation as one D1 batch outside the upstream actor queue. Recheck current verified active administrator and expected target status in every statement. Increment every registered client's revocation generation, even when it has no completed grant row. Revoke grants, access/refresh tokens and consent; delete portal sessions; then atomically change status and increment `portal_participant.accessGeneration`. No reader sees a new usable generation with an intermediate active status. Reactivation never clears tombstones or returns old consent.

The maintained auth handler rejects cached-session operations without current participant admission. New authorization snapshots read active verified admission, the still-persisted current portal session and all registered client generations together. An authorization request holding an old session cannot resume after suspension/reactivation and adopt the later generation. Token issuance and each protected MCP request retain current-grant validation.

Bind every unused in-memory booking, standard/late cancellation, activity publication and activity deletion preparation to the participant access generation. Retain all existing connection/action/gym/identity/expiry bindings. This invalidates preparations across suspension/reactivation even when a freshly authorized client uses the same warm actor. Retained possible-send records remain dispatch fences, not permission. They can reconcile read-only after fresh admission/authorization, preserving original identity and uncertainty.

The final current-grant check is the external dispatch admission point. Suspension ordered before it denies a new send. An already admitted request may finish original-account read-back through its existing owned client while suspension blocks new portal/MCP requests. Do not block suspension on that read-back, retarget it, restore credentials or replay the write. Preserve encrypted configuration and portal identity/sign-in methods for reactivation. Account deletion and an independent authority outside a restored authentication D1 remain separate work.

## Consequences

`0008-participant-access-generation.sql` must precede this bundle. No new secret, provider binding or credential rewrite is required. The schema is application admission policy, separate from maintained auth tables. Suspension ends existing portal sessions; a participant signs in and explicitly authorizes MCP clients again after reactivation. Saved connection presence is useful for administration but deliberately conveys no upstream-health guarantee. Existing D1 transactions cannot make the external AimHarder request transactional and do not preserve revocations if the entire D1 is rolled back; deletion/restore enforcement remains #83.

The [participant guide](../hosted-participants.md) records public contracts, synthetic two-account/restart/concurrency evidence and remaining real-client/provider gates. Historical local scope and upstream contracts are unchanged.
