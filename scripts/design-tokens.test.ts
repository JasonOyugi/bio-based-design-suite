import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TOKENS_CSS, buildTokensCss, readDesignTokens, tokensToCss } from './design-tokens';

const md = (front: string) => `---\n${front}\n---\n\n## Overview\n`;

describe('readDesignTokens', () => {
  it('reads the YAML front matter', () => {
    const t = readDesignTokens(md('name: X\ncolors:\n  primary: "#17222a"'));
    expect(t.colors).toEqual({ primary: '#17222a' });
  });

  it('fails without front matter', () => {
    expect(() => readDesignTokens('## Overview\n')).toThrow(/front matter/);
  });

  it('resolves token references and names a broken one', () => {
    const t = readDesignTokens(md('colors:\n  ink: "#111111"\n  text: "{colors.ink}"'));
    expect(t.colors.text).toBe('#111111');
    expect(() => readDesignTokens(md('colors:\n  text: "{colors.missing}"'))).toThrow(/colors\.missing/);
  });

  it('needs units on colours, spacing and radii', () => {
    expect(() => readDesignTokens(md(['spacing:', '  touch: 40'].join(String.fromCharCode(10))))).toThrow(/spacing\.touch/);
  });

  it('resolves references inside typography properties', () => {
    const t = readDesignTokens(md('typography:\n  body:\n    fontSize: 15px\n  note:\n    fontSize: "{typography.body.fontSize}"'));
    expect(t.typography.note).toEqual({ fontSize: '15px' });
  });

  it('names a reference cycle', () => {
    expect(() => readDesignTokens(md('colors:\n  a: "{colors.b}"\n  b: "{colors.a}"'))).toThrow(/cycle/);
  });

  it('rejects an unquoted hex, which YAML reads as a comment', () => {
    expect(() => readDesignTokens(md('colors:\n  a: #fff'))).toThrow(/colors\.a/);
  });

  it('accepts a byte-order mark and rejects empty front matter', () => {
    expect(readDesignTokens(String.fromCharCode(0xfeff) + md('colors:\n  a: "#ffffff"')).colors.a).toBe('#ffffff');
    expect(() => readDesignTokens('---\n\n---\n')).toThrow(/front matter/);
  });
});

describe('tokensToCss', () => {
  const css = tokensToCss(readDesignTokens(md([
    'colors:\n  primary: "#17222a"\n  rule-faint: "#dbe2e1"',
    'spacing:\n  sm: 8px',
    'rounded:\n  none: 0px',
    'typography:',
    '  body:\n    fontFamily: Barlow Semi Condensed\n    fontSize: 15px\n    fontWeight: 400\n    lineHeight: 1.35',
    '  figure:\n    fontFamily: Spline Sans Mono\n    fontSize: 15px\n    letterSpacing: "-0.01em"\n    fontFeature: "\\"tnum\\" 1"',
  ].join('\n'))));

  it('emits colours, spacing and radii as custom properties on :root', () => {
    expect(css).toMatch(/^:root \{/m);
    expect(css).toContain('--color-primary: #17222a;');
    expect(css).toContain('--color-rule-faint: #dbe2e1;');
    expect(css).toContain('--space-sm: 8px;');
    expect(css).toContain('--radius-none: 0px;');
  });

  it('emits each typography property with a fallback font stack', () => {
    expect(css).toContain('--type-body-family: "Barlow Semi Condensed", "Arial Narrow", system-ui, sans-serif;');
    expect(css).toContain('--type-body-size: 15px;');
    expect(css).toContain('--type-body-weight: 400;');
    expect(css).toContain('--type-body-line: 1.35;');
    expect(css).toContain('--type-figure-family: "Spline Sans Mono", ui-monospace, "Cascadia Mono", Consolas, monospace;');
    expect(css).toContain('--type-figure-tracking: -0.01em;');
    expect(css).toContain('--type-figure-feature: "tnum" 1;');
  });
});

describe('src/styles/tokens.css', () => {
  it('is up to date with DESIGN.md (run `npm run tokens`)', () => {
    expect(readFileSync(TOKENS_CSS, 'utf8')).toBe(buildTokensCss());
  });
});
