import { describe, expect, it } from 'vitest';
import { wallToBox } from './geometry';

describe('wallToBox (plan x,y → world x,z; y up)', () => {
  it('horizontal wall on storey 1', () => {
    const b = wallToBox({ x1: 0, y1: 0, x2: 3, y2: 0 }, 1, 3, 0.2);
    expect(b.position).toEqual([1.5, 4.5, 0]);   // elevation 3 + half-height 1.5
    expect(b.rotationY).toBeCloseTo(0);
    expect(b.scale).toEqual([3, 3, 0.2]);
  });
  it('wall along plan y rotates −π/2 about world y', () => {
    const b = wallToBox({ x1: 0, y1: 0, x2: 0, y2: 4 }, 0, 3, 0.2);
    expect(b.position).toEqual([0, 1.5, 2]);
    expect(b.rotationY).toBeCloseTo(-Math.PI / 2);
    expect(b.scale).toEqual([4, 3, 0.2]);
  });
});
