# aimharder-mcp

Ask about your AimHarder classes, workouts, bookings, activity and personal RMs from an AI client. This local [MCP server](https://modelcontextprotocol.io/) also supports confirmed manual booking actions and publication and deletion of your own activity. This is an independent project, neither affiliated with nor endorsed by AimHarder.

**Data limits:** Live checks used one account at one location (9NBC). Other gyms may differ, and an empty result from an incomplete view does not prove absence. Activity audience, deletion permanence and RM effects remain unverified. See [coverage and interpretation](docs/tools.md#coverage-and-interpretation) and [validation evidence](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).

## Get started

1. Install Node.js **24 or newer**.
2. Supply `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` to the server process through your client or a secrets manager. Keep them out of shared configuration. The server assumes `Europe/Madrid` unless you [configure your gym's time zone](docs/configuration.md).
3. Add a local stdio server to your client. This generic JSON example assumes the client passes the required environment variables:

   ```json
   {
     "mcpServers": {
       "aimharder": {
         "command": "npx",
         "args": ["--yes", "aimharder-mcp@0.5.0"]
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

Each write requires a separate confirmation of the exact preview and a user-confirmed gym time zone. The server checks the current account state after each attempted write and never automatically retries an uncertain write.

| Tool | Example question |
| --- | --- |
| `get_account_context` | Which gyms can I query? |
| `get_class_sessions` | What classes are available this week? |
| `prepare_booking_creation` | Preview booking this exact class without reserving it. |
| `execute_booking_creation` | Book the exact preview after one explicit account-holder confirmation. |
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

Personal RM queries show the latest dated record and progression separately. Eligible `%RM` prescriptions for today or later can include calculated loads while preserving the original workout instructions. Search and history coverage are limited; see [tool details](docs/tools.md).

Activity publication starts from a verified gym workout and supports structured block results and manually confirmed actual kilogram loads. EMOM results require completed rounds; AMRAP results can include complete rounds and additional repetitions. Review the selected variant, results, loads and audience settings in the preview before confirming. See [publication inputs](docs/tools.md#prepare_activity_publication).

## Roadmap

Planned capabilities, without committed dates or versions:

- [ ] Expand compatibility to more AimHarder gyms.
- [ ] Explore compatibility with mobile apps.
- [ ] Complete the invitation-only hosted portal for ChatGPT and Hermes ([specification #69](https://github.com/rudeayelo/aimharder-mcp/issues/69)); [authentication feasibility](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-feasibility.md) and the [invited password portal](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-admission.md) are checked locally with synthetic data. An [isolated Cloudflare test environment](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-test-environment.md) is deployed with verified Resend sending configured, under separate authorization without purchases or plan changes. The verified current Workers plan is Free. An owner-supplied Resend token replaces native email without a plan change; the owner confirmed all three email receipts, verified password login and successful password recovery. Ticket #71 acceptance is complete; [Google admission and explicit linking](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-google.md) now have synthetic policy coverage, actual provider setup, owner-reported explicit Google linking/returning login and independent stable-identity/method read-back. The broader hosted specification remains in progress. No production pilot is deployed.

The hosted [MCP authorization runbook](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-mcp-authorization.md) covers maintained OAuth, trusted client provisioning and independent participant revocation. Actual ChatGPT/Hermes journeys remain pending final pilot acceptance.

The hosted [AimHarder connection slice](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-aimharder-connection.md) adds encrypted recoverable credentials, verified gyms and isolated account operations with synthetic public HTTP/SDK and restart/rotation evidence. Owner-managed key custody, isolated upstream connection and controlled rotation/recovery are now verified; remaining hosted features and real-client acceptance are in progress. Verified replacement/password updates and disconnection now preserve portal identity and existing MCP grants while discarding old sessions/preparations; earlier queued actions finish on their original account before a change completes. This does not change the local stdio setup.

## Contributing

The server runs locally over stdio with one account per instance and no persistent storage. The TypeScript API client is separate from the MCP layer; see the [architecture decision](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/adr/2026-09-21-api-client-separated-from-interfaces.md).

Report bugs or propose changes in [GitHub Issues](https://github.com/rudeayelo/aimharder-mcp/issues). Keep credentials and private activity out of reports. See the [development guide](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/development.md) to contribute code.

## License

[MIT](LICENSE).

The hosted [schedule, workout and booking-view queries](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-schedule-queries.md) retain their existing inputs/results, uncertainty and own-account calculated loads for both roles. Automated evidence uses real HTTP MCP and isolated account objects with synthetic upstream responses; actual ChatGPT/Hermes query acceptance remains pending.

The hosted [personal activity and RM queries](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-activity-queries.md) likewise preserve own-account activity, bounded exercise discovery, latest 1RM and separate progression, with explicit partial coverage and unknown units. This is synthetic HTTP/isolation evidence; actual client acceptance remains pending.

The hosted [confirmed booking-creation slice](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-booking-creation.md) preserves the exact preview and one separate confirmation for both roles, with durable single-use coordination and original-account read-back after interruptions. Automated writes use synthetic upstream HTTP; deployment, actual client acceptance and later lifecycle flows remain separate.

The hosted [own-activity publication slice](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-activity-publication.md) adds independent role access controlled by the administrator, current-policy dispatch checks and single-use recovery. It preserves the existing exact preview, source/result/load rules and separate confirmation. Evidence remains synthetic; each real publication needs its own account-holder confirmation.

The [remote cancellation slice](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-booking-cancellation.md) adds pre-existing own reservation cancellation and the separate late-credit-loss confirmation through the same safe coordination.
