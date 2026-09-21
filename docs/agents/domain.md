# Domain docs

## Layout and reading rules

This is a single-context repository.

- Read root `CONTEXT.md`, when present, before exploring the domain.
- Read `docs/mvp.md` for scope and acceptance criteria.
- Read `docs/api-research.md` when investigating or implementing API access.
- Read relevant decisions in `docs/adr/` before changing their subject area.

If `CONTEXT.md` is absent, proceed silently. Do not create a placeholder.
Domain-modeling work can create it when terminology is established.

## Vocabulary

Use the domain terms defined in `CONTEXT.md` in issues, proposals,
code, and tests. If a needed term is missing, identify the gap rather
than inventing competing terminology.

## Decisions

Use `YYYY-MM-DD-[title].md` filenames for ADRs, following `AGENTS.md`.
Explicitly flag conflicts with accepted decisions and explain why
they should be reconsidered. Preserve superseded decisions and link
to their replacements.
