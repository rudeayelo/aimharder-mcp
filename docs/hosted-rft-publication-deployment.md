# RFT publication deployment and 0.5.5 release

The owner authorized integration, deployment and a new package version on 10 November 2026. [Correction PR #128](https://github.com/rudeayelo/aimharder-mcp/pull/128) passed the complete protected-branch CI and merged as `47446f44701a77cabd654f0524cdf6718ef48406`. The [investigation](research/2026-11-10-rft-publication-contract.md) separates the existing rejection from independently observed official-editor semantics.

## Hosted deployment

The integrated production entry built with locked dependencies and 911 inputs, with no test, fixture, MSW, Vitest or Miniflare inputs. Pinned Wrangler 4.151.1 passed its dry run and one code-only upload. Independent provider read-back completed at **10:47:17 UTC (11:47 Madrid)**:

- The existing invited-pilot Worker serves the new version at 100 percent.
- Its downloaded single main module matches the reviewed build exactly: **4,787,531 bytes**, SHA-256 `236e70c4d33a747b2b7fc21f0c0c1fcbf57d319ae37991a9987264e1d6ab5c30`.
- All seventeen bindings and seven secret binding names/types are preserved. Only the existing `LOGNORTH_RELEASE` text value changed to the integrated source SHA; no secret value was replaced.
- Database and SQLite namespace identities, migration tag, compatibility settings, runtime handlers, domains, disabled alternate origins/previews, cron, placement, platform logging and tail-consumer configuration match the fresh baseline. Domain-list ordering changed; sorting by hostname established equality of every domain record.
- Existing sustained application telemetry configuration is preserved. No database migration, new resource, credential rotation or origin cutover was performed.

## Fresh hosted verification

All eleven configured-mail anonymous HTTP checks passed before and after upload. Fresh authenticated native Pilot account context compared equal in memory to the predeployment result, including gym selection, zone and confirmation policy.

A fresh bounded gym-source read found one matching current-day WOD and the expected difficulty labels. Two native read-only preparations then exercised the new code with the same selected source/variant and explicitly supplied actual loads:

| Inputs | Observed preparation |
| --- | --- |
| Completed rounds and six actual loads, without elapsed time | `draft`, missing `time-seconds` at RFT block index 3, no action reference. |
| The same inputs with explicitly supplied elapsed seconds | `ready`, two block results and six actual loads, with publication confirmation still required. |

No source identifier, personal result, load, account response or action reference is retained here. No execution was invoked. This establishes deployed source access and preparation behavior; corrected real RFT acceptance, persisted scores and effective audience remain unverified.

## Package release

[Version PR #129](https://github.com/rudeayelo/aimharder-mcp/pull/129) passed protected-branch CI and merged as `996c553e0ad87f5d2f3bcebd843c72d636316e99`. [Release workflow 42802055817](https://github.com/rudeayelo/aimharder-mcp/actions/runs/42802055817) completed its pre-publication checks, package upload through npm OIDC and [GitHub release v0.5.5](https://github.com/rudeayelo/aimharder-mcp/releases/tag/v0.5.5), published at **10:48:20 UTC**. Consumer examples are pinned to `aimharder-mcp@0.5.5`.

Initial canonical version metadata and tarball requests returned HTTP 404 after the successful workflow. Version metadata subsequently became available while the ordinary tarball URL still returned a negatively cached 404 (`max-age=300`). A read-only cache-busting request downloaded the public archive without republishing. At **10:54:12 UTC (11:54 Madrid)** the ordinary canonical tarball URL also returned HTTP 200 with the same verified bytes.

The public archive has **32 files, 81,716 bytes**, SHA-1 `f15407125117450035ab1eaa584ea2ab21a75996` and SHA-512 integrity:

```text
sha512-Rd3htoGBgoFRRioG8FgkWA/6ToUlOowjlKJU2G758Lyo8J5xriCbHLhyklWhtaOYb+8ytZzfBFgpy/LCACQ/7w==
```

Its bytes match the release workflow's pack artifact exactly. Every code/documentation member matches the reviewed release source/build. The published manifest differs only by removal of `packageManager` and `scripts.prepack`.

On Node **v24.14.0**, a clean installation of that integrity-verified public archive passed the maintained MCP package harness: version identity, all 18 tools, authenticated own-account/gym context, explicit/inaccessible gym selection, sanitized errors and empty server stderr. npm received no AimHarder credentials; only the MCP harness did. A separate SDK harness against the same installation freshly reverified the gym source, observed a missing-time `draft` without an action reference, and obtained `ready` after explicit elapsed time alongside the same six actual loads. It invoked no activity execution or deletion. Private sporting values and raw tool responses were not retained in this receipt. After canonical propagation, the maintained `scripts/registry-check.mjs 0.5.5` also passed its complete fresh-registry-install authenticated check. The registry reports `latest=0.5.5`. Temporary installations were removed after verification.

## Acceptance boundaries

The correction passed 511 root tests, 76 focused publication tests, 25 targeted hosted tests, both typechecks/builds and the complete protected-branch CI. The version PR independently passed the full CI gate, and the release workflow checked and packed the exact release source before publishing. The existing activity, confirmation and distribution decisions remain unchanged. No booking, cancellation, activity publication or deletion was sent during this delivery.
