import { add, div, mul, r, scale, type Range } from './range';
import { isUnknown, type Assembly, type Dim, type Layer, type MV, type Template } from './model';

const toRange = (m: MV): Range => r(m.low, m.high, m.central);

const val = (d: Dim, gaps: string[], label: string): Range | null => {
  if (isUnknown(d)) { gaps.push(...d.toConfirm.map((t) => `${label}: ${t}`)); return null; }
  return toRange(d);
};

export function qtyPerM2(layer: Layer): { perM2: Range | null; gaps: string[] } {
  const gaps: string[] = [];
  const { quantity: q, purchaseUnit: u, label } = layer;
  const bad = () => new Error(`${layer.id}: ${q.kind} cannot be bought per ${u}`);
  switch (q.kind) {
    case 'volume': {
      if (u !== 'm3') throw bad();
      const t = val(layer.thickness, gaps, label);
      return { perM2: t && scale(t, 1 / 1000), gaps };
    }
    case 'area':
      if (u !== 'm2') throw bad();
      return { perM2: r(1), gaps };
    case 'members': {
      if (u === 'm') {
        const s = val(q.spacing, gaps, label);
        return { perM2: s && div(r(1000), s), gaps };
      }
      if (u !== 'm3') throw bad();
      const w = val(q.width, gaps, label), d = val(layer.thickness, gaps, label), s = val(q.spacing, gaps, label);
      return { perM2: w && d && s ? div(scale(mul(w, d), 1 / 1000), s) : null, gaps };
    }
    case 'section': {
      if (u === 'm') return { perM2: r(1), gaps };
      if (u !== 'm3') throw bad();
      const w = val(q.width, gaps, label), d = val(layer.thickness, gaps, label);
      return { perM2: w && d ? scale(mul(w, d), 1 / 1e6) : null, gaps };
    }
    case 'rate':
      return { perM2: val(q.rate, gaps, label), gaps };
  }
}

export function elementAreas(t: Template) {
  const lx = t.gridXM.reduce((a, b) => a + b, 0);
  const ly = t.gridYM.reduce((a, b) => a + b, 0);
  const plate = lx * ly - t.voidsM2PerStorey;
  return {
    floorPlateM2: plate,
    suspendedFloorM2: plate * (t.storeys - 1),
    roofM2: lx * ly,
    externalWallM2: 2 * (lx + ly) * t.storeyHeightM * t.storeys,
  };
}

export type LayerQty = { layerId: string; label: string; unit: string; perM2: Range | null; total: Range | null; gaps: string[] };

export function takeoff(a: Assembly, areaM2: number): LayerQty[] {
  return a.layers.map((layer) => {
    const { perM2, gaps } = qtyPerM2(layer);
    const w = layer.wastage ? val(layer.wastage, gaps, layer.label) : r(0);
    const total = perM2 && w ? mul(scale(perM2, areaM2), add(r(1), scale(w, 1 / 100))) : null;
    return { layerId: layer.id, label: layer.label, unit: layer.purchaseUnit, perM2, total, gaps };
  });
}

export function depthBudget(a: Assembly) {
  const knownMm = a.layers.flatMap((l) => (isUnknown(l.thickness) ? [] : [toRange(l.thickness)])).reduce(add, r(0));
  const unknownLayers = a.layers.filter((l) => isUnknown(l.thickness)).map((l) => l.label);
  // Not clamped: a negative residual means the stated depth is smaller than the known layers (an inconsistency to report).
  let residualMm: Range | null = null;
  if (!isUnknown(a.depth)) {
    const d = toRange(a.depth);
    residualMm = r(d.low - knownMm.high, d.high - knownMm.low, d.central - knownMm.central);
  }
  return { knownMm, unknownLayers, residualMm, inconsistent: residualMm !== null && residualMm.high < 0 };
}
