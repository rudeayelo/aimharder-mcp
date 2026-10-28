# ADR: invited hosted MCP pilot with the existing feature scope

Status: accepted product direction on 2026-10-15; role controls and initial availability clarified on 2026-10-16. The user confirmed shared understanding of the complete product design on 2026-10-16. Identity and credential-custody requirements are recorded in the [hosted identity decision](2026-10-15-hosted-identity-and-credential-custody.md). The Cloudflare/Better Auth candidate, service-operated authentication maintenance and pilot validation requirements were accepted on 2026-10-16; detailed runtime design and deployment remain pending.

Design record: [issue #68](https://github.com/rudeayelo/aimharder-mcp/issues/68). Confirmed specification: [issue #69](https://github.com/rudeayelo/aimharder-mcp/issues/69), published with `ready-for-agent`.

Technical candidate: [Cloudflare hosted runtime](2026-10-16-proposed-cloudflare-hosted-runtime.md), accepted as the direction to validate. It records maintenance responsibilities and pilot acceptance gates; feasibility and exact implementation architecture remain unverified.

Validation-scope amendment, 2026-10-28: the [scoped hosted-pilot acceptance decision](2026-10-28-scoped-hosted-pilot-acceptance.md) supersedes the requirement to keep #84/#69 open for every outstanding observation. Product features, security invariants and the planning target remain unchanged; deferred or excluded checks are not validated by closure.

## Context

The local server requires one AimHarder account per instance. The user wants a hosted service with a web portal for sign-in, AimHarder connection settings and instructions for connecting MCP clients. Hosting changes the account-isolation and credential-management boundaries established by the [local MVP](2026-09-21-local-typescript-mcp-mvp.md) and [credential policy](2026-09-21-credential-security-and-read-only-access.md).

## Decision

- Start with an invitation-only pilot for members of the user's gym, each using their own AimHarder account.
- Include all currently implemented features: queries, personal RM/progression and calculated loads, booking creation/cancellation, and own-activity publication/deletion. A query-only remote subset is not the intended product scope.
- Preserve the existing action-specific confirmation, bounded execution and fresh read-back requirements. Feature availability does not authorize a real write or remove the documented limits of upstream validation.
- Explore ChatGPT through a custom MCP server and Hermes first. Other clients are later candidates. Free-plan and mobile availability are not established as launch acceptance requirements by this decision; they remain client capabilities to investigate if needed.
- Prefer Cloudflare, while allowing another hosting option if a material limitation prevents the intended experience.
- Size the initial pilot for up to 20 participants and target a maximum service cost of EUR 10/month, accepted on 2026-10-16. These are planning constraints, not a verified estimate or authorization to incur charges; provider/runtime selection must establish whether they can be met.

Use `admin` for the pilot owner and `user` for other participants. Only own-activity publication and deletion have configurable role-based availability, with a separate control for each capability. Both are initially disabled for `user` and enabled for `admin`. Each capability includes its preparation and execution tools; disabling it must prevent execution even if a client retains a tool definition or prepared reference. Other existing features, including booking creation and cancellation, remain available to both roles without feature switches. Individual-user exceptions are not required. These availability rules do not override current authentication, membership, action eligibility or confirmation requirements.

The earlier interview example of disabling bookings is therefore inapplicable: bookings cannot be disabled through this feature policy. Disabling activity publication/deletion governs future execution; an upstream request already sent must still be reconciled and reported, rather than treated as undone.

## Consequences

The hosted service is an additional post-MVP product direction. It preserves the supported local stdio package and adopts Cloudflare/Better Auth as a candidate subject to the recorded compatibility and cost gates. The [hosted identity decision](2026-10-15-hosted-identity-and-credential-custody.md) accepts hosted credential custody separately from the unchanged local credential/session policy. Concrete provider integration, key management, per-participant isolation and remote state handling still need an implementation design.

The design must account for all existing features; temporary test controls must not silently redefine the intended scope. ChatGPT and Hermes need independent connection and behavior validation, including the confirmed-action flows. Neither remote client has been validated with this proposed service. No hosted implementation, live upstream action or deployment was performed for this decision.
