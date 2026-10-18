# ADR: isolated Cloudflare test environment

Status: accepted engineering/operational boundary on 2026-10-18 after the user explicitly authorized creating the test environment without purchases or plan changes. Complements the [runtime candidate](2026-10-16-proposed-cloudflare-hosted-runtime.md), [feasibility gate](2026-10-18-isolated-worker-authentication-feasibility.md) and [invited admission decision](2026-10-18-invited-password-admission.md). It does not authorize a production launch or complete #71's actual-delivery criterion.

## Context

The local portal is implemented and tested against real Better Auth/D1 decisions with an external mail substitute. A read-only provider inspection established an active account-owned token/zone and limited resource reads, but subscription and Email Sending access returned HTTP 403. The user subsequently authorized an isolated test environment while explicitly excluding purchases and plan changes. Real email remains a separate access/activation and mailbox-evidence gate.

## Decision

Use one dedicated Worker `aimharder-mcp-pilot-test`, one D1 `aimharder-mcp-pilot-test-auth`, and HTTPS custom origin `pilot-test.ahmcp.link`. Preserve existing scripts, DNS/routes and the root service origin. Deploy the production module bundle with compatibility date `2026-10-12` and `nodejs_compat`; use a fresh platform-secret `AUTH_SECRET`, fixed `BASE_URL` and the dedicated D1 only. Disable `workers.dev`, version preview URLs and Worker observability. Keep email, Google, owner bootstrap and upstream credentials absent while their acceptance prerequisites remain unresolved.

Pin official Wrangler 4.151.1 in the private package, matching the existing simulator dependency. Commit a standard manifest template containing no operational IDs/secrets; resolve IDs and absolute bundle/migration paths in a private configuration outside the checkout. Use ordinary Wrangler commands or equivalent official APIs with fresh read-back, without a custom deployment framework. Apply only the two committed migrations to the dedicated database. Operational credentials, upload metadata, IDs and real recipients stay outside repository/tracker/log output.

Validate the exposed anonymous surface through public HTTP with no accounts, cookies or real recipient data. Check real HTTPS separately. This proves remote routing and safe missing-sender outcomes, not password hashing within a Free CPU allowance, actual mailbox delivery, Google, ChatGPT/Hermes, upstream connectivity, isolation/lifecycle acceptance or measured cost. A standard usage model does not establish a subscription plan. Any purchase, paid activation, plan change or broader permission grant needs precise separate approval; do not infer it from the environment authorization.

## Consequences

The isolated environment makes deployment/binding/schema/domain observations concrete without admitting participants or changing the local stdio distribution. Native default authentication remains maintained; no password or authorization policy changes are introduced by deployment setup. Retain the existing safe disabled-mail behavior and keep #71 open until its actual invitation/verification/recovery receipts and flows are verified.

The [runbook and evidence](../hosted-test-environment.md) distinguish local dry-run/smoke results, remotely observed resource creation and still-unobserved stages. Provider permissions and plan uncertainty must remain explicit. The preexisting authentication, credential-custody, write-confirmation and retention requirements continue unchanged; a test deployment cannot be presented as a complete hosted pilot.
