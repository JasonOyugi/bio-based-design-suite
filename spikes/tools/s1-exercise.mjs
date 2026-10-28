// Drives the S1 plan editor with real mouse, keyboard, wheel and touch input via CDP and reports observed results.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { open } from '../../scripts/cdp.mjs';

const OUT = process.argv[2];
const URL = 'http://localhost:5174/s1-plan-editor/';
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok, detail }); };

async function session(width, height, port, tag) {
  const b = await open(URL, { width, height, port, profile: join(OUT, `profile-${tag}`) });
  const { send, evaluate, sleep } = b;
  const w2c = async (x, y) => evaluate(`(() => { const m = document.querySelector('[data-testid=plan]').getScreenCTM();
    return [m.a*${x}+m.c*${y}+m.e, m.b*${x}+m.d*${y}+m.f]; })()`);
  const state = () => evaluate(`({ count: document.querySelector('[data-testid=count]').textContent,
    totals: [...document.querySelectorAll('[data-testid=totals] li')].map(l => l.textContent),
    walls: [...document.querySelectorAll('svg line[id]')].map(l => [+l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2')]),
    deleteEnabled: !document.querySelector('aside button').disabled,
    viewBox: document.querySelector('[data-testid=plan]').getAttribute('viewBox') })`);
  const mouseDrag = async (a, z, { escapeMidway = false } = {}) => {
    const [ax, ay] = await w2c(...a), [zx, zy] = await w2c(...z);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: ax, y: ay });
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: ax, y: ay, button: 'left', buttons: 1, clickCount: 1 });
    for (let i = 1; i <= 4; i++) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: ax + (zx - ax) * i / 4, y: ay + (zy - ay) * i / 4, button: 'left', buttons: 1 });
    if (escapeMidway) await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: zx, y: zy, button: 'left', buttons: 0, clickCount: 1 });
    await sleep(80);
  };
  const touchDrag = async (a, z) => {
    const [ax, ay] = await w2c(...a), [zx, zy] = await w2c(...z);
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ax, y: ay }] });
    for (let i = 1; i <= 4; i++) await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ax + (zx - ax) * i / 4, y: ay + (zy - ay) * i / 4 }] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(80);
  };
  const setType = (v) => evaluate(`(() => { const s = document.querySelector('select');
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(s, '${v}');
    s.dispatchEvent(new Event('change', { bubbles: true })); return s.value; })()`);
  const click = (label) => evaluate(`[...document.querySelectorAll('aside button')].find(b => b.textContent.startsWith('${label}')).click()`);
  const shot = async (name) => { const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, name), Buffer.from(data, 'base64')); };
  return { ...b, w2c, state, mouseDrag, touchDrag, setType, click, shot };
}

// ---- Desktop, 1366 × 768, mouse ----
const d = await session(1366, 768, 9223, 'desktop');
await d.mouseDrag([0.12, -0.15], [17.85, 0.2]);
let s = await d.state();
check('snap: off-grid drag lands on grid (0,0)→(18,0)', JSON.stringify(s.walls[0]) === '[0,0,18,0]', s.walls[0]);

await d.mouseDrag([18, 0], [18, 12]); // start exactly on the end of the previous wall
s = await d.state();
check('FINDING: starting a wall on an existing wall end selects that wall instead of drawing', s.walls.length === 1 && s.deleteEnabled, { walls: s.walls.length, selected: s.deleteEnabled });

await d.mouseDrag([18.25, -0.25], [18, 12]);
await d.mouseDrag([18.25, 12.25], [0, 12]);
await d.mouseDrag([-0.25, 12.25], [0, 0]);
await d.setType('internal_structural');
await d.mouseDrag([-0.25, 6], [18.3, 6.1]);
s = await d.state();
check('perimeter + spine by pressing just outside corners: 5 walls, 60 m external, 18 m structural',
  s.count === '5 walls' && s.totals.includes('external: 60.00 m') && s.totals.includes('internal_structural: 18.00 m'), s.totals);

await d.mouseDrag([9, 3], [9, 3]);
s = await d.state();
check('zero-length click is rejected', s.count === '5 walls', s.count);

await d.mouseDrag([-0.25, -0.25], [18, 0]);
s = await d.state();
check('duplicate wall is rejected', s.count === '5 walls', s.count);

await d.setType('partition');
await d.mouseDrag([4.2, 2.6], [7.4, 2.6]);
s = await d.state();
check('sub-grid snap: (4.2,2.6)→(7.4,2.6) becomes (4,2.5)→(7.5,2.5)', JSON.stringify(s.walls.at(-1)) === '[4,2.5,7.5,2.5]', s.walls.at(-1));

