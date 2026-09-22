# Validation record

## Account and gym discovery (2026-09-21)

Historical issue #2 verification; the class-query update below records subsequent behavior. Scope: [issue #2](https://github.com/rudeayelo/aimharder-mcp/issues/2), part of [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). This validates the account/gym slice, not the complete MVP.

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

## Class schedules and occupancy (2026-09-22)

Scope: [issue #3](https://github.com/rudeayelo/aimharder-mcp/issues/3), under [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). The server exposes `get_class_sessions` separately from the reusable API client. See the [class-query decision](adr/2026-09-22-class-schedules-and-confirmed-time-zones.md).

### Live investigation and acceptance boundary

Authorized read-only inspection verified the gym frontend's daily request, membership `boid` as `box`, a 19-session day, a successful empty Sunday, the time-label format, and displayed `ocupation/limit` semantics. The Wednesday 07:00 Metcon appeared with available occupancy and capacity. No participant lists, family accounts, bookings, cancellations, or profile writes were requested; account fields were held in memory and omitted from evidence.

**Pending acceptance:** the investigated responses did not establish an authoritative gym time zone. The user has been asked to confirm the real gym's IANA zone, including DST. No such confirmation is claimed here. `AIMHARDER_GYM_TIME_ZONES` allows an operator-confirmed mapping and explicitly reports `user-confirmed` provenance; this configuration mechanism does not itself verify the real gym. Final live MCP interval and specific-session comparisons remain pending that confirmation. Do not close issue #3 as fully accepted until these checks pass.

The extended `scripts/live-check.mjs` is an official MCP SDK client over stdio. Optional explicit date environment variables enable an interval query and exact time/type query, compared with independent raw read-only AimHarder responses in memory. It prints only pass/fail counts and provenance. Without dates it retains the existing account/context check. A changing occupancy between independent reads may cause a comparison failure; passing checks represent the observed run, not an atomic snapshot.

### Automated checks

`tests/classes.test.ts` covers an inclusive week, Wednesday 07:00 Metcon, distinct times/types and ambiguous matches, unchanged source names, missing/null/zero counts, empty results, malformed/unknown/restricted envelopes, duplicate IDs, later-day failure, explicit/default/unknown gyms, numeric gym routing, one shared recovery allowance, session serialization, safe redirect/transport failures, configuration errors, DST and leap/month/year boundaries, and unknown-zone refusal. Only upstream HTTP responses are substituted; the MCP SDK and API client are real. No automated test reads live credentials.

During implementation, all 48 class tests passed with `TZ=Pacific/Honolulu` and all 52 existing context tests passed. Typechecking and the build passed. Final checks passed: `pnpm typecheck`, `pnpm test` (100 tests), `pnpm build`, `node --check scripts/live-check.mjs`, and `git diff --check`. Local Markdown links resolved. The updated live stdio account/context harness passed (one accessible gym, explicit selection accepted, inaccessible selection rejected, unconfigured zone reported unverified, server stderr empty). Standards review found zero issues; Spec review found zero code defects and the one documented live acceptance blocker above. The independent reviews used baseline `aee618b` and excluded unrelated concurrent npm-planning changes.

### Remaining limitations

- Automatic gym time-zone discovery is unresolved. Supplying configuration asserts operator confirmation; it does not change verified gym access.
- Dates/times are gym-local wall values with a named zone, not absolute instants. The API supplies no offset to disambiguate DST transitions.
- One real account/gym establishes the observed class contract; multi-gym routing and error variants have fixture coverage only.
- Complete coverage means successful retrieval of each daily response. Future publication, live occupancy changes, actual attendance, and booking eligibility are not asserted.
- Unknown response envelopes and nonempty messages fail conservatively. No real restriction/expiry scenario was provoked.
- Workouts, upcoming bookings/history, and personal activity remain separate pending slices.
