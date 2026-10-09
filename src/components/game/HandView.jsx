import CardFace from './CardFace';

export default function HandView({ title, cards, hideSecondCard = false, total, subtitle }) {
  return (
    <section className="panel hand-panel">
      <div className="hand-header">
        <div>
          <p className="eyebrow">Mano</p>
          <h2>{title}</h2>
        </div>
        <div className="hand-total">
          <span>Total</span>
          <strong>{total}</strong>
        </div>
      </div>

      {subtitle ? <p className="hand-subtitle">{subtitle}</p> : null}

      <div className="card-row">
        {cards.map((card, index) => (
          <CardFace key={`${card.id}-${index}`} card={card} hidden={hideSecondCard && index === 1} />
        ))}
      </div>
    </section>
  );
}
