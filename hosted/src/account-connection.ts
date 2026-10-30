import { acquireRecoveryLease, releaseRecoveryLease, recoveryEpoch, deletedIdentity } from './recovery-authority.js';
import { z } from 'zod';
import { AimHarderClient, type ActivityDeletionDispatch, type AccountContext, publicationRecoveryFacts, type ActivityPublicationRecovery, type BookingCancellationDispatch, type BookingCreationDispatch } from '../../src/client.js';
import { gymIdSchema, readConfiguration, type Configuration } from '../../src/config.js';
import { exerciseSearchQuerySchema } from '../../src/exercise-search.js';
import { exercise1RMQuerySchema } from '../../src/exercise-records.js';
import { activityQuerySchema } from '../../src/activity.js';
import { workoutQuerySchema } from '../../src/workouts.js';
import { classQuerySchema } from '../../src/classes.js';
import { bookingCancellationQuerySchema, lateCancellationExecutionSchema, bookingCreationQuerySchema, bookingExecutionSchema } from '../../src/booking-preparation.js';
import { publicationQuerySchema, publicationExecutionSchema } from '../../src/activity-publication.js';
import { requireActivityPermission } from './activity-policy.js';
import { activityDeletionQuerySchema, activityDeletionExecutionSchema } from '../../src/activity-deletion.js';
import { AccountActionCoordinator } from './action-coordination.js';
import { AimHarderError } from '../../src/errors.js';
import { safeError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { currentGrant } from './oauth-grants.js';
import { participant } from './admission.js';
import { decryptConnection, encryptConnection, type ConnectionRow } from './vault.js';

export async function accountOperation(env: HostedEnvironment, subject: string, operation: object) {
  if (!env.ACCOUNT_CONNECTIONS) return Response.json({ status: 'unavailable' }, { status: 503 });
  // A separate lease covers the complete actor await even if an HTTP transport
  // returns streaming headers before its asynchronous tool callback finishes.
  const lease=await acquireRecoveryLease(env);
  if(!lease)return Response.json({status:'unavailable'},{status:503});
  try{return await env.ACCOUNT_CONNECTIONS.get(env.ACCOUNT_CONNECTIONS.idFromName(subject)).fetch('https://account.internal/', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-portal-subject': subject, 'x-recovery-lease':lease }, body: JSON.stringify(operation),
  });}finally{await releaseRecoveryLease(env,lease);}
}

/** Trusted binding-only cleanup. The actor independently requires a deletion tombstone. */
export async function eraseDeletedAccountMemory(env:HostedEnvironment,subject:string){
  if(!env.ACCOUNT_CONNECTIONS)return;
  const response=await env.ACCOUNT_CONNECTIONS.get(env.ACCOUNT_CONNECTIONS.idFromName(subject)).fetch('https://account.internal/',{method:'POST',headers:{'x-portal-subject':subject},body:JSON.stringify({kind:'erase-deleted'})});
  if(response.status!==403)throw new Error('Deleted account memory cleanup unavailable');
}
const input = z.object({ username: z.string().min(1).max(512), password: z.string().min(1).max(4096),
  defaultGym: z.string().optional(), gymTimeZones: z.record(z.string(), z.string()).optional(), requireBookingConfirmation: z.boolean().optional(), requirePublicationConfirmation: z.boolean().optional() }).strict();
