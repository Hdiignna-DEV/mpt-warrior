'use client';

import { useState, useMemo, useEffect } from 'react';
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
  trades: Trade[];
}

const badges: Badge[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Complete your first trade',
    icon: '🎯',
    condition: (trades) => trades.length >= 1,
    rarity: 'common',
  },
  {
    id: 'ten_trades',
    name: 'Decathlon',
    description: 'Complete 10 trades',
    icon: '🔟',
    condition: (trades) => trades.length >= 10,
    rarity: 'common',
  },
  {
    id: 'hundred_trades',
    name: 'Centaur',
    description: 'Complete 100 trades',
    icon: '💯',
    condition: (trades) => trades.length >= 100,
    rarity: 'rare',
  },
  {
    id: 'five_wins',
    name: 'Winning Streak',
    description: 'Get 5 consecutive wins',
    icon: '🔥',
    condition: (trades) => {
      let consecutiveWins = 0;
      for (let i = 0; i < trades.length; i++) {
        if (trades[i].hasil === 'WIN') {
          consecutiveWins++;
          if (consecutiveWins >= 5) return true;
        } else {
          consecutiveWins = 0;
        }
      }
      return false;
    },
    rarity: 'epic',
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: '100% Win Rate in a single day',
    icon: '💪',
    condition: (trades) => {
      const today = new Date().toISOString().split('T')[0];
      const todayTrades = trades.filter((t) => t.tanggal.split('T')[0] === today);
      return todayTrades.length >= 3 && todayTrades.every((t) => t.hasil === 'WIN');
    },
    rarity: 'epic',
  },
  {
    id: 'profit_warrior',
    name: 'Profit Warrior',
    description: 'Achieve 75% Win Rate',
    icon: '💰',
    condition: (trades) => {
      if (trades.length < 10) return false;
      const wins = trades.filter((t) => t.hasil === 'WIN').length;
      return (wins / trades.length) * 100 >= 75;
    },
    rarity: 'epic',
  },
  {
    id: 'consistent',
    name: 'Consistent Trader',
    description: 'Trade for 7 consecutive days',
    icon: '📅',
    condition: (trades) => {
      if (trades.length === 0) return false;
      const dates = [...new Set(trades.map((t) => t.tanggal.split('T')[0]))].sort();
      let consecutive = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          consecutive++;
          if (consecutive >= 7) return true;
        } else {
          consecutive = 1;
        }
      }
      return false;
    },
    rarity: 'rare',
  },
  {
    id: 'master_trader',
    name: 'Master Trader',
    description: '80% Win Rate on 50+ trades',
    icon: '👑',
    condition: (trades) => {
      if (trades.length < 50) return false;
      const wins = trades.filter((t) => t.hasil === 'WIN').length;
      return (wins / trades.length) * 100 >= 80;
    },
    rarity: 'legendary',
  },
  {
    id: 'big_pips',
    name: 'Big Pips Hunter',
    description: 'Land a 100+ pip trade',
    icon: '📈',
    condition: (trades) => trades.some((t) => t.pip >= 100),
    rarity: 'rare',
  },
  {
    id: 'resilient',
    name: 'Resilient Trader',
    description: 'Recover from a 5 loss streak',
    icon: '💎',
    condition: (trades) => {
      let consecutiveLosses = 0;
      for (let i = 0; i < trades.length; i++) {
        if (trades[i].hasil === 'LOSS') {
          consecutiveLosses++;
        } else if (consecutiveLosses >= 5) {
          return true;
        } else {
          consecutiveLosses = 0;
        }
      }
      return false;
    },
    rarity: 'legendary',
  },
];

const rarityColors: Record<string, string> = {
  common: 'bg-gray-500/20 border-gray-500 text-gray-400',
  rare: 'bg-blue-500/20 border-blue-500 text-blue-400',
  epic: 'bg-purple-500/20 border-purple-500 text-purple-400',
  legendary: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
};

export default function Achievements({ trades }: AchievementsProps) {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mpt_unlocked_badges');
    if (saved) {
      setUnlockedBadges(JSON.parse(saved));
    }
  }, []);

  const newUnlockedBadges = useMemo(() => {
    return badges.filter((badge) => badge.condition(trades)).map((b) => b.id);
  }, [trades]);

  useEffect(() => {
    const added = newUnlockedBadges.filter((b) => !unlockedBadges.includes(b));
    if (added.length > 0) {
      const updated = [...unlockedBadges, ...added];
      setUnlockedBadges(updated);
      localStorage.setItem('mpt_unlocked_badges', JSON.stringify(updated));
    }
  }, [newUnlockedBadges]);

  const stats = useMemo(() => {
    const wins = trades.filter((t) => t.hasil === 'WIN').length;
    const losses = trades.filter((t) => t.hasil === 'LOSS').length;
    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
    const totalPips = trades.reduce((acc, t) => acc + (t.hasil === 'WIN' ? t.pip : -Math.abs(t.pip)), 0);

    return { wins, losses, totalTrades, winRate, totalPips };
  }, [trades]);

  const displayBadges = badges.filter((b) => unlockedBadges.includes(b.id));
  const lockedBadges = badges.filter((b) => !unlockedBadges.includes(b.id));

  return (
    <div className="space-y-8">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border-2 border-blue-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Trades</p>
              <p className="text-3xl font-bold text-blue-400">{stats.totalTrades}</p>
            </div>
            <Trophy size={32} className="text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border-2 border-green-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Win Rate</p>
              <p className="text-3xl font-bold text-green-400">{stats.winRate}%</p>
            </div>
            <TrendingUp size={32} className="text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border-2 border-yellow-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Pips</p>
              <p className={`text-3xl font-bold ${stats.totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalPips}
              </p>
            </div>
            <Zap size={32} className="opacity-50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border-2 border-purple-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Badges</p>
              <p className="text-3xl font-bold text-purple-400">{unlockedBadges.length}</p>
            </div>
            <Star size={32} className="text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Unlocked Badges */}
      {displayBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Award size={24} />
            Badges Unlocked ({displayBadges.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayBadges.map((badge) => (
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

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-400 mb-4">🔒 Locked Badges ({lockedBadges.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="border-2 border-slate-600 bg-slate-800/30 rounded-xl p-4 text-center opacity-50 transition-all hover:opacity-75"
              >
                <div className="text-4xl mb-2 filter grayscale">{badge.icon}</div>
                <h4 className="font-bold mb-1 text-slate-400">{badge.name}</h4>
                <p className="text-sm text-slate-500">{badge.description}</p>
                <div className="mt-2 text-xs text-slate-600 capitalize">{badge.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progression Tips */}
      {badges.length - unlockedBadges.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-blue-500 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4">💡 Next Milestones</h3>
          <div className="space-y-3">
            {lockedBadges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="flex items-start gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-semibold text-white">{badge.name}</p>
                  <p className="text-sm text-slate-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Badges Unlocked */}
      {unlockedBadges.length === badges.length && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border-2 border-yellow-500 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">👑</p>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">Master Warrior!</h3>
          <p className="text-slate-300">Congratulations! You've unlocked all badges! 🎉</p>
        </div>
      )}
    </div>
  );
}
