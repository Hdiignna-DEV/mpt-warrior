'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ArkaMascotFeedbackProps {
  userName: string;
  rankTrend: 'UP' | 'DOWN' | 'STABLE';
  currentRank: number;
  previousRank: number | null;
  totalPoints: number;
}

export function ArkaMascotFeedback({
  userName,
  rankTrend,
  currentRank,
  previousRank,
  totalPoints
}: ArkaMascotFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setAnimate(true);
  }, []);

  if (!isVisible) return null;

  // Determine Arka's mood and message based on rank trend
  const getRankDetails = () => {
    if (rankTrend === 'UP' && previousRank) {
      const improvement = previousRank - currentRank;
      return {
        mood: 'victory',
        title: '🎉 Selamat, Warrior!',
        message: `Anda naik ${improvement} peringkat! Dari #${previousRank} ke #${currentRank}. Momentum bagus, terus pertahankan!`,
        bgColor: 'from-green-400 to-emerald-500',
        textColor: 'text-green-900',
        arkaExpression: '😄'
      };
    } else if (rankTrend === 'DOWN' && previousRank && currentRank > previousRank) {
      const drop = currentRank - previousRank;
      return {
        mood: 'warning',
        title: '⚠️ Waspada, Warrior!',
        message: `Peringkat turun ${drop} posisi. Review strategi Anda di modul. Kompetisi semakin ketat—level up konsistensi Anda!`,
        bgColor: 'from-orange-400 to-red-500',
        textColor: 'text-orange-900',
        arkaExpression: '😟'
      };
    } else {
      return {
        mood: 'stable',
        title: '💪 Tetap Fokus, Warrior!',
        message: `Posisi stabil di #${currentRank}. Jangan puas diri! Tingkatkan konsistensi dan disiplin untuk naik level.`,
        bgColor: 'from-blue-400 to-indigo-500',
        textColor: 'text-blue-900',
        arkaExpression: '😊'
      };
    }
  };

  const details = getRankDetails();

  return (
    <div
      className={`fixed bottom-0 right-0 max-w-sm w-full md:max-w-md animate-fade-in z-40 transition-all duration-500 ${
        animate ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Arka Mascot Container */}
      <div className={`bg-gradient-to-r ${details.bgColor} p-6 rounded-t-3xl shadow-2xl`}>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Mascot & Message */}
        <div className="flex gap-4">
          {/* Arka Face */}
          <div className="flex-shrink-0 text-5xl">
            {details.arkaExpression}
          </div>

          {/* Message */}
          <div className="flex-1 space-y-2">
            <h3 className={`text-xl font-bold ${details.textColor}`}>
              {details.title}
            </h3>
            <p className={`text-sm ${details.textColor} opacity-90 leading-relaxed`}>
              {details.message}
            </p>

            {/* Quick Stats */}
            <div className="flex gap-3 mt-4 pt-3 border-t border-white/20">
              <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                <p className={`text-xs ${details.textColor} opacity-75`}>Rank</p>
                <p className={`font-bold ${details.textColor}`}>#{currentRank}</p>
              </div>
              <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                <p className={`text-xs ${details.textColor} opacity-75`}>Points</p>
                <p className={`font-bold ${details.textColor}`}>{totalPoints}</p>
              </div>
              <div className="flex-1 bg-white/20 rounded-lg p-2 text-center">
                <p className={`text-xs ${details.textColor} opacity-75`}>Trend</p>
                <p className={`font-bold ${details.textColor}`}>
                  {rankTrend === 'UP' ? '📈' : rankTrend === 'DOWN' ? '📉' : '➡️'}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="w-full mt-4 bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              Lihat Leaderboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
