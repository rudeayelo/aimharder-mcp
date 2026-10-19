# Hosted participant suspension

[Issue #82](https://github.com/rudeayelo/aimharder-mcp/issues/82) implements administration of admitted participants. This is a local synthetic delivery; it does not establish deployed pilot or real-client acceptance. The [identity decision](adr/2026-10-15-hosted-identity-and-credential-custody.md) remains the product contract; the [suspension decision](adr/2026-10-19-hosted-participant-suspension.md) records ordering and privacy.

## Administration boundary

An active, verified administrator can open **Manage participants** from the portal. The list shows at most 100 admitted participants, with name, portal email, role, active/suspended status and whether encrypted AimHarder configuration is saved. `configured` is configuration presence, not verified upstream health. Listing never decrypts a connection or contacts AimHarder. It exposes no gym, sporting data, password, token, diagnostic, impersonation action, role editor or per-user feature switch. Activity policy remains role-based and separate.

The administrator can suspend or reactivate another participant. Suspending the current administrator is refused to avoid locking out the only owner. Ordinary users and anonymous callers cannot list or change participants. All state changes require a same-origin POST and current active administrator admission. Browser forms and JSON callers use the same implementation.

| Route | Behavior |
| --- | --- |
| `GET /admin/participants` | Minimal list with suspend/reactivate browser controls |
| `GET /api/portal/participants` | Same minimal projection under `participants` |
| `POST /portal/participants/:userId/suspend` | Browser transition; redirect to the list |
| `POST /portal/participants/:userId/reactivate` | Browser transition; redirect to the list |
| `POST /api/portal/participants/:userId/suspend` | API transition; 204 on change, 409 for unavailable/current state |
| `POST /api/portal/participants/:userId/reactivate` | API transition; 204 on change, 409 for unavailable/current state |

Pages and API responses are not cacheable. These identifiers designate portal participants, not upstream account IDs. No client-supplied role, credential or arbitrary setting is accepted by the controls.

## Access and action ordering

A single atomic D1 batch increments revocation generations for **every registered client**, including clients without completed grant rows; revokes existing grant/access/refresh/consent records; deletes portal sessions; increments the participant access generation; and changes status. Each statement checks the same prior target status and current verified administrator, with status changed last inside the transaction. Reactivation never rewrites a revoked grant as valid.

Suspension commits outside the account actor queue. A hung upstream preflight therefore cannot delay access denial. Every subsequent portal operation and protected MCP request checks current admission, including cached cookies/JWTs. The public maintained session getter has the same gate; internal session lookups allow each portal route to return its safe admission status. Suspended participants cannot sign in or recover access. Reactivation retains identity, portal sign-in methods and encrypted AimHarder settings, but the participant must sign in again and explicitly authorize each MCP client. Previous JWTs, refresh tokens and pending authorization codes remain unusable after restart and reactivation. Authorization snapshots join current active admission, verified identity, the still-current portal session and all registered client generations in one read, preventing an old request from adopting a later generation.

Unused booking-creation, standard/late cancellation, publication and deletion preparations bind the participant access generation as well as the existing ownership, connection revision, pinned upstream identity, gym, action and expiry. A newly authorized client cannot reuse a warm preparation from before suspension. A queued or preflight operation still faces the current-grant guard immediately before dispatch. If suspension won that ordering, no sporting request is sent.

An upstream request already admitted at that final guard cannot be unsent. Its owned actor retains the original client through fresh original-account read-back and returns an honest confirmed/rejected/uncertain outcome. It does not require current admission to complete that already-running read-back. Once suspended, new participant requests cannot fetch recovery data. After reactivation and fresh consent, a retained possible-send record may reconcile read-only through the original account after restart; it never restores permission or repeats a write. Configuration is preserved throughout suspension. Independent deletion/revocation authority across backup restoration remains [#83](https://github.com/rudeayelo/aimharder-mcp/issues/83); these D1 generations alone do not supply it.

## Migration and evidence

Apply `hosted/migrations/0008-participant-access-generation.sql` once, after the earlier reviewed application migrations, before deploying this bundle. It adds a default-zero integer to existing participants; it does not modify credentials or connection envelopes. The existing remote migration-ledger limitations still apply: do not replay initial migrations. No new provider binding or secret is required.

Ten public HTTP/actual SDK journeys use real Better Auth, workerd, D1, SQLite account objects and the real upstream client with synthetic external HTTP. They cover minimal administration and ordinary-user denial; browser/CSRF controls; cached portal/access/refresh/pending-code denial and persistent restart; retained connection settings and fresh authorization; suspension during held preflight and unused-reference invalidation; held possible-send original-account read-back and read-only restart recovery; code storage racing suspension/reactivation; an old session racing the atomic authorization snapshot; and separate publication/deletion checks for warm unused-reference invalidation plus original-account possible-send recovery after suspension/reactivation. Test-only barriers schedule actual database writes/reads and upstream responses; they do not replace authentication, actor coordination or persistence decisions.

Final combined validation on Node 24.22.0 passes 143 hosted tests in thirteen files, hosted typecheck/build and the isolated 31-file/eighteen-tool package check with empty stderr. Shared local source is unchanged from the reviewed lifecycle integration; its existing 471-test result is reused.

Provider activation, actual administrator browser acceptance, ChatGPT/Hermes journeys, physical retention and measured load/cost remain separate acceptance gates. No provider, real participant, real upstream query/write, purchase or plan change occurred for this implementation. Local stdio source, public inputs/outputs and package surface are unchanged.

The later [deletion/restore guide](hosted-account-deletion.md) implements an independent recovery gate and current drained security manifest outside restored `AUTH_DB`. Restored suspension/status and role policy are reapplied before reopening, old sessions/grants require fresh proof/consent and connection revisions must match the latest seal. This extends recovery safety without changing ordinary suspension behavior; actual provider restore acceptance remains separate.
