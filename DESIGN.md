---
version: alpha
name: Drawing Sheet
description: A construction-document workspace for East African QS, engineers and developers. Cool drafting film, ink linework, section hatching, dimension strings, a title block, and violet "pencil" for every placeholder until it is validated.
colors:
  primary: "#17222a"
  secondary: "#4b5a60"
  tertiary: "#5b3a93"
  neutral: "#fbfcfc"
  paper: "#ffffff"
  ground: "#e4e9e8"
  rule: "#b4bfbe"
  rule-faint: "#dbe2e1"
  select: "#e2eaf0"
  subtotal: "#f3f6f6"
  caution-tint: "#fbf1df"
  on-primary: "#fbfcfc"
  placeholder-tint: "#efeaf7"
  placeholder-hatch: "#d6cbe8"
  indicative-hatch: "#7f67ab"
  meets: "#1d6646"
  straddles: "#8a5300"
  misses: "#a3262a"
  not-assessed: "#56656b"
  focus: "#1b5fc9"
  mat-concrete: "#eef0ee"
  mat-precast: "#e2e5e3"
  mat-timber: "#f6efe3"
  mat-timber-grain: "#82623a"
  mat-tile: "#fbfbf7"
  mat-board: "#f4f2ec"
  mat-board-dot: "#686d6a"
typography:
  body:
    fontFamily: Barlow Semi Condensed
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.35
  body-sm:
    fontFamily: Barlow Semi Condensed
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
  disclaimer:
    fontFamily: Barlow Semi Condensed
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.35
  note:
    fontFamily: Barlow Semi Condensed
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  h1:
    fontFamily: Barlow Condensed
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.02em
  h2:
    fontFamily: Barlow Condensed
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.1em
  label:
    fontFamily: Barlow Condensed
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: 0.1em
  grade-tag:
    fontFamily: Barlow Condensed
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.06em
  stamp:
    fontFamily: Barlow Condensed
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
  figure:
    fontFamily: Spline Sans Mono
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "\"tnum\" 1"
  figure-sm:
    fontFamily: Spline Sans Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    fontFeature: "\"tnum\" 1"
  figure-lg:
    fontFamily: Spline Sans Mono
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  touch: 40px
components:
  sheet:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 16px
  tab:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    height: 40px
  tab-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    height: 40px
  row-selected:
    backgroundColor: "{colors.select}"
    textColor: "{colors.primary}"
  secondary-text:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
  grade-tag:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.grade-tag}"
    rounded: "{rounded.none}"
  grade-tag-placeholder:
    backgroundColor: "{colors.placeholder-tint}"
    textColor: "{colors.tertiary}"
    typography: "{typography.grade-tag}"
    rounded: "{rounded.none}"
  placeholder-value:
    backgroundColor: "{colors.placeholder-hatch}"
    textColor: "{colors.tertiary}"
    typography: "{typography.figure}"
  placeholder-note:
    backgroundColor: "{colors.placeholder-tint}"
    textColor: "{colors.tertiary}"
    typography: "{typography.body-sm}"
  check-meets:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.meets}"
  check-straddles:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.straddles}"
  check-misses:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.misses}"
  check-not-assessed:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.not-assessed}"
  check-on-selected-row:
    backgroundColor: "{colors.select}"
    textColor: "{colors.straddles}"
  watermark-stamp:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.tertiary}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
  title-block:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.disclaimer}"
  subtotal-row:
    backgroundColor: "{colors.subtotal}"
    textColor: "{colors.primary}"
  caution-flag:
    backgroundColor: "{colors.caution-tint}"
    textColor: "{colors.straddles}"
    typography: "{typography.body-sm}"
  basis-label:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
  status-tag:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  page:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.primary}"
  focus-ring:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.focus}"
  drawing-concrete:
    backgroundColor: "{colors.mat-concrete}"
    textColor: "{colors.primary}"
  drawing-precast:
    backgroundColor: "{colors.mat-precast}"
    textColor: "{colors.primary}"
  drawing-timber:
    backgroundColor: "{colors.mat-timber}"
    textColor: "{colors.mat-timber-grain}"
  drawing-tile:
    backgroundColor: "{colors.mat-tile}"
    textColor: "{colors.primary}"
  drawing-board:
    backgroundColor: "{colors.mat-board}"
    textColor: "{colors.mat-board-dot}"
  drawing-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
  drawing-indicative:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.indicative-hatch}"
  drawing-rules:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.primary}"
  table-rules:
    backgroundColor: "{colors.rule-faint}"
    textColor: "{colors.primary}"
---

## Overview

**Drawing Sheet** is the visual identity of the Bio-based Design Suite (working title): a browser workspace where quantity surveyors, engineers and developers in East Africa compare bio-based and conventional building systems, with ranged, graded, landed cost. It is a professional tool, dense but calm, and it borrows its language from the construction documents its users already read every day: the drawing sheet with its border and title block, section hatching, dimension strings, and the violet ink of a rubber stamp.

