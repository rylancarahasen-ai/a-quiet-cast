import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trophy, Lock, Unlock } from 'lucide-react';

interface AchievementData {
  id?: string;
  achievementId: string;
  title: string;
  description: string;
  unlockedQuote: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface AchievementDisplayProps {
  achievements: AchievementData[];
  onClose: () => void;
}

export default function AchievementDisplay({ achievements, onClose }: AchievementDisplayProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-600">
        <CardHeader className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Achievements
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-purple-200">
            <span>Unlocked: {unlockedCount} / {achievements.length}</span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.achievementId}
                className={`transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400' 
                    : 'bg-gray-800 border-gray-700 opacity-60'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`text-5xl ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                      {achievement.unlocked ? <Unlock className="w-12 h-12 text-amber-600" /> : <Lock className="w-12 h-12 text-gray-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && (
                          <Badge className="bg-amber-500 text-white">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>

                      {achievement.unlocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAchievement(
                              selectedAchievement === achievement.achievementId ? null : achievement.achievementId
                            );
                          }}
                          className="mb-3"
                        >
                          {selectedAchievement === achievement.achievementId ? 'Hide Quote' : 'View Quote'}
                        </Button>
                      )}

                      {achievement.unlocked && selectedAchievement === achievement.achievementId && (
                        <div className="mt-2 mb-3 p-4 bg-white rounded-lg border-2 border-amber-300 shadow-inner">
                          <div className="text-xs font-semibold text-amber-700 mb-2">UNLOCKED QUOTE:</div>
                          <p className="text-sm italic text-gray-800 leading-relaxed">
                            "{achievement.unlockedQuote}"
                          </p>
                        </div>
                      )}

                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={onClose}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 px-8"
            >
              Continue Fishing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}