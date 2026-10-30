# Sustained telemetry activation on the isolated test Worker

## Authorization and scope (2026-10-30)

After bounded native validation completed, the owner explicitly confirmed leaving telemetry enabled for ordinary use on the existing isolated test Worker. The [delivery decision](adr/2026-10-28-best-effort-hosted-telemetry-delivery.md#owner-authorized-sustained-test-activation-2026-10-30) records this operational amendment. This is not production launch, main-branch integration or acceptance of sustainable monthly cost/capacity.

## Actual activation

Configuration deployment started at **2026-10-30T09:35:42.113660Z**. Fresh provider reconciliation completed at **09:36:02.206737Z**, confirming:

- Worker: `aimharder-mcp-pilot-test`.
- `LOGNORTH_ENABLED=true`; `LOGNORTH_ENVIRONMENT=pilot-test`.
- Existing destination `https://lognorth.rudeayelo.com` and protected app-ingestion secret preserved.
- Actual source release remains `803c27e9bcd8123694a7442c768f2b65691dbce7`; documentation commits do not relabel the deployed application.
- Reviewed module SHA-256 remains `1e2cc09f33dd0202bbc1746761fb75ef2fe13aa50bd2997a65731aa11875103d`.
- Only the enabled/environment text bindings changed. All other bindings, secret binding metadata, compatibility settings, migrations, effective resources, schedules, domains, subdomain settings, limits and placement match the fresh preactivation state. Secret values were not read back.
- No producer tail consumer is attached. Persistent platform logging remains disabled. The earlier temporary CPU observer remains removed.
- Deployment command exited successfully. No automatic disabling or recurring monitor is scheduled.

The reviewed code and repository example manifest remain default-off. No application source, upstream API contract, domain terminology, participant access or shared LogNorth policy changed.

## Fresh verification

A read-only authenticated Pilot MCP `get_account_context` call succeeded before activation and another succeeded afterwards. Their complete tool responses compared equal in memory; neither response is published or persisted in this receipt.

At **09:36:48.817828Z**, a fresh LogNorth query returned three observations since deployment started: successful `get_account_context`, its successful `/mcp` HTTP observation and successful `/api/auth/jwks` HTTP observation. All had the expected environment/release and only allowed technical context fields. An additional detail read matched the returned raw context. This establishes storage of those observations in the returned view, not exhaustive delivery or future availability. No sporting write was performed.

The first text-search read returned zero observations. A subsequent app/time-scoped read, checking environment/release directly in context, established the three observations above. An extra direct Python discovery probe received HTTP 403; this probe did not establish application discovery behavior and was not counted as successful validation. The successful authenticated MCP call and fresh LogNorth read-back are the activation checks; earlier controlled discovery acceptance remains separate.

## Operation and rollback

Leave the exporter enabled for normal test-environment use. It retains the existing invocation-local allowlist, one best-effort batch, two-second total delivery bound and no retry/persistent buffer. The local stdio server is unaffected. The temporary patched LogNorth destination remains subject to its [existing replacement procedure](hosted-telemetry-compatibility-validation.md); this activation did not upgrade it.

To disable, deploy `LOGNORTH_ENABLED=false` while preserving the current module, other configuration, bindings and secrets, then reconcile the effective provider state. An already-started batch may finish within its deadline; stored events are not erased. A private preactivation configuration is retained for operator recovery; it contains no exported secret values and must not be committed.

Verification for this delivery consists of native deployment reconciliation, the before/after read-only MCP comparison, actual LogNorth search/detail read-back, documentation consistency/local-link checks and whitespace checks. No application source changed, so application suites and the long CPU experiment were not repeated. Monthly cost, loaded maintenance capacity, native sporting-write variants and notification delivery remain outside this activation evidence.
