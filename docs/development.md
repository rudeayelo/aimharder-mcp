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

`pnpm exec vitest run tests/activity-journey.test.ts` runs the source checkout's complete publication and deletion journey through an MCP SDK client and simulated upstream responses. It checks both previews, exact source and target, one write per confirmed action, and fresh read-back states. This is a fixture check and needs no account credentials; it does not perform a live AimHarder write.

## Hosted feasibility checks

The private [hosted package](../hosted/README.md) has a separate lockfile and test command. After the root installation, run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test` and `pnpm build` from `hosted/`. Its harness executes real workerd and local D1, substitutes external HTTP, and needs no credentials or provider access. Root tests intentionally cover only `tests/`; CI also runs the hosted commands. See [the feasibility evidence](hosted-feasibility.md) for what the small slice proves and what remains pending.

CI runs the hosted suite with `pnpm exec vitest run --no-file-parallelism --testTimeout=30000` from `hosted/`. File scheduling matches the earlier coordinated regression run; the CI-only per-test budget is 30 seconds for scenarios that repeatedly restart full workerd/D1 harnesses. Each file still exercises its existing scenarios, including explicit account-concurrency tests. Test assertions, product timeouts, runtime and the default local `pnpm test` command are unchanged. See the [CI scheduling and test-budget observations](validation.md#hosted-ci-file-scheduling-experiment-2026-10-28) for both failed runs, the successful matched CI run and measured multi-restart test durations.

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

For other live comparisons, build and run `AIMHARDER_LIVE_CHECK=1 node scripts/live-check.mjs` with credentials injected. Optional flags in that script select queries; `AIMHARDER_LIVE_EXERCISE_DATE=YYYY-MM-DD` checks the first 12 distinct source exercises in a matching current-feed WOD until it finds one with 1RM data. It prints only sanitized comparison outcomes and may fail when the current feed lacks that WOD or a qualifying result. Record sanitized results and limits in [validation](validation.md); fixture passes do not establish upstream behavior.

Add a changeset with `pnpm changeset` when a pull request changes the distributed package or its packaged consumer documentation. Internal-only changes need no changeset. The [release procedure](releasing.md) describes version pull requests, CI, npm OIDC setup, and the local live check of each published artifact.

## Hosted observability harness

Run `pnpm --dir hosted exec vitest run tests/worker.test.ts tests/telemetry.test.ts
--no-file-parallelism --testTimeout=30000` as one command. These native local
Worker tests use synthetic credentials, an MCP SDK client and a controllable
external telemetry receiver. They cover HTTP/auth/recovery exits, account-context
classification, unchanged results/upstream dispatches/lease release across exporter
success/rejection/timeout/disabled modes, privacy, invocation isolation, buffer
bounds/priority, oversize drops, redirect refusal, bounded acknowledgements and
one-attempt delivery. They contact no actual AimHarder/LogNorth service.

`HostedEnvironment.TELEMETRY` is an invocation-only recorder. Observe trusted
account envelopes/results before MCP serialization and call `tool(name, started,
classification)` once when the callback settles. The timer uses `performance.now()`;
no arguments/results, identifiers, arbitrary exception messages or MCP content
strings belong in telemetry. Source-owned tool/code/route catalogs reject unknown
labels. `httpOutcome()` carries a private typed HTTP classification for known
configuration denials, avoiding status-only guesses. Later slices extend these
closed mappings and add the remaining tools and scheduled phases. No recorder
or buffer is stored in account objects, durable storage or process-global state.
