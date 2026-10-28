# Brief: Bio-based Construction Design Suite (working title), v0.1

Owner: Jason Oyugi, Bio-Based Construction programme, Gatsby Africa. Date: 28 Oct 2026.
Background reading: `docs/plan.md` (programme context, benchmarks, audiences). Where it conflicts with this brief, this brief wins.

---

## 1. What we are building

A browser-based design workspace for bio-based building in East Africa. A user picks a building type, lays out the building, chooses a construction system for each element (floors, walls, roof, frame) from a materials library, sees checks, and gets a schedule and bill of quantities (BOQ) with cost. The aim is to make bio-based vs conventional decisions easy for developers, quantity surveyors (QS), engineers and manufacturers.

**Workflow reference:** BASE Bahay's CBFT Design Suite (cbft-design-suite.base-builds.com). Its flow is Home (projects and templates) → Building Form (3D model) → Wall Layout (plan drawn on a grid, side panel with totals) → Wall Design (table of elements with dropdowns, plus check tabs) → Schedule of Panels (drawn panel types, cutting list, CSV/DXF export) → Member Capacity (material/section datasheet) → Structural Analyzer. Match that workflow and level of polish. **Do not copy its branding, wording, visuals or code.** This is our own product with its own identity.

What we add that BASE does not have: **cost**. The BOQ, the supplier on each line, imported vs regional route, landed cost, and how much of the cost is validated.

## 2. Core principle: complete tool, placeholder data, validated over time

- Build the whole workflow now with placeholder numbers. Validation happens away from the tool, in calls with QS and suppliers (e.g. Busoga Forestry Company). Each confirmed number replaces a placeholder.
- Every number is a `MetricValue`: `{low, high, unit, grade, source, sourceType, date, validatedBy?, note?, toConfirm?[]}`. Never a bare number.
- `grade` enum, weakest to strongest: `placeholder`, `published_spec` (datasheet/ETA/EPD), `engineering_judgement`, `quote_or_QS`, `prototype_tested`, `accredited_lab_tested`, `live_project`, `repeat_project`.
- Placeholders look different everywhere (hatched or italic plus a "PH" tag). Show a "PLACEHOLDER DATA – INTERNAL" watermark until a project is at least 80% validated by cost.
- A **Validation Log** records each confirmation: what, value, who, organisation, date, method. Show "% of this project's cost validated" and a ranked list of the biggest unvalidated numbers by cost share. That list is the team's call list.

## 3. Data layers

JSON files under `/data`, validated with zod at build. Adding a file needs no code change.

1. **Materials library.** Products from suppliers. Start with credible offshore suppliers that publish technical approvals and EPDs (EU and South African engineered timber: CLT, glulam, LVL, I-joists, OSB/plywood, fixings). Add conventional comparators: concrete, hollow block, beam-and-block, rebar, light-gauge steel. Add Busoga Forestry Company as the first regional supplier (kiln-dried pine; grades and volumes are placeholders). Fields: supplier, origin country, product, grade/strength class, dimensions, density, carbon A1–A3 per unit, price ex-works, lead time, certifications. Use only real company names I confirm; otherwise label them "Supplier A (EU, CLT)" etc. **Ask me for the supplier list before seeding.**
2. **Routes.** Origin → destination (e.g. EU → Mombasa → Nairobi; Jinja → Nairobi; Jinja → Kigali) with freight, duty (EAC CET), clearing, inland haulage and FX, all as MetricValues. Landed cost = ex-works + route.
3. **Assemblies.** Floor, wall, roof and frame build-ups made of library products, layer by layer (material, thickness, role), with performance (depth, fire, airborne/impact sound, span) as MetricValues. Seed floors from the Studio III table below, plus a conventional baseline for each element.
4. **Building types.** Templates with grid, storeys, and element areas/lengths. v0.1 has one type: an urban mid-rise apartment block (Zima-type, 5–8 storeys, 3 m spans). Build it so ADHI townhouse, rooftop extension, relocatable rental and warehouse can be added later as data.
5. **Projects.** A user's building (type + layout + chosen assemblies + targets), saved in the browser and exportable as JSON.

### Seed: floor assemblies (Studio III pre-screen)

These are directional estimates: grade `engineering_judgement`, track P. Add toConfirm flags for "pack date", "carbon scope A1–A3?" and "cost basis first-of-kind vs repeat". Design basis: 3 m span, 1.5 kN/m² imposed, REI 60, targets 45 dB airborne / 62 dB impact, Kenya NBC 2024.

