import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function HeroSection({
  eyebrow,
  title,
  copy,
  image,
  actions = [],
  stats = [],
  priority = false,
  isHomePage = false,
}) {
  return (
    <section className={`hero ${isHomePage ? 'hero--home' : 'hero--page'}`}>
      <div className="hero__bg" aria-hidden="true">
        <img
          alt="Solar installation"
          src={image}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding="async"
          style={{ objectPosition: 'center' }}
        />
        {/* overlay to mask brightness while image loads/fades - prevents light flash on navigation */}
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      <div className="container">
        <div className="hero__content" role="region" aria-label="Hero content">
          <div className="hero__intro-copy">
            {eyebrow ? (
              <span className="section-eyebrow" style={{ color: '#ffd768' }}>{eyebrow}</span>
            ) : null}
            <h1 className="hero__headline">{title}</h1>

            <p className="hero__copy">{copy}</p>

            {actions.length > 0 ? (
              <div className="hero__actions">
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    to={action.to}
                    href={action.href}
                    download={action.download}
                    variant={action.variant ?? 'primary'}
                  >
                    {action.label}
                    {action.icon === 'arrow' ? <ArrowRight size={16} /> : null}
                    {action.icon === 'download' ? <ArrowDownToLine size={16} /> : null}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          {stats.length > 0 ? (
            <div className="hero__stats">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
