'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Target, DollarSign, Award, RefreshCw, Edit2, X, Check, Zap, TrendingDown, Calendar, BookOpen, Calculator, Bot, BarChart3, Zap as ZapIcon } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customBalance, setCustomBalance] = useState<number>(10000);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState<string>('10000');

  // Load trades dari localStorage
  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('trades');
    const savedBalance = localStorage.getItem('mpt_initial_balance');
    
    if (saved) {
      try {
        const parsedTrades = JSON.parse(saved);
        setTrades(Array.isArray(parsedTrades) ? parsedTrades : []);
      } catch (error) {
        console.error('Error parsing trades:', error);
        setTrades([]);
      }
    }

    if (savedBalance) {
      try {
        const balance = parseFloat(savedBalance);
        setCustomBalance(balance);
        setTempBalance(balance.toString());
      } catch (error) {
        console.error('Error parsing balance:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Handle balance edit
  const handleSaveBalance = () => {
    const newBalance = parseFloat(tempBalance);
    
    if (isNaN(newBalance) || newBalance <= 0) {
      alert('Saldo harus berupa angka positif!');
      return;
    }

    setCustomBalance(newBalance);
    localStorage.setItem('mpt_initial_balance', newBalance.toString());
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
    <div className="w-full bg-slate-950">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/20 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Selamat Datang, Warrior! 🚀</h1>
              <p className="text-slate-400 text-lg">Pantau progres, sempurna kan keahlian, kuasai pasar.</p>
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
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <ZapIcon className="text-yellow-400 w-6 h-6" />
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Log Trade */}
            <Link
              href="/journal"
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/40 rounded-xl p-4 md:p-5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">Catat Transaksi</h3>
                <div className="p-2 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/40 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400">Catat transaksi dan pantau performa</p>
            </Link>

            {/* Risk Calculator */}
            <Link
              href="/calculator"
              className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/40 rounded-xl p-4 md:p-5 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-red-300 transition-colors">Kalkulasi Risk</h3>
                <div className="p-2 bg-red-500/30 rounded-lg group-hover:bg-red-500/40 transition-colors">
                  <Calculator className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400">Hitung ukuran posisi & risk</p>
            </Link>

            {/* AI Mentor */}
            <Link
              href="/ai-mentor"
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/40 rounded-xl p-4 md:p-5 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Mentor AI</h3>
                <div className="p-2 bg-purple-500/30 rounded-lg group-hover:bg-purple-500/40 transition-colors">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400">Dapatkan saran trading dari AI</p>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Trades Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 md:p-6 hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Total Trades</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-blue-300">{totalTrades}</p>
            <p className="text-xs text-blue-400/70 mt-2">Sesi trading</p>
          </div>

          {/* Win Rate Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 md:p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Tingkat Menang</h3>
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <Award className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-green-300">{winRate}%</p>
            <p className="text-xs text-green-400/70 mt-2">Persentase menang</p>
          </div>

          {/* Current Balance Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 md:p-6 hover:border-purple-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Saldo</h3>
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-purple-300">${(customBalance / 1000).toFixed(1)}k</p>
            <p className="text-xs text-purple-400/70 mt-2">Ekuitas akun</p>
          </div>

          {/* Risk per Trade Card */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-5 md:p-6 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Risk/Trade</h3>
              <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                <Target className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-orange-300">1%</p>
            <p className="text-xs text-orange-400/70 mt-2">Ukuran posisi</p>
          </div>
        </div>

        {/* Balance Editor Section */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-slate-400 text-sm font-semibold mb-2">💰 Initial Balance</p>
              <p className="text-2xl md:text-3xl font-black text-white">${customBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            {!isEditingBalance ? (
              <button
                onClick={() => {
                  setIsEditingBalance(true);
                  setTempBalance(customBalance.toString());
                }}
                className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Balance
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none w-40"
                  placeholder="Enter amount"
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
                  className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setIsEditingBalance(false)}
                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Trades Section */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 md:px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-850">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              Transaksi Terbaru
            </h2>
          </div>
          
          {recentTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Pair</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Posisi</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Hasil</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold hidden md:table-cell">Pip</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 md:px-6 py-3 font-bold text-white">{trade.pair}</td>
                      <td className="px-4 md:px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.posisi === 'BUY' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.posisi}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.hasil === 'WIN' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.hasil}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 hidden md:table-cell text-slate-400 font-mono">
                        {trade.pip > 0 ? '+' : ''}{trade.pip}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-slate-400 text-xs flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trade.tanggal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400 mb-3">Belum ada transaksi. Mulai petualangan trading Anda!</p>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors">
                Catat Transaksi Pertama
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}