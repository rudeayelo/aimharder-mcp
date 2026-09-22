import { z } from 'zod';
import { AimHarderError } from './errors.js';

export const gymIdSchema = z.string().regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/);
const nonEmpty = z.string().refine((value) => value.trim().length > 0);
const timeZoneSchema = z.string().regex(/^[A-Za-z][A-Za-z0-9_+\-/]*$/).refine((zone) => {
  try { new Intl.DateTimeFormat('en', { timeZone: zone }); return true; }
  catch { return false; }
});
const timeZonesSchema = z.record(gymIdSchema, timeZoneSchema);
const environmentSchema = z.object({
  AIMHARDER_USERNAME: nonEmpty,
  AIMHARDER_PASSWORD: nonEmpty,
  AIMHARDER_DEFAULT_GYM: gymIdSchema.optional(),
  AIMHARDER_GYM_TIME_ZONES: z.string().optional(),
});
export type Configuration = ReturnType<typeof readConfiguration>;

export function readConfiguration(environment: Record<string, string | undefined>) {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) throw new AimHarderError('INVALID_CONFIGURATION');
  let gymTimeZones: Record<string, string> = {};
  try {
    if (parsed.data.AIMHARDER_GYM_TIME_ZONES !== undefined) {
      gymTimeZones = timeZonesSchema.parse(JSON.parse(parsed.data.AIMHARDER_GYM_TIME_ZONES));
    }
  } catch { throw new AimHarderError('INVALID_TIME_ZONE_CONFIGURATION'); }
  return {
    gymTimeZones,
    username: parsed.data.AIMHARDER_USERNAME,
    password: parsed.data.AIMHARDER_PASSWORD,
    defaultGym: parsed.data.AIMHARDER_DEFAULT_GYM,
  };
}
