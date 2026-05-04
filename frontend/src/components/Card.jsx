import React from 'react';

export default function Card({ className = '', media, mediaAlt = '', children, mediaClass = 'card-media' }) {
  return (
    <article className={`card ${className}`.trim()}>
      {media ? (
        <div className={`card__media ${mediaClass}`}>
          <img src={media} alt={mediaAlt} loading="lazy" />
        </div>
      ) : null}
      <div className="card__body">{children}</div>
    </article>
  );
}
