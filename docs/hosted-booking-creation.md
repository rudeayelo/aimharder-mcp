# Hosted confirmed booking creation

Issue [#77](https://github.com/rudeayelo/aimharder-mcp/issues/77) adds the first complete remote sporting write and reusable account coordination. The [coordination ADR](adr/2026-10-19-confirmed-hosted-action-coordination.md) records the storage, dispatch and recovery decisions. This is synthetic implementation evidence; no real booking was created.

## Participant journey

1. Authorize the MCP client and connect your own AimHarder account. Confirm the gym's IANA zone in portal settings.
2. Call `prepare_booking_creation` with the existing exact class name, gym-local date/start/end time and optional verified gym. Inspect the full preview; missing, ambiguous, booked, waitlisted or unsupported targets receive no executable reference.
3. The client must show the exact gym/class/date/time and obtain one separate account-holder confirmation. Only then call `execute_booking_creation` with its fresh reference and `confirmed: true`. There is no additional credit-use acknowledgement.
4. Read the outcome. Fresh original-account schedule/upcoming reads determine confirmed, waitlisted, rejected or uncertain state; stale preflight sends nothing. An uncertain result requires manual inspection before any newly prepared action. No response or process failure causes automatic replay.

Failure to save post-send recovery details still attempts fresh original-account read-back and returns its honest result with a recovery-limit notice. Failure to save the final internal phase marker cannot discard a result already reconciled; the earlier durable dispatch fence still prevents replay. If response interpretation could not be saved, later restart recovery can be less conclusive than the response available now.

Both roles have booking creation without a feature switch. Existing [tool contracts](tools.md#prepare_booking_creation) and [API evidence limits](api-research.md#live-standard-open-box-cycle-2026-09-25) remain current. A synthetic `confirmed: true` is not evidence that a real person confirmed a real action; each live write still needs its exact separate confirmation.

## Consumption and interruption

The actor owns the full client operation, encrypted connection and preparation binding. It durably consumes permission before execution preflight. A purpose-specific encrypted D1 journal records minimal original operation facts before any possible send. The last private dispatch guard checks active verified participant, current client/grant/generation and exact connection revision together, then checks expiry. The guard is per execution request; a reused client never carries an old MCP client's authorization permanently.

| Interruption or invalid use | Result |
| --- | --- |
| Foreign, expired, wrong-gym, old-revision or duplicate reference | No new booking request; fresh preparation required |
| Restart before dispatch facts exist | Lost preparation cannot execute |
| Durable dispatch fence before a send, or lost write response | Retained record permits original-account read-only reconciliation, never replay |
| Restart after a result but before its receipt | Read-only recovery may observe the current original target; no repeated write |
| Original identity/revision unavailable or read-back incomplete | Uncertain original outcome; no replacement-account read or secret restoration |
| Recovery record expired or missing | No execution permission and no proof that the earlier action was absent or undone |

Preparations expire after two minutes; expiry is checked again after held preflight/final authorization. Up to 32 preparations and 64 live recovery records are retained per account. Recovery records expire ten minutes after consumption and are purged by account alarms/request sweeps and trusted global maintenance. They contain encrypted original identity/membership/source/preview plus minimal denial/response-issue flags, never passwords, cookies or raw responses. Later lifecycle tickets must reuse this coordination instead of redirecting in-flight work to a new account. Cancellation, activity policies, replacement/disconnection, suspension/deletion and restore authority are not implemented by this ticket.

## Operator activation and key maintenance

Apply `hosted/migrations/0006-action-journal.sql` exactly once through the authorized D1 path before deploying this bundle. Existing migration-ledger limitations still apply; do not replay prior migrations. No additional Durable Object class, public maintenance route or operator impersonation capability is introduced. Schema/code activation, anonymous smoke and actual client compatibility are separate root-operator work.

After this schema is active, a connection-only export is insufficient for retiring a vault key. Privately inventory both tables through the established D1 operator path and supply the actual offline command with:

```json
{"connections":[],"actions":[]}
```

`connections` contains only `userId,revision,envelope`. `actions` contains only `userId,revision,referenceDigest,action,expires,facts`; `facts` may be null for consumed-before-send records. These examples contain no real data. Keep actual encrypted snapshots and prepared SQL private, outside the repository, and pass keys through the protected process environment as described in the [vault runbook](hosted-aimharder-connection.md#rotation-and-recovery).

`pnpm vault:prepare-rotation` accepts that object on stdin, purges records expired at preparation time and conditionally rewraps all supplied unexpired action envelopes under the new key. Its output includes `actionInventoryProvided: true` and `actionRows`. Legacy connection-array input still works and reports `actionInventoryProvided: false`; it cannot establish a complete key-retirement inventory. No keys or decrypted facts are emitted. The command performs no provider mutation.

Review/apply exact prepared SQL; independently read back conditional update counts and active key-ID inventory in **both** `portal_aimharder_connection.envelope` and non-null, unexpired `portal_action_journal.facts`. New/concurrent operations may require another fresh snapshot; completion preserves rotated ciphertext. Purge expired rows through trusted D1 maintenance and verify that they are absent before retiring the old runtime key. Retain old recovery escrow for encrypted backup copies that still require it. Verify active-key-only original-account public recovery; do not infer success from command output alone. Missing ciphertext/keys or expired facts must never become permission to repeat a write. Full backup restoration, independent deletion/revocation enforcement and at-most-30-day retention remain later acceptance.

## Synthetic validation

Twelve added journeys cross actual portal/OAuth and SDK v2 HTTP, production workerd/D1/SQLite account objects and the real shared upstream client. Only external AimHarder HTTP, fixture time and fault scheduling around real D1 writes are synthetic. They establish exact preview/strict confirmation, both roles, duplicate/foreign/wrong-gym/revision/eligibility/expiry safety, current revocation while preflight is held, independent accounts with overlapping source IDs, bounded one-write transport/denial/waitlist/incomplete branches, persistent restart at consumption/dispatch/result boundaries, original-identity recovery denial, explicit uncertainty after connection loss, retained rejection/conflict evidence after restart, TTL maintenance actual offline journal+connection rotation followed by active-key-only recovery, and post-send response-fact/terminal bookkeeping failures across confirmed/rejected/uncertain results. Encrypted inventory/output omit credential and original-target canaries. Every unexpected external request fails the harness.

The fault scheduler throws before/after real durable writes and then restarts the persisted runtime; it does not claim to kill an actual production process in a particular instruction. A zero-write test after an interruption is not evidence that an earlier real request was absent. Actual provider deployment, ChatGPT/Hermes UI confirmation behavior, real-source comparison, cost/load and later lifecycle/restore gates remain unobserved. The historical separately confirmed 9NBC cycle remains the only source observation recorded for standard booking creation; this slice adds no live upstream contract.
