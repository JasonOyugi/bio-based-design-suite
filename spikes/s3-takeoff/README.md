# Spike 001 (S3): quantity takeoff from layers

**Question.** Given the mid-rise template and the ten Studio III floor assemblies as draft JSON, does takeoff give every layer either a quantity range or a named gap, matching hand calculations? If the layer model can't express the options, the schema in plan §2.3 is wrong.

**Run:** `npx vitest run spikes/s3-takeoff` (15 tests) and `npx tsx spikes/s3-takeoff/run.ts` (tables for every assembly).

Template geometry is a **placeholder**: 18 × 12 m, 6 storeys, 3 m. Every dimension the brief doesn't give is stored as unknown and flagged "to confirm with the engineer". No dimension was invented.

## Verdict: VALIDATED, with five schema changes (four from the spike, one from Jason's review)

### What worked
- All ten floors (F-00, 01, 01A, 02, 03A, 03B, 04, 05, 06, 07) and a placeholder wall, roof and frame are expressible. They need five quantity rules: `volume`, `area`, `members`, `rate` and a new `section`.
- Hand calculations match:
  - F-01 joists 50 × 200 @400 over 1080 m² → 27 m³.
  - F-00 topping → 54 m³.
  - F-07 concrete 80 → 86.4 m³ and soffit 75 → 81 m³.
  - F-02 I-joists @600 → 1800 m.
  - Columns: 35 grid points × 18 m → 630 m.
- Unknowns never become numbers. Every unknown dimension, spacing or rate surfaces as a named gap, and its quantity reads GAP.
- **Central values work.** A stated central is carried through the maths. A missing one falls back to the midpoint (e.g. spacing 400–600 gives central 0.020 m³/m²).
- **Depth budget works.** It reproduces the Appendix A findings:
  - F-00 has 40 mm unexplained.
  - F-01 has 75–100 mm of residual for the ceiling.
  - F-03B has 77–102 mm for the topping and anything below the ribs.
  - F-07 sums exactly to 155.
- A negative residual is flagged as an inconsistency (tested).

### What didn't, so the real schema must change
1. **Linear elements need a `section` rule** (m³ per metre = width × depth). Frames can't be expressed without it. Added and tested.
2. **Wastage must accept unknowns.** An unknown wastage is a gap, not zero. The plan had `wastage?: MetricValue`; it becomes `MetricOrUnknown`. Added and tested.
3. **Area layers hide a pricing gap.** A board bought per m² has a known quantity (1 m²/m²) but an unknown thickness, so its price can't be looked up (e.g. F-01's T&G). The quantity is correct, but the sourcing step must report "product spec incomplete: thickness unknown" as a price gap. Phase 3 needs this in the product-resolution step.
4. **"As option 3" needs a reference, not a copy.** F-04 is "option 3 + 60 strawboard", but the variant (3A or 3B) is unknown. The spike copies 3B's layers and relabels them, which duplicates data and buries the uncertainty in labels. **Jason's decision (28 Oct):** keep it light. F-04 gets `basedOn: "f-03b"` plus an assembly-level toConfirm "3A or 3B?", and lists its own layers. No inheritance logic. Keep `label` (display) separate from `note` and `toConfirm`, so gaps read cleanly.
5. **Every floor needs a ceiling/soffit layer, even if unknown** (Jason, 28 Oct). None of the ten options states one, so the timber options would look cheaper than beam-and-block. Timber floors flag "fire-rated ceiling needed for REI 60? (to confirm with the engineer)", and the BOQ warns "ceiling not included".

### Surprises
- **F-05's ribbed slab** isn't thickness × area. Concrete has to be a `rate` (m³ per m²), which is itself unknown until the rib geometry is known. The `rate` rule covers it without new code.
- **F-06's inconsistency can't be detected automatically.** Its cassette is unknown, so the residual (135 mm) only shows how much room there is. The cross-check against option 3 (150 ribs + 18 ply > 135) stays a human note in the gaps list.
- **No floor lists a ceiling or soffit finish.** The unexplained residual depth (40–100 mm) is probably that.

### Recommendation for the real build
- Keep the layer model from plan §2.3 with the four changes above.
- Draw unexplained residual depth as one hatched "indicative: unexplained depth" band in sections, so the drawing adds up to the stated depth without inventing a layer.
- Fold `range.ts` and `takeoff.ts` into `src/domain/` in Phase 3, rewritten test-first under strict TypeScript. The fixtures become the seed for `data/assemblies/floors/`.
