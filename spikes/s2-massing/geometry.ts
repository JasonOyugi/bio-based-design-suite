export type Seg = { x1: number; y1: number; x2: number; y2: number };

/** Box transform for a unit cube: local +X runs along the wall. Three's +rotY turns +X toward −Z, hence the minus. */
export function wallToBox(w: Seg, storey: number, heightM: number, thicknessM: number) {
  const dx = w.x2 - w.x1, dz = w.y2 - w.y1;
  return {
    position: [(w.x1 + w.x2) / 2, storey * heightM + heightM / 2, (w.y1 + w.y2) / 2] as [number, number, number],
    rotationY: -Math.atan2(dz, dx),
    scale: [Math.hypot(dx, dz), heightM, thicknessM] as [number, number, number],
  };
}
