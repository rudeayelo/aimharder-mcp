import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';
import type { ActivityEntry } from './activity.js';

export const activityDeletionQuerySchema = z.object({
  gymId: gymIdSchema.optional(), date: dateSchema,
  sourceActivityId: z.number().int().positive().safe().optional(),
}).strict();
export type ActivityDeletionQuery = z.infer<typeof activityDeletionQuerySchema>;
export const activityDeletionExecutionSchema = z.object({
  gymId: gymIdSchema.optional(), actionReference: z.string().regex(/^[a-f0-9]{64}$/),
  sourceActivityId: z.number().int().positive().safe(), confirmed: z.literal(true),
}).strict();
export type ActivityDeletionExecution = z.infer<typeof activityDeletionExecutionSchema>;

export type DeletionPreview = {
  gym: { id: string; name: string; timeZone: string; timeZoneStatus: 'assumed' | 'user-confirmed' };
  target: { sourceActivityId: number; date: string; titles: string[]; blocks: ActivityEntry['blocks']; exercises: ActivityEntry['exercises']; containsRMMarks: boolean };
  coverage: { status: 'complete' | 'incomplete'; completedDates: string[]; reason: string | null };
  notices: string[];
};

type Stored = { accountId: number; gymId: string; boxId: number; preview: DeletionPreview; expires: number };
export class ActivityDeletionPreparationStore {
  #entries = new Map<string, Stored>();
  issue(accountId: number, gymId: string, boxId: number, preview: DeletionPreview) {
    const now = Date.now();
    for (const [key, value] of this.#entries) if (value.expires <= now) this.#entries.delete(key);
    if (this.#entries.size >= 32) this.#entries.delete(this.#entries.keys().next().value!);
    const actionReference = randomBytes(32).toString('hex');
    const expires = now + 120_000;
    this.#entries.set(actionReference, { accountId, gymId, boxId, preview: structuredClone(preview), expires });
    return { actionReference, expiresAt: new Date(expires).toISOString() };
  }
  take(reference: string, accountId: number, gymId: string, boxId: number, sourceActivityId: number) {
    const entry = this.#entries.get(reference);
    this.#entries.delete(reference);
    return entry && entry.expires > Date.now() && entry.accountId === accountId && entry.gymId === gymId
      && entry.boxId === boxId && entry.preview.target.sourceActivityId === sourceActivityId ? entry : null;
  }
}

export function sameDeletionTarget(a: DeletionPreview, b: DeletionPreview): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function deletionPreview(gym: DeletionPreview['gym'], entry: ActivityEntry, coverage: DeletionPreview['coverage']): DeletionPreview {
  const containsRMMarks = entry.blocks.some(block => block.result?.rx === true || block.result?.rxstr != null);
  return {
    gym, target: { sourceActivityId: entry.sourceActivityId, date: entry.date, titles: entry.titles,
      blocks: entry.blocks, exercises: entry.exercises, containsRMMarks }, coverage,
    notices: [
      'Deletion may cause irreversible loss. No automatic backup or undo is available.',
      'The effect of deletion on RM history and progression is unknown; RM marks do not prevent preparation.',
      'This read-only preview does not send a DELETE and does not establish permanent deletion semantics.',
      ...(coverage.status === 'incomplete' ? ['Calendar coverage is incomplete; absence of other entries cannot be inferred.'] : []),
    ],
  };
}
