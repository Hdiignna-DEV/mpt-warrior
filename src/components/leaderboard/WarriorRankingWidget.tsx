'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, ArrowRight, Zap, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RankBadgeCompact } from './RankBadge';

interface TopUser {
  userId: string;
  userName: string;
  totalPoints: number;
  badge: string;
  rank: number;
  avatar?: string;
}

interface WidgetData {
  top3: TopUser[];
  userRank: number | null;
  userPoints: number | null;
  userBadge?: string;
  totalWarriors?: number;
}

export function WarriorRankingWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<WidgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation when data loads
    if (data) {
      setAnimate(true);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('mpt_token');
        const response = await fetch('/api/leaderboard?limit=3', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          const top3 = result.leaderboard?.slice(0, 3) || [];
          
          // Find user's rank if WARRIOR
          let userRank = null;
          let userPoints = null;
          let userBadge = undefined;
          if (user && user.role === 'WARRIOR') {
            const allLeaderboard = await fetch(`/api/leaderboard?limit=100`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json());
            
            const userEntry = allLeaderboard.leaderboard?.find((e: any) => e.userId === user.id);
            if (userEntry) {
              userRank = userEntry.rank;
              userPoints = userEntry.totalPoints;
              userBadge = userEntry.badge;
            }
          }

          setData({
            top3,
            userRank,
            userPoints,
            userBadge,
            totalWarriors: result.total || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching ranking widget data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-400 animate-bounce" />
          <h3 className="text-lg font-bold text-white">Warrior Ranking</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-white/5 rounded"></div>
          <div className="h-12 bg-white/5 rounded"></div>
          <div className="h-12 bg-white/5 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!data || !data.top3 || data.top3.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Warrior Ranking</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 mb-3">⚠️ No ranking data yet</p>
          <p className="text-xs text-gray-500">Complete quizzes to earn points and climb the rankings!</p>
        </div>
      </Card>
    );
  }

  const medals = ['👑', '🥈', '🥉'];
  const podiumColors = [
    'from-yellow-500/30 to-amber-500/20 border-yellow-500/50',
    'from-gray-500/20 to-slate-600/10 border-gray-500/30',
    'from-orange-600/20 to-amber-700/10 border-orange-600/30'
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-slate-800/20 to-blue-500/10 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Warrior Ranking</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
            Top {data.totalWarriors || 0}
          </span>
        </div>

        {/* Top 3 Mini Podium */}
        <div className="space-y-2 mb-6">
          {data.top3.map((user, index) => (
            <div
              key={user.userId}
              className={`group flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${podiumColors[index]} border transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-102`}
              style={{
                animationDelay: animate ? `${index * 100}ms` : '0ms',
                animation: animate ? `slideIn 0.5s ease-out forwards` : 'none'
              }}
            >
              <span className="text-2xl transform group-hover:scale-125 transition-transform">{medals[index]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                  {user.userName}
                  <RankBadgeCompact badge={user.badge as any} />
                </p>
                <p className="text-xs text-gray-400">{user.totalPoints.toLocaleString()} pts</p>
              </div>
              <Zap className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* User Position Card - Enhanced */}
        {data.userRank && (
          <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-transparent border border-orange-500/40 rounded-lg p-4 mb-6 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            <p className="text-xs text-orange-300 font-bold mb-2 uppercase tracking-wider">Your Position</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-orange-400">#{data.userRank}</p>
                {data.userRank <= 10 && <p className="text-xs text-green-400 font-bold mt-1">🏆 In Top 10!</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-orange-300">{data.userPoints?.toLocaleString()}</p>
                <p className="text-xs text-gray-400">pts</p>
              </div>
            </div>
          </div>
        )}

        {/* View All Button */}
        <Button
          onClick={() => router.push('/leaderboard')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
        >
          View Full Rankings
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Footer Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          📊 Updated in real-time
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </Card>
  );
}
