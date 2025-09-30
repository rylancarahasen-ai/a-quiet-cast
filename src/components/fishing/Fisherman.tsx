import React from 'react';

interface FishermanProps {
  position: number;
  isSitting: boolean;
  isFishing: boolean;
}

export default function Fisherman({ position, isSitting, isFishing }: FishermanProps) {
  const x = (position / 100) * 1200;
  const y = isSitting ? 530 : 500;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body (Brown Overalls) */}
      <rect x="-15" y="20" width="30" height="40" fill="#8b4513" rx="5" />
      
      {/* Legs */}
      {!isSitting ? (
        <>
          <rect x="-12" y="55" width="8" height="25" fill="#654321" />
          <rect x="4" y="55" width="8" height="25" fill="#654321" />
          {/* Feet */}
          <rect x="-15" y="78" width="12" height="6" fill="#2d1810" rx="3" />
          <rect x="3" y="78" width="12" height="6" fill="#2d1810" rx="3" />
        </>
      ) : (
        <>
          <rect x="-12" y="55" width="8" height="15" fill="#654321" />
          <rect x="4" y="55" width="8" height="15" fill="#654321" />
          <rect x="-12" y="68" width="25" height="8" fill="#654321" />
        </>
      )}

      {/* Arms */}
      <rect x="-25" y="25" width="8" height="20" fill="#ffdbac" />
      <rect x="17" y="25" width="8" height="20" fill="#ffdbac" />

      {/* Fishing Rod */}
      {isFishing && (
        <line x1="25" y1="20" x2="100" y2="-20" stroke="#8b4513" strokeWidth="2" />
      )}

      {/* Head */}
      <circle cx="0" cy="10" r="12" fill="#ffdbac" />

      {/* Blue Beanie */}
      <ellipse cx="0" cy="5" rx="14" ry="10" fill="#2563eb" />
      <circle cx="0" cy="-2" r="3" fill="#1d4ed8" />

      {/* Gray Beard */}
      <ellipse cx="0" cy="18" rx="8" ry="6" fill="#6b7280" />
      <rect x="-4" y="16.5" width="8" height="2" fill="#000000" />

      {/* Eyes */}
      <circle cx="-4" cy="8" r="1.5" fill="#000" />
      <circle cx="4" cy="8" r="1.5" fill="#000" />

      {/* Fishing rod handle */}
      {isFishing && (
        <rect x="20" y="18" width="8" height="3" fill="#4a2c17" rx="1" />
      )}
    </g>
  );
}