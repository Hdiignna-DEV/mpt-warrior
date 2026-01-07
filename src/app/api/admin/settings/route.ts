/**
 * Admin API - Global Settings
 * Get and update system-wide settings (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

/**
 * GET - Get global settings
 */
export async function GET(request: NextRequest) {
  return requireSuperAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const database = await getDatabase();
      const settingsContainer = database.container('global-settings');

      const { resource: settings } = await settingsContainer.item('system-config', 'system-config').read();

      if (!settings) {
        // Return default settings if not found
        return NextResponse.json({
          success: true,
          settings: {
            id: 'system-config',
            flatReferralDiscount: 20,
            maxReferralsPerUser: 100,
            systemAnnouncement: null,
            maintenanceMode: false,
            updatedAt: new Date().toISOString()
          }
        });
      }

      return NextResponse.json({
        success: true,
        settings
      });

    } catch (error) {
      console.error('Error loading settings:', error);
      return NextResponse.json(
        { error: 'Failed to load settings' },
        { status: 500 }
      );
    }
  });
}

/**
 * PUT - Update global settings
 */
export async function PUT(request: NextRequest) {
  return requireSuperAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const {
        flatReferralDiscount,
        maxReferralsPerUser,
        systemAnnouncement,
        maintenanceMode
      } = body;

      // Validate inputs
      if (flatReferralDiscount !== undefined && (flatReferralDiscount < 0 || flatReferralDiscount > 100)) {
        return NextResponse.json(
          { error: 'Referral discount must be between 0 and 100' },
          { status: 400 }
        );
      }

      if (maxReferralsPerUser !== undefined && maxReferralsPerUser < 1) {
        return NextResponse.json(
          { error: 'Max referrals must be at least 1' },
          { status: 400 }
        );
      }

      const database = await getDatabase();
      const settingsContainer = database.container('global-settings');

      // Get existing settings
      let existingSettings;
      try {
        const result = await settingsContainer.item('system-config', 'system-config').read();
        existingSettings = result.resource;
      } catch (error) {
        // Settings don't exist, create new
        existingSettings = {
          id: 'system-config',
          flatReferralDiscount: 20,
          maxReferralsPerUser: 100,
          systemAnnouncement: null,
          maintenanceMode: false,
          createdAt: new Date().toISOString()
        };
      }

      // Update settings
      const updatedSettings = {
        ...existingSettings,
        flatReferralDiscount: flatReferralDiscount !== undefined ? flatReferralDiscount : existingSettings.flatReferralDiscount,
        maxReferralsPerUser: maxReferralsPerUser !== undefined ? maxReferralsPerUser : existingSettings.maxReferralsPerUser,
        systemAnnouncement: systemAnnouncement !== undefined ? systemAnnouncement : existingSettings.systemAnnouncement,
        maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : existingSettings.maintenanceMode,
        updatedAt: new Date().toISOString()
      };

      await settingsContainer.items.upsert(updatedSettings);

      return NextResponse.json({
        success: true,
        settings: updatedSettings
      });

    } catch (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }
  });
}
