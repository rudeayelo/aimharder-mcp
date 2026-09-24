# Connect Hermes

Hermes configures local stdio servers in `mcp_servers`. A local archive connected, exposed six tools and answered a future-WOD question; see [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md). The npm version is not yet published or tested in Hermes.

Set up [Node 24+ and credentials](../configuration.md). Hermes forwards configured `env` values, but does not pass every process variable to child servers. `${VAR}` resolves from the active profile's secrets or environment. See the [Hermes guide](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mcp.md) and [config reference](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/mcp-config-reference.md).

## Configure the server

Add this entry to the selected profile's `config.yaml`, normally `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  aimharder:
    command: npx
    args:
      - --yes
      - aimharder-mcp@0.1.0
    env:
      AIMHARDER_USERNAME: "${AIMHARDER_USERNAME}"
      AIMHARDER_PASSWORD: "${AIMHARDER_PASSWORD}"
    enabled: true
    timeout: 300
    connect_timeout: 30
```

Keep literal credentials out of YAML and check that the references resolve. If the assumed zone is wrong, confirm the gym zone and add `AIMHARDER_GYM_TIME_ZONES: "${AIMHARDER_GYM_TIME_ZONES}"` under `env`. Add `AIMHARDER_DEFAULT_GYM` the same way for multiple gyms. Define optional variables before referencing them; unresolved references can cause errors.

## Verify and reload

Run `hermes mcp test aimharder`, or `hermes -p <profile> mcp test aimharder` for a named profile. This checks tool discovery, not AimHarder authentication. Run `/reload-mcp` and ask a question; the first valid tool call authenticates. `get_account_context` with `{}` is an optional gym check.

`/reload-mcp` restarts the server; it does not reinstall it. Reinstall an updated archive or release before reloading.
