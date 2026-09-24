# aimharder-mcp

A local, read-only [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for your AimHarder account. Ask a compatible desktop client about class schedules, published workouts, bookings, and your recorded activity. This is an independent project, neither affiliated with nor endorsed by AimHarder.

**Release status:** `aimharder-mcp@0.1.0` has **not yet been published to npm**. The version-pinned commands below become usable after publication and verification of that version. A [local archive has been tested](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md); that is not a registry release.

> **Compatibility and data limits:** Live behavior has been checked with one account at 9NBC. Other AimHarder gyms may use different data or response formats. Published workouts come from a limited feed view, upcoming bookings have no verified future-date horizon, and booking history has no verified complete-history horizon. An empty result may therefore be less conclusive than it looks. Check important details in AimHarder, especially before acting on a schedule or booking. [How to interpret results](docs/tools.md#coverage-and-interpretation)

## Get started

1. Install **Node.js 24 or newer** on the computer that will run the MCP server. This package supports Node `>=24`.
2. Arrange for that desktop client to receive `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` from its process environment or a secrets manager. Do not paste credentials into a shared config file. The server assumes `Europe/Madrid` for gyms without a configured time zone; check the assumption before relying on date-based answers. See [configuration](docs/configuration.md).
3. Add a local **stdio** MCP server to your client. A generic client configuration looks like this when its process already receives the required environment variables:

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

   Client configuration formats and environment handling differ; use the matching guide below. The server does not read `.env` files automatically.
4. Ask your client an AimHarder question, such as “What is tomorrow's WOD?” The first valid tool call authenticates with AimHarder. To inspect your gym ID or the assumed time zone, optionally call `get_account_context` with `{}`; configure the gym's actual IANA zone if `Europe/Madrid` is wrong.

If you prefer a private environment file or a local install, follow [the complete configuration guide](docs/configuration.md#private-file-and-local-installation). The desktop client launches the server locally; no hosted project service or project-specific API key is required.

## Desktop clients

These guides are for desktop or locally running clients. Mobile-app compatibility has not been investigated for this release.

| Client | Setup guide | Verification with this package |
| --- | --- | --- |
| ChatGPT desktop with a local STDIO option | [ChatGPT desktop](docs/clients/chatgpt-desktop.md) | STDIO setup form observed; package connection not yet checked. |
| Claude Desktop | [Claude Desktop](docs/clients/claude-desktop.md) | Setup documented from the client guide; package connection not yet checked. |
| Hermes | [Hermes](docs/clients/hermes.md) | Locally installed package initialized, listed six tools, and answered a future-WOD question; see [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md). |
| OpenClaw | [OpenClaw](docs/clients/openclaw.md) | Setup documented from the client guide; package connection not yet checked. |

The [generic JSON example](#get-started) is illustrative: copy a client's own schema and secret-passing rules rather than assuming all clients accept the same object.

## Tools and example questions

The server exposes a set of MCP tools. Class names and workout instructions retain AimHarder's source language; the client can explain them in yours. [Inputs, outputs, and coverage details](docs/tools.md)

| Tool | What it helps answer |
| --- | --- |
| `get_account_context` | “Which of my gyms can I query?” and “Which gym is selected?” |
| `get_class_sessions` | “What classes are available this week?” and “How many places are occupied in Wednesday's 07:00 Metcon?” |
| `get_published_workouts` | “What is the WOD for tomorrow?” and “What exercises are in each published level?” |
| `get_upcoming_bookings` | “What upcoming bookings can AimHarder show for me?” |
| `get_booking_history` | “What booking history is currently available?” |
| `get_personal_activity` | “What did I record in this date range?” |

A client can combine these tools to answer “What is tomorrow's WOD, and when am I booked?” or query successive activity ranges for the last five **activity entries** and a previous-month entry count. An activity entry is a record, not proof of class attendance or one distinct physical training session. Several entries on one day count separately. [Examples and boundaries](docs/tools.md#questions-that-combine-tools)

## Roadmap

These are proposed future capabilities, not features of the current read-only server. There are no committed dates or versions; issues will be linked when available.

- [ ] Create and cancel bookings.
- [ ] Look up personal exercise RMs and show calculated loads alongside the original `%RM` prescription in future activities.
- [ ] Record activity results.
- [ ] Expand compatibility to more AimHarder gyms.
- [ ] Explore compatibility with mobile apps.

## Contributing

Bug reports and contributions are welcome in [GitHub Issues](https://github.com/rudeayelo/aimharder-mcp/issues). Please describe the affected gym or client without posting passwords, cookies, private activity, or other people's data. The [MVP specification](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/mvp.md), [validation record](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md), and [development guide](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/development.md) are available in the repository.

## License

[MIT](LICENSE).
