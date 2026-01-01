'use client';

import { Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      const winRate = total > 0 ? ((wins / total) * 100).toFixed(0) : 0;
      
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-yellow-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                MPT WARRIOR
              </h1>
              <p className="text-xs text-slate-500">Trading Excellence</p>
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Total Trades */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Trades</p>
              <p className="text-lg md:text-2xl font-black text-yellow-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stats.totalTrades}
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm hover:border-green-500/30 transition-colors">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">W/R</p>
              <p className="text-lg md:text-2xl font-black text-green-400">
                {stats.winRate}%
              </p>
            </div>

            {/* Balance */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Balance</p>
              <p className="text-lg md:text-2xl font-black text-blue-400">
                ${(stats.balance / 1000).toFixed(1)}k
              </p>
            </div>

            {/* Weekly PnL */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm hover:border-purple-500/30 transition-colors hidden md:block">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">PnL</p>
              <p className="text-lg md:text-2xl font-black text-purple-400">
                +0%
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button className="p-2 md:p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
            <BarChart3 className="w-5 h-5 text-slate-400 hover:text-yellow-400" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
      </div>
    </header>
  );
}
