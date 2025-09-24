import React from 'react';

interface GameBackgroundProps {
  weather: string;
}

export default function GameBackground({ weather }: GameBackgroundProps) {
  const getWeatherColors = () => {
    switch (weather) {
      case 'sunset':
        return {
          sky: ['#ff6b35', '#f7931e', '#ffd23f'],
          mountain: '#6b4423',
          tree: '#2d5016'
        };
      case 'mountain':
        return {
          sky: ['#4a5568', '#718096', '#a0aec0'],
          mountain: '#2d3748',
          tree: '#1a202c'
        };
      case 'snow':
        return {
          sky: ['#f7fafc', '#edf2f7', '#e2e8f0'],
          mountain: '#cbd5e0',
          tree: '#4a5568'
        };
      case 'rain':
        return {
          sky: ['#4299e1', '#63b3ed', '#90cdf4'],
          mountain: '#2b6cb0',
          tree: '#2c5282'
        };
      case 'starry':
        return {
          sky: ['#1a202c', '#2d3748', '#4a5568'],
          mountain: '#1a202c',
          tree: '#0f0f0f'
        };
      default:
        return {
          sky: ['#ff6b35', '#f7931e', '#ffd23f'],
          mountain: '#6b4423',
          tree: '#2d5016'
        };
    }
  };

  const colors = getWeatherColors();

  return (
    <g>
      {/* Sky Gradient */}
      <defs>
        <linearGradient id={`skyGradient-${weather}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.sky[0]} />
          <stop offset="50%" stopColor={colors.sky[1]} />
          <stop offset="100%" stopColor={colors.sky[2]} />
        </linearGradient>
      </defs>
      
      <rect width="1200" height="400" fill={`url(#skyGradient-${weather})`} />

      {/* Mountains */}
      <polygon
        points="0,300 200,150 400,200 600,100 800,180 1000,120 1200,250 1200,400 0,400"
        fill={colors.mountain}
        opacity="0.8"
      />
      
      {/* Secondary mountain layer */}
      <polygon
        points="100,350 300,200 500,250 700,150 900,220 1100,180 1200,280 1200,400 0,400"
        fill={colors.mountain}
        opacity="0.6"
      />

      {/* Trees */}
      <g opacity="0.7">
        {/* Pine trees scattered around */}
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`translate(${100 + i * 150}, ${320 + Math.random() * 40})`}>
            {/* Tree trunk */}
            <rect x="8" y="40" width="4" height="20" fill="#8b4513" />
            {/* Tree layers */}
            <polygon points="10,10 0,30 20,30" fill={colors.tree} />
            <polygon points="10,20 2,40 18,40" fill={colors.tree} />
            <polygon points="10,30 4,50 16,50" fill={colors.tree} />
          </g>
        ))}
      </g>

      {/* Sun/Moon */}
      {weather === 'starry' ? (
        <g>
          {/* Moon */}
          <circle cx="1000" cy="120" r="40" fill="#fbbf24" opacity="0.9" />
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1200}
              cy={Math.random() * 300}
              r="2"
              fill="#fbbf24"
              opacity="0.8"
            />
          ))}
        </g>
      ) : (
        <circle cx="1000" cy="120" r="50" fill="#ffd700" opacity="0.9" />
      )}

      {/* Clouds */}
      <g opacity="0.6">
        {[...Array(3)].map((_, i) => (
          <g key={i} transform={`translate(${200 + i * 300}, ${80 + Math.random() * 100})`}>
            <circle cx="0" cy="0" r="25" fill="white" />
            <circle cx="20" cy="0" r="35" fill="white" />
            <circle cx="40" cy="0" r="25" fill="white" />
            <circle cx="20" cy="-15" r="20" fill="white" />
          </g>
        ))}
      </g>
    </g>
  );
}