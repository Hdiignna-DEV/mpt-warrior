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
    <header className="sticky top-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950/80 border-b border-yellow-500/20 backdrop-blur-md shadow-2xl">
      <div className="w-full">
        {/* Top Bar */}
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                MPT WARRIOR
              </h1>
              <p className="text-xs text-slate-500">Keunggulan Trading</p>
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1 max-w-2xl">
            {/* Total Trades */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-yellow-500/40 hover:bg-slate-800/70 transition-all">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Trades</p>
              <p className="text-base md:text-lg font-black text-yellow-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stats.totalTrades}
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-green-500/40 hover:bg-slate-800/70 transition-all">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Menang %</p>
              <p className="text-base md:text-lg font-black text-green-400">
                {stats.winRate}%
              </p>
            </div>

            {/* Balance */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/70 transition-all">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Saldo</p>
              <p className="text-base md:text-lg font-black text-blue-400">
                ${(stats.balance / 1000).toFixed(1)}k
              </p>
            </div>

            {/* Weekly PnL */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-2 md:px-3 md:py-2.5 backdrop-blur-sm hover:border-purple-500/40 hover:bg-slate-800/70 transition-all">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">PnL</p>
              <p className="text-base md:text-lg font-black text-purple-400">
                +0%
              </p>
            </div>
          </div>

          {/* Analytics Button */}
          <a href="/analytics" className="p-2 md:p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
            <BarChart3 className="w-5 h-5 text-slate-400 hover:text-yellow-400 transition-colors" />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
      </div>
    </header>
  );
}
