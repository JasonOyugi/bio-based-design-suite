import { describe, expect, it } from 'vitest';
import { depthBudget, elementAreas, qtyPerM2, takeoff } from './takeoff';
import { F00, F01, F03B, TEMPLATE, ej, unk } from './fixtures';

describe('elementAreas (placeholder 18 × 12 m, 6 storeys, 3 m)', () => {
  it('derives plate, suspended floors, roof and external wall areas', () => {
    expect(elementAreas(TEMPLATE)).toEqual({
      floorPlateM2: 216,        // 18 × 12
      suspendedFloorM2: 1080,   // 216 × (6 − 1)
      roofM2: 216,
      externalWallM2: 1080,     // 2 × (18 + 12) × 3 × 6, openings ignored in the spike
    });
  });
});

describe('qtyPerM2', () => {
  it('joists 50 × 200 at 400 centres → 0.025 m3/m2', () => {
    const q = qtyPerM2(F01.layers.find((l) => l.id === 'joists')!);
    expect(q.perM2!.low).toBeCloseTo(0.025);
    expect(q.perM2!.high).toBeCloseTo(0.025);
    expect(q.gaps).toEqual([]);
  });

  it('spacing range 400–600 widens the result: [50·200/1000/600, 50·200/1000/400]', () => {
    const q = qtyPerM2({ id: 'x', label: 'joists', thickness: ej(200), purchaseUnit: 'm3',
      quantity: { kind: 'members', width: ej(50), spacing: ej(400, 600) } });
    expect(q.perM2!.low).toBeCloseTo(10 / 600);
    expect(q.perM2!.high).toBeCloseTo(10 / 400);
    expect(q.perM2!.central).toBeCloseTo(10 / 500); // no stated central → midpoint spacing 500
  });

  it('a stated central is carried through the maths', () => {
    const q = qtyPerM2({ id: 'x', label: 'joists', thickness: ej(200), purchaseUnit: 'm3',
      quantity: { kind: 'members', width: ej(50), spacing: ej(400, 600, 'mm', { central: 400 }) } });
    expect(q.perM2!.central).toBeCloseTo(0.025);
  });

  it('members bought per metre → 1000 / spacing m/m2', () => {
    const q = qtyPerM2({ id: 'ij', label: 'I-joist', thickness: ej(200), purchaseUnit: 'm',
      quantity: { kind: 'members', width: unk('mm', 'I-joist flange width'), spacing: ej(600) } });
    expect(q.perM2!.low).toBeCloseTo(1.6667, 3);
    expect(q.gaps).toEqual([]); // width isn't needed when buying by length
  });

  it('50 mm topping by volume → 0.05 m3/m2', () => {
    const q = qtyPerM2(F00.layers.find((l) => l.id === 'topping')!);
    expect(q.perM2!.low).toBeCloseTo(0.05);
    expect(q.perM2!.high).toBeCloseTo(0.05);
  });

  it('unknown thickness on a volume layer → gap, no number', () => {
    const q = qtyPerM2(F03B.layers.find((l) => l.id === 'topping')!);
    expect(q.perM2).toBeNull();
    expect(q.gaps).toEqual(['Concrete topping: topping thickness']);
  });

  it('rejects impossible combinations', () => {
    expect(() => qtyPerM2({ id: 'x', label: 'x', thickness: ej(50), purchaseUnit: 'kg', quantity: { kind: 'volume' } }))
      .toThrow(/cannot be bought per kg/);
  });
});

describe('linear elements, rates and wastage (found while encoding frames)', () => {
  it('section per metre: 300 × 300 member → 0.09 m3/m', () => {
    const q = qtyPerM2({ id: 'col', label: 'column', thickness: ej(300), purchaseUnit: 'm3', quantity: { kind: 'section', width: ej(300) } });
    expect(q.perM2!.central).toBeCloseTo(0.09);
  });
  it('a rate layer passes its rate through, or a gap when unknown', () => {
    expect(qtyPerM2({ id: 'rb', label: 'rebar', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg',
      quantity: { kind: 'rate', rate: ej(8, 12, 'kg/m2') } }).perM2).toEqual({ low: 8, central: 10, high: 12 });
    expect(qtyPerM2({ id: 'rb', label: 'Rebar', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg',
      quantity: { kind: 'rate', rate: unk('kg/m2', 'reinforcement rate') } }).gaps).toEqual(['Rebar: reinforcement rate']);
  });
  it('wastage 5–10 % scales the total; unknown wastage is a gap, not zero', () => {
    const layer = { id: 'b', label: 'Board', thickness: ej(18), purchaseUnit: 'm2' as const, quantity: { kind: 'area' as const } };
    const [withW] = takeoff({ id: 'a', code: 'A', name: 'a', depth: ej(18), layers: [{ ...layer, wastage: ej(5, 10, '%') }] }, 100);
    expect(withW!.total!.low).toBeCloseTo(105);
    expect(withW!.total!.central).toBeCloseTo(107.5);
    expect(withW!.total!.high).toBeCloseTo(110);
    const [noW] = takeoff({ id: 'a', code: 'A', name: 'a', depth: ej(18), layers: [{ ...layer, wastage: unk('%', 'wastage allowance') }] }, 100);
    expect(noW!.total).toBeNull();
    expect(noW!.gaps).toEqual(['Board: wastage allowance']);
  });
});

describe('takeoff', () => {
  it('F-01 joists over 1080 m2 → 27 m3', () => {
    const joists = takeoff(F01, 1080).find((q) => q.layerId === 'joists')!;
    expect(joists.total!.low).toBeCloseTo(27);
  });
  it('F-00 beam-and-block by area → 1080 m2; topping → 54 m3', () => {
    const t = takeoff(F00, 1080);
    expect(t.find((q) => q.layerId === 'bnb')!.total).toEqual({ low: 1080, central: 1080, high: 1080 });
    expect(t.find((q) => q.layerId === 'topping')!.total!.low).toBeCloseTo(54);
  });
});

describe('depthBudget', () => {
  it('reports known thickness, unknown layers and the residual against stated depth', () => {
    const b = depthBudget(F01); // depth 275–300; joists 200 + T&G unknown
    expect(b.knownMm).toEqual({ low: 200, central: 200, high: 200 });
    expect(b.unknownLayers).toEqual(['T&G boarding']);
    expect(b.residualMm).toEqual({ low: 75, central: 87.5, high: 100 }); // central 287.5 − 200
    expect(b.inconsistent).toBe(false);
  });
  it('flags a stated depth smaller than the known layers', () => {
    const b = depthBudget({ id: 'x', code: 'X', name: 'x', depth: ej(100), layers: [
      { id: 'a', label: 'a', thickness: ej(150), purchaseUnit: 'm2', quantity: { kind: 'area' } }] });
    expect(b.residualMm).toEqual({ low: -50, central: -50, high: -50 });
    expect(b.inconsistent).toBe(true);
  });
});
