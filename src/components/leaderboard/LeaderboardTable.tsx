'use client';

import React, { useState, useMemo } from 'react';
import { Medal, Trophy, Star, Zap, TrendingUp, TrendingDown, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface LeaderboardUser {
  userId: string;
  userName: string;
  avatar?: string;
  rank: number;
  totalPoints: number;
  badge: string;
  previousRank?: number | null;
  winRate: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardUser[];
  currentUserId?: string;
  isLoading?: boolean;
  period?: 'weekly' | 'monthly' | 'all';
}

/**
 * Get badge styling based on tier
 */
function getBadgeStyle(badge: string) {
  const styles: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    'Recruit': {
      bg: 'bg-gray-500/20',
      text: 'text-gray-300',
      border: 'border-gray-500/30',
      glow: 'group-hover:shadow-gray-500/20',
    },
    'Elite Warrior': {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      glow: 'group-hover:shadow-yellow-500/20',
    },
    'Commander': {
      bg: 'bg-purple-500/20',
      text: 'text-purple-300',
      border: 'border-purple-500/30',
      glow: 'group-hover:shadow-purple-500/20',
    },
    'Legendary Mentor': {
      bg: 'bg-amber-500/25',
      text: 'text-amber-300',
      border: 'border-amber-500/50',
      glow: 'group-hover:shadow-amber-500/40',
    },
  };

  return styles[badge] || styles['Recruit'];
}

/**
 * Get rank medal emoji
 */
function getRankMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

/**
 * Leaderboard Table Row Component
 */
function LeaderboardRow({
  entry,
  isCurrentUser,
  index,
}: {
  entry: LeaderboardUser;
  isCurrentUser: boolean;
  index: number;
}) {
  const badgeStyle = getBadgeStyle(entry.badge);
  const rankMedal = getRankMedal(entry.rank);
  const rankChange = entry.previousRank ? entry.previousRank - entry.rank : 0;

  return (
    <div
      className={clsx(
        'group relative px-4 py-4 border-b border-slate-700/50 transition-all duration-300 hover:bg-slate-700/30',
        // Highlight current user
        isCurrentUser && 'bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-transparent border-l-4 border-l-orange-500 shadow-lg shadow-orange-500/20',
        // Top 3 special styling
        entry.rank <= 3 && !isCurrentUser && 'bg-slate-700/20',
      )}
    >
      <div className="flex items-center gap-3 md:gap-4">
        {/* Rank Medal */}
        <div className="flex-shrink-0 w-12 text-center">
          {rankMedal ? (
            <div className="text-2xl flex items-center justify-center">{rankMedal}</div>
          ) : (
            <div className="text-lg font-bold text-slate-400">#{entry.rank}</div>
          )}
        </div>

        {/* User Info - Avatar & Name */}
        <div className="flex-shrink-0">
          {entry.avatar ? (
            <Image
              src={entry.avatar}
              alt={entry.userName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {entry.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Username & Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-white truncate text-sm md:text-base">
              {entry.userName}
              {isCurrentUser && (
                <span className="ml-2 inline text-xs px-2 py-1 bg-orange-500/30 text-orange-300 rounded-full border border-orange-500/50">
                  You
                </span>
              )}
            </p>
          </div>
          {/* Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border',
                badgeStyle.bg,
                badgeStyle.text,
                badgeStyle.border,
              )}
            >
              <span className="text-xs">
                {entry.badge === 'Legendary Mentor' && '⚡'}
                {entry.badge === 'Commander' && '🛡️'}
                {entry.badge === 'Elite Warrior' && '⭐'}
                {entry.badge === 'Recruit' && '🔷'}
              </span>
              {entry.badge}
            </span>
          </div>
        </div>

        {/* Points & Stats - Desktop */}
        <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
          {/* Points */}
          <div className="text-right">
            <p className="text-lg font-bold text-white">{entry.totalPoints.toLocaleString('id-ID')}</p>
            <p className="text-xs text-slate-400">pts</p>
          </div>

          {/* Rank Change */}
          {entry.previousRank && rankChange !== 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-700/50">
              {rankChange > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">↑{rankChange}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-semibold text-red-400">↓{Math.abs(rankChange)}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Points - Mobile */}
        <div className="md:hidden text-right flex-shrink-0">
          <p className="font-bold text-white text-sm">{entry.totalPoints.toLocaleString('id-ID')}</p>
          <p className="text-xs text-slate-400">pts</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Top 3 Podium Component
 */
function Top3Podium({ entries }: { entries: LeaderboardUser[] }) {
  const top3 = entries.slice(0, 3);
  const positions = [1, 2, 3];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {positions.map((pos) => {
        const entry = top3.find((e) => e.rank === pos);
        if (!entry) return null;

        const badgeStyle = getBadgeStyle(entry.badge);
        const podiumHeight: Record<number, string> = {
          1: 'md:h-64',
          2: 'md:h-56',
          3: 'md:h-52',
        };

        return (
          <div
            key={entry.userId}
            className={clsx(
              'relative rounded-2xl border overflow-hidden',
              pos === 1 && 'md:col-span-1 md:order-2 border-yellow-500/50 bg-gradient-to-b from-yellow-500/15 to-transparent',
              pos === 2 && 'md:order-1 border-slate-400/50 bg-gradient-to-b from-slate-400/10 to-transparent',
              pos === 3 && 'md:order-3 border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-transparent',
            )}
          >
            {/* Podium Background */}
            <div className={clsx('p-6 h-full flex flex-col justify-between', podiumHeight)}>
              {/* Medal */}
              <div className="flex justify-center mb-4">
                <div className="text-6xl">
                  {pos === 1 && '🥇'}
                  {pos === 2 && '🥈'}
                  {pos === 3 && '🥉'}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center space-y-2">
                {/* Avatar */}
                {entry.avatar ? (
                  <Image
                    src={entry.avatar}
                    alt={entry.userName}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-4 border-white/20 mx-auto"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                    {entry.userName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name */}
                <p className="font-bold text-white text-lg">{entry.userName}</p>

                {/* Badge */}
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border',
                    badgeStyle.bg,
                    badgeStyle.text,
                    badgeStyle.border,
                  )}
                >
                  {entry.badge}
                </span>

                {/* Points */}
                <p className="text-2xl font-bold text-white">{entry.totalPoints.toLocaleString('id-ID')}</p>
                <p className="text-xs text-slate-400">Total Points</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Main Leaderboard Table Component
 */
export function LeaderboardTable({
  entries,
  currentUserId,
  isLoading = false,
  period = 'all',
}: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        <p className="mt-4">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <Top3Podium entries={entries} />

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama warrior..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
        />
      </div>

      {/* Leaderboard List */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
        {filteredEntries.length > 0 ? (
          <div>
            {filteredEntries.map((entry, index) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === currentUserId}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No warriors found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/50">
        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Total Warriors</p>
          <p className="text-3xl font-bold text-white">{entries.length}</p>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Average Points</p>
          <p className="text-3xl font-bold text-white">
            {Math.round(entries.reduce((sum, e) => sum + e.totalPoints, 0) / entries.length).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Your Rank</p>
          <p className="text-3xl font-bold text-orange-400">
            {entries.find((e) => e.userId === currentUserId)?.rank || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
