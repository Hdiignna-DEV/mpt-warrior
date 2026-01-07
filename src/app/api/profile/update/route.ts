/**
 * API Route: Update User Profile
 * PUT /api/profile/update
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateActiveUser } from '@/lib/middleware/auth';
import { getUsersContainer } from '@/lib/db/cosmos-client';

export async function PUT(request: NextRequest) {
  try {
    const { decoded, error } = validateActiveUser(request);
    if (error) return error;

    const userId = decoded!.userId;
    const body = await request.json();
    const { displayName, avatar, profileSettings, whatsapp, telegram_id, name } = body;

    const container = getUsersContainer();
    
    // Get current user
    const { resource: user } = await container.item(userId, userId).read();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare updates
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

    console.log('[UPDATE API] Profile updated for:', updatedUser.email, updatedUser.warriorId);

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
    console.error('[UPDATE API] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
