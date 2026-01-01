 'use client';

import { Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    balance: 0,
    weeklyPnL: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('mpt_trades');
    if (saved) {
      const trades = JSON.parse(saved);
      const wins = trades.filter((t: any) => t.result === 'win').length;
      const total = trades.length;
      const winRate = total > 0 ? ((wins / total) * 100).toFixed(0) : '0';

      const balanceData = localStorage.getItem('mpt_balance');
      const balance = balanceData ? parseFloat(balanceData) : 10000;

      setStats({
        totalTrades: total,
        winRate: parseInt(winRate as string),
        balance: balance,
        weeklyPnL: 0
      });
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-950/80 border-b border-yellow-200 dark:border-yellow-500/20 dark:backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/50 transition-all duration-300">
      <div className="w-full">
        {/* Top Bar */}
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:scale-105 transition-transform duration-300">
                MPT WARRIOR
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Keunggulan Trading</p>
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1 max-w-2xl">
            {/* Total Trades */}
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/40 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-yellow-300 dark:hover:border-yellow-500/50 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Trades</p>
              <p className="text-base md:text-lg font-black text-yellow-500 dark:text-yellow-400 flex items-center gap-0.5 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-3 h-3" />
                {stats.totalTrades}
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/40 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-green-300 dark:hover:border-green-500/50 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Menang %</p>
              <p className="text-base md:text-lg font-black text-green-500 dark:text-green-400 group-hover:scale-105 transition-transform">
                {stats.winRate}%
              </p>
            </div>

            {/* Balance */}
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/40 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Saldo</p>
              <p className="text-base md:text-lg font-black text-blue-500 dark:text-blue-400 group-hover:scale-105 transition-transform">
                ${(stats.balance / 1000).toFixed(1)}k
              </p>
            </div>

            {/* Weekly PnL */}
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/40 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">PnL</p>
              <p className="text-base md:text-lg font-black text-purple-500 dark:text-purple-400 group-hover:scale-105 transition-transform">
                +0%
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link href="/analytics" className="p-2 md:p-3 rounded-lg bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-700/40 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group">
              <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-yellow-400 dark:group-hover:text-yellow-300 transition-colors duration-300" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
      </div>
    </header>
  );
}
