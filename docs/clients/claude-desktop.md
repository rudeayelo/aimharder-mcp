# Connect Claude Desktop

Claude Desktop supports local stdio servers through a `mcpServers` JSON configuration. The [official local-server guide](https://modelcontextprotocol.io/docs/develop/connect-local-servers) uses `npx` as its command. This repository has not yet recorded an end-to-end Claude Desktop check with this package. The first npm version, `aimharder-mcp@0.1.0`, is not yet published.

## Run the published package with `npx`

1. Install Node 24 or newer. Arrange for the server process launched by Claude Desktop to receive `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD`. Do not assume a GUI launch inherits variables from your terminal. If your setup cannot supply them without putting literal credentials in Claude's JSON file, use the [private-file option](#private-file-option) below.
2. In Claude Desktop, open **Settings → Developer → Edit Config**. The file is normally `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows.
3. Add the `aimharder` entry under `mcpServers`, preserving any other servers already present:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "npx",
         "args": ["--yes", "aimharder-mcp@0.1.0"]
       }
     }
   }
   ```

4. Fully quit and restart Claude Desktop. Check that the server's tools appear, then ask an AimHarder question. A valid tool call authenticates on first use; tool listing alone does not. You can optionally call `get_account_context` with `{}` to inspect the gym and zone provenance. Unmapped gyms use an assumed `Europe/Madrid` zone; configure the actual IANA zone if that assumption is wrong.

The `npx` command is usable only after `0.1.0` is published and verified on npm. The server does not load `.env` files automatically. See [shared configuration](../configuration.md) for the optional gym-zone and default-gym variables.

## Private-file option

If Claude Desktop does not receive your credentials through its process environment, follow the [private-file and local-installation instructions](../configuration.md#private-file-and-local-installation). This keeps password values out of Claude's JSON configuration. Point Claude at the installed server with:

```json
{
  "mcpServers": {
    "aimharder": {
      "command": "/absolute/path/to/node/bin/node",
      "args": [
        "--env-file=/absolute/path/to/private.env",
        "/absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js"
      ]
    }
  }
}
```

Replace the example paths with real absolute paths. Windows paths in JSON need escaped backslashes or forward slashes. The private file holds the required environment variables; only its path appears in Claude's configuration. Restart Claude Desktop after changing the entry.

Claude's web custom connectors use a different remote-server setup. This guide is for the local desktop application and the project's stdio transport.
