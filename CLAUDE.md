# Bio-based Design Suite (working title)

Browser-based design workspace for bio-based vs conventional building decisions in East Africa: pick a building type, lay it out, choose a construction system per element, see data checks, get a schedule and BOQ with ranged, graded, landed cost. Owner: Jason Oyugi, Bio-Based Construction programme, Gatsby Africa.

- **Source of truth:** [docs/brief.md](docs/brief.md). It wins over [docs/plan.md](docs/plan.md) (background only).
- **Current plan:** the latest file in [docs/plans/](docs/plans/).
- **Rules:** [.claude/rules/guardrails.md](.claude/rules/guardrails.md), [data-rules.md](.claude/rules/data-rules.md), [design.md](.claude/rules/design.md). Read them before touching data, the engine or UI.

## Commands

Available once the Phase 0 scaffold lands:

- `npm run dev` – Vite dev server
- `npm test` – Vitest, single run
- `npm run build` – validate `/data`, typecheck, production build
- `npm run validate:data` – zod-validate every JSON file under `/data`
- `npm run tokens` – regenerate `src/styles/tokens.css` from `DESIGN.md` (`build` fails if it is out of date)
- `npm run spike` – throwaway spike sandbox (`spikes/`), not part of the app

## Folder map

- `docs/` brief, background plan, `plans/` implementation plans
- `data/` JSON data layers (sources, suppliers, products, routes, fx, assemblies, building-types, validations). Adding a file needs no code change.
- `src/domain/` pure TypeScript: schemas, range maths, landed cost, takeoff, BOQ, checks, % validated
- `src/data/` loading and cross-referencing `/data`
- `src/features/` one folder per screen; `src/ui/` shared components; `src/styles/` tokens from `DESIGN.md`
- `scripts/` build-time tools (data validation)
- `spikes/` throwaway experiments with a verdict in each README
- `.claude/skills/` Hermes skills copied for this project

## Working agreements

- No app code without an approved plan. Commit after each task; push at the end of each approved phase (exception: Phase 3 runs straight into the Phase 4 floors slice; see the v0.1 plan header). The GitHub repo is private: never make it public.
- Before every commit an independent reviewer subagent checks the diff (`requesting-code-review`). End of phase: `simplify-code`. When something breaks: `systematic-debugging`.
- Decisions go to Jason in 1-3-1 format, at most three at a time. Ask rather than invent any supplier, price, dimension or claim; the only exception is the labelled dummy data Jason asked for (`.claude/rules/data-rules.md`).
- Fresh session per phase; `/compact` with a focus note past ~70% context.
- Hermes skill mapping: `terminal` → Bash/PowerShell; `write_file`/`read_file`/`search_files` → Write/Read/Grep/Glob; `browser_*` → Chrome integration or Playwright; `delegate_task` → Agent; `skill_view` → Read under `.claude/skills/`; plans go in `docs/plans/`, not `.hermes/plans/`.
