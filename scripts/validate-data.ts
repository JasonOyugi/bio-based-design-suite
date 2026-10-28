import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readDataFiles } from './data-files';

const root = fileURLToPath(new URL('../data/', import.meta.url));
if (!existsSync(root)) {
  console.log('No /data folder: nothing to validate.');
} else {
  const files = readDataFiles(root);
  console.log(`Parsed ${files.length} data file(s). Schema validation arrives in Phase 3.`);
}
