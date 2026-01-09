'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, Flame } from 'lucide-react';

interface ArkaFeedbackProps {
  rankChange: number | null;
  previousRank: number | null;
  currentRank: number;
  rankTrend: 'UP' | 'DOWN' | 'STABLE';
  consistencyStreak?: number;
  showFeedback?: boolean;
}

/**
 * Leaderboard Arka Feedback Component
 * 
 * Displays contextual feedback using Commander Arka mascot:
 * - Victory: When user ranks up
 * - Warning: When user ranks down or stagnan
 * - Milestone: Consistency streaks, achievements
 */
export const LeaderboardArkaFeedback: React.FC<ArkaFeedbackProps> = ({
  rankChange,
  previousRank,
  currentRank,
  rankTrend,
  consistencyStreak = 0,
  showFeedback = true
}) => {
  const [displayFeedback, setDisplayFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'victory' | 'warning' | 'milestone' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showFeedback) return;

    // Determine feedback based on rank trend
    if (rankTrend === 'UP' && rankChange && rankChange > 0) {
      setFeedbackType('victory');
      
      if (rankChange >= 10) {
        setMessage(`🎉 LUAR BIASA! Anda lonjakan ${rankChange} posisi menjadi peringkat #${currentRank}!\n\nTerus pertahankan konsistensi dan kedisiplinan. Anda sedang dalam momentum terbaik!`);
      } else if (rankChange >= 5) {
        setMessage(`🎖️ Selamat! Anda naik ${rankChange} posisi ke peringkat #${currentRank}!\n\nKeuntungan Anda berasal dari konsistensi. Jangan hentikan momentum ini!`);
      } else {
        setMessage(`✨ Bagus! Anda naik ke peringkat #${currentRank}.\n\nTetap fokus pada disiplin journaling dan pembelajaran modul.`);
      }

      setDisplayFeedback(true);
      const timer = setTimeout(() => setDisplayFeedback(false), 8000);
      return () => clearTimeout(timer);
    }

    // Rank down or stagnant warning
    if ((rankTrend === 'DOWN' || rankTrend === 'STABLE') && previousRank) {
      if (rankTrend === 'DOWN') {
        setFeedbackType('warning');
        const rankDrop = currentRank - previousRank;
        setMessage(`⚠️ Waspada Warrior! Peringkat Anda turun ${rankDrop} posisi ke #${currentRank}.\n\nKompetisi semakin ketat. Review modul trading strategy dan tingkatkan konsistensi jurnal Anda!`);
      } else if (rankTrend === 'STABLE' && previousRank > 20) {
        // Stagnant for many weeks
        setFeedbackType('warning');
        setMessage(`😐 Peringkat Anda stagnan di #${currentRank}.\n\nBuat perubahan: Fokus pada area yang lemah di radar chart, tulis jurnal lebih detail, dan praktikkan setup yang dipelajari.`);
      }

      if (feedbackType) {
        setDisplayFeedback(true);
        const timer = setTimeout(() => setDisplayFeedback(false), 10000);
        return () => clearTimeout(timer);
      }
    }

    // Consistency milestones
    if (consistencyStreak && consistencyStreak > 0) {
      if (consistencyStreak % 7 === 0 && consistencyStreak > 0) {
        setFeedbackType('milestone');
        const weeks = Math.floor(consistencyStreak / 7);
        setMessage(`🔥 MILESTONE! ${consistencyStreak} hari konsisten menulis jurnal (${weeks} minggu penuh)!\n\nIni adalah disiplin sejati dari seorang Warrior! Teruskan untuk mencapai consistency king.`);
        
        setDisplayFeedback(true);
        const timer = setTimeout(() => setDisplayFeedback(false), 7000);
        return () => clearTimeout(timer);
      }

      if (consistencyStreak === 30) {
        setFeedbackType('milestone');
        setMessage(`🏆 LUAR BIASA! 30 hari penuh konsistensi!\n\nAnda telah membuktikan komitmen terhadap trading plan. Ini adalah fondasi kesuksesan jangka panjang.`);
        
        setDisplayFeedback(true);
        const timer = setTimeout(() => setDisplayFeedback(false), 7000);
        return () => clearTimeout(timer);
      }
    }
  }, [rankTrend, rankChange, currentRank, previousRank, feedbackType, consistencyStreak, showFeedback]);

  if (!displayFeedback || !feedbackType) {
    return null;
  }

  // Get mascot image
  const mascotImage = feedbackType === 'victory' 
    ? '/images/mascots/commander-arka-victory.png'
    : feedbackType === 'warning'
    ? '/images/mascots/commander-arka-warning.png'
    : '/images/mascots/commander-arka-victory.png';

  // Get styles based on feedback type
  const getStyles = () => {
    switch (feedbackType) {
      case 'victory':
        return {
          bgClass: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-l-4 border-green-500',
          iconBg: 'bg-green-500/20',
          textColor: 'text-green-300',
          accentColor: 'text-green-400'
        };
      case 'warning':
        return {
          bgClass: 'bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-l-4 border-orange-500',
          iconBg: 'bg-orange-500/20',
          textColor: 'text-orange-300',
          accentColor: 'text-orange-400'
        };
      case 'milestone':
        return {
          bgClass: 'bg-gradient-to-br from-red-900/40 to-pink-900/40 border-l-4 border-red-500',
          iconBg: 'bg-red-500/20',
          textColor: 'text-red-300',
          accentColor: 'text-red-400'
        };
      default:
        return {
          bgClass: 'bg-gray-800/40 border-l-4 border-gray-500',
          iconBg: 'bg-gray-500/20',
          textColor: 'text-gray-300',
          accentColor: 'text-gray-400'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <div className={`${styles.bgClass} rounded-lg p-4 shadow-xl border`}>
        <div className="flex gap-4">
          {/* Mascot Image */}
          <div className="flex-shrink-0">
            <div className={`${styles.iconBg} rounded-lg p-2 h-16 w-16 flex items-center justify-center`}>
              <Image
                src={mascotImage}
                alt="Commander Arka"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 space-y-2">
            {/* Feedback Type Badge */}
            <div className="flex items-center gap-2">
              {feedbackType === 'victory' && (
                <>
                  <ArrowUp size={16} className={styles.accentColor} />
                  <span className={`text-xs font-bold ${styles.accentColor}`}>RANKED UP!</span>
                </>
              )}
              {feedbackType === 'warning' && (
                <>
                  <ArrowDown size={16} className={styles.accentColor} />
                  <span className={`text-xs font-bold ${styles.accentColor}`}>PERHATIAN</span>
                </>
              )}
              {feedbackType === 'milestone' && (
                <>
                  <Flame size={16} className={styles.accentColor} />
                  <span className={`text-xs font-bold ${styles.accentColor}`}>MILESTONE!</span>
                </>
              )}
            </div>

            {/* Main Message */}
            <p className={`text-sm font-semibold ${styles.textColor} whitespace-pre-line leading-relaxed`}>
              {message}
            </p>

            {/* Call to Action */}
            <div className="text-xs text-gray-400 pt-1">
              {feedbackType === 'victory' && '→ Terus pertahankan momentum'}
              {feedbackType === 'warning' && '→ Review modul & tingkatkan konsistensi'}
              {feedbackType === 'milestone' && '→ Target consistency king level!'}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setDisplayFeedback(false)}
            className="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Animated background effect */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className={`absolute inset-0 ${styles.bgClass} opacity-0 animate-pulse`} />
        </div>
      </div>

      {/* Celebration particles on victory */}
      {feedbackType === 'victory' && <VictoryParticles />}
    </div>
  );
};

/**
 * Victory celebration particles
 */
const VictoryParticles: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`absolute bottom-4 right-4 text-2xl animate-bounce`}
          style={{
            animation: `float-up ${2 + i * 0.2}s ease-out forwards`,
            animationDelay: `${i * 0.1}s`,
            marginLeft: `${(i - 2) * 15}px`
          }}
        >
          ✨
        </div>
      ))}

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) translateX(var(--tx, 0));
          }
        }
      `}</style>
    </>
  );
};

export default LeaderboardArkaFeedback;
