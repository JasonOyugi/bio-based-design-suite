# Data layers

JSON files here are the app's data. Each folder is one collection: `sources/`, `suppliers/`, `products/`, `routes/`, `fx/`, `assemblies/{floors,walls,roofs,frames}/`, `building-types/` and `validations/`. A file holds one entity or an array of entities. Adding a file needs no code change. Every file is validated at build time (`npm run validate:data`). The rules are in `.claude/rules/data-rules.md` and the schema is in the current plan under `docs/plans/`.
