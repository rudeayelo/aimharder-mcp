# Design

Figma is the design source of truth for AIHarder ([decision](../docs/adr/2026-11-24-figma-design-source-of-truth.md)). This directory holds only what implementation needs from design; it does not mirror Figma.

## Figma files

| File | Status | Use |
| --- | --- | --- |
| «AIHarder» | Current; created in phase 1 ([#135](https://github.com/rudeayelo/aimharder-mcp/issues/135)), which records its URL | The design system and every screen. |
| [AIHarder — Design](https://www.figma.com/design/9jDoWpeUEGTbtMoENvbzAB) | Iteration 1, read-only | Reference for the landing study, the Kettle and the logo. Nothing new is drawn here. |

Expected pages in «AIHarder», one per [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95) phase:

- **Foundations and components:** variables (brand strings and colors, color roles in Light and Dark, typography, spacing, radius, elevation) and the base component set.
- **Access**, **Portal**, **Administration and emails**, **Landing and Privacy:** screens built only from those components.

The brand variables (product name, domain, support email, brand colors) are the single place the brand is defined in design. See the [brand seam rule](../docs/product-experience.md#brand-seam-rule).

## What is decided

[Product experience](../docs/product-experience.md) is the decision record: requirements, what is kept from iteration 1, the screen inventory per phase and the checks each phase posts. Name and domain: [provisional product name and domain](../docs/adr/2026-11-24-provisional-product-name-and-domain.md).

## Assets

| Path | Contents |
| --- | --- |
| [assets/kettle/](assets/kettle/README.md) | The 3D Kettle body (`kettle-body-32k.sog`), its provenance and licenses. |

Assets that ship in the product live under `assets/`, each with its provenance and licenses beside it.

## Iteration 1 archive

The pen.dev file, HTML prototypes, identity and motion studies, generated videos, the source PLY and the vendored renderers live only at tag [`archive/95-iteration-1`](https://github.com/rudeayelo/aimharder-mcp/tree/archive/95-iteration-1). Read them with `git show archive/95-iteration-1:<path>`; never merge the tag.
