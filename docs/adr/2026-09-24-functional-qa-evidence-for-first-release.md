# ADR: functional QA evidence for the first npm release

Status: accepted by the user on 2026-09-24.

## Context

[QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13) originally required one combined harness run with actual published future workout content before [npm publication #12](https://github.com/rudeayelo/aimharder-mcp/issues/12). The gym's next-day workout is not available at every verification time. The user manually checked the 24 September WOD in Hermes on 23 September while it was a future workout; separate SDK comparisons independently verified that publication and its variants against the source feed/details. Earlier live combined checks covered current content, unavailable next-day content and an existing reservation. The exact combined future-content harness run was not recorded.

## Decision

For the first release, accept the aggregate of the user's installed-package Hermes QA, independent read-only MCP/source comparisons, the existing combined booking checks, automated behavioral coverage and a current installed-package live account/gym check as the functional verdict. This explicitly replaces #13's single-run future-content harness requirement for release gating; it does not claim that command was run or that a date-specific booking absence was verified. An empty schedule does not establish a bookable session, and an upcoming view without a verified date horizon does not establish no booking.

## Consequences

#13 can close and #12 can proceed to public npm publication. The exact registry version still requires a separate clean installation and live MCP account/gym query. Historical evidence keeps its recorded source revision and coverage limits; no assertion of universal workout/session mapping, exhaustive feed/history, physical training sessions or attendance is added. The server remains local, one account per instance and read-only.
