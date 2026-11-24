# ADR: Own Gaussian-splat renderer for the Kettle module

Status: accepted on 2026-11-24 for [#146](https://github.com/rudeayelo/aimharder-mcp/issues/146), after a time-boxed renderer spike. Applies to the [Kettle module](../../kettle/README.md); it does not change the Worker or its Content-Security-Policy.

## Context

The Kettle ships in the landing and in portal onboarding from one framework-free module ([#146](https://github.com/rudeayelo/aimharder-mcp/issues/146)). Its body is [`kettle-body-32k.sog`](../../design/assets/kettle/README.md), a SOG v2 bundle of 32,768 Gaussians. Iteration 1 drew it with a vendored copy of `@speridlabs/visus` 2.5.0 plus a local patch (`affine-sort.js`) because Visus sorts as if the body were rigid. The new style direction (strong squash and stretch, bends, handle lag, twist smears, multiple-image frames) needs per-splat deformation, and the module must run under a strict policy with `script-src 'self'` and no `eval`.

The spike compared three options with the real asset, in headless Chromium 155 (SwiftShader WebGL, this machine's CPU), with three.js 0.187.0 and `esbuild --minify`:

| | Own loader and renderer | `@speridlabs/visus` 2.5.0 | `@sparkjsdev/spark` 2.4.0 |
| --- | --- | --- | --- |
| Licence | MIT (this repository) | Apache-2.0 | MIT |
| Bundle without three.js (min / gzip) | 44.7 KB / 17.7 KB, whole module | 49.6 KB / 17.0 KB | 2,701.6 KB / 950.3 KB (inlined WASM) |
| Bundle with three.js (min / gzip) | 577.7 KB / 149.5 KB | 585.9 KB / 150.3 KB | 3,237.5 KB / 1,083.9 KB |
| Depth sort, 32k splats | 0.2 ms median, 0.4 ms p95, main thread, synchronous (16-bit counting sort) | Worker from a `blob:` URL, asynchronous | WASM in a worker from a `blob:` URL, asynchronous |
| Per-splat deformation | Any deformation; covariances carried by the Jacobian. 6.4 ms median (7.0 ms p95) per deformed exposure, at most 12 per second | Rigid or affine object matrix only; affine needs the iteration-1 sort patch | GPU shader graph (`dyno`) modifiers; capable, but a large API to learn and ship |
| Loads under `default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'` | Yes | No: decodes WebP through `blob:` images (needs `img-src blob:`) and starts a `blob:` worker | No: needs `'wasm-unsafe-eval'` and `blob:` workers (`worker-src` or `script-src blob:`) |

Both libraries loaded and rendered the asset without a policy. Sort and frame times for the libraries were not measured beyond that: their sorts run off the main thread, so their cost does not show up in a frame time, and neither passed the policy, which decided the comparison first.

## Decision

- The Kettle module ships its **own SOG v2 reader and splat renderer on three.js**: a stored-zip reader, WebP attribute decoding read back exactly through a throwaway WebGL2 context, an instanced-quad splat shader and a main-thread counting sort. No worker, no WASM, no `blob:` or `data:` URLs.
- **Deformation runs on the CPU, once per 12 fps exposure.** The same TypeScript function moves splat centres, carries each covariance by its finite-difference Jacobian (J Σ Jᵀ), deforms the eye rig and finds the floor contact, so the body, the eyes and the sort always agree. Rigid motion (rotation, lift, drag turn) stays in the object matrix and costs only a re-sort.
- three.js is the only runtime dependency, installed from npm.

## Consequences

- The module's CSP needs are exactly `script-src 'self'` for the bundle, `connect-src` for the `.sog` URL and `img-src` for the poster; nothing else ([module README](../../kettle/README.md#content-security-policy)). The portal or landing implementation still has to add those to the Worker's `default-src 'none'` policy; this ADR does not change it.
- Splat drawing, SOG parsing and sorting are now code this repository maintains. SOG features the asset does not use (higher spherical-harmonics bands in `shN`, compressed zip entries) are rejected with a clear error rather than supported or silently ignored, and so are truncated archives, metadata that does not match its textures and failed texture readbacks.
- Deformation is limited by CPU time per exposure (6.4 ms on the spike machine for 32k splats); a much larger body, or deformation at display rate, would need a GPU path.
- Gaussian splats have no skeleton: deformations are space warps (squash, bulge, bend, twist, handle flop). The handle bends as a soft region of the same body, not as a jointed part.
- Iteration 1's vendored Visus and `affine-sort.js` stay only at the archive tag.
- The multiple-image frames named in the context were later rejected ([#134](https://github.com/rudeayelo/aimharder-mcp/issues/134)) and removed with their extra splat layers ([#148](https://github.com/rudeayelo/aimharder-mcp/issues/148)); the module draws one body. The decision is unchanged: squash, stretch, bends and twist still need per-splat deformation.
