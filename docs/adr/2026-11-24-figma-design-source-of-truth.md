# ADR: Figma as the design source of truth

Status: accepted on 2026-11-24 by the maintainer as decision 4 of the [#95 spec](https://github.com/rudeayelo/aimharder-mcp/issues/95). Replaces the pen.dev `.pen` file as the design source, which earlier product records (the [#103 brief](https://github.com/rudeayelo/aimharder-mcp/issues/103) and the original #95 text) named as the deliverable.

Superseded in part, 2026-11-25: the product name AIHarder used below is superseded by AskHarder in the [provisional product name and domain decision](2026-11-24-provisional-product-name-and-domain.md#amendment-askharder-and-askhardercom). The Figma file titles «AIHarder» and «AIHarder — Design» are the files' names and stay as written. The Figma decision itself is unchanged.

## Context

Design iteration 1 started in pen.dev (`design/ahmcp.pen`) with HTML prototypes for motion and interaction, then moved to the Figma file [AIHarder — Design](https://www.figma.com/design/9jDoWpeUEGTbtMoENvbzAB) on 2026-11-05. That file carries the landing study, the Kettle and the logo, but also dozens of near-duplicate components, provisional foundations and incomplete journey screens. Building the redesign on top of it would inherit that debt. Keeping pen.dev, Figma and HTML studies as parallel sources left no single place to check what is current.

## Decision

- Figma is the design source of truth for AIHarder: foundations, components, screens and the brand variables.
- The redesign happens in a **new Figma file, «AIHarder»**, built on a real design system (variables for brand, color roles with Light and Dark modes, typography, spacing, radius and elevation; components that reference roles, never raw colors).
- The existing file [AIHarder — Design](https://www.figma.com/design/9jDoWpeUEGTbtMoENvbzAB) is **iteration 1 and read-only**. It stays available for reference; nothing new is drawn in it.
- The `.pen` file, the HTML prototypes, the identity and motion studies, the generated videos and the source PLY are historical. They live only at tag [`archive/95-iteration-1`](https://github.com/rudeayelo/aimharder-mcp/tree/archive/95-iteration-1) (commit `75f80c5`) and are not brought into `main`.
- The repository keeps only what implementation needs from design: the decision record in [Product experience](../product-experience.md), the pointer in [design/README.md](../../design/README.md) and shipped assets under `design/assets/`, starting with [the 3D Kettle](../../design/assets/kettle/README.md).

## Consequences

- Implementation tickets map screens to named Figma components and variables, not to `.pen` frames or prototype HTML. Tickets #106–#117 that still cite pen.dev get updated in the #95 handover.
- Kettle motion is specified in the decision record (trigger, duration, easing, reduced-motion behavior) and rebuilt in implementation with npm dependencies; the iteration-1 prototype code is not reused directly.
- Figma is a hosted third-party tool outside the repository. The repository does not mirror Figma content, so a design change does not show up in `git diff`; reviews rely on the screenshot sheets each #95 phase posts in its issue.
- Recovering anything from iteration 1 means reading the tag, never merging it.
