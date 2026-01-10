/**
 * LeaderboardWithAutoUpdate Component
 * Real-time leaderboard display with auto-update on events
 * Shows top 10 users with score breakdown
 */

'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalScore: number;
  quizScore: number;
  chatActivityScore: number;
  streakBonus: number;
  achievementBonus: number;
  rankChange: number;
  isTopThree: boolean;
  weekNumber: number;
  period: string;
}

interface LeaderboardWithAutoUpdateProps {
  userId?: string;
  refreshInterval?: number; // milliseconds, 0 to disable
  limit?: number;
}

/**
 * LeaderboardWithAutoUpdate Component
 */
export function LeaderboardWithAutoUpdate({
  userId,
  refreshInterval = 30000, // 30 seconds
  limit = 10,
}: LeaderboardWithAutoUpdateProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  /**
   * Fetch leaderboard data
   */
  const fetchLeaderboard = async () => {
    try {
      setError(null);

      const response = await fetch('/api/leaderboard', {
        headers: userId ? { 'x-user-id': userId } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const { data } = await response.json();
      setEntries(data.entries?.slice(0, limit) || []);

      // Find current user rank
      if (userId && data.entries) {
        const userEntry = data.entries.find((e: LeaderboardEntry) => e.userId === userId);
        setUserRank(userEntry || null);
      }

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [userId]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchLeaderboard, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, userId]);

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Loading leaderboard...
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-500" size={28} />
            Weekly Leaderboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Updated {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* User's current rank (if logged in) */}
      {userRank && (
        <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Your Position</p>
              <p className="text-2xl font-bold text-white">#{userRank.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-400">
                {userRank.totalScore}
              </p>
              <p className="text-xs text-slate-400">Total Points</p>
            </div>
            {userRank.rankChange !== 0 && (
              <div
                className={`flex items-center gap-1 ${
                  userRank.rankChange > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {userRank.rankChange > 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span className="font-bold">
                  {Math.abs(userRank.rankChange)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                Rank
              </th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                Player
              </th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                Quiz
              </th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                Chat
              </th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                Streak
              </th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                Achieve
              </th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">
                Total
              </th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                  entry.isTopThree ? 'bg-yellow-500/10' : ''
                } ${
                  userId === entry.userId ? 'bg-blue-500/10 border-b-2 border-blue-500' : ''
                }`}
              >
                {/* Rank */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {entry.isTopThree && (
                      <Trophy
                        size={16}
                        className={
                          entry.rank === 1
                            ? 'text-yellow-500'
                            : entry.rank === 2
                            ? 'text-gray-400'
                            : 'text-orange-600'
                        }
                      />
                    )}
                    <span className="font-bold text-white text-lg">
                      #{entry.rank}
                    </span>
                  </div>
                </td>

                {/* Player Name */}
                <td className="py-3 px-4">
                  <span className="font-medium text-white">
                    {entry.userName}
                  </span>
                </td>

                {/* Quiz Score */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-blue-500/30 px-2 py-1 rounded text-sm text-blue-300 font-medium">
                    {entry.quizScore}
                  </span>
                </td>

                {/* Chat Activity */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-green-500/30 px-2 py-1 rounded text-sm text-green-300 font-medium">
                    {entry.chatActivityScore}
                  </span>
                </td>

                {/* Streak Bonus */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-orange-500/30 px-2 py-1 rounded text-sm text-orange-300 font-medium">
                    {entry.streakBonus}
                  </span>
                </td>

                {/* Achievement Bonus */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-purple-500/30 px-2 py-1 rounded text-sm text-purple-300 font-medium">
                    {entry.achievementBonus}
                  </span>
                </td>

                {/* Total Score */}
                <td className="py-3 px-4 text-right">
                  <span className="text-lg font-bold text-white">
                    {entry.totalScore}
                  </span>
                </td>

                {/* Rank Change */}
                <td className="py-3 px-4 text-center">
                  {entry.rankChange !== 0 ? (
                    <div
                      className={`flex items-center justify-center gap-1 font-bold ${
                        entry.rankChange > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {entry.rankChange > 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span>{Math.abs(entry.rankChange)}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score Breakdown Legend */}
      <div className="bg-slate-800/30 rounded-lg p-4 text-sm text-slate-400">
        <p className="font-medium text-slate-300 mb-2">Score Breakdown (0-100 total):</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500/50"></div>
            <span>Quiz: 0-40</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/50"></div>
            <span>Chat: 0-30</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500/50"></div>
            <span>Streak: 0-20</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500/50"></div>
            <span>Achieve: 0-10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
