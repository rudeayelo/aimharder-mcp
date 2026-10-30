# Visus

![Visus Demo](./public/demo.png)

**High‑performance Gaussian Splatting** (3DGS) for [Three.js](https://threejs.org/) and React‑Three‑Fiber.
Drop in a `SplatMesh` or `<Splat>` component, feed it a `.ply`, and render millions of splats with correct transparency and minimal overhead.

---

## 🚀 Installation

```bash
# npm
npm install @speridlabs/visus three

# yarn
yarn add @speridlabs/visus three

# pnpm
pnpm add @speridlabs/visus three

```

> Visus treats Three.js as a peer dependency—make sure it's installed alongside.

---

## 🔑 Key Features

* **Mesh‑like API**: `new SplatMesh(data, options)` behaves like a `THREE.Mesh`.
* **React wrapper**: `<Splat plyUrl="..." splatOptions={{…}} />` for R3F apps.
* **Web Worker sorting**: non‑blocking depth sort for correct transparency.
* **GPU instancing**: draw hundreds of splats in a single call.
* **Packed textures**: compact quaternion & scale storage.
* **Shader culling**: early discards, premultiplied alpha.

---

## 🎯 Quickstart

### Plain Three.js

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlyLoader, SplatMesh } from '@speridlabs/visus';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

(async () => {
  const data = await new PlyLoader().loadAsync('/sample.ply');
  const mesh = new SplatMesh(data, { autoSort: true });
  scene.add(mesh);
})();

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
```

### React‑Three‑Fiber (R3F)

```tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Splat } from '@speridlabs/visus/react';

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1, 3] }}>
      <ambientLight />
      <Splat plyUrl="/sample.ply" splatOptions={{ autoSort: true }} />
    </Canvas>
  );
}
```

---

## 📦 API Overview

| Export         | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `PlyLoader`    | `.loadAsync(url): Promise<SplatData>`                          |
| `SplatData`    | Raw buffers of positions, rotations, scales, colors, opacities |
| `SplatMesh`    | `new SplatMesh(data, options?)` → a `THREE.Mesh`               |
| `SplatOptions` | `{ autoSort?: boolean; /* … */ }`                              |
| `Splat`        | React component wrapping `SplatMesh`                           |
| `VERSION`      | Library version string                                         |

---

## 🔧 Performance Highlights

* **Off‑thread sorting** via Web Worker
* **Instanced draw calls** for minimal CPU overhead
* **Packed data textures** reduce memory bandwidth
* **Shader‑level early exit** for invisible splats

---

## 🤝 Contributing

1. Fork & clone
2. `pnpm install`
3. `pnpm lint && pnpm build`
4. Open a PR!

---

## 📄 License

Apache 2.0 © Sperid Labs


