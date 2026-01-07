'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import Statistics from '@/components/Statistics';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import WinLossChart from '@/components/charts/WinLossChart';
import PLTrendChart from '@/components/charts/PLTrendChart';
import MonthlyPerformanceChart from '@/components/charts/MonthlyPerformanceChart';
import { StatCardSkeleton } from '@/components/ui/Skeleton';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string; // ISO date string from API
  catatan: string;
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(10000);
  const [isLoading, setIsLoading] = useState(true);

  // Load trades from API
  const loadTrades = async () => {
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
        // Map API response to analytics format
        const mappedTrades = data.trades.map((t: any) => ({
          id: t.id,
          pair: t.pair,
          posisi: t.position,
          hasil: t.result,
          pip: t.pips,
          tanggal: t.tradeDate, // Keep ISO date string
          catatan: t.notes || '',
        }));
        setTrades(mappedTrades);
      }
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Load trades from API
    loadTrades();
    
    // Load balance from localStorage
    const savedBalance = localStorage.getItem('mpt_initial_balance');
    if (savedBalance) {
      try {
        const balanceNum = parseFloat(savedBalance);
        setBalance(balanceNum);
      } catch (error) {
        console.error('Error parsing balance:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Listen for custom event when trades updated
  useEffect(() => {
    const handleTradesUpdate = () => {
      loadTrades();
    };

    window.addEventListener('tradesUpdated', handleTradesUpdate);

    return () => {
      window.removeEventListener('tradesUpdated', handleTradesUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-80 animate-pulse"></div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-80 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header Section - Soft Glass Premium */}
        <div className="glass-premium rounded-3xl p-6 sm:p-8 lg:p-10 animate-fadeIn">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-xl group-hover:bg-amber-500/30 transition-all duration-300">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="h1 text-amber-400">
                Analytics & Statistics
              </h1>
              <p className="subtitle text-base sm:text-lg mt-2">
                Analisis performa trading Anda secara mendalam
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {trades.length === 0 ? (
          <Card 
            variant="elevated"
            className="glass-premium text-center py-12 sm:py-16 animate-fadeIn"
          >
            <div className="space-y-4">
              <div className="text-5xl sm:text-6xl">📈</div>
              <h2 className="h2 text-primary-200">Belum Ada Data</h2>
              <p className="subtitle text-base max-w-md mx-auto">
                Mulai catat transaksi Anda untuk melihat analytics dan statistik performa trading secara detail
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fadeIn">
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{trades.length}</p>
                    <p className="text-sm text-gray-400">Total Trades</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {trades.filter(t => t.hasil === 'WIN').length}
                    </p>
                    <p className="text-sm text-gray-400">Wins</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {trades.filter(t => t.hasil === 'LOSS').length}
                    </p>
                    <p className="text-sm text-gray-400">Losses</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {trades.reduce((sum, t) => sum + t.pip, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Total Pips</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              {/* Win/Loss Ratio */}
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Win/Loss Ratio</h3>
                <WinLossChart 
                  wins={trades.filter(t => t.hasil === 'WIN').length}
                  losses={trades.filter(t => t.hasil === 'LOSS').length}
                />
              </Card>

              {/* Monthly Performance */}
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Performance</h3>
                <MonthlyPerformanceChart 
                  data={(() => {
                    const monthlyData: Record<string, number> = {};
                    trades.forEach(trade => {
                      const date = new Date(trade.tanggal);
                      const month = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
                      monthlyData[month] = (monthlyData[month] || 0) + trade.pip;
                    });
                    return Object.entries(monthlyData).map(([month, pnl]) => ({ month, pnl }));
                  })()}
                />
              </Card>
            </div>

            {/* P&L Trend */}
            <Card className="bg-white/5 border-white/10 p-6 mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold text-white mb-4">P&L Trend</h3>
              <PLTrendChart 
                data={trades.map(trade => {
                  const date = new Date(trade.tanggal);
                  return {
                    date: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    pnl: trade.pip
                  };
                })}
              />
            </Card>

            {/* Detailed Statistics */}
            <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
              <Statistics trades={trades} balance={balance} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
