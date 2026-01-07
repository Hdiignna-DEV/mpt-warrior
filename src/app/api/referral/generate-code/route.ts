/**
 * Referral System API Endpoints
 * Generate, validate, and track LEGACY- referral codes for Veterans
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

/**
 * Generate unique LEGACY- code
 */
function generateLegacyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
  const length = 6;
  let code = 'LEGACY-';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * POST /api/referral/generate-code
 * Generate a new referral code (VETERAN only)
 */
export async function POST(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const database = await getDatabase();
      const usersContainer = database.container('users');
      const referralsContainer = database.container('referrals');

      // Get user profile
      const { resource: userProfile } = await usersContainer.item(user.id, user.id).read();

      if (!userProfile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if user is Veteran
      if (userProfile.currentBadgeLevel !== 'VETERAN') {
        return NextResponse.json(
          { error: 'Only Veteran warriors can generate referral codes' },
          { status: 403 }
        );
      }

      // Check if user already has a referral code
      if (userProfile.referralCode) {
        return NextResponse.json({
          success: true,
          code: userProfile.referralCode,
          message: 'Using existing referral code'
        });
      }

      // Generate unique code
      let code = generateLegacyCode();
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const { resources: existing } = await referralsContainer.items
          .query({
            query: 'SELECT * FROM c WHERE c.code = @code',
            parameters: [{ name: '@code', value: code }]
          })
          .fetchAll();

        if (existing.length === 0) {
          isUnique = true;
        } else {
          code = generateLegacyCode();
          attempts++;
        }
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }

      // Get global settings for discount percentage
      const settingsContainer = database.container('global-settings');
      const { resource: settings } = await settingsContainer.item('system-config', 'system-config').read();
      const discountPercent = settings?.flatReferralDiscount || 20;

      // Create referral record
      const referralId = `${user.id}-${Date.now()}`;
      await referralsContainer.items.create({
        id: referralId,
        code,
        referrerId: user.id,
        referredUserId: null,
        discountPercent,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        usedAt: null,
        expiresAt: null // No expiration for now
      });

      // Update user profile with referral code
      await usersContainer.item(user.id, user.id).replace({
        ...userProfile,
        referralCode: code,
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        code,
        discountPercent,
        message: 'Referral code generated successfully'
      });

    } catch (error) {
      console.error('Error generating referral code:', error);
      return NextResponse.json(
        { error: 'Failed to generate referral code' },
        { status: 500 }
      );
    }
  });
}

/**
 * GET /api/referral/stats
 * Get referral statistics for current user
 */
export async function GET(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const database = await getDatabase();
      const referralsContainer = database.container('referrals');

      // Get all referrals by this user
      const { resources: referrals } = await referralsContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.referrerId = @userId',
          parameters: [{ name: '@userId', value: user.id }]
        })
        .fetchAll();

      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter(r => r.status === 'USED').length;
      const pendingReferrals = referrals.filter(r => r.status === 'ACTIVE' && !r.referredUserId).length;
      const totalEarnings = referrals
        .filter(r => r.status === 'USED')
        .reduce((sum, r) => sum + (r.discountPercent || 0), 0);

      return NextResponse.json({
        success: true,
        stats: {
          totalReferrals,
          activeReferrals,
          pendingReferrals,
          totalEarnings,
          conversionRate: totalReferrals > 0 
            ? Math.round((activeReferrals / totalReferrals) * 100) 
            : 0
        },
        referrals: referrals.map(r => ({
          code: r.code,
          status: r.status,
          createdAt: r.createdAt,
          usedAt: r.usedAt,
          discountPercent: r.discountPercent
        }))
      });

    } catch (error) {
      console.error('Error getting referral stats:', error);
      return NextResponse.json(
        { error: 'Failed to get referral stats' },
        { status: 500 }
      );
    }
  });
}
