# Connect ChatGPT desktop through local STDIO

Use this guide if your ChatGPT desktop app offers **Connect to a custom MCP → Type: STDIO**. The user observed this form on 2026-09-24; a connection with this package has **not been tested**. If the local STDIO option is absent, see your app's [remote MCP documentation](https://developers.openai.com/plugins/deploy/connect-chatgpt).

First set up [Node 24+ and your account environment](../configuration.md).

## Add the server

1. Open **Settings → Plugins → MCPs → Add server**. Set **Name** to `aimharder` and **Type** to **STDIO**.
2. Set **Command to launch** to `npx`.
3. Add two separate **Arguments**: `--yes` and `aimharder-mcp@0.1.2`, in that order.
4. Under **Environment variable passthrough**, add the names `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD`. The app must already receive their values. Also pass `AIMHARDER_GYM_TIME_ZONES` or `AIMHARDER_DEFAULT_GYM` if configured. Keep credential values out of the form's **Environment variables** fields.
5. Leave **Working directory** empty unless your desktop build requires one. Save the server.

If the app cannot receive those variables, use the [private-file setup](../configuration.md#private-file-and-local-installation): launch the absolute Node executable with `--env-file=/absolute/path/to/private.env` and `/absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js` as separate arguments.

## Check the connection

Check that the [tools](../tools.md) appear and ask an AimHarder question. Tool discovery does not authenticate; the first valid call does. `get_account_context` with `{}` is an optional way to check the gym and assumed or configured zone. The package connection remains unverified in this client.
