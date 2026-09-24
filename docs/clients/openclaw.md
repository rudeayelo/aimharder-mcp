# Connect OpenClaw

OpenClaw stores local stdio servers under `mcp.servers`; see its [MCP guide](https://docs.openclaw.ai/cli/mcp/registry) and [environment references](https://docs.openclaw.ai/gateway/config-secrets-env). This package has **not been tested** in OpenClaw.

Install Node 24+ and make `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` available through OpenClaw's environment or secrets source. Keep literal values out of commands and saved definitions. See [configuration](../configuration.md).

## Save a local stdio server

Set `mcp.servers.aimharder` to this definition:

```json
{
  "command": "npx",
  "args": ["--yes", "aimharder-mcp@0.1.2"],
  "env": {
    "AIMHARDER_USERNAME": "${AIMHARDER_USERNAME}",
    "AIMHARDER_PASSWORD": "${AIMHARDER_PASSWORD}"
  }
}
```

Save the definition with the CLI:

```sh
openclaw mcp set aimharder '{"command":"npx","args":["--yes","aimharder-mcp@0.1.2"],"env":{"AIMHARDER_USERNAME":"${AIMHARDER_USERNAME}","AIMHARDER_PASSWORD":"${AIMHARDER_PASSWORD}"}}'
```

Keep the outer single quotes: they prevent the shell from inserting secret values into saved config. You can also edit `mcp.servers.aimharder` directly. If `Europe/Madrid` is wrong, confirm the gym zone, define `AIMHARDER_GYM_TIME_ZONES`, and add `"AIMHARDER_GYM_TIME_ZONES": "${AIMHARDER_GYM_TIME_ZONES}"` under `env`. Add a default gym only if configured.

## Check the connection

Run `openclaw mcp doctor aimharder --probe` to connect and list tools. The probe does not authenticate with AimHarder. Ask an AimHarder question in a runtime that exposes the server; `get_account_context` with `{}` is an optional gym check. Runtime adapters control which saved servers are available.
