/**
 * Warrior Profile Page
 * Exclusive profile system with stats, badges, and referrals
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Shield, 
  TrendingUp, 
  Target, 
  Award,
  Edit2,
  Share2,
  Copy,
  CheckCircle,
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BadgeDisplay, BadgeLevelDisplay, BadgeGrid, getAllBadges } from '@/components/BadgeSystem';
import { CommanderArkaFullDisplay, type CommanderArkaPose } from '@/components/ChatUIEnhancers';
import { Badge, UserStats, ProfileSettings } from '@/types';
import { toast } from '@/utils/toast';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  warriorId: string;
  displayName?: string;
  currentBadgeLevel: 'RECRUIT' | 'WARRIOR' | 'VETERAN';
  badges: Badge[];
  disciplineScore: number;
  profileSettings: ProfileSettings;
  referralCode?: string;
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
  };
  stats: UserStats;
}

export default function ProfilePage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopiedCode(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-400">Profile not found</p>
        </Card>
      </div>
    );
  }

  const allBadges = getAllBadges();
  const lockedBadges = allBadges.filter(
    badge => !profile.badges.find(b => b.type === badge.type)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Badge Level Overlay */}
              <div className="absolute -bottom-2 -right-2">
                <BadgeLevelDisplay level={profile.currentBadgeLevel} size="sm" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 mb-2">
                {profile.displayName || profile.name}
              </h1>
              <p className="text-lg text-gray-400 mb-1">{profile.email}</p>
              <p className="text-sm font-mono text-amber-400 mb-4">
                {profile.warriorId}
              </p>

              {/* Personal Goal */}
              {profile.profileSettings.personalGoal && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-400 mb-1">Personal Trading Goal</p>
                  <p className="text-white italic">"{profile.profileSettings.personalGoal}"</p>
                </div>
              )}

              {/* Edit Button */}
              <button
                onClick={() => router.push('/profile/edit')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Win Rate */}
          <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-700/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-3xl font-black text-emerald-400">
                  {profile.stats.winRate}%
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {profile.stats.wins} wins / {profile.stats.totalTrades} trades
            </p>
          </Card>

          {/* Total Trades */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-700/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-3xl font-black text-blue-400">
                  {profile.stats.totalTrades}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {profile.stats.losses} losses
            </p>
          </Card>

          {/* Discipline Score */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-700/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Discipline Score</p>
                <p className="text-3xl font-black text-purple-400">
                  {profile.disciplineScore}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${Math.min((profile.disciplineScore / 1000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max: 1000 points
              </p>
            </div>
          </Card>
        </div>

        {/* Extended Trading Stats */}
        {profile.stats.totalTrades > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total P/L */}
            <Card className={`p-6 ${
              (profile.stats.totalProfitLoss || 0) >= 0 
                ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-700/30'
                : 'bg-gradient-to-br from-red-900/20 to-red-950/20 border-red-700/30'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className={`w-6 h-6 ${
                  (profile.stats.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`} />
                <div>
                  <p className="text-xs text-gray-400">Total P/L</p>
                  <p className={`text-2xl font-black ${
                    (profile.stats.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {(profile.stats.totalProfitLoss || 0) >= 0 ? '+' : ''}
                    {(profile.stats.totalProfitLoss || 0).toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Best Trade */}
            <Card className="bg-gradient-to-br from-green-900/20 to-green-950/20 border-green-700/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Best Trade</p>
                  <p className="text-2xl font-black text-green-400">
                    +{(profile.stats.bestTrade || 0).toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Worst Trade */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border-orange-700/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-400">Worst Trade</p>
                  <p className="text-2xl font-black text-orange-400">
                    {(profile.stats.worstTrade || 0).toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Average Risk */}
            <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-950/20 border-cyan-700/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                <div>
                  <p className="text-xs text-gray-400">Avg Risk</p>
                  <p className="text-2xl font-black text-cyan-400">
                    {(profile.stats.averageRisk || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Badges Section */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black text-white">Achievements</h2>
          </div>
          
          <BadgeGrid badges={profile.badges} lockedBadges={lockedBadges} />

          {profile.badges.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Start trading to earn badges!</p>
            </div>
          )}
        </Card>

        {/* Commander Arka Showcase */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-amber-500/30 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🫡</span>
            <h2 className="text-2xl font-black text-white">Meet Commander Arka</h2>
          </div>
          
          <p className="text-slate-300 mb-8 text-sm md:text-base">
            Your AI Mentor, a Level 4 Commander from the MPT hierarchy. Commander Arka adapts their demeanor based on different situations to guide your trading journey.
          </p>

          {/* All 5 Poses Showcase */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {(['onboarding', 'vision', 'victory', 'warning', 'empty'] as const).map((pose) => (
              <div key={pose} className="flex flex-col items-center gap-3">
                <div className="bg-slate-900/50 rounded-lg p-4 md:p-6 w-full flex items-center justify-center min-h-[160px] md:min-h-[200px]">
                  <CommanderArkaFullDisplay 
                    pose={pose}
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-amber-400 text-sm md:text-base capitalize">{pose}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {pose === 'onboarding' && '🫡 Welcome Mode'}
                    {pose === 'vision' && '📸 Analysis Mode'}
                    {pose === 'victory' && '🎖️ Victory Mode'}
                    {pose === 'warning' && '⚠️ Alert Mode'}
                    {pose === 'empty' && '🤔 Thinking'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-200">
              <strong>💡 Pro Tip:</strong> Watch Commander Arka's pose change during your chat sessions. The pose indicates their current mode of operation and the type of guidance you'll receive.
            </p>
          </div>
        </Card>

        {/* Referral Box (Veteran Only) */}
        {profile.currentBadgeLevel === 'VETERAN' && profile.referralCode && (
          <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border-amber-700/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-black text-white">Referral Program</h2>
            </div>

            {/* Referral Code */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-mono font-bold text-amber-400">
                  {profile.referralCode}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Referral Stats */}
            {profile.referralStats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {profile.referralStats.totalReferrals}
                  </p>
                  <p className="text-xs text-gray-400">Total Referrals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {profile.referralStats.activeReferrals}
                  </p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">
                    Rp {profile.referralStats.totalEarnings.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-400">Total Earnings</p>
                </div>
              </div>
            )}
          </Card>
        )}

      </div>
    </div>
  );
}
