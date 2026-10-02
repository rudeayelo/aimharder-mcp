# aimharder-mcp

Ask about your AimHarder classes, workouts, bookings and activity from an AI client. This local [MCP server](https://modelcontextprotocol.io/) supports confirmed manual booking actions and own activity publication and deletion. One standard booking cycle and a structured activity publication were verified at 9NBC. A confirmed deletion was followed by observed calendar absence; its response meaning, permanence and RM effects remain uncertain. This is an independent project, neither affiliated with nor endorsed by AimHarder.

**Data limits:** Live checks used one account at one location (9NBC). Other gyms may differ. Workout and booking views can be incomplete, so an empty result may not mean there is nothing to show. [Details](docs/tools.md#coverage-and-interpretation)

## Get started

Publication accepts explicit actual kilograms in a verified Copy kilogram field even when its original weight is empty. EMOM blocks require explicit completed rounds; AMRAP results can include both complete rounds and additional repetitions. The selected variant's results and loads are sent in active payload fields and verified through a fresh own calendar/detail read. A separately confirmed live execution returned `confirmed` with matching scores and all submitted loads. The earlier `0.4.1` package lacks these fixes. See [validation](docs/validation.md#confirmed-publication-with-additional-amrap-repetitions-2026-10-02) for the observed source and remaining limits.

1. Install Node.js **24 or newer**.
2. Supply `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` to the server process through your client or a secrets manager. Keep them out of shared configuration. The server assumes `Europe/Madrid` unless you [configure your gym's time zone](docs/configuration.md).
3. Add a local stdio server to your client. This generic JSON example assumes the client passes the required environment variables:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "npx",
         "args": ["--yes", "aimharder-mcp@0.4.2"]
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

Version `0.4.0` includes the activity publication and deletion tools below. Each write requires a separate confirmation of the exact preview.

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
| `prepare_activity_publication` | Preview publishing results from this verified gym workout. |
| `execute_activity_publication` | Publish that exact preview after separate confirmation and check the own read-back. |
| `prepare_activity_deletion` | Preview deleting this exact own activity entry. |
| `execute_activity_deletion` | Delete that exact entry after separate confirmation and report fresh account observations. |

Clients can combine tools for questions about workouts and bookings, or count recent **activity entries**. An activity entry does not establish attendance or one distinct training session. See [tool inputs and coverage](docs/tools.md).

Version `0.3.0` adds source exercise IDs, known-ID and name-based own-account 1RM queries, separate RM progression, and calculated loads for eligible `%RM` prescriptions dated today or later in the gym's reported zone. Original instructions and all publication/variant alternatives remain visible. Search and personal history coverage are limited. Live source comparison passed for search, progression and a calculated load in the 28 September WOD. That WOD's split variant rows lacked valid source exercise IDs, so their original percentages remained visible with unavailable calculation status; split arithmetic remains fixture-verified only. See [validation](docs/validation.md#personal-rm-follow-up-2026-09-27-issues-3538) for the evidence limits.

Version `0.4.0` includes `prepare_activity_publication` and a confirmation-gated `execute_activity_publication` for supported structured block results and manually confirmed actual kilogram loads from a current-view gym workout. It also includes `prepare_activity_deletion` and `execute_activity_deletion`: preparation verifies an exact own entry through the account calendar and detail; execution requires separate confirmation, rechecks the target, attempts at most one DELETE, and reports a fresh account view. A read-only publication draft can show historical kilogram suggestions before the account holder chooses an actual load; it cannot be executed. Preparation reads the independently configured account audience. Publication execution rechecks the audience, source, suggestion and exact Copy payload, sends at most one activity POST, then reads the own calendar and detail before reporting confirmation or uncertainty. An [MCP client journey test](tests/activity-journey.test.ts) covers both actions against anonymized upstream fixtures. Two individually confirmed publication attempts were rejected on 2026-10-01, and an accepted attempt on 2026-10-02 had conflicting content. One separately confirmed DELETE on 2026-10-02 was followed by complete calendar reads showing the target absent and the earlier own entry retained; its transport/response stayed uncertain. A fourth separately confirmed POST preserved both scores and all three actual loads. Its original execution reported a formatting conflict; after a comparator correction, a fresh independent read matched the same entry without another POST. A fifth separately confirmed execution from the corrected checkout returned `confirmed` with a matched fresh own calendar/detail read, including both completed-round results, additional AMRAP repetitions and all actual loads; the gym source was independently reverified by the execution path. Effective audience, deletion permanence and RM effects remain unverified. Configure a user-confirmed gym zone and review each complete preview before providing separate confirmation. The fixture journey does not establish a real write outcome.

## Roadmap

Planned capabilities, without committed dates or versions:

- [ ] Compare a calculable split `%RM` source example against the MCP when one becomes available; the current release decision accepts fixture-only evidence for that arithmetic path.
- [ ] [Validate own activity results](docs/activity-results-spec.md) ([specified in #42](https://github.com/rudeayelo/aimharder-mcp/issues/42); source implementation and fixture journey complete, broader live contracts pending).
- [ ] Expand compatibility to more AimHarder gyms.
- [ ] Explore compatibility with mobile apps.

## Contributing

Report bugs or propose changes in [GitHub Issues](https://github.com/rudeayelo/aimharder-mcp/issues). Keep credentials and private activity out of reports. See the [development guide](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/development.md) to contribute code.

## License

[MIT](LICENSE).
