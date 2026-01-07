/**
 * API Route: Update User Profile
 * PUT /api/profile/update
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/role-check';
import { getCosmosClient } from '@/utils/cosmosdb';

export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(req);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;
    const body = await req.json();
    const { displayName, avatar, profileSettings } = body;

    // Get Cosmos client
    const { client } = getCosmosClient();
    const database = client.database('MPT');
    const container = database.container('users');

    // Get current user
    const { resource: user } = await container.item(userId, userId).read();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (displayName) {
      updates.displayName = displayName;
    }

    if (avatar) {
      updates.avatar = avatar;
    }

    if (profileSettings) {
      updates.profileSettings = {
        ...user.profileSettings,
        ...profileSettings
      };
    }

    // Update user
    const { resource: updatedUser } = await container.item(userId, userId).replace({
      ...user,
      ...updates
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
