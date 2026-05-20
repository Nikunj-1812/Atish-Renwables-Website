import React, { memo } from 'react';

function ImageCard({ src, alt, className = '', height = 'h-56' }) {
  return (
    <div className={`image-card ${height} overflow-hidden relative ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover block"
        draggable={false}
      />
    </div>
  );
}

export default memo(ImageCard);
