# Hybrid eye-animation study

## Brief and current status

The owner accepted 32k as sufficient at the intended logo size and authorized the proposed hybrid: Gaussian kettle body plus two independent 3D eye capsules. This is an isolated prototype for issue #95, not a production architecture decision. Owner acceptance of the new eye appearance and timing remains pending.

[Open the hybrid through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/idol-motion-prototype/?asset=hybrid). Choose **Double blink**, **Curiosity**, or **Little hop**, then inspect **Front**, **Three-quarter**, and **Logo scale**. The frame slider freezes any pose. Repeat is opt-in. Comparison profiles retain the original fixed eyes and disable the eye-only clips.

## Body preparation and rig

The original 262,144-Gaussian PLY remains unchanged. [prepare-body.py](prepare-body.py) locates warm eye-fill Gaussians only within two bounded eye regions. It recolors 1,505 Gaussians to navy and recesses their centers by 0.028 source units, creating dark backing beneath the retained socket rims. The derivative is decimated to 32,768 Gaussians and encoded as SOG. It does not regenerate the character or edit the blue body globally. Decimation itself is a lossy whole-object operation, as in the earlier compression study.

[eye-rig.js](eye-rig.js) creates two small beveled capsule meshes, sharing geometry/material and parented to the same moving body pivot. Original source coordinates and canonical framing place them inside the sockets. Fixed vertex-color shading approximates the baked illumination of the source; there is no new light or texture download. The orange meshes scale independently in height and move slightly within the sockets. Standard opaque mesh depth plus Gaussian compositing provide view-dependent occlusion; the source dark rims remain stationary relative to the face.

This is a first geometric fit, not a claim that the old sculpted eye contours and new mesh contours are identical. The closed pose leaves a narrow orange slit in a dark socket. Small contour/shading differences remain subject to owner review.

## Expressions and timing

- **Double blink:** one second at 24 fps, retaining the owner's earlier preferred speed. Each blink has one halfway exposure, two closed exposures, one halfway exposure, and four open exposures between blinks. Closed exposure indices are 4/5 and 12/13 (zero-based). The other exposures hold the open pose.
- **Curiosity:** 1.5 seconds at 12 fps. Small lateral gaze, up to 12% asymmetric eye-height change and a restrained body lean, then neutral.
- **Hop / spin:** body timing remains 12 fps. Eyes close in anticipation and reopen on takeoff. The existing body motions are retained.

Every clip's first/last eye parameters and body pose are exactly equal. No cursor tracking, brows, mouth, limbs, random expression scheduler or production embedding is introduced.

## Weight and regeneration

Current body: **415,108 bytes**, compared with 418,296 bytes for the earlier unedited 32k profile. The shared renderer bundle is **593,882 bytes**, up 30,597 bytes from the compression-only bundle. Body plus script totals **1,008,990 bytes**, excluding HTML and the shared 35 KB font. Actual hashes and current sizes live in the [delivery manifest](../optimized/manifest.json); gzip remains an estimate rather than an enabled preview transport.

```sh
# From the repository root: regenerate only the hybrid body, bundle and manifest.
python3 design/identity/idol-motion-prototype/rebuild.py --eyes

# Only rebuild JavaScript and measurements after rig/timing edits.
python3 design/identity/idol-motion-prototype/rebuild.py
```

Tool versions remain pinned by the parent rebuild script. [body-edit.json](body-edit.json) records the source checksum and edit operation. The original PLY checksum is unchanged.

## Verification — 2026-10-30

- Actual hybrid SOG and generated mesh eyes rendered in Chrome through the Tailscale HTTPS preview.
- Open and closed poses inspected from the front and three-quarter views; the original orange fill did not visibly remain as duplicate open eyes. The mesh eyes were not visible from the rear view.
- Curiosity's gaze/height change and the hop's closed-eye anticipation were inspected with the pose slider.
- Numerical audit passed for finite eye values, positive eye scales, exact body/eye neutral endpoints across all five clips, and the two prescribed pairs of closed blink exposures.
- JavaScript syntax checks and the complete `rebuild.py --eyes` pipeline passed. HTTP delivery, artifact hashes and local documentation links were checked separately.
- [Open three-quarter capture](open-quarter.png) and [closed three-quarter capture](closed-quarter.png) record the inspected poses.

Physical mobile performance, extreme-angle occlusion, exact visual equivalence and owner perceptual acceptance remain unverified. This changes no MCP/API/authentication behavior or distribution decision; existing ADRs are unaffected.
