import { Link } from 'react-router-dom';
import { navLinks, socialLinks } from '../data/siteData';
import logo from '../assets/logo.png';

const quickLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Solar Calculator', to: '/calculator' },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
];

const supportLinks = [
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
  { label: 'Careers', to: '#' },
  { label: 'Sustainability Report', to: '#' },
];

const handleScrollToTop = () => {
  window.scrollTo(0, 0);
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__overlay" aria-hidden="true">
        <img alt="Decorative wave" src="/footer-wave.svg" className="footer__wave" loading="lazy" />
      </div>

      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__title">
              <img src={logo} alt="ATISH RENEWABLES" className="brand__logo" />
              <span className="footer__brand-copy">
                <strong className="footer__brand-name">ATISH RENEWABLES</strong>
                <span className="footer__tagline">Raise Your Green Energy</span>
              </span>
            </div>
            <p className="footer__text">
              Engineering sustainable futures through world-class solar EPC solutions for industrial,
              commercial, and residential sectors.
            </p>
            <div className="footer__social">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} className="social-link" href={href} aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={handleScrollToTop}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Support</h4>
            <ul className="footer__list">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.to}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Navigation</h4>
            <ul className="footer__list">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={handleScrollToTop}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">© 2026 ATISH RENEWABLES. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
