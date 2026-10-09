export default function ResultBanner({ title, message, error }) {
  return (
    <section className={`panel result-banner ${error ? 'result-banner--error' : ''}`}>
      <p className="eyebrow">Resultado</p>
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
