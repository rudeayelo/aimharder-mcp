# Kettle delivery compression study

## Result — 2026-10-30

The owner accepted the revised motion direction and requested lower weight. This compression-only trial initially defaulted to the **64k SOG candidate**. The owner subsequently accepted 32k at the intended logo size; the current [hybrid eye study](hybrid/README.md) defaults to an edited 32k body and complete curved recess geometry. The original and compression-only profiles remain selectable. The owner accepted the curved eye appearance and curiosity refinement; the look-around/body-flex experiments and production delivery remain pending.

[Open the comparison through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/idol-motion-prototype/?asset=64k). Use **Model** to compare assets and **Logo scale** to inspect readability at roughly 68 CSS pixels tall in the desktop preview. The same pose definitions, camera presets and source bounds apply to every profile.

| Model | Gaussians | Exact bytes | Decimal size | Model reduction |
| --- | ---: | ---: | ---: | ---: |
| Original PLY | 262,144 | 17,826,208 | 17.83 MB | — |
| Full-count SOG | 262,144 | 2,992,064 | 2.99 MB | 83.22% |
| 64k SOG | 65,536 | 800,656 | 801 KB | 95.51% |
| 32k SOG | 32,768 | 418,296 | 418 KB | 97.65% |

SOG is a delivery format comprising compressed WebP attribute textures in a bundle, supported by the existing Visus `SogsLoader`. The output here is SOG version 2. Full-count conversion retains the number of Gaussians but **quantizes attributes**; it is not lossless. Count reduction uses pairwise merging, not random point deletion. See the [official SplatTransform documentation](https://github.com/playcanvas/splat-transform) and [SOG format specification](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/sog/).

A gzip estimate for the original PLY was 13,396,475 bytes: considerably larger than SOG, with the same Gaussian count and rendering workload. This is a compression estimate, not an HTTP delivery measurement.

## Renderer and runtime

The previous module graph at commit `ff717ef` totaled 2,097,151 JavaScript bytes. The first compression pass produced a **563 KB** script. The first eye-insert trial used **594 KB**. The current curved-recess revision serves approximately **569 KB** (exact current value in the manifest), including Three.js, Visus, OrbitControls, pose data and application code. The same dependencies and local license files are retained. No root package dependency or lockfile changed.

- 64k model plus script: approximately **1.37 MB** before HTTP compression; HTML and the 35 KB font are additional.
- 32k model plus script: approximately **985 KB**, with the same exclusions.
- Bundle gzip estimate: approximately **148 KB**. The current Python static preview does **not** serve gzip, so this is not claimed as actual transferred bytes. HTTP compression is a later hosting improvement.
- Only the selected model downloads. Source/vendor files are retained for rebuilding and manual comparison but are not automatically fetched by the bundled page.
- The animation loop stops at the final pose. Camera changes, resize and asynchronous sorter completion request individual renders. Gesture poses remain sampled at 12 fps, while sorting/interaction can request extra draws.

SOG lowers transfer weight; full-count SOG does not reduce Gaussian workload. The 64k candidate has 75% fewer Gaussians and the 32k candidate 87.5% fewer, but no proportional FPS, GPU memory or battery improvement is asserted without measurement.

## Observations and limits

Chrome successfully rendered the original, full-count, 64k and 32k profiles over the actual Tailscale HTTPS URL. The frontal face, two orange eye capsules, circular inset and handle remain recognizable in all three compressed profiles at the inspected size. The 32k profile was also inspected at logo scale. The 64k profile played the tilted spin from a three-quarter view. The default 64k profile rendered at a simulated 390 × 844 viewport with no horizontal overflow; this is desktop browser emulation, not physical-device acceptance. JavaScript syntax checks, artifact hashes, new local documentation links and Tailscale HTTP 200 checks passed. Lower-count detail is an approximation; small recessed contours can soften, particularly on close inspection. This is a visual review, not proof of perceptual equivalence.

The 64k candidate was the initial conservative default. The owner subsequently selected the 32k direction for the logo. No new image/model generation or API charge was involved. Source PLY SHA-256 is unchanged. Formal image-error metrics, cold remote-network latency, physical mobile performance, codec profiling and production rollout remain unverified.

## Rebuild

The checked-in bundle and assets can be viewed with the existing Python static-server command in the [prototype README](README.md). To rebuild, Node.js 22+ and npm are required. The tools run locally; npm may download pinned packages on first use.

```sh
# Rebuild the renderer and measurement manifest after source edits.
python3 design/identity/idol-motion-prototype/rebuild.py

# Also regenerate the SOG profiles from the original PLY.
python3 design/identity/idol-motion-prototype/rebuild.py --models
```

The script pins `@playcanvas/splat-transform@3.10.3` and `esbuild@0.25.12`. It uses CPU conversion and temporary decimated PLY intermediates. Regeneration is not claimed byte-identical across tool/platform changes; the current [manifest](optimized/manifest.json) records exact hashes and sizes of the delivered artifacts.

This remains a design prototype. No change is made to MCP behavior, authentication, security, distribution or architecture, and existing ADRs remain unaffected.
