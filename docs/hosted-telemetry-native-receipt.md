# Controlled native telemetry validation receipt (2026-10-29)

Status: controlled run concluded, collection/export disabled and independently read back at **2026-10-29T10:25:50.506823Z**. Native acceptance remains incomplete; #102 and #94 stay open. The actual bounded activation lasted less than 51 minutes, within the authorized two hours.

The owner separately authorized the controlled deployment, protected existing app-key provisioning and at-most-two-hour temporary activation after the concrete plan and possible existing notification effects were presented. No sustained activation or plan upgrade was authorized.

## Artifact and preserved service

Reviewed integration `803c27e9bcd8123694a7442c768f2b65691dbce7`; production bundle SHA-256 `1e2cc09f33dd0202bbc1746761fb75ef2fe13aa50bd2997a65731aa11875103d`, 4,775,346 bytes, 911 inputs with no fixture/test inputs. Native module bytes were downloaded before and after deployment and compared exactly. Original baseline bundle SHA-256 `8e4cece5be89c9b102f03265588c403b942c7d9c4a1a439d892fa3de5d2551c0`.

Original twelve bindings, including six protected secrets, database namespaces, compatibility configuration, custom domain, alternate-origin state, five-minute cron, migration tag and disabled provider logging were preserved. Five LogNorth bindings were added, including one protected app secret. No migration, participant lifecycle action, real sporting write, plan purchase or shared LogNorth setting change was performed.

## Effective destination and access

The actual installation reports LogNorth 0.29.0. Read-only effective configuration showed 90-day retention, no notification channel configured, quiet hours disabled, and one existing authorized operator. The existing Cloudflare Access allow policy preserves that operator's panel access. The existing read-only agent credential is installation-global and can discover two applications; only the AimHarder application was queried further. The existing ingestion credential was independently matched to the active AimHarder app-key record, without disclosure. Anonymous HTTPS ingestion with an empty batch returned 401, establishing public ingestion reachability independently of panel login; no event was created by that probe. Public ingress follows the existing tunnel/Tailscale path.

## Measurement limits

The provider API reports adaptive Workers CPU in microseconds; the table converts it to milliseconds. Actual query windows identify workload cells, not exact individual requests. Adaptive sampling and unrelated requests can change provider counts. Quantiles cannot be subtracted to establish instrumentation overhead. Native maximum is the maximum in the available provider data, not a guaranteed exhaustive maximum. Client wall duration is recorded separately and is not CPU.

The subscription API returned 403 and the dashboard required sign-in, so the current plan was not independently verified. No plan was changed. Historical Free status and provider usage-model labels do not establish the current subscription. Existing baseline CPU estimates already exceed a nominal 10 ms Free reference on several cells, with no observed request errors; keep this baseline concern distinct from added telemetry overhead.

The scheduled-invocation CPU dataset returned no rows despite successful actual scheduled executions in the recovery watchdog. Do not attribute HTTP aggregate CPU to maintenance. Only one baseline maintenance completion was independently observed; five baseline maintenance samples are unavailable. These gaps prevent complete native resource acceptance.

## Actual delivery and a destination incompatibility

Fresh LogNorth MCP search and event-detail reads confirmed source-controlled messages, the closed context allowlist, finite nonnegative integer durations and random per-invocation traces. Twenty account-context calls and one complete empty schedule read retained their exact existing result contracts. Each produced separate HTTP 200 and tool-success observations sharing a trace. Scheduled main and memory completion observations likewise shared their own invocation trace. No cross-request trace values or private payloads were copied into the evidence artifact. The smaller promoted `eventContext` object returned by `get_event` is not the full wire context; validation used its raw event context.

Read-back covered 20 landing successes, 20 expected unauthenticated MCP denials, 20 account-context HTTP/tool pairs, one schedule HTTP/tool pair and two incidental JWKS successes. Before activation, fresh searches returned zero events matching this release. No issues existed for this application when read; grouping and notification receipt were not exercised by these successful/expected-denial observations. Real sporting writes and unsafe main/deferred failure injection were deliberately not performed; their evidence remains the synthetic native harness.

All twenty successful OAuth protected-resource discovery requests were missing from received events. The pinned installation's [path filter](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/internal/events/ignore.go) drops any `context.path` beginning with `/.`; the [ingestion handler](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/internal/http/ingest.go) applies it before storage. This includes legitimate `/.well-known/...` discovery routes. The Worker emits the specified allowlisted route and detects a nonmatching `created` count as partial acceptance without retry. Provider logging remained disabled, so the corresponding console warning was not independently observed. No resend or shared LogNorth modification was used to hide this gap. Acceptance for received discovery observations remains incomplete and requires a separately reviewed compatibility resolution.

