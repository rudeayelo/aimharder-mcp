# ADR: npm distribution as the final MVP milestone

Status: accepted by the user on 2026-09-22; functional QA accepted and public npm distribution verified on 2026-09-24.

## Context

Repository setup requires a checkout and a local build. The user approved two distribution tickets to make the local MCP server installable and to publish it on npm when the complete MVP passes acceptance.

## Decision

Include public npm distribution in MVP acceptance. Prefer the unscoped name `aimharder-mcp`; confirm publishability and the publishing account before release. An npm registry lookup returned E404 on 2026-09-22, which establishes no current package record, not a reservation or guaranteed publication rights.

[Issue #11](https://github.com/rudeayelo/aimharder-mcp/issues/11) delivers a compiled, installable package verified outside the checkout through an MCP client or harness, including account/gym discovery. It can start immediately because account/gym discovery is complete. [Issue #12](https://github.com/rudeayelo/aimharder-mcp/issues/12) publishes and verifies the public registry artifact after #11 and the terminal functional branches #6, #7, #9, and #10. Native blocking relationships are recorded in GitHub. On 2026-09-23 the user approved a separate [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13) functional acceptance gate before #12, transferring the unverified future-workout live check from closed implementation #6. QA closure requires the evidence, not merely closed implementation tickets. #12 retains publication and exact registry-version verification; full MVP closure requires both tickets.

On 2026-09-24 the user accepted the aggregated manual Hermes and independent live evidence for the first release in place of #13's exact single-run future-content harness criterion; see the [functional QA evidence decision](2026-09-24-functional-qa-evidence-for-first-release.md). The original run remains unperformed and is not reported as passed.

This supersedes only the repository-only distribution decision in [the MVP ADR](2026-09-21-local-typescript-mcp-mvp.md) and [the runtime ADR](2026-09-21-account-discovery-and-local-runtime.md). The [public repository and MIT license decision](2026-09-21-public-repository-and-mit-license.md) remains valid. The server remains local, read-only, and configured for one account per instance.

## Consequences

Package acceptance includes an explicitly limited archive, compiled execution without development tools, clean MCP stdout, environment-based credentials, automated packaged-install coverage, and a separate live read-only check. Release acceptance also requires full MVP evidence and verification of the exact version downloaded from npm. Document version-pinned startup and the release procedure.

The approved work adds packaging and release maintenance. Source-based setup remains valid for contributors. Issue #11 provides a `dist/index.js` executable under the `aimharder-mcp` bin name, a Node `>=24` engine requirement (see the [runtime decision](2026-09-24-node-24-minimum.md)), and a `prepack` build. Consumers install compiled archives with production dependencies and no compilation. The explicit allowlist contains only compiled JavaScript and selected public Markdown documentation/metadata. Source files, evidence, environment files, tests, scripts and archives are excluded.

The automated packaging check installs in a temporary directory outside the checkout, disables install scripts, verifies absence of development tools, and resolves both server and SDK harness dependencies from the isolated installation. An HTTP fixture preload in the child intercepts every fetch; no fixture changes or upstream override are shipped in the runtime. A separate opt-in live check verified installed-package account/gym discovery on 2026-09-22. See [validation](../validation.md). This changes distribution and validation mechanics, not authentication, API contracts, or feature scope.

For #12, a separate [release procedure](../releasing.md) and `scripts/registry-check.mjs` verify the exact public-registry version after publication. The registry check resolves metadata from npm, downloads the version into an isolated temporary npm cache outside the checkout, and runs the installed executable through the SDK over stdio with an authorized live read-only account/gym query. The npm subprocess receives no AimHarder credentials. This check passed for the first public version after #13's accepted functional verdict; see [validation](../validation.md).

The later [GitHub Actions release automation decision](2026-09-24-github-actions-npm-release-automation.md) changes version preparation and npm authentication/publication mechanics for future releases. It retains this decision's exact-registry-artifact verification requirement and keeps authenticated live verification local.

## Consumer documentation subset (2026-09-24)

The user confirmed that the npm-facing README should serve account holders connecting desktop clients, with only a brief contribution path. The archive therefore includes the README, license, domain glossary, shared configuration and tool guides, and client guides for ChatGPT desktop, Codex, Claude Desktop, Hermes and OpenClaw. It excludes the MVP specification, API research, validation history, ADRs, release procedure, agent instructions and development guide. Those remain public in GitHub and are linked with repository URLs from packaged documentation. This narrows the former `docs/**/*.md` allowlist without changing runtime behavior.

The package check requires exactly the selected consumer Markdown paths and rejects unexpected documentation. Client-specific setup that has not passed a live installed-package check must be labeled as such; the observed ChatGPT desktop STDIO form is a configuration route, not proof that this package was connected.

## First public releases (2026-09-24)

`aimharder-mcp@0.1.0` was published from source revision `b0ca938ba130a61a6840a9803bffe601a585fb26` and passed exact public-registry live MCP verification. Hermes and Codex CLI authenticated through version-pinned `npx` execution. The first tarball still described npm publication as pending in its consumer Markdown, because the documentation review followed publication. Version `0.1.1` corrects those statements, adds a Codex consumer guide, and becomes the documented pin. This is a documentation and distribution metadata correction; the local, read-only, one-account architecture and API behavior do not change. Both version artifacts have separate verification records in [validation](../validation.md).
