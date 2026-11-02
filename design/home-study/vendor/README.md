# React Bits source notice

The hero and How to backgrounds in this website study adapts **Grainient** by David Haz from [React Bits](https://reactbits.dev/backgrounds/grainient). It is integrated into this application's home page, not offered as a component library or standalone background product.

- Upstream revision: `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4`.
- [Upstream JavaScript/CSS source](https://github.com/DavidHDev/react-bits/blob/4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4/src/content/Backgrounds/Grainient/Grainient.jsx).
- The owner's pasted source matches that revision after trimming surrounding whitespace.
- Retained [MIT + Commons Clause notice](react-bits-LICENSE.md), Copyright (c) 2026 David Haz. This source is not relicensed under the repository's MIT grant.
- App-integrated adaptation: [grainient-background.js](../grainient-background.js). React hooks become a DOM mount/dispose function; rendering is capped at 30fps, DPR at 1, the demo's Pause/reduced-motion states also stop the background, and failed initialization releases the canvas/context/resources. The original field/composite shaders, palette conversion and pointer trail are retained.
- Application settings: [hero](../hero-background-mount.js) and [How to](../how-background-mount.js); upstream [source hashes](sources.json). The How to shares the renderer, adds its own palette and is also suspended offscreen. Its separate “Pause steps” control affects the three interface demos; the shared global Pause stops the background.

The license permits using the software as part of an application, website or product and retains restrictions on selling or redistributing the components themselves. Keep this notice and the license with the adaptation. Existing fonts, client logos and mascot provenance remain in [asset notices](../assets/README.md). The technical npm package excludes this design directory and retains its existing MIT license.
