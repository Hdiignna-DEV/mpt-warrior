/**
 * Profile API Endpoint
 * Get user profile with warrior stats, badges, and referrals
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getUsersContainer, getDatabase } from '@/lib/db/cosmos-client';

export async function GET(request: NextRequest) {
  // Wrap everything in try-catch to prevent any 500 errors
  try {
    return requireAuth(request, async (req: AuthenticatedRequest) => {
      try {
        const { user } = req;
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

      // Check if Cosmos DB is configured - if not, return demo profile
      const hasCosmosConfig = 
        process.env.NEXT_PUBLIC_COSMOS_CONNECTION_STRING || 
        process.env.AZURE_COSMOS_CONNECTION_STRING ||
        (process.env.AZURE_COSMOS_ENDPOINT && process.env.AZURE_COSMOS_KEY);

      console.log('Cosmos DB config check:', {
        hasConnectionString: !!(process.env.NEXT_PUBLIC_COSMOS_CONNECTION_STRING || process.env.AZURE_COSMOS_CONNECTION_STRING),
        hasEndpoint: !!process.env.AZURE_COSMOS_ENDPOINT,
        hasKey: !!process.env.AZURE_COSMOS_KEY,
        hasCosmosConfig
      });

      if (!hasCosmosConfig) {
        console.warn('Cosmos DB not configured - returning demo profile for:', user.email);
        
        // Return demo profile based on JWT user data
        return NextResponse.json({
          success: true,
          profile: {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'Warrior',
            displayName: user.email?.split('@')[0] || 'Warrior',
            warriorId: user.warriorId || 'MPT-DEMO-00001',
            role: user.role,
            status: 'active',
            currentBadgeLevel: 'RECRUIT',
            badges: [],
            disciplineScore: 500,
            stats: {
              totalTrades: 0,
              wins: 0,
              losses: 0,
              winRate: 0
            },
            settings: {
              theme: 'dark',
              language: 'id',
              notifications: true
            },
            profileSettings: {
              personalGoal: '',
              tradingStrategy: 'DAY_TRADING',
              preferredTimeframe: '',
              bio: ''
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Demo mode indicator
            _demoMode: true
          }
        });
      }

      // Try to connect to Cosmos DB
      let usersContainer;
      try {
        console.log('Attempting to get users container...');
        usersContainer = getUsersContainer();
        console.log('Successfully got users container');
      } catch (dbError) {
        console.error('Failed to get users container:', dbError);
        console.error('Error details:', {
          name: dbError instanceof Error ? dbError.name : 'unknown',
          message: dbError instanceof Error ? dbError.message : 'unknown',
          stack: dbError instanceof Error ? dbError.stack : 'unknown'
        });
        // Return demo profile if DB connection fails
        return NextResponse.json({
          success: true,
          profile: {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'Warrior',
            displayName: user.email?.split('@')[0] || 'Warrior',
            warriorId: user.warriorId || 'MPT-DEMO-00001',
            role: user.role,
            status: 'active',
            currentBadgeLevel: 'RECRUIT',
            badges: [],
            disciplineScore: 500,
            stats: {
              totalTrades: 0,
              wins: 0,
              losses: 0,
              winRate: 0
            },
            settings: {
              theme: 'dark',
              language: 'id',
              notifications: true
            },
            profileSettings: {
              personalGoal: '',
              tradingStrategy: 'DAY_TRADING',
              preferredTimeframe: '',
              bio: ''
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _demoMode: true,
            _dbError: dbError instanceof Error ? dbError.message : 'Unknown error'
          }
        });
      }

      // Get user profile
      const { resource: userProfile } = await usersContainer.item(user.id, user.id).read();

      if (!userProfile) {
        console.warn('Profile not found in DB for user:', user.id);
        // Return demo profile if user not found in DB
        return NextResponse.json({
          success: true,
          profile: {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'Warrior',
            displayName: user.email?.split('@')[0] || 'Warrior',
            warriorId: user.warriorId || 'MPT-DEMO-00001',
            role: user.role,
            status: 'active',
            currentBadgeLevel: 'RECRUIT',
            badges: [],
            disciplineScore: 500,
            stats: {
              totalTrades: 0,
              wins: 0,
              losses: 0,
              winRate: 0
            },
            settings: {
              theme: 'dark',
              language: 'id',
              notifications: true
            },
            profileSettings: {
              personalGoal: '',
              tradingStrategy: 'DAY_TRADING',
              preferredTimeframe: '',
              bio: ''
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _demoMode: true,
            _reason: 'User not found in database'
          }
        });
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
        
        // Return demo profile on any error
        return NextResponse.json({
          success: true,
          profile: {
            id: req.user?.id || 'unknown',
            email: req.user?.email || 'demo@mpt.com',
            name: 'Demo Warrior',
            displayName: 'Demo Warrior',
            warriorId: 'MPT-DEMO-ERROR',
            role: req.user?.role || 'WARRIOR',
            status: 'active',
            currentBadgeLevel: 'RECRUIT',
            badges: [],
            disciplineScore: 500,
            stats: {
              totalTrades: 0,
              wins: 0,
              losses: 0,
              winRate: 0
            },
            settings: {
              theme: 'dark',
              language: 'id',
              notifications: true
            },
            profileSettings: {
              personalGoal: '',
              tradingStrategy: 'DAY_TRADING',
              preferredTimeframe: '',
              bio: ''
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _demoMode: true,
            _error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    });
  } catch (authError) {
    console.error('Auth error in profile API:', authError);
    // If requireAuth fails, return 401
    return NextResponse.json({ 
      error: 'Authentication required',
      details: authError instanceof Error ? authError.message : 'Auth failed'
    }, { status: 401 });
  }
}
