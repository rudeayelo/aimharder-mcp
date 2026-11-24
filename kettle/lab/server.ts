// Local lab server. Serves the lab page, its bundle and the Kettle body under
// the strict Content-Security-Policy the module must run with, so every lab
// session also checks the module's CSP needs. Development tool only.
import { readFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = fileURLToPath(new URL('.', import.meta.url));
export const ROOT = resolve(here, '..');
export const ASSET = resolve(ROOT, '../design/assets/kettle/kettle-body-32k.sog');
export const POSTER = resolve(ROOT, '../design/assets/kettle/kettle-poster-front.png');

/** The policy the module is verified against (see the module README). */
export const STRICT_CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.sog': 'application/octet-stream',
  '.map': 'application/json',
};

export async function buildLab(minify = false): Promise<esbuild.BuildResult & { outputFiles: esbuild.OutputFile[] }> {
  return esbuild.build({
    entryPoints: { lab: join(ROOT, 'lab/main.ts'), harness: join(ROOT, 'lab/harness.ts') },
    bundle: true,
    format: 'esm',
    target: 'es2022',
    minify,
    sourcemap: minify ? false : 'linked',
    write: false,
    outdir: '/out',
    logLevel: 'silent',
  });
}

export interface LabServer {
  server: Server;
  url: string;
  close(): Promise<void>;
}

export async function startLabServer({ host = '127.0.0.1', port = 5174, minify = false } = {}): Promise<LabServer> {
  let bundle = await buildLab(minify);
  let built = Date.now();
  const server = createServer(async (request, response) => {
    const path = new URL(request.url ?? '/', 'http://lab').pathname;
    const send = (status: number, body: string | Uint8Array, type = 'text/plain; charset=utf-8') => {
      response.writeHead(status, {
        'content-type': type,
        'content-security-policy': STRICT_CSP,
        'x-content-type-options': 'nosniff',
        'cache-control': 'no-store',
      });
      response.end(body);
    };
    try {
      if (path === '/favicon.ico') {
        response.writeHead(204, { 'content-security-policy': STRICT_CSP });
        return response.end();
      }
      if (path === '/assets/kettle-body-32k.sog') return send(200, await readFile(ASSET), TYPES['.sog']);
      if (path === '/assets/kettle-poster.png') return send(200, await readFile(POSTER), TYPES['.png']);
      if (path.endsWith('.js') || path.endsWith('.js.map')) {
        // Rebuild on page load so edits show up on refresh.
        if (!minify && path === '/lab.js' && Date.now() - built > 500) {
          bundle = await buildLab(false);
          built = Date.now();
        }
        const file = bundle.outputFiles.find((output) => output.path === `/out${path}`);
        return file ? send(200, file.contents, TYPES[extname(path)]) : send(404, 'Not found');
      }
      const relative = path === '/' ? 'index.html' : normalize(path).replace(/^\/+/, '');
      if (relative.includes('..')) return send(400, 'Bad path');
      const file = join(ROOT, 'lab/public', relative);
      return send(200, await readFile(file), TYPES[extname(file)] ?? 'application/octet-stream');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'ENOENT' || code === 'EISDIR') return send(404, 'Not found');
      return send(500, String((error as Error).message));
    }
  });
  await new Promise<void>((done) => server.listen(port, host, done));
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  return {
    server,
    url: `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${actualPort}`,
    close: () => new Promise((done) => server.close(() => done())),
  };
}
