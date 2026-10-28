# LogNorth observability research (2026-10-28)

Research date: 2026-10-28. Public capabilities, fresh installation observations and proposed integration work are distinguished below. This is research, not an accepted observability architecture or a deployment change.

## Verified installation observations

Authorized local inspection on 2026-10-28 established:

| Check | Observed result | Boundary |
| --- | --- | --- |
| Container and health | Official `karloscodes/lognorth:0.29.0`, healthy; local `/up` returns `ok` | LogNorth health, not AimHarder service health |
| Public panel | `https://lognorth.rudeayelo.com/` redirects to Cloudflare Access | Anonymous panel access is gated; authenticated browser access was not tested |
| App ingestion credential | Present in 1Password with app-key format | No ingestion call was made; registration, validity and delivery were not verified |
| Read-only agent credential | Retrieved privately from 1Password and used successfully against local `/mcp` | Does not validate remote Access authentication |
| MCP initialization/discovery | Protocol `2025-06-18`; eight read tools | Server reports version `dev`; installed version comes from the image, not MCP metadata |
| AimHarder app discovery | `aimharder-mcp` exists | Other apps were excluded from subsequent queries |
| App observations | No returned endpoints in 24 hours; zero returned events in seven days; zero current issues/alerts | Empty observations do not prove successful instrumentation or absence of failures |
| Built-in uptime | `status: none` | No configured uptime signal for this app was observed |
| CLI availability | `/app/lnctl` exists inside the container; `north`/`lognorth` were not found on the host PATH or in common installation locations | Read observations used direct MCP HTTP calls, not an installed `north` client |

The local operator runbook describes public ingestion exceptions and Tailscale-routed origins. These rules were read, not independently revalidated end to end. It still says that no apps exist, which fresh MCP discovery disproves; treat that sentence as historical. No local runbook, server, Access policy, key, retention, monitor or application deployment was changed. Raw credentials and log payloads were not copied into this repository.

## Product fit

LogNorth combines searchable logs, grouped error issues, endpoint health alerts, uptime probes, and agent access in a self-hosted Go service with SQLite. It is MIT licensed and aimed at one owner/small teams. Its homepage currently advertises v0.28.1. It explicitly excludes APM, distributed tracing, profiling, browser session replay, and compliance features. Its event-based reconstruction of a user's preceding activity should not be confused with browser recording. Endpoint alerts use historical baselines; correlation includes release and request context when applications supply them. [Official overview](https://lognorth.com/)

## Read access for local agents

