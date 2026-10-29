# Design rules

`DESIGN.md` (written in Phase 2) is the design source of truth. Until then, these rules apply.

- **Audience and tone:** a professional tool for QS, engineers and developers in East Africa. Dense but calm; it must not look templated. Our own identity: nothing from BASE's branding, wording or visuals.
- **Tokens only:** colours, type, spacing and radii come from `src/styles/tokens.css` (generated from `DESIGN.md`). No hard-coded colours in components.
- **Placeholders look different everywhere:** they are "pencilled" (violet, italic, hatched) with a "PH" tag on every placeholder value, row, layer and total that depends on one, and turn "inked" once validated (Jason, 29 Oct 2026). Dummy layers in drawn sections keep their material symbol with a dashed violet outline and a "dummy" label (proposed in mock A revision 2, to confirm with Jason). Depth not explained by the layers is drawn as one hatched "indicative: unexplained depth" band at the bottom of the section, labelled with what it may hold and "order and position not drawn".
- **Direction:** A, "Drawing sheet" (Jason, 29 Oct 2026); mocks in `design/mocks/a/`.
- **Grades are always visible** next to the number they qualify (tag or column), in tables, sections and exports.
- **Check states:** `meets` / `straddles` / `misses` / `not_assessed`, each with an icon or text as well as colour (never colour alone). v0.1 checks say "Data check", never "OK".
- **Ranges:** the central value prominently, with `low–high` beside it, in tabular numerals; `~value` for single estimates; say so when the central is only the midpoint. Currency shown with code.
- **Carbon sits beside cost**, in its own column or panel, never combined into cost.
- **Sections and plans:** SVG, to scale, with a scale bar.
- **Layout:** works at 1366 px wide and is usable on a tablet (pointer events, touch targets ≥ 40 px, no hover-only actions).
- **Accessibility:** WCAG 2.2 AA contrast (lint `DESIGN.md`), visible focus, keyboard reachable controls.
- **Always present:** the disclaimer, and the "PLACEHOLDER DATA – INTERNAL" watermark until the project is ≥ 80% validated by cost.
