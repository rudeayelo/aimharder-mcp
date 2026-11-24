// Browser loading of the SOG body. WebP attribute textures are decoded with
// the browser's image decoder and read back through a throwaway WebGL2
// context, which keeps every byte exact (a 2D canvas would premultiply alpha
// and corrupt colours of low-opacity splats). No worker, WASM or blob URL.
import { toModelSplats, type ModelSplats } from './model.ts';
import { decodeSog, parseSogMeta, readStoredZip, type Pixels, type SogTextures } from './sog.ts';

async function readPixels(gl: WebGL2RenderingContext, bytes: Uint8Array): Promise<Pixels> {
  const bitmap = await createImageBitmap(new Blob([bytes as BlobPart], { type: 'image/webp' }), {
    premultiplyAlpha: 'none',
    colorSpaceConversion: 'none',
  });
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  try {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Kettle body: texture readback unavailable');
    const data = new Uint8Array(bitmap.width * bitmap.height * 4);
    gl.readPixels(0, 0, bitmap.width, bitmap.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) throw new Error('Kettle body: texture readback failed');
    return { width: bitmap.width, height: bitmap.height, data };
  } finally {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    bitmap.close();
  }
}

export async function loadKettleBody(url: string | URL, signal?: AbortSignal): Promise<ModelSplats> {
  const response = await fetch(url, signal ? { signal } : {});
  if (!response.ok) throw new Error(`Kettle body: HTTP ${response.status}`);
  const files = readStoredZip(new Uint8Array(await response.arrayBuffer()));
  const metaBytes = files.get('meta.json');
  if (!metaBytes) throw new Error('Kettle body: meta.json missing');
  const meta = parseSogMeta(new TextDecoder().decode(metaBytes));
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('Kettle body: WebGL2 unavailable');
  try {
    const read = (name: string | undefined) => {
      const bytes = name ? files.get(name) : undefined;
      if (!bytes) throw new Error(`Kettle body: ${String(name)} missing`);
      return readPixels(gl, bytes);
    };
    const [means_l, means_u] = await Promise.all(meta.means.files.map(read));
    const textures: SogTextures = {
      means_l: means_l!,
      means_u: means_u!,
      quats: await read(meta.quats.files[0]),
      scales: await read(meta.scales.files[0]),
      sh0: await read(meta.sh0.files[0]),
    };
    return toModelSplats(decodeSog(meta, textures));
  } finally {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
