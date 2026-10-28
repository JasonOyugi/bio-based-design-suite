# Spikes (Phase 1, throwaway)

Code here is disposable. It is never imported by `src/` and sits outside the app typecheck. Anything worth keeping is rewritten test-first when it's folded into the app.

Run the pages with `npm run spike`; S3 runs from the command line. Template geometry (18 × 12 m, 6 storeys, 3 m) is a placeholder.

| # | Spike | Validates (Given / When / Then) | Risk |
|---|---|---|---|
| 001 | S3 takeoff | Given the template and ten floor assemblies, when takeoff runs, then every layer yields a quantity range or a named gap, matching hand calcs | High |
| 002 | S1 plan editor | Given a 3 m grid, when walls are drawn by mouse or touch, then they snap, can be selected and deleted, totals update, JSON round-trips; 300 walls stay responsive | Medium |
| 003 | S2 massing | Given S1's layout JSON, when rendered with r3f, then storeys, walls, slabs and roof show with toggles and a section cut, ≥ 50 fps at 8 × 300 walls, 3D in its own lazy chunk | Medium-low |

## Verdicts

| # | Verdict | Summary |
|---|---|---|
| 001 | VALIDATED, with four schema changes | See [s3-takeoff/README.md](s3-takeoff/README.md) |
| 002 | VALIDATED (three bugs found and fixed) | See [s1-plan-editor/README.md](s1-plan-editor/README.md): needs Draw/Select tools, end point from the event, memoised walls |
| 003 | pending | |
