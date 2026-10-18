# Isolated Cloudflare test environment

Operator setup for the local [invited password portal](hosted-admission.md), [ticket #71](https://github.com/rudeayelo/aimharder-mcp/issues/71). On 2026-10-18 the user authorized creating this test environment without purchases or plan changes. This is not authorization for a production launch, billing activation, broader token permissions, a new mail provider or real AimHarder actions. The [test-environment decision](adr/2026-10-18-isolated-cloudflare-test-environment.md) records the boundary.

## Fixed boundary

| Item | Isolated value / constraint |
| --- | --- |
| Worker | `aimharder-mcp-pilot-test` |
| Database | `aimharder-mcp-pilot-test-auth`, bound as `AUTH_DB` |
| HTTPS origin | `https://pilot-test.ahmcp.link` |
| Entry | The production `hosted/dist/worker.js`, never a fixture entry |
| Runtime | Compatibility date `2026-10-12`, `nodejs_compat` |
| Secret | Fresh `AUTH_SECRET`, injected securely by the operator; never a repository value |
| Email / identity / vault | No `EMAIL` binding, `MAIL_FROM`, Google configuration, owner bootstrap or upstream credentials in the anonymous stage |
| Alternate public origins | `workers_dev: false`, `preview_urls: false` |
| Logging | Library logger and telemetry remain disabled; Worker observability disabled |

The named existing Workers and the root service origin are outside this environment. An account's `default_usage_model: standard` does not establish its paid/free plan. Billing and Email Sending HTTP 403 responses do not authorize a purchase, plan switch or permission expansion. Anonymous checks do not exercise secure password hashing or prove that a Free CPU allowance can support authentication.

## Standard pinned deployment setup

The private hosted package pins official Wrangler `4.151.1`, matching the Miniflare version already exercised by the Worker feasibility gate. Use its ordinary commands, not a separate deployment framework. Install root and hosted dependencies with their frozen lockfiles, then run from `hosted/`:

```sh
pnpm typecheck
pnpm test
pnpm build
```

Copy `hosted/wrangler.test.example.jsonc` into a private directory outside the checkout. Resolve `account_id` and the dedicated `database_id` there, using fresh operator read-back of the exact resource names. Replace `main` and `migrations_dir` with absolute paths to this checkout's `hosted/dist/worker.js` and `hosted/migrations/`. Do not put operational IDs, credentials, recipient addresses or raw provider responses in the template, repository or shared logs. Keep the resolved file private. The template includes no secret or email binding and does not create a database automatically.

Supply the path as `TEST_WORKER_CONFIG` in a trusted local environment. A local dry-run does not authorize upload or routing:

```sh
WRANGLER_SEND_METRICS=false pnpm exec wrangler deploy --dry-run --config "$TEST_WORKER_CONFIG" --outdir dist/wrangler-dry-run
```

`no_bundle: true` uploads the already-reviewed production bundle. Do not substitute a test entry or let a deployment rebuild with different dependency/export conditions. The committed compatibility date/flags and separate hosted lockfile must match the tested build. Before applying changes, inspect the effective configuration and confirm that only the dedicated test resources are targeted.

For a fresh installation only, after an exact-name lookup proves the dedicated database does not already exist and effective account permissions have been checked, an authorized operator may create it with the official command or equivalent API, then capture its returned ID privately. The current database already exists as recorded below; reuse that exact resource rather than running create again:

```sh
WRANGLER_SEND_METRICS=false pnpm exec wrangler d1 create aimharder-mcp-pilot-test-auth --location weur
WRANGLER_SEND_METRICS=false pnpm exec wrangler d1 migrations list AUTH_DB --remote --config "$TEST_WORKER_CONFIG"
WRANGLER_SEND_METRICS=false pnpm exec wrangler d1 migrations apply AUTH_DB --remote --config "$TEST_WORKER_CONFIG"
```

`weur` is a placement hint, not a hard jurisdiction or residency guarantee. Apply `0001-auth.sql` then `0002-invitations.sql` only to the dedicated, initially empty database. Wrangler records applied migrations; read back the expected schema and zero identities/participants before activation. Equivalent direct-API application must likewise read back the committed schema rather than assume a successful request applied everything.

Inject a fresh `AUTH_SECRET` as a platform secret in the same initial upload as the production bundle and D1 binding. The pinned Wrangler supports `deploy --secrets-file`: prepare a fresh mode-0600 JSON file outside the checkout from a cryptographically secure value in a trusted operator process, pass only its private path as `TEST_WORKER_SECRETS_FILE`, and delete it in a `finally` cleanup after the command finishes. Do not print its contents or place the value in command arguments, a manifest or a `.vars` file. Discard Wrangler debug output rather than persisting raw upload metadata; keep its telemetry disabled. There is no public bootstrap path.

Deploy with the fixed configuration only after the database is ready:

```sh
WRANGLER_SEND_METRICS=false pnpm exec wrangler deploy --config "$TEST_WORKER_CONFIG" --secrets-file "$TEST_WORKER_SECRETS_FILE" --strict --upload-source-maps=false --autoconfig=false
```

This avoids activating a first version without its authentication secret. The secrets file applies additively; omitted existing secrets are preserved. For later rotation, use the platform-secret path and preserve the secret binding instead of replacing it with a plain-text variable.

The custom-domain route can provision its DNS/certificate; read back the Worker deployment, bindings and domain association and verify normal HTTPS. Do not disable TLS verification. Leave existing DNS/scripts/routes untouched. Do not enable Worker logs or dump full request URLs: invitation, verification and recovery URLs contain capabilities. Do not apply a plan change if any command requires one. Remote access, deployment success and a standard usage model are not a verified operating-cost estimate.

## Anonymous smoke checks

From `hosted/`, the following script targets only the fixed test HTTPS origin by default, with optional HTTP loopback override for local verification:

```sh
pnpm smoke:test-environment
```

It uses no credentials, cookies or real recipient data and prints only check labels/statuses. It checks public page content, anonymous administrator denial, absent fixture/bootstrap routes, the maintained MCP challenge/resource discovery, same-origin enrollment/recovery's safe missing-sender outcome, and foreign-origin form rejection. The synthetic `.invalid` inputs cannot establish a participant or send mail in this disabled stage. The script intentionally fails if mail is enabled: review the next acceptance stage before changing its assumptions. It does not verify login, real email, Google, MCP client onboarding or AimHarder connectivity.

For local testing, set `HOSTED_SMOKE_BASE_URL` to the loopback origin used by `pnpm preview`. Keep shared browser review accessible through Tailscale as described in the [preview instructions](hosted-admission.md#local-checks-and-anonymous-preview). Share a Tailscale-routed review link; the deployed origin separately supplies actual Cloudflare HTTPS evidence.

## Evidence and remaining gate

Local preparation on 2026-10-18 passed hosted typecheck, all fourteen workerd/D1 HTTP/MCP tests, the production build, official Wrangler dry-run, both committed migrations against disposable local D1, and thirteen anonymous HTTP smoke checks against the production-entry loopback preview. Wrangler reported 4,508.23 KiB upload and 792.86 KiB gzip; these are local upload-artifact measurements, not deployed CPU, memory or billed usage. This setup adds no authentication or upstream behavior.

The operator separately created the dedicated remote D1, read back its exact name, applied both committed migrations, checked the expected sixteen-table schema and observed zero identities/participants. Read replication is disabled, and placement is a Western Europe hint. No operational ID or provider secret is retained here. The initial Worker deployment succeeded, and fresh provider read-back found one deployment, the exact test-hostname association, `AUTH_DB` as a D1 binding, `AUTH_SECRET` as a secret-text binding and `BASE_URL` as a plain-text binding. The alternate subdomain and version previews are disabled. Thirteen anonymous checks passed against the actual custom origin through Node Fetch with normal HTTPS validation; no TLS bypass was used. A separate Python client with its generic user agent received a Cloudflare HTTP 403 / error 1010 response, so the result does not establish access from every client or network. No authenticated identity or mail flow was exercised. The temporary secret-upload file was removed after deployment; a final private-directory check found no remaining upload-secret file.

A separate Tailscale HTTPS review proxy was checked with HTTP 200. It forwards only anonymous GET requests for the landing, sign-in and recovery pages, strips upstream cookies and disables form submission. It is a read-only review aid, not the authentication origin or proof of a password/email journey; its private tailnet hostname is excluded from public evidence.

Account token and zone are active. Workers account-settings read succeeded with the standard usage model; repeated subscription and Email Sending reads remain HTTP 403 / code 10000. Reading the current token policy was also denied (HTTP 403 / code 9109), so the exact permission set was not established. No authenticated provider-dashboard session was available as an alternate read-only path. Actual plan, sender access/activation and delivery remain unresolved. No purchase, plan change, permission expansion, mail binding, real message, owner admission or upstream credential is implied by this environment. Keep #71 open until separately observed invitation, verification and recovery mailbox receipts and authentication flows satisfy its remaining criterion. Preserve all later #69 acceptance gates.

## Official references

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) and [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) and [D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/).
- [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/) and the [released Wrangler 4.151.1 metadata](https://registry.npmjs.org/wrangler/4.151.1).

These document supported operations. The evidence above states what actually ran; documented provider capability is not a completed acceptance check.
