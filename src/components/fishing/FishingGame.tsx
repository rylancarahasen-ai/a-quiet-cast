import React, { useState, useEffect, useCallback } from 'react';
import { GameStats } from '@/entities/GameStats';
import { User } from '@/entities/User';
import GameBackground from './GameBackground';
import Fisherman from './Fisherman';
import FishingMechanics from './FishingMechanics';
import GameUI from './GameUI';
import WeatherSystem from './WeatherSystem';

const WEATHER_CYCLE = ['sunset', 'mountain', 'snow', 'rain', 'starry'];
const WEATHER_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function FishingGame() {
  const [gameState, setGameState] = useState({
    fishermanPosition: 50, // percentage from left
    isSitting: false,
    isFishing: false,
    currentWeather: 'sunset',
    weatherIndex: 0,
    fishCaught: 0,
    currentCatch: null as {
      type: string;
      size: number;
      weather: string;
      timestamp: number;
    } | null,
    gameStats: null as any
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});

  // Load game stats on mount
  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const user = await User.me();
      const stats = await GameStats.list();
      const userStats = stats.find(s => s.created_by === user.email);
      
      if (userStats) {
        setGameState(prev => ({ ...prev, gameStats: userStats }));
      }
    } catch (error) {
      // User not logged in or no stats yet
      console.log('No existing stats found');
    }
  };

  const updateGameStats = useCallback(async (updates: any) => {
    try {
      const user = await User.me();
      
      if (gameState.gameStats) {
        await GameStats.update(gameState.gameStats.id, updates);
      } else {
        // Ensure a new gameStats object is created with all necessary fields
        await GameStats.create({
          ...updates,
        });
      }
      
      loadGameStats(); // Reload to get the latest stats
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  }, [gameState.gameStats]);

  // Weather cycling system
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      setGameState(prev => {
        const nextIndex = (prev.weatherIndex + 1) % WEATHER_CYCLE.length;
        return {
          ...prev,
          weatherIndex: nextIndex,
          currentWeather: WEATHER_CYCLE[nextIndex]
        };
      });
    }, WEATHER_DURATION);

    return () => clearInterval(weatherInterval);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle movement and actions
  useEffect(() => {
    const moveSpeed = 1;
    
    if (keys.ArrowLeft && gameState.fishermanPosition > 5) {
      setGameState(prev => ({
        ...prev,
        fishermanPosition: Math.max(5, prev.fishermanPosition - moveSpeed)
      }));
    }
    
    if (keys.ArrowRight && gameState.fishermanPosition < 95) {
      setGameState(prev => ({
        ...prev,
        fishermanPosition: Math.min(95, prev.fishermanPosition + moveSpeed)
      }));
    }

    if (keys.ArrowDown) {
      // Toggle sitting state
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isSitting: !prev.isSitting }));
      }, 100);
      setKeys(prev => ({ ...prev, ArrowDown: false }));
    }
  }, [keys, gameState.fishermanPosition]);

  const handleFish = useCallback(() => {
    if (gameState.isFishing) {
      // Reel in
      const fishSize = Math.random() * 100 + 10; // 10-110cm
      const fishType = ['Bass', 'Trout', 'Salmon', 'Pike', 'Catfish'][Math.floor(Math.random() * 5)];
      
      const newCatch = {
        type: fishType,
        size: Math.round(fishSize),
        weather: gameState.currentWeather,
        timestamp: Date.now()
      };

      setGameState(prev => ({
        ...prev,
        isFishing: false,
        currentCatch: newCatch,
        fishCaught: prev.fishCaught + 1
      }));

      // Update stats
      updateGameStats({
        fishCaught: (gameState.gameStats?.fishCaught || 0) + 1,
        biggestFish: Math.max(gameState.gameStats?.biggestFish || 0, fishSize),
        favoriteWeather: gameState.currentWeather
      });

    } else {
      // Cast line
      setGameState(prev => ({
        ...prev,
        isFishing: true,
        currentCatch: null
      }));
    }
  }, [gameState.isFishing, gameState.fishCaught, gameState.currentWeather, gameState.gameStats, updateGameStats]);

  const dismissCatch = () => {
    setGameState(prev => ({ ...prev, currentCatch: null }));
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-background via-muted to-background relative">
      {/* Game Canvas */}
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full weather-transition"
        style={{ background: 'transparent' }}
      >
        {/* Background Elements */}
        <GameBackground weather={gameState.currentWeather} />
        
        {/* Weather Effects */}
        <WeatherSystem weather={gameState.currentWeather} />
        
        {/* Lake */}
        <ellipse
          cx="600"
          cy="600"
          rx="500"
          ry="180"
          fill={gameState.currentWeather === 'starry' ? '#1e3a8a' :
                gameState.currentWeather === 'rain' ? '#1e40af' :
                gameState.currentWeather === 'snow' ? '#3b82f6' :
                gameState.currentWeather === 'mountain' ? '#374151' : '#4338ca'}
          opacity="0.8"
          className="weather-transition"
        />
        
        {/* Dock */}
        <rect
          x="500"
          y="520"
          width="200"
          height="80"
          fill="#8b5a3c"
          rx="5"
        />
        
        {/* Log Cabin */}
        <g transform="translate(100, 300)">
          {/* Cabin body */}
          <rect x="0" y="40" width="180" height="120" fill="#6b4423" />
          {/* Roof */}
          <polygon points="0,40 90,0 180,40" fill="#4a2c17" />
          {/* Door */}
          <rect x="70" y="90" width="40" height="70" fill="#3c1810" />
          {/* Windows */}
          <rect x="20" y="70" width="30" height="25" fill="#ffd700" opacity="0.7" />
          <rect x="130" y="70" width="30" height="25" fill="#ffd700" opacity="0.7" />
          {/* Chimney */}
          <rect x="140" y="10" width="20" height="40" fill="#8b4513" />
        </g>
        
        {/* Fisherman */}
        <Fisherman
          position={gameState.fishermanPosition}
          isSitting={gameState.isSitting}
          isFishing={gameState.isFishing}
        />
        
        {/* Fishing line and mechanics */}
        <FishingMechanics
          fishermanPosition={gameState.fishermanPosition}
          isFishing={gameState.isFishing}
          weather={gameState.currentWeather}
        />
      </svg>

      {/* Game UI Overlay */}
      <GameUI
        gameState={gameState}
        onFish={handleFish}
        onDismissCatch={dismissCatch}
        weather={gameState.currentWeather}
      />
    </div>
  );
}