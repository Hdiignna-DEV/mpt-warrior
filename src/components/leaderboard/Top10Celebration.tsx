'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Sparkles } from 'lucide-react';

interface Top10CelebrationProps {
  show: boolean;
  userName: string;
  rank: number;
  points: number;
  previousRank: number | null;
  onClose: () => void;
}

/**
 * Top 10 Celebration Component
 * Shows celebratory message with Arka mascot when user enters Top 10
 */
export function Top10Celebration({
  show,
  userName,
  rank,
  points,
  previousRank,
  onClose
}: Top10CelebrationProps) {
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  useEffect(() => {
    if (show && !confettiTriggered) {
      // Trigger confetti animation
      triggerConfetti();
      setConfettiTriggered(true);
    }
  }, [show, confettiTriggered]);

  const triggerConfetti = () => {
    // Multiple confetti bursts from different positions
    const confettiPieces = 50;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: confettiPieces,
          spread: 70,
          origin: { x: Math.random(), y: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32'],
        });
      }, i * 300);
    }
  };

  const rankImprovement = previousRank ? previousRank - rank : null;
  const isNewTop10 = previousRank === null || previousRank > 10;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-purple-900/95 via-slate-900/95 to-blue-900/95 border-2 border-yellow-500/60 rounded-2xl p-8 shadow-2xl shadow-yellow-500/30 max-w-md w-full"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.3)',
                    '0 0 40px rgba(255, 215, 0, 0.5)',
                    '0 0 20px rgba(255, 215, 0, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0"
              />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>

            <div className="relative z-10 text-center space-y-6">
              {/* Celebration Emoji Animation */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                👑
              </motion.div>

              {/* Message */}
              <div className="space-y-3">
                {isNewTop10 ? (
                  <>
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-black text-yellow-400 tracking-wider"
                    >
                      🎉 CONGRATULATIONS!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl text-white font-bold"
                    >
                      {userName}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-yellow-300 font-semibold"
                    >
                      You've entered the TOP 10!
                    </motion.p>
                  </>
                ) : (
                  <>
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-black text-green-400 tracking-wider"
                    >
                      🚀 RANK UP!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl text-white font-bold"
                    >
                      {userName}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-green-300 font-semibold"
                    >
                      Improved by {rankImprovement} position{""}!
                    </motion.p>
                  </>
                )}
              </div>

              {/* Stats Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Current Rank:</span>
                  <span className="text-3xl font-black text-yellow-400">#{rank}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Total Points:</span>
                  <span className="text-2xl font-black text-cyan-400">{points.toLocaleString()}</span>
                </div>
              </motion.div>

              {/* Arka Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <p className="text-sm font-bold text-purple-300">Commander Arka says:</p>
                </div>
                <p className="text-sm text-white leading-relaxed italic">
                  "Outstanding performance, warrior! You've proven your commitment to excellence. Keep pushing, and the legendary tier awaits!"
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-500/80 to-amber-500/80 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
