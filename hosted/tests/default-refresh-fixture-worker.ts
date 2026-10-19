// Disposable time control around the real authorization fixture; never deployed.
import fixture from './mcp-auth-fixture-worker.js';
import type { HostedEnvironment } from '../src/auth.js';

const nativeDate = Date;
let offset = 0;
globalThis.Date = new Proxy(nativeDate, {
  construct(target, args, newTarget) {
    return Reflect.construct(target, args.length ? args : [target.now() + offset], newTarget);
  },
  get(target, property, receiver) {
    return property === 'now' ? () => target.now() + offset : Reflect.get(target, property, receiver);
  },
});

export default {
  async fetch(request: Request, env: HostedEnvironment) {
    const url = new URL(request.url);
    if (url.pathname === '/__fixture/clock') {
      offset = url.searchParams.has('after-overlap') ? offset + 31_000 : 3_601_000;
      return Response.json({ now: Date.now() });
    }
    return fixture.fetch(request, env);
  },
};
