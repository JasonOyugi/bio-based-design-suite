import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export type DataFile = { path: string; json: unknown };

export function readDataFiles(root: string): DataFile[] {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => {
      const full = join(e.parentPath, e.name);
      const path = relative(root, full).split(sep).join('/');
      try {
        return { path, json: JSON.parse(readFileSync(full, 'utf8')) as unknown };
      } catch (err) {
        throw new Error(`${path}: invalid JSON (${(err as Error).message})`);
      }
    })
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)); // code-point order, locale-independent
}
