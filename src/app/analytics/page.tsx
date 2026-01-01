'use client';

import { useEffect, useState } from 'react';
import Statistics from '@/components/Statistics';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">📊 Analytics & Statistics</h1>
          <p className="text-slate-400">Detailed performance analysis of your trading history</p>
        </div>

        {trades.length === 0 ? (
          <div className="bg-slate-800/50 border-2 border-yellow-500 rounded-xl p-8 text-center">
            <p className="text-3xl mb-4">📈</p>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">No Trades Yet</h2>
            <p className="text-slate-400">
              Start adding trades to see detailed analytics and statistics
            </p>
          </div>
        ) : (
          <Statistics trades={trades} balance={balance} />
        )}
      </div>
    </div>
  );
}
