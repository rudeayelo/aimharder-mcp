# Isolated Cloudflare test environment

Operator setup for the local [invited password portal](hosted-admission.md), [ticket #71](https://github.com/rudeayelo/aimharder-mcp/issues/71). On 2026-10-18 the user authorized creating this test environment without purchases or plan changes. This is not authorization for a production launch, billing activation, broader token permissions, a new mail provider or real AimHarder actions. The user subsequently supplied an existing Resend token for this mail gate; the [Resend decision](adr/2026-10-18-resend-transactional-delivery.md) records that additional authorization. The [test-environment decision](adr/2026-10-18-isolated-cloudflare-test-environment.md) records the boundary.

Current status, 2026-10-19: the full reviewed production executable **76686e4c0e05857caf6623c81ee58b44f2ca74af** is active at the same isolated origin. The completed cutover below supersedes the historical #71–#74 deployment stages, while preserving their separate owner mail/Google/key acceptance. Actual ChatGPT/Hermes journeys and sustainable cost remain [#84 gates](hosted-pilot-acceptance.md). The original anonymous setup table/commands describe that earlier stage; a new current installation must follow all committed application migrations plus the independent authority/bootstrap requirements in [deletion and recovery](hosted-account-deletion.md#bindings-and-activation), rather than deploy the original two-migration bundle.

## Full-runtime activation (2026-10-19)

The existing owner Worker, original `AUTH_DB`, same private SQLite account namespace, canonical origin and protected auth/mail/Google/vault secrets were preserved. Actual provider main-module bytes were checked only in memory; their SHA-256 matched the reviewed production build. Current read-back confirms **12 bindings**, including distinct `RECOVERY_DB` and pinned `RECOVERY_AUTHORITY_ID`, current v2-only vault custody, `workers.dev`/previews/observability disabled and a real five-minute cron. Account inventory is now three databases. The newly created independent watchdog records an actual scheduled-handler `ok` row; no deletion or restored-data purge was manufactured in the owner environment. Scheduled CPU/capacity remains a separate measurement.

### Maintenance stop and drain

A separate capability-protected helper received the existing test custom domain before changing the owning Worker's code. Five public portal/session/MCP/auth probes returned tagged 503. An exact conditional update temporarily suspended the sole verified administrator; a fixed request to the **existing old actor namespace** then actually returned 403 after its serialized queue. Unchanged old deployment/namespace, private owner/method/password/connection digests, zero MCP clients/grants and no pending invitation were read back. Known completed single-owner flows and no old background producer supplied the case-specific non-actor premise. This is not a generic claim that deployment, idle time, a timeout or an empty counter drains arbitrary requests.

The initial Attach Domain API PUT was not acknowledged; independent inspection found the old canonical service and unchanged owner. After inspection, a distinct guarded correction used the installed Wrangler changeset/per-script domain-records API with the exact existing record and DNS override false. Routing succeeded and was read back. No domain/DNS record was deleted and no uncertain mutation was blindly replayed.

### Schemas and genuine first activation

Application migrations **0006–0009** were applied exactly once with expected columns/tables/constraints/indexes, initial `admin` activity permissions enabled, `user` permissions disabled and passing foreign-key checks. Initial migrations **0001–0005 were not replayed**; their manual/direct-API history still needs explicit adoption before Wrangler ledger-based application. A new distinct recovery database received the reviewed independent schema, including pending-purge and projection-audit state. Its fresh epoch-zero head and initial dirty interval stayed closed. No owner database was restored, prior authority replaced or projection/audit fabricated.

Under frozen ingress, stale portal sessions/generic verification and historical admission/delivery state were removed. The accepted invitation, original account/profile, credential and Google methods including password hash, exact encrypted connection/revision and v2 envelope were preserved. This cleanup did not reset the owner's password, require credential resubmission or send mail. The current production bundle was deployed **closed and unrouted** to the same owner Worker/namespace. Five private service-binding probes against its actual portal/session/MCP/auth paths returned 503 under the closed authority, with zero leases afterward.

The owner was restored active with access generation one while the authority remained closed. Matching runtime/source/custody checks and zero leases preceded genuine first activation to **open epoch one**; the initial closed interval then ended conservatively. This was a trusted bootstrap of a new authority, not a restore reopening or a bypass of `openRecovery`'s audit requirement. A fixed empty-password account operation returned the new production 400 `invalid-settings`, confirming the actor's new behavior after authenticated connection recovery; reviewed code rejects that input before upstream authentication/request. No password update or sporting operation was requested.

### Routing, health and retirement

The exact existing canonical domain returned to the owner service. Seven actual anonymous TLS/HTTP checks passed: landing and sign-in 200, private account 401, session getter 200/null, protected-resource and authorization discovery 200, and unauthenticated MCP 401 with discovery challenge. Current issuer/resource/S256 and absent DCR/CIMD were read back. Final checks retained the same namespace/version and owner/profile/method/password/connection digests; authority was open epoch one with zero leases before personal OAuth preparation.

The helper was first reduced to stateless 503 with all service/namespace/database bindings removed, then deleted without force. Independent 404 plus the retained owner Worker/namespace were verified. Its temporary local capability was retired to a digest; both owner-managed vault escrows and independent recovery history remain. No owner-bearing restore, SQL/ciphertext export, new upstream credentials, mail delivery, real sporting write, purchase or plan change occurred during activation.

Future upgrades must preserve the independent authority/history, keys, exact application/actor resource identity and current migration state. Close/drain the leased current runtime before a reviewed rollback or restoration; never revert casually to an old unleased version or initialize an empty recovery head over existing history. The special old-version single-owner barrier above is evidence for this one cutover, not a reusable substitute for the [current controlled recovery protocol](hosted-account-deletion.md#trusted-restore-protocol). Record each uncertain mutation and its independent read-back before continuing. A failed cutover stays in maintenance/closed state; no fixed wait proves completion.

## Fixed boundary

| Item | Isolated value / constraint |
| --- | --- |
| Worker | `aimharder-mcp-pilot-test` |
| Database | `aimharder-mcp-pilot-test-auth`, bound as `AUTH_DB` |
| HTTPS origin | `https://pilot-test.ahmcp.link` |
| Entry | The production `hosted/dist/worker.js`, never a fixture entry |
| Runtime | Compatibility date `2026-10-12`, `nodejs_compat` |
| Secret | Fresh `AUTH_SECRET`, injected securely by the operator; never a repository value |
| Email / identity / vault | No `RESEND_API_KEY`, `MAIL_FROM`, Google configuration, owner bootstrap or upstream credentials in the anonymous stage |
| Alternate public origins | `workers_dev: false`, `preview_urls: false` |
| Logging | Library logger and telemetry remain disabled; Worker observability disabled |

The named existing Workers and the root service origin are outside this environment. The account's `default_usage_model: standard` did not establish its paid/free plan. A subsequent authenticated dashboard inspection established Workers Free as the current plan, with 100,000 requests/day and 10ms CPU/request. Billing and Email Sending HTTP 403 responses do not authorize a purchase, plan switch or permission expansion. Anonymous checks do not exercise secure password hashing or prove that a Free CPU allowance can support authentication.

## Standard pinned deployment setup

Current deployment requirement: preserve compatibility date `2026-10-12` and include **both** `nodejs_compat` and `global_fetch_strictly_public` in the private effective configuration. The latter [canonical self-JWKS routing correction](hosted-mcp-authorization.md#actual-chatgpt-discovery-defect-and-proposed-routing-correction-2026-10-19) now has independent actual deployment/read-back, the original synthetic-invalid-token probe changing from 500 to 401, successful ChatGPT 18-tool discovery and authenticated account-context calls with JWKS 200. The flag-only rollout preserved the exact production bundle 76686e4 digest, all 12 bindings, same resources/namespace, protected owner data/custody, open authority epoch one, cron and domain. Earlier activation and anonymous checks alone did not exercise this authenticated own-zone path. Exact client wire revision and remaining full-pilot acceptance are unobserved.

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
```

`weur` is a placement hint, not a hard jurisdiction or residency guarantee. On a new, empty database only, apply `0001-auth.sql` then `0002-invitations.sql` in order and read back the expected schema and zero identities/participants before activation. Wrangler normally records applied migrations in its ledger. In this environment both SQL files were instead applied through the direct D1 API and their resulting schema was read back. That operation does not create Wrangler migration-ledger entries. Do not run `wrangler d1 migrations apply` against this already-initialized database: it would attempt to replay the initial `CREATE` statements. Verify and explicitly adopt the existing schema into a reviewed migration ledger before using Wrangler for later migrations; ledger adoption is separate from applying the initial SQL again.

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

It uses no credentials, cookies or real recipient data and prints only check labels/statuses. It checks public page content, anonymous administrator denial, absent fixture/bootstrap routes, the maintained MCP challenge/resource discovery, same-origin enrollment/recovery's safe missing-sender outcome, and foreign-origin form rejection. The synthetic `.invalid` inputs cannot establish a participant or send mail in this disabled stage. The default `HOSTED_SMOKE_MAIL_STAGE=disabled` explicitly checks missing-mail outcomes and fails if mail is enabled. Once mail is configured, use `HOSTED_SMOKE_MAIL_STAGE=configured pnpm smoke:test-environment`: this runs eleven safe checks and omits both enrollment/recovery probes. It never tests a recipient, creates a pending identity or requests mail in the configured stage. The stage flag is an operator assertion, not proof of provider readiness. It does not verify login, real email, Google, MCP client onboarding or AimHarder connectivity.

For local testing, set `HOSTED_SMOKE_BASE_URL` to the loopback origin used by `pnpm preview`. Keep shared browser review accessible through Tailscale as described in the [preview instructions](hosted-admission.md#local-checks-and-anonymous-preview). Share a Tailscale-routed review link; the deployed origin separately supplies actual Cloudflare HTTPS evidence.

The initial native-mail blocker below is historical. The [Resend sender runbook](hosted-admission.md#required-runtime-and-sender-setup) now replaces that selection using the owner-supplied existing credential; actual sender activation and the first owner invitation now have the separate evidence below; the owner reported all three mailbox receipts, verified password login and successful recovery, completing #71 acceptance.

## Encrypted AimHarder connection deployment stage (2026-10-19)

The [connection runbook](hosted-aimharder-connection.md#isolated-platform-activation-2026-10-19) records separate owner-managed recovery-key custody and the #74 activation. The owner saved the key in 1Password; the existing service account used read-only access to validate it without permission expansion or a new provisioning token. `VAULT_KEYS` and `VAULT_ACTIVE_KEY_ID` were added as protected platform secrets. Fresh read-back resolved an interrupted first operation without repeating a successful mutation.

Only reviewed `0005-aimharder-connection.sql` was applied once, with exact columns, zero initial connection rows and an empty foreign-key check. Pinned Wrangler deployed the reviewed production bundle from integration `42929b0`, activating the private `ACCOUNT_CONNECTIONS` binding and its matching `AccountConnection` SQLite namespace. Fresh platform read-back found ten intended bindings, all original seven auth/mail/Google bindings preserved, and alternate origins/observability still disabled. Existing migrations were not replayed.

All eleven configured-mail anonymous HTTPS checks passed without requesting mail. Fresh D1 comparison retained the pre-#74 owner identity/profile, active verified administrator state, one credential method and one Google method, unique provider-subject index and MCP generation ledger. No purchase, plan change, additional mail or sporting write occurred. The owner subsequently reported `connected` after connecting their own AimHarder account through the signed-in portal. A separate private read-only inspection found one owner-bound encrypted row and verified actual AES-GCM decryption, authenticated ownership/revision/key-ID data, valid pinned identity and absence of actual credential/key canaries in the serialized stored row. No plaintext or key was persisted or emitted; fresh checks preserved the accepted portal identity/profile and credential/Google methods. The [connection record](hosted-aimharder-connection.md#owner-connection-and-ciphertext-inspection-2026-10-19) distinguishes owner-reported status from independent ciphertext checks. The owner then supplied a second independent 32-byte base64 key in a separate Password item, retaining read-only service-account access and both escrow items. The [controlled rotation record](hosted-aimharder-connection.md#controlled-platform-rotation-and-runtime-recovery-2026-10-19) records protected two-key activation, actual offline preparation, reviewed/digest-bound owned revision/envelope conditional SQL, exactly one updated row and zero active rows left on the old key. Independent decrypt/canary checks preserved configuration, pinned identity and semantic revision. The runtime was then reloaded with only the new escrowed key; fresh rollout/settings and eleven configured-mail anonymous checks passed with all ten bindings, the private SQLite namespace, disabled alternate origins/logging and accepted portal identity/methods preserved. No plaintext export, secret output, sporting write, purchase or plan change occurred. An additional independent new-key-only decrypt matched the original accepted configuration/identity/revision hashes and confirmed zero old-key active envelopes. Separately, the owner refreshed the signed-in portal after rollout and reported that the account was still `connected`, without resubmitting upstream credentials. This owner-reported public result and the independent operator checks complete #74 acceptance for this slice. Active-key-only runtime recovery does not establish full D1 backup restoration, deletion/revocation-safe restore or <=30-day backup enforcement. Old escrow keys remain retained for historical ciphertext. Namespace activation and anonymous HTTPS checks do not establish CPU, load, cost, full tools/lifecycle or actual ChatGPT/Hermes acceptance.

## MCP authorization deployment stage

The operator then applied exactly the reviewed `0004-mcp-grants.sql` once to the isolated D1. Read-back confirmed both application tables and the exact generation columns, zero initial grant/revocation rows and an empty `foreign_key_check`. The existing initial migrations were not replayed; the direct-API/manual migration history, including the prior account-method index, still requires explicit ledger adoption before Wrangler migration commands. Reviewed integration `58354e4` was deployed as a code-only update with pinned Wrangler 4.151.1. Deployment succeeded; the reported 137 ms Worker startup is not authentication/request CPU, load or billing evidence. All eleven configured-mail anonymous HTTPS checks passed. Fresh actual metadata matched the isolated issuer/authorization/token endpoints and MCP resource, advertising `mcp:access`, S256 and refresh without DCR/CIMD; anonymous `/mcp` remained 401.

Fresh post-deployment provider/D1 read-back confirmed the same seven binding names/types, unchanged owner portal identity/profile and exactly one credential method plus one Google method. This slice did not repeat owner login. It created no actual MCP client grant and performed no real ChatGPT/Hermes callback, refresh/revocation journey or AimHarder request. The local SDK/loopback evidence remains separate from actual-client acceptance in #84. No purchases, plan changes or provider-permission expansion occurred.

## Configured Resend deployment stage

The operator subsequently configured the owner-supplied existing Resend service without changing Workers Free, purchasing capacity or expanding permissions. The `ahmcp.link` sending domain was created in `eu-west-1`. Exactly four provider-returned DNS records were added and matched public DNS: DKIM TXT at `resend._domainkey`, MX and TXT at `send`, and CNAME at `rsend`. The domain and every record were subsequently read back as verified. Open/click tracking read back as disabled. An enforced-TLS update returned success; domain reads omit that setting, so persistent read-back is not established. Root receiving MX and unrelated DNS were preserved.

The reviewed production bundle was deployed with a verified `MAIL_FROM` and `RESEND_API_KEY` platform secret, preserving the original `AUTH_SECRET`, database and base origin. Settings read-back confirmed five bindings with the expected database/plain-text/secret-text types. Temporary secret-upload files were removed. All eleven configured-stage anonymous HTTPS checks passed. This stage deliberately omits enrollment and recovery probes and sends no smoke email.

The operator applied one private owner-bootstrap invitation insert. One invitation was accepted by Resend with HTTP 200; a fresh outgoing-message read later reported `last_event: delivered`. Provider delivery is distinct from mailbox receipt/read and authentication. The owner subsequently reported both invitation and verification receipts, successful verification and password login; a separate provider metadata read also reported the verification message delivered. Fresh database read-back then found one identity, one verified identity and one active admitted credential administrator. Earlier counts were pre-completion snapshots. The actual public recovery form returned HTTP 200, and provider metadata reported the recovery message delivered as well. The owner then confirmed recovery mailbox receipt and successful recovery after being asked to reset the password and sign in again. These user-reported mailbox/authentication outcomes complete #71 acceptance alongside the independent provider/D1 evidence and seventeen local hosted tests. They do not measure CPU, concurrent hashing, load suitability or cost. The broader #69 specification remains incomplete. No real AimHarder credentials or upstream actions were involved.

The evidence below records the original anonymous deployment stage, before this configured-mail follow-up.

## Evidence and remaining gate

Local preparation on 2026-10-18 passed hosted typecheck, all fourteen workerd/D1 HTTP/MCP tests, the production build, official Wrangler dry-run, both committed migrations against disposable local D1, and thirteen anonymous HTTP smoke checks against the production-entry loopback preview. Wrangler reported 4,508.23 KiB upload and 792.86 KiB gzip; these are local upload-artifact measurements, not deployed CPU, memory or billed usage. This setup adds no authentication or upstream behavior.

The operator separately created the dedicated remote D1, read back its exact name, applied both committed migrations, checked the expected sixteen-table schema and observed zero identities/participants. Read replication is disabled, and placement is a Western Europe hint. No operational ID or provider secret is retained here. The initial Worker deployment succeeded, and fresh provider read-back found one deployment, the exact test-hostname association, `AUTH_DB` as a D1 binding, `AUTH_SECRET` as a secret-text binding and `BASE_URL` as a plain-text binding. The alternate subdomain and version previews are disabled. Thirteen anonymous checks passed against the actual custom origin through Node Fetch with normal HTTPS validation; no TLS bypass was used. A separate Python client with its generic user agent received a Cloudflare HTTP 403 / error 1010 response, so the result does not establish access from every client or network. No authenticated identity or mail flow was exercised. The temporary secret-upload file was removed after deployment; a final private-directory check found no remaining upload-secret file.

A separate Tailscale HTTPS review proxy was checked with HTTP 200. It forwards only anonymous GET requests for the landing, sign-in and recovery pages, strips upstream cookies and disables form submission. It is a read-only review aid, not the authentication origin or proof of a password/email journey; its private tailnet hostname is excluded from public evidence.

Account token and zone are active. Workers account-settings read succeeded with the standard usage model; repeated subscription and Email Sending reads remain HTTP 403 / code 10000. Reading the current token policy was also denied (HTTP 403 / code 9109), so the exact permission set was not established. Initially no authenticated provider-dashboard session was available. After the user signed in, the Workers plan screen showed **Free — Current plan**, 100,000 requests/day and 10ms CPU/request. Its comparison showed Email Sending unavailable on Free and included on Paid; Paid was displayed as USD 5/month plus usage. No upgrade was selected. These UI observations resolve the earlier plan uncertainty despite the API denial. At that initial stage the selected native email service required Paid, so its sender setup and actual mailbox receipts were blocked by the no-purchases/no-plan-changes constraint. The subsequent Resend choice and owner acceptance above complete those delivery criteria without an upgrade. No remote password-authentication CPU measurement was taken; anonymous checks do not establish suitability of Free for maintained secure hashing. No purchase, plan change, permission expansion, mail binding, real message, owner admission or upstream credential is implied by this environment. At that original stage, #71 remained open until actual mailbox/authentication journeys; the configured Resend stage above records their subsequent completion. Preserve all later #69 acceptance gates.

## Official references

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) and [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) and [D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/).
- [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/) and the [released Wrangler 4.151.1 metadata](https://registry.npmjs.org/wrangler/4.151.1).

These document supported operations. The evidence above states what actually ran; documented provider capability is not a completed acceptance check.

## Google stage preparation

The subsequent [Google runbook](hosted-google.md) defines the reviewed production code, `0003-account-method-uniqueness.sql`, two optional platform secrets and exact test callback/origin. Its local policy checks do not establish actual provider configuration, Testing admission or owner login/linking. Preserve existing mail/auth bindings and apply only the new index after verifying the existing schema; the initial direct-API migrations must not be replayed through an empty Wrangler ledger.

The operator subsequently verified External/Testing with no audience change, applied only the unique index after a zero-duplicate preflight, and deployed reviewed integration commit `60e6209` with both Google platform secrets while preserving the five existing auth/mail bindings. Fresh read-back confirmed seven intended bindings; all eleven configured-mail anonymous HTTPS checks passed and the Google sign-in button appeared. The private temporary secret file was removed. After a scoped CSP correction, the operator separately observed actual Chrome handoff to Google's account chooser. The owner reported completed explicit linking and returning Google login; subsequent independent D1 read-back confirmed the original identity/profile with one credential method and one Google method, while all seven bindings remained unchanged. See the linked Google runbook for the original blocked-browser attempt, correction and separate human/server evidence. Google-first/password-add live acceptance and full client journeys remain unperformed.
