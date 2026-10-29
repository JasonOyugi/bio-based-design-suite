# Guardrails

These hold on every screen, export and data file. If a request conflicts with one, stop and ask Jason.

1. **Persistent disclaimer.** Every screen and every export carries: "Exploratory design and cost comparison only. Not structural design, specification or construction documents. Projects need project-specific engineering and approval."
2. **No single-point numbers.** Every evidence number is a range with a grade. First-of-kind and repeat cost are labelled; a mixed total says "mixed basis".
3. **Carbon beside cost, never netted into it.** Biogenic storage (later) is shown separately and never subtracted from anything.
4. **No partner names on cost data.** Cost lines, totals and exports show supplier aliases unless the supplier has consented to its name appearing with its prices. Validation Log entries keep who/organisation internally and hide them elsewhere unless `disclose` is true.
5. **No supplier prices shown as real without the supplier's consent.** v0.1 uses aliases for every supplier; a real name never sits beside a price that supplier didn't quote.
6. **Paused and stopped systems stay visible** with their status, date and binding constraint. Never hide a negative result.
7. **Never invent** a supplier name, price, dimension or test result **as if it were real**. Where Jason has asked for dummies (data-rules.md), they are graded `placeholder`, look different everywhere ("pencilled", PH) and carry `toConfirm`. Things that genuinely can't be priced stay unknown and are listed as gaps. Ask Jason.
8. **No green "OK" for an unvalidated method.** v0.1 checks compare data only and are labelled "Data check". No structural, fire or acoustic calculation.
9. **Placeholder watermark.** "PLACEHOLDER DATA – INTERNAL" shows until a project is at least 80% validated by cost.
10. **Our own product.** Follow the BASE CBFT Design Suite workflow, but never copy its branding, wording, visuals or code.
11. **Repo stays private.** Never change GitHub visibility or publish data elsewhere without Jason's say-so.
