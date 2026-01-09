'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUp, ArrowDown, Zap, Trophy, Medal, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ArkaMascotFeedback } from '@/components/ArkaMascotFeedback';
import Image from 'next/image';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  email?: string; // Optional, kept for backward compatibility
  whatsapp?: string; // WhatsApp contact
  totalPoints: number;
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  badge: string;
  winRate: number;
  rank: number;
  previousRank: number | null;
  rankTrend: 'UP' | 'DOWN' | 'STABLE';
}

interface FounderProfile {
  name: string;
  title: string;
  description: string;
  expertise: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [viewMode, setViewMode] = useState<'top100' | 'all'>('top100');

  // Founder profile
  const founderProfile: FounderProfile = {
    name: 'Deden (Founder & Head Educator)',
    title: '🎓 Mentor Legendaris',
    description: 'Founder & Head Educator MPT Warrior Academy - Mentor berpengalaman dalam mengajarkan Mindset, Plan, dan Risk Management untuk trader profesional.',
    expertise: ['Trading Psychology', 'Risk Management', 'Technical Analysis', 'Discipline Training', 'Trading Mindset'],
    stats: [
      { label: 'Students Mentored', value: '1000+' },
      { label: 'Trading Experience', value: '15+ Years' },
      { label: 'Win Rate', value: '78%' },
      { label: 'Community Rating', value: '4.9/5' }
    ]
  };

