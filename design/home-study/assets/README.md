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
