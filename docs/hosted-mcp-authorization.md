# Hosted MCP client authorization

Ticket [#73](https://github.com/rudeayelo/aimharder-mcp/issues/73) implements the public HTTP authorization boundary and participant client controls. The maintained Better Auth 1.7.10 provider owns discovery, signed authorization continuation, consent validation, PKCE, token exchange and refresh. MCP SDK v2 2.3.1 owns the stateless HTTP transport. The [authorization decision](adr/2026-10-18-hosted-mcp-client-authorization.md) records client provisioning and current-grant enforcement.

The canonical production endpoint is `https://ahmcp.link/mcp`, once that origin is independently activated and verified. The existing isolated environment uses `https://pilot-test.ahmcp.link/mcp`. Client registration, issuer, callbacks and resource identifiers belong to exactly one environment; never mix them. Local harness success does not establish production routing or actual ChatGPT/Hermes compatibility. The [test environment](hosted-test-environment.md) records what is deployed separately.

## Boundary and behavior

| Public boundary | Behavior |
| --- | --- |
| `POST /mcp` without usable authorization | Maintained 401 challenge advertises protected resource discovery. Current-grant failures also return 401 with discovery. |
| `GET /.well-known/oauth-protected-resource/mcp` | Canonical MCP resource, authorization server and `mcp:read` resource scope. |
| `GET /.well-known/oauth-authorization-server/api/auth` | Maintained issuer, authorization/token endpoints, S256 and refresh support. No registration endpoint or CIMD capability is advertised. |
| `/api/auth/oauth2/authorize`, `/consent`, `/portal/oauth/consent` | Verified active portal session, explicit browser consent and the maintained signed OAuth query. OAuth login continuation returns only to the fixed local authorization endpoint. |
| `POST /api/auth/oauth2/token` | Maintained code/PKCE/resource checks and rotating refresh. Issuance also checks current admission and retains a durable original-grant identity. |
| `GET /connections`, `GET /api/portal/connections` | The signed-in active participant's authorized clients, without credentials or tokens. |
| `POST /portal/connections/{clientId}/revoke`, API equivalent | Same-origin authenticated revocation for that participant and client only. Atomically revoke grant records, remove its refresh/access rows and consent, and record a cutoff for previously issued unexchanged codes. |
| `GET /connect-clients` | Participant instructions and the configured environment's endpoint. |

The library verifies signature, issuer, audience, expiry and required scopes before application policy. Every MCP invocation also checks the signed portal subject, matching client and original grant against current D1 admission, email verification, client enablement and grant revocation. A token cannot select another portal account through tool arguments. Refresh retains the original authorization identity, so a stale refresh racing revocation cannot restore access. New authorization uses a new grant; old JWTs remain denied. Millisecond authorization-code creation times preserve ordering against revocation cutoffs. Consent, OAuth tokens and portal login are separate state.

Better Auth's default access-token lifetime is one hour and refresh lifetime is 30 days. Its MCP refresh overlap is 30 seconds: a repeated refresh can return the previous rotation response during that window. The portal revocation ledger is independent of that overlap and immediately denies an already signed access token. Use the portal's **Connected MCP clients** control for immediate complete client revocation; deleting a client's local cached tokens or a provider consent record alone is not that operation.

Before the later vault/coordination/tool slices, only `get_account_context` is exposed. The deployed resolver has no upstream credentials and returns a safe not-connected tool result. Booking/activity write routes are absent from this slice. The local stdio package retains its independent SDK v1 and all existing tools.

## Trusted operator client provisioning

DCR is disabled, including authenticated client creation, and CIMD is absent. Neither participant requests nor arbitrary URL-shaped client IDs can trigger client metadata fetches. There is no public client bootstrap endpoint. This follows the existing [CIMD network-safety boundary](hosted-feasibility.md): ordinary Worker Fetch does not establish the required address pinning and TLS identity guarantees.

Use a pre-registered **public** PKCE client with no client secret. Current [OpenAI authentication guidance](https://developers.openai.com/plugins/build/auth) allows predefined clients, and its [plugin configuration contract](https://developers.openai.com/plugins/build/plugins) supports `client.mode: provided`, `clientId` and token authentication method `none`. [Hermes documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) supports pre-registered client IDs and a pinned callback port. These are setup contracts, not observed real-client journeys.

After the exact callback has been confirmed in that client's current setup UI/configuration, prepare a reviewed registration in a new private directory outside the checkout:

```sh
BASE_URL=https://pilot-test.ahmcp.link \
MCP_CLIENT_KIND=hermes \
MCP_REDIRECT_URI=http://127.0.0.1:8765/callback \
MCP_CLIENT_OUTPUT_DIR=/absolute/private/new-client-directory \
pnpm --dir hosted client:prepare
```

This performs no network call or database mutation. It produces private `mcp-client.sql` and `client-settings.json`, generates a stable opaque client ID, pins one exact callback and resource, requires PKCE/consent, and grants only `openid profile offline_access mcp:read`. It refuses reused/output-inside-checkout directories and unsupported callback shapes. Use `MCP_CLIENT_KIND=chatgpt` with the exact `https://chatgpt.com/connector/oauth/{callback_id}` or stable `https://chatgpt.com/connector_platform_oauth_redirect` shown by ChatGPT. Do not guess the callback mode.

The operator reviews the SQL and exact target D1, applies it once, and reads back the client, callback, PKCE/consent policy and resource association. An existing client is never overwritten. Use a separate client registration for independently revocable Hermes installations or separately configured ChatGPT integrations, and keep each registration stable while that integration is used. A client display name is a label, not proof of client software identity; public clients prove user authorization with PKCE rather than a shared secret. Never put OAuth tokens or portal/AimHarder passwords in client configuration.

Apply all committed migrations in filename order on a fresh database. For the already initialized isolated D1, follow its explicit migration-adoption/read-back procedure; do not replay initial migrations. `0004-mcp-grants.sql` adds only the grant ledger/cutoffs and is separate from the maintained auth schema. Existing OAuth grants from the older feasibility slice have no ledger claim and require fresh authorization after deployment. Portal identities, passwords, invitations and verification are preserved.

## ChatGPT connection

The current [official connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt) uses **Plugins → plus → Add custom MCP server**. Account and workspace policies govern access; actual plan eligibility and the owner's available UI must be checked during final acceptance. This delivery does not promise Free or mobile availability.

1. Enter the appropriate environment's HTTPS `/mcp` URL and choose OAuth with the **provided/predefined** public client. Use the operator's client ID, no secret, discovery endpoints and `openid profile offline_access mcp:read` scopes.
2. Copy the exact redirect URI shown by the management page to the operator for registration before starting authorization. If using a plugin `mcp.json`, set `extensions["com.openai"].auth` to `{ "type": "oauth", "client": { "mode": "provided", "clientId": "<operator-issued-id>", "tokenEndpointAuthMethod": "none" }, "baseScopes": ["openid", "profile", "offline_access", "mcp:read"] }`. Discovery supplies endpoints; no secret is packaged.
3. Complete portal sign-in and review the named client's consent. Confirm the callback succeeds and the discovered tool list appears. If that UI offers only DCR/CIMD, stop and record the incompatibility; do not enable open registration or paste tokens as a workaround.
4. Refresh metadata after deployment changes, start a new conversation and select the connection. A not-connected result is expected until the AimHarder account is linked. Actual queries, refresh, revocation and confirmed actions in ChatGPT remain final [#84](https://github.com/rudeayelo/aimharder-mcp/issues/84) acceptance.

## Hermes connection

Use a current Hermes release with the documented OAuth/pre-registered-client support. In its profile's `config.yaml`, use the exact operator-approved client and loopback callback:

```yaml
mcp_servers:
  aimharder:
    url: "https://pilot-test.ahmcp.link/mcp"
    auth: oauth
    oauth:
      client_id: "<operator-issued-id>"
      redirect_host: "127.0.0.1"
      redirect_port: 8765
      scope: "openid profile offline_access mcp:read"
```

Run `hermes mcp login aimharder` from a fresh terminal, sign in to the portal and approve consent. Then restart or reload the intended Hermes session. [Hermes remote-host guidance](https://hermes-agent.nousresearch.com/docs/guides/oauth-over-ssh) describes forwarding the pinned loopback port when the browser and Hermes are on different machines. Keep callback links and tokens private; the service operator does not need them. The service does not advertise device-code login, open DCR or CIMD. Actual installed-version behavior, callbacks, refresh, revocation and complete Hermes journeys remain #84 acceptance.

## Verified evidence and limits

On 2026-10-18, Node 24 and the pinned real workerd/D1 runtime passed eight new HTTP tests using an actual SDK client and a real loopback HTTP callback listener. Coverage includes discovery, S256/consent/callback/exchange, host state validation and SDK issuer rejection, not-connected MCP tool listing/calling, actual SDK refresh requests, current admission/email checks, wrong resource and verifier, tampered signed consent state, immediate independent revocation, old JWT denial after a new grant, and concurrent refresh/revocation. Only external synthetic responses and disposable identities are used; there is no auth/SDK mock. Existing metadata denial coverage confirms URL-shaped clients cannot fetch attacker-controlled metadata.

Offline preparation was separately checked for private file/directory modes, safe callback rejection and application of its generated SQL to a disposable SQLite schema. All hosted tests, typecheck and build results are recorded in [validation](validation.md). Local tests do not prove internet client interoperability, deployed CPU/cost, live upstream connectivity, account coordination, backup/restore enforcement, full role controls or production launch. No provider action, real OAuth grant, email or AimHarder operation was performed for this implementation slice.
