import { z } from 'zod';
import { AimHarderClient, type AccountContext, type BookingCreationDispatch } from '../../src/client.js';
import { gymIdSchema, readConfiguration, type Configuration } from '../../src/config.js';
import { exerciseSearchQuerySchema } from '../../src/exercise-search.js';
import { exercise1RMQuerySchema } from '../../src/exercise-records.js';
import { activityQuerySchema } from '../../src/activity.js';
import { workoutQuerySchema } from '../../src/workouts.js';
import { classQuerySchema } from '../../src/classes.js';
import { bookingCreationQuerySchema, bookingExecutionSchema } from '../../src/booking-preparation.js';
import { AccountActionCoordinator } from './action-coordination.js';
import { AimHarderError } from '../../src/errors.js';
import { safeError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { currentGrant } from './oauth-grants.js';
import { participant } from './admission.js';
import { decryptConnection, encryptConnection, type ConnectionRow } from './vault.js';

export function accountOperation(env: HostedEnvironment, subject: string, operation: object) {
  if (!env.ACCOUNT_CONNECTIONS) return Promise.resolve(Response.json({ status: 'unavailable' }, { status: 503 }));
  return env.ACCOUNT_CONNECTIONS.get(env.ACCOUNT_CONNECTIONS.idFromName(subject)).fetch('https://account.internal/', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-portal-subject': subject }, body: JSON.stringify(operation),
  });
}
const input = z.object({ username: z.string().min(1).max(512), password: z.string().min(1).max(4096),
  defaultGym: z.string().optional(), gymTimeZones: z.record(z.string(), z.string()).optional() }).strict();
