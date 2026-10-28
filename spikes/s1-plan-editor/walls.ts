export type WallType = 'external' | 'party' | 'internal_structural' | 'partition';
export type Wall = { id: string; x1: number; y1: number; x2: number; y2: number; type: WallType };

export const length = (w: Wall) => Math.hypot(w.x2 - w.x1, w.y2 - w.y1);
const key = (w: Wall) => [`${w.x1},${w.y1}`, `${w.x2},${w.y2}`].sort().join('|');

export function addWall(walls: Wall[], w: Wall): Wall[] {
  if (length(w) < 0.01) return walls;
  if (walls.some((x) => key(x) === key(w))) return walls;
  return [...walls, w];
}

export function totals(walls: Wall[]) {
  const lengthByType: Partial<Record<WallType, number>> = {};
  for (const w of walls) lengthByType[w.type] = (lengthByType[w.type] ?? 0) + length(w);
  return { count: walls.length, lengthByType };
}
