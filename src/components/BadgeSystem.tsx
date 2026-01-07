/**
 * Warrior Badge System
 * Visual badges to represent warrior progression
 */

'use client';

import { Badge, BadgeLevel } from '@/types';
import { Shield, Swords, Crown, Target, BookOpen, Users } from 'lucide-react';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function BadgeDisplay({ badge, size = 'md', showProgress = false }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const Icon = getBadgeIcon(badge.type);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Badge Icon */}
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${badge.gradient} shadow-lg relative group cursor-pointer transition-transform hover:scale-110`}
        title={badge.description}
      >
        <Icon className={`${iconSizes[size]} text-white`} />
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full ${badge.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`} />
      </div>

      {/* Badge Name */}
      <div className="text-center">
        <p className={`font-bold ${badge.color} ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
          {badge.name}
        </p>
        {badge.earnedAt && (
          <p className="text-xs text-gray-400">
            {new Date(badge.earnedAt).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'short',
              day: 'numeric'
            })}
          </p>
        )}
      </div>

      {/* Progress Bar (if applicable) */}
      {showProgress && badge.progress !== undefined && badge.progress < 100 && (
        <div className="w-full max-w-[120px]">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${badge.gradient} transition-all duration-500`}
              style={{ width: `${badge.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            {badge.progress}%
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Badge Level Display
 * Shows current warrior level with visual representation
 */
interface BadgeLevelDisplayProps {
  level: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeLevelDisplay({ level, size = 'md' }: BadgeLevelDisplayProps) {
  const config = getBadgeLevelConfig(level);
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${config.gradient} ${sizeClasses[size]} font-bold text-white shadow-lg`}>
      <Icon className={iconSizes[size]} />
      <span>{config.name}</span>
    </div>
  );
}

/**
 * Badge Grid Display
 * Shows all badges in a grid layout
 */
interface BadgeGridProps {
  badges: Badge[];
  lockedBadges?: Badge[];
}

export function BadgeGrid({ badges, lockedBadges = [] }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Earned Badges */}
      {badges.map((badge) => (
        <div key={badge.type} className="flex justify-center">
          <BadgeDisplay badge={badge} size="md" showProgress={false} />
        </div>
      ))}

      {/* Locked Badges */}
      {lockedBadges.map((badge) => (
        <div key={badge.type} className="flex justify-center opacity-30">
          <BadgeDisplay badge={badge} size="md" showProgress={true} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBadgeIcon(type: string) {
  switch (type) {
    case 'FIRST_TRADE':
      return Target;
    case 'CONSISTENT_5':
      return Swords;
    case 'DISCIPLINED_WARRIOR':
      return Shield;
    case 'PROFIT_MASTER':
      return Crown;
    case 'EDUCATOR':
      return BookOpen;
    case 'LEGACY_BUILDER':
      return Users;
    default:
      return Shield;
  }
}

function getBadgeLevelConfig(level: BadgeLevel) {
  switch (level) {
    case 'RECRUIT':
      return {
        name: 'Recruit',
        icon: Shield,
        gradient: 'bg-gradient-to-br from-gray-500 to-gray-700',
        color: 'text-gray-400'
      };
    case 'WARRIOR':
      return {
        name: 'Warrior',
        icon: Swords,
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
        color: 'text-blue-400'
      };
    case 'VETERAN':
      return {
        name: 'Veteran',
        icon: Crown,
        gradient: 'bg-gradient-to-br from-amber-500 to-amber-700',
        color: 'text-amber-400'
      };
    default:
      return {
        name: 'Recruit',
        icon: Shield,
        gradient: 'bg-gradient-to-br from-gray-500 to-gray-700',
        color: 'text-gray-400'
      };
  }
}

/**
 * Get all available badges
 */
export function getAllBadges(): Badge[] {
  return [
    {
      type: 'FIRST_TRADE',
      level: 'RECRUIT',
      name: 'First Blood',
      description: 'Complete your first trade',
      icon: 'target',
      color: 'text-green-400',
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      progress: 0
    },
    {
      type: 'CONSISTENT_5',
      level: 'WARRIOR',
      name: 'Consistent Warrior',
      description: 'Complete 5 consecutive winning trades',
      icon: 'swords',
      color: 'text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      progress: 0
    },
    {
      type: 'DISCIPLINED_WARRIOR',
      level: 'WARRIOR',
      name: 'Discipline Master',
      description: 'Reach 500 discipline score',
      icon: 'shield',
      color: 'text-purple-400',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      progress: 0
    },
    {
      type: 'PROFIT_MASTER',
      level: 'WARRIOR',
      name: 'Profit Master',
      description: 'Achieve 70% win rate with 50+ trades',
      icon: 'crown',
      color: 'text-amber-400',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-700',
      progress: 0
    },
    {
      type: 'EDUCATOR',
      level: 'VETERAN',
      name: 'Educator',
      description: 'Complete all Academy modules',
      icon: 'book-open',
      color: 'text-cyan-400',
      gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
      progress: 0
    },
    {
      type: 'LEGACY_BUILDER',
      level: 'VETERAN',
      name: 'Legacy Builder',
      description: 'Successfully refer 10 warriors',
      icon: 'users',
      color: 'text-rose-400',
      gradient: 'bg-gradient-to-br from-rose-500 to-rose-700',
      progress: 0
    }
  ];
}
