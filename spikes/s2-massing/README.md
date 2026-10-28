# Spike 003 (S2): react-three-fiber massing from layout JSON

**Question.** Given S1's layout JSON, when rendered with react-three-fiber, do storeys, walls, slabs and roof show with toggles and a section cut? Does it hold ≥ 50 fps at 8 storeys × 300 walls, with the 3D code in its own lazy chunk?

**Run:**
- `npx vitest run spikes/s2-massing`: 2 geometry tests.
- `npm run spike` and open `/s2-massing/`.
- **Real-input check:** with the spike server on port 5174, run `node spikes/tools/s2-exercise.mjs <out-dir>`. It uses headless Chrome over the DevTools protocol, reads the three.js scene, and dispatches touch input for the tablet check.

## Verdict: VALIDATED

### What worked (5 of 5 checks pass)
- **Reads S1's export directly.** `spikes/shared/sample-layout.json` (S1's real export) renders with no conversion: 5 walls × 6 storeys = 30 instances, 6 slabs + roof, 35 columns at grid points.
- **Toggles:** walls, floors and structure hide independently.
- **Section:** a cut at x = 9 m applies a clipping plane to all 43 meshes; the screenshot shows the floors cut open.
- **Performance:** 2,400 wall instances (8 storeys × 300 walls, one instanced mesh) hold **60 fps**, the display cap, as in the normal view. This is on this laptop's real GPU (Intel Iris Xe, Direct3D 11 via ANGLE), not a software renderer. drei's Stats panel read 30 fps (range 30–58) at the moment a screenshot was captured; taking a screenshot stalls rendering.
- **Headroom unknown:** 60 fps is the display cap, so this shows the 50 fps target is met on this laptop, not how much headroom there is. **Tablet frame rate is untested;** confirm on a real tablet.
- **Tablet:** a one-finger touch drag orbits the camera in Chrome's touch emulation (the camera moved 28 m).
- **Lazy chunk:**
  - three, fiber and drei sit in one lazily loaded chunk, `Massing`: 934 kB, **249 kB gzipped**.
  - The S1 page loads only its own 3.8 kB entry plus the shared 220 kB React chunk, so screens without 3D don't pay for three.js.

### What didn't
- **The first load on a cold dev server takes about 18 s.** Vite pre-bundles three and drei, then reloads the page. This is dev only, and once per dependency change, but it broke the first automated run. Wait for "dependencies optimized" before testing.
- **Open section faces.** The cut faces are open (no stencil caps). That's acceptable for massing, but a "cut" look needs caps or a section-coloured backface.
- **Framing and overlap.** The initial camera crops the top of a 6-storey block, and drei's Stats panel overlaps the toolbar.

### Recommendation for the real build
- Keep r3f + drei. Put the Building Form screen behind `React.lazy`, so the 249 kB gzipped chunk loads only there.
- Draw walls as one instanced mesh per wall type.
- Frame the camera to the model's bounding box.
- Keep Stats as a dev-only overlay.
- Fold `geometry.ts` into `src/features/building-form/` test-first.
- Consider importing only `OrbitControls` from drei, to trim the chunk.
- Pitched roofs and wall openings are untested; add them when Building Form is built (Phase 4).
