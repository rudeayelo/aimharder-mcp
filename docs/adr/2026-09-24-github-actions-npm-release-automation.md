# ADR: Automate npm versioning and publishing with GitHub Actions

Status: accepted by the user on 2026-09-24; repository implementation is in progress and external setup remains pending.

## Context

The public `aimharder-mcp` package is currently versioned, published, and verified through the manual procedure in [releasing.md](../releasing.md). The repository has no GitHub Actions workflows. The [npm distribution decision](2026-09-22-npm-distribution-for-mvp.md) requires verification of the exact public registry artifact through a live, read-only MCP check.

## Decision

The user confirmed these release-policy choices on 2026-09-24:

- Use Changesets to prepare version changes. A release pull request will make the resulting version and changelog reviewable.
- Publish to npm automatically when that release pull request is merged. Publication needs no separate approval step.
- Authenticate npm publication from GitHub Actions through npm trusted publishing (OIDC), without an npm publish token in GitHub secrets.
- Keep the authenticated, live MCP verification of the exact published registry version local. A successful publish and a successful live registry check are distinct claims.
- Require CI checks before merging pull requests into `main`. Use a GitHub App installation token to create and update the Changesets release pull request so its CI starts automatically. The GitHub App credential is for GitHub pull-request automation; it is not an npm publish credential.
- Add a changeset for changes to the distributed package, including its packaged consumer documentation. Do not require a changeset for internal-only changes. Use a non-blocking reminder for ordinary pull requests rather than forcing an empty changeset.
- While the package is in `0.x`, use patch releases for compatible fixes and packaged-documentation corrections, and minor releases for new capabilities or clearly announced incompatible changes. Reaching `1.0.0` requires an explicit decision.
- Create a Git tag and GitHub Release for each successful npm publication. These identify the publication and do not imply that the later local live check passed.
- Update version-pinned consumer examples in the release pull request. Record the local registry check separately in [validation.md](../validation.md), and do not describe a newly published version as live-verified before that check succeeds.
- Before merging changes to authentication or AimHarder API interpretation, perform the applicable authorized live checks locally. Changes confined to documentation do not require those live checks. GitHub CI remains the automated pre-publication gate.
- Require pull requests and passing CI checks for changes to `main`; direct pushes must not bypass the release pull request review path.
- If publication succeeds but the local registry-artifact MCP check fails, record the version as published but unverified or verification-failed, investigate, and publish a corrected version. Consider deprecating the defective npm version if it affects users; do not try to replace the immutable version.
- After the first successful and verified OIDC publication, configure npm publishing access to disallow traditional publish tokens. Do not disable the existing publication path before the replacement has been proven.

These choices specify the target workflow, not an existing or tested release mechanism. The exact workflow implementation and external GitHub/npm setup are still pending.

## Planned workflow

1. A contributor adds a changeset when a pull request changes the distributed package. PR CI checks type safety, fixtures, build, and the isolated package archive. Applicable authenticated API checks are run locally and recorded before merging.
2. A merge to `main` with pending changesets makes the version job create or update a release pull request. Its commit updates `package.json`, the lockfile, changelog, and version-pinned consumer documentation. The GitHub App token lets the PR's CI run without manual activation.
3. Merging the release pull request starts the publish path. Its own CI checks the release commit and package archive before the OIDC-enabled publish job sends the checked version to npm. Successful publication creates the matching tag and GitHub Release.
4. The maintainer runs `scripts/registry-check.mjs` locally against that exact npm version with authorized AimHarder credentials, records its result and source revision in [validation.md](../validation.md), and leaves failures explicitly visible until corrected.

The release workflow must avoid publishing on ordinary merges with no unpublished version. Its publish path must be safe to retry after a partial failure without trying to republish a version that npm already accepted.

## Alternatives considered

A manually dispatched workflow with a `patch`/`minor`/`major` input would use fewer release-specific tools for this single package, but it would not produce the same incremental, reviewable release-intent records. The user prefers Changesets and has prior experience with it.

An npm automation token would avoid the trusted-publisher setup but would create a long-lived publication credential. The user chose OIDC.

Running the live registry check in Actions would require providing AimHarder account credentials to that environment. The user chose to retain the local check.

Creating the release pull request with the repository `GITHUB_TOKEN` would require a maintainer to start its CI runs manually. The user chose a GitHub App token so the checks can run automatically. Requiring a changeset on every pull request was also rejected because internal-only changes need not publish a new package version.

## Consequences

The workflow must use a GitHub-hosted runner and grant `id-token: write` only to the publishing job. npm package settings must authorize the exact GitHub repository and workflow file for direct `npm publish`. Publication remains irrevocable for a version, so offline tests and archive checks must pass before the publish step.

Repository settings must permit GitHub Actions to create pull requests and must enforce the selected CI checks on `main`. The GitHub App needs the narrow permissions required to write the release branch and pull request. The release workflow must update the lockfile and all pinned consumer examples together with the package version.

When an authenticated live check is needed before merging a feature pull request, its result must be recorded with the change. The CI workflow must not receive AimHarder account credentials. After an automated publish, the release record must leave the live verification state explicit until the local registry check is completed. Failure to create a tag or GitHub Release after npm accepts a version must be repaired against that same published version; it must not trigger a second publish attempt for the same version.

Release documentation must distinguish published versions from versions that have passed the local live registry check. The current manual procedure remains authoritative until the automation is implemented and verified. No authentication, MCP-tool, or AimHarder API behavior changes are decided here.
