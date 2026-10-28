# Data rules

The full schema design is in the current plan in `docs/plans/` ("Data schema"). These rules are the invariants.

## Evidence numbers vs design inputs

- **Evidence numbers** (prices, dimensions of products and layers, densities, carbon, performance, route charges, FX, lead times) are always a `MetricValue`: `{low, high, unit, grade, source, sourceType, date, validatedBy?, note?, toConfirm?, singleEstimate?, basis?}`. Never a bare number.
- **Design inputs** (layout geometry, storey count, project targets such as 45 dB or REI 60) are plain numbers with the unit in the field name (`heightM`, `airborneDb`). They are the user's choices, not claims.
- A value nobody has given us is an `UnknownValue` (`{unknown: true, unit, toConfirm[]}`), never a guess. Unknowns propagate: a quantity or cost built on one is reported as a gap and excluded from totals, and the total says so.
- A "~" estimate is stored as `low = high` with `singleEstimate: true`.
- Every money value states `basis`: `first_of_kind`, `repeat` or `unknown`.
- A paused or stopped system must state its `bindingConstraint`.

## Grades and sources

- Grade order, weakest to strongest: `placeholder` < `published_spec` < `engineering_judgement` < `quote_or_QS` < `prototype_tested` < `accredited_lab_tested` < `live_project` < `repeat_project`. A derived value takes the **weakest** grade of its inputs.
- `source` is an id in `data/sources/`. A `published_spec` value must cite a source with a URL and access date (grounded-citations ledger). Anything not sourced stays `placeholder`.
- Supplier `name` is set only for names Jason has confirmed; otherwise only the alias (e.g. "Supplier A (EU, CLT)") exists.

## Files

- One folder per collection under `/data`. A file holds one entity or an array of entities. File name = id for single-entity files. Ids are kebab-case and unique per collection.
- Adding a product, route, assembly, building type, source or validation needs only a new JSON file. If it needs a code change, the schema is wrong.
- Every file is zod-validated at build (`npm run validate:data`), including cross-references (supplier, product, source and route ids) and unit consistency (a price's denominator equals the product's purchase unit).
- Units come from the closed registry in `src/domain/units.ts`. Money units carry an ISO currency (`EUR/m3`, `KES/m2`); FX is `QUOTE/BASE` (`KES/EUR`).

## Validations

- Validation entries are append-only. A newer entry for the same `MetricRef` supersedes an older one as the effective value; history is never edited or deleted.
- A `MetricRef` is `collection/id#path`, where array items with an `id` are addressed by id (`assemblies/f-03b#layers[topping].thickness`), so refs survive reordering.
- `validatedBy` holds a validation entry id, never a name. Who and organisation stay in the Validation Log unless `disclose` is true.
- Refs and ids are internal keys and may contain names. Screens and exports print display labels (supplier alias, layer label), never raw refs or ids.
- Partner sources (e.g. the Studio III pre-screen) are `confidential` with a neutral `displayAs`.

## Maths

- Ranges use interval arithmetic and treat inputs as independent worst-case bounds. Midpoints are used only for sorting and weighting, and are labelled as such.
- Never net carbon into cost. Keep first-of-kind and repeat cost labelled.
