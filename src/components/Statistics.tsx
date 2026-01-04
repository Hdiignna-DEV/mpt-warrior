'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Award, Target, Zap, BarChart3 } from 'lucide-react';
import { calculateAnalytics, getMonthlyStats, getPairStats, getEquityCurve, getDrawdown } from '@/utils/analytics';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

interface StatisticsProps {
  trades: Trade[];
  balance: number;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

export default function Statistics({ trades, balance }: StatisticsProps) {
  const { t } = useTranslation();
  const analytics = useMemo(() => calculateAnalytics(trades), [trades]);
  const monthlyStats = useMemo(() => getMonthlyStats(trades), [trades]);
  const pairStats = useMemo(() => getPairStats(trades), [trades]);
  const equityCurve = useMemo(() => getEquityCurve(trades, balance), [trades, balance]);
  const drawdown = useMemo(() => getDrawdown(trades, balance), [trades, balance]);

  const statCards: StatCard[] = [
    {
      label: t('stats.totalTrades'),
      value: analytics.totalTrades,
      icon: <BarChart3 size={24} />,
      color: 'blue',
    },
    {
      label: t('stats.winRate'),
      value: `${analytics.winRate.toFixed(2)}%`,
      icon: <TrendingUp size={24} />,
      color: 'green',
      trend: analytics.winRate > 50 ? 1 : -1,
    },
    {
      label: t('stats.profitFactor'),
      value: analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2),
      icon: <Award size={24} />,
      color: 'yellow',
    },
    {
      label: t('stats.totalPips'),
      value: analytics.totalPips.toFixed(0),
      icon: <Target size={24} />,
      color: analytics.totalPips >= 0 ? 'green' : 'red',
      trend: analytics.totalPips >= 0 ? 1 : -1,
    },
    {
      label: t('stats.avgPips'),
      value: analytics.averagePips.toFixed(2),
      icon: <Zap size={24} />,
      color: analytics.averagePips >= 0 ? 'green' : 'red',
    },
    {
      label: t('stats.maxWins'),
      value: analytics.consecutiveWins,
      icon: <TrendingUp size={24} />,
      color: 'purple',
    },
  ];

  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500 text-blue-400',
      green: 'bg-green-500/20 border-green-500 text-green-400',
      red: 'bg-red-500/20 border-red-500 text-red-400',
      yellow: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
      purple: 'bg-purple-500/20 border-purple-500 text-purple-400',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`border-2 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm transition-all hover:scale-105 ${getColorClass(
              card.color
            )}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm text-slate-400 font-medium" suppressHydrationWarning>{card.label}</p>
                <h3 className="text-3xl font-bold mt-2">
                  {card.value}
                  {card.trend && (
                    <span className="ml-2 text-xl">
                      {card.trend > 0 ? (
                        <TrendingUp size={20} className="inline text-green-400" />
                      ) : (
                        <TrendingDown size={20} className="inline text-red-400" />
                      )}
                    </span>
                  )}
                </h3>
              </div>
              <div className="text-2xl opacity-50">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border-2 border-blue-500 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4">📊 Trade Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-400">Wins</span>
                <span className="font-bold">{analytics.wins}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{
                    width: `${analytics.totalTrades > 0 ? (analytics.wins / analytics.totalTrades) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-400">Losses</span>
                <span className="font-bold">{analytics.losses}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all"
                  style={{
                    width: `${analytics.totalTrades > 0 ? (analytics.losses / analytics.totalTrades) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border-2 border-yellow-500 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">⚠️ Risk Metrics</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Drawdown</span>
                <span className="font-bold text-red-400">${drawdown.drawdown.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {drawdown.drawdownPercent.toFixed(2)}% of initial balance
              </p>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex justify-between text-sm">
                <span>Largest Win</span>
                <span className="font-bold text-green-400">+{analytics.largestWin} pips</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Largest Loss</span>
                <span className="font-bold text-red-400">{analytics.largestLoss} pips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      {Object.keys(monthlyStats).length > 0 && (
        <div className="bg-slate-800/50 border-2 border-purple-500 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4" suppressHydrationWarning>📅 {t('stats.monthlyPerformance')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400" suppressHydrationWarning>{t('journal.date')}</th>
                  <th className="text-center py-2 px-3 text-slate-400" suppressHydrationWarning>{t('stats.totalTrades')}</th>
                  <th className="text-center py-2 px-3 text-slate-400" suppressHydrationWarning>{t('stats.winRate')}</th>
                  <th className="text-center py-2 px-3 text-slate-400" suppressHydrationWarning>{t('stats.totalPips')}</th>
                  <th className="text-center py-2 px-3 text-slate-400" suppressHydrationWarning>{t('stats.profitFactor')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(monthlyStats)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 6)
                  .map(([month, stats]) => (
                    <tr key={month} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-2 px-3 text-slate-300">{month}</td>
                      <td className="text-center py-2 px-3">{stats.totalTrades}</td>
                      <td className="text-center py-2 px-3">
                        <span className={stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}>
                          {stats.winRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center py-2 px-3">
                        <span className={stats.totalPips >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {stats.totalPips.toFixed(0)}
                        </span>
                      </td>
                      <td className="text-center py-2 px-3 text-yellow-400">
                        {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pair Performance */}
      {Object.keys(pairStats).length > 0 && (
        <div className="bg-slate-800/50 border-2 border-cyan-500 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4" suppressHydrationWarning>💱 {t('stats.pairPerformance')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pairStats)
              .sort(([, a], [, b]) => b.totalTrades - a.totalTrades)
              .map(([pair, stats]) => (
                <div key={pair} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="font-bold text-cyan-300 mb-3">{pair}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span suppressHydrationWarning>{t('stats.totalTrades')}:</span>
                      <span className="font-bold">{stats.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span suppressHydrationWarning>{t('stats.winRate')}:</span>
                      <span className={stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}>
                        {stats.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span suppressHydrationWarning>{t('stats.totalPips')}:</span>
                      <span className={stats.totalPips >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {stats.totalPips.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-2">
                      <span suppressHydrationWarning>{t('stats.profitFactor')}:</span>
                      <span className="text-yellow-400">
                        {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
