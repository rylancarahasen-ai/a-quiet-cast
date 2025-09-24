import React from 'react';

interface FishingMechanicsProps {
  fishermanPosition: number;
  isFishing: boolean;
  weather: string;
}

export default function FishingMechanics({ fishermanPosition, isFishing, weather }: FishingMechanicsProps) {
  if (!isFishing) return null;

  const startX = (fishermanPosition / 100) * 1200 + 100;
  const endX = startX + Math.random() * 200 - 100;
  const endY = 600 + Math.random() * 100;

  return (
    <g>
      {/* Fishing Line */}
      <line
        x1={startX}
        y1={480}
        x2={endX}
        y2={endY}
        stroke="#4a5568"
        strokeWidth="1"
        opacity="0.8"
      />
      
      {/* Bobber */}
      <circle
        cx={endX}
        cy={endY}
        r="3"
        fill="#ef4444"
        opacity="0.9"
      >
        <animate
          attributeName="cy"
          values={`${endY - 5};${endY + 5};${endY - 5}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Ripples around bobber */}
      <g opacity="0.4">
        {[...Array(3)].map((_, i) => (
          <circle
            key={i}
            cx={endX}
            cy={endY}
            r="5"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1"
          >
            <animate
              attributeName="r"
              values="5;20;35"
              dur="3s"
              begin={`${i * 1}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.3;0"
              dur="3s"
              begin={`${i * 1}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </g>
  );
}