/**
 * GET /api/achievements
 * Fetch user's earned and available achievements/badges
 * 
 * Returns: {
 *   earned: Badge[],
 *   available: Badge[],
 *   progress: AchievementProgress,
 *   totalEarned: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId;
    const token = request.headers.get('authorization');

    // Fetch user's trades
    const tradesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/trades?limit=500`,
      {
        headers: {
          'Authorization': token || `Bearer ${process.env.JWT_SECRET}`,
        },
      }
    );

    if (!tradesResponse.ok) {
      console.error('Failed to fetch trades:', tradesResponse.status);
      return NextResponse.json(
        { 
          earned: [],
          available: [],
          progress: {},
          totalEarned: 0,
          error: 'Failed to fetch trades'
        }
      );
    }

    const tradesData = await tradesResponse.json();
    const trades = tradesData.trades || [];

    // Define all badges
    const allBadges = [
      {
        id: 'first_trade',
        name: 'First Step',
        description: 'Complete your first trade',
        icon: '🎯',
        rarity: 'common',
        condition: (trades: any[]) => trades.length >= 1,
        progress: (trades: any[]) => ({ current: Math.min(trades.length, 1), target: 1 }),
      },
      {
        id: 'ten_trades',
        name: 'Momentum Builder',
        description: 'Complete 10 trades',
        icon: '🔟',
        rarity: 'common',
        condition: (trades: any[]) => trades.length >= 10,
        progress: (trades: any[]) => ({ current: Math.min(trades.length, 10), target: 10 }),
      },
      {
        id: 'hundred_trades',
        name: 'Centennial Warrior',
        description: 'Complete 100 trades',
        icon: '💯',
        rarity: 'rare',
        condition: (trades: any[]) => trades.length >= 100,
        progress: (trades: any[]) => ({ current: Math.min(trades.length, 100), target: 100 }),
      },
      {
        id: 'five_wins',
        name: 'Winning Streak',
        description: '5 consecutive winning trades',
        icon: '🔥',
        rarity: 'epic',
        condition: (trades: any[]) => {
          let consecutiveWins = 0;
          for (let i = 0; i < trades.length; i++) {
            if (trades[i].hasil === 'WIN' || trades[i].result === 'WIN') {
              consecutiveWins++;
              if (consecutiveWins >= 5) return true;
            } else {
              consecutiveWins = 0;
            }
          }
          return false;
        },
        progress: (trades: any[]) => {
          let max = 0;
          let current = 0;
          for (let i = 0; i < trades.length; i++) {
            if (trades[i].hasil === 'WIN' || trades[i].result === 'WIN') {
              current++;
              max = Math.max(max, current);
            } else {
              current = 0;
            }
          }
          return { current: max, target: 5 };
        },
      },
      {
        id: 'perfect_day',
        name: 'Perfect Day',
        description: 'Win 3 trades in a single day',
        icon: '💪',
        rarity: 'epic',
        condition: (trades: any[]) => {
          const today = new Date().toISOString().split('T')[0];
          const todayTrades = trades.filter((t) => {
            const tradeDate = new Date(t.tanggal || t.date).toISOString().split('T')[0];
            return tradeDate === today;
          });
          return todayTrades.length >= 3 && todayTrades.every((t) => t.hasil === 'WIN' || t.result === 'WIN');
        },
        progress: (trades: any[]) => {
          const today = new Date().toISOString().split('T')[0];
          const todayTrades = trades.filter((t) => {
            const tradeDate = new Date(t.tanggal || t.date).toISOString().split('T')[0];
            return tradeDate === today;
          });
          const wins = todayTrades.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
          return { current: wins, target: 3 };
        },
      },
      {
        id: 'profit_warrior',
        name: 'Profit Master',
        description: '75%+ win rate on 10+ trades',
        icon: '💰',
        rarity: 'epic',
        condition: (trades: any[]) => {
          if (trades.length < 10) return false;
          const wins = trades.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
          return (wins / trades.length) * 100 >= 75;
        },
        progress: (trades: any[]) => {
          if (trades.length === 0) return { current: 0, target: 75 };
          const wins = trades.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
          const rate = Math.round((wins / trades.length) * 100);
          return { current: rate, target: 75 };
        },
      },
      {
        id: 'consistent',
        name: 'Consistency Champion',
        description: 'Trade 7 days in a row',
        icon: '📅',
        rarity: 'rare',
        condition: (trades: any[]) => {
          if (trades.length === 0) return false;
          const dates = [...new Set(trades.map((t) => new Date(t.tanggal || t.date).toISOString().split('T')[0]))].sort();
          let consecutive = 1;
          for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              consecutive++;
              if (consecutive >= 7) return true;
            } else {
              consecutive = 1;
            }
          }
          return false;
        },
        progress: (trades: any[]) => {
          if (trades.length === 0) return { current: 0, target: 7 };
          const dates = [...new Set(trades.map((t) => new Date(t.tanggal || t.date).toISOString().split('T')[0]))].sort();
          let max = 1;
          let current = 1;
          for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              current++;
              max = Math.max(max, current);
            } else {
              current = 1;
            }
          }
          return { current: max, target: 7 };
        },
      },
      {
        id: 'master_trader',
        name: 'Master Trader',
        description: '80%+ win rate on 50+ trades',
        icon: '👑',
        rarity: 'legendary',
        condition: (trades: any[]) => {
          if (trades.length < 50) return false;
          const wins = trades.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
          return (wins / trades.length) * 100 >= 80;
        },
        progress: (trades: any[]) => {
          if (trades.length === 0) return { current: 0, target: 80 };
          const wins = trades.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
          const rate = Math.round((wins / trades.length) * 100);
          return { current: rate, target: 80 };
        },
      },
      {
        id: 'big_pips',
        name: 'Big Pip Collector',
        description: 'Get 100+ pips in a single trade',
        icon: '📈',
        rarity: 'rare',
        condition: (trades: any[]) => trades.some((t) => Math.abs(t.pip || t.pips || 0) >= 100),
        progress: (trades: any[]) => {
          const max = Math.max(...trades.map((t) => Math.abs(t.pip || t.pips || 0)), 0);
          return { current: max, target: 100 };
        },
      },
      {
        id: 'resilient',
        name: 'Resilient Warrior',
        description: 'Come back to 50%+ win rate after a losing streak',
        icon: '💎',
        rarity: 'rare',
        condition: (trades: any[]) => {
          if (trades.length < 10) return false;
          // Find losing streak
          let losses = 0;
          let foundLosses = false;
          for (let i = 0; i < trades.length; i++) {
            if (trades[i].hasil !== 'WIN' && trades[i].result !== 'WIN') {
              losses++;
              if (losses >= 3) foundLosses = true;
            } else {
              if (foundLosses) {
                // Check if recovered
                const remaining = trades.slice(i);
                if (remaining.length >= 5) {
                  const wins = remaining.filter((t) => t.hasil === 'WIN' || t.result === 'WIN').length;
                  if ((wins / remaining.length) * 100 >= 50) return true;
                }
              }
              losses = 0;
              foundLosses = false;
            }
          }
          return false;
        },
        progress: (trades: any[]) => {
          return { current: 0, target: 1 };
        },
      },
    ];

    // Check which badges are earned
    const earned = allBadges.filter((badge) => badge.condition(trades));
    const available = allBadges.filter((badge) => !badge.condition(trades));

    // Build progress map
    const progress: Record<string, any> = {};
    allBadges.forEach((badge) => {
      progress[badge.id] = badge.progress(trades);
    });

    return NextResponse.json(
      {
        earned: earned.map(({ condition, progress, ...badge }) => badge),
        available: available.map(({ condition, progress, ...badge }) => badge),
        progress,
        totalEarned: earned.length,
        totalAvailable: available.length,
        trades: trades.length,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[GET /api/achievements] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
