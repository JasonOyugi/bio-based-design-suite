// Placeholder template geometry and Studio III floor build-ups (plan Appendix A). Unknowns stay unknown.
import type { Assembly, MV, Template, Unknown } from './model';

const SRC = 'studio3-floor-options-draft';
const ENG = 'to confirm with the engineer';
export const ej = (low: number, high = low, unit = 'mm', extra: Partial<MV> = {}): MV =>
  ({ low, high, unit, grade: 'engineering_judgement', source: SRC, ...extra });
export const unk = (unit: string, ...toConfirm: string[]): Unknown => ({ unknown: true, unit, toConfirm });
const approx = (v: number, unit = 'mm') => ej(v, v, unit, { singleEstimate: true });

export const TEMPLATE: Template = { gridXM: [3, 3, 3, 3, 3, 3], gridYM: [3, 3, 3, 3], storeys: 6, storeyHeightM: 3, voidsM2PerStorey: 0 };

export const F00: Assembly = {
  id: 'f-00', code: 'F-00', name: 'Baseline beam and block', depth: approx(240),
  layers: [
    { id: 'tile', label: 'Floor tile and bedding', thickness: unk('mm', 'tile + bedding thickness'), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'topping', label: 'Concrete topping', thickness: ej(50), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'bnb', label: 'Beam and block', thickness: ej(150), purchaseUnit: 'm2', quantity: { kind: 'area' } },
  ],
};

export const F01: Assembly = {
  id: 'f-01', code: 'F-01', name: 'Timber joists with T&G', depth: ej(275, 300),
  layers: [
    { id: 'tg', label: 'T&G boarding', thickness: unk('mm', 'T&G board thickness'), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'joists', label: 'C16 joists 200×50 @400', thickness: ej(200), purchaseUnit: 'm3', quantity: { kind: 'members', width: ej(50), spacing: ej(400) } },
  ],
};

export const F03B: Assembly = {
  id: 'f-03b', code: 'F-03B', name: 'Cassette (18 ply on ribs) with topping', depth: ej(245, 270),
  layers: [
    { id: 'topping', label: 'Concrete topping', thickness: unk('mm', 'topping thickness'), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'ply', label: '18 mm plywood deck', thickness: ej(18), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'ribs', label: 'Ribs 150×50', thickness: ej(150), purchaseUnit: 'm3', quantity: { kind: 'members', width: ej(50), spacing: unk('mm', 'rib spacing') } },
  ],
};

const e = (what: string) => `${what} (${ENG})`;
const tg = (id: string): Assembly['layers'][number] =>
  ({ id, label: 'T&G boarding', thickness: unk('mm', e('T&G board thickness')), purchaseUnit: 'm2', quantity: { kind: 'area' } });

