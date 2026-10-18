# Worker-hosted authentication feasibility

Local evidence for [ticket #70](https://github.com/rudeayelo/aimharder-mcp/issues/70), part of [specification #69](https://github.com/rudeayelo/aimharder-mcp/issues/69). Observed 2026-10-18. This is a small synthetic feasibility slice, not a deployed portal, a live AimHarder check, or actual ChatGPT/Hermes acceptance. The subsequent [invited password slice](hosted-admission.md) adds local invitation/verification/recovery behavior without changing this gate's historical measurements. See the [runtime decision](adr/2026-10-16-proposed-cloudflare-hosted-runtime.md) and [hosted package setup](../hosted/README.md).

## Released combination and runtime evidence

| Component | Exact pin / observed boundary |
| --- | --- |
| Better Auth / MCP plugin | `better-auth` and `@better-auth/mcp` 1.7.10 |
| Hosted MCP SDK | `@modelcontextprotocol/server` and harness `@modelcontextprotocol/client` 2.3.1 |
| Existing local MCP SDK | 1.30.0, unchanged and independently checked |
| Worker harness | `miniflare` 5.20261012.1-beta, `workerd` 1.20261012.1; this is the combination pinned by Wrangler 4.151.1, rather than the older Miniflare latest tag |
| Worker configuration | Compatibility date 2026-10-12, explicit `nodejs_compat`, native workerd execution |
| Bundler / validation | esbuild 0.28.0, `workerd` export condition; SDK `CfWorkerJsonSchemaValidator` avoids runtime code generation |
| Cookie parser / schemas | tough-cookie 6.0.2 and Zod 4.6.5, matching the local client |
| Schema | Better Auth migration API-generated SQL applied to disposable local D1 |

The production bundle measured 4,594,572 bytes (806,277 bytes gzip) locally. No deployed size or startup measurement is claimed.

The harness exercises the public Worker HTTP surface: maintained password sign-in against a synthetic verified identity, OAuth authorization and explicit consent, S256 PKCE authorization-code exchange, audience-bound JWT issuance, and an SDK v2 account-context tool call over actual local HTTP. The route verifies signature, issuer, audience, expiry, and required `mcp:read` scope through Better Auth. The tool resolves the verified `sub` through a connection-provider boundary and calls the existing independent `AimHarderClient`. Synthetic external HTTP supplies only its actual login and identity endpoints, including cookie scope. Unexpected network destinations fail the harness. Missing/invalid authorization never reaches AimHarder. Tool results omit fixture passwords, cookies and upstream email.

The local client needed one portability change: workerd rejects Fetch `redirect: 'error'`. It now uses `redirect: 'manual'`; the existing non-success-response guard rejects redirects without following or forwarding credentials. Existing login/identity redirect regressions still apply. No certificate validation or authentication rule is weakened. Other Node compatibility (crypto randomness, Buffer and tough-cookie) works in this exercised path; this does not establish every later tool's Worker behavior.

The feasibility tool creates a new AimHarder client per call. It does not yet retain the per-account session, authentication-failure latch or action stores across requests. That is explicitly temporary: the later account-coordination slice must supply durable account routing, connection revision, session reuse and complete action semantics. Do not extend this request-local client pattern to hosted writes. The production entry is deliberately unconnected until the vault slice supplies a real resolver; synthetic provisioning is in a separately bundled test entry only.

## Password hashing and maintenance

Better Auth retains its maintained default scrypt implementation (`@better-auth/utils` 0.5.0): N=16384, r=16, p=1, 64-byte output, 16-byte random salt, NFKC input normalization, and a 64MiB native max-memory bound. The bundle resolves the package's `workerd` export to native `node:crypto` scrypt; no custom/weak hash hook is installed. Both hash creation and correct-password verification ran inside workerd. One representative local run measured 31.0ms wall time for hashing and 38.3ms for password sign-in; these are machine-dependent wall times, not deployed CPU usage or billed milliseconds. The harness can print current timings with `pnpm exec vitest run --reporter=verbose --silent=false`.

Workers Paid is the planning baseline. The later [test-environment inspection](hosted-test-environment.md) established Workers Free as the actual current plan, with 100,000 requests/day and 10ms CPU/request; it also established that the selected native Email Sending requires Paid. No upgrade was selected or authorized. Free's 10ms CPU allowance is not assumed suitable for secure password authentication. Deployed CPU, peak memory and concurrent hashing remain unmeasured. The subsequent [password portal slice](hosted-admission.md) implements local recovery/verification and records D1-safe failure behavior; actual email delivery, Google login/linking and upgrade acceptance remain pending. D1 does not support interactive transactions; safe failure and retry semantics cannot be inferred from the library's support claim.

## Safe metadata and client registration

This gate provisions one synthetic public native OAuth client with an exact loopback callback, PKCE required and explicit resource association. Provisioning is disposable fixture setup, not a public registration API or proof of production provisioning. DCR is explicitly disabled; no CIMD plugin is installed. Discovery does not advertise either capability. An unapproved URL-shaped client identifier returns the provider's local `invalid_client` error without fetching that URL. Invalid bearer tokens and unauthenticated requests fail with the maintained OAuth challenge.

CIMD remains disabled because the maintained package requires resolving a hostname once, rejecting special-use addresses, pinning the approved address while preserving TLS identity, and refusing redirects. Ordinary Worker `fetch` plus a preliminary DNS check is insufficient. The Node helper is not established as a Worker implementation, and `node:https` is a Fetch wrapper. A safe metadata transport or verified explicit real-client provisioning remains necessary before accepting clients that require it. Do not enable arbitrary metadata fetching or open DCR to make a client connect.

The hosted endpoint intentionally uses the documented SDK v2 protocol profile `2026-07-28` with legacy traffic rejected. The SDK harness pins that revision. Actual ChatGPT and Hermes supported versions, OAuth registration, callback, refresh/revocation and full tool journeys must be observed separately. SDK success proves none of those client acceptances.

## Initial 20-participant cost envelope

These are planning assumptions rather than a vendor quote, a spending cap, a current exchange rate, or a measured bill. Assume 20 participants over 30 days, 100 MCP operations per participant/day (60,000), at most 100,000 total Worker requests including portal/OAuth, less than 20ms average CPU per ordinary request, and at most 200 password operations at a planning allowance of one CPU second each. Estimated total CPU remains below 2.2 million milliseconds; deployed measurements must replace these assumptions.

| Item | Assumption | Incremental monthly amount |
| --- | --- | --- |
| Workers Paid | USD 5 minimum, within 10M requests and 30M CPU-ms included | USD 5 |
| D1 auth/configuration/encrypted credentials | <=100MB, <=1M rows read and 100k written including indexes; no sporting-history replica | USD 0 within Paid allowances |
| Account coordination, if using SQLite Durable Objects | <=100k calls, <=100MB, <=1 billable active hour per participant/day at 0.128GB = 276,480 GB-s | USD 0 within included 400,000 GB-s |
| Invitation/verification/recovery email | Cloudflare Email Service on Workers Paid, <=200/month; one verified sender domain | USD 0 within 3,000/month included; USD 0.35/1,000 beyond inclusion |
| Native D1 recovery history | Paid Time Travel, no external retained exports assumed | USD 0 incremental |
| Domain renewal reserve | ahmcp.link already purchased; actual renewal price not inspected | EUR 1.50 assumed allocation |

Assuming USD 1 costs **at most** EUR 1 and 21% tax, the illustrative total is `5 × 1 × 1.21 + 1.50 = EUR 7.55/month`, leaving EUR 2.45 reserve. The assumed tax and conversion are not verified account facts. Shared account usage, request fanout, retries/abuse, log usage, actual renewal and email-provider eligibility/delivery remain unknown. No paid plan or provider account was changed.

Durable Object residency is material: at three billable hours per participant/day, 829,440 GB-s adds approximately USD 5.37 and breaches this envelope. Twenty continuously active objects would add about USD 77.94/month. Measure actual duration/hibernation, or choose the already accepted atomic D1 coordination alternative and prove its correctness. The plausible one-hour scenario is not proof that residency will stay within it. The [password admission slice](hosted-admission.md) selects Cloudflare's native email service over the initial Resend Free assumption to avoid a new provider account. Actual beta eligibility, quotas, domain verification and delivery remain pending. A paid email fallback such as Resend Pro (USD 20/month) would exceed the target. A material budget failure must reopen the decision, not silently remove features.

D1 Paid Time Travel has 30-day recovery history. That fact alone does not prove deletion from all platform copies or restoration that preserves subsequent revocations. Retention and controlled restore remain separate acceptance gates.

## Primary sources checked

- [Better Auth MCP](https://better-auth.com/docs/plugins/mcp), [database](https://better-auth.com/docs/concepts/database), [password authentication](https://better-auth.com/docs/authentication/email-password), [CIMD security contract](https://better-auth.com/docs/plugins/cimd).
- Released registry metadata: [Better Auth 1.7.10](https://registry.npmjs.org/better-auth/1.7.10), [MCP plugin 1.7.10](https://registry.npmjs.org/@better-auth%2fmcp/1.7.10), [SDK server 2.3.1](https://registry.npmjs.org/@modelcontextprotocol%2fserver/2.3.1), [Wrangler 4.151.1](https://registry.npmjs.org/wrangler/4.151.1). Installed package source was also inspected for hashing, D1 and export conditions.
- Workers [crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/), [HTTPS](https://developers.cloudflare.com/workers/runtime-apis/nodejs/https/), [pricing](https://developers.cloudflare.com/workers/platform/pricing/).
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/), [Resend pricing](https://resend.com/pricing).
- Subsequent sender selection: [Cloudflare Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/) and [native sending API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/), checked 2026-10-18.

## Verification and remaining boundaries

The committed automated seam is intentionally small: maintained OAuth discovery/denial, one authenticated account query, and closed client registration/metadata safety. Local type/build, full MCP tests and isolated package checks are recorded in [validation](validation.md). The existing upstream evidence is unchanged; synthetic responses are not new API observations.

No production resource, DNS/TLS route, secrets manager item, billing configuration, real email, Google provider, ChatGPT, Hermes, live AimHarder account or real upstream write was accessed by this gate. Local invitation/password admission is now covered by the subsequent [password portal slice](hosted-admission.md); actual delivery, vault encryption/key rotation, suspension/current-grant revocation, coordination/restart, the full tool set, deletion/restore and actual-client acceptance remain pending. A material incompatibility encountered there must leave its affected gate unresolved until an explicit revised decision is agreed.
