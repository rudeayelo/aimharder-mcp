import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './hosted-telemetry-cpu-observer.mjs';
const env = { CAPTURE_DEADLINE_MS: String(Date.now() + 600000) };
const event = () => ({ scriptName: 'aimharder-mcp-pilot-test', executionModel: 'stateless', event: {cron: '*/5 * * * *', scheduledTime: 1793311200000}, eventTimestamp: 1793311200456, cpuTime: 12, wallTime: 456, outcome: 'ok' });
function capture(events, vars = env) {
  const out = []; const original = console.log;
  console.log = (value) => out.push(value);
  try { worker.tail(events, vars); } finally { console.log = original; }
  return out.map((x) => JSON.parse(x));
}
test('scheduled invocation emits only verified-unit technical fields', () => {
  const item = event();
  for (const key of ['logs', 'exceptions', 'diagnosticsChannelEvents', 'scriptVersion', 'durableObjectId']) Object.defineProperty(item, key, {get() {throw Error('private field must not be read');}});
  Object.defineProperty(item.event, 'request', {get() {throw Error('request must not be read');}});
  assert.deepEqual(capture([item]), [{kind:'scheduled_cpu_v1',cron:'*/5 * * * *',invocation_at_ms:1793311200456,cpu_ms:12,wall_ms:456,outcome:'ok'}]);
});
test('HTTP with hostile headers/payload never emits or reads CPU', () => {
  const item = {...event(), event: {request: {url:'https://example.invalid/?secret=HOSTILE',headers:{authorization:'HOSTILE'}}}};
  Object.defineProperty(item,'cpuTime',{get(){throw Error('not a scheduled invocation');}});
  assert.deepEqual(capture([item]), []);
});
test('other producer and durable-object traces are excluded', () => {
  assert.deepEqual(capture([{...event(),scriptName:'other'}, {...event(),executionModel:'durableObject'}]), []);
});
test('alarm and different cron are excluded', () => {
  assert.deepEqual(capture([{...event(),event:{scheduledTime:1793311200000}}, {...event(),event:{cron:'* * * * *',scheduledTime:1793311200000}}]), []);
});
test('non-finite, negative, fractional and excessive timing never emits', () => {
  for (const n of [NaN,Infinity,-1,0.5,900001]) assert.deepEqual(capture([{...event(),cpuTime:n}]), []);
  assert.deepEqual(capture([{...event(),wallTime:-1}]), []);
});
test('unexpected outcome is a closed static value', () => {
  assert.equal(capture([{...event(),outcome:'HOSTILE private exception'}])[0].outcome,'unclassified');
});
test('deadline and invalid environment fail closed', () => {
  assert.deepEqual(capture([event()],{CAPTURE_DEADLINE_MS:'0'}), []);
  assert.deepEqual(capture([event()],{}), []);
});
test('invocation timestamps must be valid without guessing scheduled-time encoding', () => {
  assert.deepEqual(capture([{...event(),eventTimestamp:null}]), []);
  assert.equal(capture([{...event(),event:{cron:'*/5 * * * *',scheduledTime:1793311200}}]).length, 1);
});
