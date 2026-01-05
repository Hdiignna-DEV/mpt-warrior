'use client';

import { Zap, TrendingUp, Target, BarChart3, DollarSign, Menu, X } from 'lucide-react';
import Link from 'next/link';
import MptLogo from './MptLogo';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { getInitialBalance } from '@/utils/storage-sync';
import '@/utils/i18n';

interface Trade {
  id: string;
  pair: string;
  position: 'BUY' | 'SELL';
  result: 'WIN' | 'LOSS';
  pips: number;
  tradeDate: string;
}

export default function Header() {
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    balance: 0,
    weeklyPnL: 0
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load trades from API
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) return;

      const response = await fetch('/api/trades', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const balance = getInitialBalance();
        const trades = data.trades;
        
        const wins = trades.filter((t: Trade) => t.result === 'WIN').length;
        const total = trades.length;
        const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
        const totalPips = trades.reduce((sum: number, t: Trade) => sum + t.pips, 0);

        setStats({
          totalTrades: total,
          winRate: winRate,
          balance: balance + (totalPips * 16500),
          weeklyPnL: 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load sidebar state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-desktop-open');
    const isOpen = stored === null ? true : stored === 'true';
    setIsSidebarOpen(isOpen);
    
    // Set initial body class
    if (isOpen) {
      document.body.classList.add('sidebar-open');
      document.body.classList.remove('sidebar-closed');
    } else {
      document.body.classList.add('sidebar-closed');
      document.body.classList.remove('sidebar-open');
    }

    // Listen to sidebar toggle events from Sidebar component
    const handleToggle = () => {
      const stored = localStorage.getItem('sidebar-desktop-open');
      if (stored !== null) {
        setIsSidebarOpen(stored === 'true');
      }
    };

    window.addEventListener('sidebar-toggle', handleToggle);
    return () => {
      window.removeEventListener('sidebar-toggle', handleToggle);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebar-desktop-open', String(newState));
    
    // Toggle body class for layout margin adjustment
    if (newState) {
      document.body.classList.add('sidebar-open');
      document.body.classList.remove('sidebar-closed');
    } else {
      document.body.classList.add('sidebar-closed');
      document.body.classList.remove('sidebar-open');
    }
    
    // Dispatch simple event for Sidebar component to listen
    window.dispatchEvent(new Event('sidebar-toggle'));
  };

  // Load initial data
  useEffect(() => {
    loadStats();
  }, []);

  // Listen for custom event when trades updated
  useEffect(() => {
    const handleTradesUpdate = () => {
      loadStats();
    };

    window.addEventListener('tradesUpdated', handleTradesUpdate);

    return () => {
      window.removeEventListener('tradesUpdated', handleTradesUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 shadow-lg w-full">
      <div className="w-full">
        {/* Top Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          {/* Sidebar Toggle & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Toggle Button - All screen sizes */}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-110 active:scale-95 relative group"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              type="button"
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isSidebarOpen ? <X size={20} className="relative z-10" /> : <Menu size={20} className="relative z-10" />}
            </button>
            
            {/* Logo */}
            <button
              onClick={() => {
                const user = localStorage.getItem('mpt_user');
                if (user) {
                  try {
                    const userData = JSON.parse(user);
                    window.location.href = userData.role === 'ADMIN' ? '/admin-hq' : '/dashboard';
                  } catch {
                    window.location.href = '/dashboard';
                  }
                } else {
                  window.location.href = '/';
                }
              }}
              className="flex items-center gap-2 group shrink-0 cursor-pointer"
            >
            <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border-2 border-amber-400 dark:border-amber-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-amber-500 dark:group-hover:border-amber-400 overflow-hidden p-0.5">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MptLogo size={48} className="relative z-10 brightness-110 contrast-125" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 leading-none">
                MPT WARRIOR
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Trading Hub</p>
            </div>
          </button>
          </div>

          {/* Stats Grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1 max-w-2xl">
            {/* Total Trades */}
            <div className="group relative overflow-hidden backdrop-blur-lg bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 cursor-default hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-tight flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trades
                </p>
                <p className="text-base font-black text-gray-900 dark:text-zinc-100 mt-0.5">
                  {stats.totalTrades}
                </p>
              </div>
            </div>

            {/* Win Rate */}
            <div className="group relative overflow-hidden backdrop-blur-lg bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 cursor-default hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Win Rate
                </p>
                <p className="text-base font-black text-gray-900 dark:text-zinc-100 mt-0.5">
                  {stats.winRate}%
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="group relative overflow-hidden backdrop-blur-lg bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 cursor-default hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Balance
                </p>
                <p className="text-base font-black text-gray-900 dark:text-zinc-100 mt-0.5">
                  Rp {stats.balance.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Weekly PnL */}
            <div className="group hidden lg:block relative overflow-hidden backdrop-blur-lg bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-default hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Week P&L
                </p>
                <p className="text-base font-black text-gray-900 dark:text-zinc-100 mt-0.5">
                  +0%
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <LanguageToggle />
            <ThemeToggle />

            <Link 
              href="/analytics" 
              className="group relative p-2.5 rounded-xl backdrop-blur-lg bg-white/60 dark:bg-zinc-900/60 border border-gray-200/50 dark:border-zinc-800/50 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Analytics"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <BarChart3 className="relative w-5 h-5 text-gray-700 dark:text-zinc-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Animated Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-sky-500/20 dark:via-sky-500/30 to-transparent"></div>
      </div>
    </header>
  );
}
