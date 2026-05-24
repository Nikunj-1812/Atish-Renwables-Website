import React from 'react';

export default function Loader({ label = 'Loading...', fullPage = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: fullPage ? '60vh' : 'auto',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 999,
        border: '1px solid rgba(15,106,115,0.12)',
        background: 'rgba(255,255,255,0.9)',
        padding: '8px 16px',
        boxShadow: '0 4px 16px rgba(15,106,115,0.06)',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }} aria-hidden="true">
          {[0, 100, 200].map((delay) => (
            <span
              key={delay}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'block',
                animation: `loaderPulse 1.2s ease-in-out ${delay}ms infinite`,
              }}
            />
          ))}
        </span>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
