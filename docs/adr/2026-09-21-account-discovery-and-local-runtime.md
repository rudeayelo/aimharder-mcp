# ADR: account discovery, local runtime, and bounded sessions

Status: accepted for issue [#2](https://github.com/rudeayelo/aimharder-mcp/issues/2), under the approved [MVP](../mvp.md) and [security policy](2026-09-21-credential-security-and-read-only-access.md).

Class-query status: the fixed two-operation allowlist and unconditional unknown time-zone response below are superseded for issue #3 by [class schedules and confirmed time zones](2026-09-22-class-schedules-and-confirmed-time-zones.md). The runtime and security foundations remain in effect; the original wording records issue #2.

## Decision

Use Node.js 24 LTS, pnpm 12.5.1, TypeScript 7.0.2, the official MCP TypeScript SDK 1.30.0 over stdio, and Zod 4.6.5. Use native fetch with tough-cookie 6.0.2 for standards-based cookie domain/path/expiry handling in memory. Use Vitest 5.0.1 and MSW 2.15.0 to test the public MCP interface while replacing only upstream HTTP responses. Record exact dependency resolution in the lockfile. The package is private and distributed from the repository, not published to a registry.

The SDK supports Node >=18 and Zod 3.25 or 4; Vitest supports Node 24. Node 24 LTS satisfies the selected packages and was used for verification. Sources: [Node releases](https://nodejs.org/en/about/previous-releases), [official MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.30.0), and the published package manifests inspected during installation. pnpm is pinned to the available tested version. No HTTP application framework or browser test infrastructure is needed for this local transport. MSW's browser service-worker installation script is explicitly disabled.

Keep the API client independent of MCP. It permits only POST `https://login.aimharder.es/api/login` and GET `https://aimharder.es/api/whoami`. Live verification established that the login cookie works on the root domain without the frontend's refresh-token redirect. Discard returned refresh tokens and unnecessary identity fields. Use a fresh random fingerprint for each authentication. Never follow redirects or accept a configurable upstream URL. Request timeouts and bounded response bodies limit stalled or oversized upstream responses.

Authenticate lazily and fetch memberships on demand. Retain cookies and the login account ID in memory, comparing that ID with every discovery result. Serialize tool queries around the single session. On empty identity data or query HTTP 401, clear the session, reauthenticate at most once, and retry once. Other failures do not trigger recovery. Latch authentication failures until restart to prevent repeated tool calls from repeatedly submitting rejected credentials. Failed authentication requires user intervention even when the upstream challenge format is unknown.

Expose a gym ID derived from the membership's verified `.aimharder.es` subdomain, preserving its source name. Numeric `id` and `boid` have distinct values and unresolved semantics, so this slice does not use them as gym identifiers. Require a valid default when several gyms are discovered, and validate every override against current discovery. Only the observed `client` membership shape is accepted; fail explicitly for other roles/formats instead of dropping them or treating public gyms as accessible.

Return `timeZone: null`, `timeZoneStatus: "unverified"`, and a notice until a gym time-zone contract is established. The ticket explicitly requires reporting unresolved discovery or time-zone assumptions. This is not a decision to use browser or system time. Date-dependent slices must resolve this gap before claiming gym-local date behavior.

## Consequences

The result gives clients enough gym context for selection while excluding personal profile data. One-gym live validation establishes the observed account contract; multi-gym and failure scenarios are deterministic fixture tests, not live upstream guarantees. The complete MVP and date-dependent acceptance remain pending. Credentials still come from environment variables with no required secrets manager; a particular local secret-store setup is not part of the product.

Native fetch alone was insufficient because it does not retain cookies. A cookie library avoids reimplementing scoping and expiry rules. An in-memory MCP transport makes behavioral tests fast, while a separate SDK client over stdio exercises the actual executable for live acceptance. Explicit failure on unsupported contracts favors clear limitations over guessing broader API support. See [API research](../api-research.md) and [validation results](../validation.md).
