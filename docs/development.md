# Develop and verify the server

For contributor setup. End users should use the [README](../README.md) and [configuration guide](configuration.md). The npm archive includes compiled code and consumer docs, not these development files.

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

`pnpm test` uses anonymized HTTP fixtures through MCP, rejects unexpected requests and checks an isolated package install. Build after source edits.

## Run and inspect locally

Supply credentials and any gym-zone override as in [configuration](configuration.md). Run `pnpm start` with variables injected, or `node --env-file=/absolute/path/to/private.env dist/index.js`. The server waits for MCP messages on stdin.

After building, run these MCP SDK client examples with an injected environment or Node's `--env-file`:

| Example | Command arguments | Purpose |
| --- | --- | --- |
| `scripts/query-training.mjs` | `tomorrow WOD` or `YYYY-MM-DD ClassName [gymId]` | Combine class sessions, published workouts and upcoming bookings. |
| `scripts/query-recent-activity.mjs` | `YYYY-MM-DD [maxWindows] [gymId]` | Search backwards for five distinct activity entries. |
| `scripts/query-activity-period.mjs` | `previous-month [gymId]` or `YYYY-MM-DD YYYY-MM-DD [gymId]` | Count activity entries and days with activity over a period. |

Output contains private account data; keep it out of issues and logs. These examples are clients, not server tools. See [combined questions](tools.md#questions-that-combine-tools).

## Isolated package check

`pnpm test:package` checks the archive allowlist, installs production dependencies outside the checkout with lifecycle scripts disabled, and launches the installed executable over MCP with anonymized fixtures. It does not check npm publication. With securely injected credentials, `AIMHARDER_LIVE_CHECK=1 pnpm test:package:live` adds a read-only account/gym check.

For other live comparisons, build and run `AIMHARDER_LIVE_CHECK=1 node scripts/live-check.mjs` with credentials injected. Optional flags in that script select queries. Record sanitized results and limits in [validation](validation.md); fixture passes do not establish upstream behavior.

Follow the separate [release procedure](releasing.md) for npm publication and exact-version verification.
