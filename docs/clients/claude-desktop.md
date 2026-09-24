# Connect Claude Desktop

Claude Desktop supports local stdio servers through a `mcpServers` JSON configuration. See the [official local-server guide](https://modelcontextprotocol.io/docs/develop/connect-local-servers). This repository has not yet recorded an end-to-end Claude Desktop check with this package. The first npm version, `aimharder-mcp@0.1.0`, is not yet published.

## Install and configure

1. Install Node 24 and follow the [private-file and local-installation instructions](../configuration.md#private-file-and-local-installation). This lets Claude start the server without storing password values in its JSON configuration.
2. In Claude Desktop, open **Settings → Developer → Edit Config**. The file is normally `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows.
3. Add the `aimharder` entry under `mcpServers`, preserving any other servers already present:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "/absolute/path/to/node24/bin/node",
         "args": [
           "--env-file=/absolute/path/to/private.env",
           "/absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js"
         ]
       }
     }
   }
   ```

   Replace every example path with a real absolute path on your computer. Windows paths in JSON need escaped backslashes or forward slashes. The private file holds `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD`; its path, not its contents, appears in this config.
4. Fully quit and restart Claude Desktop. Check that the server's tools appear, then ask Claude to call `get_account_context` with `{}`. Tool listing alone does not authenticate. Add a confirmed `AIMHARDER_GYM_TIME_ZONES` mapping to the private file and restart before making date queries.

Claude's web custom connectors use a different remote-server setup. This guide is for the local desktop application and the project's stdio transport.
