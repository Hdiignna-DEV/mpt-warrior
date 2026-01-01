'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TrendingUp, Target, DollarSign, Award, RefreshCw, Edit2, X, Check, Zap, TrendingDown, Calendar } from 'lucide-react';

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
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Welcome Back, Warrior! 🚀</h1>
              <p className="text-slate-400 text-lg">Track your progress, improve your craft, dominate the market.</p>
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
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 flex-shrink-0"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
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
            <p className="text-xs text-blue-400/70 mt-2">Trading sessions</p>
          </div>

          {/* Win Rate Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 md:p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Win Rate</h3>
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <Award className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-green-300">{winRate}%</p>
            <p className="text-xs text-green-400/70 mt-2">Winning rate</p>
          </div>

          {/* Current Balance Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 md:p-6 hover:border-purple-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-400 font-semibold text-sm">Balance</h3>
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-purple-300">${(customBalance / 1000).toFixed(1)}k</p>
            <p className="text-xs text-purple-400/70 mt-2">Account equity</p>
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
            <p className="text-xs text-orange-400/70 mt-2">Position size</p>
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
              Recent Trades
            </h2>
          </div>
          
          {recentTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Pair</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Position</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Result</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold hidden md:table-cell">Pips</th>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-400 font-semibold">Date</th>
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
              <p className="text-slate-400 mb-3">No trades yet. Start your trading journey!</p>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors">
                Log Your First Trade
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
            </button>
            ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveBalance}
                className="p-2 sm:p-2.5 md:p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 text-sm sm:text-base"
              >
                <Check size={18} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline font-bold">Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 sm:p-2.5 md:p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex-shrink-0"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mt-3">
          📝 Sesuaikan dengan modal awal Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-12">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <StatSkeleton key={i} />
            ))}
          </>
        ) : (
          stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 md:p-6 border ${stat.borderColor} backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer group overflow-hidden relative`}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
                
                <div className="relative z-10">
                  <div className={`${stat.iconBg} w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 border border-white/10`}>
                    <Icon className={stat.iconColor} size={24} />
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Additional Metrics */}
      {!isLoading && totalTrades > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Total Pips</p>
            <p className={`text-2xl font-black ${totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPips >= 0 ? '+' : ''}{totalPips}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ≈ ${(totalPips * 10).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Avg Win</p>
            <p className="text-2xl font-black text-green-400">+{avgPipsPerWin} pips</p>
            <p className="text-xs text-slate-500 mt-1">
              ≈ ${(avgPipsPerWin * 10).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Avg Loss</p>
            <p className="text-2xl font-black text-red-400">-{avgPipsPerLoss} pips</p>
            <p className="text-xs text-slate-500 mt-1">
              ≈ ${(avgPipsPerLoss * 10).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      )}

      {/* Recent Trades Section */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-yellow-400">📊</span> Recent Trades
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-800/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : totalTrades === 0 ? (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg mb-2">Belum ada trade yang dicatat</p>
            <p className="text-slate-500 text-sm mb-6">Mulai journey trading Anda dengan mencatat trade pertama!</p>
            <a
              href="/journal"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Log Trade Pertama →
            </a>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentTrades.map((trade, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-lg">{trade.pair}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.posisi === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                    }`}>
                      {trade.posisi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{trade.tanggal}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${trade.hasil === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.hasil}
                      </span>
                      <span className={`text-base font-black ${trade.pip > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pip > 0 ? '+' : ''}{trade.pip}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 text-left text-sm">
                    <th className="pb-3 text-slate-400 font-semibold">Pair</th>
                    <th className="pb-3 text-slate-400 font-semibold">Type</th>
                    <th className="pb-3 text-slate-400 font-semibold">Result</th>
                    <th className="pb-3 text-slate-400 font-semibold">Pips</th>
                    <th className="pb-3 text-slate-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade, idx) => (
                    <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition">
                      <td className="py-4 font-bold text-white">{trade.pair}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          trade.posisi === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                        }`}>
                          {trade.posisi}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`font-bold ${trade.hasil === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.hasil}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-lg">
                        <span className={trade.pip > 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.pip > 0 ? '+' : ''}{trade.pip}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400 text-sm">{trade.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-8 md:mt-12 bg-gradient-to-r from-yellow-500/10 to-slate-900/40 rounded-2xl border border-yellow-500/20 p-6 md:p-8 text-center">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">
          {totalTrades === 0 ? 'Ready to Start Your Journey?' : 'Ready to Log Your Next Trade?'}
        </h3>
        <p className="text-slate-400 text-sm md:text-base mb-4">
          {totalTrades === 0 
            ? 'Track every trade, analyze your performance, and become a disciplined trader.' 
            : 'Keep the momentum going. Every trade logged is a step towards mastery.'}
        </p>
        <a
          href="/journal"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 md:py-3 px-6 md:px-8 rounded-xl transition-colors"
        >
          Go to Trading Journal →
        </a>
      </div>
    </div>
  );
}