'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LeaderboardArkaTriggerProps {
  message: string;
  pose: 'victory' | 'celebrate' | 'excited' | 'clap';
  isVisible?: boolean;
  onClose?: () => void;
}

export function LeaderboardArkaTrigger({
  message,
  pose = 'victory',
  isVisible = true,
  onClose,
}: LeaderboardArkaTriggerProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Get appropriate emoji pose based on pose type
  const getPoseEmoji = () => {
    switch (pose) {
      case 'victory':
        return '🎉';
      case 'celebrate':
        return '🥳';
      case 'excited':
        return '⚡';
      case 'clap':
        return '👏';
      default:
        return '😊';
    }
  };

  // Get animation variants based on pose
  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0, scale: 0.8, y: 50 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          type: 'spring', 
          stiffness: 300, 
          damping: 20 
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: -50,
        transition: { duration: 0.3 }
      },
    };

    return baseVariants;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getAnimationVariants()}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 border-2 border-yellow-300 rounded-2xl p-6 shadow-2xl shadow-orange-500/50 backdrop-blur-sm">
            {/* Close button */}
            <button
              onClick={() => {
                setShow(false);
                onClose?.();
              }}
              className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              {/* Arka Pose Emoji */}
              <motion.div
                animate={pose === 'victory' || pose === 'celebrate' ? { y: [0, -8, 0] } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-5xl flex-shrink-0"
              >
                {getPoseEmoji()}
              </motion.div>

              {/* Message */}
              <div className="flex-1 text-white">
                <p className="font-bold text-lg leading-tight">{message}</p>
                <p className="text-xs text-white/80 mt-2">
                  {pose === 'victory' && 'Pose: Victory! 🏆'}
                  {pose === 'celebrate' && 'Pose: Celebrate! 🎊'}
                  {pose === 'excited' && 'Pose: Excited! ✨'}
                  {pose === 'clap' && 'Pose: Clap! 👏'}
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute top-2 left-2 text-2xl opacity-30"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-2 right-2 text-2xl opacity-30"
            >
              ✨
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 origin-left rounded-b-2xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to use with useLeaderboardRankTrigger
 */
export function useArkaTriggerNotification() {
  const [notification, setNotification] = useState<{
    message: string;
    pose: 'victory' | 'celebrate' | 'excited' | 'clap';
  } | null>(null);

  const showNotification = (
    message: string,
    pose: 'victory' | 'celebrate' | 'excited' | 'clap' = 'victory'
  ) => {
    setNotification({ message, pose });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    closeNotification,
  };
}
