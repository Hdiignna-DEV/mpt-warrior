/**
 * useQuizGrader Hook
 * Handles AI-powered quiz grading with Arka pose reactions
 * 
 * Features:
 * - Submit answer for grading
 * - Get AI-suggested score
 * - Show Arka reactions based on score
 * - Track grading status and errors
 */

'use client';

import { useState, useCallback } from 'react';
import { useArkaPoseController } from './useArkaPoseController';

export interface QuizAnswer {
  questionId: string;
  question: string;
  studentAnswer: string;
  expectedAnswer?: string;
  rubric?: string;
  maxPoints: number;
}

export interface GradingResult {
  questionId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  aiProvider: string;
  gradedAt: Date;
}

interface UseQuizGraderOptions {
  provider?: 'gemini' | 'groq';
  autoReactToScore?: boolean; // Show Arka reactions based on score
}

/**
 * useQuizGrader Hook
 * AI-powered quiz grading with Arka reactions
 */
export function useQuizGrader(options: UseQuizGraderOptions = {}) {
  const {
    provider = 'gemini',
    autoReactToScore = true,
  } = options;

  const {
    triggerVision,
    triggerVictory,
    triggerWarning,
    setPose,
  } = useArkaPoseController();

  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from token
  const getUserId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('mpt_token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.userId || decoded.sub;
    } catch {
      return null;
    }
  }, []);

  /**
   * Grade a quiz answer
   */
  const gradeAnswer = useCallback(
    async (answer: QuizAnswer) => {
      try {
        setIsGrading(true);
        setError(null);
        setResult(null);

        // Show thinking pose
        triggerVision('Evaluating your answer...');

        const id = userId || getUserId();
        if (!id) {
          throw new Error('User not authenticated');
        }

        // Call grading API
        const response = await fetch('/api/ai/quiz/grade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': id,
          },
          body: JSON.stringify({
            ...answer,
            provider,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to grade answer');
        }

        const { data } = await response.json();
        setResult(data);

        // React based on score
        if (autoReactToScore) {
          const percentage = data.percentage;

          if (percentage >= 90) {
            triggerVictory('Excellent work! 🎉');
          } else if (percentage >= 70) {
            triggerVictory('Great job! 👏');
          } else if (percentage >= 50) {
            triggerWarning('Good effort! Keep improving! 💪');
          } else {
            triggerWarning('Let\'s review this together! 📚');
          }
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        triggerWarning(`Error: ${message}`);
        throw err;
      } finally {
        setIsGrading(false);
      }
    },
    [provider, userId, getUserId, triggerVision, triggerVictory, triggerWarning, autoReactToScore]
  );

  /**
   * Grade multiple answers in sequence
   */
  const gradeMultiple = useCallback(
    async (answers: QuizAnswer[]) => {
      const results: GradingResult[] = [];

      for (const answer of answers) {
        try {
          const result = await gradeAnswer(answer);
          results.push(result);
        } catch (err) {
          console.error(`Failed to grade ${answer.questionId}:`, err);
        }
      }

      return results;
    },
    [gradeAnswer]
  );

  /**
   * Calculate average score
   */
  const calculateAverageScore = useCallback(
    (results: GradingResult[]) => {
      if (results.length === 0) return 0;
      const total = results.reduce((sum, r) => sum + r.percentage, 0);
      return Math.round(total / results.length);
    },
    []
  );

  /**
   * Reset grading state
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsGrading(false);
  }, []);

  return {
    // State
    isGrading,
    result,
    error,

    // Methods
    gradeAnswer,
    gradeMultiple,
    calculateAverageScore,
    reset,

    // Helpers
    getScorePercentage: result?.percentage || 0,
    isPassed: (result?.percentage || 0) >= 70,
  };
}

/**
 * useQuizScoreReaction Hook
 * Show Arka reactions based on quiz score
 */
export function useQuizScoreReaction() {
  const {
    triggerVictory,
    triggerWarning,
    triggerEmpty,
  } = useArkaPoseController();

  /**
   * Trigger reaction based on score
   */
  const reactToScore = useCallback(
    (percentage: number, topicsCount?: number) => {
      if (percentage >= 90) {
        triggerVictory(
          topicsCount
            ? `Mastered ${topicsCount} topics! 🏆`
            : 'Excellent work! 🎉'
        );
      } else if (percentage >= 80) {
        triggerVictory('Very good! Great understanding! 👏');
      } else if (percentage >= 70) {
        triggerVictory('Good job! You passed! 🎯');
      } else if (percentage >= 50) {
        triggerWarning('Good effort! Let\'s review together. 📚');
      } else {
        triggerWarning('Don\'t give up! Practice more! 💪');
      }
    },
    [triggerVictory, triggerWarning]
  );

  /**
   * Get score badge label
   */
  const getScoreBadgeLabel = useCallback((percentage: number): string => {
    if (percentage >= 90) return '🏆 Excellent';
    if (percentage >= 80) return '⭐ Very Good';
    if (percentage >= 70) return '✅ Good';
    if (percentage >= 50) return '⚠️ Satisfactory';
    return '❌ Needs Work';
  }, []);

  /**
   * Get score color
   */
  const getScoreColor = useCallback((percentage: number): string => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }, []);

  return {
    reactToScore,
    getScoreBadgeLabel,
    getScoreColor,
  };
}
