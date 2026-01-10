/**
 * useArkaPoseController Hook
 * Manages Commander Arka pose changes based on triggers (API calls, achievements, errors, etc)
 * 
 * Usage:
 * const { pose, triggerVision, triggerVictory, triggerWarning, resetPose } = useArkaPoseController();
 * 
 * Features:
 * - Automatic pose transitions based on events
 * - Customizable timing for pose display
 * - Chat context awareness
 * - Visual feedback system
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Type definitions
export type CommanderArkaPose = 'empty' | 'onboarding' | 'vision' | 'victory' | 'warning';

interface PoseTransition {
  pose: CommanderArkaPose;
  duration?: number; // milliseconds to hold this pose
  message?: string;  // Optional message to display
  triggerAnimation?: boolean; // Trigger entrance animation
}

interface UseArkaPoseControllerOptions {
  defaultPose?: CommanderArkaPose;
  autoResetDelay?: number; // Auto reset to default after trigger (ms)
  onPoseChange?: (pose: CommanderArkaPose) => void;
}

/**
 * useArkaPoseController Hook
 * Main hook for managing Arka's poses and expressions
 */
export function useArkaPoseController(
  options: UseArkaPoseControllerOptions = {}
) {
  const {
    defaultPose = 'vision',
    autoResetDelay = 3000,
    onPoseChange
  } = options;

  const [currentPose, setCurrentPose] = useState<CommanderArkaPose>(defaultPose);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMessage, setDisplayMessage] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Internal method to set pose with auto-reset
   */
  const setPose = useCallback(
    (newPose: CommanderArkaPose, message?: string, shouldAutoReset = true) => {
      setIsTransitioning(true);
      setCurrentPose(newPose);
      
      if (message) {
        setDisplayMessage(message);
      }

      onPoseChange?.(newPose);

      // Auto reset to default pose
      if (shouldAutoReset && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (shouldAutoReset) {
        timeoutRef.current = setTimeout(() => {
          setCurrentPose(defaultPose);
          setDisplayMessage('');
          setIsTransitioning(false);
        }, autoResetDelay);
      } else {
        setIsTransitioning(false);
      }
    },
    [defaultPose, autoResetDelay, onPoseChange]
  );

  /**
   * triggerVision: Arka is analyzing or thinking
   * Used: API calls, data processing, chart analysis
   */
  const triggerVision = useCallback((message?: string) => {
    setPose('vision', message || '📊 Analyzing...', true);
  }, [setPose]);

  /**
   * triggerVictory: Success, achievement, or positive event
   * Used: Trade profit, quiz passed, rank increased, top 3 entry
   */
  const triggerVictory = useCallback((message?: string) => {
    setPose('victory', message || '🎉 Victory!', true);
  }, [setPose]);

  /**
   * triggerWarning: Alert, error, or negative event
   * Used: Loss streak, risk violation, quiz failed, error response
   */
  const triggerWarning = useCallback((message?: string) => {
    setPose('warning', message || '⚠️ Caution!', true);
  }, [setPose]);

  /**
   * triggerOnboarding: Welcome or guidance pose
   * Used: First login, new module unlock, deep link from notification
   */
  const triggerOnboarding = useCallback((message?: string) => {
    setPose('onboarding', message || '👋 Welcome!', false); // Don't auto-reset onboarding
  }, [setPose]);

  /**
   * triggerEmpty: Idle or neutral state
   * Used: Default state when no activity
   */
  const triggerEmpty = useCallback((message?: string) => {
    setPose('empty', message, true);
  }, [setPose]);

  /**
   * Manually set pose without auto-reset
   */
  const setPosePersistent = useCallback((newPose: CommanderArkaPose, message?: string) => {
    setPose(newPose, message, false);
  }, [setPose]);

  /**
   * Reset to default pose immediately
   */
  const resetPose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    setCurrentPose(defaultPose);
    setDisplayMessage('');
    setIsTransitioning(false);
  }, [defaultPose]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  return {
    pose: currentPose,
    message: displayMessage,
    isTransitioning,
    
    // Pose triggers
    triggerVision,
    triggerVictory,
    triggerWarning,
    triggerOnboarding,
    triggerEmpty,
    
    // Manual control
    setPose: setPosePersistent,
    resetPose,
    
    // State
    setMessage: setDisplayMessage,
  };
}

