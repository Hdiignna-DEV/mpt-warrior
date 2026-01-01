 'use client';

import { Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { getTrades, getInitialBalance, onTradesUpdated } from '@/utils/storage-sync';

export default function Header() {
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    balance: 0,
    weeklyPnL: 0
  });

  // Load initial data
  useEffect(() => {
    const trades = getTrades();
    const balance = getInitialBalance();
    
    const wins = trades.filter((t) => t.hasil === 'WIN').length;
    const total = trades.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    const totalPips = trades.reduce((sum, t) => sum + t.pip, 0);

    setStats({
      totalTrades: total,
      winRate: winRate,
      balance: balance + (totalPips * 10),
      weeklyPnL: 0
    });
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = onTradesUpdated((trades) => {
      const balance = getInitialBalance();
      const wins = trades.filter((t) => t.hasil === 'WIN').length;
      const total = trades.length;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      const totalPips = trades.reduce((sum, t) => sum + t.pip, 0);

      setStats({
        totalTrades: total,
        winRate: winRate,
        balance: balance + (totalPips * 10),
        weeklyPnL: 0
      });
    });

    return unsubscribe;
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gradient-to-b dark:from-slate-900/98 dark:via-slate-900/95 dark:to-slate-950/90 border-b border-yellow-200 dark:border-yellow-500/30 dark:backdrop-blur-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/60 transition-all duration-300">
      <div className="w-full">
        {/* Top Bar */}
        <div className="px-4 md:px-6 py-3.5 md:py-4.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-orange-500/60 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Zap className="text-white w-6 h-6 group-hover:animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-300 origin-left">
                MPT WARRIOR
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">Keunggulan Trading</p>
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1 max-w-2xl">
            {/* Total Trades */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 dark:from-yellow-500/10 to-yellow-100/30 dark:to-yellow-600/5 border border-yellow-200 dark:border-yellow-500/40 rounded-lg px-2 py-2.5 md:px-3 md:py-3 backdrop-blur-sm hover:border-yellow-400 dark:hover:border-yellow-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-200/50 dark:hover:shadow-yellow-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-600 dark:text-yellow-600 font-bold uppercase tracking-tight">Trades</p>
                <p className="text-base md:text-lg font-black text-yellow-600 dark:text-yellow-400 flex items-center gap-1 group-hover:scale-125 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  <TrendingUp className="w-4 h-4" />
                  {stats.totalTrades}
                </p>
              </div>
            </div>

            {/* Win Rate */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 dark:from-green-500/10 to-green-100/30 dark:to-green-600/5 border border-green-200 dark:border-green-500/40 rounded-lg px-2 py-2.5 md:px-3 md:py-3 backdrop-blur-sm hover:border-green-400 dark:hover:border-green-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-green-200/50 dark:hover:shadow-green-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-600 dark:text-green-600 font-bold uppercase tracking-tight">Menang %</p>
                <p className="text-base md:text-lg font-black text-green-600 dark:text-green-400 group-hover:scale-125 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  {stats.winRate}%
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 dark:from-blue-500/10 to-blue-100/30 dark:to-blue-600/5 border border-blue-200 dark:border-blue-500/40 rounded-lg px-2 py-2.5 md:px-3 md:py-3 backdrop-blur-sm hover:border-blue-400 dark:hover:border-blue-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-600 dark:text-blue-600 font-bold uppercase tracking-tight">Saldo</p>
                <p className="text-base md:text-lg font-black text-blue-600 dark:text-blue-400 group-hover:scale-125 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  ${(stats.balance / 1000).toFixed(1)}k
                </p>
              </div>
            </div>

            {/* Weekly PnL */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 dark:from-purple-500/10 to-purple-100/30 dark:to-purple-600/5 border border-purple-200 dark:border-purple-500/40 rounded-lg px-2 py-2.5 md:px-3 md:py-3 backdrop-blur-sm hover:border-purple-400 dark:hover:border-purple-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-600 dark:text-purple-600 font-bold uppercase tracking-tight">PnL</p>
                <p className="text-base md:text-lg font-black text-purple-600 dark:text-purple-400 group-hover:scale-125 group-hover:translate-x-1 transition-all duration-300 origin-left">
                  +0%
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link href="/analytics" className="group relative p-2 md:p-3 rounded-lg bg-gradient-to-br from-slate-200 dark:from-slate-800/70 to-slate-100 dark:to-slate-900/50 hover:from-slate-300 dark:hover:from-slate-800/90 border border-slate-300 dark:border-slate-700/50 hover:border-yellow-400 dark:hover:border-yellow-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 dark:hover:shadow-yellow-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <BarChart3 className="relative w-5 h-5 text-slate-700 dark:text-slate-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-300 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </Link>
          </div>
        </div>

        {/* Animated Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/40 dark:via-yellow-500/30 to-transparent"></div>
      </div>
    </header>
  );
}
