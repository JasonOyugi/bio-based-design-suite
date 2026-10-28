# Phase 2: Visual identity, detailed task plan

> **For Claude Code:** implement task by task. Before each commit, an independent reviewer subagent checks the staged diff (`requesting-code-review`). Commit after each task. Push only when Jason approves the phase. `simplify-code` at the end of the phase.

**Goal:** Give the tool its own visual identity. Show Jason two directions as static mocks of System Design and Schedule & BOQ. When he picks one, write it up as `DESIGN.md`, lint it for WCAG AA and generate `src/styles/tokens.css`.

**Sources:** brief §7 (Phase 2 row) and §4 (screens 4 and 5); v0.1 plan §5 (outline), §2.5–2.8 and Appendix A; `.claude/rules/design.md`; skills `frontend-design`, `claude-design`, `design-md`, and `popular-web-designs` (vocabulary only).

**Status:** started 28 Oct 2026. Tasks 2.0–2.4 run now. Task 2.5 onwards waits for Jason's pick.

---

## 1. Jason's instructions for this phase (28 Oct 2026)

- **Identity:** the tool's own neutral identity, with a small "Supported by Gatsby Africa" credit. No Gatsby branding anywhere else, because the tool may later move to a neutral host. No resemblance to BASE.
- **No generic AI looks:** neither direction may fall back on the three looks the frontend-design skill names: (1) cream paper, a serif and a terracotta accent; (2) near-black with one acid accent; (3) a hairline broadsheet. "Drafting sheet" in particular must not drift toward (1). Push it toward construction documents in East Africa instead.
- **Mocks:** screenshots of each direction at 1366 px and at tablet width. They use the real floor data and show hatched placeholders, grade tags, all four check states, the "ceiling not included" warning and the hatched depth band. The mocks open with a double-click.

## 2. Phase 1 open items, answered (recorded in the v0.1 plan §2.3, §2.5, §7 and §10, `docs/spikes.md` and the rules)

1. **Yes:** "ceiling not included" also appears on every building total that includes that floor.
2. **Yes:** unexplained depth is drawn as one hatched "indicative" band in sections.
3. **Deferred:** the real-tablet test moves to the Phase 4 Layout screen.

## 3. What the mocks show, and where each number comes from

Both directions show the same content, so Jason compares identity rather than data.

