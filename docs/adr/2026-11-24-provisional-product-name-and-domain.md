# ADR: provisional product name and domain

Status: accepted on 2026-11-24 by the maintainer as decisions 3 and 5 of the [#95 spec](https://github.com/rudeayelo/aimharder-mcp/issues/95). **Provisional** until the conversation with AimHarder described below. Amended on 2026-11-24 by the maintainer in [#141](https://github.com/rudeayelo/aimharder-mcp/issues/141): the name changes from AIHarder to **AskHarder** and the domain from `aiharder.link` to **`askharder.com`** (see [Amendment](#amendment-askharder-and-askhardercom)). Amended again on 2026-11-25 for the host switch in [#142](https://github.com/rudeayelo/aimharder-mcp/issues/142) (see [Host switch](#amendment-host-switch-to-askhardercom)). Supersedes in part the user-facing name and domain in [the Cloudflare runtime candidate](2026-10-16-proposed-cloudflare-hosted-runtime.md) (`ahmcp.link`, the AimHarder MCP OAuth application name), the support address in [Resend transactional delivery](2026-10-18-resend-transactional-delivery.md) (`support@ahmcp.link`) and the AimHarder MCP name in the earlier product brief. No runtime origin, OAuth callback, DNS record or mail configuration changes with this decision.

## Context

The service has appeared under several names: AimHarder MCP in the hosted ADRs and implementation tickets, AimHarder Connect and AIHarder during design iteration 1, and both `ahmcp.link` and `aiharder.link` as its domain. Users see the name on the website, in emails, in the MCP server display name and on the OAuth consent screen, so inconsistency undermines trust in an invitation link.

The name also depends on a relationship that does not exist yet. The plan is to run the invitation-only pilot, test it with real users and, with good feedback, propose an agreement to AimHarder: a collaboration, a partnership or an acquisition. There are three possible outcomes:

- **AimHarder declines.** The project closes.
- **AimHarder accepts the product but not the name.** The name and domain change, and the product continues separately on AimHarder's API.
- **AimHarder accepts the product and the name.** The name stays, or changes to whatever the agreement settles.

## Decision

- **AskHarder** is the product name in everything a user sees: the website, emails, the hosted MCP server display name and service-authored text shown to users, OAuth consent and user documentation.
- `aimharder-mcp` stays only as the npm package name and the repository name.
- `askharder.com` is the product domain, and `support@askharder.com` the support address (working value; the maintainer still has to confirm it). AimHarder's blue (`#2490f4`, observed in their public stylesheet) is the starting direction for the brand color; the final values come out of the design system work in #95.
- The decision is **provisional**. It holds for the pilot and is reopened by either trigger:
  1. AimHarder's answer to the proposed agreement, whatever it is.
  2. A rebrand request from AimHarder, or any request from them to stop using the name or domain, at any time.
- The maintainer knowingly accepts the trademark risk of a name close to AimHarder's for the pilot. No trademark review was done, and none is part of #95.
- The independent-project disclosure stays visible on user-facing surfaces. The name does not imply endorsement by or affiliation with AimHarder.

## Consequences

- Because the name may change, the **name, domain, brand color and support address are defined once**: as Figma variables (string and color) in the design system, and in one brand module in code that every user-facing string reads from. Screens, emails and copy never repeat them by hand. The code module is [`hosted/src/brand.ts`](../../hosted/src/brand.ts); `hosted/tests/brand.test.ts` renders the portal pages, emails, OAuth consent and MCP server description, fails if a retired name or host appears or if hosted source hard-codes a brand value, and proves that swapping the module changes every surface ([#141](https://github.com/rudeayelo/aimharder-mcp/issues/141)). Changing the brand then means editing those two places; moving the live hosts is a separate host switch like #142.
- Live hostnames are deployment configuration, not brand text: the Worker route and `BASE_URL`, the isolated test origin, the Resend sending domain, the Google OAuth client and its application name, and the internal OAuth grant claim. They move to `askharder.com` in [#142](https://github.com/rudeayelo/aimharder-mcp/issues/142); see the [host switch amendment](#amendment-host-switch-to-askhardercom). Historical records and research keep the names they used at the time, with a dated note.
- Activating `askharder.com` in Cloudflare, OAuth, Resend and the Worker is separate operational work coordinated with the maintainer ([#142](https://github.com/rudeayelo/aimharder-mcp/issues/142)). This decision does not make the domain or the support address available, so the hosted service does not show the support address to users yet.
- If the project closes after AimHarder declines, the cheap brand seam has no further use; nothing else in the architecture depends on this name.

## Amendment: AskHarder and askharder.com

Decided by the maintainer on 2026-11-24 and recorded in [#141](https://github.com/rudeayelo/aimharder-mcp/issues/141).

- The name changes from AIHarder to **AskHarder**. It describes what a participant does, asking an AI about their training, and is less easily read as AimHarder's own product than AIHarder, though it remains close to their name.
- The domain changes from `aiharder.link` to **`askharder.com`**, which the maintainer registered. A `.com` is the address people guess and trust most in an invitation link or email sender, and it is the one worth holding if the product continues under its own name after the AimHarder conversation.
- The support address becomes `support@askharder.com` (working value, still to be confirmed).
- Everything else in this decision stands: AskHarder is provisional, the same two reopening triggers apply, the trademark risk is still knowingly accepted for the pilot, and the independent-project disclosure stays visible.

## Amendment: host switch to askharder.com

Decided by the maintainer on 2026-11-24 and recorded in [#142](https://github.com/rudeayelo/aimharder-mcp/issues/142).

Retired host note (2026-11-25): `ahmcp.link` in the context and status above is the retired host, kept as it was decided at the time.

- The hosted service moves from `ahmcp.link` to `askharder.com` as is. The project is in development and nobody else has access, so there is **no redirect** from the old hosts. They are removed once the switch is verified.
- The isolated test environment moves now, to `pilot-test.askharder.com`. Production deployment is still out of scope.
- The internal OAuth grant claim becomes `https://askharder.com/mcp-grant`. The issuer, the MCP resource identifier and that claim all change, so every existing session, token, grant, consent and static client registration is invalidated; the operator registers the static clients again. Accounts, linked sign-in methods and encrypted AimHarder connections are preserved, because the databases and the Durable Object namespace stay the same.
- Mail is sent from `noreply@askharder.com` through a Resend domain verified on `askharder.com`. `support@askharder.com` stays reserved until [#116](https://github.com/rudeayelo/aimharder-mcp/issues/116).
- The repository names only the new hosts. `hosted/tests/brand.test.ts` fails if the retired host appears anywhere in the repository except in historical records that carry a dated retired-host note.

Consequences: the repository change lands first and changes nothing deployed. The provider steps, their order, a verification probe for each and rollback are in the [plan on #142](https://github.com/rudeayelo/aimharder-mcp/issues/142#issuecomment-7166962650). Until the operator completes them, the deployed test environment still answers on its previous host, and [the test-environment runbook](../hosted-test-environment.md#host-switch-to-askhardercom-pending) marks the switch as pending.
