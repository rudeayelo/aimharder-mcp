# Kettlebell robot identity trials

Status: two unselected image explorations, 2026-10-29, under #95. These follow the [provisional foundations](../README.md) and the owner's staged review. No public home page or remaining product screens have been generated.

## Owner brief

Use a kettlebell silhouette as a very simple robot head with geometric eyes. Explore an eventual dynamic 3D character. The horizontal arrangement is **AIMHARDER [symbol] MCP**. Typography should be geometric, wide, low and all caps, similar in character to the existing AimHarder lettering without duplicating it.

The owner supplied two visual references: a simple blue fuzzy character with two eyes and a Grok Bot wordmark with a face between words. Their bounded roles are expressive simplicity and wordmark integration. The generated concepts do not adopt their characters, logos, fur or costume. No source-reference attachments are redistributed in this directory.

## Trials

- [A — Geometric](identity-a-geometric.png): predominantly flat blue kettlebell silhouette, navy eyes, broad geometric lettering, monochrome and blink studies. A candidate master mark for small-size use. The image still includes subtle generated shading; it is not final vector artwork.
- [B — Sculptural](identity-b-sculptural.png): blue molded volume, orange pill eyes, front and turned poses. A static visualization of animation potential, not a 3D model or animation.

Both were generated with the built-in GPT Image tool using separate prompts, with the two owner-supplied images as inspiration references. Full prompts are preserved in [prompts.md](prompts.md). Original outputs remain in Codex generated-image storage; these copies are repository-local review artifacts.

## Review and next step

### Symbol color and recessed-eye studies

The owner likes the corrected Krona-inspired direction while explicitly noting it still differs from the actual specimen. This is preference for an exploration, not selection of an exact font. At the owner's request, subsequent work focuses on the symbol before proceeding to the public home page.

- [Six-color study](robot-color-study.png): dark navy body without a face panel; current blue body with a dark circular face; pink, yellow, green and violet body alternatives with that same dark face. All eyes remain orange. “Background color” was explicitly interpreted in the working update as the kettle body color; the sheet itself stays white. That interpretation is not a confirmed owner clarification.
- [Recessed-eye detail study](robot-recessed-eyes-study.png): large navy and blue/circular-face views showing pill-shaped cavities with orange interiors, inward edges and inner shadows rather than the original raised eye treatment.

Both sheets use built-in GPT Image, preserve the prior sculptural symbol as reference and are static material/color explorations. Prompts are in [prompts.md](prompts.md). Visual review confirms six requested body colors, dark circular faces in the five colored variants, orange eyes throughout and visible recessed-edge cues in the details. These cues do not establish real 3D geometry or manufacturing feasibility. The detail's orange interiors still have some rounded shading; a future mesh should test genuinely flat cavity floors, depth and bevels. Rendering does not precisely preserve color tokens or identical geometry across variants.

The navy type-color starting point is `#14283F`, with near-black face candidate `#101C2C` and orange eyes `#FFAB62`. Requested alternative body-color candidates in the prompt are pink `#F398BC`, yellow `#F5D35A`, green `#70BD91`, violet `#A58BDC`; blue stays `#2490F4`. These are exploration inputs, not additional adopted brand tokens. No color variant is selected. Eye legibility at small sizes, consistent front/turned poses, actual 3D recesses and animation remain to be tested after owner review. No runtime, API or ADR decision changes.

### Typography comparison continuation

The owner rejected the initial font approximations and supplied actual specimens. Subsequent [Krona One correction](identity-3d-krona-reference.png) and [Big Shoulders SemiBold 600 correction](identity-3d-big-shoulders-reference.png) use those respective specimens as direct typography references, with the original sculptural board supplying only the robot. Both preserve blue AIM, navy HARDER/MCP and the central robot. These are still GPT Image raster interpretations, not exact font-file compositions; no production typography selection is implied. The initial comparison remains historical evidence of the rejected approximations. Aldrich has not received a specimen-based correction.

At the owner's request, [the 3D typography comparison](identity-3d-type-comparison.png) explores [Krona One](https://fonts.google.com/specimen/Krona+One), [Big Shoulders](https://fonts.google.com/specimen/Big+Shoulders) and [Aldrich](https://fonts.google.com/specimen/Aldrich). The owner also requested the original brand's two-color AIM/HARDER pattern. This trial proposes blue AIM, navy HARDER and navy MCP, preserving the robot between the complete AIMHARDER word and MCP. The exact color assignment remains a proposal.

Generated with built-in GPT Image using the earlier sculptural board as the edit reference; its prompt is recorded in [prompts.md](prompts.md). Visual inspection confirms the three wordmark rows, spelling, color split and robot placement. Lettering is synthesized from font-name instructions, not typeset with the actual font files, so the board is an approximate visual exploration. Font outlines, weights, metrics and uniform robot geometry require an exact composition before choosing production typography. No final font has been selected.

Both outputs were visually inspected: correct wordmark order and spelling, integrated kettlebell handle, two simple eyes, no additional body parts, and no product screens. The tool synthesized lettering rather than identifying or licensing an exact production font. The two images do not yet share precisely identical geometry.

Recommendation for review: choose a flat master silhouette first, then derive its 3D form with identical proportions. Compare navy versus orange eyes at small sizes; orange-on-blue eye contrast and visible blink states still need deliberate refinement. Test favicon-scale legibility, letter spacing, a true one-color mark and reverse usage before final adoption. Do not treat generated raster colors as measured production tokens.

The owner has not selected either trial. Editable logo vectors, an actual 3D mesh/rig, animation, reduced-motion behavior and the public home-page experiment remain future work. Runtime behavior, API contracts, deployment and the existing ADR decisions are unchanged.