  useEffect(() => {
    // Load leaderboard for all users
    // (API will filter to only show WARRIOR users, but admin/super admin can view)
    if (!authLoading) {
      fetchLeaderboard();
    }
  }, [authLoading]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/leaderboard?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        
        // If leaderboard is empty, auto-populate from user data
        if (!data.leaderboard || data.leaderboard.length === 0) {
          console.log('📊 Leaderboard empty, auto-populating from user data...');
          try {
            const populateResponse = await fetch('/api/leaderboard/auto-populate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
            
            if (populateResponse.ok) {
              const populateData = await populateResponse.json();
              console.log(`✅ Auto-populated: ${populateData.entriesCreated} entries created`);
              // Retry fetch after population
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              return;
            }
          } catch (populateError) {
            console.warn('Could not auto-populate:', populateError);
          }
        }
        
        setLeaderboard(data.leaderboard);
        
        // Find user's rank
        if (user) {
          const foundUserEntry = data.leaderboard.find((entry: LeaderboardEntry) => entry.userId === user.id);
          if (foundUserEntry) {
            setUserRank(foundUserEntry.rank);
            setUserEntry(foundUserEntry);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Legendary Mentor':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Commander':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Elite Warrior':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⚔️';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'DOWN':
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="text-center text-white">Loading leaderboard...</div>
      </div>
    );
  }

  // Top 3 Podium
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚔️ WARRIOR LEADERBOARD</h1>
          <p className="text-gray-400">Kompetisi Kualitas Trading - Mindset, Plan, Execution</p>
        </div>

        {/* Founder Profile Section */}
        <Card className="bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-600/30 border-purple-500/50 mb-8 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Founder Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-yellow-300">{founderProfile.name}</h2>
              </div>
              <p className="text-2xl text-purple-300 font-semibold mb-3">{founderProfile.title}</p>
              <p className="text-gray-300 leading-relaxed mb-4">{founderProfile.description}</p>
              
              {/* Expertise */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm font-semibold mb-2">Areas of Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {founderProfile.expertise.map((skill, idx) => (
                    <Badge key={idx} className="bg-purple-500/30 text-purple-200 border-purple-500/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              {founderProfile.stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* User Position Card */}
        {user && userRank && (
          <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/50 mb-8 p-6 glow-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">YOUR POSITION</p>
                <h2 className="text-3xl font-bold text-orange-400">Rank #{userRank}</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">TOTAL POINTS</p>
                <p className="text-3xl font-bold text-orange-400">
                  {leaderboard.find(e => e.userId === user.id)?.totalPoints || 0} pts
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">🏆 TOP 3</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              {top3[1] && (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <p className="text-gray-400 text-sm mb-1">2nd Place</p>
                  <h3 className="text-xl font-bold text-white mb-2">{top3[1].userName}</h3>
                  <p className="text-blue-400 font-bold mb-2">{top3[1].totalPoints} pts</p>
                  <Badge className={getBadgeColor(top3[1].badge)}>{top3[1].badge}</Badge>
                </Card>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <Card className="bg-gradient-to-br from-yellow-500/30 to-amber-500/20 border-yellow-500/50 p-6 text-center md:scale-110 md:z-10">
                  <div className="text-5xl mb-2">👑</div>
                  <p className="text-gray-300 text-sm mb-1 font-bold">1st PLACE</p>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-2">{top3[0].userName}</h3>
                  <p className="text-yellow-400 font-bold mb-2 text-lg">{top3[0].totalPoints} pts</p>
                  <Badge className={getBadgeColor(top3[0].badge)}>{top3[0].badge}</Badge>
                </Card>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <p className="text-gray-400 text-sm mb-1">3rd Place</p>
                  <h3 className="text-xl font-bold text-white mb-2">{top3[2].userName}</h3>
                  <p className="text-amber-400 font-bold mb-2">{top3[2].totalPoints} pts</p>
                  <Badge className={getBadgeColor(top3[2].badge)}>{top3[2].badge}</Badge>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">Warrior</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-semibold">Badge</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-semibold">Points</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-semibold">Quiz</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-semibold">Win Rate</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-white/5 transition-colors ${
                      user?.id === entry.userId
                        ? 'bg-orange-500/20 hover:bg-orange-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                        <span className="font-bold text-white">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">{entry.userName}</p>
                        <p className="text-gray-500 text-sm">
                          {entry.whatsapp ? (
                            <a 
                              href={`https://wa.me/${entry.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300"
                            >
                              💬 {entry.whatsapp}
                            </a>
                          ) : (
                            <span className="text-gray-600">No WhatsApp</span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getBadgeColor(entry.badge)}>{entry.badge}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold text-lg">{entry.totalPoints}</span>
                      <p className="text-gray-500 text-xs">points</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-cyan-400 font-semibold">{entry.quizPoints}</span>
                      <p className="text-gray-500 text-xs">pts</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className={entry.winRate >= 70 ? 'text-green-400' : 'text-amber-400'} >
                          {entry.winRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center">
                      {getTrendIcon(entry.rankTrend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3 p-4">
            {leaderboard.map((entry) => (
              <Card
                key={entry.userId}
                className={`p-4 ${
                  user?.id === entry.userId
                    ? 'bg-orange-500/20 border-orange-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                    <span className="font-bold text-white">#{entry.rank}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(entry.rankTrend)}
                    <span className={entry.winRate >= 70 ? 'text-green-400' : 'text-amber-400'}>
                      {entry.winRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-white font-semibold">{entry.userName}</p>
                <p className="text-gray-500 text-xs mb-2">
                  {entry.whatsapp ? (
                    <a 
                      href={`https://wa.me/${entry.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300"
                    >
                      💬 {entry.whatsapp}
                    </a>
                  ) : (
                    <span className="text-gray-600">No WhatsApp</span>
                  )}
                </p>
                <div className="flex justify-between items-center">
                  <Badge className={getBadgeColor(entry.badge)}>{entry.badge}</Badge>
                  <span className="text-cyan-400 font-bold">{entry.totalPoints} pts</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>📊 Leaderboard updated hourly | Scores based on Quiz, Consistency & Community</p>
        </div>
      </div>

      {/* Arka Mascot Feedback - Show to logged-in user with rank trend */}
      {user && userEntry && (
        <ArkaMascotFeedback
          userName={user.name}
          rankTrend={userEntry.rankTrend}
          currentRank={userEntry.rank}
          previousRank={userEntry.previousRank}
          totalPoints={userEntry.totalPoints}
        />
      )}
    </div>
  );
}
