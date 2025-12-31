'use client';
import { TrendingUp, TrendingDown, Target, DollarSign, Award, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    {
      label: 'Win Rate',
      value: '62%',
      change: '+5%',
      icon: Target,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      accentColor: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Total Trades',
      value: '48',
      change: '+12',
      icon: Award,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      accentColor: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Avg Risk',
      value: '1.0%',
      change: '-0.2%',
      icon: DollarSign,
      color: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      accentColor: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Best Pair',
      value: 'XAUUSD',
      change: '+4.2%',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      accentColor: 'from-purple-500 to-pink-500',
    },
  ];

  const recentTrades = [
    { pair: 'XAUUSD', type: 'BUY', result: 'WIN', pips: '+45', date: '2024-01-15', time: '14:30' },
    { pair: 'EURUSD', type: 'SELL', result: 'LOSS', pips: '-20', date: '2024-01-15', time: '12:45' },
    { pair: 'GBPUSD', type: 'BUY', result: 'WIN', pips: '+60', date: '2024-01-14', time: '16:20' },
    { pair: 'USDJPY', type: 'SELL', result: 'WIN', pips: '+35', date: '2024-01-14', time: '09:15' },
    { pair: 'AUDUSD', type: 'BUY', result: 'LOSS', pips: '-15', date: '2024-01-13', time: '13:00' },
  ];

  const weeklyPerformance = [
    { day: 'Mon', profit: 120, trades: 3 },
    { day: 'Tue', profit: -50, trades: 2 },
    { day: 'Wed', profit: 200, trades: 4 },
    { day: 'Thu', profit: 85, trades: 2 },
    { day: 'Fri', profit: 145, trades: 3 },
  ];

  const maxProfit = Math.max(...weeklyPerformance.map(p => p.profit));

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500/20 via-slate-900 to-slate-950 rounded-2xl p-6 md:p-8 border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-slate-400">Welcome back, Warrior. Stay disciplined, stay focused.</p>
          </div>
          <div className="text-right bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">$4,250</div>
            <p className="text-green-400 text-sm font-semibold">+2.1% this week</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 border ${stat.borderColor} hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.accentColor} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                    <Icon size={18} className={stat.textColor} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <span className="text-xs font-semibold text-green-400">
                    {stat.change}
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.accentColor} w-2/3`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Performance & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-slate-800/30 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar size={20} />
            Weekly Performance
          </h2>
          <div className="flex items-end justify-around gap-2 h-40">
            {weeklyPerformance.map((perf, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 hover:shadow-lg ${
                      perf.profit > 0
                        ? 'bg-gradient-to-t from-green-500 to-emerald-500 hover:shadow-green-500/50'
                        : 'bg-gradient-to-t from-red-500 to-orange-500 hover:shadow-red-500/50'
                    }`}
                    style={{
                      height: `${(Math.abs(perf.profit) / Math.max(...weeklyPerformance.map(p => Math.abs(p.profit)))) * 100}%`,
                      minHeight: '8px',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400">{perf.day}</span>
                <span className={`text-xs font-bold ${perf.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${perf.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5 hover:border-green-500/30 transition-all">
            <p className="text-slate-400 text-sm mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-white">$10,250</p>
            <p className="text-green-400 text-xs mt-2">↑ Up $250 this week</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5 hover:border-yellow-500/30 transition-all">
            <p className="text-slate-400 text-sm mb-2">Risk Today</p>
            <p className="text-3xl font-bold text-yellow-400">0.5%</p>
            <p className="text-slate-400 text-xs mt-2">0.5% / 1.0% max</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5 hover:border-blue-500/30 transition-all">
            <p className="text-slate-400 text-sm mb-2">Open Positions</p>
            <p className="text-3xl font-bold text-blue-400">2</p>
            <p className="text-slate-400 text-xs mt-2">XAUUSD, EURUSD</p>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Trades</h2>
          <Link href="/journal" className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            View All →
          </Link>
        </div>
        <div className="space-y-2">
          {recentTrades.map((trade, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0 group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all">
                  <span className="font-bold text-yellow-400">{trade.pair.slice(0, 2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{trade.pair}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        trade.type === 'BUY'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {trade.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{trade.date} at {trade.time}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`font-bold text-lg flex items-center gap-1 ${
                    trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trade.result === 'WIN' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownLeft size={16} />
                  )}
                  {trade.pips}
                </div>
                <p className={`text-xs font-semibold ${trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Ready to Plan Your Next Trade?</h3>
        <p className="text-slate-400 mb-4">Use the Risk Calculator to ensure proper position sizing before every trade.</p>
        <Link
          href="/calculator"
          className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
        >
          Open Calculator
        </Link>
      </div>
    </div>
  );
}