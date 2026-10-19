# Hosted restore provider validation

This records the **isolated synthetic-only Cloudflare experiment on 2026-10-19** for [#83](https://github.com/rudeayelo/aimharder-mcp/issues/83). It complements the [application tests and operator protocol](hosted-account-deletion.md) and [independent-authority decision](adr/2026-10-19-independent-deletion-and-controlled-restoration.md). It is not an owner-account database restore, a deployed production pilot, actual ChatGPT/Hermes acceptance or elapsed physical-erasure evidence.

**Current checkpoint:** the actual native restore, scheduled purge, binding reconciliation, explicit reopening and fresh-proof public journey passed. Disposable-resource cleanup and copy-inventory closeout also passed, supplying the separate actual provider evidence for #83. Actual pilot capacity/cost and client acceptance remain #84.

## Scope and actual runtime

The probe used reviewed integration `3ada64cff3fa52d80cb2ea05bef1d9a2ee10c0a7`, corresponding to reviewed candidate `b1e1fb26a23df705f35025f11705d90eef534d28`. It had distinct new application and independent-authority D1 databases and a new SQLite account namespace; exact provider identities/bindings were checked privately. A capability-guarded probe origin and disabled ordinary observability kept operator seams separate from the product. Resource identifiers, capabilities, keys, cookies, tokens and credential payloads are omitted here.

Portal authentication, authorization/consent, MCP SDK HTTP, D1, account objects, vault cryptography and the selected operator module use real production code. Synthetic identities, fixture provisioning, external AimHarder/Resend responses and a binding-only restore observation seam make this safe to run without owner data or sporting mutations. A seeded Google association is synthetic test state, not an actual Google authentication/consent journey. The earlier owner Google and independent-key/rotation/recovery evidence remains separately described in the [Google guide](hosted-google.md) and [connection guide](hosted-aimharder-connection.md#controlled-platform-rotation-and-runtime-recovery-2026-10-19).

The initial probe denied a self-JWKS request. Its private wrapper was corrected to re-enter the real production handler **only for the exact probe origin's GET `/api/auth/jwks`**; no authorization/JWKS response was fabricated and no product code changed. The initial blocked-request counter remained one through cleanup. The original external fetch boundary was never used to bypass the synthetic outbound policy.

At this experiment's pre-cutover checkpoint on 2026-10-19, the owner test Worker still ran its earlier #74 connection bundle. This isolated probe did not activate the owner's application migrations `0006`–`0009` or independent recovery binding. **Later the same day, the separately fenced [full-runtime activation](hosted-test-environment.md#full-runtime-activation-2026-10-19) superseded that owner-environment status:** reviewed executable 76686e4, those migrations and the independent authority are now active. No owner database was restored in either sequence. Actual ChatGPT/Hermes and sustainable capacity/cost acceptance remain #84 work; the native experiment below retains its own source and isolated-resource evidence.

## Confirmed provider observations

| Check | Observed result |
| --- | --- |
| Plan/backend isolation | Existing Free plan; distinct new D1 resources and SQLite Durable Object namespace, with exact binding readback. No purchase or plan change. |
| Actual native history setting | The exact probe application's authenticated Time Travel UI displayed seven recoverable days. No elapsed-expiry or physical-erasure claim. |
| Actual quiet cron | Deployed `*/5 * * * *`; one provider invocation in the quiet window completed successfully with zero errors. Total CPU was **520 microseconds (0.520 ms)**. This is one empty/quiet invocation, not purge cost, a billing result or a twenty-user load estimate. |
| Real public setup | Two synthetic identities completed password sign-in, maintained OAuth and SDK account/gym reads. An unused action preparation was retained for the later stale-reference check. |
| Later security state | B's client access was revoked and its connection disconnected. A's linked credential/Google portal identity was deleted. The independent gate was closed, actual lease count was zero and the latest manifest/restore point was recorded. |
| Native D1 restore | One actual Time Travel restore brought back both encrypted synthetic connection rows. |
| Restored key usability | Real `decryptConnection` authenticated both restored ciphertexts while the independent gate remained closed with zero leases. No plaintext or envelope copy was persisted in the evidence artifact. |
| Public quarantine | Actual `/account`, `/api/auth/get-session` and `/mcp` each returned 503 after native restoration. |
| Native SQLite-object restore | One `onNextSession` restore was scheduled; an independent counter observed exactly one restore event, and a separate read returned the earlier synthetic owner/canary. The restore acknowledgement's expected abort/500 alone was not treated as success. |
| Actual scheduled forbidden-data purge | A real later cron purged A while the gate stayed closed and leases stayed zero, **before any full-projection marker existed**. All checked active A rows were absent; the original deletion/deadline, independent tombstone/checkpoint remained; pending cleared and health was ok. |
| Restored object cleanup | Memory-erasure completion was later than native object restoration, and a separate object read then found both owner and canary empty. |
| Full binding reconciliation | The actual production binding operator completed; its next-epoch application marker and completed independent audit UUID matched, with the unchanged gate still closed and zero leases. Forbidden restored connections, sessions, refresh/consent/journal state and old password hashes were absent. |
| Reopen and public proof | Explicit reopen reached epoch 1. Deleted A and old sessions/bearers/refresh/old password were denied. B completed fresh maintained password recovery and OAuth; its later disconnection remained effective until an explicit new synthetic connection and SDK query. |
| Old unused preparation | It remained unusable after fresh proof/connection. Its observed age was 443,364 ms, so expiry may also explain denial; this live result alone does not isolate the invalidation cause. Local deterministic regressions separately isolate epoch/grant/revision fences. |
| Sporting mutations | Zero real sporting writes. The external sporting boundary remained synthetic. |

For the object experiment, an initial denied Python transport scheduled **zero** restores according to independent observation. The operator inspected that result before switching to the known-working Node HTTP path; the eventual count is one actual restore, not two blind attempts. D1 Time Travel and object point-in-time restoration are separate provider operations.

## Completed controlled sequence and CPU boundary

The native post-restore cron removed A before the full reconciliation marker existed, establishing that the tombstone watchdog ran independently under quarantine. The subsequent real binding reconciliation and explicit reopen preserved the later revocation/disconnection decisions rather than accepting the restored older projection. B's fresh connection was a new explicit synthetic setup, not a resurrected deleted/disconnected credential. Owner data was never restored.

The selected live reconciliation path was the production **binding operator with actual D1 batches**. The offline native SQL command's sequential API-shaped execution remains public workerd/D1 fixture evidence; this experiment does not claim a second live provider REST cleanup-plan trial.

The isolated 11:49:22–11:50:27 UTC provider metrics window contained one successful **nonempty purge** invocation, zero errors, one subrequest, **14,579 microseconds (14.579 ms) total CPU** and **0.41472975 GB*s** duration. No public HTTP ran inside that window. This is the observed probe runtime, including its independent cron-observation wrapper, rather than an instrumentation-free product benchmark. It exceeds the nominal **10 ms Free cron CPU allowance**. Cloudflare documents [occasional CPU-limit flexibility](https://developers.cloudflare.com/workers/platform/limits/#cpu-time); the successful outcome is not a guarantee that repeated or larger purges will succeed. The earlier 520-microsecond quiet sample is distinct. Neither sample proves twenty-participant feasibility, bills, or sustainable Free operation. Resolve that acceptance gate in #84 without purchases or plan changes.

## Retention, custody and measurement limits

The implemented deadline is anchored to original deletion: purge current forbidden payload by deletion plus 23 days, leaving at most the actually configured seven-day native history window within thirty days. The five-minute watchdog retries under a closed gate and retains pending/sticky-overdue evidence across failed completion and new reconciliation plans. This is a conditional enforceable operational policy with explicit incidents, not an observation that thirty days elapsed or physical media were erased. Provider outage, missed deadline, lost authority, copied payload or unmonitored cron cannot be labeled compliant expiry.

The probe used synthetic key material. Independent key custody and prior active-key-only owner recovery are separate earlier #74 evidence that keys are not merely stored in the restored database; no owner key rotation or owner database restore was performed by this probe. They do not erase old ciphertext. Native history, independent authority, retained key escrows, local operator artifacts, temporary imports/exports, staging resources and email-provider records belong in the separate copy/deadline inventory. No credential/ciphertext export was created for this native trial. The completed copy closeout below records the scoped inventory and retirement observations.

Broader request/CPU/storage/mail/domain measurements and actual client journeys remain #84. No real sporting write was performed, and each future real sporting write still needs its own exact account-holder confirmation.

## Disposable-resource and copy closeout

After the positive journey, B's remaining synthetic account was deleted through the public account-deletion endpoint with 204. Independent readback found zero current disposable users, credentials and sessions before retirement. The probe Worker was then deleted without force; a subsequent query returned 404 and its newly created SQLite namespace was absent. Each exact dedicated probe D1 database subsequently returned 404. The provider database inventory returned to its original count of two. No probe Worker, cron, database or account namespace remains active; original owner-bearing resources were never restored or retired.

The local synthetic capability and auth secret were removed from the private manifests; no credential/ciphertext exports were created. Both owner-managed key escrows remain as instructed, independently of database contents. One earlier completed owner-rotation payload artifact had already been retired, keeping only sanitized hash/count/verification evidence and one-shot guards. Read-only host metadata found no configured Time Machine destinations and no local snapshots; it is not an exhaustive device/cloud-backup inventory. Neither 404/resource retirement, local artifact retirement nor this metadata is a claim of elapsed provider expiry, undocumented undelete retention or physical/forensic erasure. No provider setting was changed to buy or expand retention.

## Evidence handling

The operator retained sanitized private runtime/retention/cron, restored-ciphertext, independent object-event/canary and public-denial readbacks. Public documentation uses only synthetic A/B labels, counts, statuses, timings and reviewed source references. Protected provider manifests, owner resource identifiers, capabilities and secret-bearing state are not repository artifacts. The completed controlled sequence, scoped copy/retirement evidence and remaining pilot limits are also recorded in [validation](validation.md).
