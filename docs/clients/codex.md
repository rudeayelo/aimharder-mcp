# Connect Codex CLI

Codex configures local stdio servers in `~/.codex/config.toml`. Its [MCP guide](https://developers.openai.com/codex/mcp) describes the configuration shared by the CLI and IDE extension. The published package authenticated a read-only account query in Codex CLI; see [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md). A connection in the Codex desktop app has not been separately checked.

Install [Node 24+ and configure credentials](../configuration.md). Keep secret values out of `config.toml`.

## Add the pinned package

If Codex receives the required environment variables from your local environment, add:

```toml
[mcp_servers.aimharder]
command = "npx"
args = ["--yes", "aimharder-mcp@0.2.0"]
env_vars = ["AIMHARDER_USERNAME", "AIMHARDER_PASSWORD"]
```

You can instead run `codex mcp add aimharder -- npx --yes aimharder-mcp@0.2.0`, then add the `env_vars` line to the created table. Also forward `AIMHARDER_GYM_TIME_ZONES` or `AIMHARDER_DEFAULT_GYM` if configured. Restart Codex after editing the configuration.

## Private-file option

If Codex does not receive those variables, use a [private environment file](../configuration.md#private-file-and-local-installation). This still runs the pinned package through `npx` while Node loads the private file:

```toml
[mcp_servers.aimharder]
command = "/absolute/path/to/node"
args = [
  "--env-file=/absolute/path/to/private.env",
  "/absolute/path/to/npm/bin/npx-cli.js",
  "--yes",
  "--prefix=/absolute/path/to/empty-npx-directory",
  "aimharder-mcp@0.2.0",
]
```

Create the empty directory first. The prefix makes `npx` resolve the public version even when Codex starts inside a checkout of `aimharder-mcp`. Find the npm CLI bundled with your Node installation; the path is installation-specific. Keep both the private file and empty directory outside the repository.

Run `codex mcp get aimharder` to inspect the saved command. In a new Codex session, call `get_account_context` with `{}` to authenticate and inspect the gym and zone. Tool listing alone does not authenticate. The server is local and read-only.