function configuration(value: z.infer<typeof input>): Configuration {
  return readConfiguration({ AIMHARDER_USERNAME: value.username, AIMHARDER_PASSWORD: value.password,
    AIMHARDER_REQUIRE_BOOKING_CONFIRMATION: value.requireBookingConfirmation === undefined ? undefined : String(value.requireBookingConfirmation),
    AIMHARDER_REQUIRE_PUBLICATION_CONFIRMATION: value.requirePublicationConfirmation === undefined ? undefined : String(value.requirePublicationConfirmation),
    AIMHARDER_DEFAULT_GYM: value.defaultGym, AIMHARDER_GYM_TIME_ZONES: JSON.stringify(value.gymTimeZones ?? {}) });
}
export class AccountConnection {
  #queue: Promise<void> = Promise.resolve();
  #recoveryEpoch:number|undefined;
  #client: { revision: string; envelope: string; client: AimHarderClient } | undefined;
  readonly #actions:AccountActionCoordinator;
  private readonly env:HostedEnvironment;
  constructor(private readonly state: DurableObjectState, env: HostedEnvironment) {this.env={...env};this.#actions=new AccountActionCoordinator(state.storage,this.env,promise=>state.waitUntil(promise));}
  alarm():Promise<void>{const result=this.#queue.then(async()=>{const lease=await acquireRecoveryLease(this.env,null);if(!lease)return;try{const subject=await this.state.storage.get<string>('owner');if(subject)await this.#actions.sweep(subject);}finally{await releaseRecoveryLease(this.env,lease);}});this.#queue=result.catch(()=>undefined);return result;}
  fetch(request: Request): Promise<Response> {
    const result = this.#queue.then(() => this.#handle(request));
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }
  async #handle(request: Request): Promise<Response> {
    const subject = request.headers.get('x-portal-subject');
    const lease=request.headers.get('x-recovery-lease');
    if(lease)this.env.RECOVERY_LEASE=lease;else delete this.env.RECOVERY_LEASE;
    const epoch=await recoveryEpoch(this.env);
    if(this.#recoveryEpoch!==epoch){this.#actions.discardPreparations();this.#client=undefined;this.#recoveryEpoch=epoch;}
    const owner = await this.state.storage.get<string>('owner');
    if (owner && owner !== subject) return Response.json({ status: 'unavailable' }, { status: 403 });
    if(subject && await deletedIdentity(this.env,subject)){
      this.#client=undefined;this.#actions.discardPreparations();await this.state.storage.deleteAll();
      return Response.json({status:'unavailable'},{status:403});
    }
    const admission = subject && await participant(this.env, subject);
    if (!subject || !admission) return Response.json({ status: 'unavailable' }, { status: 403 });
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
        if (row) {
          const previous = (await decryptConnection(this.env, row)).configuration;
          config.requireBookingConfirmation = parsed.data.requireBookingConfirmation ?? previous.requireBookingConfirmation ?? true;
          config.requirePublicationConfirmation = parsed.data.requirePublicationConfirmation ?? previous.requirePublicationConfirmation ?? true;
        }
        const candidate = new AimHarderClient(config);
        const verified = await candidate.verifyConnection();
        const ids = new Set(verified.gyms.map(gym => gym.id));
        if (Object.keys(config.gymTimeZones).some(id => !ids.has(id)) || config.defaultGym && !ids.has(config.defaultGym)) return Response.json({ status: 'invalid-settings', gyms: verified.gyms }, { status: 400 });
        if (verified.gyms.length > 1 && !config.defaultGym) return Response.json({ status: 'default-gym-required', gyms: verified.gyms, writeConfirmationPolicy: { bookingCreation: config.requireBookingConfirmation !== false, activityPublication: config.requirePublicationConfirmation !== false } }, { status: 422 });
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
        if(operation.kind==='execute-activity-deletion'&&await this.#actions.hasPossibleDispatch(subject,activityDeletionExecutionSchema.parse(operation.input).actionReference))throw new AimHarderError('ACTION_OUTCOME_UNCERTAIN');
        if(['execute-activity-publication','execute-booking-creation','execute-booking-cancellation','execute-late-booking-cancellation'].includes(operation.kind)&&await this.#actions.hasPossibleDispatch(subject,(operation.kind==='execute-activity-publication'?publicationExecutionSchema:operation.kind==='execute-late-booking-cancellation'?lateCancellationExecutionSchema:bookingExecutionSchema).parse(operation.input).actionReference))throw new AimHarderError('ACTION_OUTCOME_UNCERTAIN');
        return Response.json({ status: 'not-connected' });
      }
      // Authenticate the current durable envelope even when memory is warm.
      const payload = await decryptConnection(this.env, row);
      if (!this.#client || this.#client.revision !== row.revision || this.#client.envelope !== row.envelope) {
        this.#actions.discardPreparations();
        this.#client = { revision: row.revision, envelope: row.envelope, client: new AimHarderClient(payload.configuration, payload.identity) };
      }
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
        const settings = z.object({ defaultGym: z.string().optional(), gymTimeZones: z.record(z.string(), z.string()), requireBookingConfirmation: z.boolean().optional(), requirePublicationConfirmation: z.boolean().optional() }).strict().safeParse(operation.input);
        if (!settings.success) return Response.json({ status: 'invalid-settings' }, { status: 400 });
        const config = configuration({ username: payload.configuration.username, password: payload.configuration.password, ...settings.data, requireBookingConfirmation: settings.data.requireBookingConfirmation ?? payload.configuration.requireBookingConfirmation ?? true, requirePublicationConfirmation: settings.data.requirePublicationConfirmation ?? payload.configuration.requirePublicationConfirmation ?? true });
        const verified = await this.#client.client.verifyConnection();
        const ids = new Set(verified.gyms.map(gym => gym.id));
        if ((config.defaultGym && !ids.has(config.defaultGym)) || Object.keys(config.gymTimeZones).some(id => !ids.has(id))) return Response.json({ status: 'invalid-settings' }, { status: 400 });
        if (ids.size > 1 && !config.defaultGym) return Response.json({ status: 'default-gym-required', gyms: verified.gyms, writeConfirmationPolicy: { bookingCreation: config.requireBookingConfirmation !== false, activityPublication: config.requirePublicationConfirmation !== false } }, { status: 422 });
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
      if (['execute-booking-creation', 'execute-booking-cancellation', 'execute-late-booking-cancellation', 'execute-activity-publication', 'execute-activity-deletion'].includes(operation.kind)) {
        const marker = operation.kind === 'execute-late-booking-cancellation' ? 'confirmedCreditLoss' : 'confirmed';
        const required = operation.kind === 'execute-booking-creation' ? payload.configuration.requireBookingConfirmation !== false : operation.kind === 'execute-activity-publication' ? payload.configuration.requirePublicationConfirmation !== false : true;
        if (required && (operation.input as Record<string, unknown> | undefined)?.[marker] !== true)
          throw new AimHarderError('WRITE_CONFIRMATION_REQUIRED');
      }
      if(operation.kind==='prepare-activity-publication'){
        await requireActivityPermission(this.env,subject,'publication');
        const result=await this.#client.client.prepareActivityPublication(publicationQuerySchema.parse(operation.input));
        await requireActivityPermission(this.env,subject,'publication');
        if('actionReference' in result&&result.actionReference)this.#actions.remember(result.actionReference,{action:'activity-publish',revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='execute-activity-publication'){
        const query=publicationExecutionSchema.parse(operation.input);const client=this.#client.client;
        const authorize=async()=>{
          await requireActivityPermission(this.env,subject,'publication');
          if(!await currentGrant(this.env,operation.authorization?.grantId,subject,operation.authorization?.clientId,row.revision,'publication'))throw new AimHarderError('ACCESS_RESTRICTED');
        };
        await authorize();
        const result=await this.#actions.execute<Awaited<ReturnType<AimHarderClient['executeActivityPublication']>>,ActivityPublicationRecovery>({action:'activity-publish',invalidReference:'ACTIVITY_REFERENCE_INVALID',subject,revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,reference:query.actionReference,...(query.gymId?{gymId:query.gymId}:{}),authorize,
          dispatch:(beforeDispatch,afterDispatch)=>client.executeActivityPublication(query,{beforeDispatch:facts=>beforeDispatch(publicationRecoveryFacts(facts)),afterDispatch:facts=>afterDispatch(publicationRecoveryFacts(facts))}),
          recover:async(facts,originalRevision)=>{
            if(query.gymId!==undefined&&query.gymId!==facts.gymId)throw new AimHarderError('ACTIVITY_REFERENCE_INVALID');
            try{if(originalRevision!==row.revision||facts.identity!==payload.identity)throw new AimHarderError('IDENTITY_MISMATCH');return await client.reconcileActivityPublication(facts);}
            catch{throw new AimHarderError('ACTION_OUTCOME_UNCERTAIN');}
          }});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='prepare-booking-cancellation'){
        const result=await this.#client.client.prepareBookingCancellation(bookingCancellationQuerySchema.parse(operation.input));
        if('actionReference' in result&&result.actionReference)this.#actions.remember(result.actionReference,{action:'booking-cancel',revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='execute-booking-cancellation'||operation.kind==='execute-late-booking-cancellation'){
        const late=operation.kind==='execute-late-booking-cancellation';
        const query=late?lateCancellationExecutionSchema.parse(operation.input):bookingExecutionSchema.parse(operation.input);
        const client=this.#client.client;
        const authorize=async()=>{if(!await currentGrant(this.env,operation.authorization?.grantId,subject,operation.authorization?.clientId,row.revision))throw new Error('Execution authorization unavailable');};
        const result=await this.#actions.execute<Awaited<ReturnType<AimHarderClient['executeBookingCancellation']>>,BookingCancellationDispatch>({action:late?'booking-cancel-late':'booking-cancel',subject,revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,reference:query.actionReference,...(query.gymId?{gymId:query.gymId}:{}),authorize,
          dispatch:(beforeDispatch,afterDispatch)=>late?client.executeLateBookingCancellation(lateCancellationExecutionSchema.parse(query),{beforeDispatch,afterDispatch}):client.executeBookingCancellation(bookingExecutionSchema.parse(query),{beforeDispatch,afterDispatch}),
          recover:async(facts,originalRevision)=>{
            if(query.gymId!==undefined&&query.gymId!==facts.preview.gym.id)throw new AimHarderError('BOOKING_REFERENCE_INVALID');
            try{if(originalRevision!==row.revision||facts.identity!==payload.identity)throw new AimHarderError('IDENTITY_MISMATCH');return await client.reconcileBookingCancellation(facts);}
            catch{return {action:'cancel' as const,gym:facts.preview.gym,target:facts.preview.target,credit:facts.preview.credit,writeConfirmationRequired:true,status:'uncertain' as const,observedState:'unknown' as const,notices:['The original cancellation may have been sent. Original-account read-back is unavailable; inspect it before preparing a new action. No write was retried.']};}
          }});
        if('actionReference' in result&&typeof result.actionReference==='string'&&'expiresAt' in result&&typeof result.expiresAt==='string')this.#actions.remember(result.actionReference,{action:'booking-cancel-late',revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='prepare-activity-deletion'){
        await requireActivityPermission(this.env,subject,'deletion');
        const result=await this.#client.client.prepareActivityDeletion(activityDeletionQuerySchema.parse(operation.input));
        await requireActivityPermission(this.env,subject,'deletion');
        if('actionReference' in result&&result.actionReference)this.#actions.remember(result.actionReference,{action:'activity-delete',revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='execute-activity-deletion'){
        const query=activityDeletionExecutionSchema.parse(operation.input);const client=this.#client.client;
        await requireActivityPermission(this.env,subject,'deletion');
        const authorize=async()=>{
          if(!await currentGrant(this.env,operation.authorization?.grantId,subject,operation.authorization?.clientId,row.revision,'deletion'))throw new Error('Execution authorization unavailable');
        };
        const result=await this.#actions.execute<Awaited<ReturnType<AimHarderClient['executeActivityDeletion']>>|Awaited<ReturnType<AimHarderClient['reconcileActivityDeletion']>>,ActivityDeletionDispatch>({action:'activity-delete',invalidReference:'ACTIVITY_REFERENCE_INVALID',subject,revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,reference:query.actionReference,...(query.gymId?{gymId:query.gymId}:{}),authorize,
          dispatch:(beforeDispatch:(facts:ActivityDeletionDispatch)=>Promise<void>,afterDispatch)=>client.executeActivityDeletion(query,{beforeDispatch,afterDispatch}),
          recover:async(facts:ActivityDeletionDispatch,originalRevision)=>{
            if(query.sourceActivityId!==facts.preview.target.sourceActivityId||(query.gymId!==undefined&&query.gymId!==facts.preview.gym.id))throw new AimHarderError('ACTIVITY_REFERENCE_INVALID');
            try{if(originalRevision!==row.revision||facts.identity!==payload.identity)throw new AimHarderError('IDENTITY_MISMATCH');return await client.reconcileActivityDeletion(facts);}
            catch{return {status:'uncertain' as const,preview:facts.preview,responseStatus:facts.outcome?.responseStatus??'uncertain' as const,observedState:'incomplete' as const,readbackCoverage:{status:'incomplete' as const,completedDates:[],reason:'Original-account read-back is unavailable.'},notices:['The original deletion may have been sent. Original-account read-back is unavailable. Inspect it before preparing another deletion; no write was retried.']};}
          }});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='prepare-booking-creation'){
        const result=await this.#client.client.prepareBookingCreation(bookingCreationQuerySchema.parse(operation.input));
        if('actionReference' in result && result.actionReference)this.#actions.remember(result.actionReference,{action:'booking-create',revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,expires:Date.parse(result.expiresAt),gymId:result.gym.id});
        return Response.json({status:'queried',result});
      }
      if(operation.kind==='execute-booking-creation'){
        const query=bookingExecutionSchema.parse(operation.input);const client=this.#client.client;
        const authorize=async()=>{
          if(!await currentGrant(this.env,operation.authorization?.grantId,subject,operation.authorization?.clientId,row.revision)) throw new Error('Execution authorization unavailable');
        };
        const result=await this.#actions.execute<Awaited<ReturnType<AimHarderClient['executeBookingCreation']>>,BookingCreationDispatch>({action:'booking-create',subject,revision:row.revision,identity:payload.identity,accessGeneration:admission.accessGeneration,reference:query.actionReference,...(query.gymId?{gymId:query.gymId}:{}),authorize,
          dispatch:(beforeDispatch,afterDispatch)=>client.executeBookingCreation(query,{beforeDispatch,afterDispatch}),
          recover:async(facts:BookingCreationDispatch,originalRevision)=>{
            if(query.gymId!==undefined&&query.gymId!==facts.preview.gym.id)throw new AimHarderError('BOOKING_REFERENCE_INVALID');
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
        return Response.json({ status: selectedGym ? 'connected' : 'selection-required', writeConfirmationPolicy: { bookingCreation: payload.configuration.requireBookingConfirmation !== false, activityPublication: payload.configuration.requirePublicationConfirmation !== false }, gyms, ...(selectedGym ? { selectedGym } : {}) });
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
