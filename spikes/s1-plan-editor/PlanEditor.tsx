// Throwaway: hard-coded grid, no styling system.
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { positions, snap, type Pt } from './snap';
import { addWall, totals, type Wall, type WallType } from './walls';

const GRID = { x: positions([3, 3, 3, 3, 3, 3]), y: positions([3, 3, 3, 3]) };
const W = GRID.x.at(-1)!, H = GRID.y.at(-1)!, PAD = 2;

// Memoised so cursor moves don't re-render every wall (300 walls: p95 33 ms → see README).
const WallLines = memo(function WallLines({ walls, selected, onSelect }: { walls: Wall[]; selected: string | null; onSelect: (id: string) => void }) {
  return walls.map((w) => (
    <line key={w.id} id={w.id} x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} strokeLinecap="square"
      stroke={w.id === selected ? '#c33' : '#222'} strokeWidth={w.type === 'partition' ? 0.1 : 0.2}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(w.id); }} />
  ));
});

export function PlanEditor() {
  const svg = useRef<SVGSVGElement>(null);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [start, setStart] = useState<Pt | null>(null);
  const [cursor, setCursor] = useState<Pt | null>(null);
  const [type, setType] = useState<WallType>('external');
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState({ x: -PAD, y: -PAD, w: W + 2 * PAD, h: H + 2 * PAD });

  const toWorld = (e: { clientX: number; clientY: number }): Pt => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.current!.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStart(null);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        setWalls((ws) => ws.filter((w) => w.id !== selected));
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const onWheel = (e: React.WheelEvent) => {
    const p = toWorld(e), k = e.deltaY > 0 ? 1.1 : 1 / 1.1;
    setView((v) => ({ x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k, w: v.w * k, h: v.h * k }));
  };

  const onSelect = useCallback((id: string) => setSelected(id), []);
  const t = totals(walls);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', height: '100vh' }}>
      <svg ref={svg} data-testid="plan" viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} style={{ touchAction: 'none', background: '#fafafa' }}
        onWheel={onWheel}
        onPointerDown={(e) => { // wall lines stop propagation
          e.currentTarget.setPointerCapture(e.pointerId);
          const p = snap(toWorld(e), GRID);
          setSelected(null); setStart(p); setCursor(p); // touch has no hover, so seed the cursor here
        }}
        onPointerMove={(e) => setCursor(snap(toWorld(e), GRID))}
        onPointerUp={(e) => {
          // End point comes from this event, not from `cursor` state, which can lag the last pointermove.
          const end = snap(toWorld(e), GRID);
          if (start) setWalls((ws) => addWall(ws, { id: crypto.randomUUID(), x1: start.x, y1: start.y, x2: end.x, y2: end.y, type }));
          setStart(null); setCursor(end);
        }}>
        {GRID.x.map((x) => <line key={`gx${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#ccc" strokeWidth={0.03} />)}
        {GRID.y.map((y) => <line key={`gy${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#ccc" strokeWidth={0.03} />)}
        <WallLines walls={walls} selected={selected} onSelect={onSelect} />
        {/* Feedback layers ignore the pointer, or they sit under the mouse and swallow clicks on walls. */}
        {start && cursor && <line pointerEvents="none" x1={start.x} y1={start.y} x2={cursor.x} y2={cursor.y} stroke="#36c" strokeWidth={0.15} strokeDasharray="0.3 0.2" />}
        {cursor && <circle pointerEvents="none" cx={cursor.x} cy={cursor.y} r={0.15} fill="#36c" />}
      </svg>
      <aside style={{ padding: 12, fontFamily: 'system-ui', fontSize: 14 }}>
        <label>Wall type <select value={type} onChange={(e) => setType(e.target.value as WallType)}>
          {['external', 'party', 'internal_structural', 'partition'].map((o) => <option key={o}>{o}</option>)}
        </select></label>
        <p data-testid="count">{t.count} walls</p>
        <button disabled={!selected} onClick={() => { setWalls((ws) => ws.filter((w) => w.id !== selected)); setSelected(null); }}>Delete selected</button>
        <ul data-testid="totals">{Object.entries(t.lengthByType).map(([k, v]) => <li key={k}>{k}: {v!.toFixed(2)} m</li>)}</ul>
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify({ gridXM: [3, 3, 3, 3, 3, 3], gridYM: [3, 3, 3, 3], storeys: 6, storeyHeightM: 3, walls }, null, 2))}>Copy layout JSON</button>
        <button onClick={() => setWalls(Array.from({ length: 300 }, (_, i) => ({ id: `s${i}`, x1: (i % 36) * 0.5, y1: Math.floor(i / 36) * 1.5, x2: (i % 36) * 0.5 + 0.5, y2: Math.floor(i / 36) * 1.5, type: 'partition' as const })))}>Stress: 300 walls</button>
      </aside>
    </div>
  );
}
