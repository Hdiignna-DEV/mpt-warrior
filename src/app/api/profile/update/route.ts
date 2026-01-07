/**
 * API Route: Update User Profile
 * PUT /api/profile/update
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/role-check';
import { getUsersContainer } from '@/lib/db/cosmos-client';

export async function PUT(req: NextRequest) {
  try {
    // CRITICAL: Check environment variables FIRST before ANY database operations
    const hasEnvVars = !!(
      (process.env.AZURE_COSMOS_ENDPOINT && process.env.AZURE_COSMOS_KEY) ||
      process.env.AZURE_COSMOS_CONNECTION_STRING
    );

    console.log('[UPDATE API] Environment check:', {
      hasEndpoint: !!process.env.AZURE_COSMOS_ENDPOINT,
      hasKey: !!process.env.AZURE_COSMOS_KEY,
      hasConnectionString: !!process.env.AZURE_COSMOS_CONNECTION_STRING,
      nodeEnv: process.env.NODE_ENV
    });

    if (!hasEnvVars) {
      console.error('[UPDATE API] Missing Cosmos DB credentials - returning 503');
      return NextResponse.json({
        error: 'Database not configured',
        message: 'Contact administrator to configure database connection'
      }, { status: 503 });
    }

    return requireAuth(req, async (authenticatedReq) => {
      try {
        const userId = authenticatedReq.user!.id;
        const body = await req.json();
        const { displayName, avatar, profileSettings, whatsapp, telegram_id, name } = body;

        // Get container (wrapped in try-catch for initialization errors)
        let container;
        try {
          container = getUsersContainer();
        } catch (containerError: any) {
          console.error('[UPDATE API] Failed to initialize Cosmos DB container:', containerError.message);
          return NextResponse.json({
            error: 'Database connection failed',
            message: containerError.message
          }, { status: 503 });
        }

        // Get current user
        const { resource: user } = await container.item(userId, userId).read();
        
        if (!user) {
          console.error('[UPDATE API] User not found:', userId);
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

        console.log('[UPDATE API] Profile updated successfully for:', userId);

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
        console.error('[UPDATE API] Error updating profile:', error.message);
        
        // More specific error messages
        if (error.code === 404) {
          if (error.substatus === 1003) {
            return NextResponse.json({
              error: 'Database container not found',
              message: 'Please initialize the database first'
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
            message: error.message 
          },
          { status: 500 }
        );
      }
    });
  } catch (error: any) {
    console.error('[UPDATE API] Outer catch error:', error.message);
    return NextResponse.json(
      { 
        error: 'Server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
