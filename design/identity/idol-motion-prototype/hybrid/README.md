# Curved, deformable eye-recess study

## Brief and current status

The owner accepted the 32k body for the intended logo size. The first hybrid trial animated orange inserts inside stationary sockets; the owner rejected that behavior and also identified that the inserts were flat instead of following the pseudo-spherical face. This revision replaces that construction with complete deformable recesses on a fitted curved surface. Owner perceptual acceptance remains pending.

[Open the curved-eye prototype through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/idol-motion-prototype/?asset=hybrid&view=detail). Choose **Double blink**, then **Three-quarter** or **Eye detail**. The slider freezes intermediate poses; **Curiosity** moves the entire recess along the face. The original fixed-eye profiles remain available for comparison.

## Complete recess geometry

Each eye is one indexed surface patch with a continuous orange floor, dark cavity walls, bevel/lip and surrounding navy face. The floor, walls and lip share the same moving capsule contour. Closing an eye shrinks the complete cavity into a narrow crease and reduces its depth; the former vertical socket does not remain behind. Gaze shifts and size changes also move/deform the surrounding carved feature. The outer edge of the surface patch joins the stationary face.

The patches are **not flat cards or a pair of upright capsules**. [prepare-body.py](prepare-body.py) fits a quadratic front surface to navy Gaussian samples outside both old eye cavities. [face-surface.json](face-surface.json) records the coefficients, 363 fitting samples and RMS residual of approximately 0.0023 source units. [eye-rig.js](eye-rig.js) projects every floor/wall/lip vertex onto that surface and displaces the recess inward along its local surface normal. Both vertical curvature and the different lateral orientation at each eye are retained. The surface fit is an approximation of the source, not an exact recovered mesh.

The original stationary rims/walls must be cleared as well as the orange fill. The preparation script moves 7,238 Gaussians within bounded capsule regions to navy backing well behind the fitted surface, then decimates the derivative to 32,768 Gaussians and encodes SOG. The original PLY is untouched. Decimation remains a lossy whole-object operation.

The rig has 3,074 vertices in two meshes. Positions, normals and vertex colors update with the pose. Navy colors are fitted from the source; baked-style shading supplies the cavity depth cues. Texture matching at close range remains approximate. No image, light or texture download is added.

## Expressions and timing

- **Double blink:** one second at 24 fps, retaining the earlier preferred cadence. Each blink has one halfway exposure, two closed exposures and one halfway exposure; four open exposures separate the blinks. Closed indices are 4/5 and 12/13 (zero-based).
- **Curiosity:** 1.5 seconds at 12 fps. Gaze and asymmetric eye height deform the whole carved recess while it follows the curved face.
- **Hop / spin:** body timing stays at 12 fps. Complete eye cavities close in anticipation and reopen on takeoff.

The first and last body/eye poses are exactly equal. There is no cursor tracking, mouth, brows, limbs or production integration.

## Weight and rebuild

Current body: **414,243 bytes**. Current renderer/rig script: approximately **567 KB**; exact bytes and hashes are in the [delivery manifest](../optimized/manifest.json). Body plus script is approximately **981 KB**, excluding HTML and the shared 35 KB font. The simpler procedural geometry removes the earlier extrusion dependency. Gzip remains an estimate, not the preview's actual transport.

```sh
# Regenerate the curved-face fit, cleaned body, bundle and manifest.
python3 design/identity/idol-motion-prototype/rebuild.py --eyes

# Only rebuild JavaScript after editing the rig or timing.
python3 design/identity/idol-motion-prototype/rebuild.py
```

## Verification — 2026-10-30

- Actual open and closed poses inspected in Chrome from front and three-quarter views. The closed pose no longer retains the original tall cavity outlines. Eye-detail inspection shows the local surface orientation and depth. Rear occlusion and whole-recess curiosity movement were also checked.
- Numerical geometry audit passed: finite vertices, cavity-wall motion, lip-height collapse from approximately 0.152 to 0.0049 normalized units, and exact restoration of all vertex positions at neutral.
- The same audit confirmed opposite lateral components of the two eye surface normals, non-zero vertical tilt, and non-planar vertical curvature. Local raw-source normals at the eye centers are approximately `(0.945, -0.286, +0.160)` and `(0.946, -0.285, -0.157)`.
- JavaScript syntax, the complete `rebuild.py --eyes` pipeline, source checksum, artifact hashes, Tailscale delivery and local documentation links were checked.
- [Open three-quarter capture](open-quarter.png), [closed three-quarter capture](closed-quarter.png) and [open close-up](curved-open-detail.png) / [closed close-up](curved-closed-detail.png) record the revision.

Physical mobile performance, exact texture continuity, extreme-angle occlusion and owner appearance/timing acceptance remain pending. This is an isolated prototype; MCP behavior, authentication, distribution and existing architecture ADRs are unaffected.
