/**
 * User Profile Header Component
 * Displays user avatar, name, and warrior ID across the app
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, LogOut } from 'lucide-react';
import { useUserProfileStore, useUserRole, useBadgeLevel } from '@/stores/userProfileStore';
import { BadgeLevelDisplay } from './BadgeSystem';

interface ProfileHeaderProps {
  showFullInfo?: boolean;
  className?: string;
}

export function ProfileHeader({ showFullInfo = false, className = '' }: ProfileHeaderProps) {
  const router = useRouter();
  const { profile, loadProfile, clearProfile, isLoading } = useUserProfileStore();
  const { isAdmin, isSuperAdmin } = useUserRole();
  const { level } = useBadgeLevel();

  useEffect(() => {
    // Load profile if not already loaded
    if (!profile && !isLoading) {
      loadProfile();
    }
  }, [profile, isLoading, loadProfile]);

  const handleLogout = () => {
    clearProfile();
    localStorage.removeItem('mpt_token');
    router.push('/login');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-24 h-3 bg-slate-700 rounded animate-pulse"></div>
          <div className="w-16 h-2 bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Avatar */}
      <div 
        onClick={navigateToProfile}
        className="relative cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 p-0.5 group-hover:from-sky-400 group-hover:to-purple-500 transition-all">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Badge Level Indicator */}
        {level && (
          <div className="absolute -bottom-1 -right-1">
            <BadgeLevelDisplay level={level} size="sm" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white truncate">
            {profile.displayName || profile.name}
          </p>
          
          {/* Role Badge */}
          {(isAdmin || isSuperAdmin) && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold ${
              isSuperAdmin 
                ? 'bg-purple-900/50 text-purple-300' 
                : 'bg-blue-900/50 text-blue-300'
            }`}>
              <Shield className="w-3 h-3" />
              {isSuperAdmin ? 'FOUNDER' : 'ADMIN'}
            </div>
          )}
        </div>
        
        {showFullInfo && (
          <>
            <p className="text-xs text-gray-400 truncate">{profile.email}</p>
            <p className="text-xs font-mono text-amber-400">{profile.warriorId}</p>
          </>
        )}
        
        {!showFullInfo && (
          <p className="text-xs font-mono text-amber-400">{profile.warriorId}</p>
        )}
      </div>

      {/* Logout Button (optional) */}
      {showFullInfo && (
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
        </button>
      )}
    </div>
  );
}

/**
 * Compact Profile Badge (for sidebar/header)
 */
export function ProfileBadge({ onClick }: { onClick?: () => void }) {
  const { profile } = useUserProfileStore();
  const { level } = useBadgeLevel();

  if (!profile) return null;

  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 p-0.5 hover:from-sky-400 hover:to-purple-500 transition-all cursor-pointer"
    >
      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-gray-400" />
        )}
      </div>
      
      {level && (
        <div className="absolute -bottom-1 -right-1">
          <BadgeLevelDisplay level={level} size="sm" />
        </div>
      )}
    </button>
  );
}

/**
 * Profile Stats Card (for dashboard)
 */
export function ProfileStatsCard() {
  const { profile } = useUserProfileStore();
  const router = useRouter();

  if (!profile) return null;

  return (
    <div 
      onClick={() => router.push('/profile')}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-sky-500/50 transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <ProfileBadge />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">
            {profile.displayName || profile.name}
          </h3>
          <p className="text-xs font-mono text-amber-400">{profile.warriorId}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">Win Rate</p>
          <p className="text-lg font-bold text-emerald-400">{profile.stats.winRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Trades</p>
          <p className="text-lg font-bold text-blue-400">{profile.stats.totalTrades}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Discipline</p>
          <p className="text-lg font-bold text-purple-400">{profile.disciplineScore}</p>
        </div>
      </div>
    </div>
  );
}
