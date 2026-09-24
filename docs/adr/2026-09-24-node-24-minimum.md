# ADR: Node 24 minimum for the public package

Status: accepted on 2026-09-24. Supersedes the Node 24-only package support decision in the [initial runtime ADR](2026-09-21-account-discovery-and-local-runtime.md).

## Context

The first package candidate restricted `engines.node` to `>=24 <25` and documentation instructed users to install Node 24. The user reported using the project with Node 26 and requested `>=24` support. Node 24 remains the repository's pinned development baseline in `.node-version`.

## Decision

Set the npm engine requirement to `>=24`. Document Node 24 or newer for consumers and retain the version-pinned package command. Keep `.node-version` at 24 for reproducible local development. Verify the build and fixture suite on both Node 24 and Node 26 before release. Version 26 verification establishes that tested runtime, not an exhaustive guarantee for every future Node major.

## Consequences

The package no longer rejects Node 26 through its engine metadata. Maintainers must watch dependency and runtime changes in later Node majors and can revise the support range with evidence. The project still has no npm registry release at the time of this decision.
