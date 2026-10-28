// Throwaway. Spike-only probes (window.__fps, __scene, __renderer) let the headless exercise read results.
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import layout from '../shared/sample-layout.json';
import { wallToBox, type Seg } from './geometry';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const probe = window as unknown as Record<string, unknown>;

function FpsProbe() {
  const n = useRef(0), t0 = useRef(performance.now());
  useFrame(() => {
    n.current++;
    const dt = performance.now() - t0.current;
    if (dt >= 1000) { probe.__fps = Math.round((n.current * 1000) / dt); n.current = 0; t0.current = performance.now(); }
  });
  return null;
}

function Walls({ walls, storeys, h, clip }: { walls: Seg[]; storeys: number; h: number; clip: THREE.Plane[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = walls.length * storeys;
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    let i = 0;
    for (let s = 0; s < storeys; s++) for (const w of walls) {
      const b = wallToBox(w, s, h, 0.2);
      m.compose(new THREE.Vector3(...b.position), q.setFromEuler(e.set(0, b.rotationY, 0)), new THREE.Vector3(...b.scale));
      ref.current!.setMatrixAt(i++, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [walls, storeys, h]);
  return (
    <instancedMesh key={count} ref={ref} name="walls" args={[undefined, undefined, count]}>
      <boxGeometry /><meshStandardMaterial color="#b9a58a" clippingPlanes={clip} />
    </instancedMesh>
  );
}

export function Massing() {
  const [show, setShow] = useState({ walls: true, floors: true, structure: true });
  const [stress, setStress] = useState(false);
  const [cut, setCut] = useState<number | null>(null);
  const lx = sum(layout.gridXM), ly = sum(layout.gridYM);
  const storeys = stress ? 8 : layout.storeys, h = layout.storeyHeightM;
  const walls: Seg[] = useMemo(() => stress
    ? Array.from({ length: 300 }, (_, i) => ({ x1: (i % 36) * 0.5, y1: Math.floor(i / 36) * 1.5, x2: (i % 36) * 0.5 + 0.5, y2: Math.floor(i / 36) * 1.5 }))
    : layout.walls, [stress]);
  const clip = useMemo(() => (cut === null ? [] : [new THREE.Plane(new THREE.Vector3(-1, 0, 0), cut)]), [cut]);
  const cols = useMemo(() => {
    let x = 0; const xs = [0, ...layout.gridXM.map((s) => (x += s))];
    let y = 0; const ys = [0, ...layout.gridYM.map((s) => (y += s))];
    return xs.flatMap((cx) => ys.map((cz) => [cx, cz] as const));
  }, []);

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <div style={{ padding: 8, fontFamily: 'system-ui' }}>
        {(['walls', 'floors', 'structure'] as const).map((k) => (
          <label key={k}><input type="checkbox" name={k} checked={show[k]} onChange={() => setShow((s) => ({ ...s, [k]: !s[k] }))} />{k} </label>
        ))}
        <label><input type="checkbox" name="stress" checked={stress} onChange={() => setStress((s) => !s)} />stress 8×300 </label>
        <label>section x <input type="range" name="cut" min={0} max={lx} step={0.5} value={cut ?? lx} onChange={(e) => setCut(+e.target.value >= lx ? null : +e.target.value)} /></label>
      </div>
      <Canvas camera={{ position: [lx * 1.6, storeys * h * 1.2, ly * 2.2], fov: 40 }}
        onCreated={({ gl, scene, camera }) => {
          gl.localClippingEnabled = true;
          probe.__scene = scene;
          probe.__camera = camera;
          const ctx = gl.getContext(), dbg = ctx.getExtension('WEBGL_debug_renderer_info');
          probe.__renderer = dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unknown';
        }}>
        <ambientLight intensity={0.6} /><directionalLight position={[20, 40, 10]} intensity={1.2} />
        {show.walls && <Walls walls={walls} storeys={storeys} h={h} clip={clip} />}
        {show.floors && Array.from({ length: storeys + 1 }, (_, s) => (
          <mesh key={s} name={s === storeys ? 'roof' : 'slab'} position={[lx / 2, s * h, ly / 2]}>
            <boxGeometry args={[lx, 0.25, ly]} /><meshStandardMaterial color="#d8d2c8" clippingPlanes={clip} />
          </mesh>
        ))}
        {show.structure && cols.map(([cx, cz]) => (
          <mesh key={`${cx},${cz}`} name="column" position={[cx, (storeys * h) / 2, cz]}>
            <boxGeometry args={[0.3, storeys * h, 0.3]} /><meshStandardMaterial color="#6b5a45" clippingPlanes={clip} />
          </mesh>
        ))}
        <OrbitControls target={[lx / 2, (storeys * h) / 3, ly / 2]} />
        <Stats />
        <FpsProbe />
      </Canvas>
    </div>
  );
}
