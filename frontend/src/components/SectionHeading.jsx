export default function SectionHeading({ eyebrow, title, copy, align = 'center' }) {
  return (
    <div className={`section-heading ${align === 'left' ? 'section-heading--left' : ''}`}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}
