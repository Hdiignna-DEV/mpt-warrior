/**
 * Profile API - GET user profile
 * Simple, production-ready implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateActiveUser } from '@/lib/middleware/auth';
import { getUsersContainer, getTradesContainer } from '@/lib/db/cosmos-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Validate auth + active status
    const { decoded, error } = validateActiveUser(request);
    if (error) return error;

    const userId = decoded!.userId;
    console.log('[PROFILE API] Fetching profile for:', userId);

    // Get users container
    const container = getUsersContainer();
    
    // Get user profile
    const { resource: userProfile } = await container.item(userId, userId).read();

    if (!userProfile) {
      console.error('[PROFILE API] User not found:', userId);
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    console.log('[PROFILE API] Profile found:', userProfile.email, userProfile.warriorId);

    // Calculate real stats from trades
    const tradesContainer = getTradesContainer();
    const tradesQuery = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }]
    };
    
    const { resources: trades } = await tradesContainer.items.query(tradesQuery).fetchAll();
    
    // Calculate stats
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.outcome === 'WIN').length;
    const losses = trades.filter(t => t.outcome === 'LOSS').length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    
    // Calculate total profit/loss
    const totalProfitLoss = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const averageRisk = totalTrades > 0 
      ? trades.reduce((sum, t) => sum + (t.riskPercent || 0), 0) / totalTrades 
      : 0;
    
    console.log('[PROFILE API] Stats calculated:', { totalTrades, wins, losses, winRate });

    return NextResponse.json({
      success: true,
      profile: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name || userProfile.email?.split('@')[0],
        displayName: userProfile.displayName || userProfile.name,
        warriorId: userProfile.warriorId,
        role: userProfile.role,
        status: userProfile.status,
        currentBadgeLevel: userProfile.currentBadgeLevel || 'RECRUIT',
        badges: userProfile.badges || [],
        disciplineScore: userProfile.disciplineScore || 500,
        whatsapp: userProfile.whatsapp || '',
        telegram_id: userProfile.telegram_id || '',
        avatar: userProfile.avatar || '',
        referralCode: userProfile.referralCode || '',
        profileSettings: userProfile.profileSettings || {
          personalGoal: '',
          tradingStrategy: 'DAY_TRADING',
          preferredTimeframe: '',
          bio: ''
        },
        stats: {
          totalTrades,
          wins,
          losses,
          winRate,
          totalProfitLoss,
          averageRisk: Math.round(averageRisk * 100) / 100,
          bestTrade: trades.length > 0 ? Math.max(...trades.map(t => t.profitLoss || 0)) : 0,
          worstTrade: trades.length > 0 ? Math.min(...trades.map(t => t.profitLoss || 0)) : 0
        },
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }
    });

  } catch (error: any) {
    console.error('[PROFILE API] Error:', error.message);
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch profile', message: error.message },
      { status: 500 }
    );
  }
}
