export const DISCLAIMER =
  'Exploratory design and cost comparison only. Not structural design, specification or construction documents. ' +
  'Projects need project-specific engineering and approval.';

export function Disclaimer() {
  return <p role="note" className="disclaimer">{DISCLAIMER}</p>;
}
