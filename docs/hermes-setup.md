# Connect an installed package to Hermes

Install the local archive outside the source checkout using the [README instructions](../README.md#install-a-local-archive). No registry version is published yet. Use Node 24 and production dependencies with install scripts disabled.

Store the AimHarder environment file separately from the checkout and Hermes configuration, for example at `~/.config/aimharder-mcp/.env`. For a regular file, restrict its permissions to `600` and its parent directory to `700`. A secrets-manager mount is another option. Configure the variables described in the [README](../README.md#configure-and-connect); do not place credential values in YAML. Date queries also require the discovered gym ID and its user-confirmed IANA time zone.

Add the following entry under the existing `mcp_servers` mapping in the selected Hermes profile's `config.yaml`. Replace all illustrative paths with absolute local paths. Preserve other servers and settings.

```yaml
mcp_servers:
  aimharder:
    command: /absolute/path/to/node24
    args:
      - --env-file=/absolute/path/to/private.env
      - /absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js
    enabled: true
    timeout: 300
    connect_timeout: 30
```

Keep the entry disabled until the environment file is available. In the selected profile, use `hermes mcp test aimharder` to verify initialization and tool discovery. This does not authenticate with AimHarder. Reload MCP connections in Hermes with `/reload-mcp`, then ask it to call `get_account_context` to verify live account access. Do not interpret successful discovery as successful authentication or complete functional acceptance.

To select a named profile explicitly, use `hermes -p <profile> mcp test aimharder`. A 1Password-mounted environment can require desktop authorization when a new process loads it; complete that prompt if it appears. The mount is managed by 1Password and is not an ordinary plaintext credentials file. This setup uses the existing environment-file startup mechanism and does not require a secrets-manager dependency in the server package.

Hermes references: [MCP configuration](https://hermes-agent.nousresearch.com/docs/reference/mcp-config-reference) and [connecting and reloading servers](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp).

## Update an existing local installation

`/reload-mcp` restarts the configured installed server; it does not rebuild the checkout or reinstall an archive. After source changes, build and pack the project, then explicitly reinstall the new archive in the installation directory:

```sh
# In the source checkout, with Node 24 on PATH:
pnpm build
npm pack --ignore-scripts --pack-destination /absolute/path/to/installation
# In the installation directory:
npm install --ignore-scripts --omit=dev ./aimharder-mcp-0.1.0.tgz
```

Use the archive filename for the current package version. Verify the installed build before running `/reload-mcp` in Hermes. The environment file and client configuration do not need to change when the entry-point path stays the same.
