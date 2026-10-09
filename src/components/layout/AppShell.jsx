import NavBar from './NavBar';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <div className="decor decor--left" />
      <div className="decor decor--right" />
      <NavBar />
      <main className="page-wrap">{children}</main>
      <footer className="site-footer">
        <p>Sakura 21 · Juego de cartas 21 con estilo japonés oriental.</p>
      </footer>
    </div>
  );
}
