# Account and gym discovery validation

Date: 2026-09-21. Scope: [issue #2](https://github.com/rudeayelo/aimharder-mcp/issues/2), part of [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). This validates the account/gym slice, not the complete MVP.

## Live read-only verification

Environment: macOS, Node 24.21.0, pnpm 12.5.1, MCP TypeScript SDK 1.30.0. Account credentials were injected into the process; their values and the secret-store configuration are not recorded here.

The public login frontend was inspected before transmitting credentials. Authorized probes established the JSON login request, cookie scoping, and account discovery shape. The final check used `scripts/live-check.mjs`: an official SDK `Client` with `StdioClientTransport` launching `dist/index.js`. No bookings, profile edits, other members' queries, or refresh-token redirects were performed.

| Check | Observed result |
| --- | --- |
| POST login on `login.aimharder.es` | HTTP 200; authentication success; an in-memory domain cookie was supplied. |
| GET root `/api/whoami` | HTTP 200; one account, matching the login identity; one `client` gym membership. |
| GET gym `/api/whoami` during contract research | HTTP 200; same account identity. The implementation only needs the root endpoint. |
| Unauthenticated `/api/whoami` during research | HTTP 200 with `data: []`; HTTP success alone does not establish authentication. |
| MCP initialization and tool listing | Passed over stdio; exactly `get_account_context` exposed. |
| Automatic selection | Passed for the account's only discovered gym. |
| Explicit selection without restart | Passed for that gym. |
| Unverified gym selection | Returned an MCP tool error. |
| Server stderr during successful harness run | Empty. |
| Gym time zone | Not present in the observed discovery fields; no verified time-zone literal found in the examined gym page. Returned as unknown with a notice. |

Sanitized harness summary: `authenticated: true`, `accessibleGymCount: 1`, `explicitSelection: "passed"`, `inaccessibleSelection: "rejected"`, `timeZoneStatus: "unverified"`, `serverStderr: "empty"`.

## Automated verification

`tests/context.test.ts` exercises a real MCP SDK client/server pair over the in-memory transport and the real AimHarder API client. MSW replaces only HTTP responses, rejects unhandled requests, and uses synthetic identity, gym, credential, cookie, and token data. No environment credentials are read by these tests.

Coverage includes automatic/default/explicit selection, required configuration, discovery refresh after membership changes, duplicate and conflicting memberships, unsupported domains and roles, malformed responses, identity mismatches, session reuse and concurrent calls, expiry recovery/exhaustion, failed reauthentication, login failure/challenge responses, restrictions, missing/expired/mis-scoped cookies, redirect rejection, network failures, oversized bodies, source-language preservation, and exclusion of private data from results and output streams.

Final checks passed: `pnpm typecheck`, `pnpm test` (52 tests), and `pnpm build`. All local Markdown links resolved across 14 files, and `git diff --check` passed. The explicit live stdio harness also passed as recorded above. A frozen-lockfile reinstall succeeded; startup without credentials exited with the expected sanitized configuration error. Separate Standards and Spec reviews against baseline `a429ea5` reported zero findings. The staged-file privacy scan found no secret tokens or private secrets-manager references.

## Limits of the evidence

- Only one real account with one client gym membership was checked. Multiple gyms and other synthetic response variants have automated coverage, not a live multi-gym account validation.
- Empty unauthenticated identity data was observed live. HTTP 401 recovery is a conservative HTTP convention tested synthetically; real session expiry was not forced.
- Invalid credentials, 2FA, restrictions, and rate limits were not provoked against the real account. Unknown login shapes stop safely; tests do not establish their actual upstream payloads or messages. HTTP 403/429 stop without recovery.
- `.com` cookie equivalence and account variants outside the observed membership format remain unverified and unsupported.
- Numeric membership identifiers and gym time zones remain unresolved. No date-dependent tool is exposed, and no system-time-zone fallback is used.
- Class schedules, occupancy, workouts, bookings, activity, and their date/state semantics have not been implemented or live-validated by this slice.
