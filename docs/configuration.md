# Configure a local AimHarder MCP server

The server uses one AimHarder account per process. Your MCP client starts it locally over stdio. Node.js 24 or newer (`>=24`) must be installed on that computer. The first intended npm version is `aimharder-mcp@0.1.0`; **it is not yet published**. Do not treat a successful local archive installation as a public registry release.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `AIMHARDER_USERNAME` | Required account login username or email. |
| `AIMHARDER_PASSWORD` | Required account password. Whitespace is preserved. |
| `AIMHARDER_GYM_TIME_ZONES` | Optional JSON object from discovered gym IDs to IANA zones, such as `{"sample-gym":"Atlantic/Canary"}`. Unmapped gyms use an explicitly assumed `Europe/Madrid` zone. Configure the actual zone when the assumption is wrong. |
| `AIMHARDER_DEFAULT_GYM` | Optional for one accessible gym; required when the account has several. Use a discovered gym ID, not a URL. |

Inject credentials through the client process environment or a secrets manager. Client applications differ in which environment variables they forward to child processes; use the explicit mapping in each [client guide](../README.md#desktop-clients). Never put a real username or password in a checked-in file, shared client configuration, issue, screenshot, or diagnostic log. The server keeps its authenticated session in memory and does not persist a database.

## Discover your gym and check its time zone

1. Connect the MCP server with the two required credentials. A valid tool call authenticates on first use. Call `get_account_context` with `{}` when you need to inspect your gym ID or time zone; initialization and tool listing alone do not log in.
2. Copy the returned gym `id`. It is a verified membership's subdomain label, not its numeric AimHarder identifier or display name.
3. Check the returned `timeZone` and `timeZoneStatus`. Without a mapping, the server assumes `Europe/Madrid` and reports `assumed`; this may be wrong, including for a gym in another Spanish time zone. Confirm the gym's IANA zone with the gym or its schedule settings when you need reliable date-based answers. Set `AIMHARDER_GYM_TIME_ZONES` to a JSON object keyed by the returned ID to override the assumption; that reports `user-confirmed`. The server does not discover a zone from AimHarder. Fixed offsets and your computer's zone are not substitutes.
4. If more than one gym is accessible, set `AIMHARDER_DEFAULT_GYM` to one returned ID and restart the server. An individual query may override it with another accessible `gymId`.

Date inputs are explicit `YYYY-MM-DD` gym-local dates. Your conversational client resolves expressions such as “tomorrow” in the selected gym's reported zone; an assumed zone can make that date wrong near a calendar boundary. Times returned by the server are gym-local wall times; an offset or UTC instant is not invented around daylight-saving changes.

## Version-pinned startup

When the package has been published and verified, a desktop client that explicitly forwards the required variables can start the exact release with:

```text
command: npx
arguments: --yes, aimharder-mcp@0.1.0
```

If the client reports that it cannot launch `npx`, check whether its process can find the installed Node and npm commands; a GUI app's environment can differ from your terminal. The direct Node executable in the [private-file setup](#private-file-and-local-installation) is another option. The MCP protocol uses stdout, so avoid a wrapper such as `pnpm start` that might print nonprotocol output. The server fetches current AimHarder data on demand, without a persistent cache.

## Private file and local installation

If a client cannot securely forward the variables, store a private environment file outside the checkout and client configuration. It should define the same variables from [the table above](#environment-variables). Start with the two required names, replacing the placeholders only in your private file:

```dotenv
AIMHARDER_USERNAME=your-account-login
AIMHARDER_PASSWORD=your-account-password
```

If the default zone is wrong, add a mapping such as `AIMHARDER_GYM_TIME_ZONES={"sample-gym":"Atlantic/Canary"}` with **your** returned gym ID and confirmed zone. Restrict the file to your account (`chmod 600 /absolute/path/to/private.env`) and its containing directory to your account (`chmod 700 /absolute/path/to/private-directory`); a secrets-manager-mounted file is also suitable. The server does **not** load this file automatically.

Once `0.1.0` is published, install the exact package into a private local directory:

```sh
npm install --prefix /absolute/path/to/installation --ignore-scripts --omit=dev aimharder-mcp@0.1.0
```

Point a stdio client at Node 24 or newer with these arguments, in this order:

```text
command: /absolute/path/to/node/bin/node
arguments:
  --env-file=/absolute/path/to/private.env
  /absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js
```

The arguments contain file paths, not credential values. Avoid placing passwords directly in MCP config `env` objects; some clients store that config in plain text. For a pre-release local archive, replace the package spec in the install command with the absolute path to the tested `aimharder-mcp-0.1.0.tgz`. An archive is not available from npm until publication.

## First check and common errors

For an explicit connection check, ask the client to call `get_account_context` with `{}`. A successful result has `account.authenticated: true`, accessible `gyms`, and a `selectedGym`; it does not expose account names, IDs, credentials, cookies, or tokens. Another valid tool call also authenticates on first use. Check the zone provenance before interpreting a date query.

- `INVALID_CONFIGURATION`: check credential variable presence and values in the **server process**, then restart. Never include their values in a bug report.
- `INVALID_TIME_ZONE_CONFIGURATION`: check that the optional mapping is valid JSON with IANA zone values. `GYM_TIME_ZONE_REQUIRED` means the server could not establish any zone and made no date query.
- `DEFAULT_GYM_REQUIRED` or `GYM_NOT_ACCESSIBLE`: use an ID returned by account discovery, and configure a default when several gyms are accessible.
- `UNSUPPORTED_MEMBERSHIP` or `INVALID_RESPONSE`: the upstream account/gym format may differ from the observed contract; report only sanitized details.
- `SESSION_EXPIRED` or `ACCESS_RESTRICTED`: the server stopped after its bounded authentication/retry policy. Check account access in AimHarder; do not infer an empty result.

The live contract was checked with one `client` membership at one `.aimharder.es` gym. Authentication variants such as additional challenges and other membership formats have fixture coverage, not live confirmation. See the [repository validation record](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).