| Option | Depth mm | Cost vs baseline | Airborne / impact dB | Carbon kg CO₂e/m² | Layers known |
|---|---|---|---|---|---|
| Baseline beam and block | ~240 | 1.00× | 50–55 / 58–65 | 110–140 | 150 beam and block + 50 topping + tile |
| 1 Timber joists + T&G | 275–300 | 0.90–1.10× | 42–48 / 70–80 | 20–30 | 200×50 C16 joists @400 + T&G (1A: +50 screed) |
| 2 I-joist + topping | ~300 | 1.05–1.25× | 50–55 / 58–66 | 50–65 | 200 I-joist @600 + concrete topping (thickness ?) |
| 3 Cassette + topping | 245–270 | 1.10–1.35× | 52–57 / 55–62 | 55–70 | 3B: 18 ply on 150×50 ribs + topping; 3A: 2 T&G layers |
| 4 Cassette + strawboard | ~305 | 1.20–1.45× | 54–58 / 54–60 | 50–65 | as 3 + 60 strawboard |
| 5 Cassette as formwork | ~240 | 0.95–1.15× | 52–58 / 58–65 | 90–115 | cassette under in-situ ribbed slab (thicknesses ?) |
| 6 Cassette + timber soffit | ~185 | 1.15–1.40× | 48–54 / 60–68 | 40–55 | cassette + 50 sacrificial soffit |
| 7 Timber-concrete composite | ~155 | 1.10–1.30× | 54–60 / 55–62 | 70–90 | 80 concrete on 75 timber soffit |

Store "~" values as low = high and flag them "single estimate". Draw unknown thicknesses as hatched "indicative" layers and list the gaps for me. Everything else (walls, roof, frame, all prices) is a placeholder, clearly marked, with the source type stated.

## 4. Screens (top navigation, like the reference)

