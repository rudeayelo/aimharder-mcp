# Publishing an npm release

The first two public packages, `aimharder-mcp@0.1.0` and `aimharder-mcp@0.1.1`, passed exact-registry-artifact live MCP checks in [validation](validation.md#public-npm-and-client-checks-2026-09-24). The first-release functional QA verdict and its limits are also recorded there. The [README](../README.md) carries the consumer version pin. This page describes the Changesets and GitHub Actions release path agreed in the [automation ADR](adr/2026-09-24-github-actions-npm-release-automation.md).

**Activation status:** the GitHub App, repository protection, and npm trusted publisher were configured on 2026-09-24. The workflows are proposed in [PR #16](https://github.com/rudeayelo/aimharder-mcp/pull/16); automatic publication is not active until they reach `main` and a first Actions release succeeds. Do not describe an unrun publish workflow as verified.

## One-time activation

1. Keep the private [`aimharder-mcp-release` GitHub App](https://github.com/settings/apps/aimharder-mcp-release) installed only on `rudeayelo/aimharder-mcp`, with repository **Contents: read and write** and **Pull requests: read and write**. Its numeric App ID is stored as the repository Actions variable `RELEASE_APP_ID`, and its private key as the Actions secret `RELEASE_APP_PRIVATE_KEY`. The downloaded key was removed after storage. Do not put the private key in Git, issues, logs, or chat.
2. In repository **Settings → Actions → General**, keep **Allow GitHub Actions to create and approve pull requests** enabled. This setting was enabled on 2026-09-24. The release workflow uses the App token to create version pull requests, allowing their CI checks to start automatically.
3. Keep `main` protected: require a pull request and the `CI / verify` check before merging, including for administrators. This protection was enabled after the check passed on [implementation PR #16](https://github.com/rudeayelo/aimharder-mcp/pull/16). The [CI workflow](../.github/workflows/ci.yml) runs on Node 24 and checks type safety, fixtures, build, and the isolated package archive.
4. Keep the [npm GitHub Actions trusted publisher](https://www.npmjs.com/package/aimharder-mcp/access) set to owner `rudeayelo`, repository `aimharder-mcp`, and workflow filename `release.yml`, with direct `npm publish` allowed and no environment name. It was added on 2026-09-24. The [release workflow](../.github/workflows/release.yml) grants `id-token: write` only to its publish job. It uses a GitHub-hosted runner and an npm CLI version supporting OIDC. No npm publish token belongs in GitHub secrets.
5. Confirm that the first new version published through Actions appears on npm and passes the exact-version local MCP check below. Only after that, set npm publishing access to **Require two-factor authentication and disallow tokens** and remove any obsolete publish token. Trusted publishing continues to work with this setting.

The GitHub App private key is a GitHub automation credential, separate from npm OIDC and from AimHarder account credentials. AimHarder credentials stay local.

## Manual fallback before activation

Before the one-time setup is complete, use a clean Node 24 checkout and pnpm 12.5.1. Update the version and pinned consumer instructions in a reviewed change, then run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:package`. Inspect `npm pack --ignore-scripts --json` for the explicit archive allowlist. Check any applicable authorized local live evidence before publishing. Publish the inspected archive with the authorized npm account, then use the exact-version registry check below. Record source revision, archive integrity, public registry metadata, and live result in [validation](validation.md). This fallback does not establish that the Actions path works.

## Prepare and publish a version

1. For a change to the distributed package, including README or packaged client guides, run `pnpm changeset` and commit its file with the change. Choose `patch` for compatible fixes and packaged-documentation corrections; choose `minor` for new capabilities or clearly announced incompatible changes while in `0.x`. A `1.0.0` release needs an explicit decision. Internal-only changes need no changeset.
2. Open a pull request to `main`. CI must pass. For authentication or AimHarder API-interpretation changes, run the applicable authorized read-only live checks locally before merging and record sanitized evidence. Documentation-only changes do not need those live checks.
3. Merge the change. The release workflow collects pending changesets into a release pull request, updating the package version, lockfile, changelog, and pinned consumer commands. Review that pull request and its CI results.
4. Merge the release pull request. GitHub Actions reruns the pre-publication checks, packs the release, publishes through npm OIDC, then creates the version tag and GitHub Release. No separate publish approval is required. Ordinary merges with no unpublished version do not publish.
5. Read the exact version from the successful workflow or `package.json` in the merged release commit. Confirm `npm view aimharder-mcp@<exact-version> version dist.tarball dist.integrity --json --registry=https://registry.npmjs.org/`. A successful publish does **not** establish live MCP verification.

## Verify the exact npm artifact locally

With AimHarder credentials securely injected into the local environment, run:

```sh
AIMHARDER_LIVE_CHECK=1 node scripts/registry-check.mjs <exact-version>
```

The script installs that version from npm in a clean temporary directory/cache and checks the server over MCP stdio: initialization, six tools, read-only account/gym access, gym selection, sanitized errors, and empty stderr. The npm subprocess receives no AimHarder credentials. Record the source revision, exact version, registry URL/integrity, UTC time, runtime, result, and limitations in [validation](validation.md). Mark the release as live-verified only after this check passes.

If npm publication fails before accepting the version, fix the failure and retry the workflow. If npm accepted the version but a tag or GitHub Release failed, inspect npm first and repair the metadata for that version without attempting a second publication. If the local MCP check fails, record the version as published but not live-verified, investigate, and release a corrected version; consider npm deprecation if users are affected. npm versions cannot be republished with different contents.

Clients should pin `npx --yes aimharder-mcp@<exact-version>` on Node 24+, supply credentials in the process environment, and override the assumed `Europe/Madrid` zone when needed. The package does not load `.env` automatically. If a client starts inside this repository, `npx` may select the local package manifest instead of downloading the public binary. Use an empty directory as `--prefix` or set the client's working directory outside the checkout; the Hermes and Codex guides show this form.

## Release history

- `0.1.0` was the first public version from `b0ca938ba130a61a6840a9803bffe601a585fb26`. Its public tarball passed live read-only MCP verification. Its bundled README still said publication was pending.
- `0.1.1` corrected consumer documentation, added the Codex guide, and retained the same MCP behavior. Its exact public artifact passed the live MCP registry check in [validation](validation.md#public-npm-and-client-checks-2026-09-24).
