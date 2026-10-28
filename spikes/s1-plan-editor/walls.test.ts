import { describe, expect, it } from 'vitest';
import { addWall, totals, type Wall } from './walls';

const w = (id: string, x1: number, y1: number, x2: number, y2: number): Wall => ({ id, x1, y1, x2, y2, type: 'external' });

describe('walls', () => {
  it('rejects zero-length walls', () => expect(addWall([], w('a', 1, 1, 1, 1))).toEqual([]));
  it('rejects duplicates in either direction', () => {
    const one = addWall([], w('a', 0, 0, 3, 0));
    expect(addWall(one, w('b', 3, 0, 0, 0))).toBe(one);
  });
  it('totals length by type', () => {
    const ws = [w('a', 0, 0, 18, 0), w('b', 18, 0, 18, 12)];
    expect(totals(ws)).toEqual({ count: 2, lengthByType: { external: 30 } });
  });
});
