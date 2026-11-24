# Kettle 3D asset

`kettle-body-32k.sog` is the accepted 3D Kettle body from design iteration 1 of [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95). It is a Gaussian-splat model in SOG version 2 format (compressed WebP attribute textures in one bundle), 32,768 Gaussians, with the original eye cavities cleared so that a separate eye rig can draw and animate the eyes.

| Property | Value |
| --- | --- |
| File | `kettle-body-32k.sog` |
| Size | 414,243 bytes |
| SHA-256 | `28219dffc9d3a50cb4d79f0088bbe5a7a8ef977ed59c51a6b01faf5d508036d7` |
| Gaussians | 32,768 |
| Coordinate system | Source IDOL coordinates: x is front, y is down. Renderers flip Y around X and place the base at the animation pivot. |
| Copied from | `design/identity/idol-motion-prototype/hybrid/kettle-body-32k.sog` at tag [`archive/95-iteration-1`](https://github.com/rudeayelo/aimharder-mcp/tree/archive/95-iteration-1) (commit `75f80c5`), byte-identical |

The body alone does not show eyes. In iteration 1 the eyes were a separate procedural mesh (two deformable recesses projected onto a fitted curved face surface). That rig, the renderer bundle and the motion prototypes stay in the tag; production rebuilds them with npm dependencies (see [Product experience](../../../docs/product-experience.md#3d-kettle)).

## Provenance

1. **Source image.** A single image of the blue kettlebell character (blue body, dark circular face, orange recessed eyes) from the iteration-1 identity studies, which were generated with GPT Image. Which exact image was given to IDOL is not recorded in the tag.
2. **3D reconstruction.** The maintainer reconstructed that image with [IDOL](https://speridlabs.com/research/idol) (Sperid Labs, single image to 3D Gaussians) and supplied `idol-seed42-262144-b8531060.ply`: 262,144 Gaussians, 17,826,208 bytes, SHA-256 `48334af699ab95a12296ddd2f6f383ff97253777842a5e50c9f9eb90faebc3ae`. The rear and sides are reconstructed by the model, not separately designed. The PLY was not edited and stays in the tag only.
3. **Eye-cavity edit.** A preparation script fitted a quadratic surface to 363 navy samples of the face (RMS residual ≈ 0.0023 source units), then moved 7,238 Gaussians inside the original eye cavities, rims and orange fill to a navy backing 0.085 source units behind that surface.
4. **Decimation and encoding.** The edited body was reduced to 32,768 Gaussians by pairwise merging and encoded as SOG v2 with PlayCanvas [splat-transform](https://github.com/playcanvas/splat-transform) 3.10.3. Both steps are lossy.

The scripts (`prepare-body.py`, `rebuild.py`), the fit data (`face-surface.json`, `body-edit.json`) and the full manifest are at `design/identity/idol-motion-prototype/` in the tag.

## Licenses

| Component | Role | License |
| --- | --- | --- |
| [IDOL SDK](https://github.com/speridlabs/idol-sdk) and [IDOL weights](https://huggingface.co/speridlabs/idol) | Produced the source PLY | Apache-2.0 ([copy](licenses/idol-Apache-2.0.txt), from `speridlabs/idol-sdk` at `8db7003`; the Hugging Face model card also declares `apache-2.0`) |
| [DINOv3](https://huggingface.co/facebook/dinov3-vith16plus-pretrain-lvd1689m) | Model that IDOL downloads and runs at inference (IDOL SDK README) | [DINOv3 License](https://ai.meta.com/resources/models-and-libraries/dinov3-license) |
| [FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) | Model that IDOL downloads and runs at inference (IDOL SDK README) | FLUX Non-Commercial License |
| GPT Image (OpenAI) | Generated the source image | OpenAI terms of use for outputs |
| splat-transform | Tool for decimation and encoding only; no code ships in the asset | MIT |

**Open question.** The licenses of DINOv3 and FLUX.2-dev, and OpenAI's output terms, were not checked for how they apply to IDOL outputs or to a public pilot or a later commercial agreement. Check them before the asset ships on a public page. The renderer libraries used in iteration 1 (Three.js, MIT; `@speridlabs/visus`, Apache-2.0) are not part of this file; production brings its own dependencies with their licenses.
