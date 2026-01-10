'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUp, ArrowDown, Zap, Trophy, Medal, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ArkaMascotFeedback } from '@/components/ArkaMascotFeedback';
import { LeaderboardSearch } from '@/components/leaderboard/LeaderboardSearch';
import { RankBadgeCompact } from '@/components/leaderboard/RankBadge';
import { Top10Celebration } from '@/components/leaderboard/Top10Celebration';
import FounderShowcase from '@/components/leaderboard/FounderShowcase';
import Image from 'next/image';

type Period = 'all' | 'weekly' | 'monthly';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  email?: string;
  whatsapp?: string;
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
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [viewMode, setViewMode] = useState<'top100' | 'all'>('top100');
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [showTop10Celebration, setShowTop10Celebration] = useState(false);

  // Founder profile - Data from about page
  const founderProfile: FounderProfile = {
    name: 'Deden Hadiguna',
    title: '👨‍🏫 Founder & Head Educator',
    description: 'Transforming Traders into Disciplined Plan Warriors. Founder of MPT Academy (Mindset Plan Trader) - mengajarkan trader lain untuk bertahan dan berkembang di market melalui mindset yang solid, plan yang jelas, dan risk management yang ketat.',
    expertise: ['Mindset Development', 'Risk Management', 'Price Action Trading', 'Technical Analysis', 'Trading Psychology', 'XAUUSD Specialization'],
    stats: [
      { label: 'Traders Educated', value: '470+' },
      { label: 'Trading Experience', value: '2+ Years Professional' },
      { label: 'Focus Instruments', value: 'XAUUSD, Major Forex' },
      { label: 'Core Values', value: 'Discipline • Precision • Humility' }
    ]
  };

  useEffect(() => {
    // Load leaderboard for all users
    // (API will filter to only show WARRIOR users, but admin/super admin can view)
    if (!authLoading) {
      fetchLeaderboard();
    }
  }, [authLoading]);

  useEffect(() => {
    // Update filtered leaderboard when main leaderboard changes
    applyFilters(leaderboard, searchQuery, period);
  }, [leaderboard]);

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
        applyFilters(data.leaderboard, searchQuery, period);
        
        // Find user's rank
        if (user) {
          const foundUserEntry = data.leaderboard.find((entry: LeaderboardEntry) => entry.userId === user.id);
          if (foundUserEntry) {
            setUserRank(foundUserEntry.rank);
            setUserEntry(foundUserEntry);
            
            // Check if user just entered Top 10
            if (foundUserEntry.rank <= 10) {
              const previousWasInTop10 = foundUserEntry.previousRank !== null && foundUserEntry.previousRank <= 10;
              const justEnteredTop10 = foundUserEntry.previousRank !== null && foundUserEntry.previousRank > 10;
              
              // Show celebration if user is new to Top 10 or improved rank within Top 10
              if (justEnteredTop10 || (foundUserEntry.rankTrend === 'UP' && foundUserEntry.rank <= 10)) {
                // Check localStorage to avoid showing multiple times
                const lastCelebrationTime = localStorage.getItem(`top10-celebration-${user.id}`);
                const now = Date.now();
                if (!lastCelebrationTime || now - parseInt(lastCelebrationTime) > 3600000) { // 1 hour
                  setTimeout(() => setShowTop10Celebration(true), 500);
                  localStorage.setItem(`top10-celebration-${user.id}`, now.toString());
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (entries: LeaderboardEntry[], query: string, filterPeriod: Period) => {
    let filtered = [...entries];
    
    // Search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.userName.toLowerCase().includes(lowerQuery) ||
        entry.whatsapp?.includes(query)
      );
    }
    
    // Period filter (would need API support for weekly/monthly data)
    // For now, show all - period filter would require leaderboard-history container queries
    
    // IMPORTANT: Always sort by rank to maintain consistency with podium display
    filtered.sort((a, b) => a.rank - b.rank);
    
    setFilteredLeaderboard(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(leaderboard, query, period);
  };

  const handleFilterChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    applyFilters(leaderboard, searchQuery, newPeriod);
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

  // Top 3 Podium - explicitly sort by rank to ensure consistency
  const top3 = [...leaderboard]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚔️ WARRIOR LEADERBOARD</h1>
          <p className="text-gray-400">Kompetisi Kualitas Trading - Mindset, Plan, Execution</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <LeaderboardSearch 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            defaultPeriod={period}
          />
        </div>

        {/* Founder Showcase Section */}
        <FounderShowcase
          name={founderProfile.name}
          title={founderProfile.title}
          description={founderProfile.description}
          expertise={founderProfile.expertise}
          stats={founderProfile.stats}
          showRank={true}
        />

        {/* User Position Card */}
        {user && userRank && (
          <div className="mb-8 relative">
            {/* Glow effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-amber-600/20 to-transparent rounded-2xl blur-2xl opacity-60" />
            
            <Card className="relative bg-gradient-to-r from-orange-500/25 to-amber-500/15 border-2 border-orange-500/60 p-8 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-bold mb-2 uppercase tracking-wider">YOUR POSITION</p>
                  <h2 className="text-4xl font-black text-orange-400">Rank #{userRank}</h2>
                </div>
                <div className="text-right">
                  <p className="text-orange-300 text-sm font-bold mb-2 uppercase tracking-wider">TOTAL POINTS</p>
                  <p className="text-4xl font-black text-orange-400">
                    {leaderboard.find(e => e.userId === user.id)?.totalPoints || 0} pts
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 TOP 3 WARRIORS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Podium Background Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-500/5 rounded-2xl" />
              </div>

              {/* 2nd Place */}
              {top3[1] && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/10 rounded-xl blur-xl" />
                  <Card className="relative bg-gradient-to-br from-gray-600/30 via-slate-700/20 to-gray-700/20 border-2 border-gray-500/40 p-6 text-center hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300">
                    <div className="text-5xl mb-4">🥈</div>
                    <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-widest">2nd Place</p>
                    <h3 className="text-xl font-bold text-white mb-3">{top3[1].userName}</h3>
                    <p className="text-gray-300 font-bold mb-4 text-lg">{top3[1].totalPoints} pts</p>
                    <Badge className={getBadgeColor(top3[1].badge)}>{top3[1].badge}</Badge>
                  </Card>
                </div>
              )}

              {/* 1st Place - Champion */}
              {top3[0] && (
                <div className="relative md:scale-110 md:z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/40 via-amber-500/20 to-orange-500/20 rounded-xl blur-2xl" />
                  <Card className="relative bg-gradient-to-br from-yellow-500/35 via-amber-500/25 to-orange-500/15 border-3 border-yellow-500/60 p-8 text-center shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300">
                    <div className="text-6xl mb-4 drop-shadow-lg">👑</div>
                    <p className="text-yellow-300 text-xs font-black mb-2 uppercase tracking-widest">Champion</p>
                    <h3 className="text-2xl font-black text-yellow-300 mb-4">{top3[0].userName}</h3>
                    <p className="text-yellow-400 font-black mb-4 text-2xl">{top3[0].totalPoints} pts</p>
                    <Badge className={getBadgeColor(top3[0].badge)}>{top3[0].badge}</Badge>
                  </Card>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-700/10 rounded-xl blur-xl" />
                  <Card className="relative bg-gradient-to-br from-orange-600/30 via-amber-700/20 to-orange-700/20 border-2 border-orange-600/40 p-6 text-center hover:shadow-lg hover:shadow-orange-600/20 transition-all duration-300">
                    <div className="text-5xl mb-4">🥉</div>
                    <p className="text-orange-400 text-xs font-bold mb-1 uppercase tracking-widest">3rd Place</p>
                    <h3 className="text-xl font-bold text-white mb-3">{top3[2].userName}</h3>
                    <p className="text-orange-300 font-bold mb-4 text-lg">{top3[2].totalPoints} pts</p>
                    <Badge className={getBadgeColor(top3[2].badge)}>{top3[2].badge}</Badge>
                  </Card>
                </div>
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
                {filteredLeaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-white/5 transition-all duration-300 ${
                      user?.id === entry.userId
                        ? 'bg-gradient-to-r from-orange-600/40 via-orange-500/30 to-transparent border-l-4 border-l-orange-500 hover:from-orange-600/50 hover:via-orange-500/40 shadow-lg shadow-orange-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                        <span className={`font-bold ${user?.id === entry.userId ? 'text-orange-400 text-lg' : 'text-white'}`}>
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className={`font-semibold flex items-center gap-2 ${user?.id === entry.userId ? 'text-orange-300 text-base' : 'text-white'}`}>
                            {entry.userName}
                            {user?.id === entry.userId && <span className="text-xs px-2 py-1 bg-orange-500/40 text-orange-200 rounded-full border border-orange-500/60">You</span>}
                            <RankBadgeCompact badge={entry.badge as any} />
                          </p>
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
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getBadgeColor(entry.badge)}>{entry.badge}</Badge>
                    </td>
                    <td className={`px-6 py-4 text-right ${user?.id === entry.userId ? 'font-black text-orange-300' : 'font-bold text-white'}`}>
                      <span className="text-lg">{entry.totalPoints}</span>
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
            {filteredLeaderboard.map((entry) => (
              <Card
                key={entry.userId}
                className={`p-4 transition-all duration-300 ${
                  user?.id === entry.userId
                    ? 'bg-gradient-to-r from-orange-600/40 to-orange-500/20 border-2 border-orange-500/60 shadow-lg shadow-orange-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                    <span className={`font-bold ${user?.id === entry.userId ? 'text-orange-400 text-lg' : 'text-white'}`}>
                      #{entry.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(entry.rankTrend)}
                    <span className={entry.winRate >= 70 ? 'text-green-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {entry.winRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className={`font-semibold flex items-center gap-2 mb-2 ${user?.id === entry.userId ? 'text-orange-300' : 'text-white'}`}>
                  {entry.userName}
                  {user?.id === entry.userId && <span className="text-xs px-2 py-1 bg-orange-500/40 text-orange-200 rounded-full border border-orange-500/60">You</span>}
                  <RankBadgeCompact badge={entry.badge as any} />
                </p>
                <p className="text-gray-500 text-xs mb-3">
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
                  <span className={`font-bold text-lg ${user?.id === entry.userId ? 'text-orange-300' : 'text-cyan-400'}`}>
                    {entry.totalPoints} pts
                  </span>
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

      {/* Top 10 Celebration - Show when user enters Top 10 */}
      {user && userEntry && (
        <Top10Celebration
          show={showTop10Celebration}
          userName={user.name}
          rank={userEntry.rank}
          points={userEntry.totalPoints}
          previousRank={userEntry.previousRank}
          onClose={() => setShowTop10Celebration(false)}
        />
      )}
    </div>
  );
}
