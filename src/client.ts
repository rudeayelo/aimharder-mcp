import { randomBytes } from 'node:crypto';
import { CookieJar } from 'tough-cookie';
import { z } from 'zod';
import { gymIdSchema, type Configuration } from './config.js';
import { AimHarderError } from './errors.js';

const loginUrl = 'https://login.aimharder.es/api/login';
const identityUrl = 'https://aimharder.es/api/whoami';
const accountIdSchema = z.number().int().positive().safe();
const loginSchema = z.object({
  data: z.object({
    userData: z.object({ id: accountIdSchema }),
    auth: z.object({ authOK: z.literal(true) }),
  }),
});
const identitySchema = z.object({
  data: z.array(z.object({
    id: accountIdSchema,
    roles: z.array(z.object({
      role: z.string(),
      gym: z.string().min(1).max(300).refine((name) => name.trim().length > 0),
      centre_url: z.string().regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.aimharder\.es$/).transform((host) => host.slice(0, -'.aimharder.es'.length)),
    })),
  })).max(1),
});

export interface Gym {
  id: string;
  name: string;
  timeZone: null;
  timeZoneStatus: 'unverified';
}
export interface AccountContext {
  account: { authenticated: true };
  gyms: Gym[];
  selectedGym: Gym;
  notices: string[];
}
class SessionExpired extends Error {}

/** One account, an in-memory session, and a closed set of upstream operations. */
export class AimHarderClient {
  #cookies = new CookieJar();
  #accountId: number | undefined;
  #authenticationFailure: AimHarderError | undefined;
  #queue: Promise<void> = Promise.resolve();

  constructor(private readonly configuration: Configuration) {}

  getAccountContext(gymId?: string): Promise<AccountContext> {
    // Serialize requests so recovery cannot replace another request's session.
    const result = this.#queue.then(() => this.#getAccountContext(gymId));
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }

  async #getAccountContext(gymId?: string): Promise<AccountContext> {
    if (this.#authenticationFailure) throw this.#authenticationFailure;
    if (gymId !== undefined && !gymIdSchema.safeParse(gymId).success) {
      throw new AimHarderError('GYM_NOT_ACCESSIBLE');
    }
    if (this.#accountId === undefined) await this.#authenticate();
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const gyms = await this.#discoverGyms();
        const configured = this.configuration.defaultGym;
        if (configured !== undefined && !gyms.some((gym) => gym.id === configured)) {
          throw new AimHarderError('GYM_NOT_ACCESSIBLE', gyms.map((gym) => gym.id));
        }
        if (gyms.length > 1 && configured === undefined) {
          throw new AimHarderError('DEFAULT_GYM_REQUIRED', gyms.map((gym) => gym.id));
        }
        const selected = gymId ?? configured ?? gyms[0]?.id;
        const selectedGym = gyms.find((gym) => gym.id === selected);
        if (!selectedGym) throw new AimHarderError('GYM_NOT_ACCESSIBLE');
        return {
          account: { authenticated: true }, gyms, selectedGym,
          notices: ['Gym time zones have not been verified. Do not infer gym-local dates from the computer time zone.'],
        };
      } catch (error) {
        if (!(error instanceof SessionExpired)) throw error;
        this.#clearSession();
        if (attempt === 1) throw new AimHarderError('SESSION_EXPIRED');
        await this.#authenticate();
      }
    }
    throw new AimHarderError('SESSION_EXPIRED');
  }

  #clearSession() {
    this.#accountId = undefined;
    this.#cookies = new CookieJar();
  }

  async #authenticate() {
    this.#clearSession();
    try {
      const response = await this.#request('login');
      const parsed = loginSchema.safeParse(response);
      if (!parsed.success || !(await this.#cookies.getCookies(identityUrl)).some((cookie) => cookie.key === 'amhrdrauth')) {
        throw new AimHarderError('AUTHENTICATION_FAILED');
      }
      this.#accountId = parsed.data.data.userData.id;
    } catch (error) {
      this.#clearSession();
      // Unknown login/2FA/restriction responses also stop, without interpreting raw messages.
      this.#authenticationFailure = error instanceof AimHarderError ? error : new AimHarderError('AUTHENTICATION_FAILED');
      throw this.#authenticationFailure;
    }
  }

  async #discoverGyms(): Promise<Gym[]> {
    const parsed = identitySchema.safeParse(await this.#request('identity'));
    if (!parsed.success) throw new AimHarderError('INVALID_RESPONSE');
    const account = parsed.data.data[0];
    if (!account) throw new SessionExpired();
    if (account.id !== this.#accountId) {
      this.#clearSession();
      throw new AimHarderError('IDENTITY_MISMATCH');
    }
    const gyms = new Map<string, Gym>();
    for (const role of account.roles) {
      if (role.role !== 'client') throw new AimHarderError('UNSUPPORTED_MEMBERSHIP');
      const previous = gyms.get(role.centre_url);
      if (previous && previous.name !== role.gym) throw new AimHarderError('INVALID_RESPONSE');
      gyms.set(role.centre_url, {
        id: role.centre_url, name: role.gym, timeZone: null, timeZoneStatus: 'unverified',
      });
    }
    if (!gyms.size) throw new AimHarderError('NO_ACCESSIBLE_GYMS');
    return [...gyms.values()];
  }

  async #request(operation: 'login' | 'identity'): Promise<unknown> {
    const url = operation === 'login' ? loginUrl : identityUrl;
    const headers: Record<string, string> = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
    const cookie = await this.#cookies.getCookieString(url);
    if (cookie) headers.Cookie = cookie;
    const init: RequestInit = {
      method: operation === 'login' ? 'POST' : 'GET', headers,
      redirect: 'error', signal: AbortSignal.timeout(15_000),
    };
    if (operation === 'login') {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify({
        username: this.configuration.username, password: this.configuration.password,
        iniframe: 0, fingerprint: randomBytes(25).toString('hex'),
      });
    }
    try {
      const response = await fetch(url, init);
      if (response.status === 401) {
        void response.body?.cancel().catch(() => undefined);
        if (operation === 'identity') throw new SessionExpired();
        throw new AimHarderError('AUTHENTICATION_FAILED');
      }
      if (response.status === 403 || response.status === 429) {
        void response.body?.cancel().catch(() => undefined);
        throw new AimHarderError('ACCESS_RESTRICTED');
      }
      if (!response.ok) {
        void response.body?.cancel().catch(() => undefined);
        throw new AimHarderError('REQUEST_FAILED');
      }
      for (const setCookie of response.headers.getSetCookie()) {
        await this.#cookies.setCookie(setCookie, url);
      }
      return await readJson(response);
    } catch (error) {
      if (error instanceof AimHarderError || error instanceof SessionExpired) throw error;
      throw new AimHarderError('REQUEST_FAILED');
    }
  }
}

async function readJson(response: Response): Promise<unknown> {
  if (!response.body) throw new AimHarderError('INVALID_RESPONSE');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1_048_576) throw new AimHarderError('INVALID_RESPONSE');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    void reader.cancel().catch(() => undefined);
    throw new AimHarderError('INVALID_RESPONSE');
  } finally {
    reader.releaseLock();
  }
}
