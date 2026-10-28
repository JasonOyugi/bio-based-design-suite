// Draft of plan §2.3, cut down for the spike.
export type Grade = 'placeholder' | 'published_spec' | 'engineering_judgement' | 'quote_or_QS';
export type MV = {
  low: number; central?: number; high: number;
  unit: string; grade: Grade; source: string; singleEstimate?: true; toConfirm?: string[];
};
export type Unknown = { unknown: true; unit: string; toConfirm: string[] };
export type Dim = MV | Unknown;
export const isUnknown = (d: Dim): d is Unknown => 'unknown' in d;

export type Quantity =
  | { kind: 'volume' }
  | { kind: 'area' }
  | { kind: 'members'; width: Dim; spacing: Dim }
  | { kind: 'section'; width: Dim }                // per metre of a linear element; depth = thickness
  | { kind: 'rate'; rate: Dim };

export type Layer = {
  id: string; label: string; thickness: Dim;
  purchaseUnit: 'm3' | 'm2' | 'm' | 'kg' | 'nr'; quantity: Quantity;
  wastage?: Dim;                                     // %
};
export type Assembly = { id: string; code: string; name: string; depth: Dim; layers: Layer[]; quantityBasis?: 'm2' | 'm' };
export type Template = { gridXM: number[]; gridYM: number[]; storeys: number; storeyHeightM: number; voidsM2PerStorey: number };