await d.mouseDrag([5.5, 2.5], [5.5, 2.5]);
s = await d.state();
check('click on a wall selects it', s.deleteEnabled, s.deleteEnabled);
await d.click('Delete selected');
s = await d.state();
check('Delete button removes it', s.count === '5 walls', s.count);

const before = (await d.state()).walls.length;
await d.mouseDrag([9, 9], [12, 9], { escapeMidway: true });
s = await d.state();
check('Escape mid-drag cancels the wall', s.walls.length === before, { before, after: s.walls.length });

const vb0 = s.viewBox;
const [cx, cy] = await d.w2c(9, 6);
await d.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: cx, y: cy, deltaX: 0, deltaY: -100 });
await d.sleep(100);
s = await d.state();
check('wheel zooms in around the pointer', +s.viewBox.split(' ')[2] < +vb0.split(' ')[2], { before: vb0, after: s.viewBox });
await d.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: cx, y: cy, deltaX: 0, deltaY: 100 });
await d.sleep(100);

await d.evaluate(`navigator.clipboard.writeText = async (t) => { window.__copied = t; }`);
await d.click('Copy layout JSON');
const copied = JSON.parse(await d.evaluate('window.__copied'));
check('export JSON round-trips (5 walls, grid, storeys)', copied.walls.length === 5 && copied.storeys === 6 && copied.gridXM.length === 6,
  copied.walls.map((w) => `${w.type} ${w.x1},${w.y1}→${w.x2},${w.y2}`));
writeFileSync(join(OUT, 's1-exported-layout.json'), JSON.stringify(copied, null, 2));
await d.shot('s1-desktop-1366.png');

const perf = (label) => d.evaluate(`(async () => {
  const svg = document.querySelector('[data-testid=plan]'); const r = svg.getBoundingClientRect(); const t = [];
  for (let i = 0; i < 60; i++) {
    const t0 = performance.now();
    svg.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 50 + i * 5, clientY: r.top + 100, bubbles: true, pointerId: 1, pointerType: 'mouse' }));
    await new Promise((res) => setTimeout(res, 0)); svg.getBoundingClientRect();
    t.push(performance.now() - t0);
  }
  t.sort((a, b) => a - b);
  return { label: '${label}', medianMs: +t[30].toFixed(2), p95Ms: +t[57].toFixed(2), maxMs: +t[59].toFixed(2) };
})()`);
const base = await perf('5 walls');
await d.click('Stress: 300 walls');
await d.sleep(200);
s = await d.state();
const stress = await perf('300 walls');
check('300 walls: pointer move + re-render under 16 ms (p95)', s.count === '300 walls' && stress.p95Ms < 16, { base, stress });
await d.close();

// ---- Tablet, 820 × 1180, touch ----
const t = await session(820, 1180, 9224, 'tablet');
await t.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await t.touchDrag([-0.25, -0.25], [18, 0]);
await t.touchDrag([12, 3], [12, 3]); // a tap somewhere else
await t.touchDrag([9.1, 9.1], [15, 9]);
s = await t.state();
check('touch: draws walls; a later drag starts at its own touch point, not the previous tap',
  s.walls.length === 2 && JSON.stringify(s.walls[1]) === '[9,9,15,9]', s.walls);
await t.touchDrag([12, 9], [12, 9]);
s = await t.state();
check('touch: tap on a wall selects it', s.deleteEnabled, s.deleteEnabled);
const [bx, by] = await t.evaluate(`(() => { const r = [...document.querySelectorAll('aside button')][0].getBoundingClientRect(); return [r.x + r.width/2, r.y + r.height/2]; })()`);
await t.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bx, y: by }] });
await t.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await t.sleep(100);
s = await t.state();
check('touch: Delete button removes the selected wall', s.walls.length === 1, s.count);
const btn = await t.evaluate(`(() => { const r = document.querySelector('aside button').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })()`);
check('FINDING: touch target size of buttons (design rule: ≥ 40 px)', btn[1] >= 40, { widthHeightPx: btn });
const layoutFits = await t.evaluate(`(() => { const r = document.querySelector('[data-testid=plan]').getBoundingClientRect(); return { svgWidthPx: Math.round(r.width) }; })()`);
check('tablet: plan keeps a usable width beside the 260 px side panel', layoutFits.svgWidthPx >= 500, layoutFits);
await t.shot('s1-tablet-820.png');
await t.close();

console.log(JSON.stringify(results, null, 1));
