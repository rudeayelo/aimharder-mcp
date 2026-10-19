import { APIError } from 'better-auth/api';
import type { HostedEnvironment } from './auth.js';

export const invitationLifetime = 7 * 24 * 60 * 60 * 1000;
export const verificationLifetimeSeconds = 3600;
export function normalizeEmail(email: string) { return email.toLowerCase(); }
export async function digest(value: string): Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))),
    byte => byte.toString(16).padStart(2, '0')).join('');
}
export function denyAdmission(): never {
  throw new APIError('FORBIDDEN', { code: 'ADMISSION_REQUIRED', message: 'A current invitation for this email is required.' });
}
export interface Invitation { id: string; email: string; role: 'admin' | 'user'; }
export async function invited(env: HostedEnvironment, token: string | null, email: string): Promise<Invitation> {
  if (!token || token.length > 256) denyAdmission();
  const row = await env.AUTH_DB.prepare(
    'SELECT id,email,role FROM portal_invitation WHERE tokenDigest=? AND email=? AND revokedAt IS NULL AND acceptedAt IS NULL AND expiresAt>?'
  ).bind(await digest(token), normalizeEmail(email), Date.now()).first<Invitation>();
  if (!row) denyAdmission();
  return row;
}
export async function participant(env: HostedEnvironment, userId: string) {
  return env.AUTH_DB.prepare(
    'SELECT p.userId,p.role,p.accessGeneration FROM portal_participant p JOIN user u ON u.id=p.userId WHERE p.userId=? AND p.status=\'active\' AND u.emailVerified=1'
  ).bind(userId).first<{ userId: string; role: 'admin' | 'user'; accessGeneration: number }>();
}
export async function pendingInvitation(env: HostedEnvironment, userId: string) {
  return env.AUTH_DB.prepare(
    'SELECT i.id FROM portal_pending_admission p JOIN portal_invitation i ON i.id=p.invitationId WHERE p.userId=? AND i.revokedAt IS NULL AND ((i.expiresAt>? AND i.acceptedUserId IS NULL) OR i.acceptedUserId=?)'
  ).bind(userId, Date.now(), userId).first<{ id: string }>();
}
export async function admitVerifiedIdentity(env: HostedEnvironment, userId: string, token: string) {
  const delivered = await env.AUTH_DB.prepare(
    'SELECT invitationId FROM portal_verification_delivery WHERE tokenDigest=? AND userId=? AND expiresAt>?'
  ).bind(await digest(token), userId, Date.now()).first<{ invitationId: string }>();
  if (!delivered) denyAdmission();
  await claimInvitation(env, userId, delivered.invitationId);
}
export async function claimInvitation(env: HostedEnvironment, userId: string, invitationId: string) {
  const now = Date.now();
  // D1 batch is atomic. Claim and revoke share the invitation row as their linearization point.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare(
      'UPDATE portal_invitation SET acceptedUserId=?,acceptedAt=COALESCE(acceptedAt,?) WHERE id=? AND revokedAt IS NULL AND expiresAt>? AND (acceptedUserId IS NULL OR acceptedUserId=?)'
    ).bind(userId, now, invitationId, now, userId),
    env.AUTH_DB.prepare(
      'INSERT OR IGNORE INTO portal_participant (userId,invitationId,role,admittedAt) SELECT ?,id,role,? FROM portal_invitation WHERE id=? AND acceptedUserId=? AND revokedAt IS NULL'
    ).bind(userId, now, invitationId, userId),
  ]);
  const admitted = await env.AUTH_DB.prepare('SELECT userId FROM portal_participant WHERE userId=? AND invitationId=?')
    .bind(userId, invitationId).first();
  if (!admitted) denyAdmission();
}
export async function canRecover(env: HostedEnvironment, userId: string) {
  return Boolean(await participant(env, userId) && await env.AUTH_DB.prepare(
    'SELECT id FROM account WHERE userId=? AND providerId=\'credential\' AND password IS NOT NULL'
  ).bind(userId).first());
}
