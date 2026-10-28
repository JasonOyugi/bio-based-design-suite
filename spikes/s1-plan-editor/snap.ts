export type Pt = { x: number; y: number };
export type Grid = { x: number[]; y: number[] }; // cumulative positions in metres

export const positions = (spacings: number[]) =>
  spacings.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1]! + s], [0]);

const EPS = 1e-9;
const roundTo = (v: number, step: number) => Number((Math.round(v / step) * step).toFixed(3));
const nearest = (v: number, lines: number[]) =>
  lines.reduce((best, l) => (Math.abs(l - v) < Math.abs(best - v) ? l : best), lines[0]!);

/** Snap to a grid line when within tol on that axis, otherwise to the sub-grid; clamp to the grid extent. */
export function snap(p: Pt, grid: Grid, sub = 0.5, tol = 0.3): Pt {
  const axis = (v: number, lines: number[]) => {
    const n = nearest(v, lines);
    const s = Math.abs(n - v) <= tol + EPS ? n : roundTo(v, sub);
    return Math.min(Math.max(s, lines[0]!), lines[lines.length - 1]!);
  };
  return { x: axis(p.x, grid.x), y: axis(p.y, grid.y) };
}
