import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="panel">
      <p className="eyebrow">404</p>
      <h2>La ruta no existe.</h2>
      <p>Regresa al inicio para seguir jugando.</p>
      <Link to="/" className="text-link">
        Ir al inicio
      </Link>
    </section>
  );
}
