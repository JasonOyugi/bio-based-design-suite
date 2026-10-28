import { describe, expect, it } from 'vitest';
import { positions, snap } from './snap';

const grid = { x: positions([3, 3]), y: positions([3, 3]) }; // [0, 3, 6]

describe('snap', () => {
  it('builds cumulative grid positions', () => expect(positions([3, 3])).toEqual([0, 3, 6]));
  it('snaps to a grid line within tolerance', () => expect(snap({ x: 2.85, y: 3.1 }, grid)).toEqual({ x: 3, y: 3 }));
  it('falls back to the 0.5 m sub-grid', () => expect(snap({ x: 1.2, y: 4.4 }, grid)).toEqual({ x: 1, y: 4.5 }));
  it('treats tolerance as inclusive and steps past it', () => {
    expect(snap({ x: 3.3, y: 0 }, grid).x).toBe(3);
    expect(snap({ x: 3.31, y: 0 }, grid).x).toBe(3.5);
  });
  it('clamps to the grid extent', () => expect(snap({ x: -2, y: 9 }, grid)).toEqual({ x: 0, y: 6 }));
});
