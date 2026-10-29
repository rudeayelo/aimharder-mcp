# Controlled native telemetry validation

Status: staged procedure for [#102](https://github.com/rudeayelo/aimharder-mcp/issues/102), under [specification #94](https://github.com/rudeayelo/aimharder-mcp/issues/94). No native deployment, secret provisioning, ingestion, CPU measurement or sustained activation is established by this document.

## Authorization scope

After the implementation and synthetic checks are reviewable, request authorization for one controlled validation of the existing isolated `aimharder-mcp-pilot-test` Worker. The proposed change uploads the reviewed production bundle, adds the existing application's ingestion key as a protected `LOGNORTH_API_KEY` secret and temporarily enables the five documented LogNorth settings. Preserve all existing secrets, bindings, routes, cron, recovery authority, database contents and platform logging settings. No migration, plan change, reader grant or real sporting write is part of this procedure.

Technical failures, classifier failures and uncertain synthetic observations can create grouped issues and trigger existing new/regression notifications. Describe that effect before obtaining authorization. Do not change shared retention, channels, quiet hours, rules or uptime monitors. Sustained activation requires a later decision after evidence is reviewed.

## Preflight receipt

1. Pin the integration commit and production bundle SHA-256. Complete local checks and inspect the bundle for fixture-only routes or synthetic upstream adapters. Use the existing [test-environment procedure](hosted-test-environment.md) and pinned tooling.
2. Read actual provider configuration, deployment version and module digest; retain a private rollback configuration. Compare binding names/types, route association, alternate origins, compatibility flags, cron and logging settings. Preserve secrets by reference; never print values or raw provider payloads containing secrets.
3. Through authorized read access, record effective LogNorth version, application identity, global retention, notification channel/quiet-hours policy and reader scope. Verify public HTTPS ingestion reachability independently of the Access-protected panel. A redirect/login page is not ingestion evidence. Do not invoke an administrative command whose initialization can migrate the database.
4. Obtain the app-ingestion key through the authorized secret manager, validate its intended type without printing it, and supply it through a temporary mode-0600 secrets file outside the checkout. Delete the temporary file in `finally`. An agent/admin key cannot substitute for the app key. Keep the read-only agent credential separate.
5. Fix nonpersonal environment/release labels, for example `pilot-validation` and the actual reviewed commit identifier. Record the exact origin privately and use only the fixed HTTPS batch endpoint. Shared review resources must use the established Tailscale route; never expose a credential-bearing URL.

## Measurement and delivery matrix

Run the same bounded workload against the baseline bundle and reviewed bundle with collection disabled, enabled with successful delivery, and enabled with deliberately unavailable delivery. Use at least 20 observations per comparable HTTP/auth and MCP read cell and at least 5 scheduled invocations per maintenance cell. Record any unavailable cell rather than replacing it with local wall time. Space requests to respect actual provider/installation limits and avoid notification storms.

| Surface | Controlled workload | Evidence |
| --- | --- | --- |
| HTTP/auth | Public landing, MCP challenge and OAuth discovery; an already-authorized read-only client path where available | Actual status/headers, completion count, provider CPU and subrequests |
| MCP | Account context and representative schedule/empty read using existing authorized access | Unchanged result contract; distinct tool/HTTP observations sharing an invocation trace |
| Maintenance | Existing scheduled no-op phases without creating/deleting participants | Separate main/memory events, shared trace, actual phase settlement |
| Failure delivery | Reviewed temporary unavailable sink configuration, then restore exact destination | Unchanged application response, bounded failed attempt, no resend |
| Synthetic outcomes | Local native workerd integration harness covers all 18 tools and synthetic sporting writes | Keep this evidence separate from actual deployed delivery; never install a fixture worker over the participant service |

For each cell record sample size, actual provider CPU p50/p95/max (and p99 only if useful at that sample size), payload bytes, subrequests, wall duration separately, and observed limit errors. State how provider samples were associated without storing participant identities or request capabilities. If supported provider telemetry cannot supply per-invocation CPU, mark that measurement unavailable; startup time, local wall time and successful ingestion do not establish Free capacity. Existing baseline failures remain separate from added overhead. If instrumentation adds incompatible Free-limit errors, stop acceptance and report the measured alternatives without upgrading.

The [Workers metrics CPU chart](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) uses reservoir sampling: aggregate quantiles are estimates and do not identify an individual route or invocation. Record the query window, traffic contamination and available quantiles; do not invent a maximum from a percentile. [Deployed Worker timers](https://developers.cloudflare.com/workers/runtime-apis/performance/) advance with I/O and cannot substitute for provider CPU evidence. Preserve disabled platform logging; if the available aggregate metrics cannot support the requested comparison, report that gap before proposing any additional observer.

Use only known nonpersonal HTTP/no-op/read completions from the actual Worker for the initial delivery check. Do not create a synthetic sporting result in production or weaken service authentication to generate one. This validates actual delivery for the observed event families; it cannot establish deployed end-to-end coverage of sporting-write outcomes. Main/deferred failures not safely generated on the actual service remain synthetic evidence.

Read received observations freshly through LogNorth MCP after a bounded indexing interval. Search by the fixed validation environment/release and observation window; do not resend to force visibility. Compare static messages, allowlisted fields, finite integer durations, actual `http_status`, HTTP/tool separation, invocation correlation and excluded-data absence. Read grouped issues where generated and distinguish issue creation from notification receipt. A 201 acknowledgement is not an indexing or exhaustive-history guarantee.

## Disable and closeout

Deploy the preserved configuration with `LOGNORTH_ENABLED=false`, retaining the reviewed code and existing application resources. Read back the exact disable setting and unchanged bindings/routes/secrets/cron/recovery configuration. Repeat configured-mail anonymous smoke checks and the same authorized read. Observe that subsequent validation invocations generate no telemetry delivery; already submitted batches may finish within two seconds. Existing LogNorth events/issues are retained.

Publish sanitized results, exact commit/digest, effective settings, workload/sample counts, actual measurements, read-back evidence and missing observations. Keep #102 and parent #94 open while native acceptance is incomplete. Do not conflate this controlled validation with sustained activation, production launch, cost acceptance, physical erasure or guaranteed notification/delivery.
