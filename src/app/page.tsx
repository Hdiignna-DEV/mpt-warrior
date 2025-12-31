'use client';
import { TrendingUp, Target, DollarSign, Award } from 'lucide-react';

export default function Dashboard() {
  // Dummy data - nanti diganti dengan data real dari database
  const stats = [
    {
      label: 'Win Rate',
      value: '68%',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Trades',
      value: '127',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Current Balance',
      value: '$5,420',
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Best Streak',
      value: '12 Wins',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const recentTrades = [
    { pair: 'XAUUSD', type: 'BUY', result: 'WIN', pips: '+35', date: '2024-12-30' },
    { pair: 'EURUSD', type: 'SELL', result: 'WIN', pips: '+22', date: '2024-12-29' },
    { pair: 'GBPUSD', type: 'BUY', result: 'LOSS', pips: '-15', date: '2024-12-29' },
    { pair: 'XAUUSD', type: 'SELL', result: 'WIN', pips: '+41', date: '2024-12-28' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2">
          ⚔️ Command Center
        </h1>
        <p className="text-slate-400">
          Your tactical overview, Warrior. Stay disciplined, stay profitable.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Trades */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-yellow-500 mb-6">
          📊 Recent Trades
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="pb-3 text-slate-400 font-medium">Pair</th>
                <th className="pb-3 text-slate-400 font-medium">Type</th>
                <th className="pb-3 text-slate-400 font-medium">Result</th>
                <th className="pb-3 text-slate-400 font-medium">Pips</th>
                <th className="pb-3 text-slate-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade, idx) => (
                <tr key={idx} className="border-b border-slate-800/50">
                  <td className="py-4 font-medium">{trade.pair}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.type === 'BUY'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.result === 'WIN'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {trade.result}
                    </span>
                  </td>
                  <td
                    className={`py-4 font-bold ${
                      trade.pips.startsWith('+')
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {trade.pips}
                  </td>
                  <td className="py-4 text-slate-400">{trade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/journal"
          className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-colors group"
        >
          <p className="text-yellow-500 font-bold mb-2 group-hover:translate-x-1 transition-transform">
            📝 Log New Trade →
          </p>
          <p className="text-slate-400 text-sm">
            Record your latest trading session
          </p>
        </a>
        <a
          href="/calculator"
          className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-colors group"
        >
          <p className="text-blue-500 font-bold mb-2 group-hover:translate-x-1 transition-transform">
            🧮 Calculate Risk →
          </p>
          <p className="text-slate-400 text-sm">
            Get optimal lot size for your trade
          </p>
        </a>
        <a
          href="/ai-mentor"
          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-colors group"
        >
          <p className="text-purple-500 font-bold mb-2 group-hover:translate-x-1 transition-transform">
            🤖 Ask AI Mentor →
          </p>
          <p className="text-slate-400 text-sm">
            Get chart analysis and guidance
          </p>
        </a>
      </div>
    </div>
  );
}