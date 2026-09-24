# Connect Claude Desktop

Claude Desktop configures local stdio servers in `mcpServers` JSON. Its [official guide](https://modelcontextprotocol.io/docs/develop/connect-local-servers) uses `npx`. This package has **not been tested** in Claude Desktop.

## Run the published package with `npx`

1. Install Node 24+. Supply `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` to Claude's server process. A GUI app may not inherit your terminal environment; use the [private-file option](#private-file-option) if needed.
2. In Claude Desktop, open **Settings → Developer → Edit Config**. The file is normally `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows.
3. Add the `aimharder` entry under `mcpServers`, preserving any other servers already present:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "npx",
         "args": ["--yes", "aimharder-mcp@0.1.1"]
       }
     }
   }
   ```

4. Fully restart Claude Desktop, check that the tools appear, and ask an AimHarder question. The first valid tool call authenticates. `get_account_context` with `{}` can show the gym and zone; unmapped gyms assume `Europe/Madrid`.

The `npx` command needs a published package. The server does not load `.env` automatically. See [configuration](../configuration.md) for optional gym settings.

## Private-file option

If Claude does not receive your credentials, follow the [private-file setup](../configuration.md#private-file-and-local-installation) and point it at the installed server:

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

Replace the paths and restart Claude. On Windows, escape backslashes in JSON or use forward slashes. The private file holds the credentials; Claude's config holds only its path.

Claude web connectors use a separate remote-server setup; these steps are for local stdio.
