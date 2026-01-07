/**
 * API Route: Update User Profile
 * PUT /api/profile/update
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/role-check';
import { getUsersContainer } from '@/lib/db/cosmos-client';

export async function PUT(req: NextRequest) {
  return requireAuth(req, async (authenticatedReq) => {
    try {
      const userId = authenticatedReq.user!.id;
      const body = await req.json();
      const { displayName, avatar, profileSettings, whatsapp, telegram_id, name } = body;

      // Check if Cosmos DB is configured
      const hasCosmosConfig = 
        process.env.AZURE_COSMOS_CONNECTION_STRING ||
        (process.env.AZURE_COSMOS_ENDPOINT && process.env.AZURE_COSMOS_KEY);

      if (!hasCosmosConfig) {
        console.error('Cosmos DB not configured');
        return NextResponse.json({
          error: 'Database not configured. Please contact administrator.'
        }, { status: 503 });
      }

      // Get container
      const container = getUsersContainer();

    // Get current user
    const { resource: user } = await container.item(userId, userId).read();
    
    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updates.name = name;
    if (displayName !== undefined) updates.displayName = displayName;
    if (avatar !== undefined) updates.avatar = avatar;
    if (whatsapp !== undefined) updates.whatsapp = whatsapp;
    if (telegram_id !== undefined) updates.telegram_id = telegram_id;

    if (profileSettings) {
      updates.profileSettings = {
        ...(user.profileSettings || {}),
        ...profileSettings
      };
    }

    // Update user
    const updatedUserData = {
      ...user,
      ...updates
    };

    const { resource: updatedUser } = await container.item(userId, userId).replace(updatedUserData);

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        warriorId: updatedUser.warriorId,
        whatsapp: updatedUser.whatsapp,
        telegram_id: updatedUser.telegram_id,
        role: updatedUser.role,
        status: updatedUser.status,
        currentBadgeLevel: updatedUser.currentBadgeLevel,
        profileSettings: updatedUser.profileSettings,
        stats: updatedUser.stats
      }
    });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // More specific error messages
      if (error.code === 404) {
        if (error.substatus === 1003) {
          return NextResponse.json({
            error: 'Database container not found. Please initialize the database first.',
            details: 'Run: npm run db:init'
          }, { status: 503 });
        }
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to update profile',
          details: error.message 
        },
        { status: 500 }
      );
    }
  });
}
