/**
 * Profile API Endpoint
 * Get user profile with warrior stats, badges, and referrals
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getUsersContainer, getDatabase } from '@/lib/db/cosmos-client';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if Cosmos DB is configured
      if (!process.env.AZURE_COSMOS_ENDPOINT || !process.env.AZURE_COSMOS_KEY) {
        console.error('Cosmos DB credentials not configured');
        return NextResponse.json({ 
          error: 'Database not configured',
          details: 'Azure Cosmos DB credentials missing'
        }, { status: 503 });
      }

      const usersContainer = getUsersContainer();

      // Get user profile
      const { resource: userProfile } = await usersContainer.item(user.id, user.id).read();

      if (!userProfile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      // Get referral stats if user is Veteran
      let referralStats = null;
      if (userProfile.currentBadgeLevel === 'VETERAN' && userProfile.referralCode) {
        try {
          const database = getDatabase();
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
        } catch (refError) {
          console.warn('Referrals container not available:', refError);
          // Skip referral stats if container doesn't exist
        }
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
      // Log detailed error for debugging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Return more specific error for debugging in production
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      return NextResponse.json(
        { 
          error: 'Failed to load profile',
          details: errorMessage,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  });
}
