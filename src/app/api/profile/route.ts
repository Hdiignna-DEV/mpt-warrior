/**
 * Profile API - GET user profile
 * Simple, production-ready implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateActiveUser } from '@/lib/middleware/auth';
import { getUsersContainer } from '@/lib/db/cosmos-client';

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
        profileSettings: userProfile.profileSettings || {
          personalGoal: '',
          tradingStrategy: 'DAY_TRADING',
          preferredTimeframe: '',
          bio: ''
        },
        stats: {
          totalTrades: userProfile.totalTrades || 0,
          wins: 0,
          losses: 0,
          winRate: 0
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
