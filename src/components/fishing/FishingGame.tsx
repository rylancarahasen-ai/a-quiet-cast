import React, { useState, useEffect, useCallback } from 'react';
import { GameStats } from '@/entities/GameStats';
import { User } from '@/entities/User';
import GameBackground from './GameBackground';
import Fisherman from './Fisherman';
import FishingMechanics from './FishingMechanics';
import GameUI from './GameUI';
import WeatherSystem from './WeatherSystem';
import { FishCatch } from '@/entities/FishCatch';
import FishCollection from './FishCollection';
import { Achievement } from '@/entities/Achievement';
import AchievementDisplay from './AchievementDisplay';

const WEATHER_CYCLE = ['sunset', 'mountain', 'snow', 'rain', 'starry'];
const WEATHER_DURATION = 2.5 * 60 * 1000; // 2.5 minutes in milliseconds

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
    gameStats: null as any,
    showFishCollection: false,
    showAchievements: false
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [fishCollection, setFishCollection] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Load game stats and fish collection on mount
  useEffect(() => {
    loadGameStats();
    loadFishCollection();
    loadAchievements();
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
      console.log('Could not load game stats:', error);
    }
  };

  const loadFishCollection = async () => {
    try {
      const user = await User.me();
      const catches = await FishCatch.filter({ created_by: user.email }, '-timestamp');
      setFishCollection(catches);
    } catch (error) {
      // User not logged in or no catches yet
      console.log('Could not load fish collection:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const user = await User.me();
      let userAchievements = await Achievement.filter({ created_by: user.email });
      
      // Initialize achievement if it doesn't exist
      if (userAchievements.length === 0) {
        await Achievement.create({
          achievementId: 'first-fish',
          title: 'Every End Is A New Beginning',
          description: 'Caught your first fish',
          unlockedQuote: 'God buries our sins in the depths of the sea and then puts up a sign that says, "No Fishing". - Corrie ten Boom',
          unlocked: false
        });
        userAchievements = await Achievement.filter({ created_by: user.email });
      }
      
      setAchievements(userAchievements);
    } catch (error) {
      console.log('Could not load achievements:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    try {
      const achievement = achievements.find(a => a.achievementId === achievementId);
      if (achievement && !achievement.unlocked) {
        await Achievement.update(achievement.id, {
          unlocked: true,
          unlockedAt: Date.now()
        });
        await loadAchievements();
      }
    } catch (error) {
      console.log('Could not unlock achievement:', error);
    }
  };

  const updateGameStats = useCallback(async (updates: any) => {
    try {
      const user = await User.me();
      
      if (gameState.gameStats) {
        await GameStats.update(gameState.gameStats.id, updates);
      } else {
        // The GameStats.create method should handle adding the created_by field
        await GameStats.create(updates);
      }
      
      loadGameStats(); // Reload to get the latest stats, including the new one if created
    } catch (error) {
      console.log('Could not update game stats:', error);
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
    const minPos = 43; // Corresponds to the left edge of the dock
    const maxPos = 57; // Corresponds to the right edge of the dock
    
    if (keys.ArrowLeft && gameState.fishermanPosition > minPos) {
      setGameState(prev => ({
        ...prev,
        fishermanPosition: Math.max(minPos, prev.fishermanPosition - moveSpeed)
      }));
    }
    
    if (keys.ArrowRight && gameState.fishermanPosition < maxPos) {
      setGameState(prev => ({
        ...prev,
        fishermanPosition: Math.min(maxPos, prev.fishermanPosition + moveSpeed)
      }));
    }

    if (keys.ArrowDown) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isSitting: !prev.isSitting }));
      }, 100);
      setKeys(prev => ({ ...prev, ArrowDown: false }));
    }
  }, [keys, gameState.fishermanPosition]);

  const handleFish = useCallback(async () => {
    if (gameState.isFishing) {
      // Reel in
      const fishSize = Math.random() * 100 + 10; // 10-110cm
      const fishType = ['Bass', 'Trout', 'Salmon', 'Pike', 'Catfish'][Math.floor(Math.random() * 5)];
      
      const catchData = {
        fishType,
        size: Math.round(fishSize),
        weather: gameState.currentWeather,
        timestamp: Date.now()
      };

      // Store current fish count BEFORE updating state
      const isFirstFish = gameState.fishCaught === 0;
      const currentFishCount = gameState.fishCaught;

      // Update local game state immediately for responsiveness
      setGameState(prev => {
        const newCatch = {
          type: fishType,
          size: Math.round(fishSize),
          weather: prev.currentWeather,
          timestamp: Date.now()
        };
        const newFishCaughtCount = prev.fishCaught + 1;

        return {
          ...prev,
          isFishing: false,
          currentCatch: newCatch,
          fishCaught: newFishCaughtCount
        };
      });

      // Try to save catch to database (but don't block the game if it fails)
      try {
        await FishCatch.create(catchData);
        await loadFishCollection(); // Refresh collection after successful save
        
        // Check for first fish achievement using the stored value
        if (isFirstFish) {
          console.log('Unlocking first fish achievement!');
          await unlockAchievement('first-fish');
        }
        
        // Update stats after successful save
        updateGameStats({
          fishCaught: currentFishCount + 1,
          biggestFish: Math.max(gameState.gameStats?.biggestFish || 0, fishSize),
          favoriteWeather: gameState.currentWeather
        });
      } catch (error) {
        console.log('Could not save catch to database, but game continues:', error);
        // Game continues even if database save fails
      }

    } else {
      // Cast line
      setGameState(prev => ({
        ...prev,
        isFishing: true,
        currentCatch: null
      }));
    }
  }, [gameState.isFishing, gameState.currentWeather, gameState.fishCaught, gameState.gameStats, updateGameStats]);

  const dismissCatch = () => {
    setGameState(prev => ({ ...prev, currentCatch: null }));
  };

  const handleCabinDoorClick = () => {
    setGameState(prev => ({ ...prev, showFishCollection: true }));
  };

  const closeFishCollection = () => {
    setGameState(prev => ({ ...prev, showFishCollection: false }));
  };

  const handleGravestoneClick = () => {
    setGameState(prev => ({ ...prev, showAchievements: true }));
  };

  const closeAchievements = () => {
    setGameState(prev => ({ ...prev, showAchievements: false }));
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 relative">
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
          {/* Door - Now clickable */}
          <rect 
            x="70" 
            y="90" 
            width="40" 
            height="70" 
            fill="#3c1810"
            style={{ cursor: 'pointer' }}
            onClick={handleCabinDoorClick}
          />
          {/* Door handle */}
          <circle 
            cx="100" 
            cy="125" 
            r="2" 
            fill="#d4af37"
            style={{ cursor: 'pointer' }}
            onClick={handleCabinDoorClick}
          />
          {/* Windows */}
          <rect x="20" y="70" width="30" height="25" fill="#ffd700" opacity="0.7" />
          <rect x="130" y="70" width="30" height="25" fill="#ffd700" opacity="0.7" />
          {/* Chimney */}
          <rect x="140" y="10" width="20" height="40" fill="#8b4513" />
        </g>

        {/* Grave of Luna Wildrose */}
            <g transform="translate(1100, 400)" style={{ cursor: 'pointer' }} onClick={handleGravestoneClick}>
                
                {/* Grave Stone */}
                <rect x="-45" y="55" width="90" height="30" rx="5" ry="5" fill="#a0a0a0" stroke="#757575" strokeWidth="1" />
                
                {/* Wooden Cross */}
                <g transform="translate(0, 5)">
                    <rect x="-10" y="-15" width="20" height="85" fill="#795548" rx="2" ry="2" />
                    <rect x="-30" y="7" width="60" height="15" fill="#795548" rx="2" ry="2" />
                    
                    {/* Text: Luna Wildrose */}
                    <text x="0" y="11" 
                          fontFamily="sans-serif" 
                          fontSize="7" 
                          fill="#fbe2b1" 
                          textAnchor="middle"
                          fontWeight="bold">LUNA</text>
                    <text x="0" y="21" 
                          fontFamily="sans-serif" 
                          fontSize="7" 
                          fill="#fbe2b1" 
                          textAnchor="middle"
                          fontWeight="bold">WILDROSE</text>
                </g>

                {/* Red Flowers */}
                <g transform="translate(-15, 70)">
                    {/* Stem */}
                    <rect x="-1" y="0" width="2" height="15" fill="#388e3c" />
                    {/* Petals */}
                    <circle cx="0" cy="0" r="4" fill="#e53935" />
                    <circle cx="3" cy="-2.5" r="4" fill="#e53935" />
                    <circle cx="-3" cy="-2.5" r="4" fill="#e53935" />
                    {/* Center */}
                    <circle cx="0" cy="0" r="2" fill="#ffc107" />
                </g>

                <g transform="translate(0, 70)">
                    <rect x="-1" y="0" width="2" height="15" fill="#388e3c" />

                    <circle cx="0" cy="0" r="4" fill="#e53935" />
                    <circle cx="3" cy="-2.5" r="4" fill="#e53935" />
                    <circle cx="-3" cy="-2.5" r="4" fill="#e53935" />

                    <circle cx="0" cy="0" r="2" fill="#ffc107" />
                </g>
                
                <g transform="translate(15, 70)">
                    <rect x="-1" y="0" width="2" height="15" fill="#388e3c" />

                    <circle cx="0" cy="0" r="4" fill="#e53935" />
                    <circle cx="3" cy="-2.5" r="4" fill="#e53935" />
                    <circle cx="-3" cy="-2.5" r="4" fill="#e53935" />

                    <circle cx="0" cy="0" r="2" fill="#ffc107" />
                </g>

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

      {/* Fish Collection Modal */}
      {gameState.showFishCollection && (
        <FishCollection 
          fishCollection={fishCollection}
          onClose={closeFishCollection}
        />
      )}

      {/* Achievement Display Modal */}
      {gameState.showAchievements && (
        <AchievementDisplay 
          achievements={achievements}
          onClose={closeAchievements}
        />
      )}
    </div>
  );
}