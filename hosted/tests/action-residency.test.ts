import { afterEach, expect, test, vi } from 'vitest';
import { AccountActionCoordinator } from '../src/action-coordination.js';
import type { HostedEnvironment } from '../src/auth.js';

const coordinators: AccountActionCoordinator[] = [];
afterEach(() => {
  for (const coordinator of coordinators.splice(0)) coordinator.discardPreparations();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function fixture() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-21T12:00:00Z'));
  const holds: { settled: boolean }[] = [];
  const durations: number[] = [];
  const database = { prepare: () => ({ bind() { return this; },
    run: async () => ({}), first: async () => ({ expires: null }), all: async () => ({ results: [] }),
  }) } as unknown as D1Database;
  const coordinator = new AccountActionCoordinator({} as DurableObjectStorage, { AUTH_DB: database } as HostedEnvironment, promise => {
    const hold = { settled: false };
    const started = Date.now();
    holds.push(hold);
    void promise.then(() => { hold.settled = true; durations.push(Date.now() - started); });
  });
  coordinators.push(coordinator);
  const remember = (reference: string, lifetime = 120_000, action = 'booking-create') => coordinator.remember(reference, {
    accessGeneration: 0, action, revision: 'synthetic-revision', identity: 42,
    gymId: 'synthetic-gym', expires: Date.now() + lifetime,
  });
  const consume = (reference: string, gymId = 'other-gym') => coordinator.execute({
    accessGeneration: 0, action: 'booking-create', subject: 'synthetic-user', revision: 'synthetic-revision', identity: 42,
    reference, gymId, authorize: async () => { throw new Error('Unexpected authorization'); },
    recover: async () => { throw new Error('Unexpected recovery'); },
    dispatch: async () => { throw new Error('Unexpected dispatch'); },
  });
  return { coordinator, holds, durations, remember, consume };
}

test('an unused preparation retains its actor only until its original expiry', async () => {
  const { holds, remember } = fixture();
  remember('first');
  expect(holds).toEqual([{ settled: false }]);
  await vi.advanceTimersByTimeAsync(119_999);
  expect(holds).toEqual([{ settled: false }]);
  await vi.advanceTimersByTimeAsync(1);
  expect(holds).toEqual([{ settled: true }]);
});

test('overlapping preparations share a hold and roll it before extending beyond two minutes', async () => {
  const { holds, remember } = fixture();
  remember('first');
  await vi.advanceTimersByTimeAsync(60_000);
  remember('second');
  expect(holds).toEqual([{ settled: false }]);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(holds).toEqual([{ settled: true }, { settled: false }]);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(holds).toEqual([{ settled: true }, { settled: true }]);
});

test.each([false, true])('consumption releases or shortens residency even when its gym guard rejects (remaining=%s)', async remaining => {
  const { holds, remember, consume } = fixture();
  if (remaining) remember('earlier', 60_000);
  remember('latest');
  await expect(consume('latest')).rejects.toMatchObject({ code: 'BOOKING_REFERENCE_INVALID' });
  await vi.advanceTimersByTimeAsync(0);
  expect(holds).toEqual([{ settled: !remaining }]);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(holds).toEqual([{ settled: true }]);
});

test.each([NaN, Infinity, 120_001])('invalid preparation deadlines cannot create or poison residency (%s)', async lifetime => {
  const { holds, remember } = fixture();
  expect(() => remember('invalid', lifetime)).toThrow();
  remember('valid', 1000);
  expect(holds).toEqual([{ settled: false }]);
  await vi.advanceTimersByTimeAsync(1000);
  expect(holds).toEqual([{ settled: true }]);
});

test('missing and expired references do not cancel another valid preparation', async () => {
  const { holds, remember, consume } = fixture();
  remember('already-expired', -1);
  expect(holds).toEqual([]);
  remember('valid');
  await expect(consume('missing')).rejects.toMatchObject({ code: 'BOOKING_REFERENCE_INVALID' });
  expect(holds).toEqual([{ settled: false }]);
});

test('discard cancels its hold and a queued old timer cannot settle a new preparation', async () => {
  const { coordinator, holds, remember } = fixture();
  const timers = vi.spyOn(globalThis, 'setTimeout');
  remember('old');
  const oldCallback = timers.mock.calls[0]![0] as () => void;
  await vi.advanceTimersByTimeAsync(30_000);
  coordinator.discardPreparations();
  remember('new');
  oldCallback();
  await vi.advanceTimersByTimeAsync(90_000);
  expect(holds).toEqual([{ settled: true }, { settled: false }]);
  await vi.advanceTimersByTimeAsync(30_000);
  expect(holds).toEqual([{ settled: true }, { settled: true }]);
});

test('continuous fresh preparations never leave one background hold pending beyond two minutes', async () => {
  const { coordinator, holds, durations, remember } = fixture();
  remember('first');
  for (let minute = 1; minute <= 20; minute++) {
    await vi.advanceTimersByTimeAsync(60_000);
    remember('minute-' + minute);
    expect(holds.filter(hold => !hold.settled)).toHaveLength(1);
  }
  coordinator.discardPreparations();
  await vi.advanceTimersByTimeAsync(0);
  expect(durations.length).toBeGreaterThan(1);
  expect(durations.every(duration => duration >= 0 && duration <= 120_000)).toBe(true);
  expect(holds.every(hold => hold.settled)).toBe(true);
});

test.each(['booking-create', 'booking-cancel', 'booking-cancel-late', 'activity-publish', 'activity-delete'])(
  '%s permission uses the same bounded, immediately discardable residency contract', async action => {
    const { coordinator, holds, remember } = fixture();
    remember('action', 1000, action);
    expect(holds).toEqual([{ settled: false }]);
    coordinator.discardPreparations();
    await vi.advanceTimersByTimeAsync(0);
    expect(holds).toEqual([{ settled: true }]);
  });

test('capacity eviction cannot execute the oldest permission or cancel newer residency', async () => {
  const { coordinator, holds, remember, consume } = fixture();
  remember('evicted');
  for (let index = 0; index < 32; index++) remember('newer-' + index);
  await expect(consume('evicted', 'synthetic-gym')).rejects.toMatchObject({ code: 'BOOKING_REFERENCE_INVALID' });
  expect(holds).toEqual([{ settled: false }]);
  coordinator.discardPreparations();
  await vi.advanceTimersByTimeAsync(0);
  expect(holds).toEqual([{ settled: true }]);
});
