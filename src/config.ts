import { z } from 'zod';
import { AimHarderError } from './errors.js';

export const gymIdSchema = z.string().regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/);
const nonEmpty = z.string().refine((value) => value.trim().length > 0);
const environmentSchema = z.object({
  AIMHARDER_USERNAME: nonEmpty,
  AIMHARDER_PASSWORD: nonEmpty,
  AIMHARDER_DEFAULT_GYM: gymIdSchema.optional(),
});
export type Configuration = ReturnType<typeof readConfiguration>;

export function readConfiguration(environment: Record<string, string | undefined>) {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) throw new AimHarderError('INVALID_CONFIGURATION');
  return {
    username: parsed.data.AIMHARDER_USERNAME,
    password: parsed.data.AIMHARDER_PASSWORD,
    defaultGym: parsed.data.AIMHARDER_DEFAULT_GYM,
  };
}
