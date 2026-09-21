# aimharder-mcp

A local MCP server for querying AimHarder from clients that support Model Context Protocol. An independent project, neither affiliated with nor endorsed by AimHarder.

**Status: MVP definition and initial documentation.** There is no implementation, executable MCP tooling, or verified integration testing yet. The project is not ready to install or connect to a client.

## Planned MVP

- Query classes by date, including available schedules, occupancy, and capacity.
- Retrieve published workout details, including future workouts shared by several class sessions.
- Query upcoming bookings and available booking history.
- Query personal activity by date, with a maximum of 31 consecutive calendar dates per request and clear notices for partial results.
- Summarize recent training and activity counts using verified grouping and coverage.

The agreed design uses TypeScript, one account per instance, and an API client separate from the MCP layer. Queries fetch current data, with an in-memory session and no database or persistent cache.

Creating or canceling bookings, automation, per-exercise analysis, a UI, and a remote service are outside the MVP scope.

The first planned functional delivery answers "What are we doing in tomorrow's WOD, and when am I booked?", combining published workout content, class sessions, and upcoming bookings. Personal activity and booking history follow within the same MVP.

## Configuration and security

Installation and startup commands, environment variables, and MCP tools will be defined during implementation. The design calls for credentials supplied through environment variables, optionally injected by a secrets manager.

The observed API has no verified public contract. Authentication, domains, states, and pagination need validation. Initial samples are not integration tests performed by this project.

Local evidence, credentials, cookies, tokens, and personal data are excluded from the repository. Future tests will use anonymized samples.

## Documentation

- [Domain glossary](CONTEXT.md).
- [Scope, acceptance criteria, and implementation tickets](docs/mvp.md).
- [MVP specification](https://github.com/rudeayelo/aimharder-mcp/issues/1).
- [API research and validation gaps](docs/api-research.md).
- [MVP decision](docs/adr/2026-09-21-local-typescript-mcp-mvp.md).
- [API client separation](docs/adr/2026-09-21-api-client-separated-from-interfaces.md).
- [Credentials and read-only operations](docs/adr/2026-09-21-credential-security-and-read-only-access.md).
- [Public repository and license](docs/adr/2026-09-21-public-repository-and-mit-license.md).
- [Agent instructions](AGENTS.md).

All project content is maintained in English.

## License

[MIT](LICENSE).