1. **Home.** Recent projects; Templates (building types) that open as a copy.
2. **Building Form.** 3D massing (react-three-fiber): storeys, grid, roof; toggles for structure / floors / walls; cross-section view.
3. **Layout.** 2D plan on a grid per storey: grid lines, walls, openings, floor areas. Side panel with totals (floor area, wall length, element counts).
4. **System Design.** One table per element type (floors, walls, roof, frame). Each row is an element or zone with a dropdown choosing an assembly from the library. Check tabs: Acoustic, Fire, Depth/Headroom, Span, Budget. Each check returns meets / straddles / misses / not_assessed, with an explanation and the grade of its method. v0.1 checks compare data only (assembly ranges vs project targets): **no structural, fire or acoustic calculation**. Never show a green "OK" for an unvalidated method; show "Data check".
5. **Schedule & BOQ.** Element schedule with drawn sections of each assembly (SVG, to scale); quantities; BOQ lines in QS line-item style (CAHF method) with low–high cost, supplier, route, lead time, carbon and grade. Toggle any line between imported and regional route. Totals per m² and per unit, % validated, import share of cost. Exports: CSV, plus a printable evidence summary.
6. **Compare.** The same building with two system choices side by side (e.g. beam-and-block vs timber cassette floors): cost range, carbon, import share, programme notes, weakest readiness test.
7. **Library.** Browse materials, routes and assemblies with full datasheets and grades (the equivalent of the reference's Member Capacity page).
8. **Validation Log.** Entries, % validated, biggest unvalidated numbers.

Not in v0.1: structural analysis. Leave a `CheckAdapter` interface so validated calculators can be plugged in later, each declaring its own validation status.

## 5. Guardrails (put these in `.claude/rules/guardrails.md`)

- Persistent disclaimer: exploratory design and cost comparison only. It is not structural design, specification or construction documents, and projects need project-specific engineering and approval.
- No single-point numbers: ranges and grades everywhere. First-of-kind and repeat cost are labelled.
- Carbon is shown beside cost, never netted into it. Biogenic storage (later) is shown separately.
- No partner names on cost data. No supplier prices shown as real without the supplier's consent.
- Systems can be marked paused or stopped with their binding constraint, and stay visible.
- Never invent a supplier name, price, dimension or test result. Ask.

## 6. Stack

Challenge this if you have a better reason: Vite + React + TypeScript, static, hash routing; zod; react-three-fiber for 3D; SVG for the 2D plan and sections; plain CSS with design tokens from DESIGN.md; Vitest. Must work at 1366 px wide and be usable on a tablet.

---

## 7. Skills: set up once, then use them by phase

My Hermes skills live in `%LOCALAPPDATA%\hermes\skills`. Copy the ones below into this project's `.claude\skills\` so you load them natively, then confirm which ones you see.

```powershell
$src = "$env:LOCALAPPDATA\hermes\skills"
$dst = ".claude\skills"
New-Item -ItemType Directory -Force $dst | Out-Null
$skills = @(
  "software-development\plan", "software-development\spike",
  "software-development\test-driven-development", "software-development\dogfood",
  "software-development\requesting-code-review", "software-development\simplify-code",
  "software-development\systematic-debugging",
  "frontend-design", "creative\claude-design", "creative\design-md", "creative\popular-web-designs",
  "one-three-one-rule", "research\grounded-citations"
)
foreach ($s in $skills) { Copy-Item -Recurse -Force "$src\$s" "$dst\$(Split-Path $s -Leaf)" }
Get-ChildItem $dst
```

These skills were written for the Hermes agent. Map their tool names to yours: `terminal` → Bash; `write_file` / `read_file` / `search_files` → Write / Read / Grep / Glob; `browser_*` → your Chrome integration (this session runs with `--chrome`) or Playwright; `delegate_task` / subagents → your Agent tool; `skill_view(file_path=...)` → Read that file under `.claude/skills/`. Save plans to `docs/plans/` instead of `.hermes/plans/`.

| Phase | Skill(s) | How to use them here |
|---|---|---|
| 0. Plan | `plan` | Write the implementation plan to `docs/plans/`: bite-sized tasks, exact file paths, test commands. No code until I approve. |
| Any decision you need from me | `one-three-one-rule` | One problem sentence, options A/B/C, one recommendation. At most three decisions at a time. No walls of questions. |
| 1. Spikes (riskiest first) | `spike` | Before building: (S1) SVG plan editor drawing walls on a snapping grid; (S2) react-three-fiber massing generated from layout JSON; (S3) quantity takeoff from layout + assemblies → BOQ quantities for the mid-rise template. Give a verdict per spike, then delete or fold in. |
| 2. Visual identity | `frontend-design`, `claude-design`, `popular-web-designs`, `design-md` | Use frontend-design and claude-design for direction. It's a professional tool, dense but calm, for QS and engineers in East Africa, and it should not look templated. Use popular-web-designs only for vocabulary (e.g. `figma.md`, `linear.app.md` for tool-UI density), not to copy. Write the result as `DESIGN.md` with design-md and lint it for WCAG contrast. Show me two directions as static mock screens (System Design + BOQ) before building. |
| 3. Data + engine | `test-driven-development`, `grounded-citations` | Red-green-refactor for range maths, landed cost, BOQ totals, checks, % validated and schema validation. Every seeded `published_spec` value gets a source URL and access date (grounded-citations ledger). Anything not sourced stays `placeholder`. |
| 4. Screens | `frontend-design`, `dogfood` | Build in the order in section 9. After each screen, dogfood it in the browser and report issues by severity before moving on. |
| Before every commit | `requesting-code-review` | An independent reviewer subagent checks the diff. Don't review your own work. |
| End of each phase | `simplify-code` | Cleanup pass for reuse, quality, efficiency and altitude. |
| When something breaks | `systematic-debugging` | Find the root cause before fixing. |

## 8. How to work

- Keep `CLAUDE.md` short and specific: project purpose, commands, folder map, and a pointer to this brief. Put rules in `.claude/rules/` (`guardrails.md`, `data-rules.md`, `design.md`).
- Start in plan mode. Commit after each task (git repo).
- Use a fresh session per phase. If context passes about 70%, run `/compact` with a focus note.
- Think hardest ("ultrathink") on the data schema and the BOQ engine. Everything else hangs off them.
- Ask me rather than invent any supplier, price, dimension or claim.

## 9. Build order

Plan → spikes → visual identity (2 mock directions) → schema + engine + tests → Library → System Design + checks → Schedule & BOQ → Validation Log → Layout → Building Form 3D → Compare. Show me after each step.

## 10. Done when (v0.1)

- `npm run dev`, `npm test` and `npm run build` work. Tests cover range maths, landed cost, BOQ totals, checks, % validated and schema validation.
- From the mid-rise template I can swap the floor assembly and see the BOQ, cost per m², carbon and import share update. I can also flip a line between imported and regional route, log a validation and watch % validated rise.
- Adding a product, route, assembly or building type needs only a new JSON file (demonstrated with a test fixture).
- README explains how to edit data and log validations.
