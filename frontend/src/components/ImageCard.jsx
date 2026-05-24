import React, { memo } from 'react';

function ImageCard({ src, alt, className = '', style = {} }) {
  return (
    <div
      className={`image-card ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'inherit',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}

export default memo(ImageCard);
