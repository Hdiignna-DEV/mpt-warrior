'use client';
import { TrendingUp, Target, DollarSign, Award } from 'lucide-react';

export default function Dashboard() {
  // Dummy data
  const stats = [
    {
      label: 'Win Rate',
      value: '68%',
      icon: TrendingUp,
      color: 'from-green-500/20 to-emerald-500/10',
      iconBg: 'bg-green-500/30',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Total Trades',
      value: '47',
      icon: Target,
      color: 'from-blue-500/20 to-cyan-500/10',
      iconBg: 'bg-blue-500/30',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Current Balance',
      value: '$12,480',
      icon: DollarSign,
      color: 'from-yellow-500/20 to-amber-500/10',
      iconBg: 'bg-yellow-500/30',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'Best Streak',
      value: '12 Wins',
      icon: Award,
      color: 'from-purple-500/20 to-pink-500/10',
      iconBg: 'bg-purple-500/30',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
  ];

  const recentTrades = [
    { pair: 'XAUUSD', type: 'BUY', result: 'WIN', pips: '+35', date: '2024-12-30' },
    { pair: 'EURUSD', type: 'SELL', result: 'LOSS', pips: '-20', date: '2024-12-29' },
    { pair: 'GBPUSD', type: 'BUY', result: 'WIN', pips: '+42', date: '2024-12-29' },
    { pair: 'XAUUSD', type: 'SELL', result: 'WIN', pips: '+28', date: '2024-12-28' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-24 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="p-2 md:p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <Target className="text-yellow-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white">Command Center</h1>
            <p className="text-slate-400 text-sm md:text-base">Your tactical overview, Warrior. Stay disciplined, stay profitable.</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-500 via-slate-700 to-transparent rounded-full"></div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 md:p-6 border ${stat.borderColor} backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer group overflow-hidden`}
            >
              {/* Background accent */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`${stat.iconBg} w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 border border-white/10`}>
                  <Icon className={`${stat.iconColor}`} size={24} />
                </div>
                <p className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl md:text-3xl font-black text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Trades Section */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-5 md:p-8 backdrop-blur-sm">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-yellow-400">📊</span> Recent Trades
        </h2>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {recentTrades.map((trade, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-lg">{trade.pair}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  trade.type === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                }`}>
                  {trade.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">{trade.date}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.result}
                  </span>
                  <span className={`text-base font-black ${trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pips}
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
                      trade.type === 'BUY' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`font-bold ${trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.result}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-lg">
                    <span className={trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                      {trade.pips}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 text-sm">{trade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 md:mt-12 bg-gradient-to-r from-yellow-500/10 to-slate-900/40 rounded-2xl border border-yellow-500/20 p-6 md:p-8 text-center">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">Ready to Log Your Next Trade?</h3>
        <p className="text-slate-400 text-sm md:text-base mb-4">Head to Trading Journal to record your trades and track progress.</p>
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