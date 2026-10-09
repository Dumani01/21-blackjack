import Button from './Button';

export default function ErrorState({ title = 'Ocurrió un error', message, onRetry }) {
  return (
    <div className="panel error-state" role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry ? <Button onClick={onRetry}>Reintentar</Button> : null}
    </div>
  );
}