`north` is the local read client; `lognorth` on older installations and Chasen commands operate the server. `north tail` filters by errors, text, path and app; `north top` displays current endpoint/uptime/alert health. `north call TOOL JSON` returns machine-readable results. `north mcp` exposes the same tools to local clients. Connection data lives in `~/.config/lognorth/remote.json`; keep its contents out of transcripts. CLI/server compatibility requires at least server v0.20.0 for tail/top. [Terminal documentation](https://lognorth.com/docs/terminal/)

The eight tools are `list_apps`, `list_alerts`, `list_endpoints`, `endpoint_timeline`, `uptime_timeline`, `list_issues`, `search_logs`, and `get_event`. They are read-only: no ingestion, muting, deletion, configuration, or web login. The agent key begins `lgn-agent-`; app ingestion keys begin `lgn-` and are distinct. Remote access is Streamable HTTP at `/mcp` with Bearer authentication. `search_logs` supports app, issue, text, error, time and `after_id` filters; maximum page size is 200. `get_event` includes context and related events sharing its trace ID. Listing apps first avoids guessing identity. Tool data returned to an agent goes to its AI provider. [MCP documentation](https://lognorth.com/docs/integrations/mcp/)

Source inspection at commit `abaa5c6952c1f3ca2a5a8789a07253de6367e314` shows production MCP limiting at 60 requests/minute per client IP; ingest is 1,000/minute and login 5/minute. This is source evidence, not confirmation of deployed configuration. [Server route and limiter source](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/internal/app.go#L162)

## Writing application telemetry

Native ingestion accepts `POST /api/v1/events` or `/api/v1/events/batch` with an app key. Events have a required message and optional UTC timestamp, trace ID, duration and context. Context is searchable. Native errors are binary: nonempty `error`/`error_class`, or numeric status at least 500. A 401 or an MCP JSON-RPC error returned within HTTP 200 does not automatically become an issue. Limits: 1,000 events, 4 MB transmitted, 16 MB after gzip inflation, per request. A 201 response can contain per-event validation errors and partial success; confirm the created count. There is no public REST read API; reads use MCP. [API reference](https://lognorth.com/docs/api/)

The client protocol recommends smaller 500-event/1 MB batches, bounded 10,000-event/10 MB buffers, preserving timestamps and order, backpressure/retry handling, stderr state changes, and shutdown flushing. `Retry-After` matters for 429/503. There is no durable client buffer or exactly-once guarantee; a timeout retry can duplicate events. Use no query strings in paths, and opaque IDs instead of emails. [Client protocol](https://lognorth.com/docs/integrations/protocol/)

Node/Bun supports an official `lognorth` SDK with Express, Hono, Next.js middleware and a Pino transport. Middleware attaches trace IDs, request duration and response status; error capture adds code locations and stack traces. SDK configuration can disable development/test emission, attach environment and release, identify users, and ignore health routes. [TypeScript SDK documentation](https://lognorth.com/docs/integrations/bun/)

The SDK repository currently identifies itself as version 0.2.1. Source at `357b017e61cdb7f4883b90faa87b832c9925b69e` imports `node:async_hooks`, uses module-global queue/timers, and registers Node process shutdown hooks. Public `flush()` attempts queued delivery within a five-second deadline and stops on a retryable failure; failed batches remain in memory. Its Hono adapter does not call a Worker execution context or `waitUntil()`. Hono support therefore does not establish reliable Cloudflare Workers delivery. [SDK core](https://github.com/karloscodes/lognorth-sdk-ts/blob/357b017e61cdb7f4883b90faa87b832c9925b69e/src/index.ts), [Hono adapter](https://github.com/karloscodes/lognorth-sdk-ts/blob/357b017e61cdb7f4883b90faa87b832c9925b69e/src/hono.ts)

OpenTelemetry accepts HTTP/protobuf and gzip, not OTLP/JSON or gRPC. Only logs are retained; metrics and traces are accepted and discarded. Resource attributes become context and do not select an app. This can fit an existing OTel logging setup but cannot replace a trace backend. [OpenTelemetry documentation](https://lognorth.com/docs/integrations/opentelemetry/)

## Operations and important boundaries

Managed installation supports nightly updates, predeployment/hourly snapshots, optional S3-compatible live replication and Chasen rollback/restore. Without remote storage, local backups share the server's failure domain. Event retention options run from seven days to forever, default 90 days. Notification channels are ntfy, SMTP, Telegram or webhook. A webhook can trigger an external investigation workflow, but is not itself an agent runtime. Uptime probes run every minute and alert after three failures; any HTTP 2xx/3xx/4xx counts as up. Therefore probing a protected endpoint returning 401 proves reachability, not functional authentication or MCP health. Public status pages and probes share the LogNorth host's availability. [Management documentation](https://lognorth.com/docs/manage/)

## Recommendations for aimharder-mcp (design proposals, not implemented or validated)

1. Keep local agent read access and application write access separate. A stored app key cannot substitute for the read-only agent key used by `north`.
2. For hosted MCP, emit a safe outcome per tool execution: tool name, duration, coarse result category, application version, generated request/trace ID. Capture expected authorization failures as categories, and genuine internal/upstream failures with deliberately sanitized error fields.
3. HTTP-only instrumentation is insufficient for MCP: a JSON-RPC/tool failure may have HTTP 200. Tool-level events should distinguish transport success from domain outcome.
4. Never log bearer tokens, OAuth codes, cookies, passwords, upstream response bodies, tool arguments/results, booking/member identifiers, or raw URLs. Allowlist fields and normalize paths. SDK context freedom is not a redaction policy.
5. For Node stdio mode, use the SDK or a small adapter behind an optional logger; keep diagnostics off stdout so the MCP transport remains valid.
6. For Cloudflare Workers, prefer explicit sanitized request-scoped batch sends registered with `ctx.waitUntil()`, or a Tail Worker forwarding structured safe logs. Do not assume a five-second process timer will deliver after returning. Validate with the project's real runtime and fresh read-back before adoption.
7. Best-effort `waitUntil()` is bounded to 30 seconds after invocation end. Cloudflare recommends Tail Workers for log/exception forwarding; Queues provide delivery/retry isolation if that level of reliability becomes necessary. These are runtime constraints and alternatives, not evidence that LogNorth's SDK already supports them. [Cloudflare execution context](https://developers.cloudflare.com/workers/runtime-apis/context/#waituntil)
8. Add an independent synthetic functional check for authentication/MCP tool behavior if needed. LogNorth's built-in ping cannot establish those contracts.

No server configuration, alerts, ingestion or deployment was changed by this research.

## Version-specific source additions

The inspected server commit is tagged **v0.29.0**, newer than the homepage banner. Its `list_endpoints` tool also reports p95/p99 latency; these estimates use whole UTC hours and approximately 10% bins, and old traffic without duration bins returns null. Treat source and installed feature checks as stronger version evidence than the homepage release label. [v0.29.0 MCP tool definitions](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/internal/mcp/mcp.go#L118)

`/app/lnctl` is an administrative CLI shipped in the server container, distinct from remote read client `north`. Registered subcommands are `help`, `status`, `migrate`, and `reset-password`. Status reports counts and database connection statistics, not filtered application logs. Crucially, even valid help/status invoke `internal.NewApp()` first, and that initializer calls database migrations. Do not classify executing lnctl as a guaranteed no-write inspection merely because a subcommand says status. This finding comes from source inspection. Local inspection invoked only the `--help` flag, which exits during flag parsing before application initialization; no administrative subcommand was run. [lnctl entry point](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/cmd/lnctl/main.go), [application initialization](https://github.com/karloscodes/lognorth/blob/abaa5c6952c1f3ca2a5a8789a07253de6367e314/internal/app.go#L35)

Tail Workers are available on Workers Paid and Enterprise plans; they are not a baseline option for an application on Workers Free. Check the account's actual plan before selecting that proposal. [Cloudflare Tail Workers availability](https://developers.cloudflare.com/workers/observability/logs/tail-workers/)

## Project integration boundary and next validation

Repository inspection found no LogNorth dependency in either package. The hosted example manifest keeps observability disabled; this is checked-in configuration, not a live provider read-back. `hosted/src/worker.ts` wraps authenticated requests with recovery leases, registers domain tools separately, and runs deletion maintenance in `scheduled()`. HTTP-only logs would miss tools returning `isError` within a successful HTTP exchange. `src/errors.ts` supplies safe error codes/messages, but its optional gym identifiers should not automatically enter telemetry. See [credential policy](../adr/2026-09-21-credential-security-and-read-only-access.md), [hosted credential custody](../adr/2026-10-15-hosted-identity-and-credential-custody.md), [runtime direction](../adr/2026-10-16-proposed-cloudflare-hosted-runtime.md) and [deletion maintenance](../hosted-account-deletion.md).

Proposed first slice:

- One bounded completion event for each HTTP request and MCP tool, with normalized route/tool name, duration, release, environment, random correlation ID and a closed outcome code. Distinguish transport, domain failure and uncertain write outcomes; do not retry a sporting write because telemetry failed.
- Separate scheduled-maintenance success/failure/overdue events. These are operational signals, not a replacement for the recovery authority, deletion records or physical-erasure evidence.
- A request-scoped HTTP exporter with a small bounded timeout, no raw exception/body/context forwarding, and no changes to authentication, account isolation or action ordering. Keep expected denials distinct from actionable failures so automatic grouping remains useful.
- Do not persist participant identifiers, sporting records or tool arguments/results for this initial slice. Cross-event correlation can be limited to one operation. Any later per-participant correlation needs an explicit privacy/retention decision.

Before adopting an exporter, verify synthetic MCP error detection, secret/personal-data exclusion, exporter failure isolation, concurrent-account separation, timeout behavior, partial ingestion responses and fresh read-back in the actual Worker runtime. Measure added CPU/subrequests; costs and capacity remain unverified. Uptime configuration needs a deliberately chosen health contract: an HTTP response alone cannot prove that OAuth or an authenticated tool works. LogNorth running on the local host cannot independently alert during failure of that same host without an external observer.

Existing scope, architecture, security and validation ADRs were reviewed; none is changed because no implementation decision was adopted. No production behavior changed. Documentation verification covers local link targets and diff consistency; implementation tests were not run for this research-only addition.
