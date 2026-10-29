import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

type Typography = Partial<Record<'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing' | 'fontFeature', string | number>>;
export type DesignTokens = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  rounded: Record<string, string>;
  typography: Record<string, Typography>;
};

const REF = /^\{([\w.-]+)\}$/;

// Reads the YAML front matter of a DESIGN.md (google-labs-code/design.md spec) and resolves {group.token} references.
export function readDesignTokens(markdown: string): DesignTokens {
  const text = markdown.charCodeAt(0) === 0xfeff ? markdown.slice(1) : markdown; // drop a byte-order mark
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const raw = front ? (parse(front[1]!) as Record<string, unknown> | null) : null;
  if (!raw) throw new Error('DESIGN.md has no YAML front matter');
  const lookup = (path: string): unknown => path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], raw);
  const resolve = (value: unknown, path: string, seen: string[] = []): unknown => {
    const ref = typeof value === 'string' ? REF.exec(value) : null;
    if (!ref) {
      // An unquoted hex is a YAML comment, so the value arrives as null.
      if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`DESIGN.md: ${path} has no value (quote hex colours)`);
      return value;
    }
    if (seen.includes(ref[1]!)) throw new Error(`DESIGN.md: token reference cycle ${[...seen, ref[1]].join(' → ')}`);
    const target = lookup(ref[1]!);
    if (target === undefined) throw new Error(`DESIGN.md: broken token reference {${ref[1]}}`);
    return resolve(target, ref[1]!, [...seen, ref[1]!]);
  };
  const entries = (name: string) => Object.entries((raw[name] ?? {}) as Record<string, unknown>);
  const group = (name: string) => Object.fromEntries(entries(name).map(([k, v]) => [k, resolve(v, `${name}.${k}`)])) as Record<string, string>;
  const typography = Object.fromEntries(entries('typography').map(([name, style]) => [name,
    Object.fromEntries(Object.entries(style as Record<string, unknown>).map(([k, v]) => [k, resolve(v, `typography.${name}.${k}`)]))])) as Record<string, Typography>;
  return { colors: group('colors'), spacing: group('spacing'), rounded: group('rounded'), typography };
}

const fontStack = (family: string) =>
  /mono$/i.test(family) ? `"${family}", ui-monospace, "Cascadia Mono", Consolas, monospace` : `"${family}", "Arial Narrow", system-ui, sans-serif`;

const TYPE_PROPS: Array<[keyof Typography, string]> = [
  ['fontFamily', 'family'], ['fontSize', 'size'], ['fontWeight', 'weight'], ['lineHeight', 'line'], ['letterSpacing', 'tracking'], ['fontFeature', 'feature'],
];

export function tokensToCss(t: DesignTokens): string {
  const lines = [
    ...Object.entries(t.colors).map(([k, v]) => `--color-${k}: ${v};`),
    ...Object.entries(t.spacing).map(([k, v]) => `--space-${k}: ${v};`),
    ...Object.entries(t.rounded).map(([k, v]) => `--radius-${k}: ${v};`),
    ...Object.entries(t.typography).flatMap(([name, style]) =>
      TYPE_PROPS.filter(([prop]) => style[prop] !== undefined).map(([prop, suffix]) =>
        `--type-${name}-${suffix}: ${prop === 'fontFamily' ? fontStack(String(style[prop])) : style[prop]};`)),
  ];
  return `/* Generated from DESIGN.md by scripts/design-tokens.ts. Do not edit; run \`npm run tokens\`. */\n:root {\n${lines.map((l) => `  ${l}`).join('\n')}\n}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const at = (p: string) => fileURLToPath(new URL(p, import.meta.url));
  writeFileSync(at('../src/styles/tokens.css'), tokensToCss(readDesignTokens(readFileSync(at('../DESIGN.md'), 'utf8'))));
  console.log('Wrote src/styles/tokens.css from DESIGN.md');
}
