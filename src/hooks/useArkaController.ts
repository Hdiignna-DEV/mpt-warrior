'use client';

import { useState, useCallback, useRef } from 'react';
import { CommanderArkaPose } from '@/components/ChatUIEnhancers';

/**
 * useArkaController Hook
 * Centralized controller untuk manage Arka state (pose, opacity, messages)
 * 
 * Provides:
 * - Pose management (vision, victory, warning, onboarding, empty)
 * - Dynamic opacity (ACTIVE, IDLE, SCROLLING, ANALYZING)
 * - Message/speech queue system
 * - Trigger-based animations
 */

interface ArkaMessage {
  text: string;
  duration?: number; // ms, default 3000
  showBalloon?: boolean;
}

interface ArkaState {
  pose: CommanderArkaPose;
  opacity: number;
  isActive: boolean;
  currentMessage?: ArkaMessage;
  isThinking: boolean;
}

const OPACITY_STATES = {
  ACTIVE: 1.0,      // Arka speaking/active
  IDLE: 0.8,        // Normal idle
  SCROLLING: 0.3,   // User viewing content
  ANALYZING: 0.5    // Processing AI response
};

export function useArkaController(initialPose: CommanderArkaPose = 'vision') {
  const [state, setState] = useState<ArkaState>({
    pose: initialPose,
    opacity: OPACITY_STATES.IDLE,
    isActive: false,
    isThinking: false
  });

  const messageQueueRef = useRef<ArkaMessage[]>([]);
  const opacityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Set pose with optional smooth transition
   */
  const setPose = useCallback((pose: CommanderArkaPose) => {
    setState(prev => ({
      ...prev,
      pose
    }));
  }, []);

  /**
   * Set opacity state
   */
  const setOpacity = useCallback((opacityLevel: number | keyof typeof OPACITY_STATES) => {
    const opacity = typeof opacityLevel === 'number' 
      ? opacityLevel 
      : OPACITY_STATES[opacityLevel];
    
    setState(prev => ({
      ...prev,
      opacity
    }));
  }, []);

  /**
   * Speak message with auto-reset after duration
   */
  const speak = useCallback((message: ArkaMessage) => {
    setState(prev => ({
      ...prev,
      currentMessage: message,
      isActive: true,
      opacity: OPACITY_STATES.ACTIVE
    }));

    // Clear existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    // Auto-reset after message duration
    messageTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentMessage: undefined,
        isActive: false,
        opacity: OPACITY_STATES.IDLE
      }));
    }, message.duration || 3000);
  }, []);

  /**
   * Queue multiple messages (will speak sequentially)
   */
  const queueMessages = useCallback((messages: ArkaMessage[]) => {
    messageQueueRef.current = [...messageQueueRef.current, ...messages];
    
    if (!state.isActive) {
      // Start queue processing
      const nextMessage = messageQueueRef.current.shift();
      if (nextMessage) {
        speak(nextMessage);
      }
    }
  }, [state.isActive, speak]);

  /**
   * Trigger victory celebration
   * - Victory pose
   * - Success message
   * - Confetti-ready state
   */
  const triggerVictory = useCallback((message: string, subtext?: string) => {
    setPose('victory');
    speak({
      text: message,
      duration: subtext ? 4000 : 3000,
      showBalloon: true
    });
    
    // Return confetti trigger signal
    return 'confetti';
  }, [setPose, speak]);

  /**
   * Trigger warning state
   * - Warning pose
   * - Alert message
   * - Bounce animation
   */
  const triggerWarning = useCallback((message: string) => {
    setPose('warning');
    speak({
      text: message,
      duration: 4000,
      showBalloon: true
    });
  }, [setPose, speak]);

  /**
   * Trigger vision/analysis state
   * - Vision pose
   * - Shows it's analyzing
   */
  const triggerVision = useCallback(() => {
    setPose('vision');
    setOpacity('ANALYZING');
    setState(prev => ({
      ...prev,
      isThinking: true
    }));
  }, [setPose, setOpacity]);

  /**
   * Reset vision/analyzing state
   */
  const resetVision = useCallback(() => {
    setState(prev => ({
      ...prev,
      isThinking: false
    }));
    setOpacity('IDLE');
  }, [setOpacity]);

  /**
   * Trigger onboarding/welcome
   */
  const triggerOnboarding = useCallback((message: string) => {
    setPose('onboarding');
    speak({
      text: message,
      duration: 4000,
      showBalloon: true
    });
  }, [setPose, speak]);

  /**
   * Handle scroll event (reduce opacity while reading)
   */
  const handleScroll = useCallback(() => {
    setOpacity('SCROLLING');

    // Clear existing timeout
    if (opacityTimeoutRef.current) {
      clearTimeout(opacityTimeoutRef.current);
    }

    // Reset opacity after scroll ends (1s of no scrolling)
    opacityTimeoutRef.current = setTimeout(() => {
      if (!state.isActive && !state.isThinking) {
        setOpacity('IDLE');
      }
    }, 1000);
  }, [state.isActive, state.isThinking, setOpacity]);

  /**
   * Cleanup timeouts
   */
  const cleanup = useCallback(() => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (opacityTimeoutRef.current) clearTimeout(opacityTimeoutRef.current);
  }, []);

  return {
    // State
    ...state,
    
    // Core controls
    setPose,
    setOpacity,
    speak,
    queueMessages,
    
    // Trigger helpers
    triggerVictory,
    triggerWarning,
    triggerVision,
    resetVision,
    triggerOnboarding,
    
    // Event handlers
    handleScroll,
    cleanup
  };
}

export type ArkaController = ReturnType<typeof useArkaController>;
