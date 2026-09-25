# aimharder-mcp

Ask about your AimHarder classes, workouts, bookings and activity from an AI client. This is a local, read-only [MCP server](https://modelcontextprotocol.io/) and an independent project, neither affiliated with nor endorsed by AimHarder. The checkout also supports read-only booking creation previews; the published package does not yet include them.

**Data limits:** Live checks used one account at one location (9NBC). Other gyms may differ. Workout and booking views can be incomplete, so an empty result may not mean there is nothing to show. [Details](docs/tools.md#coverage-and-interpretation)

## Get started

1. Install Node.js **24 or newer**.
2. Supply `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` to the server process through your client or a secrets manager. Keep them out of shared configuration. The server assumes `Europe/Madrid` unless you [configure your gym's time zone](docs/configuration.md).
3. Add a local stdio server to your client. This generic JSON example assumes the client passes the required environment variables:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "npx",
         "args": ["--yes", "aimharder-mcp@0.1.2"]
       }
     }
   }
   ```

4. Ask your client an AimHarder question, such as “What is tomorrow's WOD?” The first valid tool call signs in. See the guide for your client below for its configuration format and credential options.

## Desktop and CLI clients

- [ChatGPT desktop](docs/clients/chatgpt-desktop.md)
- [Codex](docs/clients/codex.md)
- [Claude Desktop](docs/clients/claude-desktop.md)
- [Hermes](docs/clients/hermes.md)
- [OpenClaw](docs/clients/openclaw.md)

Hermes and Codex CLI have called the account tool through the published package. The ChatGPT desktop STDIO form has been observed; package connections in ChatGPT desktop, Claude Desktop and OpenClaw have not been verified. Mobile apps are outside the current setup guides.

## Tools

| Tool | Example question |
| --- | --- |
| `get_account_context` | Which gyms can I query? |
| `get_class_sessions` | What classes are available this week? |
| `prepare_booking_creation` (checkout) | Preview booking this exact class without reserving it. |
| `get_published_workouts` | What is tomorrow's WOD? |
| `get_upcoming_bookings` | When am I booked? |
| `get_booking_history` | Which past bookings are available? |
| `get_personal_activity` | What activity did I record this month? |

Clients can combine tools for questions about workouts and bookings, or count recent **activity entries**. An activity entry does not establish attendance or one distinct training session. See [tool inputs and coverage](docs/tools.md).

## Roadmap

Planned capabilities, without committed dates or versions:

- [ ] Create and cancel bookings. Read-only creation preparation is available in the checkout.
- [ ] Look up personal exercise RMs and show calculated loads alongside the original `%RM` prescription in future activities.
- [ ] Record activity results.
- [ ] Expand compatibility to more AimHarder gyms.
- [ ] Explore compatibility with mobile apps.

## Contributing

Report bugs or propose changes in [GitHub Issues](https://github.com/rudeayelo/aimharder-mcp/issues). Keep credentials and private activity out of reports. See the [development guide](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/development.md) to contribute code.

## License

[MIT](LICENSE).
