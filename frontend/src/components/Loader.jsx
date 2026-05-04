import React from 'react';

export default function Loader({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`${fullPage ? 'min-h-[60vh] flex items-center justify-center' : 'inline-flex items-center'}`}>
      <div className="flex items-center gap-3">
        <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-gray-700">{label}</span>
      </div>
    </div>
  );
}
