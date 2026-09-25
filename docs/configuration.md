# Configure a local AimHarder MCP server

Your MCP client runs the server locally over stdio, using one AimHarder account per process. Install Node.js 24 or newer. The current verified npm version is `aimharder-mcp@0.2.0`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `AIMHARDER_USERNAME` | Required account login username or email. |
| `AIMHARDER_PASSWORD` | Required account password. Whitespace is preserved. |
| `AIMHARDER_GYM_TIME_ZONES` | Optional JSON object from discovered gym IDs to IANA zones, such as `{"sample-gym":"Atlantic/Canary"}`. Unmapped gyms use an explicitly assumed `Europe/Madrid` zone. Configure the actual zone when the assumption is wrong. |
| `AIMHARDER_DEFAULT_GYM` | Optional for one accessible gym; required when the account has several. Use a discovered gym ID, not a URL. |

Supply credentials through the client process environment or a secrets manager; forwarding rules differ by [client](../README.md#desktop-and-cli-clients). Keep values out of shared config, issues and logs. The server holds its session in memory.

## Discover your gym and check its time zone

1. Call `get_account_context` with `{}` if you need your gym ID or zone. Any valid tool call authenticates on first use; tool listing alone does not. The returned `id` is a verified membership's subdomain label.
2. Check `timeZoneStatus`. `assumed` means the server used `Europe/Madrid`, which may be wrong even within Spain. For reliable date answers, confirm the gym's IANA zone and set `AIMHARDER_GYM_TIME_ZONES` with its returned ID. The result then says `user-confirmed`. AimHarder does not supply a verified zone; neither a fixed offset nor your computer's zone establishes one.
3. For multiple gyms, set `AIMHARDER_DEFAULT_GYM` to an accessible ID and restart. Individual queries may select another accessible `gymId`.

Date inputs use `YYYY-MM-DD` in the reported gym zone. An assumed zone can make “tomorrow” wrong near midnight. Returned times are local wall times without inferred UTC offsets.

`prepare_booking_creation` is available in the development checkout, not the pinned public package above. It requires an explicit mapping for the selected gym in `AIMHARDER_GYM_TIME_ZONES`; the assumed fallback cannot authorize a booking preview with an action reference. Preparation only reads the schedule and does not create a reservation.

## Version-pinned startup

A client that forwards the required variables can start the pinned release with:

```text
command: npx
arguments: --yes, aimharder-mcp@0.2.0
```

If `npx` cannot start, check the app's access to Node and npm; GUI apps may have a different `PATH` from your terminal. The [private-file setup](#private-file-and-local-installation) runs Node directly. The server queries AimHarder on demand, without a persistent cache.

## Private file and local installation

If a client cannot securely forward credentials, put them in a private environment file outside the checkout and client config:

```dotenv
AIMHARDER_USERNAME=your-account-login
AIMHARDER_PASSWORD=your-account-password
```

If needed, add `AIMHARDER_GYM_TIME_ZONES={"sample-gym":"Atlantic/Canary"}`, replacing the ID and zone. Restrict file and directory access with `chmod 600 /absolute/path/to/private.env` and `chmod 700 /absolute/path/to/private-directory`, or use a secrets-manager mount. The server does **not** load the file automatically.

Alternatively, install the exact package into a private local directory:

```sh
npm install --prefix /absolute/path/to/installation --ignore-scripts --omit=dev aimharder-mcp@0.2.0
```

Point a stdio client at Node 24 or newer with these arguments, in this order:

```text
command: /absolute/path/to/node/bin/node
arguments:
  --env-file=/absolute/path/to/private.env
  /absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js
```

These arguments contain paths, not passwords. For a pre-release local archive, replace the package spec with its absolute `.tgz` path. A local archive is not an npm release.

## First check and common errors

To check the connection, call `get_account_context` with `{}`. A successful result includes `account.authenticated: true`, `gyms` and `selectedGym`, without personal identity or credentials. Any valid tool call can authenticate; check zone provenance before date queries.

- `INVALID_CONFIGURATION`: check credential variable presence and values in the **server process**, then restart. Never include their values in a bug report.
- `INVALID_TIME_ZONE_CONFIGURATION`: check that the optional mapping is valid JSON with IANA zone values. `GYM_TIME_ZONE_REQUIRED` means the server could not establish any zone and made no date query.
- `DEFAULT_GYM_REQUIRED` or `GYM_NOT_ACCESSIBLE`: use an ID returned by account discovery, and configure a default when several gyms are accessible.
- `UNSUPPORTED_MEMBERSHIP` or `INVALID_RESPONSE`: the upstream account/gym format may differ from the observed contract; report only sanitized details.
- `SESSION_EXPIRED` or `ACCESS_RESTRICTED`: the server stopped after its bounded authentication/retry policy. Check account access in AimHarder; do not infer an empty result.

Live checks used one account at one location (9NBC). Other membership and authentication variants have fixture coverage only. See [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).
