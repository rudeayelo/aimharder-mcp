# Home review assets

All sources were retrieved on 2026-10-30. Exact URLs and SHA-256 hashes are in [sources.json](sources.json). These assets identify products in a design prototype; they do not imply endorsement or a tested AimHarder Connect integration.

| Asset | Source and treatment |
| --- | --- |
| AimHarder | Original artwork linked by the [official site](https://aimharder.com/) and its current JavaScript bundle, from its CloudFront asset host. `apps/aimharder-source.svg` is the untouched download. `apps/aimharder.svg` only adjusts its SVG viewport to remove surrounding blank space, preserving the artwork. |
| Hermes | Original wing SVG from the [official Hermes site](https://hermes-agent.nousresearch.com/). Displayed as a monochrome mask. |
| OpenClaw | Original mascot SVG from the [official OpenClaw site](https://openclaw.ai/). Displayed as a silhouette. |
| Pi | Original `logo-auto.svg` linked by the [official Pi README](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent). Original colors retained. |
| ChatGPT and Claude | Existing vector representations distributed by [Lobe Icons](https://github.com/lobehub/lobe-icons), with its MIT license alongside them. Displayed as monochrome symbols and plain text product labels, not invented brand wordmarks. Vendor ownership remains with OpenAI and Anthropic; these files are not official vendor brand downloads. |
| UI icons | [Lucide Static 0.468.0](https://www.npmjs.com/package/lucide-static/v/0.468.0), with its ISC license. No other UI icon family is used. |
| Fonts | Krona One Regular and Geist variable from [Google Fonts](https://github.com/google/fonts), with their OFL files. Served locally, without external font requests. |
| Kettle | Existing transparent neutral poster from the selected 32k hybrid identity. Provenance remains in [visual-checks.json](../visual-checks.json). |

## MCP support and claim boundary

Primary sources inspected for the proposed ecosystem strip:

- [ChatGPT custom MCP connections](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt): account/workspace/plan requirements apply.
- [Claude remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
- [Hermes MCP guide](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/use-mcp-with-hermes.md).
- [OpenClaw MCP CLI](https://docs.openclaw.ai/cli/mcp): distinguishes outbound client registry from running OpenClaw as a server.
- [Pi MCP guide](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/mcp.md): the retrieved current guide documents stdio/Streamable HTTP and OAuth support. Historical statements that Pi never supports MCP are not the current contract.

This establishes ecosystem relevance, not end-to-end acceptance with Connect. Keep the existing ChatGPT/Hermes guide paths, check current client requirements before shipping, and validate each advertised connection separately. Do not call these partners, customers or universally supported plans/devices. No account authentication or real-client integration test was performed for this design revision.

## pen.dev render derivatives — 2026-10-31

The editor did not reliably render SVG image fills. Monochrome light/dark SVG derivatives of ChatGPT, Claude and Hermes preserve the source path geometry and replace fill colors only. Nine PNG derivatives are faithfully rasterized from these vectors and the original AimHarder/OpenClaw/Pi artwork using `@resvg/resvg-js` 2.6.2; the canvas uses these PNG files. No brand artwork was manually reconstructed or AI-generated. Source/derived relationships and hashes are recorded in `sources.json`; the web prototype retains its existing SVG assets. The conversion package was installed only in a temporary tool directory, without modifying project dependencies or lockfiles.


## Desktop-only refinement assets — 2026-10-31

The two active AIHarder desktop views use the unedited original Hermes portrait (`hermes-avatar.png`) from the official site instead of its wing. OpenClaw/Pi monochrome SVG/PNG derivatives preserve their original paths for the compact hero row. Existing assets used by the six frozen variants were not overwritten. URLs, transformations and hashes are in `sources.json`.


## Graphic hero poses — 2026-10-31

`kettle-hero-attention.png` and `kettle-hero-thinking.png` are 768px RGBA renders from the unchanged 32k body and complete curved eye rig. The [pose renderer](../render-hero-pose.html) and [pose manifest](../hero-pose-assets.json) record reproducible body/gaze parameters, alpha bounds and source hashes. No user reference image was copied into the repository, no raster retouch was performed and no new AI artwork was generated.

## Flat header mascot — 2026-11-01

`kettle-flat-light.svg` and `kettle-flat-dark.svg` use the existing neutral poster alpha as an automatically traced vector silhouette. The handle hole is retained; a white face circle and navy eye capsules provide the requested flat construction. Dark retains navy/white fills with a thin light outer keyline. [Exporter](../render-flat-mark.html) and [surface study](../hero-surface-study.md) record the method. Original PNG/model assets are unchanged. React Bits background source has a separate retained [license notice](../vendor/README.md).

The preceding avatar trial displayed the unchanged Hermes girl portrait as a 20px circular avatar with CSS grayscale/0.8 contrast. Source hashes and the shared logo-row opacity are unchanged. This is a reversible display treatment, not a replacement client logo or new artwork.

## selfh.st Hermes and OpenClaw SVG variants — 2026-11-01

Current HTML uses the unmodified SVG variants from the owner's [Hermes Agent](https://dashboardicons.com/icons/external/selfhst/hermes-agent) and [OpenClaw](https://dashboardicons.com/icons/external/selfhst/openclaw) links, supplied by [selfh.st/icons](https://selfh.st/icons/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The complete [collection license](apps/selfhst-LICENSE.txt) is retained. Credits/license links appear in the prototype's review footer; keep attribution when integrating the assets into a later website. Original names/trademarks remain with their respective owners.

The copied revision is `02dd039d62a8e7132f4828e69162fca30bd43bb5`. Local filenames describe the **UI theme**: `*-selfhst-light.svg` copies the upstream `*-dark.svg` black artwork for Light, and `*-selfhst-dark.svg` copies the upstream `*-light.svg` white artwork for Dark. OpenClaw's source gradients and all SVG paths are preserved. Both icons render at 24px with no avatar crop or filter; the shared row remains at 65% opacity. The earlier portrait treatment is superseded, and its source remains for frozen variants/history. URLs, variants and SHA-256 values are in [sources.json](sources.json).
