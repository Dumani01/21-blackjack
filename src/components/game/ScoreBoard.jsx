export default function ScoreBoard({ playerName, roundStatus, roundCount, saveState }) {
  return (
    <section className="panel scoreboard-panel">
      <div>
        <p className="eyebrow">Jugador</p>
        <h3>{playerName || 'Invitado'}</h3>
      </div>

      <div>
        <p className="eyebrow">Estado</p>
        <h3>{roundStatus}</h3>
      </div>

      <div>
        <p className="eyebrow">Partidas locales</p>
        <h3>{roundCount}</h3>
      </div>

      <div>
        <p className="eyebrow">Sincronización</p>
        <h3>{saveState}</h3>
      </div>
    </section>
  );
}
