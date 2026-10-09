import { Link, useParams } from 'react-router-dom';
import CardFace from '../components/game/CardFace';
import { useGame } from '../context/GameContext';

export default function RoundSummaryPage() {
  const { id } = useParams();
  const { getRoundById } = useGame();
  const round = getRoundById(id);

  if (!round) {
    return (
      <section className="panel">
        <p className="eyebrow">Resumen</p>
        <h2>La ronda no existe en el historial local.</h2>
        <p>Juega una partida primero o vuelve al inicio.</p>
        <Link className="text-link" to="/play">
          Volver al juego
        </Link>
      </section>
    );
  }

  return (
    <div className="stack-lg">
      <section className="panel summary-panel">
        <p className="eyebrow">Ruta dinámica</p>
        <h2>Resumen de la ronda {round.id}</h2>
        <div className="summary-stats">
          <div>
            <span>Jugador</span>
            <strong>{round.playerName}</strong>
          </div>
          <div>
            <span>Resultado</span>
            <strong>{round.outcome}</strong>
          </div>
          <div>
            <span>Score</span>
            <strong>{round.score}</strong>
          </div>
          <div>
            <span>Fecha</span>
            <strong>{new Date(round.createdAt).toLocaleString('es-CR')}</strong>
          </div>
        </div>
      </section>

      <div className="play-grid">
        <section className="panel">
          <p className="eyebrow">Mano del jugador</p>
          <h3>Total: {round.playerTotal}</h3>
          <div className="card-row">
            {round.playerHand.map((card, index) => (
              <CardFace key={`${card.id}-${index}`} card={card} />
            ))}
          </div>
        </section>

        <section className="panel">
          <p className="eyebrow">Mano del dealer</p>
          <h3>Total: {round.dealerTotal}</h3>
          <div className="card-row">
            {round.dealerHand.map((card, index) => (
              <CardFace key={`${card.id}-${index}`} card={card} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
