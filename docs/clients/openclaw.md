# Connect OpenClaw

OpenClaw stores outbound MCP servers under `mcp.servers` and supports local stdio commands. Its [registry guide](https://docs.openclaw.ai/cli/mcp/registry) distinguishes saved definitions from a live connection; [environment references](https://docs.openclaw.ai/gateway/config-secrets-env) can resolve `${VAR}` in configuration strings. An end-to-end OpenClaw check with this package has not yet been recorded. The first npm version, `aimharder-mcp@0.1.0`, is not yet published.

Install Node 24 and arrange for `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` to be available in OpenClaw's configuration environment or approved secret source. Do not place literal credential values in a command or saved MCP definition. See [shared configuration](../configuration.md).

## Save a local stdio server

Set `mcp.servers.aimharder` to this definition, replacing the command path with the absolute `npx` path installed alongside Node 24 and ensuring OpenClaw's `PATH` can resolve Node 24:

```json
{
  "command": "/absolute/path/to/node24/bin/npx",
  "args": ["--yes", "aimharder-mcp@0.1.0"],
  "env": {
    "AIMHARDER_USERNAME": "${AIMHARDER_USERNAME}",
    "AIMHARDER_PASSWORD": "${AIMHARDER_PASSWORD}"
  }
}
```

For example, save that definition with the CLI after replacing the command path:

```sh
openclaw mcp set aimharder '{"command":"/absolute/path/to/node24/bin/npx","args":["--yes","aimharder-mcp@0.1.0"],"env":{"AIMHARDER_USERNAME":"${AIMHARDER_USERNAME}","AIMHARDER_PASSWORD":"${AIMHARDER_PASSWORD}"}}'
```

Keep the outer single quotes so the shell does not expand `${VAR}` into a literal secret while saving. Alternatively, edit the matching `mcp.servers.aimharder` object in your OpenClaw configuration. After discovering your gym and confirming its zone, define `AIMHARDER_GYM_TIME_ZONES` in OpenClaw's environment and add `"AIMHARDER_GYM_TIME_ZONES": "${AIMHARDER_GYM_TIME_ZONES}"` under `env`. Add a default gym mapping only if configured.

## Check the connection

Run `openclaw mcp doctor aimharder --probe`. Plain `doctor` performs static checks; `--probe` connects and lists tools. A successful probe does not authenticate with AimHarder. Ask an eligible OpenClaw runtime to call `get_account_context` with `{}` for the live account check. OpenClaw adapters decide which saved servers are available in each runtime, so a saved definition or probe alone does not establish that every OpenClaw agent can use the tool.
