'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Target, DollarSign, Award, RefreshCw, Edit2, X, Check, Zap, TrendingDown, Calendar, BookOpen, Calculator, Bot, BarChart3, Zap as ZapIcon } from 'lucide-react';
import { getTrades, getInitialBalance, saveInitialBalance, onTradesUpdated } from '@/utils/storage-sync';
import type { Trade } from '@/utils/storage-sync';

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customBalance, setCustomBalance] = useState<number>(10000);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState<string>('10000');

  // Load trades dan balance dari localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Load initial trades
    const initialTrades = getTrades();
    setTrades(initialTrades);
    
    // Load initial balance
    const initialBalance = getInitialBalance();
    setCustomBalance(initialBalance);
    setTempBalance(initialBalance.toString());

    setIsLoading(false);
  }, []);

  // Subscribe to trades updates (real-time sync)
  useEffect(() => {
    const unsubscribe = onTradesUpdated((updatedTrades) => {
      setTrades(updatedTrades);
    });

    return unsubscribe;
  }, []);

  // Also listen to storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'trades' && event.newValue) {
        try {
          const updatedTrades = JSON.parse(event.newValue);
          setTrades(updatedTrades);
        } catch (error) {
          console.error('Error updating trades from storage:', error);
        }
      }
      if (event.key === 'mpt_initial_balance' && event.newValue) {
        try {
          const balance = parseFloat(event.newValue);
          setCustomBalance(balance);
          setTempBalance(balance.toString());
        } catch (error) {
          console.error('Error updating balance from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle balance edit
  const handleSaveBalance = () => {
    const newBalance = parseFloat(tempBalance);
    
    if (isNaN(newBalance) || newBalance <= 0) {
      alert('Saldo harus berupa angka positif!');
      return;
    }

    setCustomBalance(newBalance);
    saveInitialBalance(newBalance);
    setIsEditingBalance(false);
  };

  const handleCancelEdit = () => {
    setTempBalance(customBalance.toString());
    setIsEditingBalance(false);
  };

  // Calculate real statistics
  const totalTrades = trades.length;
  const winTrades = trades.filter(t => t.hasil === 'WIN').length;
  const lossTrades = totalTrades - winTrades;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  
  // Calculate best streak
  const calculateBestStreak = () => {
    let currentStreak = 0;
    let bestStreak = 0;
    
    trades.forEach(trade => {
      if (trade.hasil === 'WIN') {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return bestStreak;
  };

  // Calculate total pips
  const totalPips = trades.reduce((sum, trade) => sum + trade.pip, 0);
  
  // Calculate balance based on custom initial balance
  const currentBalance = customBalance + (totalPips * 10);
  const profitLoss = currentBalance - customBalance;

  // Calculate additional metrics
  const avgPipsPerWin = winTrades > 0 
    ? Math.round(trades.filter(t => t.hasil === 'WIN').reduce((sum, t) => sum + t.pip, 0) / winTrades * 100) / 100
    : 0;

  const avgPipsPerLoss = lossTrades > 0
    ? Math.round(trades.filter(t => t.hasil === 'LOSS').reduce((sum, t) => sum + Math.abs(t.pip), 0) / lossTrades * 100) / 100
    : 0;

  const stats = [
    {
      label: 'Win Rate',
      value: totalTrades > 0 ? `${winRate}%` : '0%',
      subtext: `${winTrades}W / ${lossTrades}L`,
      icon: TrendingUp,
      color: 'from-green-500/20 to-emerald-500/10',
      iconBg: 'bg-green-500/30',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Total Trades',
      value: totalTrades.toString(),
      subtext: `${totalTrades > 0 ? (totalTrades * 2).toFixed(0) : 0} trades/month avg`,
      icon: Target,
      color: 'from-blue-500/20 to-cyan-500/10',
      iconBg: 'bg-blue-500/30',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Current Balance',
      value: `$${currentBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      subtext: profitLoss >= 0 ? `+$${profitLoss.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : `-$${Math.abs(profitLoss).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: profitLoss >= 0 ? 'from-yellow-500/20 to-amber-500/10' : 'from-red-500/20 to-orange-500/10',
      iconBg: profitLoss >= 0 ? 'bg-yellow-500/30' : 'bg-red-500/30',
      iconColor: profitLoss >= 0 ? 'text-yellow-400' : 'text-red-400',
      borderColor: profitLoss >= 0 ? 'border-yellow-500/30' : 'border-red-500/30',
    },
    {
      label: 'Best Streak',
      value: `${calculateBestStreak()} Wins`,
      subtext: `Avg win: +${avgPipsPerWin} pips`,
      icon: Award,
      color: 'from-purple-500/20 to-pink-500/10',
      iconBg: 'bg-purple-500/30',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
  ];

  // Get 4 most recent trades
  const recentTrades = trades.slice(0, 4);

  // Loading skeleton
  const StatSkeleton = () => (
    <div className="bg-slate-800/50 rounded-2xl p-5 md:p-6 border border-slate-700/50 animate-pulse">
      <div className="h-12 bg-slate-700 rounded mb-4"></div>
      <div className="h-8 bg-slate-700 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800/50 via-yellow-500/5 to-slate-800/50 border border-yellow-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 mb-3 animate-in fade-in duration-700">
                Selamat Datang, Warrior! 🚀
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Pantau progres, sempurna kan keahlian, kuasai pasar dengan strategi yang terbukti.
              </p>
            </div>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const saved = localStorage.getItem('trades');
                  if (saved) {
                    setTrades(JSON.parse(saved));
                  }
                  setIsLoading(false);
                }, 300);
              }}
              disabled={isLoading}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 flex-shrink-0 whitespace-nowrap hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : 'group-hover:scale-110'} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <ZapIcon className="text-yellow-400 w-6 h-6 animate-pulse" />
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Log Trade */}
            <Link
              href="/journal"
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/40 rounded-xl p-4 md:p-5 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">Catat Transaksi</h3>
                <div className="p-2 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/40 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Catat transaksi dan pantau performa</p>
            </Link>

            {/* Risk Calculator */}
            <Link
              href="/calculator"
              className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/40 rounded-xl p-4 md:p-5 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/20 hover:scale-105 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-red-300 transition-colors">Kalkulasi Risk</h3>
                <div className="p-2 bg-red-500/30 rounded-lg group-hover:bg-red-500/40 group-hover:scale-110 transition-all duration-300">
                  <Calculator className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Hitung ukuran posisi & risk management</p>
            </Link>

            {/* AI Mentor */}
            <Link
              href="/ai-mentor"
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/40 rounded-xl p-4 md:p-5 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Mentor AI</h3>
                <div className="p-2 bg-purple-500/30 rounded-lg group-hover:bg-purple-500/40 group-hover:scale-110 transition-all duration-300">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Dapatkan saran trading dari AI Gemini</p>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Trades Card */}
          <div className="bg-gradient-to-br from-blue-500/15 via-slate-800/50 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 md:p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wide">Total Trades</h3>
              <div className="p-2.5 bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-lg group-hover:bg-blue-500/40 transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-blue-300 group-hover:text-blue-200 transition-colors">{totalTrades}</p>
            <p className="text-xs text-blue-400/70 mt-2 font-medium">Sesi trading sepanjang masa</p>
          </div>

          {/* Win Rate Card */}
          <div className="bg-gradient-to-br from-green-500/15 via-slate-800/50 to-green-600/10 border border-green-500/30 rounded-xl p-5 md:p-6 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wide">Tingkat Menang</h3>
              <div className="p-2.5 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-lg group-hover:bg-green-500/40 transition-all duration-300 group-hover:scale-110">
                <Award className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-green-300 group-hover:text-green-200 transition-colors">{winRate}%</p>
            <p className="text-xs text-green-400/70 mt-2 font-medium">{winTrades} menang / {lossTrades} kalah</p>
          </div>

          {/* Current Balance Card */}
          <div className="bg-gradient-to-br from-purple-500/15 via-slate-800/50 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 md:p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wide">Saldo</h3>
              <div className="p-2.5 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-lg group-hover:bg-purple-500/40 transition-all duration-300 group-hover:scale-110">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-purple-300 group-hover:text-purple-200 transition-colors">${(customBalance / 1000).toFixed(1)}k</p>
            <p className="text-xs text-purple-400/70 mt-2 font-medium">Ekuitas akun saat ini</p>
          </div>

          {/* Risk per Trade Card */}
          <div className="bg-gradient-to-br from-orange-500/15 via-slate-800/50 to-orange-600/10 border border-orange-500/30 rounded-xl p-5 md:p-6 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wide">Risk/Trade</h3>
              <div className="p-2.5 bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-lg group-hover:bg-orange-500/40 transition-all duration-300 group-hover:scale-110">
                <Target className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-orange-300 group-hover:text-orange-200 transition-colors">1%</p>
            <p className="text-xs text-orange-400/70 mt-2 font-medium">Ukuran posisi standar</p>
          </div>
        </div>

        {/* Balance Editor Section */}
        <div className="bg-gradient-to-r from-slate-800/40 via-slate-800/20 to-slate-800/40 border border-slate-700/50 rounded-xl p-5 md:p-6 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide">💰 Initial Balance</p>
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                ${customBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            {!isEditingBalance ? (
              <button
                onClick={() => {
                  setIsEditingBalance(true);
                  setTempBalance(customBalance.toString());
                }}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-slate-900 font-bold rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95"
              >
                <Edit2 size={18} />
                Edit Saldo
              </button>
            ) : (
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  type="number"
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 w-40 transition-all duration-300"
                  placeholder="Masukkan nominal"
                  autoFocus
                />
                <button
                  onClick={() => {
                    const newBalance = parseFloat(tempBalance);
                    if (!isNaN(newBalance) && newBalance > 0) {
                      setCustomBalance(newBalance);
                      localStorage.setItem('mpt_initial_balance', newBalance.toString());
                      setIsEditingBalance(false);
                    }
                  }}
                  className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setIsEditingBalance(false)}
                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Trades Section */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-lg backdrop-blur-sm">
          <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-850/50 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              Transaksi Terbaru
            </h2>
            <p className="text-sm text-slate-400 mt-1">Pantau 4 transaksi terakhir Anda</p>
          </div>
          
          {recentTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-bold uppercase text-xs tracking-wide">Pair</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-bold uppercase text-xs tracking-wide">Posisi</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-bold uppercase text-xs tracking-wide">Hasil</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-bold uppercase text-xs tracking-wide hidden md:table-cell">Pip</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-bold uppercase text-xs tracking-wide">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {recentTrades.map((trade, index) => (
                    <tr key={trade.id} className="hover:bg-slate-700/30 transition-all duration-200 animate-in fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-white">{trade.pair}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                          trade.posisi === 'BUY' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {trade.posisi === 'BUY' ? '📈' : '📉'} {trade.posisi}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                          trade.hasil === 'WIN' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {trade.hasil === 'WIN' ? '✓' : '✗'} {trade.hasil}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 hidden md:table-cell text-slate-400 font-mono font-bold">
                        <span className={trade.pip > 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.pip > 0 ? '+' : ''}{trade.pip}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs md:text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {trade.tanggal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mb-4">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
              </div>
              <p className="text-slate-400 mb-4 text-lg">Belum ada transaksi. Mulai petualangan trading Anda!</p>
              <Link href="/journal" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-slate-900 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95">
                <BookOpen size={18} />
                Catat Transaksi Pertama
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}