/**
 * Chat-specific Arka controller
 * Integrates with chat flow: user input → API call → response
 */
export function useArkaChatController() {
  const poseController = useArkaPoseController({
    defaultPose: 'vision',
    autoResetDelay: 2000,
  });

  /**
   * Handle API call start
   */
  const onAPICallStart = useCallback(() => {
    poseController.triggerVision('🤔 Thinking...');
  }, [poseController]);

  /**
   * Handle API response success
   */
  const onAPICallSuccess = useCallback((responseLength: number) => {
    const message = responseLength > 500 
      ? '📝 Long response incoming...' 
      : '✅ Got it!';
    poseController.triggerVictory(message);
  }, [poseController]);

  /**
   * Handle API error
   */
  const onAPICallError = useCallback((error: Error) => {
    poseController.triggerWarning(`❌ Error: ${error.message.slice(0, 30)}`);
  }, [poseController]);

  /**
   * Handle typing indicator
   */
  const onUserTyping = useCallback(() => {
    poseController.triggerVision('👂 Listening...');
  }, [poseController]);

  return {
    ...poseController,
    onAPICallStart,
    onAPICallSuccess,
    onAPICallError,
    onUserTyping,
  };
}

/**
 * Leaderboard/Achievement Arka controller
 * Integrates with achievement system: rank changes, milestones, etc
 */
export function useArkaAchievementController() {
  const poseController = useArkaPoseController({
    defaultPose: 'empty',
    autoResetDelay: 4000, // Longer for achievements
  });

  /**
   * Rank increased
   */
  const onRankIncreased = useCallback((newRank: number, previousRank?: number) => {
    const rankEmoji = newRank === 1 ? '👑' : '⬆️';
    const message = previousRank 
      ? `${rankEmoji} Promoted from #${previousRank} to #${newRank}!`
      : `${rankEmoji} You are #${newRank}!`;
    poseController.triggerVictory(message);
  }, [poseController]);

  /**
   * Top 3 achievement
   */
  const onTopThreeEntry = useCallback((rank: number) => {
    const messages = {
      1: '👑 THE CHAMPION! 🏆',
      2: '🥈 GLORY IN 2ND PLACE!',
      3: '🥉 ELITE TOP 3 ACHIEVED!',
    };
    poseController.triggerVictory(messages[rank as keyof typeof messages] || '🎖️ Elite Status!');
  }, [poseController]);

  /**
   * Loss streak warning
   */
  const onLossStreak = useCallback((losses: number) => {
    poseController.triggerWarning(`⚠️ ${losses} losses in a row!`);
  }, [poseController]);

  /**
   * Quiz result - pass
   */
  const onQuizPass = useCallback((score: number) => {
    poseController.triggerVictory(`✅ Passed with ${score}%!`);
  }, [poseController]);

  /**
   * Quiz result - fail
   */
  const onQuizFail = useCallback((score: number) => {
    poseController.triggerWarning(`📚 Review needed! Score: ${score}%`);
  }, [poseController]);

  return {
    ...poseController,
    onRankIncreased,
    onTopThreeEntry,
    onLossStreak,
    onQuizPass,
    onQuizFail,
  };
}

/**
 * Combined Arka controller for dashboard/multiple contexts
 */
export function useArkaCombinedController() {
  const chatController = useArkaChatController();
  const achievementController = useArkaAchievementController();

  return {
    chat: chatController,
    achievement: achievementController,
    pose: chatController.pose, // Default to chat pose
    message: chatController.message,
  };
}
