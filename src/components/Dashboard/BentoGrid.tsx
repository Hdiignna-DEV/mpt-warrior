'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Target, DollarSign, Award, Flame, Zap } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subtext, 
  icon: Icon, 
  variant = 'primary',
  size = 'md'
}) => {
  const colorMap = {
    primary: {
      bg: 'from-sky-500/10 to-sky-600/5',
      border: 'border-sky-500/20',
      icon: 'text-sky-400',
      iconBg: 'bg-sky-500/10',
    },
    success: {
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
    warning: {
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
    danger: {
      bg: 'from-red-500/10 to-red-600/5',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/10',
    },
    info: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
    },
  };

  const colors = colorMap[variant];
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div 
      className={`
        relative group overflow-hidden rounded-2xl
        bg-gradient-to-br ${colors.bg}
        border ${colors.border}
        backdrop-blur-xl
        transition-all duration-500 ease-out
        hover:-translate-y-1 hover:shadow-2xl
        ${sizeClasses[size]}
      `}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-xl ${colors.iconBg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>

        {/* Value */}
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-zinc-100 mb-1">
            {value}
          </h3>
          <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
        </div>

        {/* Subtext */}
        <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
          {subtext}
        </p>
      </div>
    </div>
  );
};

interface BentoGridProps {
  stats: {
    totalTrades: number;
    winRate: number;
    balance: number;
    profitLoss: number;
    bestStreak: number;
    avgPipsPerWin: number;
  };
}

export const BentoGrid: React.FC<BentoGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Win Rate - Large Featured */}
      <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
        <StatCard
          label="Win Rate"
          value={`${stats.winRate}%`}
          subtext={`Avg win: +${stats.avgPipsPerWin} pips`}
          icon={TrendingUp}
          variant="success"
          size="xl"
        />
      </div>

      {/* Total Trades */}
      <div className="sm:col-span-1">
        <StatCard
          label="Total Trades"
          value={stats.totalTrades.toString()}
          subtext={`${Math.round(stats.totalTrades / 2)} trades/week avg`}
          icon={Target}
          variant="primary"
          size="md"
        />
      </div>

      {/* Best Streak */}
      <div className="sm:col-span-1">
        <StatCard
          label="Best Streak"
          value={`${stats.bestStreak}`}
          subtext="Consecutive wins"
          icon={Flame}
          variant="warning"
          size="md"
        />
      </div>

      {/* Balance - Wide */}
      <div className="sm:col-span-2">
        <StatCard
          label="Current Balance"
          value={`$${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={
            stats.profitLoss >= 0 
              ? `+$${stats.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} profit`
              : `-$${Math.abs(stats.profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} loss`
          }
          icon={DollarSign}
          variant={stats.profitLoss >= 0 ? 'success' : 'danger'}
          size="lg"
        />
      </div>
    </div>
  );
};

export default BentoGrid;