export const F01A: Assembly = {
  id: 'f-01a', code: 'F-01A', name: 'Timber joists with T&G + 50 screed',
  depth: unk('mm', e('does row 1 depth apply to 1A?')),
  layers: [
    { id: 'screed', label: 'Screed 50', thickness: ej(50), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    tg('tg'),
    F01.layers[1]!,
  ],
};

export const F02: Assembly = {
  id: 'f-02', code: 'F-02', name: 'I-joist with concrete topping', depth: approx(300),
  layers: [
    { id: 'topping', label: 'Concrete topping', thickness: unk('mm', e('topping thickness')), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'deck', label: 'Deck board', thickness: unk('mm', e('deck board under topping?')), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'ijoists', label: 'I-joists 200 @600', thickness: ej(200), purchaseUnit: 'm',
      quantity: { kind: 'members', width: unk('mm', e('I-joist flange width')), spacing: ej(600) } },
  ],
};

export const F03A: Assembly = {
  id: 'f-03a', code: 'F-03A', name: 'Cassette with two T&G layers', depth: ej(245, 270, 'mm', { toConfirm: [e('does row 3 apply to 3A?')] }),
  layers: [
    tg('tg1'), tg('tg2'),
    { id: 'ribs', label: 'Cassette ribs', thickness: unk('mm', e('does 3A use 150×50 ribs?')), purchaseUnit: 'm3',
      quantity: { kind: 'members', width: unk('mm', e('rib width')), spacing: unk('mm', e('rib spacing')) } },
  ],
};

export const F04: Assembly = {
  id: 'f-04', code: 'F-04', name: 'Cassette with strawboard layer', depth: approx(305),
  layers: [
    { id: 'straw', label: 'Strawboard 60', thickness: ej(60, 60, 'mm', { toConfirm: [e('layer position')] }), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    // "as 3": the variant (A or B) is unknown, so 3B's layers are reused here and flagged
    ...F03B.layers.map((l) => ({ ...l, label: `${l.label} (as option 3; variant to confirm with the engineer)` })),
  ],
};

export const F05: Assembly = {
  id: 'f-05', code: 'F-05', name: 'Cassette as permanent formwork under ribbed slab', depth: approx(240),
  layers: [
    // A ribbed slab is not thickness × area, so concrete is a rate (m3 per m2) rather than a volume.
    { id: 'slab', label: 'In-situ ribbed concrete slab', thickness: unk('mm', e('slab thickness')), purchaseUnit: 'm3',
      quantity: { kind: 'rate', rate: unk('m3/m2', e('concrete volume per m2 (rib geometry)')) } },
    { id: 'rebar', label: 'Reinforcement', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg',
      quantity: { kind: 'rate', rate: unk('kg/m2', e('reinforcement rate')) } },
    { id: 'cassette', label: 'Timber cassette (prefabricated)', thickness: unk('mm', e('cassette build-up')), purchaseUnit: 'm2', quantity: { kind: 'area' } },
  ],
};

export const F06: Assembly = {
  id: 'f-06', code: 'F-06', name: 'Cassette with sacrificial timber soffit', depth: approx(185),
  layers: [
    { id: 'cassette', label: 'Timber cassette (prefabricated)', thickness: unk('mm', e('cassette build-up; must be shallower than option 3')), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'soffit', label: 'Sacrificial timber soffit 50', thickness: ej(50), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
  ],
};

export const F07: Assembly = {
  id: 'f-07', code: 'F-07', name: 'Timber-concrete composite', depth: approx(155),
  layers: [
    { id: 'concrete', label: 'Concrete 80', thickness: ej(80), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'mesh', label: 'Mesh', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg', quantity: { kind: 'rate', rate: unk('kg/m2', e('mesh present? rate')) } },
    { id: 'connectors', label: 'Shear connectors', thickness: unk('mm', 'n/a'), purchaseUnit: 'nr', quantity: { kind: 'rate', rate: unk('nr/m2', e('connector type and rate')) } },
    { id: 'soffit', label: 'Timber soffit 75', thickness: ej(75, 75, 'mm', { toConfirm: [e('soffit product: CLT, glulam or nail-lam?')] }), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
  ],
};

// Conventional placeholders for the other elements: structure only, every dimension unknown (brief: placeholders, nothing invented).
export const W00: Assembly = {
  id: 'w-00', code: 'W-00', name: 'External wall, hollow block (placeholder)', depth: unk('mm', 'wall build-up'),
  layers: [
    { id: 'plaster-ext', label: 'External render', thickness: unk('mm', 'render thickness'), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'block', label: 'Hollow block', thickness: unk('mm', 'block size'), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'plaster-int', label: 'Internal plaster', thickness: unk('mm', 'plaster thickness'), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
  ],
};

export const R00: Assembly = {
  id: 'r-00', code: 'R-00', name: 'Flat RC roof slab (placeholder)', depth: unk('mm', 'roof build-up'),
  layers: [
    { id: 'membrane', label: 'Waterproofing membrane', thickness: unk('mm', 'membrane'), purchaseUnit: 'm2', quantity: { kind: 'area' } },
    { id: 'slab', label: 'RC slab', thickness: unk('mm', 'slab thickness'), purchaseUnit: 'm3', quantity: { kind: 'volume' } },
    { id: 'rebar', label: 'Reinforcement', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg', quantity: { kind: 'rate', rate: unk('kg/m2', 'reinforcement rate') } },
  ],
};

export const FR00: Assembly = {
  id: 'fr-00', code: 'FR-00', name: 'RC columns (placeholder)', depth: unk('mm', 'n/a'), quantityBasis: 'm',
  layers: [
    { id: 'concrete', label: 'Column concrete', thickness: unk('mm', 'column depth'), purchaseUnit: 'm3', quantity: { kind: 'section', width: unk('mm', 'column width') } },
    { id: 'rebar', label: 'Reinforcement', thickness: unk('mm', 'n/a'), purchaseUnit: 'kg', quantity: { kind: 'rate', rate: unk('kg/m', 'reinforcement rate per m') } },
  ],
};

export const FLOORS: Assembly[] = [F00, F01, F01A, F02, F03A, F03B, F04, F05, F06, F07];
export const OTHERS: Assembly[] = [W00, R00, FR00];
export const ASSEMBLIES: Assembly[] = [...FLOORS, ...OTHERS];
