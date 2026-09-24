# Publishing an npm release

First-release functional QA was accepted on 2026-09-24, with the limits in [validation](validation.md) and [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). npm publication and exact-version checks remain under [#12](https://github.com/rudeayelo/aimharder-mcp/issues/12).

## Prepare a release candidate

1. Use a clean release checkout, Node 24 and pnpm 12.5.1. Check the target registry version and authorized account with `npm whoami --registry=https://registry.npmjs.org/`. Keep credentials out of the repo and command arguments.
2. Set the exact version in `package.json`, update the lockfile if needed, document changes and commit. Record `git rev-parse HEAD`. The intended first version is `0.1.0`; npm versions cannot be republished.
3. Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:package` and required authorized live checks. Run `git diff --check`; the candidate tree must be clean.
4. Run `npm pack --ignore-scripts --json --pack-destination <temporary-directory>` after building. Inspect the allowlist: compiled JavaScript, README, license, glossary, `docs/configuration.md`, `docs/tools.md`, four `docs/clients/*.md` guides and package metadata. Exclude source, tests, evidence, environment files, maps, archives and internal docs. Check packaged Markdown links and keep the archive outside the checkout.

## Publish and verify

1. Confirm QA #13 evidence applies to the candidate. Publish the inspected archive with `npm publish <absolute-archive-path> --access public --registry=https://registry.npmjs.org/`, completing npm authentication.
2. Check the public page and `npm view aimharder-mcp@<exact-version> version dist.tarball --json --registry=https://registry.npmjs.org/`. Record the registry's version and tarball URL.
3. Inject AimHarder credentials securely and run `AIMHARDER_LIVE_CHECK=1 node scripts/registry-check.mjs <exact-version>`. It installs that registry version in a clean temporary directory/cache and checks the installed server over stdio: initialization, six tools, read-only account/gym access, gym selection, sanitized errors and empty stderr. Only the MCP child receives account credentials. A failure is a release defect.
4. Record the source revision, exact version, registry URL, time, runtime versions, live result and limits in [validation](validation.md). Update the [README](../README.md), [MVP status](mvp.md) and [distribution ADR](adr/2026-09-22-npm-distribution-for-mvp.md). Publish the matching source revision to GitHub and update #12 and its parent issue.

Clients should pin `npx --yes aimharder-mcp@<exact-version>` on Node 24+, supply credentials in the process environment, and override the assumed `Europe/Madrid` zone when needed. The package does not load `.env` automatically.
