# Workout interpretation deployment and 0.5.4 release

The owner requested integration, deployment and a new package version on 2 November 2026. [Correction PR #125](https://github.com/rudeayelo/aimharder-mcp/pull/125) passed protected-branch CI and merged as `65fc4ce0f7309de04b884677551c176383564fda`. The [five-weekday audit](research/2026-11-02-five-weekday-workout-audit.md) records the independent source/UI evidence and its limits.

## Hosted deployment

The clean integrated source was built with locked dependencies and the maintained production entry. Its input graph contained no test, fixture, MSW, Vitest or Miniflare inputs. The pinned Wrangler 4.151.1 dry run passed, followed by one code-only upload with exit code 0. Independent provider read-back completed at **14:49:32 UTC (15:49 Madrid)**:

- The existing `aimharder-mcp-pilot-test` Worker serves the new deployment at 100 percent.
- Its independently downloaded single main module matches SHA-256 `6867f75235842e460eddfc3f0c1f5dffa2dac85cacc205e147bcc0a1a2c5af8a`, **4,786,639 bytes**.
- All seventeen bindings and seven secret binding names/types match the fresh baseline. No secret values were read back or replaced.
- Database and SQLite namespace bindings, the existing migration tag, compatibility settings, domain/subdomain configuration, cron, placement/limits, disabled platform logging and absent tail consumers are preserved.
- Existing sustained telemetry remains enabled with its original environment and destination. Only `LOGNORTH_RELEASE` changed to the integrated source SHA.

This updates the existing invited pilot. It introduces no database migration, route cutover, capacity purchase, credential rotation or production-origin launch.

## Fresh hosted verification

All eleven configured-mail anonymous HTTP smoke checks passed both before and after deployment. They check public pages, protected administrator/MCP denial, absent fixture/bootstrap routes, resource metadata and foreign-origin form rejection; they send no mail or enrollment request.

Fresh postdeployment Pilot queries verified the corrected source field and expanded guidance:

| Query | Observed EMOM layout |
| --- | --- |
| 2 November, StrongWOD | Two EMOM blocks retain `prescription.reps=1` for cycling intervals. |
| 27 October, Entrenamiento Funcional | The EMOM retains `prescription.reps=0` for consecutive groups. |

A fresh authenticated account-context result compared equal in memory to its predeployment result, including gym selection, confirmed zone and confirmation policy. No account response, private source identifier, personal result or calculated load is retained here. This establishes observed access continuity, not an exhaustive database comparison or every client journey.

A read-only application-telemetry check found 24 events labeled with the new source revision, including a successful account-context event. Their context keys matched the maintained privacy allowlist. This verifies observed delivery after rollout without attaching a temporary observer or tail.

## Package release

[Version PR #122](https://github.com/rudeayelo/aimharder-mcp/pull/122) passed protected-branch CI and merged as `0b3ea7dbe5b774af5a5070cd171ecd134390953f`. [Release workflow 41465914603](https://github.com/rudeayelo/aimharder-mcp/actions/runs/41465914603) completed successfully and created [v0.5.4](https://github.com/rudeayelo/aimharder-mcp/releases/tag/v0.5.4) at **14:52:52 UTC**. The version includes the previously integrated account confirmation switches and the workout correction. Consumer commands are pinned to `aimharder-mcp@0.5.4`.

Initial canonical metadata returned the previous latest version and HTTP 404 for `0.5.4`, separately from the successful publish workflow. At **14:57:38 UTC**, canonical version metadata and the ordinary tarball URL both returned HTTP 200. No publication retry was sent.

The public archive has **32 files, 81,222 bytes**, SHA-1 `8165811a2930206cb69648eed20062d11c44bb26` and SHA-512 integrity:

```text
sha512-R8qt/35DgF9nlCZjQqvnhqNAdm3mByWtT5jFKfavCV/deoHEcpL93qU8SoRhNwQqYcIZpUIba3qKY7a73UelzA==
```

Its bytes match the workflow's packed artifact exactly. Every code/documentation file matches the reviewed release source/build. The published manifest differs only by removal of `packageManager` and `scripts.prepack`.

On Node **v24.22.2**, the maintained `scripts/registry-check.mjs 0.5.4` passed from a clean temporary npm installation: initialization/version identity, all 18 tools, authenticated account/gym access, explicit/inaccessible gym selection, sanitized errors and empty server stderr. npm received no AimHarder credentials; only the MCP harness did.

A second clean installation of the independently downloaded, integrity-verified registry archive passed SDK schema checks and fresh read-only queries for the two EMOM cases above. It retained both cycling blocks with mode `1` and the consecutive-groups block with mode `0`, exposed the expanded interpretation guidance and produced empty stderr. Both artifact checks completed before **14:59:38 UTC**. Temporary installations were removed. This is exact public-artifact acceptance for the observed read paths, not sporting-write validation.

## Acceptance boundaries

The correction passed 495 local tests, typecheck, build, an 18-tool SDK schema harness and the maintained protected-branch CI before integration. Its original live audit covers 26 publications in one bounded feed view, nine observed block type codes and 22 labeled variants. These observations do not establish exhaustive feeds, other gyms/locales, every block format, actual conversational-model behavior or new sporting-write acceptance.

The existing [workout decision](adr/2026-09-22-published-workout-applicability.md), [confirmation preference decision](adr/2026-10-30-account-write-confirmation-preference.md) and [release procedure](releasing.md) remain applicable. No scope, authentication, custody, role or distribution decision changed. No booking, cancellation, activity publication or deletion was executed during this delivery.
