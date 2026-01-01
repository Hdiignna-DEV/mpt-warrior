'use client';

import { useEffect, useState } from 'react';
import TradeJournal from '@/components/TradeJournal';

export default function JournalPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
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
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">📖 Trading Journal</h1>
          <p className="text-slate-400">Document your trades, analyze decisions, and track your growth</p>
        </div>

        <TradeJournal />
      </div>
    </div>
  );
}

