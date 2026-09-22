# ADR: npm distribution as the final MVP milestone

Status: accepted by the user on 2026-09-22; implementation and publication pending.

## Context

Repository setup requires a checkout and a local build. The user approved two distribution tickets to make the local MCP server installable and to publish it on npm when the complete MVP passes acceptance.

## Decision

Include public npm distribution in MVP acceptance. Prefer the unscoped name `aimharder-mcp`; confirm publishability and the publishing account before release. An npm registry lookup returned E404 on 2026-09-22, which establishes no current package record, not a reservation or guaranteed publication rights.

[Issue #11](https://github.com/rudeayelo/aimharder-mcp/issues/11) delivers a compiled, installable package verified outside the checkout through an MCP client or harness, including account/gym discovery. It can start immediately because account/gym discovery is complete. [Issue #12](https://github.com/rudeayelo/aimharder-mcp/issues/12) publishes and verifies the public registry artifact after #11 and the terminal functional branches #6, #7, #9, and #10. Native blocking relationships are recorded in GitHub.

This supersedes only the repository-only distribution decision in [the MVP ADR](2026-09-21-local-typescript-mcp-mvp.md) and [the runtime ADR](2026-09-21-account-discovery-and-local-runtime.md). The [public repository and MIT license decision](2026-09-21-public-repository-and-mit-license.md) remains valid. The server remains local, read-only, and configured for one account per instance.

## Consequences

Package acceptance includes an explicitly limited archive, compiled execution without development tools, clean MCP stdout, environment-based credentials, automated packaged-install coverage, and a separate live read-only check. Release acceptance also requires full MVP evidence and verification of the exact version downloaded from npm. Document version-pinned startup and the release procedure.

The approved work adds packaging and release maintenance. Current source-based setup remains valid until implementation; the current private package configuration does not represent a published npm package. This planning delivery creates tickets and updates documentation, without implementing or publishing the package.
