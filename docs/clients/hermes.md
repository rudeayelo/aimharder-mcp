# Connect Hermes

Hermes supports local stdio MCP servers in its `mcp_servers` configuration. A locally installed archive was connected to Hermes and its six tools were discovered; the user also checked a future WOD. See the [validation record](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md) for what that established. The public `aimharder-mcp@0.1.0` package has not yet been published or checked in Hermes.

Follow the shared [Node 24 or newer and credential setup](../configuration.md). Hermes forwards explicitly configured `env` variables plus a safe baseline to stdio children; it does **not** simply pass every variable from its own process. The `${VAR}` references below resolve from Hermes's active profile secrets or process environment. See the [official Hermes MCP guide](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mcp.md) and [configuration reference](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/mcp-config-reference.md).

## Configure the server

Add this entry under the existing `mcp_servers` mapping in the selected Hermes profile's `config.yaml` (normally `~/.hermes/config.yaml`), preserving other settings:

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

Do not put literal credential values in YAML. Confirm that both referenced variables resolve in the selected Hermes profile before connecting. If the zone reported by `get_account_context` is only assumed or wrong, confirm the gym zone, make `AIMHARDER_GYM_TIME_ZONES` available to Hermes, and add `AIMHARDER_GYM_TIME_ZONES: "${AIMHARDER_GYM_TIME_ZONES}"` under `env`. Add `AIMHARDER_DEFAULT_GYM` in the same way only if several gyms need a default. An unset reference can remain literal and cause a configuration error, so do not add optional mappings before defining them.

## Verify and reload

Run `hermes mcp test aimharder` in the selected profile to verify initialization and tool discovery; it does not authenticate with AimHarder. Use `hermes -p <profile> mcp test aimharder` to name a profile explicitly. Reload MCP connections in Hermes with `/reload-mcp`, then ask it to call `get_account_context` with `{}` for a live account check.

`/reload-mcp` restarts the configured server; it does not rebuild or reinstall a package. When updating a private local installation, reinstall the exact archive or published version first, then reload. The [repository validation record](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md) separates local archive checks from the still-pending public npm version.
