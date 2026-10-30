# IDOL motion prototype

## Question and scope

Can the owner's IDOL reconstruction preserve the kettle's identity while supporting controlled stop-motion emotes? This is a throwaway, isolated study for issue #95 on `codex/95-symbol-motion-prototype`. It does not replace the wordmark study, generated videos, or production UI. Owner acceptance is pending.

Open `index.html` through a static server. From the repository root:

```sh
python3 -m http.server 8945 --bind 127.0.0.1 --directory design/identity
```

Then open `/idol-motion-prototype/` on that server. The existing tailnet-only preview is [available through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/idol-motion-prototype/). The server must remain running for this URL to work. No installation or external runtime CDN is needed.

## Source and dependencies

- Owner-supplied `idol-seed42-262144-b8531060.ply`, copied unchanged to `kettle.ply`. Full checksum and provenance are in [asset-manifest.json](asset-manifest.json).
- 262,144 Gaussian splats, 17,826,208 bytes. All 17 float32 properties are finite. No polygon faces or facial rig are present.
- [IDOL](https://github.com/speridlabs/idol-sdk) generates standard Gaussian PLY objects from a single image. The unseen sides are reconstructed, not evidence of a separately designed canonical rear view.
- Locally vendored `@speridlabs/visus` 2.5.0 (Apache-2.0) and Three.js 0.175.0 (MIT), downloaded from their npm tarballs. See vendor license files and original Visus README. No root dependency or lockfile changes.
- Runtime normalization flips the Y-down export around X, keeps the face toward +X, and places its base at the animation pivot. Original Gaussian data and colors are unchanged.

## Motion and inspection

Three selectable two-second motions each hold 24 poses at 12 fps:

- **Rock:** alternating lateral tilts with diminishing amplitude.
- **Little hop:** small anticipation, lift, landing and settling rock.
- **Tilted spin:** hop, full rotation around the vertical axis, up to 30 degrees of lateral tilt and landing wobble.

The first and last poses use exactly the same neutral transform. These are whole-object transforms; there is no new AI generation, eye animation, squashing, dynamic relighting or physical collision simulation. The renderer may refresh more often than 12 fps while the motion pose changes only at 12 fps. The frame slider freezes the selected pose. Front/quarter/back/side buttons and drag/zoom support visual inspection. Repetition is opt-in; automatic initial playback respects reduced-motion preference.

## Verification — 2026-10-30

- Actual PLY loaded/rendered in Chrome using the Tailscale HTTPS URL. Front, three-quarter and rear views were visually inspected; the face and handle remain recognizable. Source orientation was corrected after the first render.
- Rock, hop and tilted-spin playback controls were exercised; playback progressed and returned to frame 24 in the neutral pose. Scrubbing showed the lateral tilt. Endpoints are explicitly equal in code.
- At a simulated 390 × 844 viewport, the model rendered and the page had no horizontal overflow. This is desktop browser emulation, not real-device performance acceptance.
- `node --check motion.js` passed. Static page, model and local dependency URLs returned HTTP 200 through Tailscale.
- [Desktop preview](desktop-preview.png) records the rendered object.

This demonstrates a usable candidate for rigid motion. Eye deformation, export to video, compression, production integration, GPU/load-time measurements and physical-mobile acceptance remain unverified. No architecture, security, API or distribution decision is made; existing ADRs are unaffected.
