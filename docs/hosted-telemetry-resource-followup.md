# Resource-evidence follow-up (2026-10-29)

Status: read-only follow-up after the owner requested continuing the pending checks. Native acceptance under #102/#94 remains incomplete. No deployment, telemetry activation, platform logging change, tail observer, plan change or sporting write occurred. The [temporary LogNorth compatibility deployment](hosted-telemetry-compatibility-validation.md) remains the latest delivery evidence.

## Fresh provider reads

The [sanitized numeric receipt](hosted-telemetry-resource-followup.json) records exact query windows, read times, returned counts and configuration comparisons. The reviewed Worker module still matches SHA-256 `1e2cc09f33dd0202bbc1746761fb75ef2fe13aa50bd2997a65731aa11875103d`; collection/export is disabled, and the original protected configuration, seventeen bindings and seven secret bindings are unchanged.

At 17:05 UTC, `workersInvocationsScheduled` again returned HTTP 200 without GraphQL errors and **zero rows** for both the original 09:00–10:25:50 UTC validation window and the recent 16:00–17:05 UTC window. A bounded all-account query over 09:00–17:05 UTC, with the script predicate removed, also returned zero rows. This rules out an overly restrictive script-name predicate for these returned views; it does not establish the cause of missing provider data. No other script identities were persisted.

Fresh dataset settings report the scheduled node enabled with `cpuTimeUs`, a seven-day maximum query duration and ninety-day lookback. Separately, the fixed recovery-watchdog row reports a successful main-maintenance attempt at 17:05:04.715 UTC, completed at 17:05:05.312 UTC, with zero purged records. This independently establishes current main-maintenance completion, not its CPU, deferred-phase settlement or five comparable baseline samples. The historical baseline gap is unchanged.

The subscription API still returns **403**. The browser dashboard requires sign-in; a login tab was left for the owner. The supported Workers account-settings endpoint returns `default_usage_model: standard`. That is a default execution/billing model field, **not independent subscription evidence**; it cannot establish Free or Paid status. No permission or subscription was changed. See the [account-settings API contract](https://developers.cloudflare.com/api/resources/workers/subresources/account_settings/methods/get/).

## CPU recovered for the patched discovery workload

A fresh adaptive query at 17:07:27 UTC covers the already completed twenty-request discovery workload, 16:42:55.948–16:43:09.630 UTC. No workload was resent.

| Controlled requests | Provider estimate | CPU p50 | CPU p95 | CPU p99 | Available maximum | Provider subrequests | Runtime errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | 19 | 21.597 ms | 168.017 ms | 168.017 ms | 168.017 ms | 21 | 0 |

The provider CPU sum is 646,422 microseconds; its available maximum wall time is 2,880,366 microseconds. Wall time is separate from CPU. All returned rows have runtime status `success`. Association uses the Worker name and exact UTC workload window, not invocation traces. Adaptive estimates and incidental traffic can change counts; neither the maximum nor the quantiles establish exhaustive per-request measurements. These are useful observations for the patched destination, not a controlled causal-overhead result or proof of Free suitability. The [original baseline/comparison evidence](hosted-telemetry-native-receipt.md#provider-cpu-and-subrequests) remains distinct.

Cloudflare [documents reservoir sampling for CPU metrics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/). The account's actual schema also exposes overview CPU totals, but the inspected overview and owner/script dimensions contain time/usage-model grouping and no scheduled-event discriminator. Substituting those totals for scheduled CPU would mix workloads.

## Remaining boundary and next observation

The next useful step is an authenticated dashboard review of the current Workers subscription and the existing Cron Past Events view. If it exposes CPU for the original runs, retain those original window associations and sample counts. If it is empty too, scheduled CPU remains unavailable through the observed provider surfaces; repeating deployments or waiting alone is not an established remedy.

Cloudflare [real-time logs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/) provide a transient stream without persistent Workers Logs, but their documented event shape does not promise CPU measurements. No such session was opened, and no Tail Worker or persistent invocation logger was installed as an assumed substitute. Any later observer must first demonstrate supported CPU fields and a concrete privacy-preserving, bounded collection plan. Preserve the five-minute cron, disabled persistent platform logging, normal service resources and final disabled exporter. Do not change usage model or buy a plan to investigate missing metrics.

The scope/privacy and best-effort delivery ADRs were reviewed and remain unchanged. This follow-up supplies evidence, not a new architecture, security, distribution or activation decision. Local stdio behavior, domain terminology and observed AimHarder API contracts are unaffected. #102/#94 remain open; current-plan, representative scheduled CPU and the five-sample baseline maintenance comparison are still unverified.

## Owner-reported upgrade to Paid (2026-10-29)

The owner subsequently reported that they had upgraded Cloudflare to Paid. The [delivery ADR amendment](adr/2026-10-28-best-effort-hosted-telemetry-delivery.md#owner-selected-paid-capacity-reference-2026-10-29) records that capacity reference; the [sanitized fresh reads](hosted-telemetry-paid-plan-followup.json) distinguish owner testimony from independent provider evidence. No subscription/effective-upgrade timestamp was independently confirmed, and the original measurements keep their original uncertainty. The agent performed no plan change.

Fresh native reads at 20:45 UTC confirm the exact reviewed module digest, seventeen unchanged bindings including seven secret bindings, unchanged protected resources and compatibility settings and the same five-minute cron. The cron's provider `modified_on` metadata changed to 20:28:39.346029 UTC; this timestamp is not proof of the upgrade time. The initial exact snapshot comparison correctly stopped on that metadata difference, before any mutation. A subsequent field-level comparison established that only schedule metadata differs and effective protected configuration remains unchanged. Collection/export is still disabled and no deployment or observer was run.

The original 09:00–10:25:50 UTC scheduled-CPU window, the 16:00–20:45 UTC recent window and the bounded 09:00–20:45 UTC query without a script predicate each still return HTTP 200, no GraphQL errors and zero rows. Dataset settings still report scheduled CPU enabled. Independently, the recovery watchdog reports successful main maintenance at 20:45:06.987 UTC with zero purged records. This is not deferred-phase or CPU evidence.

The subscription API still returns 403, and the available browser still requires sign-in. An authenticated dashboard review remains the next useful observation. The upgrade report does not resolve the missing scheduled CPU, the five-sample baseline comparison or sustained acceptance. Current plan is now owner-reported Paid, rather than independently confirmed Free or Paid; no automatic increase in Worker limits, further spending or sustained telemetry activation is implied.
