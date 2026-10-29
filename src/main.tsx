import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Self-hosted fonts (DESIGN.md typography), so the static app needs no font CDN.
import '@fontsource/barlow-semi-condensed/400.css';
import '@fontsource/barlow-semi-condensed/400-italic.css';
import '@fontsource/barlow-semi-condensed/500.css';
import '@fontsource/barlow-semi-condensed/600.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/spline-sans-mono/400.css';
import '@fontsource/spline-sans-mono/400-italic.css';
import '@fontsource/spline-sans-mono/500.css';
import '@fontsource/spline-sans-mono/500-italic.css';
import './styles/base.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
