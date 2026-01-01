'use client';

import { useEffect, useState } from 'react';
import Achievements from '@/components/Achievements';

interface Trade {
  id: string;
  pair: string;
  posisi: 'BUY' | 'SELL';
  hasil: 'WIN' | 'LOSS';
  pip: number;
  tanggal: string;
  catatan: string;
}

export default function AchievementsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('trades');

    if (saved) {
      try {
        const parsedTrades = JSON.parse(saved);
        setTrades(Array.isArray(parsedTrades) ? parsedTrades : []);
      } catch (error) {
        console.error('Error parsing trades:', error);
        setTrades([]);
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">🏆 Achievements & Badges</h1>
          <p className="text-slate-400">Unlock badges and track your progress as a warrior trader</p>
        </div>

        <Achievements trades={trades} />
      </div>
    </div>
  );
}
