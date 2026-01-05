'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import Statistics from '@/components/Statistics';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(10000);
  const [isLoading, setIsLoading] = useState(true);

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
        const balanceNum = parseFloat(savedBalance);
        setBalance(balanceNum);
      } catch (error) {
        console.error('Error parsing balance:', error);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin text-5xl">⏳</div>
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
          <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <Statistics trades={trades} balance={balance} />
          </div>
        )}
      </div>
    </div>
  );
}
