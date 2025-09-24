import React from 'react';

interface WeatherSystemProps {
  weather: string;
}

export default function WeatherSystem({ weather }: WeatherSystemProps) {
  switch (weather) {
    case 'rain':
      return (
        <g opacity="0.6">
          {[...Array(50)].map((_, i) => (
            <line
              key={i}
              x1={Math.random() * 1200}
              y1={Math.random() * 400}
              x2={Math.random() * 1200}
              y2={Math.random() * 400 + 20}
              stroke="#60a5fa"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,-20;0,800"
                dur={`${1 + Math.random()}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>
      );

    case 'snow':
      return (
        <g opacity="0.8">
          {[...Array(30)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1200}
              cy={Math.random() * 400}
              r={2 + Math.random() * 3}
              fill="white"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,-20;${Math.random() * 50 - 25},800`}
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      );

    case 'starry':
      return (
        <g opacity="0.9">
          {[...Array(15)].map((_, i) => (
            <g key={i}>
              <circle
                cx={Math.random() * 1200}
                cy={Math.random() * 300}
                r="1.5"
                fill="#fbbf24"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur={`${2 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>
      );

    default:
      return null;
  }
}