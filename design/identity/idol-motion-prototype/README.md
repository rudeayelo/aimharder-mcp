# IDOL motion prototype

## Question and scope

Can the owner's IDOL reconstruction preserve the kettle's identity while supporting controlled stop-motion emotes? This is a throwaway, isolated study for issue #95 on `codex/95-symbol-motion-prototype`. It does not replace the wordmark study, generated videos, or production UI. The owner liked the first 3D study and requested faster, more natural motion. The owner then preferred V2 and requested weight optimization. The owner accepted 32k for the intended logo size and authorized a hybrid eye-animation trial. The owner rejected the first fixed-socket/flat-insert trial; the current revision deforms complete eye recesses on a curved surface. Eye appearance and timing acceptance remain pending.

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
- Runtime normalization flips the Y-down export around X, keeps the face toward +X, and places its base at the animation pivot. The source PLY is unchanged; all profiles use its canonical bounds for consistent framing. Compressed derivatives quantize Gaussian attributes; lower-count derivatives also merge Gaussians.

## Motion and inspection

The current V2 timing keeps 12 fps and shortens the original two-second gestures:

| Gesture | Poses | Duration | Shorter than V1 |
| --- | --- | --- | --- |
| Rock | 14 | 1.17 s | 42% |
| Little hop | 16 | 1.33 s | 33% |
| Tilted spin | 18 | 1.50 s | 25% |

[Motion notes](animation-principles.md) map the twelve animation principles to this character. Hand-posed unequal spacing replaces uniform smoothstep interpolation. Hop/spin use parabolic lift and a small lateral arc, anticipation, volume-preserving squash/stretch, angular overshoot and asymmetric settling. The spin's peak tilt remains 30 degrees.

The first and last poses use exactly the same neutral transform. A sampled-center support correction approximates contact around the rounded base; it is not a physical collision solver. There is no new AI generation, independent handle animation or dynamic relighting. The current [hybrid eye study](hybrid/README.md) adds independent eye controls. The renderer may refresh more often than 12 fps while the motion pose changes only at 12 fps. The frame slider freezes the selected pose. Front/quarter/back/side buttons and drag/zoom support visual inspection. Repetition is opt-in; automatic initial playback respects reduced-motion preference.

## Verification — 2026-10-30

- Actual PLY loaded/rendered in Chrome using the Tailscale HTTPS URL. Front, three-quarter and rear views were visually inspected; the face and handle remain recognizable. Source orientation was corrected after the first render.
- V1 rock, hop and tilted-spin controls were exercised and returned to frame 24. V2 shortens them to 14/16/18 poses; Chrome playback and hop apex/landing scrubbing were checked. Endpoints are explicitly equal in the pose data.
- At a simulated 390 × 844 viewport, the model rendered and the page had no horizontal overflow. This is desktop browser emulation, not real-device performance acceptance.
- `node --check motion.js` and `node --check motion-poses.js` passed. A numerical pose audit passed for finite values, non-negative lift, positive scale, volume-preserving scale determinant and identical endpoint poses for all three gestures. Static page, model and local dependency URLs returned HTTP 200 through Tailscale.
- [Desktop preview](desktop-preview.png) records the rendered object. The [compression study](compression-study.md) records the subsequent SOG conversion, count reduction and browser checks.

This demonstrates a usable candidate for rigid motion. The revised curved-recess trial is implemented and visually checked; owner eye acceptance, video export, production integration, GPU/load-time measurements and physical-mobile acceptance remain pending. No architecture, security, API or distribution decision is made; existing ADRs are unaffected.

## Current delivery optimization

The owner selected the 32k direction. The comparison now defaults to the hybrid 32k body plus complete curved recesses (414,243-byte body); original PLY, full-count SOG, 64k and unedited 32k remain selectable. Only the selected model is requested; the original PLY is not a background dependency. The page loads the minified renderer bundle and renders on demand after an emote ends. See [compression results and regeneration](compression-study.md).

## Current eye trial

[Hybrid study](hybrid/README.md): two complete eye surfaces deform the floor, walls and lip together along the fitted face curvature. Double blink uses the previously preferred one-second / 24 fps cadence; body clips stay at 12 fps. Curiosity adds a small gaze offset and 12% eye-height asymmetry. Hop/spin anticipation closes the eyes. All clips restore the exact neutral body and eye pose.
