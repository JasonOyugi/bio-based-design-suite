# Spike 002 (S1): SVG plan editor with a snapping grid

**Question.** Given a 3 m grid, when walls are drawn by mouse or touch, do they snap, can they be selected and deleted, do totals update, and does the layout JSON round-trip? Do 300 walls stay responsive?

**Run:**
- `npx vitest run spikes/s1-plan-editor`: 8 unit tests for snapping and wall rules.
- `npm run spike` and open `/s1-plan-editor/`.
- **Real-input check:** with the spike server on port 5174, run `node spikes/tools/s1-exercise.mjs <out-dir>`. It drives headless Chrome over the DevTools protocol with real mouse, keyboard, wheel and touch events at 1366 × 768 and 820 × 1180 (touch), then reads the results back from the page.

## Verdict: VALIDATED (after fixing three bugs the real-input run found)

### What worked (17 checks: 15 pass, 2 are findings)
- **Snapping:** off-grid drags land on grid lines within 0.3 m, and otherwise on the 0.5 m sub-grid, clamped to the grid. A drag from (4.2, 2.6) to (7.4, 2.6) becomes (4, 2.5) to (7.5, 2.5).
- **Perimeter and spine:** gives 5 walls, 60 m external and 18 m structural. Zero-length clicks and duplicate walls are rejected.
- **Editing:** a click or tap on a wall selects it, and the Delete button removes it. Escape mid-drag cancels the wall. The wheel zooms around the pointer.
- **Export:** the JSON round-trips. Its output is now `spikes/shared/sample-layout.json`, which feeds S2.
- **Touch:** a drag starts at its own touch point, not the previous tap. Tap-select and tap-delete work.
- **Performance:** with 300 walls, pointer-move plus re-render has a median of 7.9 ms, matching the 5-wall baseline (7.2 ms). The p95 (18 ms) is within the run-to-run noise of the 5-wall baseline (14–19 ms), which is set by the headless test harness. Confirm on a real tablet.

### Bugs the real-input run found (all fixed)
1. **Stale end point.** `onPointerUp` read the end point from React state, which lags the last `pointermove`, so a wall could end one move short (18 → 4.5 m). Fix: take the end point from the pointer-up event itself. **The real build must do the same.**
2. **The hover cursor swallowed clicks.** The cursor dot sits under the mouse on top of the walls, so clicking a wall started a new wall instead of selecting it. Fix: `pointerEvents="none"` on all feedback layers (cursor dot, preview line).
3. **300 walls re-rendered on every move** (p95 33 ms). Fix: render the walls in a memoised component, so cursor state doesn't redraw them (median 28 → 8 ms).

### Findings for the real Layout screen
- **Draw vs select is ambiguous at shared corners.** Pressing on an existing wall's end selects that wall, so a continuous perimeter can't be drawn from a corner, which is fatal on touch. The real screen needs explicit **Draw** and **Select** tools (CAD convention), or "press on a wall end continues drawing".
- **Touch targets:** the spike's buttons are 21 px tall, under the 40 px rule. That's for Phase 2 design.
- **Not tried, needed:** pan and pinch-zoom, openings on walls, per-storey `sameAs`, undo, splitting or merging collinear and T-junction walls.

### Recommendation for the real build
- Keep raw SVG and pointer events, with the viewBox in metres; no library needed.
- Fold `snap.ts` and `walls.ts` into `src/features/layout/` test-first.
- Build with the three fixes above and the Draw/Select tool split from the start.