The identity is the tool's own and neutral. The only mention of a sponsor is the small credit "Supported by Gatsby Africa" in the title block; there is no sponsor branding anywhere else, because the tool may move to a neutral host. Nothing is taken from BASE's CBFT Design Suite: we follow its workflow, never its branding, wording, visuals or code.

The one idea the identity is built around: **every number shows how much to trust it.** Stated evidence is inked; anything not yet validated is pencilled in violet, hatched and tagged, until a validation inks it in.

## Colors

- **Ink (`primary`, #17222a):** blue-black drawing ink. Body text, linework, rules around sheets and tables, selected tabs.
- **Pencil slate (`secondary`, #4b5a60):** secondary text, units, low–high ranges, notes. About 7.0:1 on the sheet.
- **Stamp violet (`tertiary`, #5b3a93):** reserved for one meaning, **placeholder / internal**. It colours PH tags, pencilled values, dummy layers in drawings, the indicative band and the watermark stamp, and nothing else. Never use it as a general accent, a link colour or a selected state.
- **Sheet (`neutral`, #fbfcfc)** sits on the **drafting-film ground (`ground`, #e4e9e8)**. Never cream or warm paper. Section drawings sit on pure `paper` (#ffffff).
- **Rules:** `rule` (#b4bfbe) for drawing and panel borders, `rule-faint` (#dbe2e1) for table row lines. `select` (#e2eaf0) marks the selected row; `subtotal` (#f3f6f6) tints subtotal rows. `caution-tint` (#fbf1df) sits behind completeness flags with `straddles` text.
- **Check states:** `meets` (#1d6646), `straddles` (#8a5300), `misses` (#a3262a), `not-assessed` (#56656b). Always paired with a shape and a word (see Components); colour alone never carries a state.
- **Placeholder fills:** `placeholder-tint` (#efeaf7) behind PH tags and dummy notes; `placeholder-hatch` (#d6cbe8) is the 135° hatch line behind pencilled values (violet text over it stays at 5.1:1 or better); `indicative-hatch` (#7f67ab) hatches the unexplained-depth band in sections.
- **Focus (`focus`, #1b5fc9):** the 2 px focus outline, offset 2 px. Used for nothing else.
- **Drawing materials (`mat-*`):** pale fills behind section hatching (concrete, precast, timber with `mat-timber-grain` lines, tile, board with `mat-board-dot` stipple). They are drawing conventions, not interface colours. Three line colours are darker than in the approved mock so they reach 4.5:1 against their fills: timber grain (#8b6a3e → #82623a), the indicative hatch (#8e77b8 → #7f67ab) and the board stipple (#8a8f8c → #686d6a).

## Typography

- **Barlow Semi Condensed** for interface and body text: a DIN-lineage grotesque, close to the lettering on drawings and site signage, and narrow enough for dense tables at 1366 px.
- **Barlow Condensed**, in capitals with wide tracking, for headings, labels, table heads, grade tags, title-block labels, drawing annotations and the stamp.
- **Spline Sans Mono** with tabular figures for every number in a table, range or total, so columns align and ranges read like dimension strings.
- **Nothing renders below 12 px**, including drawing labels after an SVG is scaled to its panel. Check rendered sizes, not just the stylesheet.
- **Pencilled values** (placeholders) are italic in violet. Inked values are upright in ink. The italic is part of the meaning, so load the mono's italic.
- Ranges: the central value first and prominent (`figure`), then `low–high` beside or below it (`figure-sm`, secondary). Single estimates read `~240`; a central that is only the midpoint carries an italic "mid". Money always shows its currency code (KES).

## Layout

- **The workflow is a top bar of numbered steps** in their real order (0 Home, 1 Building form, 2 Layout, 3 System design, 4 Schedule & BOQ, 5 Compare), with Library and Validation log set apart on the right as references. The numbers encode the sequence, so only steps get them.
- **Each screen is a sheet:** a white sheet with a thin ink border and a 4 px drawing frame on the ground, 12 px from the window edge. The sheet head carries the title, the element tabs (Floors, Walls, Roof, Frame), the project targets and the watermark stamp, in normal flow so the stamp never covers data.
- **A title block closes every screen:** tool name with the "Supported by Gatsby Africa" credit, project, sheet name and date, cost validated, and the full disclaimer.
- **Spacing** runs on a 4 px base (`xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24). Table cells are 6 px by 6 px. Touch targets are at least `touch` (40 px) high.
- **Widths:** designed at 1366 px, where no table may scroll. Below 1200 px, panels stack and wide tables scroll inside their box with an edge shadow as a cue (tablet landscape). Tablet portrait gets stacked rows in Phase 4. The page itself never scrolls sideways.

## Elevation & Depth

Flat. Depth comes from linework, not shadows: the sheet frame (a border plus a 4 px frame), heavier ink rules under table heads and above subtotals, and the hatch on placeholders. Where a rule is drawn with `box-shadow` (the sheet frame, the selected step and row markers) it is a hard, unblurred ink line. The only soft edge is the scroll cue at the edge of a table that can scroll, a `rule`-coloured gradient fading to transparent. No blur, no glass, no gradients except hatching and that cue.

## Shapes

Square corners throughout (`rounded.none`), as on a drawing. Circles (`rounded.full`) appear only in check-state symbols. Dashed outlines mean "not established": dashed ink for an unknown value, dashed violet for a dummy layer, dashed ink for the target line in range charts.

## Components

- **`grade-tag` / `grade-tag-placeholder`:** a small boxed code beside every evidence number: PH placeholder, PS published spec, EJ engineering judgement, QS quote or QS, PT prototype tested, LT lab tested, LP live project, RP repeat project. PH is violet on `placeholder-tint`; every other grade is ink on the sheet. A derived value takes the weakest grade of its inputs, and every total built on a placeholder carries PH.
- **`placeholder-value`:** violet italic figures over the 135° `placeholder-hatch`, with a PH tag. It applies to values, quantities that rest on a dummy dimension, rows, layers and totals. When a validation arrives, the same value is inked: upright, ink, no hatch, its new grade tag.
- **Check states:** `check-meets` filled circle and "Meets"; `check-straddles` half-filled circle and "Straddles"; `check-misses` a cross and "Misses"; `check-not-assessed` dashed circle and "Not assessed". In dense tables the symbol may stand alone if the cell has a visually hidden label and a legend is on screen. The group is always labelled "Data check" with its method grade, never "OK".
- **`tab` / `tab-selected`:** square tabs in an ink-bordered strip, 40 px high; the selected tab is ink with sheet-coloured text.
- **Assembly picker:** a full-width, 40 px high, ink-bordered button with the assembly code in mono, its name, and a chevron.
- **Route toggle:** a two-button segment (Imported / Regional), 40 px high, with the pressed state in ink; disabled with a reason when no alternative exists.
- **Section drawing:** SVG to scale with a scale bar. Layers use material hatching on `mat-*` fills; a left dimension string gives each thickness and a right one the stated overall depth (and the central it is drawn at). Dummy layers keep their material hatch with a dashed violet outline and a violet "dummy" label. Depth the layers don't explain is one hatched `drawing-indicative` band at the bottom, labelled "INDICATIVE", with what it may hold and "order and position not drawn".
- **Range chart:** each option's range drawn as a dimension line with oblique end ticks against a dashed target line; the selected option's row is tinted `select`.
- **`watermark-stamp`:** "PLACEHOLDER DATA – INTERNAL" in a double-ruled violet box, rotated −4°, with "N % of cost validated · stays until 80 %". It shows on every screen and export until the project is at least 80 % validated by cost.
- **`title-block`:** the footer described in Layout. The disclaimer text is fixed: "Exploratory design and cost comparison only. Not structural design, specification or construction documents. Projects need project-specific engineering and approval."
- **`placeholder-note`:** a dashed violet box for statements that depend on dummies (e.g. "Ceilings are dummy lines: fire-rated for REI 60? to confirm").
- **`caution-flag`:** a "!" mark and `straddles` text on `caution-tint`, for anything that makes a total incomplete: "Ceiling not included" (on the floor total and on every building total that includes that floor) and "Excludes N lines with unknown quantities or prices". Never used for check states.
- **`basis-label`:** every money total states its basis in a plain label beside the figure: "First-of-kind", "Repeat", "Basis unknown", or "Mixed basis" when lines differ. Never coloured.
- **`status-tag`:** each assembly shows its status (Advancing, Refining, Paused, Stopped) in a boxed label with its date. Paused and stopped systems stay visible and readable everywhere they appear, with their binding constraint written out beside the tag; they are never hidden, greyed below 4.5:1 or sorted out of view.
- **`subtotal-row`:** subtotals sit on `subtotal` with an ink rule above; the subtotal states its completeness ("complete", or the caution flags above) and its cost per m².
- **Totals panel:** the central total large (`figure-lg`) with its range below, per m², import share, a like-for-like block (each assembly per m², their ratio, and the engineer's pre-screen ratio beside it), carbon in its own block, cost validated with an 80 % mark, and the biggest unvalidated numbers.

## Do's and Don'ts

- **Do** keep violet for placeholders only. If something is violet, it is not yet validated.
- **Do** show the central value first, the range beside it, and a grade tag next to every evidence number, in tables, drawings and exports.
- **Do** keep carbon in its own column or panel, beside cost and never added into it.
- **Do** label every check "Data check" and pair each state's colour with its shape and word.
- **Do** draw sections to scale with a scale bar, and keep drawing text at 12 px or more after scaling.
- **Don't** use green "OK", ticks or any wording that implies approval or a calculation.
- **Don't** let the watermark stamp or any decoration cover a number.
- **Don't** introduce colours, radii, shadows or gradients outside these tokens; extend the tokens first.
- **Don't** use cream or warm paper grounds, serif display faces, near-black canvases or broadsheet hairline layouts.
- **Don't** use sponsor or BASE branding, wording or visuals.
