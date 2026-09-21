# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `rudeayelo/aimharder-mcp`.
Use the `gh` CLI from the repository checkout. Write all content in English.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`.
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open --json number,title,labels,assignees`.
- Comment: `gh issue comment <number> --body-file <file>`.
- Label: `gh issue edit <number> --add-label "..." --remove-label "..."`.
- Close: `gh issue close <number>`.

Use a UTF-8 file with actual newlines for multiline bodies and comments.
When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the issue and its comments.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Wayfinding

Use one issue labeled `wayfinder:map` for the map, with Notes,
Decisions-so-far, and Fog sections.

Link child tickets as GitHub sub-issues. If unavailable, use a task list
in the map and a `Part of #<map>` reference in each child.
Label children `wayfinder:<type>`, where type is research, prototype,
grilling, or task.

Use native GitHub issue dependencies for blockers. If unavailable,
record `Blocked by: #<number>` in the child.
A ticket is unblocked only when all its blockers are closed.

Choose the first open, unassigned, unblocked child in map order.
Claim it with `gh issue edit <number> --add-assignee @me`.
Resolve it by posting the result, closing the ticket, and adding a
summary and link to the map's Decisions-so-far section.
