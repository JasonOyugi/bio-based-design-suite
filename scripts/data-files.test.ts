import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readDataFiles } from './data-files';

const fixture = (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'bbds-data-'));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
};

describe('readDataFiles', () => {
  it('reads nested JSON files with forward-slash paths, sorted', () => {
    const root = fixture({ 'products/b.json': '{"id":"b"}', 'products/a.json': '{"id":"a"}', 'README.md': '# x' });
    expect(readDataFiles(root)).toEqual([
      { path: 'products/a.json', json: { id: 'a' } },
      { path: 'products/b.json', json: { id: 'b' } },
    ]);
  });

  it('names the file when JSON is invalid', () => {
    const root = fixture({ 'routes/bad.json': '{ nope' });
    expect(() => readDataFiles(root)).toThrow(/routes\/bad\.json: invalid JSON/);
  });
});