function configuration(value: z.infer<typeof input>): Configuration {
  return readConfiguration({ AIMHARDER_USERNAME: value.username, AIMHARDER_PASSWORD: value.password,
    AIMHARDER_DEFAULT_GYM: value.defaultGym, AIMHARDER_GYM_TIME_ZONES: JSON.stringify(value.gymTimeZones ?? {}) });
}
export class AccountConnection {
  #queue: Promise<void> = Promise.resolve();
  #client: { revision: string; envelope: string; client: AimHarderClient } | undefined;
  readonly #actions:AccountActionCoordinator;
  constructor(private readonly state: DurableObjectState, private readonly env: HostedEnvironment) {this.#actions=new AccountActionCoordinator(state.storage,env);}
  alarm():Promise<void>{const result=this.#queue.then(async()=>{const subject=await this.state.storage.get<string>('owner');if(subject)await this.#actions.sweep(subject);});this.#queue=result.catch(()=>undefined);return result;}
  fetch(request: Request): Promise<Response> {
    const result = this.#queue.then(() => this.#handle(request));
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }
  async #handle(request: Request): Promise<Response> {
    const subject = request.headers.get('x-portal-subject');
    if (!subject || !await participant(this.env, subject)) return Response.json({ status: 'unavailable' }, { status: 403 });
    const owner = await this.state.storage.get<string>('owner');
    if (owner && owner !== subject) return Response.json({ status: 'unavailable' }, { status: 403 });
    if (!owner) await this.state.storage.put('owner', subject);
    try {
      const operation = await request.json() as { kind: string; input?: unknown; gymId?: string; authorization?: {grantId: string; clientId: string} };
      const row = await this.env.AUTH_DB.prepare('SELECT userId,revision,envelope FROM portal_aimharder_connection WHERE userId=?').bind(subject).first<ConnectionRow>();
      if (operation.kind === 'disconnect') {
        if (!z.object({}).strict().safeParse(operation.input).success) return Response.json({status:'invalid-settings'},{status:400});
        if (row) {
          const removed=await this.env.AUTH_DB.prepare('DELETE FROM portal_aimharder_connection WHERE userId=? AND revision=? AND envelope=?').bind(subject,row.revision,row.envelope).run();
          if (!removed.meta.changes) return Response.json({status:'connection-changed'},{status:409});
        }
        this.#client = undefined;
        this.#actions.discardPreparations();
        return Response.json({ status: 'not-connected' });
      }
      if (operation.kind === 'connect' || operation.kind === 'replace') {
        if (row && operation.kind === 'connect') return Response.json({ status: 'already-connected', message: 'Use the explicit replacement form to change the connected AimHarder account.' }, { status: 409 });
        if (!row && operation.kind === 'replace') return Response.json({status:'not-connected'},{status:409});
        const parsed = input.safeParse(operation.input);
        if (!parsed.success) return Response.json({ status: 'invalid-settings' }, { status: 400 });
        const config = configuration(parsed.data);
        const candidate = new AimHarderClient(config);
        const verified = await candidate.verifyConnection();
        const ids = new Set(verified.gyms.map(gym => gym.id));
        if (Object.keys(config.gymTimeZones).some(id => !ids.has(id)) || config.defaultGym && !ids.has(config.defaultGym)) return Response.json({ status: 'invalid-settings', gyms: verified.gyms }, { status: 400 });
        if (verified.gyms.length > 1 && !config.defaultGym) return Response.json({ status: 'default-gym-required', gyms: verified.gyms }, { status: 422 });
        const context = await candidate.getAccountContext();
        const revision = crypto.randomUUID();
        const envelope = await encryptConnection(this.env, subject, revision, { configuration: config, identity: verified.identity });
        const saved = row
          ? await this.env.AUTH_DB.prepare('UPDATE portal_aimharder_connection SET revision=?,envelope=?,updatedAt=? WHERE userId=? AND revision=? AND envelope=?').bind(revision,envelope,Date.now(),subject,row.revision,row.envelope).run()
          : await this.env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_aimharder_connection (userId,revision,envelope,updatedAt) VALUES (?,?,?,?)').bind(subject, revision, envelope, Date.now()).run();
        if (!saved.meta.changes) return Response.json({ status: 'already-connected' }, { status: 409 });
        this.#actions.discardPreparations();
        this.#client = { revision, envelope, client: candidate };
        return Response.json({ status: 'connected', ...context });
      }
      if (!row) {
        this.#client = undefined;
        if(operation.kind==='execute-booking-creation'&&await this.#actions.hasPossibleDispatch(subject,bookingExecutionSchema.parse(operation.input).actionReference))throw new AimHarderError('ACTION_OUTCOME_UNCERTAIN');
        return Response.json({ status: 'not-connected' });
      }
      // Authenticate the current durable envelope even when memory is warm.
      const payload = await decryptConnection(this.env, row);
      if (!this.#client || this.#client.revision !== row.revision || this.#client.envelope !== row.envelope) this.#client = { revision: row.revision, envelope: row.envelope, client: new AimHarderClient(payload.configuration, payload.identity) };
      if (operation.kind === 'password') {
        const parsed = z.object({password:z.string().min(1).max(4096)}).strict().safeParse(operation.input);
        if (!parsed.success) return Response.json({status:'invalid-settings'},{status:400});
        const config = {...payload.configuration,password:parsed.data.password};
        const candidate = new AimHarderClient(config,payload.identity);
        await candidate.verifyConnection();
        const context = await candidate.getAccountContext();
        const revision = crypto.randomUUID();
        const envelope = await encryptConnection(this.env,subject,revision,{configuration:config,identity:payload.identity});
        const saved = await this.env.AUTH_DB.prepare('UPDATE portal_aimharder_connection SET revision=?,envelope=?,updatedAt=? WHERE userId=? AND revision=? AND envelope=?').bind(revision,envelope,Date.now(),subject,row.revision,row.envelope).run();
        if (!saved.meta.changes) return Response.json({status:'connection-changed'},{status:409});
        this.#actions.discardPreparations();
        this.#client = {revision,envelope,client:candidate};
        return Response.json({status:'connected',...context});
      }
      if (operation.kind === 'settings') {
        const settings = z.object({ defaultGym: z.string().optional(), gymTimeZones: z.record(z.string(), z.string()) }).strict().safeParse(operation.input);
        if (!settings.success) return Response.json({ status: 'invalid-settings' }, { status: 400 });
        const config = configuration({ username: payload.configuration.username, password: payload.configuration.password, ...settings.data });
        const verified = await this.#client.client.verifyConnection();
        const ids = new Set(verified.gyms.map(gym => gym.id));
        if ((config.defaultGym && !ids.has(config.defaultGym)) || Object.keys(config.gymTimeZones).some(id => !ids.has(id))) return Response.json({ status: 'invalid-settings' }, { status: 400 });
        if (ids.size > 1 && !config.defaultGym) return Response.json({ status: 'default-gym-required', gyms: verified.gyms }, { status: 422 });
        const candidate = new AimHarderClient(config, payload.identity);
        const context = await candidate.getAccountContext();
        const revision = crypto.randomUUID();
        const envelope = await encryptConnection(this.env, subject, revision, { configuration: config, identity: payload.identity });
        const saved = await this.env.AUTH_DB.prepare('UPDATE portal_aimharder_connection SET revision=?,envelope=?,updatedAt=? WHERE userId=? AND revision=? AND envelope=?')
          .bind(revision, envelope, Date.now(), subject, row.revision, row.envelope).run();
        if (!saved.meta.changes) return Response.json({ status: 'connection-changed' }, { status: 409 });
        this.#actions.discardPreparations();
        this.#client = { revision, envelope, client: candidate };
        return Response.json({ status: 'connected', ...context });
      }
      if(operation.kind==='prepare-booking-creation'){
        const result=await this.#client.client.prepareBookingCreation(bookingCreationQuerySchema.parse(operation.input));
        if('actionReference' in result && result.actionReference)this.#actions.remember(result.actionReference,{action:'booking-create',revision:row.revision,identity:payload.identity,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='execute-booking-creation'){
        const query=bookingExecutionSchema.parse(operation.input);const client=this.#client.client;
        const authorize=async()=>{
          if(!await currentGrant(this.env,operation.authorization?.grantId,subject,operation.authorization?.clientId,row.revision)) throw new Error('Execution authorization unavailable');
        };
        const result=await this.#actions.execute<Awaited<ReturnType<AimHarderClient['executeBookingCreation']>>,BookingCreationDispatch>({action:'booking-create',subject,revision:row.revision,identity:payload.identity,reference:query.actionReference,...(query.gymId?{gymId:query.gymId}:{}),authorize,
          dispatch:(beforeDispatch,afterDispatch)=>client.executeBookingCreation(query,{beforeDispatch,afterDispatch}),
          recover:async(facts:BookingCreationDispatch,originalRevision)=>{
            try{if(originalRevision!==row.revision||facts.identity!==payload.identity)throw new AimHarderError('IDENTITY_MISMATCH');return await client.reconcileBookingCreation(facts);}
            catch{return {action:'create' as const,gym:facts.preview.gym,target:facts.preview.target,status:'uncertain' as const,observedState:'unknown' as const,notices:['The original operation may have been sent. Original-account read-back is unavailable; inspect it before preparing a new action. No write was retried.']};}
          }});
        return Response.json({status:'queried',result});
      }
      if (operation.kind === 'upcoming-bookings' || operation.kind === 'booking-history') {
        const query = z.object({ gymId: gymIdSchema.optional() }).strict().parse(operation.input);
        const result = operation.kind === 'upcoming-bookings'
          ? await this.#client.client.getUpcomingBookings(query.gymId)
          : await this.#client.client.getBookingHistory(query.gymId);
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'published-workouts') {
        const result = await this.#client.client.getPublishedWorkouts(workoutQuerySchema.parse(operation.input));
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'exercise-progression') {
        const query = exercise1RMQuerySchema.extend({ includeWod: z.boolean().optional() }).parse(operation.input);
        const result = await this.#client.client.getExerciseProgression(query);
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'find-exercise-1rm') {
        const result = await this.#client.client.findExercise1RM(exerciseSearchQuerySchema.parse(operation.input));
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'exercise-1rm') {
        const result = await this.#client.client.getExercise1RM(exercise1RMQuerySchema.parse(operation.input));
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'personal-activity') {
        const result = await this.#client.client.getPersonalActivity(activityQuerySchema.parse(operation.input));
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind === 'class-sessions') {
        const result = await this.#client.client.getClassSessions(classQuerySchema.parse(operation.input));
        return Response.json({ status: 'queried', result });
      }
      if (operation.kind !== 'context' && operation.kind !== 'status') return Response.json({ status: 'unsupported' }, { status: 404 });
      if (operation.kind === 'status') {
        // Discovery stays usable when membership changes invalidate selection.
        // The same client still verifies its pinned identity before returning gyms.
        const { gyms } = await this.#client.client.verifyConnection();
        const selectedGym = payload.configuration.defaultGym
          ? gyms.find(gym => gym.id === payload.configuration.defaultGym)
          : gyms.length === 1 ? gyms[0] : undefined;
        return Response.json({ status: selectedGym ? 'connected' : 'selection-required', gyms, ...(selectedGym ? { selectedGym } : {}) });
      }
      const context: AccountContext = await this.#client.client.getAccountContext(operation.gymId);
      return Response.json({ status: 'connected', ...context });
    } catch (error) {
      const safe = safeError(error);
      if (safe.code === 'INVALID_CONFIGURATION' || safe.code === 'INVALID_TIME_ZONE_CONFIGURATION') return Response.json({ status: 'invalid-settings', error: safe }, { status: 400 });
      return Response.json({ status: ['AUTHENTICATION_FAILED', 'IDENTITY_MISMATCH', 'SESSION_EXPIRED', 'ACCESS_RESTRICTED'].includes(safe.code) ? 'authentication-required' : 'unavailable', error: safe }, { status: 503 });
    }
  }
}
