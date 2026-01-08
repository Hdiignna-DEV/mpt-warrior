/**
 * FASE 2.6.4: Discipline Metrics
 * Dashboard components for emotion tracking and discipline trending
 */

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface TradeData {
  id: string;
  emotion?: 'Tenang' | 'Takut' | 'Serakah';
  disciplineScore?: number;
  resultado?: 'WIN' | 'LOSS';
  pips?: number;
  tradeDate?: string;
}

interface DisciplineMetricsProps {
  trades: TradeData[];
  currency?: string;
}

/**
 * Emotion Distribution - Pie Chart Data
 */
export function EmotionDistribution({ trades }: { trades: TradeData[] }) {
  const [emotionStats, setEmotionStats] = useState({
    tenang: 0,
    takut: 0,
    serakah: 0,
  });

  useEffect(() => {
    const stats = {
      tenang: trades.filter(t => t.emotion === 'Tenang').length,
      takut: trades.filter(t => t.emotion === 'Takut').length,
      serakah: trades.filter(t => t.emotion === 'Serakah').length,
    };
    setEmotionStats(stats);
  }, [trades]);

  const total = emotionStats.tenang + emotionStats.takut + emotionStats.serakah || 1;
  const tenangPercent = Math.round((emotionStats.tenang / total) * 100);
  const takutPercent = Math.round((emotionStats.takut / total) * 100);
  const serakahPercent = Math.round((emotionStats.serakah / total) * 100);

  return (
    <Card className="border-blue-500/30 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart size={18} className="text-blue-400" />
          Emotion Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Tenang */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">😌 Tenang (Calm)</span>
              <span className="text-blue-400 font-bold">{emotionStats.tenang}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${tenangPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{tenangPercent}% of trades</p>
          </div>

          {/* Takut */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">😨 Takut (Fear)</span>
              <span className="text-yellow-400 font-bold">{emotionStats.takut}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{ width: `${takutPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{takutPercent}% of trades</p>
          </div>

          {/* Serakah */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">🤑 Serakah (Greed)</span>
              <span className="text-red-400 font-bold">{emotionStats.serakah}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${serakahPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{serakahPercent}% of trades</p>
          </div>

          {/* Insight */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700 text-xs text-slate-300">
            <p className="font-semibold text-blue-400 mb-1">💡 Insight:</p>
            {tenangPercent > 60 && <p>✅ Great discipline! You maintain calm in most trades.</p>}
            {takutPercent > 40 && <p>⚠️ Consider: Fear-based trades often miss opportunities.</p>}
            {serakahPercent > 40 && <p>🚨 Alert: Greed leads to over-leverage. Stick to 1-2% risk!</p>}
            {tenangPercent > 40 && tenangPercent <= 60 && <p>📊 Moderate discipline. Keep improving emotional control.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Discipline Score Trend - Line Chart Data
 */
export function DisciplineTrend({ trades }: { trades: TradeData[] }) {
  const [averageScores, setAverageScores] = useState<number[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<
    Array<{ week: string; score: number; count: number }>
  >([]);

  useEffect(() => {
    // Calculate weekly average discipline scores
    const now = new Date();
    const weeks = [];

    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekTrades = trades.filter(t => {
        if (!t.tradeDate) return false;
        const tradeDate = new Date(t.tradeDate);
        return tradeDate >= weekStart && tradeDate < weekEnd;
      });

      const avgScore =
        weekTrades.length > 0
          ? Math.round(
              weekTrades.reduce((sum, t) => sum + (t.disciplineScore || 0), 0) /
                weekTrades.length
            )
          : 0;

      weeks.push({
        week: `W${i + 1}`,
        score: avgScore,
        count: weekTrades.length,
      });
    }

    setWeeklyTrend(weeks);
    setAverageScores(weeks.map(w => w.score));
  }, [trades]);

  const overallAvg =
    trades.length > 0
      ? Math.round(
          trades.reduce((sum, t) => sum + (t.disciplineScore || 0), 0) /
            trades.length
        )
      : 0;

  const trend =
    weeklyTrend.length > 0
      ? weeklyTrend[weeklyTrend.length - 1].score - weeklyTrend[0].score
      : 0;

  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-green-400" />
            Discipline Trend
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Overall:</span>
            <span className={`text-lg font-bold ${overallAvg >= 70 ? 'text-green-400' : overallAvg >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {overallAvg}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Weekly Bars */}
          <div className="flex items-end gap-2 h-20">
            {weeklyTrend.map((week, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-full rounded-t transition-all group-hover:opacity-80 ${
                    week.score >= 70
                      ? 'bg-green-500'
                      : week.score >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ height: `${Math.max(week.score, 10)}%` }}
                  title={`${week.week}: ${week.score}% (${week.count} trades)`}
                />
                <span className="text-xs text-slate-500">{week.week}</span>
              </div>
            ))}
          </div>

          {/* Trend Arrow */}
          <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700">
            <span className="text-sm text-slate-300">Weekly Trend:</span>
            <div className="flex items-center gap-2">
              {trend > 0 ? (
                <>
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">+{trend}%</span>
                </>
              ) : trend < 0 ? (
                <>
                  <TrendingDown size={16} className="text-red-400" />
                  <span className="text-sm font-bold text-red-400">{trend}%</span>
                </>
              ) : (
                <span className="text-sm text-slate-400">Stable</span>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-800/50 rounded">
              <p className="text-xs text-slate-500">Best Week</p>
              <p className="text-lg font-bold text-green-400">
                {Math.max(...averageScores, 0)}%
              </p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded">
              <p className="text-xs text-slate-500">Worst Week</p>
              <p className="text-lg font-bold text-red-400">
                {Math.min(...averageScores.filter(s => s > 0), 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Emotion-Performance Correlation
 */
export function EmotionPerformance({ trades }: { trades: TradeData[] }) {
  const [emotionStats, setEmotionStats] = useState({
    tenang: { wins: 0, losses: 0, winRate: 0 },
    takut: { wins: 0, losses: 0, winRate: 0 },
    serakah: { wins: 0, losses: 0, winRate: 0 },
  });

  useEffect(() => {
    const stats = {
      tenang: {
        wins: trades.filter(t => t.emotion === 'Tenang' && t.resultado === 'WIN').length,
        losses: trades.filter(t => t.emotion === 'Tenang' && t.resultado === 'LOSS').length,
        winRate: 0,
      },
      takut: {
        wins: trades.filter(t => t.emotion === 'Takut' && t.resultado === 'WIN').length,
        losses: trades.filter(t => t.emotion === 'Takut' && t.resultado === 'LOSS').length,
        winRate: 0,
      },
      serakah: {
        wins: trades.filter(t => t.emotion === 'Serakah' && t.resultado === 'WIN').length,
        losses: trades.filter(t => t.emotion === 'Serakah' && t.resultado === 'LOSS').length,
        winRate: 0,
      },
    };

    // Calculate win rates
    Object.keys(stats).forEach((emotion: string) => {
      const key = emotion as keyof typeof stats;
      const total = stats[key].wins + stats[key].losses;
      stats[key].winRate = total > 0 ? Math.round((stats[key].wins / total) * 100) : 0;
    });

    setEmotionStats(stats);
  }, [trades]);

  return (
    <Card className="border-purple-500/30 bg-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-400" />
          Emotion vs Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Tenang */}
          <div className="p-3 bg-slate-800/50 rounded border border-blue-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-300">😌 Tenang</span>
              <span className={`text-lg font-bold ${emotionStats.tenang.winRate >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                {emotionStats.tenang.winRate}%
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {emotionStats.tenang.wins}W / {emotionStats.tenang.losses}L
            </div>
          </div>

          {/* Takut */}
          <div className="p-3 bg-slate-800/50 rounded border border-yellow-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-yellow-300">😨 Takut</span>
              <span className={`text-lg font-bold ${emotionStats.takut.winRate >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                {emotionStats.takut.winRate}%
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {emotionStats.takut.wins}W / {emotionStats.takut.losses}L
            </div>
          </div>

          {/* Serakah */}
          <div className="p-3 bg-slate-800/50 rounded border border-red-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-red-300">🤑 Serakah</span>
              <span className={`text-lg font-bold ${emotionStats.serakah.winRate >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                {emotionStats.serakah.winRate}%
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {emotionStats.serakah.wins}W / {emotionStats.serakah.losses}L
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-3 p-2 bg-indigo-500/10 border border-indigo-500/30 rounded text-xs text-indigo-300">
            💡 <strong>Best State:</strong> {
              emotionStats.tenang.winRate >= emotionStats.takut.winRate && 
              emotionStats.tenang.winRate >= emotionStats.serakah.winRate
                ? 'Tenang (Calm) - Stick with calm trading!'
                : emotionStats.takut.winRate >= emotionStats.serakah.winRate
                ? 'Takut (Fear) - Surprisingly disciplined!'
                : 'Serakah (Greed) - Risky but profitable?'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