Reconstructed received-event sizes use the allowlisted fields and the original 24-character ISO timestamp shape; they exclude transport headers and destination-dropped events. These values are protocol reconstruction, not a captured wire-byte measurement.

## Required follow-up before acceptance

A sender-only alias or omitted `context.path` would change the accepted route contract. A reviewed LogNorth filter exception for legitimate `/.well-known/` routes is the direct compatibility correction; it is not authorized by this controlled AimHarder validation. Do not alter shared ingestion settings or rewrite route identity to make acceptance appear complete. Obtain representative maintenance CPU evidence through a supported authorized provider surface and independently verify the subscription before making a Workers Free suitability claim. Preserve the small/absent baseline maintenance sample rather than inventing a before/after comparison.

Existing scope/privacy, best-effort delivery and independent recovery-authority decisions were reviewed and remain applicable. This run supplies operational evidence, not a new scope/security/architecture decision. AimHarder API contracts and local stdio behavior are unaffected. Native acceptance is incomplete, so #102 and #94 remain open. No sustained activation is approved.

## Workload and phase receipts

| Phase | Verified UTC boundary | HTTP cells | MCP context | Maintenance |
| --- | --- | --- | --- | --- |
| Previous deployed bundle | See workload windows | 20 each: landing/challenge/discovery; all expected | 20 unchanged | One independently observed completion; five-sample baseline unavailable |
| Reviewed, disabled | 09:14:13 | Same 60; all expected; separate clean landing 20 | 20 unchanged | Five actual main completions |
| Enabled, reachable destination | 2026-10-29T09:36:08.587424Z | Same 60; all expected; discovery storage fails | 20 unchanged | Five received main/memory pairs with separate shared traces |
| Enabled, unavailable destination | 2026-10-29T10:01:02.013238Z | Same 60; all expected | 20 unchanged | Five actual main completions; deferred outcome not independently visible through the failed exporter |
| Final disabled | 2026-10-29T10:25:50.506823Z | All 11 configured-mail anonymous smoke checks pass | Fresh unchanged context and empty schedule | Existing cron/configuration preserved |

The smoke mode omitted delivery-capable enrollment/recovery probes. HTTP status/header/body-digest results matched expected contracts. No controlled HTTP response reported a CPU-limit error; all available provider adaptive rows report zero runtime errors. Password sign-in/hash CPU, every real tool journey, sustained throughput and capacity/cost were not exercised. Only account context and one complete empty schedule interval were queried through the actual MCP client; all 18 tool/classification/failure variants remain separately covered by the synthetic harness.

## Provider CPU and subrequests

The [sanitized numeric receipt](hosted-telemetry-native-metrics.json) retains each UTC window, query-read time, controlled sample count, provider row/status and CPU quantiles/maximum. No credential, account identifier, private response, request capability or actual trace value is included.

| Phase | Surface | Controlled/provider requests | CPU p50 / p95 / maximum (ms) | Provider subrequests | Errors |
| --- | --- | --- | --- | --- | --- |
| baseline | landing | 20 / 22 | 12.287 / 16.942 / 45.215 | 0 | 0 |
| baseline | auth-challenge | 20 / 23 | 8.471 / 13.938 / 15.590 | 0 | 0 |
| baseline | auth-discovery | 20 / 20 | 10.089 / 12.931 / 49.580 | 0 | 0 |
| baseline | mcp-context | 20 / 21 | 32.794 / 61.609 / 75.949 | 21 | 0 |
| reviewed-disabled | landing-clean | 20 / 20 | 14.296 / 21.154 / 26.677 | 0 | 0 |
| reviewed-disabled | auth-challenge | 20 / 21 | 11.850 / 16.009 / 17.579 | 0 | 0 |
| reviewed-disabled | auth-discovery | 20 / 21 | 14.024 / 20.122 / 78.746 | 0 | 0 |
| reviewed-disabled | mcp-context | 20 / 22 | 25.194 / 95.939 / 127.782 | 22 | 0 |
| enabled/reachable | landing | 20 / 31 | 17.525 / 28.497 / 80.431 | 31 | 0 |
| enabled/reachable | auth-challenge | 20 / 28 | 17.525 / 25.702 / 28.269 | 28 | 0 |
| enabled/reachable | auth-discovery | 20 / 20 | 15.750 / 23.120 / 79.925 | 20 | 0 |
| enabled/reachable | mcp-context | 20 / 15 | 38.819 / 116.808 / 116.808 | 30 | 0 |
| enabled/unavailable | landing | 20 / 21 | 17.172 / 26.406 / 27.940 | 21 | 0 |
| enabled/unavailable | auth-challenge | 20 / 21 | 12.714 / 21.303 / 23.340 | 21 | 0 |
| enabled/unavailable | auth-discovery | 20 / 20 | 14.500 / 21.193 / 61.317 | 20 | 0 |
| enabled/unavailable | mcp-context | 20 / 11 | 69.998 / 154.705 / 154.705 | 23 | 0 |

