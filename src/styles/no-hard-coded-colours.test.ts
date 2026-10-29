import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// design.md rule: colours come from tokens.css (generated from DESIGN.md), never hard-coded in styles or components.
const src = fileURLToPath(new URL('..', import.meta.url));
const NAMED = '(?:white|black|gr[ae]y|red|green|blue)(?![\\w-])';
// Hex, colour functions, and named colours in value or attribute position (fill="white", color: red, 1px solid black).
const COLOUR = new RegExp(`#[0-9a-f]{3,8}\\b|\\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\\(|[:="']\\s*${NAMED}|\\bsolid\\s+${NAMED}`, 'gi');
const colours = (text: string) => text.match(COLOUR) ?? [];

describe('colours', () => {
  it('are recognised in values and attributes, not in property names', () => {
    expect(colours('.x { white-space: nowrap; }')).toEqual([]);
    expect(colours('<rect fill="white" />')).toHaveLength(1);
    expect(colours('a { color: red; border: 1px solid black; background: #fbfcfc; }')).toHaveLength(3);
    expect(colours('b { color: color-mix(in srgb, var(--color-primary), transparent); }')).toHaveLength(1);
  });

  it('appear only in src/styles/tokens.css', () => {
    const offenders = readdirSync(src, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile() && /\.(css|tsx?|svg|html)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) && e.name !== 'tokens.css')
      .flatMap((e) => {
        const path = join(e.parentPath, e.name);
        return colours(readFileSync(path, 'utf8')).map((m) => `${relative(src, path)}: ${m}`);
      });
    expect(offenders).toEqual([]);
  });
});
