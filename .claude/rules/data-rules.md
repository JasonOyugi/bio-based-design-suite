# Data rules

The full schema design is in the current plan in `docs/plans/` ("Data schema"). These rules are the invariants.

## Evidence numbers vs design inputs

- **Evidence numbers** (prices, dimensions of products and layers, densities, carbon, performance, route charges, FX, lead times) are always a `MetricValue`: `{low, central?, high, unit, grade, source, sourceType, date, validatedBy?, note?, toConfirm?, singleEstimate?, basis?}` with `low ≤ central ≤ high`. Never a bare number.
- **Design inputs** (layout geometry, storey count, project targets such as 45 dB or REI 60) are plain numbers with the unit in the field name (`heightM`, `airborneDb`). They are the user's choices, not claims.
- A value nobody has given us is seeded as a **dummy** (Jason, 29 Oct 2026): a `MetricValue` with grade `placeholder`, PH-styled, and `toConfirm` "to confirm with the engineer" (dimensions, spacings, thicknesses, layers) or "to confirm with the supplier" (prices, lead times). Every BOQ is therefore complete and compares like for like. The engineer's figures are never changed to fit a dummy.
- `UnknownValue` (`{unknown: true, unit, toConfirm[]}`) is kept only for what genuinely can't be priced, and for missing performance figures (checks on those say "not assessed"). Unknowns propagate: a quantity or cost built on one is reported as a gap and excluded from totals, and the total says so.
- A "~" estimate is stored as `low = high` with `singleEstimate: true`.
- Every money value states `basis`: `first_of_kind`, `repeat` or `unknown`.
- A paused or stopped system must state its `bindingConstraint`.
- Every floor assembly has a ceiling/soffit finish layer (role `ceiling`; structural soffits don't count), seeded as a priced dummy until known. Timber floors flag "fire-rated ceiling needed for REI 60? (to confirm with the engineer)". If a ceiling is unknown or unpriced, the floor total shows "ceiling not included", and so does every building total that includes that floor.

## Grades and sources

- Grade order, weakest to strongest: `placeholder` < `published_spec` < `engineering_judgement` < `quote_or_QS` < `prototype_tested` < `accredited_lab_tested` < `live_project` < `repeat_project`. A derived value takes the **weakest** grade of its inputs.
- `source` is an id in `data/sources/`. A `published_spec` value must cite a source with a URL and access date (grounded-citations ledger). Anything not sourced stays `placeholder`.
- Supplier `name` is set only for names Jason has confirmed; otherwise only the alias exists. v0.1 seeds exactly five aliased dummy suppliers: Supplier EU (Austria), Supplier ZA (South Africa), Supplier UG (Uganda), Supplier KE (Kenya) and Supplier TZ (Tanzania); products and routes are in the v0.1 plan, Phase 3 item 12. A layer no supplier offers is priced as a dummy trade rate marked "no supplier in library". A real name never appears beside a price that supplier didn't quote.
- Dummy rates are **calibrated to the engineer's pre-screen ratio** (Jason, 29 Oct 2026): each floor assembly's central bottom-up cost per m², divided by F-00's, falls within its "cost vs baseline" range (any point in the range, not pinned to its midpoint). Walls, roof and frame have no pre-screen ratio and are not calibrated. The BOQ says so on the page: "dummy rates calibrated to the engineer's pre-screen ratio". A ratio that only agrees because of calibration is not evidence; disagreement means something only once real quotes replace the dummies.
- Every concrete-topped floor (F-00, F-02, F-03B, F-05, F-07) gets a dummy mesh line with `toConfirm` "mesh in topping? to confirm with the engineer" (Jason, 29 Oct 2026); it is priced from Supplier KE's rebar (our choice of supplier). F-05 already has a reinforcement line for its ribbed slab; its mesh line covers the topping only, so nothing is counted twice (our reading: whether F-05 has a separate topping zone is to confirm with the engineer).

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

- Ranges use interval arithmetic and treat inputs as independent worst-case bounds. The central estimate is carried alongside by applying the same operation to the centrals. When a value has no stated `central`, the midpoint is used and flagged ("central = midpoint"). Central values weight % validated and the call list.
- Never net carbon into cost. Keep first-of-kind and repeat cost labelled.
