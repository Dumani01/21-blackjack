import Button from '../ui/Button';

export default function ControlPanel({
  canHit,
  canStand,
  onHit,
  onStand,
  onRestart,
  onSummary,
  finished,
}) {
  return (
    <section className="panel controls-panel">
      <p className="eyebrow">Controles</p>
      <div className="controls-grid">
        <Button onClick={onHit} disabled={!canHit}>
          Pedir carta
        </Button>
        <Button variant="secondary" onClick={onStand} disabled={!canStand}>
          Plantarse
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Nueva ronda
        </Button>
        <Button variant="ghost" onClick={onSummary} disabled={!finished}>
          Ver resumen
        </Button>
      </div>
    </section>
  );
}
