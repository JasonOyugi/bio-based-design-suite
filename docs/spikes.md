# Phase 1 spike verdicts (28 Oct 2026)

> **Superseded in part (29 Oct 2026):** unknown dimensions, thicknesses, ceilings and rates are now seeded as dummy placeholders, not left unknown, so "ceiling not included" and the large unexplained-depth figures below describe the spike data only. See `.claude/rules/data-rules.md` and the v0.1 plan, Appendix A.

Spikes ran in order of risk to the product. Code in `spikes/` is throwaway. This file is the lasting record, kept after each spike is folded in and deleted.

| # | Spike | Verdict | What the real build must do |
|---|---|---|---|
| 001 | S3 quantity takeoff | **VALIDATED, with five schema changes** | Add a `section` quantity rule for linear elements. Treat unknown wastage as a gap. Report an area layer with unknown thickness as a price gap. Give F-04 a light `basedOn: "f-03b"` + "3A or 3B?". Every floor gets a `ceiling` layer, even if unknown, with "ceiling not included" on its BOQ total. All are folded into plan §2.3 and §2.5. |
| 002 | S1 SVG plan editor | **VALIDATED**; three bugs found and fixed | Take the drag end point from the pointer-up event, never from lagging state. Feedback layers get `pointer-events: none`. Render walls memoised (300 walls: median 28 → 8 ms per move). Add explicit **Draw** and **Select** tools, because pressing on a shared corner is ambiguous. Touch targets ≥ 40 px. |
| 003 | S2 r3f massing | **VALIDATED** | Lazy-load Building Form (three + drei = 249 kB gzipped, in its own chunk). One instanced mesh per wall type (2,400 instances at 60 fps on Intel Iris Xe). Frame the camera to the model. Section cuts are open-faced unless capped. |

## Key numbers
- **Placeholder template** (18 × 12 m, 6 storeys, 3 m): floor plate 216 m², suspended floors 1,080 m², external wall 1,080 m², 35 grid columns.
- **Floor depth not explained by listed layers:** F-00 40 mm; F-01 75–100 mm; F-03B 77–102 mm; F-07 0 mm. No floor lists a ceiling.
- **Editor responsiveness:** pointer-move with 300 walls has a median of 7.9 ms, against 7.2 ms with 5 walls. Its p95 of 18 ms is within the harness noise (14–19 ms baseline). Confirm on a tablet.
- **3D:** 60 fps normally and with 2,400 instances; one-finger touch orbit works.

## Open items, answered by Jason (28 Oct 2026)
- **Yes:** the "ceiling not included" warning also shows on building totals that include that floor (plan §2.5).
- **Yes:** unexplained residual depth is drawn as one hatched "indicative" band in sections (plan §2.3).
- **Deferred:** the real-tablet test (3D performance, touch drawing) moves to the Phase 4 Layout screen. The measurements so far are from this laptop and Chrome emulation.

## Fold-in map
- S3 `range.ts` and `takeoff.ts` go to `src/domain/` (Phase 3).
- S1 `snap.ts` and `walls.ts` go to `src/features/layout/` (Phase 4).
- S2 `geometry.ts` goes to `src/features/building-form/` (Phase 4).

Every fold-in is a test-first rewrite under strict TypeScript. Spike code is never typechecked. Everything else in `spikes/` is deleted when its fold-in lands; remove `spikes/**` from the Vitest include at that point.
