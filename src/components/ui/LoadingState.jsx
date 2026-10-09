export default function LoadingState({ label = 'Cargando...' }) {
  return (
    <div className="panel empty-state" role="status" aria-live="polite">
      <div className="loader" />
      <p>{label}</p>
    </div>
  );
}
