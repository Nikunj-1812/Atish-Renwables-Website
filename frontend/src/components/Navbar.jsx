import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';
import { navLinks } from '../data/siteData';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <Link className="brand" to="/" onClick={handleLinkClick}>
            <img src={logo} alt="ATISH RENEWABLES" className="brand__logo" />
            <span className="brand__copy">
              <span className="brand__name">ATISH RENEWABLES</span>
              <span className="brand__tagline">Raise Your <span>Green Energy</span></span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to={item.to}
                onClick={handleLinkClick}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <Button to="/contact" variant="accent" onClick={handleLinkClick}>
              <Phone size={16} />
              Get a Quote
            </Button>
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`mobile-panel ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to={item.to}
              onClick={handleLinkClick}
            >
              {item.label}
            </NavLink>
          ))}
          <Button to="/contact" variant="accent" className="w-full" onClick={handleLinkClick}>
            <Phone size={16} />
            Get a Quote
          </Button>
        </div>
      </div>
    </header>
  );
}
