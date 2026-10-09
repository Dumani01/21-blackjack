import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/play', label: 'Juego' },
  { to: '/scores', label: 'Puntajes' },
];

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="brand-block">
        <div className="brand-seal">桜</div>
        <div>
          <p className="eyebrow">Blackjack Oriental</p>
          <h1>Sakura 21</h1>
        </div>
      </div>

      <nav className="site-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`.trim()}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
