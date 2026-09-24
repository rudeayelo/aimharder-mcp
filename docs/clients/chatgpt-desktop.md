# Connect ChatGPT desktop through local STDIO

This guide applies to a ChatGPT desktop build that offers **Connect to a custom MCP → Type: STDIO**, with fields for a launch command, arguments, environment variable passthrough and a working directory. That form was observed on 2026-09-24, but an end-to-end connection to this package has **not yet been verified**. It is different from the remote MCP setup described in some [OpenAI developer documentation](https://developers.openai.com/plugins/deploy/connect-chatgpt). If your app has no local STDIO option, these steps do not apply.

The first npm version, `aimharder-mcp@0.1.0`, has not yet been published. Prepare [Node 24 or newer and your account environment](../configuration.md) first.

## Add the server

1. If your desktop build offers **Settings → Plugins → MCPs**, choose **Add server** to open **Connect to a custom MCP**. Set **Name** to `aimharder` and **Type** to **STDIO**.
2. Set **Command to launch** to `npx`.
3. Add two separate **Arguments**: `--yes` and `aimharder-mcp@0.1.0`, in that order.
4. Under **Environment variable passthrough**, add `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` as names, with no values. They must already be available to the desktop app through your own environment or secrets manager. If you configure a gym zone override, also pass `AIMHARDER_GYM_TIME_ZONES`; pass `AIMHARDER_DEFAULT_GYM` only when configured. Do not paste credential values into the form's **Environment variables** key/value fields.
5. Leave **Working directory** empty unless your desktop build requires one. Save the server.

Availability of the passthrough variables depends on how the desktop app was launched. If it cannot receive them, use the [private-file and local-installation approach](../configuration.md#private-file-and-local-installation) instead: set **Command to launch** to the absolute Node executable and add `--env-file=/absolute/path/to/private.env` and `/absolute/path/to/installation/node_modules/aimharder-mcp/dist/index.js` as separate arguments. This keeps credential values out of the app's MCP form.

## Check the connection

After the version is published, confirm that the app lists the six [AimHarder tools](../tools.md), then ask it to call `get_account_context` with `{}`. Tool discovery alone does not authenticate. Check the returned zone provenance before interpreting date queries; unmapped gyms use an assumed `Europe/Madrid` zone. Do not claim this client integration is verified until a real installed-package call succeeds and the result is compared with AimHarder.
