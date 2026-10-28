import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Lazy-loaded to test that three/r3f land in their own chunk.
const Massing = lazy(() => import('./Massing').then((m) => ({ default: m.Massing })));

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<p style={{ fontFamily: 'system-ui', padding: 16 }}>Loading 3D…</p>}>
    <Massing />
  </Suspense>,
);
