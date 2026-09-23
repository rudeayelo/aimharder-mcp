# ADR: npm distribution as the final MVP milestone

Status: accepted by the user on 2026-09-22; local package implementation and verification complete; registry publication pending.

## Context

Repository setup requires a checkout and a local build. The user approved two distribution tickets to make the local MCP server installable and to publish it on npm when the complete MVP passes acceptance.

## Decision

Include public npm distribution in MVP acceptance. Prefer the unscoped name `aimharder-mcp`; confirm publishability and the publishing account before release. An npm registry lookup returned E404 on 2026-09-22, which establishes no current package record, not a reservation or guaranteed publication rights.

[Issue #11](https://github.com/rudeayelo/aimharder-mcp/issues/11) delivers a compiled, installable package verified outside the checkout through an MCP client or harness, including account/gym discovery. It can start immediately because account/gym discovery is complete. [Issue #12](https://github.com/rudeayelo/aimharder-mcp/issues/12) publishes and verifies the public registry artifact after #11 and the terminal functional branches #6, #7, #9, and #10. Native blocking relationships are recorded in GitHub. On 2026-09-23 the user approved a separate [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13) functional acceptance gate before #12, transferring the unverified future-workout live check from closed implementation #6. QA closure requires the evidence, not merely closed implementation tickets. #12 retains publication and exact registry-version verification; full MVP closure requires both tickets.

This supersedes only the repository-only distribution decision in [the MVP ADR](2026-09-21-local-typescript-mcp-mvp.md) and [the runtime ADR](2026-09-21-account-discovery-and-local-runtime.md). The [public repository and MIT license decision](2026-09-21-public-repository-and-mit-license.md) remains valid. The server remains local, read-only, and configured for one account per instance.

## Consequences

Package acceptance includes an explicitly limited archive, compiled execution without development tools, clean MCP stdout, environment-based credentials, automated packaged-install coverage, and a separate live read-only check. Release acceptance also requires full MVP evidence and verification of the exact version downloaded from npm. Document version-pinned startup and the release procedure.

The approved work adds packaging and release maintenance. Source-based setup remains valid for contributors. Issue #11 now provides a `dist/index.js` executable under the `aimharder-mcp` bin name, a Node 24 engine requirement, and a `prepack` build. Consumers install compiled archives with production dependencies and no compilation. The explicit allowlist contains only compiled JavaScript and public Markdown documentation/metadata. Source files, evidence, environment files, tests, scripts and archives are excluded. Package metadata is publishable but no version has been published.

The automated packaging check installs in a temporary directory outside the checkout, disables install scripts, verifies absence of development tools, and resolves both server and SDK harness dependencies from the isolated installation. An HTTP fixture preload in the child intercepts every fetch; no fixture changes or upstream override are shipped in the runtime. A separate opt-in live check verified installed-package account/gym discovery on 2026-09-22. See [validation](../validation.md). This changes distribution and validation mechanics, not authentication, API contracts, or feature scope.
