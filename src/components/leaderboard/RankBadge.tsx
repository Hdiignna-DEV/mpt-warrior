'use client';

import React from 'react';
import { Star, Zap, Shield } from 'lucide-react';

type BadgeType = 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor';

interface RankBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const badgeConfig: Record<BadgeType, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  label: string;
  shortLabel: string;
  description: string;
}> = {
  'Recruit': {
    icon: <span className="text-lg">🔷</span>,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    label: 'Recruit',
    shortLabel: 'RCT',
    description: 'Junior Trader (0-500 pts)'
  },
  'Elite Warrior': {
    icon: <Star className="w-4 h-4" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    label: 'Elite Warrior',
    shortLabel: 'ELT',
    description: 'Experienced Warrior (501-1500 pts)'
  },
  'Commander': {
    icon: <Shield className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    label: 'Commander',
    shortLabel: 'CMD',
    description: 'Trading Commander (1501-3000 pts)'
  },
  'Legendary Mentor': {
    icon: <Zap className="w-5 h-5" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/30',
    label: 'Legendary Mentor',
    shortLabel: 'LGD',
    description: 'Master Trader (3001+ pts)'
  }
};

/**
 * RankBadge Component
 * Displays military-style rank badge with icon and styling
 * 
 * Usage:
 * <RankBadge badge="Recruit" size="md" showLabel />
 * <RankBadge badge="Legendary Mentor" size="lg" />
 */
export function RankBadge({ badge, size = 'md', showLabel = false, className = '' }: RankBadgeProps) {
  const config = badgeConfig[badge];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.color}
        ${className}
      `}
      title={config.description}
    >
      <span className={iconSizeClasses[size]}>
        {config.icon}
      </span>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

/**
 * RankBadgeCompact Component
 * Minimal badge display (just icon)
 */
export function RankBadgeCompact({ badge, className = '' }: Omit<RankBadgeProps, 'size' | 'showLabel'>) {
  const config = badgeConfig[badge];
  
  return (
    <div
      className={`
        inline-flex items-center justify-center
        w-7 h-7 rounded-full
        ${config.bgColor}
        ${config.color}
        text-sm font-bold
        ${className}
      `}
      title={config.description}
    >
      {config.icon}
    </div>
  );
}

/**
 * RankBadgeRow Component
 * Display badge with label and description (for profile view)
 */
export function RankBadgeRow({ badge, className = '' }: Omit<RankBadgeProps, 'size' | 'showLabel'>) {
  const config = badgeConfig[badge];
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${config.bgColor} ${className}`}>
      <div className={`text-3xl ${config.color}`}>
        {config.icon}
      </div>
      <div>
        <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
        <p className="text-xs text-gray-400">{config.description}</p>
      </div>
    </div>
  );
}

/**
 * Get badge color class
 */
export function getBadgeColor(badge: BadgeType | string): string {
  const config = badgeConfig[badge as BadgeType];
  if (!config) return 'bg-gray-500/20 text-gray-400';
  return `${config.bgColor} ${config.color}`;
}

/**
 * Get badge icon as string
 */
export function getBadgeIcon(badge: BadgeType | string): string {
  const icons: Record<string, string> = {
    'Recruit': '🔷',
    'Elite Warrior': '⭐',
    'Commander': '⭐⭐',
    'Legendary Mentor': '⭐✨'
  };
  return icons[badge] || '🔷';
}
