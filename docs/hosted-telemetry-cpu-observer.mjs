const outcomes = new Set(['ok', 'exception', 'exceededCpu', 'exceededMemory', 'canceled', 'unknown', 'scriptNotFound', 'responseStreamDisconnected']);
export default {
  tail(events, env) {
    const deadline = Number(env.CAPTURE_DEADLINE_MS);
    if (!Number.isSafeInteger(deadline) || Date.now() >= deadline) return;
    for (const item of events) {
      if (item.scriptName !== 'aimharder-mcp-pilot-test' || item.executionModel !== 'stateless') continue;
      const event = item.event;
      if (!event || !('cron' in event) || event.cron !== '*/5 * * * *') continue;
      const observed = item.eventTimestamp;
      const cpu = item.cpuTime;
      const wall = item.wallTime;
      if (![observed, cpu, wall].every(Number.isSafeInteger)) continue;
      if (observed <= 0 || cpu < 0 || wall < 0 || cpu > 900000 || wall > 900000) continue;
      const packet = {
        kind: 'scheduled_cpu_v1', cron: '*/5 * * * *',
        invocation_at_ms: observed, cpu_ms: cpu, wall_ms: wall,
        outcome: outcomes.has(item.outcome) ? item.outcome : 'unclassified',
      };
      console.log(JSON.stringify(packet));
    }
  },
};
