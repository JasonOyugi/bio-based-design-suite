// Full-page screenshots of the Phase 2 design mocks in headless Chrome. Usage: node scripts/shoot-mocks.mjs [a|b] [system-design|boq]
// Reports console errors, fonts that failed to load, page overflow and tables that scroll inside their box, per page and width.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { open } from './cdp.mjs';

const MOCKS = fileURLToPath(new URL('../design/mocks/', import.meta.url));
const OUT = join(MOCKS, 'shots');
const WIDTHS = [1366, 1024, 768];
const pick = (arg, all) => {
  if (arg && !all.includes(arg)) throw new Error(`Expected one of ${all.join(', ')}; got "${arg}"`);
  return arg ? [arg] : all;
};
const dirs = pick(process.argv[2], ['a', 'b']);
const PAGES = pick(process.argv[3], ['system-design', 'boq']);
mkdirSync(OUT, { recursive: true });

const report = [];
for (const [i, width] of WIDTHS.entries()) {
  const first = pathToFileURL(join(MOCKS, dirs[0], `${PAGES[0]}.html`)).href;
  const b = await open(first, { width, height: 900, port: 9230 + i, profile: join(tmpdir(), `bbds-shoot-${width}`) });
  try {
    const errors = [];
    b.on((m) => {
      if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? 'exception');
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(m.params.entry.text);
    });
    await b.send('Log.enable');
    for (const dir of dirs) {
      for (const page of PAGES) {
        await b.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
        await b.send('Page.navigate', { url: pathToFileURL(join(MOCKS, dir, `${page}.html`)).href });
        errors.length = 0;
        await b.sleep(1200);
        const info = await b.evaluate(`document.fonts.ready.then(() => ({
          height: document.documentElement.scrollHeight,
          overflowX: document.documentElement.scrollWidth > innerWidth,
          clippedTables: [...document.querySelectorAll('.tbl-wrap')].filter((w) => w.scrollWidth > w.clientWidth + 1).length,
          fonts: [...document.fonts].map((f) => f.family.replace(/"/g, '') + ' ' + f.weight + ' ' + f.style + ': ' + f.status)
            .filter((f) => !f.endsWith('loaded')) }))`);
        await b.send('Emulation.setDeviceMetricsOverride', { width, height: info.height, deviceScaleFactor: 1, mobile: false });
        await b.sleep(300);
        const { data } = await b.send('Page.captureScreenshot', { format: 'png' });
        const file = `${dir}-${page}-${width}.png`;
        writeFileSync(join(OUT, file), Buffer.from(data, 'base64'));
        report.push({ file, height: info.height, overflowX: info.overflowX, clippedTables: info.clippedTables, fontProblems: info.fonts, errors: [...errors] });
      }
    }
  } finally {
    await b.close();
  }
}
console.log(JSON.stringify(report, null, 1));
