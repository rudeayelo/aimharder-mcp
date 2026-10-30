# ADR: self-service onboarding after invitation

Status: accepted product requirement on 2026-10-28; implementation design and validation pending. Amends the operator-registration workflow in the [hosted authorization decision](2026-10-18-hosted-mcp-client-authorization.md); no authentication or registration change has been implemented or deployed for this decision.

## Context

The existing remote setup asks participants to obtain a public OAuth client ID and exact registered callback from an operator. The owner requires a very clear, concise, client-specific onboarding flow that participants can complete independently once invited. Preserving operator intervention as a normal setup step would fail that product requirement.

## Decision

Keep invitation-only admission. After accepting an invitation, participants must be able to connect their own AimHarder account, configure a supported AI client, complete consent and try a useful query without an administrator preparing an individual registration or sending configuration during their setup.

The service must supply any required public client configuration through a self-service path or suitable preconfiguration. Client-specific guides must describe only the steps relevant to that client. The owner subsequently accepted copying required configuration between the portal and client, including an exact callback when needed, while retaining independent disconnection for each installation. An **Other clients** guide is accepted with concrete compatibility requirements; it does not establish support for arbitrary clients.

Choose and verify the registration mechanism separately. This product requirement does not select open DCR, CIMD or an unrestricted client-creation endpoint. Preserve exact callback validation, maintained OAuth/PKCE, explicit consent, participant isolation and independent client revocation. The existing registration policy remains the runtime baseline until a replacement is implemented and verified.

## Consequences

This is more than a copy change: current operator preparation cannot satisfy the accepted journey. The design and subsequent engineering work must resolve configuration delivery and registration, including the callback behavior of each supported client. A public client ID is configuration, not an account password or OAuth token. Keep passwords, tokens and live authorization URLs out of copied installation examples.

Test an invited participant's complete journey without operator intervention before claiming self-service support. Retain existing client-specific compatibility and deployment limits. This decision authorizes recording the requirement; it is not evidence of a working implementation or a production launch.
