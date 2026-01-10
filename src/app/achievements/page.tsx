'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import Achievements from '@/components/Achievements';
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

export default function AchievementsPage() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('mpt_token');
        const response = await fetch('/api/achievements', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch achievements: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err instanceof Error ? err.message : 'Failed to load achievements');
        // Fallback: try to load from localStorage
        const saved = localStorage.getItem('trades');
        if (saved) {
          try {
            const trades = JSON.parse(saved);
            setData({ trades: Array.isArray(trades) ? trades : [] });
          } catch (e) {
            console.error('Error parsing localStorage:', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchAchievements();
    }
  }, [authLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⏳</div>
          <p className="text-slate-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
          <p className="text-slate-400 text-sm mt-2">Please refresh the page or try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header Section - Soft Glass Premium */}
        <div className="glass-premium rounded-3xl p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-xl">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="h1 text-amber-400">
                Achievements & Badges
              </h1>
              <p className="subtitle text-base sm:text-lg mt-2 text-slate-300">
                Buka badge baru dan pantau progres Anda sebagai trader warrior
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="glass-premium rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{data.totalEarned || 0}</div>
              <div className="text-sm text-slate-400">Badges Earned</div>
            </Card>
            <Card className="glass-premium rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">{data.totalAvailable || 0}</div>
              <div className="text-sm text-slate-400">Available to Earn</div>
            </Card>
            <Card className="glass-premium rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{data.trades || 0}</div>
              <div className="text-sm text-slate-400">Total Trades</div>
            </Card>
          </div>
        )}

        {/* Achievements Component */}
        <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <Achievements data={data} />
        </div>
      </div>
    </div>
  );
}
