'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import TradeJournal from '@/components/TradeJournal';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function JournalPage() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin text-5xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header Section - Soft Glass Premium */}
        <div className="glass-premium rounded-3xl p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="h1 text-amber-400">
                Trading Journal
              </h1>
              <p className="subtitle text-base sm:text-lg mt-2 text-slate-300">
                Catat transaksi, analisis keputusan, dan pantau pertumbuhan Anda
              </p>
            </div>
          </div>
        </div>

        {/* Journal Component */}
        <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <TradeJournal />
        </div>
      </div>
    </div>
  );
}

