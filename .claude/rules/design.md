# Design rules

`DESIGN.md` (written in Phase 2) is the design source of truth. Until then, these rules apply.

- **Audience and tone:** a professional tool for QS, engineers and developers in East Africa. Dense but calm; it must not look templated. Our own identity: nothing from BASE's branding, wording or visuals.
- **Tokens only:** colours, type, spacing and radii come from `src/styles/tokens.css` (generated from `DESIGN.md`). No hard-coded colours in components.
- **Placeholders look different everywhere:** hatched or italic styling plus a "PH" tag on every placeholder value, row, layer and total that depends on one. Indicative (unknown-thickness) layers in drawn sections are hatched and labelled "indicative".
- **Grades are always visible** next to the number they qualify (tag or column), in tables, sections and exports.
- **Check states:** `meets` / `straddles` / `misses` / `not_assessed`, each with an icon or text as well as colour (never colour alone). v0.1 checks say "Data check", never "OK".
- **Ranges:** formatted `low–high unit` with tabular numerals; `~value` for single estimates. Currency shown with code.
- **Carbon sits beside cost**, in its own column or panel, never combined into cost.
- **Sections and plans:** SVG, to scale, with a scale bar.
- **Layout:** works at 1366 px wide and is usable on a tablet (pointer events, touch targets ≥ 40 px, no hover-only actions).
- **Accessibility:** WCAG 2.2 AA contrast (lint `DESIGN.md`), visible focus, keyboard reachable controls.
- **Always present:** the disclaimer, and the "PLACEHOLDER DATA – INTERNAL" watermark until the project is ≥ 80% validated by cost.
