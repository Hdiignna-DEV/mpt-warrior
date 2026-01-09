/**
 * Hook: useLeaderboardRankTrigger
 * File: src/hooks/useLeaderboardRankTrigger.ts
 * 
 * Monitors user's leaderboard rank and triggers Arka reaction on milestone events
 * (e.g., entering Top 10, reaching new tier)
 */

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

export interface RankTriggerEvent {
  type: 'TOP_10_ENTRY' | 'TOP_5_ENTRY' | 'TOP_3_ENTRY' | 'RANK_1' | 'TIER_PROMOTION';
  previousRank: number;
  newRank: number;
  previousTier?: string;
  newTier?: string;
  message: string;
  showArka: boolean;
  arkaPose: 'victory' | 'celebrate' | 'excited' | 'clap';
}

export interface RankData {
  rank: number | null;
  points: number | null;
  tier: string;
  previousRank?: number;
}

export function useLeaderboardRankTrigger() {
  const { user } = useAuth();
  const [rankData, setRankData] = useState<RankData>({
    rank: null,
    points: null,
    tier: 'Recruit',
  });
  const [trigger, setTrigger] = useState<RankTriggerEvent | null>(null);
  const previousRankRef = useRef<number | null>(null);
  const previousTierRef = useRef<string>('Recruit');

  // Fetch user rank
  const fetchUserRank = async () => {
    try {
      if (!user?.id) return;

      const token = localStorage.getItem('mpt_token');
      const response = await fetch(`/api/leaderboard/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const newRank = data.user?.rank;
        const newPoints = data.user?.totalPoints;
        const newTier = data.user?.tier || 'Recruit';

        setRankData({
          rank: newRank,
          points: newPoints,
          tier: newTier,
          previousRank: previousRankRef.current || undefined,
        });

        // Check for trigger conditions
        if (previousRankRef.current !== null) {
          checkTriggerConditions(previousRankRef.current, newRank, previousTierRef.current, newTier);
        }

        previousRankRef.current = newRank;
        previousTierRef.current = newTier;
      }
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };

  // Check trigger conditions
  const checkTriggerConditions = (
    prevRank: number,
    newRank: number,
    prevTier: string,
    newTier: string
  ) => {
    let event: RankTriggerEvent | null = null;

    // Check rank milestones
    if (newRank === 1) {
      event = {
        type: 'RANK_1',
        previousRank: prevRank,
        newRank,
        message: `🏆 WOW! Anda adalah JUARA #1 Warrior Ranking! Victory pose!`,
        showArka: true,
        arkaPose: 'victory',
      };
    } else if (prevRank > 3 && newRank <= 3) {
      event = {
        type: 'TOP_3_ENTRY',
        previousRank: prevRank,
        newRank,
        message: `🥏 Hebat! Anda masuk Top 3! Posisi #${newRank}!`,
        showArka: true,
        arkaPose: 'celebrate',
      };
    } else if (prevRank > 5 && newRank <= 5) {
      event = {
        type: 'TOP_5_ENTRY',
        previousRank: prevRank,
        newRank,
        message: `⭐ Fantastic! Anda masuk Top 5! Posisi #${newRank}!`,
        showArka: true,
        arkaPose: 'excited',
      };
    } else if (prevRank > 10 && newRank <= 10) {
      event = {
        type: 'TOP_10_ENTRY',
        previousRank: prevRank,
        newRank,
        message: `👍 Luar biasa! Anda masuk Top 10! Posisi #${newRank}!`,
        showArka: true,
        arkaPose: 'clap',
      };
    }
    // Check tier promotion
    else if (prevTier !== newTier) {
      event = {
        type: 'TIER_PROMOTION',
        previousRank: prevRank,
        newRank,
        previousTier: prevTier,
        newTier,
        message: `🎊 Selamat! Anda naik ke tier ${newTier}!`,
        showArka: true,
        arkaPose: 'celebrate',
      };
    }

    if (event) {
      setTrigger(event);
      // Auto-hide trigger after displaying
      setTimeout(() => setTrigger(null), 5000);
    }
  };

  // Fetch user rank on mount and when user changes
  useEffect(() => {
    const timer = setInterval(fetchUserRank, 30000); // Update every 30 seconds
    fetchUserRank(); // Initial fetch

    return () => clearInterval(timer);
  }, [user?.id]);

  return { rankData, trigger, refreshRank: fetchUserRank };
}
