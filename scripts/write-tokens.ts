import { readFileSync, writeFileSync } from 'node:fs';
import { TOKENS_CSS, buildTokensCss } from './design-tokens';

// `npm run tokens` writes src/styles/tokens.css from DESIGN.md; `--check` (used by build) only fails if it is out of date.
const css = buildTokensCss();
if (process.argv.includes('--check')) {
  if (readFileSync(TOKENS_CSS, 'utf8') !== css) {
    console.error('src/styles/tokens.css is out of date with DESIGN.md: run `npm run tokens`.');
    process.exit(1);
  }
  console.log('src/styles/tokens.css matches DESIGN.md');
} else {
  writeFileSync(TOKENS_CSS, css);
  console.log('Wrote src/styles/tokens.css from DESIGN.md');
}
