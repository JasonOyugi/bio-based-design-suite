/** Bounds by interval arithmetic; central by applying the same operation to the centrals. */
export type Range = { low: number; central: number; high: number };

const EPS = 1e-9;
export const r = (low: number, high = low, central = (low + high) / 2): Range => {
  if (!(low <= central + EPS && central <= high + EPS)) throw new Error(`need low ≤ central ≤ high: ${low}, ${central}, ${high}`);
  return { low, central, high };
};
export const add = (a: Range, b: Range) => r(a.low + b.low, a.high + b.high, a.central + b.central);
export const mul = (a: Range, b: Range) => {
  const p = [a.low * b.low, a.low * b.high, a.high * b.low, a.high * b.high];
  return r(Math.min(...p), Math.max(...p), a.central * b.central);
};
export const div = (a: Range, b: Range) => {
  if (b.low <= 0 && b.high >= 0) throw new Error('divide by a range spanning zero');
  return mul(a, r(1 / b.high, 1 / b.low, 1 / b.central));
};
export const scale = (a: Range, k: number) => mul(a, r(k));
