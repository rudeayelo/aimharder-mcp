# Booking and workout confirmation switches: hosted deployment

The owner authorized integration and deployment on 2026-10-30. [PR #121](https://github.com/rudeayelo/aimharder-mcp/pull/121) passed protected-branch CI and merged to `main` as `6c85cdbf499d9775475112e356dfa6b428186743`. The [account preferences](write-confirmations.md) are now active on the existing isolated invited pilot. This is not a production-origin launch or npm release.

## Verified deployment

The production entry was built from that clean integrated commit using the maintained hosted build and locked dependencies. Its build input graph contained no test/fixture/MSW/Vitest/Miniflare inputs. A pinned Wrangler dry run passed, followed by one code-only upload with exit code 0. No database migration, secret rotation, purchase, route cutover or sporting write was performed.

Independent provider reconciliation completed at **15:15:55 UTC (16:15 Madrid)**:

- Worker: `aimharder-mcp-pilot-test`; the new deployment serves 100 percent of traffic.
- Actual downloaded main module matches SHA-256 `5e7bd5edb72cf9b7f80fd6b897a4ebc835e6e338625f45bea32a37ecc2d7a0dc` exactly (4,784,079 bytes).
- All seventeen bindings and seven secret binding names/types are preserved. Secret values were neither printed nor read back.
- Both database bindings, the SQLite account namespace/migration, compatibility settings, domains, disabled alternate origins, existing five-minute cron, limits/placement and disabled persistent platform logging match the fresh predeployment state.
- Sustained telemetry remains enabled with environment `pilot-test` and its existing destination/key. Only `LOGNORTH_RELEASE` changed, to the integrated source SHA above. No temporary observer or tail was attached.

Existing accounts default both preferences to enabled; no participant's stored preferences were changed for this verification.

## Fresh checks and limits

All eleven configured-mail anonymous HTTPS smoke checks passed before and after deployment: public pages, protected administrator and MCP denial, missing fixture/bootstrap routes, resource metadata and foreign-origin form rejection. This smoke stage sends no mail or enrollment request.

A fresh authenticated remote Pilot `get_account_context` succeeded before rollout. A fresh postdeployment call succeeded and reported `writeConfirmationPolicy: { bookingCreation: true, activityPublication: true }`. After excluding this newly added policy field, its complete context compared equal in memory to the predeployment response. No account response or personal sporting data is included here. This verifies access continuity and the deployed policy projection, not every stored row or client behavior.

The implementation's 493 local tests and 106 targeted hosted HTTP/workerd/D1 tests passed before integration; protected-branch CI additionally passed the complete maintained verification workflow. The two switches were visually checked in a synthetic desktop render and all four checked/unchecked form combinations have HTTP fixture coverage. This deployment did not change preferences, create a reservation, publish/delete an activity or send a cancellation. Actual ChatGPT/Hermes prompting and participant UI-save acceptance remain separate from native context and synthetic form evidence.

The [accepted ADR](adr/2026-10-30-account-write-confirmation-preference.md) governs both switches; cancellation/deletion confirmations remain mandatory. Runtime/authentication/credential-custody/role decisions are unchanged. A later documentation-only merge does not require another runtime upload or relabel the active source. The patch Changeset remains available for the normal npm release process; npm publication was not part of this deployment request.
