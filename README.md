# aimharder-mcp

Ask about your AimHarder classes, workouts, bookings and activity from an AI client. Version `0.3.0` is a local [MCP server](https://modelcontextprotocol.io/) that also supports manual booking creation and cancellation, with a separate confirmation if a late cancellation may lose a credit. One standard Open Box creation/cancellation cycle was observed live at 9NBC; the late branch, other gyms and credit effects remain unverified. This is an independent project, neither affiliated with nor endorsed by AimHarder.

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
         "args": ["--yes", "aimharder-mcp@0.3.0"]
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
| `prepare_booking_creation` | Preview booking this exact class without reserving it. |
| `execute_booking_creation` | Book the exact preview after explicit account-holder confirmation. |
| `prepare_booking_cancellation` | Preview cancelling one existing booking without changing it. |
| `execute_booking_cancellation` | Cancel the exact preview after explicit account-holder confirmation. |
| `execute_late_booking_cancellation` | After a warning, attempt late cancellation only with separate confirmation of possible credit loss. |
| `get_published_workouts` | What is tomorrow's WOD? |
| `get_exercise_1rm` | What is my latest 1RM for this source exercise ID? |
| `find_exercise_1rm` | Which exercise by this name has my latest 1RM? |
| `get_exercise_rm_progression` | How have my RMs for this source exercise progressed? |
| `get_upcoming_bookings` | When am I booked? |
| `get_booking_history` | Which past bookings are available? |
| `get_personal_activity` | What activity did I record this month? |
| `prepare_activity_deletion` | Preview deleting this exact own activity entry. |
| `execute_activity_deletion` | Delete that exact entry after separate confirmation and report fresh account observations. |

Clients can combine tools for questions about workouts and bookings, or count recent **activity entries**. An activity entry does not establish attendance or one distinct training session. See [tool inputs and coverage](docs/tools.md).

Version `0.3.0` adds source exercise IDs, known-ID and name-based own-account 1RM queries, separate RM progression, and calculated loads for eligible `%RM` prescriptions dated today or later in the gym's reported zone. Original instructions and all publication/variant alternatives remain visible. Search and personal history coverage are limited. Live source comparison passed for search, progression and a calculated load in the 28 September WOD. That WOD's split variant rows lacked valid source exercise IDs, so their original percentages remained visible with unavailable calculation status; split arithmetic remains fixture-verified only. See [validation](docs/validation.md#personal-rm-follow-up-2026-09-27-issues-35-38) for the evidence limits.

The source checkout includes `prepare_activity_publication` and a confirmation-gated `execute_activity_publication` for supported structured block results and manually confirmed actual kilogram loads from a current-view gym workout. It also includes `prepare_activity_deletion` and `execute_activity_deletion`: preparation verifies an exact own entry through the account calendar and detail; execution requires separate confirmation, rechecks the target, attempts at most one DELETE, and reports a fresh account view. A read-only publication draft can show historical kilogram suggestions before the account holder chooses an actual load; it cannot be executed. Preparation reads the independently configured account audience. Publication execution rechecks the audience, source, suggestion and exact Copy payload, sends at most one activity POST, then reads the own calendar and detail before reporting confirmation or uncertainty. No live publication or deletion has been performed for this checkout, and these changes are not part of the published `0.3.0` package.

## Roadmap

Planned capabilities, without committed dates or versions:

- [ ] Compare a calculable split `%RM` source example against the MCP when one becomes available; the current release decision accepts fixture-only evidence for that arithmetic path.
- [ ] [Record activity results](docs/activity-results-spec.md) ([specified in #42](https://github.com/rudeayelo/aimharder-mcp/issues/42); implementation pending).
- [ ] Expand compatibility to more AimHarder gyms.
- [ ] Explore compatibility with mobile apps.

## Contributing

Report bugs or propose changes in [GitHub Issues](https://github.com/rudeayelo/aimharder-mcp/issues). Keep credentials and private activity out of reports. See the [development guide](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/development.md) to contribute code.

## License

[MIT](LICENSE).
