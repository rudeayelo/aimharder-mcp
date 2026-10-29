# Flat symbol motion prototype

**Throwaway experiment**, isolated on `codex/95-symbol-motion-prototype` for [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95). Do not merge the experimental page, switches or preview server into the hosted portal. Capture an owner-selected motion decision in the design handoff first, then implement the chosen behavior deliberately.

Question: can a flat SVG kettlebell with a circular face feel responsive and suggest volume using only cursor-following eyes, small face displacement and a slight tilt, for occasional use beside the logo?

The owner proposed this direction after observing [Grok Bot's public header](https://x.ai/bot). Browser inspection on 2026-10-29 confirmed the header symbol contains SVG paths and no canvas within the heading. Its code, paths and brand assets were not copied. The prototype adapts only the bounded interaction idea: responsive gaze and small expressive movement. It does not establish the reference's internal animation implementation.

## Run

From the repository root:

```sh
python3 -m http.server 8941 --bind 127.0.0.1 --directory design/identity/prototype
```

Private preview while that process runs: [Tailscale preview](https://mini.taild6f227.ts.net:8443/aimharder-symbol-95/). This is a development preview on the existing tailnet, not service deployment or public hosting. The added `/aimharder-symbol-95` Serve mapping proxies only this prototype directory to port 8941 and preserves existing routes. The preview stops working if the local process stops.

## Compare

- `?variant=eyes`: eye movement only, no body or face turn.
- `?variant=parallax`: eye movement, small circular-face displacement/compression and a subtle whole-symbol tilt. Default.
- `?variant=static`: stationary version; expressions can still be selected.

Bottom arrows cycle variants and update the URL; left/right keyboard arrows do the same when a form control is not focused. Controls expose neutral, happy, wink and curious expressions, one-shot blink, pause, reset and body-color candidates. The visible status line identifies current variant, expression and playback state. Controls are prototype scaffolding, not proposed product settings. The switcher is in normal document flow to avoid covering mobile controls; no alternate public-page layouts are being designed here.

## Scope and assets

SVG objects use flat solid fills, with no texture, gradient, shadow, raster assets, 3D model or external animation dependency. Eye recesses are intentionally not simulated in this flat alternative. The vector silhouette is an approximation for this interaction test, not an accepted replacement for the generated mark. The circular dark face and orange eyes preserve the selected facial direction; blue body remains provisional. Cursor position is transient in-memory presentation state and is not transmitted or stored.

The wordmark uses the actual **Krona One Regular** font from the [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/kronaone), downloaded 2026-10-29. The font is bundled unchanged with its [SIL Open Font License](assets/OFL.txt). Font identity is exact here; the owner has not selected final wordmark spacing or proportions. This does not recreate the lettering synthesized by the earlier image generator.

The page requests animation frames while playing, pauses its frame loop when the document is hidden, offers a manual pause, and implements a static response to `prefers-reduced-motion`. On coarse pointers it avoids hover tracking; a tap on the stage can set gaze. These are experimental choices, not accepted runtime contracts. Real mobile/touch and OS reduced-motion observations remain pending.

## Observed checks

- JavaScript syntax: `node --check` passed on the script extracted from the HTML. `git diff --check` passed.
- Chrome browser inspection through the actual Tailscale URL: local bundled font loaded; both the large symbol and the logo-sized symbol render; changing expression updates paths and the status line; moving the pointer changes gaze/face transforms; Pause resets motion transforms; the static variant has zero gaze displacement and disabled motion buttons. Variant controls changed the selected mode and URL. Body-color selection changes the symbol fill.
- Blink control was exercised without browser errors; precise timing and repeated-loop perception are not accepted by these observations.
- Desktop rendering inspected at 1200px; responsive layouts inspected at 390px and checked at 320px. No horizontal page overflow at 390/320px. An initially overlapping switcher was moved into document flow, and the final mobile preview shows exposed controls.
- [Desktop preview](desktop-preview.jpg) and [mobile preview](mobile-preview.jpg) capture actual browser renders. The mobile image shows a manually selected green/happy combination, not a selected brand color.
- No automated test suite or runtime typecheck was run: this is isolated HTML/SVG prototype code with no production TypeScript changes, service calls or behavior. No authentication, MCP, API, provider, deployment or sporting-action changes. Relevant product/identity ADR decisions remain unchanged; no new ADR is warranted for an unselected motion experiment.

Verdict: the mechanism is demonstrable and ready for owner review. Shape fidelity, preferred motion amount, eye proportions at final logo size, keyboard/screen-reader acceptance, actual touch devices and OS reduced-motion behavior remain to be settled. Do not treat this as production implementation or completion of #95.
