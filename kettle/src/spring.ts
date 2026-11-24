// The stepped return of a drag turn to the front, one value per exposure.
// With overshoot 0 it eases straight back; above 0 it swings past the front
// once and settles (0.25 crosses about 18% back, the tuned default).

export function springBack(turn: number, steps: number, overshoot: number): number[] {
  const count = Math.max(2, Math.round(steps));
  const frequency = (Math.PI / 2) * (1 + 8 * Math.max(0, overshoot));
  const values: number[] = [];
  for (let i = 1; i <= count; i++) {
    const u = i / count;
    values.push(i === count ? 0 : turn * (1 - u) ** 2 * Math.cos(frequency * u));
  }
  return values;
}
