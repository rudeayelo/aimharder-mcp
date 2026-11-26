import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { parsePublicationAudience } from '../src/activity-publication.js';
import { AimHarderError } from '../src/errors.js';

// Anonymized capture of GET https://aimharder.es/api/settings/context.
const fixture = JSON.parse(readFileSync(new URL('./fixtures/settings-context.json', import.meta.url), 'utf8')) as { data: Record<string, unknown> };
const context = (data: Record<string, unknown>) => ({ ...fixture, data: { ...fixture.data, ...data } });
const withoutField = (field: string) => {
  const data = { ...fixture.data };
  delete data[field];
  return { ...fixture, data };
};

test('the captured account maps to followers with WOD TV results shown', () => {
  expect(parsePublicationAudience(fixture)).toEqual({ publication: 'followers', wodTvResults: true });
});

test.each([
  [1, 'followers'], [2, 'everyone'], [4, 'only-me'],
] as const)('privacy %i maps to %s', (privacy, publication) => {
  expect(parsePublicationAudience(context({ privacy })).publication).toBe(publication);
});

test.each([
  [0, true], [1, false],
] as const)('privCast %i maps to wodTvResults %s', (privCast, wodTvResults) => {
  expect(parsePublicationAudience(context({ privCast })).wodTvResults).toBe(wodTvResults);
});

describe('fails closed with INVALID_ACTIVITY_PREFERENCES', () => {
  const failsClosed = (body: unknown) => {
    let error: unknown;
    try { parsePublicationAudience(body); } catch (caught) { error = caught; }
    expect(error).toBeInstanceOf(AimHarderError);
    expect((error as AimHarderError).code).toBe('INVALID_ACTIVITY_PREFERENCES');
  };
  test.each([
    ['null privacy', context({ privacy: null })],
    ['missing privacy', withoutField('privacy')],
    ['string privacy "1"', context({ privacy: '1' })],
    ['unknown privacy 3', context({ privacy: 3 })],
    ['unknown privacy 9', context({ privacy: 9 })],
    ['null privCast', context({ privCast: null })],
    ['missing privCast', withoutField('privCast')],
    ['string privCast "1"', context({ privCast: '1' })],
    ['unknown privCast 3', context({ privCast: 3 })],
    ['unknown privCast 9', context({ privCast: 9 })],
    ['Aimfighter account with otherwise valid values', context({ isAimfighter: true, privacy: 2, privCast: 0 })],
    ['missing isAimfighter', withoutField('isAimfighter')],
    ['missing data envelope', fixture.data],
    ['HTML body (the old settings page)', '<!doctype html><div id="root"></div>'],
  ])('%s', (_name, body) => failsClosed(body));
});
