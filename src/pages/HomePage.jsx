import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useGame } from '../context/GameContext';

export default function HomePage() {
  const { playerName, setPlayerName } = useGame();
  const [name, setName] = useState(playerName);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Ingresa tu nombre para comenzar la partida.');
      inputRef.current?.focus();
      return;
    }

    setError('');
    setPlayerName(name);
    navigate('/play');
  };

  return (
    <section className="hero-grid">
      <article className="panel hero-panel">
        <p className="eyebrow">Bienvenido</p>
        <h2>Juega 21 con un mazo inspirado en arte japonés oriental.</h2>
        <p>
          Sakura 21 es un blackjack visualmente elegante: pide cartas, plántate en el momento justo,
          vence al dealer y guarda tus mejores resultados en el leaderboard.
        </p>

        <ul className="feature-list">
          <li>Juego completo de inicio a fin.</li>
          <li>Cartas temáticas orientales con diseño único por palo.</li>
          <li>Tabla de puntajes persistida con JSON Server.</li>
          <li>Integración preparada con webhook de n8n.</li>
        </ul>
      </article>

      <article className="panel form-panel">
        <p className="eyebrow">Nueva partida</p>
        <h3>Ingresa tu nombre</h3>

        <form onSubmit={handleSubmit} className="stack-lg">
          <label className="field-group">
            <span>Jugador</span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Bernny"
              maxLength={24}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <Button type="submit">Entrar al juego</Button>
        </form>
      </article>
    </section>
  );
}
