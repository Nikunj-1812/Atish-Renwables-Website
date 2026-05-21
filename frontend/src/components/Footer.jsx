import { Link } from 'react-router-dom';
import { contactMethods, socialLinks } from '../data/siteData';
import logo from '../assets/logo.webp';

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
            <Link className="brand" to="/" onClick={handleScrollToTop}>
              <img src={logo} alt="ATISH RENEWABLES" className="brand__logo" loading="lazy" decoding="async" />
              <span className="brand__copy">
                <span className="brand__name brand__name--light">ATISH RENEWABLES</span>
                <span className="brand__tagline">Raise Your <span>Green Energy</span></span>
              </span>
            </Link>
            <p className="footer__text">
              Engineering sustainable futures through world-class solar EPC solutions for industrial,
              commercial, and residential sectors.
            </p>
            <div className="footer__social">
              {socialLinks.map(({ label, href, icon: Icon }) => {
                const isWhatsApp = label === 'WhatsApp';
                return (
                  <a key={label} className="social-link" href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                    {isWhatsApp ? (
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.441 0 9.866-4.423 9.87-9.869.002-2.639-1.018-5.12-2.87-6.974C17.202 1.908 14.72 1.888 12.007 1.888c-5.45 0-9.873 4.424-9.877 9.87-.001 1.997.518 3.948 1.503 5.679L2.64 21.365l4.007-1.461zm11.238-6.195c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.912-.89 1.096-.164.186-.328.21-.628.06-.3-.15-1.267-.467-2.414-1.491-.892-.797-1.494-1.78-1.67-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.633-1.527-.868-2.09-.23-.553-.483-.477-.633-.485-.15-.008-.323-.009-.496-.009-.174 0-.458.065-.697.325-.24.26-1.12 1.095-1.12 2.67 0 1.575 1.147 3.097 1.303 3.303.158.205 2.257 3.447 5.467 4.834.763.33 1.358.527 1.821.674.767.243 1.465.209 2.016.127.615-.093 1.774-.725 2.023-1.425.25-.7.25-1.3.175-1.425-.075-.125-.25-.2-.55-.35z" />
                      </svg>
                    ) : (
                      <Icon size={18} />
                    )}
                  </a>
                );
              })}
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
            <h4 className="footer__heading">Contact Details</h4>
            <ul className="footer__list">
              {contactMethods.map((item) => {
                const isLink = item.link && item.link !== '#';
                return (
                  <li key={item.title}>
                    {isLink ? (
                      <a href={item.link}>{item.title}: {item.value}</a>
                    ) : (
                      <span>{item.title}: {item.value}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">© 2026 ATISH RENEWABLES. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
