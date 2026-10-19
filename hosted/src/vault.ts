import { z } from 'zod';
import type { Configuration } from '../../src/config.js';
import type { HostedEnvironment } from './auth.js';

const envelopeSchema = z.object({ version: z.literal(1), keyId: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/), iv: z.string(), ciphertext: z.string() }).strict();
export interface ConnectionPayload { configuration: Configuration; identity: number; }
export interface ConnectionRow { userId: string; revision: string; envelope: string; }
function bytes(value: string): Uint8Array<ArrayBuffer> { return Uint8Array.from(atob(value), char => char.charCodeAt(0)); }
function encoded(value: Uint8Array): string { return btoa(String.fromCharCode(...value)); }
async function key(env: HostedEnvironment, keyId: string) {
  const ring = JSON.parse(env.VAULT_KEYS ?? '{}') as Record<string, unknown>;
  if (Object.keys(ring).length > 8 || !Object.hasOwn(ring, keyId) || typeof ring[keyId] !== 'string') throw new Error('Vault unavailable');
  const raw = bytes(ring[keyId]);
  if (raw.byteLength !== 32) throw new Error('Vault unavailable');
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
function aad(userId: string, revision: string, keyId: string) { return new TextEncoder().encode(JSON.stringify(['aimharder-connection', 1, userId, revision, keyId])); }
export async function encryptConnection(env: HostedEnvironment, userId: string, revision: string, payload: ConnectionPayload): Promise<string> {
  const keyId = env.VAULT_ACTIVE_KEY_ID;
  if (!keyId || !/^[a-zA-Z0-9_-]{1,64}$/.test(keyId)) throw new Error('Vault unavailable');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad(userId, revision, keyId) }, await key(env, keyId), new TextEncoder().encode(JSON.stringify(payload)));
  return JSON.stringify({ version: 1, keyId, iv: encoded(iv), ciphertext: encoded(new Uint8Array(ciphertext)) });
}
export async function decryptConnection(env: HostedEnvironment, row: ConnectionRow): Promise<ConnectionPayload> {
  const envelope = envelopeSchema.parse(JSON.parse(row.envelope));
  const iv = bytes(envelope.iv);
  if (iv.byteLength !== 12 || envelope.ciphertext.length > 24_000) throw new Error('Vault unavailable');
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad(row.userId, row.revision, envelope.keyId) }, await key(env, envelope.keyId), bytes(envelope.ciphertext));
  const payload = JSON.parse(new TextDecoder().decode(plaintext)) as ConnectionPayload;
  if (!Number.isSafeInteger(payload.identity) || payload.identity <= 0) throw new Error('Vault unavailable');
  return payload;
}
