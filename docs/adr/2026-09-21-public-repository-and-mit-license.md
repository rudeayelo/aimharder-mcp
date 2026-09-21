# ADR: public repository and MIT license

Status: accepted by explicit user request on 2026-09-21; updated the same day to require English throughout the project.

## Context

The user requests Git initialization, an initial README, and publication on GitHub as a public repository from the start. This supersedes the publication restriction in [the initial pause](2026-09-21-initial-scope-and-project-pause.md). The MIT license was already confirmed in [the MVP decision](2026-09-21-local-typescript-mcp-mvp.md).

The user requires all project content to be in English; conversation may remain in Spanish.

## Decision

Publish `rudeayelo/aimharder-mcp` as a public repository with `main` as the initial branch, an English README, and an MIT `LICENSE` file. Maintain all project content and repository metadata in English, including document filenames. Preserve external API identifiers, proper names, and original research evidence. The first delivery contains documentation and Git configuration; server implementation remains pending.

Exclude `evidence/`, environment files containing secrets, and generated output through `.gitignore`. Remove personal references and private configuration details from public documentation. Add future API samples only after anonymization and review.

## Consequences

Code and documentation added to the repository will be public. The README must distinguish planned features from verified capabilities. Publication does not authorize deployments, AimHarder write operations, or changes to MVP scope.

## Delivery verification

Local verification performed on 2026-09-21: the 11 files prepared for publication were reviewed, their local Markdown links resolve, and `git diff --cached --check` found no errors. Checks confirmed that `evidence/`, `.env`, `.env.local`, dependencies, and generated output are ignored, while `.env.example` can be tracked. Content review found no secrets; private paths and personal references were removed from the public documentation.

The repository was created on [GitHub](https://github.com/rudeayelo/aimharder-mcp), and the initial publication was verified as public with matching local and remote commits. Documentation was consolidated into the README for project status, the MVP for scope and acceptance criteria, and [API research](../api-research.md) for observations and validation gaps. Local links and whitespace checks were repeated after consolidation. There is no executable code or test suite in this delivery.
