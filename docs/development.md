# Develop and verify the server

This page is for contributors working from the source repository. End users should start with the [README](../README.md) and [configuration guide](configuration.md). The package published to npm contains compiled JavaScript and consumer documentation, not this development guide, source files, tests or harness scripts.

## Checkout and local checks

Use Node 24, as recorded in [`.node-version`](../.node-version), and pnpm 12.5.1:

```sh
git clone https://github.com/rudeayelo/aimharder-mcp.git
cd aimharder-mcp
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` runs anonymized HTTP-fixture tests through the public MCP interface and includes the isolated packaged-install check. Tests reject unexpected network requests. Run `pnpm build` after source edits. No database or remote service deployment is required.

## Run and inspect locally

Configure credentials and, if needed, an override for the assumed gym zone through the process environment or a private file, as described in [configuration](configuration.md). To run the compiled stdio server from a shell with variables already injected, use `pnpm start`. The process waits for MCP messages on stdin. If using a private file, start Node explicitly: `node --env-file=/absolute/path/to/private.env dist/index.js`.

The repository includes consuming-client examples built with the official MCP SDK. After building, run them with a securely injected environment or `node --env-file=/absolute/path/to/private.env`:

| Example | Command arguments | Purpose |
| --- | --- | --- |
| `scripts/query-training.mjs` | `tomorrow WOD` or `YYYY-MM-DD ClassName [gymId]` | Combine class sessions, published workouts and upcoming bookings. |
| `scripts/query-recent-activity.mjs` | `YYYY-MM-DD [maxWindows] [gymId]` | Search backwards for five distinct activity entries. |
| `scripts/query-activity-period.mjs` | `previous-month [gymId]` or `YYYY-MM-DD YYYY-MM-DD [gymId]` | Count activity entries and days with activity over a period. |

Their output contains private account data. Do not paste it into issues or publish it as test evidence. These are client examples, not additional server tools. The [tool guide](tools.md#questions-that-combine-tools) explains the answer semantics.

## Isolated package check

Run `pnpm test:package`. It builds an archive, checks the explicit file allowlist, installs it outside the checkout with production dependencies and lifecycle scripts disabled, then launches the installed executable through the MCP SDK with anonymized fixtures. This is a local archive check, not a public-registry check. `pnpm test:package:live` additionally performs an opt-in read-only account/gym query when `AIMHARDER_LIVE_CHECK=1` and credentials are injected securely.

For other explicit live comparisons, build first and run `AIMHARDER_LIVE_CHECK=1 node scripts/live-check.mjs` with securely injected credentials. Optional environment flags in `scripts/live-check.mjs` select class, workout, booking, activity and composed checks. Live checks use the actual account and must remain read-only. Record sanitized results and limitations in [validation](validation.md); fixture passes alone do not establish a broader upstream contract.

The [release procedure](releasing.md) describes the separately gated npm publication and exact registry-version verification. Do not treat a local archive, tool listing, or a successful GitHub push as evidence of registry availability.
