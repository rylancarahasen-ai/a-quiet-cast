import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fish, Waves, Mountain, Snowflake, CloudRain, Star } from 'lucide-react';

const weatherIcons = {
  sunset: Waves,
  mountain: Mountain,
  snow: Snowflake,
  rain: CloudRain,
  starry: Star
};

interface GameUIProps {
  gameState: {
    fishCaught: number;
    isFishing: boolean;
    currentCatch?: {
      type: string;
      size: number;
      weather: string;
    } | null;
    gameStats?: {
      biggestFish: number;
      fishCaught: number;
    } | null;
  };
  onFish: () => void;
  onDismissCatch: () => void;
  weather: string;
}

export default function GameUI({ gameState, onFish, onDismissCatch, weather }: GameUIProps) {
  const WeatherIcon = weatherIcons[weather as keyof typeof weatherIcons];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Card className="game-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-3 text-foreground">
              <WeatherIcon className="w-5 h-5" />
              <span className="capitalize font-medium">{weather}</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                Fish Caught: {gameState.fishCaught}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="text-foreground/80 text-md">
          <div>Use ← → arrows to move</div>
          <div>↓ arrow to sit/stand</div>
          <div>Click a to view collection</div>
          <div>Click d to view achievements</div>
          <div>Click x to exit</div>
          <div>Click spacebar to fish</div>
        </div>
      </div>

      {/* Fishing Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Button
          onClick={onFish}
          size="lg"
          className={`px-8 py-4 text-lg font-semibold transition-all duration-300 ${
            gameState.isFishing
              ? 'game-button-secondary animate-pulse'
              : 'game-button-primary'
          }`}
        >
          {gameState.isFishing ? 'Reel In' : 'Cast Line'}
        </Button>
      </div>

      {/* Catch Display */}
      {gameState.currentCatch && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <Card className="w-96 bg-card shadow-2xl border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-accent flex items-center justify-center gap-2">
                <Fish className="w-6 h-6" />
                Great Catch!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl">🐟</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{gameState.currentCatch.type}</h3>
                <p className="text-lg text-muted-foreground">{gameState.currentCatch.size} cm</p>
                <Badge className="mt-2 capitalize bg-primary/20 text-primary">
                  Caught during {gameState.currentCatch.weather}
                </Badge>
              </div>
              <Button onClick={onDismissCatch} className="w-full game-button-primary">
                Continue Fishing
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Stats */}
      {gameState.gameStats && (
        <Card className="absolute bottom-4 right-4 game-card pointer-events-auto">
          <CardContent className="p-3 text-foreground text-sm">
            <div>Best Catch: {Math.round(gameState.gameStats.biggestFish)}cm</div>
            <div>Total Fish: {gameState.gameStats.fishCaught}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}