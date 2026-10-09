export default function CardFace({ card, hidden = false }) {
  if (hidden) {
    return (
      <article className="game-card game-card--hidden" aria-label="Carta oculta">
        <div className="card-back-center">和</div>
      </article>
    );
  }

  return (
    <article
      className={`game-card game-card--${card.suit}`}
      style={{ '--card-accent': card.accent }}
      aria-label={`${card.title} de ${card.suitLabel}`}
    >
      <div className="card-corner top">
        <strong>{card.rank}</strong>
        <span>{card.suitSymbol}</span>
      </div>
      <div className="card-art">
        <div className="sun-mark" />
        <div className="suit-center">{card.suitSymbol}</div>
        <p>{card.suitLabel}</p>
      </div>
      <div className="card-corner bottom">
        <strong>{card.rank}</strong>
        <span>{card.suitSymbol}</span>
      </div>
    </article>
  );
}
