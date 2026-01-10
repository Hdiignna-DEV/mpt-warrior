'use client';

import { useState } from 'react';

export default function MptLogo({ className = "", size = 96 }: { className?: string; size?: number }) {
  const [imgError, setImgError] = useState(false);

  // SVG Fallback
  const SvgFallback = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="100" cy="100" r="95" fill="#F59E0B" />
      <circle cx="100" cy="100" r="90" fill="#020617" />
      <text 
        x="100" 
        y="75" 
        fontFamily="Arial, sans-serif" 
        fontSize="42" 
        fontWeight="900" 
        fill="#F59E0B" 
        textAnchor="middle"
      >
        MPT
      </text>
      <path 
        d="M 100 120 L 140 140 L 140 170 L 100 185 L 60 170 L 60 140 Z" 
        fill="#F59E0B" 
        opacity="0.3"
      />
      <circle cx="100" cy="155" r="8" fill="#F59E0B" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
    </svg>
  );

  if (imgError) {
    return <SvgFallback />;
  }

  // Try GitHub raw URL for PNG
  return (
    <img 
      src="/images/mpt-logo.png" 
      alt="MPT Mindset Plan Trader Logo" 
      width={size}
      height={size}
      className={className}
      onError={() => setImgError(true)}
      loading="eager"
      crossOrigin="anonymous"
    />
  );
}
