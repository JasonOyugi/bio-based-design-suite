# Bio-based Design Suite (working title)

A browser-based design workspace for comparing bio-based and conventional building systems in East Africa. It covers layout, a construction system per element, data checks, and a schedule and BOQ with ranged, graded, landed cost. It is built for developers, quantity surveyors, engineers and manufacturers. Owner: Bio-Based Construction programme, Gatsby Africa.

> **Exploratory design and cost comparison only.** Not structural design, specification or construction documents. Projects need project-specific engineering and approval.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 20.12 or later; developed on 24) |
| `npm run dev` | Start the dev server |
| `npm test` | Run the tests once |
| `npm run build` | Validate `/data`, typecheck, and build the static site into `dist/` |
| `npm run validate:data` | Check every JSON file under `/data` |

## Where things are

- [docs/brief.md](docs/brief.md): the product brief (source of truth)
- [docs/plans/](docs/plans/): implementation plans
- [data/](data/): the data layers (materials, routes, assemblies, building types, validations)

How to edit data and how to log validations will be documented here in Phase 3.