The initial disabled landing window overlapped anonymous smoke traffic; the table uses the later separate clean 20-request landing window. Other provider counts can differ through adaptive estimation and incidental traffic. Enabled discovery subrequests prove an attempt, not acceptance: its events are dropped by LogNorth. The unavailable MCP window has a higher CPU estimate than the off window, but its provider count is 11 versus 20 controlled calls; subtracting quantiles cannot establish causal overhead. No new limit error was observed, and these samples do not approve sustained activation.

Client wall duration (not CPU), median / maximum milliseconds:

| Phase | Landing | Challenge | Discovery | MCP context |
| --- | --- | --- | --- | --- |
| baseline | 388 / 1038 | 220 / 253 | 352 / 595 | 1002.5 / 1852 |
| reviewed-disabled | 376 / 574 | 226.5 / 393 | 353.5 / 460 | 990 / 2672 |
| enabled/reachable | 427.5 / 1255 | 279 / 359 | 416.5 / 513 | 1067.5 / 2711 |
| enabled/unavailable | 392 / 1173 | 242 / 279 | 390 / 434 | 1413 / 5589 |

## Verified disable and retained evidence

The final deployment restores the real destination with `LOGNORTH_ENABLED=false`; module digest, all original resources, seventeen binding names/types, seven secret types, domain, alternate-origin state, compatibility, migration tag, five-minute cron and disabled provider logging match their intended preserved configuration. App credentials were inherited, not printed or replaced. The temporary upload-secret file was deleted; no such file remains. The deadline watchdog was retired after independent disabled read-back.

Fresh LogNorth search/event-detail reads at **2026-10-29T10:26:50.394951Z** still returned **94** matching events, newest **2026-10-29T10:00:09.901Z**, with no event from the unavailable or final-disabled windows. The observation is confined to the returned view and does not claim exhaustive history. Subsequent smoke and authenticated reads produced no newly received validation events. Already submitted batches were allowed more than their two-second deadline; previously stored events/issues were retained. No queue drain, secret revocation, shared reset or physical erasure is claimed.

Received source fields reconstructed to 319–350 bytes/event and 340–673 bytes/batch for observed traces. Fresh detail reads matched raw context; no excluded field or unexpected issue flag was observed. Installation-owned database metadata such as its own event/app-key row IDs is not a participant identifier emitted by this integration and was not copied into the numeric receipt.

## Reviewable, uninstalled destination correction

The [local compatibility patch](lognorth-well-known-compatibility.patch), SHA-256 `d4629854a097f61009bbd290b6dbf52fdb3086dde869fb6a3995b815d98b5ede`, targets pinned LogNorth `abaa5c6952c1f3ca2a5a8789a07253de6367e314` / 0.29.0. It permits the exact, case-sensitive `/.well-known/` namespace defined by [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615.html), while preserving other dotfile filtering, including similar/uppercase prefixes. This is a namespace compatibility rule, not a claim that every path beneath it is legitimate or safe. It does not alter authentication, readers, retention or notification configuration.

A regression test first failed on all three discovery paths against the original function. After the four-line exception, locked frontend installation/build and full `make test` passed on Go 1.27.3/darwin-arm64. The initial full test attempt required the missing embedded frontend assets; no tests were skipped. Both spec and standards reviews found no issue. The official Dockerfile then built the ARM64 candidate with Go 1.26.10/Alpine 3.24. A networkless, read-only temporary container with only ephemeral storage passed `/_health`; it mounted no live data, published no ports, and was removed.

Local candidate `lognorth:0.29.0-well-known-candidate`: `sha256:6777f666413a3c4062f1eba4642770bbce79be15c887eb5ac71acb567c6ba5fb`. The shared service still runs original `sha256:82ecefc399413ad0d728eeda07d8e605b56d79cbdc7cdd85a5c75a9cc5e29bba`. No candidate image was pushed and no shared container, setting or database was replaced.

Deploying this candidate is a subsequent action outside the authorized isolated-Worker validation. A concrete proposed operation is: take the established SQLite backup, preserve the existing Compose bindings/environment/storage, replace only the image with this pinned candidate, verify health and unchanged access/ingestion authentication, and retain the original pinned image for rollback. It would briefly restart the shared LogNorth service. A separately authorized follow-up of at most ten minutes could enable the reviewed AimHarder Worker, issue twenty normal discovery reads, verify their fresh stored observations, then disable and independently read back again. No plan change or sustained activation is implied; missing maintenance CPU/current-plan evidence would still remain.
