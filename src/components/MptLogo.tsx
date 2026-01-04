'use client';

export default function MptLogo({ className = "", size = 96 }: { className?: string; size?: number }) {
  // Gunakan SVG permanent karena PNG tidak bisa load di Vercel
  return (
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
}
