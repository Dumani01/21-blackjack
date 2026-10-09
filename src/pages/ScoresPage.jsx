import { useCallback, useEffect, useState } from 'react';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { useGame } from '../context/GameContext';
import { fetchLeaderboard, getApiConfig } from '../services/api';

export default function ScoresPage() {
  const { completedRounds } = useGame();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { apiBaseUrl, webhookUrl } = getApiConfig();

  const loadScores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError(err.message || 'No fue posible cargar el leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return (
    <div className="stack-lg">
      <section className="panel info-banner">
        <p className="eyebrow">Integración de datos</p>
        <h2>Leaderboard + Webhook</h2>
        <p>GET desde: <strong>{apiBaseUrl}/leaderboard</strong></p>
        <p>POST al guardar la partida: <strong>{apiBaseUrl}/leaderboard</strong></p>
        <p>Webhook n8n: <strong>{webhookUrl || 'No configurado (modo opcional)'}</strong></p>
      </section>

      <section className="scores-grid">
        <article className="panel">
          <p className="eyebrow">Top 10</p>
          <h2>Leaderboard global</h2>
          {loading ? <LoadingState label="Cargando mejores partidas..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadScores} /> : null}
          {!loading && !error ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Resultado</th>
                    <th>Total</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.player}</td>
                      <td>{row.outcome}</td>
                      <td>{row.playerTotal}</td>
                      <td>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>

        <article className="panel">
          <p className="eyebrow">Historial local</p>
          <h2>Tus últimas rondas</h2>
          {completedRounds.length === 0 ? (
            <p className="muted">Aún no has jugado ninguna ronda en este navegador.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Resultado</th>
                    <th>Jugador</th>
                    <th>Total</th>
                    <th>Dealer</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRounds.map((round) => (
                    <tr key={round.id}>
                      <td>{new Date(round.createdAt).toLocaleString('es-CR')}</td>
                      <td>{round.outcome}</td>
                      <td>{round.playerName}</td>
                      <td>{round.playerTotal}</td>
                      <td>{round.dealerTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
