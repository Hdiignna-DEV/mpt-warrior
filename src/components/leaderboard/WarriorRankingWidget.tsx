'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

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
}

export function WarriorRankingWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<WidgetData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-400" />
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

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-400" />
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
          <p className="text-sm text-gray-400">Loading ranking data...</p>
        </div>
      </Card>
    );
  }

  const medals = ['👑', '🥈', '🥉'];

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Warrior Ranking</h3>
        </div>
      </div>

      {/* Top 3 */}
      <div className="space-y-2 mb-6">
        {data.top3.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-2xl">{medals[index]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.userName}</p>
              <p className="text-xs text-gray-400">{user.totalPoints} pts</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Position */}
      {data.userRank && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-400 mb-2">YOUR POSITION</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-400">#{data.userRank}</p>
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
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        View All Rankings
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-4">
        📊 Updated hourly
      </p>
    </Card>
  );
}
