import { Disclaimer } from './ui/Disclaimer';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Bio-based Design Suite <small>(working title)</small></h1>
      </header>
      <main className="app-main" />
      <footer className="app-footer"><Disclaimer /></footer>
    </div>
  );
}
