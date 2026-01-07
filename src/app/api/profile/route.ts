/**
 * Profile API Endpoint
 * Get user profile with warrior stats, badges, and referrals
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const database = await getDatabase();
      const usersContainer = database.container('users');

      // Get user profile
      const { resource: userProfile } = await usersContainer.item(user.id, user.id).read();

      if (!userProfile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      // Get referral stats if user is Veteran
      let referralStats = null;
      if (userProfile.currentBadgeLevel === 'VETERAN' && userProfile.referralCode) {
        const referralsContainer = database.container('referrals');
        const { resources: referrals } = await referralsContainer.items
          .query({
            query: 'SELECT * FROM c WHERE c.referrerId = @userId',
            parameters: [{ name: '@userId', value: user.id }]
          })
          .fetchAll();

        const totalReferrals = referrals.length;
        const activeReferrals = referrals.filter(r => r.status === 'USED').length;
        const totalEarnings = referrals
          .filter(r => r.status === 'USED')
          .reduce((sum, r) => sum + (r.discountPercent || 0), 0);

        referralStats = {
          totalReferrals,
          activeReferrals,
          totalEarnings
        };
      }

      // Return sanitized profile (exclude password)
      const { password, ...profileData } = userProfile;

      return NextResponse.json({
        success: true,
        profile: {
          ...profileData,
          referralStats
        }
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      return NextResponse.json(
        { error: 'Failed to load profile' },
        { status: 500 }
      );
    }
  });
}
