import React from 'react';

export default function Loader({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`${fullPage ? 'min-h-[60vh] flex items-center justify-center' : 'inline-flex items-center'}`}>
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white/85 px-4 py-2 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gray-600 [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-gray-600 [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-gray-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
}
