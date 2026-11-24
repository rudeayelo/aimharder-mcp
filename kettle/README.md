# Kettle module and lab

The 3D Kettle character as one framework-free module (renderer, body, eye rig, clips, interaction), plus a local lab to review, tune and place its animations. It is written to be the module the product surfaces (landing, footer, portal onboarding) will import, so a value tuned in the lab becomes the production value. Today its only consumers are the lab and its tooling (tests, recorder, poster renderer); no product page imports it yet.

This package is private: it is not published to npm, not part of the root package and not versioned with changesets. The lab is a development tool and is never deployed or linked from the product. Design context: [Product experience § 3D Kettle](../docs/product-experience.md#3d-kettle). Renderer decision: [own splat renderer ADR](../docs/adr/2026-11-24-kettle-own-splat-renderer.md).

## Commands

Run from `kettle/` with Node 24:

```sh
pnpm install
pnpm lab            # http://127.0.0.1:5174/
pnpm lab --host     # also on the tailnet; prints the Tailscale URL
pnpm typecheck
pnpm test           # clip data, module boundaries and Chromium checks
pnpm record <dir> [clip-id ...] [--camera front,three-quarter] [--size 480]
pnpm poster         # re-renders design/assets/kettle/kettle-poster-front.png
```

`pnpm lab --host` listens on every interface, so the lab is reachable at `http://<machine>.<tailnet>.ts.net:5174/`. Use `--port <n>` to change the port. The Chromium checks and `pnpm record` use the first system Chromium or Chrome they find; set `KETTLE_CHROMIUM` to choose one. `pnpm record` needs `ffmpeg` and writes one MP4 and one GIF per clip and camera, stepping exposure by exposure rather than waiting on a clock.

## The lab

- **Viewer:** clip list with a keep / adjust / remove marker and a note per clip, play, loop, frame-by-frame stepping, speed, fixed cameras (front, three-quarter, side, eye detail) and free orbit. **Copy decisions as Markdown** produces the table to paste into [#134](https://github.com/rudeayelo/aimharder-mcp/issues/134), with any tuned values.
- **Tuning:** every timing (in exposures) and amount of the selected clip. **Copy as JSON** copies the entry in the format of [`src/tuning.json`](src/tuning.json); pasting it over the same key there makes it the module's value. **Apply pasted JSON** takes the same format back.
- **Interaction playground:** gaze following, poke and drag each switched on or off, stepped (12 fps) or smooth timing for gaze and drag, surface presets, the portal guide cue and celebration, and an event log. For touch, open the browser's device toolbar.
- **Compositions:** rough mockups of the landing hero, the footer and the portal onboarding cue (with its celebration dialog), each Kettle on its surface's defaults, coloured only with the phase 1 Figma variables in [`lab/public/tokens.css`](lab/public/tokens.css).
- Header toggles switch Light/Dark and simulate `prefers-reduced-motion` for every Kettle on the page. Markers, notes and tuned values persist in the browser's local storage; a saved tuned value is dropped when the module's defaults for its clip change (or the clip is removed), and markers and notes stay.

## Using the module

```ts
import { createKettle } from './kettle/src/index.ts';

const kettle = createKettle({
  container: document.querySelector('#kettle')!, // sized by CSS; the canvas fills it
  asset: '/assets/kettle-body-32k.sog',
  poster: '/assets/kettle-poster-front.png', // design/assets/kettle/; shown while loading and without WebGL
  surface: 'landing', // landing | footer | portal | none
});
await kettle.ready;
await kettle.play('double-blink');
kettle.setGaze({ x: 0.8, y: 0.3 }); // look at something (portal guide); null releases it
```

| API | Purpose |
| --- | --- |
| `play(id, { loop, speed, mirror, intensity })` | Plays a clip; resolves when it ends, is replaced or is skipped under reduced motion. |
| `pause()`, `resume()`, `seek(frame)`, `stop()`, `setSpeed()`, `setLoop()` | Review controls. |
| `setGaze(target \| null)` | Points the eyes and a little of the head at a normalised target. |
| `setInteractions({ gaze, poke, drag })`, `setTiming({ gaze, drag })` | Interaction switches; `stepped` (12 fps, the default for both) or `smooth` (display rate). |
| `setReducedMotion('auto' \| boolean)` | `auto` follows `prefers-reduced-motion`. |
| `setTuning(tuning)`, `setCamera(preset \| view)`, `subscribe(listener)`, `state`, `destroy()` | Live tuning, camera, observation and teardown. |

Defaults by surface, from `SURFACES` in [`src/kettle.ts`](src/kettle.ts). `surface` sets them; the `interactions`, `timing`, `pokeClips` and `entrance` options override them. They are **provisional** ([motion spec](../docs/product-experience.md#kettle-motion-spec)).

| Surface | Gaze follows the cursor | Click or tap | Drag to turn | Entrance |
| --- | --- | --- | --- | --- |
| `landing` (hero) | Yes, stepped at 12 fps (mouse and pen only, never touch) | Alternates `poke` and `little-hop` | Yes, stepped at 12 fps | None |
| `footer` | Yes, stepped at 12 fps (mouse and pen only, never touch) | Alternates `poke` and `little-hop` | Off | `double-blink` once, the first time it is seen; then still |
| `portal` | No; the page drives `setGaze` and `play` | Off | Off | None |
| `none` | Off | Off | Off | None |

The entrance is decided the first time the Kettle can be seen (loaded, on screen, tab visible), not when the body finishes loading: a clip the page plays before then replaces it, and reduced motion is read at that moment.

The Kettle draws only when something changes (an exposure, the gaze, a drag, the camera), and pauses while the container is off-screen, the tab is hidden or the body is still loading. Clip time and the drag spring stand still meanwhile, so a clip started out of view plays from its first exposure once it is seen. Without WebGL2, or after a lost context, it shows the poster. `play()` always settles: at once in poster mode, and when the context is lost or the Kettle is destroyed.

Pointer rules: one pointer at a time (a second finger during a drag is ignored); a cancelled pointer or lost capture springs the turn back with no reaction; the fling speed is measured at the release, so dragging fast and then holding still before letting go plays no reaction; a release outside the canvas never pokes. Under reduced motion the turn returns without passing the front, and the gaze stays within ±0.35 whatever the tuning or `setGaze` asks for.

## Content-Security-Policy

The module needs nothing beyond `'self'` sources: no inline script, no `eval`, no WASM, no workers, no `blob:` or `data:` URLs. It sets inline styles only through the CSSOM (`element.style`), which `style-src` does not restrict. A page that hosts it needs:

| Directive | Value | Why |
| --- | --- | --- |
| `script-src` | `'self'` | The bundled module (including three.js). |
| `connect-src` | the origin of `kettle-body-32k.sog` | The body is fetched with `fetch()`. |
| `img-src` | the origin of the poster | Only when a `poster` is used. |

The lab serves every page with `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`, and the Chromium checks fail on any CSP violation. The Worker's current policy is `default-src 'none'`, so the portal and landing implementation must add the rows above; this package does not change it.

## Clips

Clips are data: keyed poses on a 12 fps exposure grid (stop-motion on twos), built from tunable timing and amounts ([`src/library.ts`](src/library.ts), values in [`src/tuning.json`](src/tuning.json)). Every clip starts and ends on the same neutral pose. A pose has body channels (lift, slide, lean, nod, turn, stretch, bulge, bend, twist, handle flop) and eye channels (gaze, and per eye: blink, size, width, tilt, lid, lid slant, happy arc, gaze offset). All channels are 0 at neutral, so mirroring or scaling a clip keeps its neutral ends.

| Clip | Kind | Under reduced motion |
| --- | --- | --- |
| `double-blink`, `curiosity`, `look-around` | Emote | Eyes only, gaze limited |
| `rock`, `little-hop`, `tilted-spin` | Emote | Still pose (not played) |
| `poke` | Reaction to a click or tap | Eyes only |
| `drag-release` | Reaction to releasing a fast drag (dizzy wobble) | Still pose; the turn returns without overshoot |
| Gaze following (`gaze-follow` tuning) | Continuous layer | Eyes only, small amplitude |

Clips follow the motion rules of the [motion spec](../docs/product-experience.md#kettle-motion-spec): one body per exposure (no echo or multiple-image frames; speed comes from stretch and twist), no body snap into a new pose right before the return to neutral (a one-exposure eye accent, such as a blink, is not a body snap), and eye shapes that stay readable (the happy arc lifts the recess without folding it). Deformation is computed on the CPU once per exposure; see the [renderer ADR](../docs/adr/2026-11-24-kettle-own-splat-renderer.md).

## What the splat body cannot do

The body is a cloud of Gaussians with no skeleton, mesh or separate parts. Deformations are smooth space warps of that cloud:

- **The handle bends only as a soft region.** `flop` moves splats above the body's shoulder by height; it reads as a rubbery lag, not a jointed or rigid handle, and strong values thin the handle where it meets the body.
- **No new surface appears.** Extreme squash flattens the handle into the body, and the back of the body is IDOL's reconstruction with no face, so fast spins show a blank back.
- **The eyes are the only drawn features.** There is no mouth, brow or limb; emotion comes from eye shape, size, lids, asymmetry and gaze, plus body language.

## Layout

| Path | Contents |
| --- | --- |
| `src/` | The module. `index.ts` is its only public entry; `kettle.ts` is `createKettle`. |
| `lab/` | Lab server (`server.ts`, `serve.ts`), lab page (`main.ts`, `public/`), the test harness page and the Chromium launcher (`chromium.ts`) shared by tests and scripts. |
| `tests/` | Clip data and boundary tests, and Chromium checks of the lab and the interactions. |
| `scripts/` | `record.ts` (evidence recorder) and `poster.ts` (poster renderer). |
