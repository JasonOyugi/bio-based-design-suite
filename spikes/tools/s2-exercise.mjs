// Drives the S2 massing page in headless Chrome via CDP and reports observed results. Usage: node s2-exercise.mjs <out-dir>
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { open } from './cdp.mjs';

const OUT = process.argv[2];
const URL = 'http://localhost:5174/s2-massing/';
const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });

const counts = `(() => { const c = { wallMeshes: 0, wallInstances: 0, slab: 0, roof: 0, column: 0, clipped: 0, meshes: 0 };
  window.__scene.traverse((o) => { if (!o.isMesh) return; c.meshes++;
    if (o.name === 'walls') { c.wallMeshes++; c.wallInstances = o.count; } else if (o.name in c) c[o.name]++;
    if (o.material && o.material.clippingPlanes && o.material.clippingPlanes.length) c.clipped++; });
  return c; })()`;
const toggle = (name) => `document.querySelector('input[name=${name}]').click()`;
const setCut = (v) => `(() => { const el = document.querySelector('input[name=cut]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '${v}');
  el.dispatchEvent(new Event('input', { bubbles: true })); return el.value; })()`;

async function run(width, height, port, tag) {
  const b = await open(URL, { width, height, port, profile: join(OUT, `profile-s2-${tag}`) });
  for (let i = 0; i < 40 && !(await b.evaluate('!!window.__scene && !!window.__fps')); i++) await b.sleep(250);
  const shot = async (name) => { const { data } = await b.send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, name), Buffer.from(data, 'base64')); };
  return { ...b, shot };
}

const d = await run(1366, 768, 9225, 'desktop');
const renderer = await d.evaluate('window.__renderer');
let c = await d.evaluate(counts);
check('renders S1 layout JSON directly: 5 walls × 6 storeys = 30 instances, 6 slabs + roof, 35 columns',
  c.wallInstances === 30 && c.slab === 6 && c.roof === 1 && c.column === 35, c);
await d.shot('s2-desktop.png');

await d.evaluate(toggle('walls')); await d.sleep(300);
const noWalls = await d.evaluate(counts);
await d.evaluate(toggle('walls')); await d.evaluate(toggle('floors')); await d.sleep(300);
const noFloors = await d.evaluate(counts);
await d.evaluate(toggle('floors')); await d.evaluate(toggle('structure')); await d.sleep(300);
const noStructure = await d.evaluate(counts);
await d.evaluate(toggle('structure')); await d.sleep(300);
check('toggles hide walls / floors / structure independently',
  noWalls.wallMeshes === 0 && noFloors.slab === 0 && noFloors.roof === 0 && noStructure.column === 0,
  { noWalls: noWalls.wallMeshes, noFloors: noFloors.slab + noFloors.roof, noStructure: noStructure.column });

await d.evaluate(setCut(9)); await d.sleep(500);
c = await d.evaluate(counts);
check('section cut at x = 9 m applies a clipping plane to every mesh', c.clipped === c.meshes && c.meshes > 0, { clipped: c.clipped, meshes: c.meshes });
await d.shot('s2-section.png');
await d.evaluate(setCut(18)); await d.sleep(300);

await d.sleep(2500);
const fpsNormal = await d.evaluate('window.__fps');
await d.evaluate(toggle('stress')); await d.sleep(3500);
c = await d.evaluate(counts);
const fpsStress = await d.evaluate('window.__fps');
check('stress 8 storeys × 300 walls = 2400 instances at ≥ 50 fps', c.wallInstances === 2400 && fpsStress >= 50,
  { instances: c.wallInstances, fpsNormal, fpsStress, renderer });
await d.shot('s2-stress.png');
await d.close();

const t = await run(820, 1180, 9226, 'tablet');
await t.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const cam0 = await t.evaluate('window.__camera.position.toArray()');
const [x0, y0] = [410, 700];
await t.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
for (let i = 1; i <= 10; i++) { await t.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + i * 20, y: y0 }] }); await t.sleep(30); }
await t.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await t.sleep(500);
const cam1 = await t.evaluate('window.__camera.position.toArray()');
const moved = Math.hypot(...cam1.map((v, i) => v - cam0[i]));
check('tablet: one-finger drag orbits the camera', moved > 1, { cam0: cam0.map((v) => +v.toFixed(2)), cam1: cam1.map((v) => +v.toFixed(2)), movedM: +moved.toFixed(2) });
await t.shot('s2-tablet.png');
await t.close();

console.log(JSON.stringify(results));
