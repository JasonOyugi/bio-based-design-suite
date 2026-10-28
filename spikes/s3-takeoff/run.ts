import { FLOORS, OTHERS, TEMPLATE } from './fixtures';
import { depthBudget, elementAreas, takeoff } from './takeoff';

const fmt = (x: { low: number; central: number; high: number } | null, dp = 3) =>
  (x ? `${x.central.toFixed(dp)} (${x.low.toFixed(dp)}–${x.high.toFixed(dp)})` : 'GAP');
const areas = elementAreas(TEMPLATE);
console.log('Element areas (PLACEHOLDER template geometry):', areas);
const lengthM = 35 * TEMPLATE.storeys * TEMPLATE.storeyHeightM; // 7 × 5 grid intersections × building height

for (const [a, qty] of [...FLOORS.map((f) => [f, areas.suspendedFloorM2] as const), [OTHERS[0]!, areas.externalWallM2] as const,
  [OTHERS[1]!, areas.roofM2] as const, [OTHERS[2]!, lengthM] as const]) {
  const b = depthBudget(a);
  console.log(`\n${a.code} ${a.name} over ${qty} ${a.quantityBasis ?? 'm2'}: depth known ${fmt(b.knownMm, 0)} mm, residual ${fmt(b.residualMm, 0)} mm${b.inconsistent ? ' INCONSISTENT' : ''}`);
  console.table(takeoff(a, qty).map((q) => ({ layer: q.label, unit: q.unit, perUnit: fmt(q.perM2), total: fmt(q.total, 1), gaps: q.gaps.join('; ') })));
}
