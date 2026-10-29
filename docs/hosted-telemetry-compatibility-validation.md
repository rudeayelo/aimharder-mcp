# Native discovery telemetry after the temporary LogNorth patch

Status: the owner explicitly requested applying the prepared patch while the next official LogNorth release is unavailable. The temporary image is active; the controlled AimHarder validation concluded with collection/export **disabled** at **2026-10-29T16:44:40.286757Z**. The discovery-storage gap from the [earlier native run](hosted-telemetry-native-receipt.md) is resolved for the observed endpoint. #102/#94 remain open for the resource-evidence gaps below.

## Deployed image and preservation

The locally built ARM64 `lognorth:0.29.0-well-known-candidate` image is pinned to `sha256:6777f666413a3c4062f1eba4642770bbce79be15c887eb5ac71acb567c6ba5fb`. It contains the [reviewed patch](lognorth-well-known-compatibility.patch) against LogNorth 0.29.0, equivalent to the fix merged in [upstream PR #94](https://github.com/karloscodes/lognorth/pull/94). The latest official release checked during this operation remained 0.29.0. This is a temporary local build, not an official new release or a registry push.

The original image `sha256:82ecefc399413ad0d728eeda07d8e605b56d79cbdc7cdd85a5c75a9cc5e29bba` remains locally available for rollback. A pre-deployment SQLite backup was created inside the existing VM, passed `quick_check` both there and as an immutable completed snapshot on the host, and was retained privately with mode 0600. No previous backup was deleted. Existing schema/migrations are unchanged by the patch.

Only the Compose image and `pull_policy: never` changed. Full resolved configuration was compared in memory before applying it; fresh container inspection verified unchanged environment, mounts, ports, restart/memory/logging/security settings, entrypoint and health configuration. The effective retention/notification/quiet-hours policy matched before/after. No secret value was copied into the published receipt. Health was confirmed at **2026-10-29T16:40:07.216549+00:00**. No shared policy, reader grant or AimHarder sporting action was changed.

## Actual endpoint verification

| Observation | Result |
| --- | --- |
| LogNorth local health | HTTP 200 |
| Public HTTPS batch ingestion without a key | HTTP 401 |
| Public panel | HTTP 302 to Cloudflare Access |
| Previously stored validation observations | 94 still returned |
| New follow-up environment before activation | Zero matching observations |
| Actual Worker discovery requests | 20/20 HTTP 200; public body digests and allowed headers match the earlier baseline |
| Actual LogNorth MCP read-back | All 20 discovery observations returned with the exact `/.well-known/oauth-protected-resource/mcp` route, `http_status: 200` and `outcome: success` |
| Existing authenticated account-context read | Unchanged while enabled and after disabling |
| Final configured-mail anonymous smoke | 11/11 pass; delivery-capable enrollment/recovery probes omitted |

The Worker used the same immutable reviewed production module, SHA-256 `1e2cc09f33dd0202bbc1746761fb75ef2fe13aa50bd2997a65731aa11875103d`, with a separate nonpersonal `pilot-compat-validation` label. Its normal resources, disabled provider logging, cron, namespaces, seventeen bindings and seven protected secrets were preserved. The fresh one-shot watchdog was armed before activation, with a ten-minute bound and nine-minute disable deadline. Collection/export was disabled after less than three minutes; independent native read-back confirmed `LOGNORTH_ENABLED=false`, and the watchdog exited.

Fresh destination reads at **2026-10-29T16:45:30.734112Z** returned **23** new-environment observations: twenty discovery completions, one correlated HTTP/tool account-context pair and one incidental JWKS completion. All inspected observations retained static messages, the context allowlist, nonnegative integer durations and invocation-local UUID traces; no excluded field or unexpected issue flag was observed. Event-detail read-back matched raw context. Actual trace values, private responses and participant identifiers were not copied into the evidence artifact.

After the final disabled smoke/context calls and more than the two-second pending-batch allowance, the returned new-environment count remained 23, with newest event **2026-10-29T16:43:09.481Z**. The old environment still returned 94 observations. This is evidence from the returned views, not an exhaustive-history guarantee. The workload was not resent to force indexing. No temporary secret-upload file remains.

The [sanitized evidence](hosted-telemetry-compatibility-evidence.json) records deployment, access checks, controlled workload, received groups, MCP comparison, final disabled configuration and cleanup without credentials, app/account IDs or actual trace values.

## Remaining limits and later official upgrade

This follow-up establishes deployed discovery-event delivery after the namespace fix. It does not supply the missing scheduled CPU distributions, five-sample baseline maintenance comparison, independently verified current Workers plan, sustained capacity/cost, native injected failures or notification receipt. Earlier synthetic/actual boundaries remain unchanged. No sustained activation or plan purchase was authorized; #102 and parent #94 remain open.

When an official release includes the merged fix, replace the temporary local image through the normal backed-up upgrade procedure, review removal of the temporary `pull_policy: never`, and repeat health/access/delivery verification. No automatic update or further activation is scheduled. Operator-local rollback restores the preserved Compose configuration and original pinned image; it does not restore or delete database contents. The scope/privacy, best-effort delivery and recovery-authority decisions remain applicable. Local stdio and AimHarder API contracts are unaffected.

The later [read-only resource follow-up](hosted-telemetry-resource-followup.md) rechecks scheduled analytics and subscription access, records adaptive CPU for the patched discovery workload, and preserves the remaining acceptance gaps.
