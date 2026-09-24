# Configure a local AimHarder MCP server

The server uses one AimHarder account per process. Your MCP client starts it locally over stdio. Node.js 24 (`>=24 <25`) must be installed on that computer. The first intended npm version is `aimharder-mcp@0.1.0`; **it is not yet published**. Do not treat a successful local archive installation as a public registry release.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `AIMHARDER_USERNAME` | Required account login username or email. |
| `AIMHARDER_PASSWORD` | Required account password. Whitespace is preserved. |
| `AIMHARDER_GYM_TIME_ZONES` | JSON object from discovered gym IDs to user-confirmed IANA zones, such as `{"sample-gym":"Europe/Madrid"}`. Required for date queries; optional for account discovery. |
| `AIMHARDER_DEFAULT_GYM` | Optional for one accessible gym; required when the account has several. Use a discovered gym ID, not a URL. |

Inject credentials through the client process environment or a secrets manager. Client applications differ in which environment variables they forward to child processes; use the explicit mapping in each [client guide](../README.md#desktop-clients). Never put a real username or password in a checked-in file, shared client configuration, issue, screenshot, or diagnostic log. The server keeps its authenticated session in memory and does not persist a database.

## Discover your gym and confirm its time zone

1. Connect the MCP server with the two required credentials. Call `get_account_context` with `{}`. Initializing the connection or listing tools does not log in; this call does.
2. Copy the returned gym `id`. It is a verified membership's subdomain label, not its numeric AimHarder identifier or display name.
3. Confirm that gym's IANA time zone with the gym or its schedule settings. Set `AIMHARDER_GYM_TIME_ZONES` to a JSON object keyed by the returned ID. Configuring a zone asserts your confirmation; the server does not discover it automatically. Fixed offsets, your computer's zone, and location guesses are not substitutes.
4. If more than one gym is accessible, set `AIMHARDER_DEFAULT_GYM` to one returned ID and restart the server. An individual query may override it with another accessible `gymId`.

Date inputs are explicit `YYYY-MM-DD` gym-local dates. Your conversational client must resolve expressions such as “tomorrow” in the selected gym's confirmed zone. Times returned by the server are gym-local wall times; an offset or UTC instant is not invented around daylight-saving changes.

## Version-pinned startup

When the package has been published and verified, a desktop client that explicitly forwards the required variables can start the exact release with:

```text
command: /absolute/path/to/node24/bin/npx
arguments: --yes, aimharder-mcp@0.1.0
```

Use the absolute `npx` installed alongside Node 24, and make sure that Node 24 directory is also on the client's `PATH`: an `npx` launcher can itself look up `node` through `PATH`. A GUI client's environment may differ from your terminal. If you cannot provide that environment reliably, use the direct Node executable in the [private-file setup](#private-file-and-local-installation). The MCP protocol uses stdout, so avoid a wrapper such as `pnpm start` that might print nonprotocol output. The server fetches current AimHarder data on demand, without a persistent cache.

## Private file and local installation

If a client cannot securely forward the variables, store a private environment file outside the checkout and client configuration. It should define the same variables from [the table above](#environment-variables). Start with the two required names, replacing the placeholders only in your private file:

```dotenv
AIMHARDER_USERNAME=your-account-login
AIMHARDER_PASSWORD=your-account-password
```

After gym discovery, add a mapping such as `AIMHARDER_GYM_TIME_ZONES={"sample-gym":"Europe/Madrid"}` with **your** returned gym ID and confirmed zone. Restrict the file to your account (`chmod 600 /absolute/path/to/private.env`) and its containing directory to your account (`chmod 700 /absolute/path/to/private-directory`); a secrets-manager-mounted file is also suitable. The server does **not** load this file automatically.

Once `0.1.0` is published, install the exact package into a private local directory:

```sh
npm install --prefix /absolute/path/to/installation --ignore-scripts --omit=dev aimharder-mcp@0.1.0
```

Point a stdio client at Node 24 with these arguments, in this order:

```text
command: /absolute/path/to/node24/bin/node
arguments:
  --env-file=/absolute/path/to/private.env
  /absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js
```

The arguments contain file paths, not credential values. Avoid placing passwords directly in MCP config `env` objects; some clients store that config in plain text. For a pre-release local archive, replace the package spec in the install command with the absolute path to the tested `aimharder-mcp-0.1.0.tgz`. An archive is not available from npm until publication.

## First check and common errors

Ask the client to call `get_account_context` with `{}`. A successful result has `account.authenticated: true`, accessible `gyms`, and a `selectedGym`; it does not expose account names, IDs, credentials, cookies, or tokens. Then try a date query after configuring the gym zone.

- `INVALID_CONFIGURATION`: check credential variable presence and values in the **server process**, then restart. Never include their values in a bug report.
- `GYM_TIME_ZONE_REQUIRED` or `INVALID_TIME_ZONE_CONFIGURATION`: confirm the gym ID and IANA zone mapping.
- `DEFAULT_GYM_REQUIRED` or `GYM_NOT_ACCESSIBLE`: use an ID returned by account discovery, and configure a default when several gyms are accessible.
- `UNSUPPORTED_MEMBERSHIP` or `INVALID_RESPONSE`: the upstream account/gym format may differ from the observed contract; report only sanitized details.
- `SESSION_EXPIRED` or `ACCESS_RESTRICTED`: the server stopped after its bounded authentication/retry policy. Check account access in AimHarder; do not infer an empty result.

The live contract was checked with one `client` membership at one `.aimharder.es` gym. Authentication variants such as additional challenges and other membership formats have fixture coverage, not live confirmation. See the [repository validation record](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).
