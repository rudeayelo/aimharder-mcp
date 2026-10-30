# Curved, deformable eye-recess study

## Brief and current status

The owner accepted the 32k body for the intended logo size. The first hybrid trial animated orange inserts inside stationary sockets; the owner rejected that behavior and also identified that the inserts were flat instead of following the pseudo-spherical face. This revision replaces that construction with complete deformable recesses on a fitted curved surface. The owner liked the curved-recess revision and accepted the stronger, slower curiosity expression. The later look-around and planted-base body-flex experiments await owner review.

[Open the curved-eye prototype through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/idol-motion-prototype/?asset=hybrid&view=detail). Choose **Double blink**, then **Three-quarter** or **Eye detail**. The slider freezes intermediate poses; **Curiosity** moves the entire recess along the face. The original fixed-eye profiles remain available for comparison.

## Complete recess geometry

Each eye is one indexed surface patch with a continuous orange floor, dark cavity walls, bevel/lip and surrounding navy face. The floor, walls and lip share the same moving capsule contour. Closing an eye shrinks the complete cavity into a narrow crease and reduces its depth; the former vertical socket does not remain behind. Gaze shifts and size changes also move/deform the surrounding carved feature. The outer edge of the surface patch joins the stationary face.

The patches are **not flat cards or a pair of upright capsules**. [prepare-body.py](prepare-body.py) fits a quadratic front surface to navy Gaussian samples outside both old eye cavities. [face-surface.json](face-surface.json) records the coefficients, 363 fitting samples and RMS residual of approximately 0.0023 source units. [eye-rig.js](eye-rig.js) projects every floor/wall/lip vertex onto that surface and displaces the recess inward along its local surface normal. Both vertical curvature and the different lateral orientation at each eye are retained. The surface fit is an approximation of the source, not an exact recovered mesh.

The original stationary rims/walls must be cleared as well as the orange fill. The preparation script moves 7,238 Gaussians within bounded capsule regions to navy backing well behind the fitted surface, then decimates the derivative to 32,768 Gaussians and encodes SOG. The original PLY is untouched. Decimation remains a lossy whole-object operation.

The rig has 3,074 vertices in two meshes. Positions, normals and vertex colors update with the pose. Navy colors are fitted from the source; baked-style shading supplies the cavity depth cues. Texture matching at close range remains approximate. No image, light or texture download is added.

## Expressions and timing

- **Double blink:** one second at 24 fps, retaining the earlier preferred cadence. Each blink has one halfway exposure, two closed exposures and one halfway exposure; four open exposures separate the blinks. Closed indices are 4/5 and 12/13 (zero-based).
- **Curiosity:** 26 exposures / 2.17 seconds at 12 fps. The approach to the initial lean now takes 12 frame intervals / one second, exactly three times its previous four intervals. The hold, return and final settle retain their previous exposure spacing. At peak, one eye has 45% neutral height and the other 125%; gaze and the complete carved recess follow the curved face. Body and eyes use the same retimed approach.
- **Look around:** 43 exposures / 3.58 seconds at 12 fps. From the viewer's perspective: up-right → up-left → right → down → center. Each outward move takes four frame intervals with a three-interval hold. The final return takes twelve intervals / one second, followed by two settling exposures. The body follows vertical gaze by two frames with up to ±4° pitch. Horizontal/vertical gaze offsets are bounded to 0.024 / 0.028 source units; the entire curved recess moves while its outer face seam remains stationary.
- **Body flex:** 26 exposures / 2.17 seconds at 12 fps. A shared affine transform compresses/stretches the body to 86–114% height and moves the handle forward/backward via shear while the floor plane stays flat. Both complete eye patches inherit exactly the same transform as the Gaussian body; no eye-only offset compensates for the deformation. Details and captures are in the [body-deformation notes](../README.md#planted-base-body-deformation).
- **Hop / spin:** body timing stays at 12 fps. Complete eye cavities close in anticipation and reopen on takeoff.

The first and last body/eye poses are exactly equal. There is no cursor tracking, mouth, brows, limbs or production integration.

## Weight and rebuild

Current body: **414,243 bytes**. Current renderer/rig script: approximately **569 KB**; exact bytes and hashes are in the [delivery manifest](../optimized/manifest.json). Body plus script is approximately **983 KB**, excluding HTML and the shared 35 KB font. The simpler procedural geometry removes the earlier extrusion dependency. Gzip remains an estimate, not the preview's actual transport.

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
- Curiosity timing audit passed: initial approach is exactly 3× longer, every hold/return body exposure and expression-strength sample is preserved after the eight-frame offset, and neutral endpoints match. All rig positions, normals and colors remain finite across every emote, including the stronger asymmetric pose; neutral geometry restores exactly. [Curiosity detail capture](curiosity-detail.png) records the peak expression.
- Look-around audit passed: requested waypoint order, three-times-longer final return, two-frame body lag, exact neutral reset, finite positions/normals/colors for every emote, fixed outer seams and floor centers on the curved surface. Chrome playback reached frame 43 / 43; upper and lower gaze poses were inspected in the eye-detail view. [Upper gaze capture](look-up-detail.png) / [lower gaze capture](look-down-detail.png) record this experiment.
- [Open three-quarter capture](open-quarter.png), [closed three-quarter capture](closed-quarter.png) and [open close-up](curved-open-detail.png) / [closed close-up](curved-closed-detail.png) record the revision.

Physical mobile performance, exact texture continuity, extreme-angle occlusion and owner acceptance of the look-around and body-flex gestures remain pending. This is an isolated prototype; MCP behavior, authentication, distribution and existing architecture ADRs are unaffected.
