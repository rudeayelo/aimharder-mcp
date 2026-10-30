# Hosted deletion of own activity

Current confirmation policy (2026-10-30): the [account preference](write-confirmations.md) controls whether separate confirmation is required for every sporting write, including late cancellation and deletion. It defaults to enabled. The flow below uses that default unless recording historical evidence; mandatory-confirmation wording is conditional on the preference. Exact preparation, fresh checks, role policy, single-use execution and no uncertain replay still apply.

[Ticket #80](https://github.com/rudeayelo/aimharder-mcp/issues/80) exposes the existing `prepare_activity_deletion` and `execute_activity_deletion` tools through authenticated HTTP MCP. The [role-access decision](adr/2026-10-19-hosted-activity-role-access.md) and [action coordinator](adr/2026-10-19-confirmed-hosted-action-coordination.md) apply. The implementation evidence below is local and synthetic. The later [actual remote Pilot observation](#actual-remote-pilot-deletion-2026-10-28) is separate; neither establishes an activity-action UI journey in web ChatGPT or Hermes.

## Role administration and confirmation

An active verified administrator opens **Activity access by role** at `/admin/activity-access`. Publication and deletion each have their own control for `admin` and `user`. Both activity capabilities initially allow administrators and deny users. Saving one capability leaves the other unchanged. Only these two role settings exist; bookings and queries have no switches, and individual participants have no overrides. The page exposes no credentials, private activity, impersonation or diagnostic messages.

A cached tool definition is not permission. Preparation checks current active membership and the current deletion role policy, then checks the policy again after source reads before returning any ready reference. Execution checks policy again, consumes the original reference, revalidates the exact own entry, and checks admission, role policy, client grant/generation and connection revision in one final authoritative D1 query immediately before the private fetch. A denial before that dispatch point sends no DELETE. A setting change after dispatch cannot undo an already admitted request; the owned client still reads back its original account and never retries the DELETE.

The holder must review the complete exact preview and separately confirm that specific deletion. `confirmed: true` is a strict protocol input, not independent evidence of human consent. An administrator role, test cleanup, earlier publication or broad specification approval never authorizes an actual deletion.

## Existing own entries and outcomes

Preparation accepts an exact gym-local date and optional `sourceActivityId` from own activity. The ID must occur in the authenticated account calendar. Detail must verify the original account, selected gym and exact date. Multiple candidates require an explicit selection. Missing, incomplete, foreign-owner, foreign-gym and unsupported candidates receive no reference. An entry can predate this service or be created in the AimHarder UI; deletion does not require a publication reference or use of this service's publication tools. Entries containing RM marks remain eligible with the existing warning.

The ready preview contains the exact source ID/date, projected block results, exercises and available titles, coverage, possible irreversible loss, no automatic backup/undo and unknown RM-history effects. Before execution the real API client rechecks identity, gym, membership, confirmed zone and unchanged content. A changed target returns `stale` and `responseStatus: not-sent`.

One confirmed execution attempts at most one DELETE at the fixed verified gym endpoint, followed by fresh own-calendar/detail reads. The existing response distinctions remain:

| Observation | Reported meaning |
| --- | --- |
| Readable response and fresh absence | `observed-absent`, `responseStatus: http-ok`, `observedState: absent` |
| Uncertain response and fresh absence | `uncertain`, `responseStatus: uncertain`, `observedState: absent` |
| Same own entry still visible | `still-visible` |
| Conflicting owner, gym or date | `conflicting-identity` |
| Unreadable or incomplete follow-up | `incomplete` |

A readable response has no established upstream success contract. Current absence proves neither permanence nor any effect on RM records/progression. No uncertain write is automatically retried; another deletion needs a fresh preview and separate confirmation.

## Concurrency, restart and recovery

The implemented [residency amendment](adr/2026-10-21-bounded-preparation-residency.md) coalesces actor holds for unused deletion preparations through their original two-minute expiry and releases them on consumption/discard. It preserves current policy, exact separate confirmation and restart rejection. The isolated [native comparison](validation.md#bounded-preparation-residency-native-comparison-2026-10-21) passes; the code-only test-pilot activation and native context are verified, while browser ChatGPT action validation remains pending; no DELETE is authorized by this lifecycle change.

The subject-owned account queue contains the complete preparation/execution/reconciliation journey. Its bounded in-memory reference binds the portal owner, original upstream identity, connection revision, action and gym. The shared durable journal records consumption before preflight and a possibly-sent fence before dispatch. Expired, foreign, mismatched, used or lost references cannot dispatch. Concurrent duplicate execution sends at most one DELETE; separate accounts remain independent.

Encrypted recovery facts contain only original identity/box, gym, source entry ID/date and the interpreted response-status flag. They exclude entry contents, training history, raw HTTP, cookies and credentials. The original complete preview remains in memory only. A restarted actor can use protected minimal facts for fresh original-account read-back; its recovery result therefore identifies the exact ID/date and gym without reconstructing the discarded entry contents. Supplied source ID and gym selectors must match the original protected facts. Recovery cannot issue a DELETE or recreate execution permission. An unavailable original connection yields explicit uncertainty rather than reading a replacement or restoring credentials.

Recovery facts share the coordinator's ten-minute expiry, cleanup and operator rotation inventory. Post-send response-flag or final-phase persistence faults cannot skip fresh own-account read-back or remove the durable no-replay fence. If response interpretation could not be retained, later recovery may be less conclusive; it never invents response success. See the [creation runbook](hosted-booking-creation.md) for journal inventory, conditional rewrap and key-retirement requirements.

## Activation and validation boundaries

Apply `0006-action-journal.sql` and `0007-activity-role-policy.sql` before activating a bundle using these tools. The existing isolated environment has no Wrangler migration ledger for initial schemas; never replay its initial migrations. This ticket does not apply schema or deploy code remotely. No plan change, purchase or actual sporting action occurred.

The public SDK v2 HTTP/workerd/D1/SQLite account-object tests use the production portal/authentication/account/client handlers and synthetic external AimHarder HTTP. Fifteen journeys cover default and changed role settings, independent controls, existing own-entry previews and explicit confirmation, exact ownership/gym/content checks, mismatched and foreign references, stale preparation, duplicate concurrency, two-account progress, expiry before/during preflight, final-query policy changes, persistent restart and read-only recovery (including large entry contents excluded from recovery facts), uncertain/still-visible/incomplete/conflicting outcomes, and both post-send journal faults. They do not establish live provider response semantics, permanence, RM effects or human confirmation in an actual client. Final project check results are recorded in [validation](validation.md).

## Actual remote Pilot deletion (2026-10-28)

After the [actual publication](hosted-activity-publication.md#actual-remote-pilot-publication-2026-10-28), the owner separately confirmed deletion of **only the newly accepted test entry**, explicitly preserving the original. The complete preview disclosed possible irreversible loss, no automatic backup/undo and unknown RM-history/progression effects. An expired reference was never executed; a fresh preparation matched the approved full preview except reference and expiry and still identified only the new entry, never the original.

Exactly **one deletion execution** through the remote Pilot connector in Codex returned `status: uncertain`, `responseStatus: uncertain`, `observedState: absent`. It was **not retried**. An independent fresh own-calendar query had complete coverage for the requested date, returned one entry, found the new entry absent and compared the entire surviving original as identical to the pre-publication original. This is current observed absence with an uncertain response, **not a confirmed deletion response**, permanent erasure or proof of RM-history/progression rollback. No broader upstream success contract is inferred.

The remote connector was used rather than local/npx; this does not establish a web ChatGPT or Hermes activity-action UI journey. Private dates, results, IDs and action references are excluded. The [scoped acceptance decision](adr/2026-10-28-scoped-hosted-pilot-acceptance.md) accepts this bounded reconciliation evidence without upgrading its uncertainty.