| Item | Value in the mocks | Source |
|---|---|---|
| Building | Mid-rise template: 18 × 12 m, 6 storeys, 3 m storeys; suspended floors L1–L5 at 216 m² each, 1,080 m² in total | Placeholder geometry agreed in Phase 1 (`docs/spikes.md`) |
| Floor assignments | L1 = F-00 baseline beam and block; L2–L5 = F-03B cassette with topping | A user choice, made for the mock so two drawn sections and two BOQ groups appear |
| Assembly performance | Depth, airborne and impact dB, carbon and cost vs baseline for the ten floors as mapped in v0.1 plan Appendix A (the brief §3 rows, with F-01A's values unknown); graded `engineering_judgement` | Studio III pre-screen, shown as "Engineer pre-screen, draft" |
| Layers and gaps | F-00 and F-03B layers, unknown thicknesses and the ceiling gap, as in Appendix A and the S3 fixtures | Same |
| Targets | REI 60, 45 dB airborne, 62 dB impact, 3 m span | Brief §3 design basis |
| Max floor depth | 275 mm | **Mock input.** A project target the user would set, not a claim. Labelled "mock target" |
| Prices, lead times, installation rates | Round KES figures | **Dummy values for layout only.** Graded `placeholder`, PH-styled, and the mock pages say "dummy prices" |
| Suppliers | "Supplier A (EU, plywood)", "Regional supplier B (UG, KD pine)", "Local ready-mix supplier", "Local precast supplier" | Aliases only (guardrails 4–5) |
| Routes | EU → Mombasa → Nairobi; Jinja → Nairobi; "Nairobi local" for the ready-mix and precast lines | The first two from brief §3. "Nairobi local" is a **mock route**, labelled as such |

**Check states the data produces** (data comparison only, labelled "Data check"):
- Acoustic, airborne ≥ 45 dB: F-01 (42–48) **straddles**; F-01A (not stated) **not assessed**; the rest **meet**.
- Acoustic, impact ≤ 62 dB: F-01 (70–80) **misses**; F-00, F-02, F-05 and F-06 **straddle**; F-03A/B, F-04 and F-07 **meet**; F-01A (not stated) **not assessed**.
- Fire: the pre-screen states no fire resistance, so every option is **not assessed** against REI 60.
- Depth ≤ 275 mm (mock target): F-02 (~300) and F-04 (~305) **miss**; F-01 (275–300) **straddles**; F-01A (depth not stated) **not assessed**; the rest **meet**.
- Span: assessed at 3 m against a largest bay of 3 m, so it **meets**.
- Budget: no budget target set, so **not assessed**.

**Drawn sections** (to scale, with a scale bar; drawn at the central depth, flagged "central = midpoint" where needed):
- F-00: topping 50, beam and block 150, then one indicative band of 40 mm (~240 stated) that may hold the tile and bedding plus the ceiling.
- F-03B: 18 ply, 150 rib (section taken along a rib, so the unknown rib spacing isn't drawn), then one indicative band of 77–102 mm that may hold the topping, a bottom skin (if any) and the ceiling.
- The band sits at the bottom of the section. Its label names the layers it may hold and says their order and position are not drawn. That position is a drawing choice for Jason to confirm (see §6).

**Building total:** carries "ceiling not included (L1–L5)" and "excludes N lines with unknown quantities or prices".

## 4. The two directions (refined from the v0.1 plan's starting hypotheses)

This section is the one-page design brief called for in v0.1 plan §5 step 1. Audience, density and tone come from `.claude/rules/design.md`.

Both are **Operate/Compare** surfaces in claude-design's terms: dense tables with selection, no hero. Each has one signature, and everything around it stays quiet.

### A. "Drawing sheet" (East African construction drawings)
The starting hypothesis was "paper ground, ink linework". That drifts toward look (1), so it moves to the documents a Nairobi QS or engineer handles: the drawing title block, section hatching, dimension strings and the violet rubber stamp on approved plans.
- **Ground:** cool drafting-film grey, never cream. White sheets inside a ruled sheet border.
- **Ink:** blue-black. **Rules:** pencil slate.
- **Signature:** the "PLACEHOLDER DATA – INTERNAL" watermark is a **violet rubber stamp** on the sheet, like a county approval stamp, but saying the opposite. Violet means "placeholder / internal" everywhere: PH tags and placeholder hatching use it, and nothing else does.
- **Ranges** read as dimension strings: central figure, `low–high` beside it, and a tick-ended range bar against the target line.
- **Persistent footer:** a title block (project, sheet, status, % validated, scale, the disclaimer, "Supported by Gatsby Africa").
- **Type:** Barlow Semi Condensed for UI, Barlow Condensed in capitals for title-block labels and drawing annotations (DIN lineage, close to CAD lettering), Spline Sans Mono for figures.

### B. "Analysis book" (East African bill of quantities)
The starting hypothesis was "warm neutral plus a timber accent", which is also look (1). It moves to the bound BQ volume and the columnar analysis book: ruled pages, red money-column rules, double-underlined totals and "carried to collection".
- **Chrome:** deep bottle-green "binding cloth", with thumb-index tabs for the screens (≥ 40 px, touch-friendly).
- **Pages:** white, with faint blue ruling and rose double rules before the money columns.
- **Signature: pencil vs ink.** A placeholder is pencilled in (graphite grey, italic, hatched, PH). Engineering judgement and anything stronger is inked in blue-black. As numbers are validated, the bill visibly "inks in".
- **Watermark:** a cheque-style "specimen" overprint (repeated small diagonal text) plus a header label.
- **Totals:** double-underlined, in QS convention.
- **Type:** Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono, chosen for legibility on a tablet in site light.

### Shared across both (the rules, not the style)
- Grade tags on every number: PH, PS, EJ, QS, PT, LT, LP, RP, with a key.
- Check states use a symbol and a word as well as colour: ● Meets, ◐ Straddles, ✕ Misses, ○ Not assessed. The label is always "Data check", never "OK".
- Carbon has its own column or panel, never inside cost. Currency always shows its code.
- Disclaimer on every screen. Visible focus. Touch targets ≥ 40 px. No hover-only actions.

## 5. Tasks

### Task 2.0: Plan and recorded answers
**Files:** this plan; v0.1 plan §2.3, §2.5, §5, §7 and §10; `docs/spikes.md`; `.claude/rules/data-rules.md`; `.claude/rules/design.md`.
Review, then commit: `docs: Phase 2 plan; record Phase 1 answers`.

### Task 2.1: Mock A ("Drawing sheet")
**Files:** create `design/mocks/a/system-design.html`, `design/mocks/a/boq.html` and `design/mocks/a/a.css`.
- Static HTML and CSS, no build step and no scripts, so a double-click opens them (`file://`). Fonts come from Google Fonts with system fallbacks.
- Content follows §3. Responsive at 1366, 1024 and 768 px.
- Review, then commit: `design: mock direction A (drawing sheet)`.

### Task 2.2: Mock B ("Analysis book")
**Files:** create `design/mocks/b/system-design.html`, `design/mocks/b/boq.html` and `design/mocks/b/b.css`. Same rules as 2.1.
Review, then commit: `design: mock direction B (analysis book)`.

### Task 2.3: Screenshots and index
**Files:**
- Move `spikes/tools/cdp.mjs` to `scripts/cdp.mjs`, because Phase 4 dogfooding needs it after the spikes are deleted. Update the two spike imports.
- Create `scripts/shoot-mocks.mjs`, `design/mocks/index.html` and `design/mocks/shots/*.png`.
1. `node scripts/shoot-mocks.mjs` opens each mock in headless Chrome at 1366, 1024 and 768 px. It waits for `document.fonts.ready`, records any console errors and failed font loads, and saves a full-page PNG.
2. `design/mocks/index.html` links both directions and shows the screenshots side by side.
3. Self-check each screenshot against §3. Score the slop diagnostic from `claude-design` (ten tells) for each direction and fix what fires.
4. Review, then commit: `design: mock screenshots and index`.

**Then stop and show Jason.** He picks a direction, or a mix, and the iteration notes.

### Task 2.4: One iteration on the chosen direction (after Jason's pick)
Apply his notes to the chosen mock and re-shoot. The other direction stays in `design/mocks/` as a record.

### Task 2.5: `DESIGN.md`
**Files:** create `DESIGN.md` at the repo root.
1. Write the tokens (colours, typography, rounded, spacing, components including grade tags, check states, placeholder hatch, watermark and title block or binding) and the prose sections in canonical order.
2. Run `npx -y -p @google/design.md designmd lint DESIGN.md`. Fix every `contrast-ratio` warning and broken reference. Record the lint output in the commit message.
3. Review, then commit: `docs: DESIGN.md`.

### Task 2.6: `tokens.css` and base styles (TDD where there is logic)
**Files:** create `scripts/design-tokens.ts`, `scripts/design-tokens.test.ts` and `src/styles/tokens.css`; modify `src/styles/base.css` and `package.json` (`tokens` script, run inside `build`).
1. Test first: front-matter tokens become CSS custom properties (`--color-ink`, `--type-body-size` and so on), and token references resolve.
2. Generate `tokens.css` and replace every hard-coded colour in `base.css` with a token.
3. Self-host the fonts (`@fontsource` packages, pinned) so the static app works offline. Remove the Google Fonts dependency from the app (the mocks keep theirs).
4. `npm test`, `npm run build`. Review, then commit: `feat: design tokens from DESIGN.md`.

### Task 2.7: Phase wrap-up
Run `simplify-code` on the phase diff. Update the v0.1 plan §5 with what was decided. Push once Jason approves.

## 6. Decisions likely to come back to Jason (1-3-1, at most three)
1. The direction: A, B, or A's drawings in B's ledger.
2. Where the indicative band sits in a section: at the bottom (the mocks), at the top, or split by the unknown layers (which would need "one band" relaxed).
3. Tablet layout: the mocks are shot at 1024 (landscape) and 768 (portrait). Which orientation matters most on site?

## 7. Risks

| Risk | Mitigation |
|---|---|
| Dummy prices in the mocks read as estimates | PH styling, a "dummy prices" label on every mock page, round figures, nothing carried into `/data` |
| Google Fonts unavailable when a mock is opened offline | System fallbacks are set. The screenshots record which fonts loaded. The app self-hosts fonts (Task 2.6) |
| A direction looks like BASE | Neither uses BASE's colours, wording or layout. The reviewer is asked to check this explicitly |
| The rubber stamp (A) reads as an approval | It says "PLACEHOLDER DATA – INTERNAL". Violet is reserved for "placeholder", and no screen ever says approved or OK |
