/**
 * API Route: Complete Onboarding
 * POST /api/onboarding/complete
 * Assigns Recruit badge, generates Warrior ID, initializes profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/role-check';
import { getCosmosClient } from '@/utils/cosmosdb';

export async function POST(req: NextRequest) {
  return requireAuth(req, async (authenticatedReq) => {
    try {
      const userId = authenticatedReq.user!.id;
      const body = await req.json();
      const { avatar, personalGoal, tradingStrategy, preferredTimeframe } = body;

      // Get Cosmos client
      const client = getCosmosClient();
    const database = client.database('MPT');
    const usersContainer = database.container('users');

    // Get current user
    const { resource: user } = await usersContainer.item(userId, userId).read();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already onboarded
    if (user.onboardingCompleted) {
      return NextResponse.json(
        { error: 'Onboarding already completed' },
        { status: 400 }
      );
    }

    // Generate Warrior ID: MPT-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const warriorId = `MPT-${year}-${randomNum}`;

    // Initialize badges with Recruit level
    const initialBadges = [
      { type: 'FIRST_TRADE', level: 'RECRUIT', progress: 0 },
      { type: 'CONSISTENT_5', level: 'RECRUIT', progress: 0 },
      { type: 'DISCIPLINED_WARRIOR', level: 'RECRUIT', progress: 0 },
      { type: 'PROFIT_MASTER', level: 'RECRUIT', progress: 0 },
      { type: 'EDUCATOR', level: 'RECRUIT', progress: 0 },
      { type: 'LEGACY_BUILDER', level: 'RECRUIT', progress: 0 }
    ];

    // Update user
    const updatedUser = {
      ...user,
      warriorId,
      currentBadgeLevel: 'RECRUIT',
      badges: initialBadges,
      disciplineScore: 500, // Start at mid-point
      avatar: avatar || user.avatar,
      profileSettings: {
        personalGoal: personalGoal || '',
        tradingStrategy: tradingStrategy || 'DAY_TRADING',
        preferredTimeframe: preferredTimeframe || '',
        bio: ''
      },
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    await usersContainer.item(userId, userId).replace(updatedUser);

    return NextResponse.json({
      success: true,
      warriorId,
      currentBadgeLevel: 'RECRUIT',
      disciplineScore: 500,
      message: 'Onboarding completed successfully'
    });

    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
