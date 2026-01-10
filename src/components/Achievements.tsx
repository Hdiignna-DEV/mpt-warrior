'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Star, Trophy, Zap, Target, TrendingUp } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (trades: Trade[]) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsProps {
  trades?: Trade[];
  data?: any; // Data from API
}

export default function Achievements({ trades = [], data }: AchievementsProps) {
  const { t } = useTranslation();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Use API data if available, otherwise use trades prop
  const earnedBadges = data?.earned || [];
  const availableBadges = data?.available || [];
  const progressMap = data?.progress || {};

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-500/20 border-gray-500 text-gray-400',
    rare: 'bg-blue-500/20 border-blue-500 text-blue-400',
    epic: 'bg-purple-500/20 border-purple-500 text-purple-400',
    legendary: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  };

  return (
    <div className="space-y-8">
      {/* Earned Badges */}
      {earnedBadges && earnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-300 mb-4">✨ Earned ({earnedBadges.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge: any) => (
              <div
                key={badge.id}
                className={`border-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${rarityColors[badge.rarity]}`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-bold mb-1">{badge.name}</h4>
                <p className="text-sm opacity-80">{badge.description}</p>
                <div className="mt-2 text-xs opacity-60 capitalize">{badge.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges && availableBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-400 mb-4">🔒 Challenges ({availableBadges.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableBadges.map((badge: any) => {
              const progress = progressMap[badge.id];
              const percent = progress?.target > 0 
                ? Math.round((progress?.current / progress?.target) * 100) 
                : 0;
              
              return (
                <div
                  key={badge.id}
                  className="border-2 border-slate-600 bg-slate-800/30 rounded-xl p-4 text-center opacity-75 hover:opacity-100 transition-all"
                >
                  <div className="text-4xl mb-2 filter grayscale">{badge.icon}</div>
                  <h4 className="font-bold mb-1 text-slate-400">{badge.name}</h4>
                  <p className="text-sm text-slate-500 mb-3">{badge.description}</p>
                  
                  {/* Progress Bar */}
                  {progress && (
                    <div className="mb-2">
                      <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full transition-all"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {progress.current} / {progress.target}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-600 capitalize">{badge.rarity}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Data */}
      {!earnedBadges && !availableBadges && (
        <div className="text-center py-12">
          <p className="text-slate-400">Load trades to see achievements...</p>
        </div>
      )}

      {/* All Badges Unlocked */}
      {earnedBadges?.length > 0 && availableBadges?.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border-2 border-yellow-500 rounded-xl p-6 text-center">
          <p className="text-4xl mb-2">👑</p>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">Master Trader!</h3>
          <p className="text-slate-300">You've unlocked all achievements! 🎉</p>
        </div>
      )}
    </div>
  );
}
