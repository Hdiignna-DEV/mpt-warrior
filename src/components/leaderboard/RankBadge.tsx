'use client';

import React from 'react';
import { Star, Zap, Shield } from 'lucide-react';

type BadgeType = 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor';

interface RankBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'premium' | 'glow';
}

const badgeConfig: Record<BadgeType, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  premiumGradient: string;
  glowColor: string;
  label: string;
  shortLabel: string;
  description: string;
  borderStyle: string;
}> = {
  'Recruit': {
    icon: <span className="text-lg">▌▌</span>,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    premiumGradient: 'bg-gradient-to-r from-gray-600 to-gray-500',
    glowColor: 'shadow-lg shadow-gray-400/50',
    label: 'Recruit',
    shortLabel: 'RCT',
    description: 'Junior Trader (0-500 pts)',
    borderStyle: 'border border-gray-400/30'
  },
  'Elite Warrior': {
    icon: <span className="text-lg">▌▌</span>,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    premiumGradient: 'bg-gradient-to-r from-yellow-500 to-amber-400',
    glowColor: 'shadow-lg shadow-yellow-400/50',
    label: 'Elite Warrior',
    shortLabel: 'ELT',
    description: 'Experienced Warrior (501-1500 pts)',
    borderStyle: 'border border-yellow-400/50'
  },
  'Commander': {
    icon: <span className="text-lg">★</span>,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    premiumGradient: 'bg-gradient-to-r from-purple-600 to-purple-400',
    glowColor: 'shadow-lg shadow-purple-400/50',
    label: 'Commander',
    shortLabel: 'CMD',
    description: 'Trading Commander (1501-3000 pts)',
    borderStyle: 'border border-purple-400/50'
  },
  'Legendary Mentor': {
    icon: <span className="text-lg">★✨</span>,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/30',
    premiumGradient: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400',
    glowColor: 'shadow-lg shadow-amber-400/70 drop-shadow-lg',
    label: 'Legendary Mentor',
    shortLabel: 'LGD',
    description: 'Master Trader (3001+ pts)',
    borderStyle: 'border border-amber-400/60 animate-pulse'
  }
};

/**
 * RankBadge Component
 * Displays military-style rank badge with icon and styling
 * 
 * Usage:
 * <RankBadge badge="Recruit" size="md" showLabel />
 * <RankBadge badge="Legendary Mentor" size="lg" variant="premium" />
 */
export function RankBadge({ badge, size = 'md', showLabel = false, className = '', variant = 'default' }: RankBadgeProps) {
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

  // Variant specific styling
  let variantClasses = '';
  if (variant === 'premium') {
    variantClasses = `${config.premiumGradient} text-white font-bold ${config.borderStyle} transition-all duration-300 hover:scale-105`;
  } else if (variant === 'glow') {
    variantClasses = `${config.bgColor} ${config.color} ${config.glowColor} ${config.borderStyle} transition-all duration-300`;
  } else {
    variantClasses = `${config.bgColor} ${config.color} ${config.borderStyle}`;
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold
        ${sizeClasses[size]}
        ${variantClasses}
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
 * Minimal badge display (just icon) - Perfect for next to user names
 */
export function RankBadgeCompact({ badge, className = '' }: Omit<RankBadgeProps, 'size' | 'showLabel'>) {
  const config = badgeConfig[badge];
  
  // Exclusive styling for different tiers
  const tierStyles: Record<BadgeType, string> = {
    'Recruit': 'w-7 h-7 rounded-full bg-gray-500/30 border border-gray-400/30',
    'Elite Warrior': 'w-8 h-8 rounded-full bg-yellow-500/30 border border-yellow-400/40',
    'Commander': 'w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/50',
    'Legendary Mentor': 'w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/40 to-yellow-400/30 border border-amber-400/60 shadow-lg shadow-amber-400/30'
  };
  
  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${tierStyles[badge]}
        ${config.color}
        text-sm font-bold
        transition-all duration-300 hover:scale-110
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
 * Perfect for Top 3 Podium and profile pages
 */
export function RankBadgeRow({ badge, className = '' }: Omit<RankBadgeProps, 'size' | 'showLabel'>) {
  const config = badgeConfig[badge];
  
  // Different styling for Legend tier
  const isLegend = badge === 'Legendary Mentor';
  
  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-xl
      ${isLegend 
        ? `${config.premiumGradient} text-white border border-amber-400/50 shadow-lg ${config.glowColor}`
        : `${config.bgColor} border ${config.borderStyle}`}
      transition-all duration-300 hover:shadow-lg
      ${className}
    `}>
      <div className={`text-4xl flex-shrink-0 ${isLegend ? 'drop-shadow-lg' : config.color}`}>
        {config.icon}
      </div>
      <div>
        <p className={`text-lg font-bold ${isLegend ? 'text-white' : config.color}`}>
          {config.label}
        </p>
        <p className={`text-sm ${isLegend ? 'text-white/80' : 'text-gray-400'}`}>
          {config.description}
        </p>
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
 * Get badge icon as symbol string
 */
export function getBadgeIcon(badge: BadgeType | string): string {
  const icons: Record<string, string> = {
    'Recruit': '▌▌',
    'Elite Warrior': '▌▌',
    'Commander': '★',
    'Legendary Mentor': '★✨'
  };
  return icons[badge] || '▌▌';
}

/**
 * Determine tier from points
 */
export function getTierFromPoints(points: number): BadgeType {
  if (points >= 3001) return 'Legendary Mentor';
  if (points >= 1501) return 'Commander';
  if (points >= 501) return 'Elite Warrior';
  return 'Recruit';
}

/**
 * Get exclusive badge variant for profile/leaderboard display
 */
export function getExclusiveBadgeVariant(badge: BadgeType): 'default' | 'premium' | 'glow' {
  if (badge === 'Legendary Mentor') return 'glow';
  if (badge === 'Commander') return 'premium';
  return 'default';
}
