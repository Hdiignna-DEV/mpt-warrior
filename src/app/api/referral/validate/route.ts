/**
 * Referral Validation API
 * Validate and apply referral codes during registration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/utils/cosmosdb';

/**
 * POST /api/referral/validate
 * Validate a referral code (public endpoint for registration)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const referralsContainer = database.container('referrals');

    // Find referral code
    const { resources: referrals } = await referralsContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.code = @code AND c.status = @status',
        parameters: [
          { name: '@code', value: code.toUpperCase() },
          { name: '@status', value: 'ACTIVE' }
        ]
      })
      .fetchAll();

    if (referrals.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired referral code' },
        { status: 404 }
      );
    }

    const referral = referrals[0];

    // Check if code is already used
    if (referral.referredUserId) {
      return NextResponse.json(
        { valid: false, error: 'Referral code has already been used' },
        { status: 400 }
      );
    }

    // Check expiration
    if (referral.expiresAt && new Date(referral.expiresAt) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Referral code has expired' },
        { status: 400 }
      );
    }

    // Get referrer info
    const usersContainer = database.container('users');
    const { resource: referrer } = await usersContainer.item(referral.referrerId, referral.referrerId).read();

    return NextResponse.json({
      valid: true,
      code: referral.code,
      discountPercent: referral.discountPercent,
      referrer: {
        name: referrer?.displayName || referrer?.name || 'Veteran Warrior',
        warriorId: referrer?.warriorId
      }
    });

  } catch (error) {
    console.error('Error validating referral code:', error);
    return NextResponse.json(
      { error: 'Failed to validate referral code' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/referral/validate
 * Mark referral code as used (called after successful registration)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, newUserId } = body;

    if (!code || !newUserId) {
      return NextResponse.json(
        { error: 'Code and newUserId are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const referralsContainer = database.container('referrals');

    // Find referral code
    const { resources: referrals } = await referralsContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.code = @code',
        parameters: [{ name: '@code', value: code.toUpperCase() }]
      })
      .fetchAll();

    if (referrals.length === 0) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      );
    }

    const referral = referrals[0];

    // Update referral as used
    await referralsContainer.item(referral.id, referral.referrerId).replace({
      ...referral,
      status: 'USED',
      referredUserId: newUserId,
      usedAt: new Date().toISOString()
    });

    // Update referrer's referral stats
    const usersContainer = database.container('users');
    const { resource: referrer } = await usersContainer.item(referral.referrerId, referral.referrerId).read();

    if (referrer) {
      const currentStats = referrer.referralStats || {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        conversionRate: 0
      };

      await usersContainer.item(referral.referrerId, referral.referrerId).replace({
        ...referrer,
        referralStats: {
          totalReferrals: currentStats.totalReferrals + 1,
          activeReferrals: currentStats.activeReferrals + 1,
          totalEarnings: currentStats.totalEarnings + referral.discountPercent,
          conversionRate: Math.round(
            ((currentStats.activeReferrals + 1) / (currentStats.totalReferrals + 1)) * 100
          )
        },
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Referral code applied successfully'
    });

  } catch (error) {
    console.error('Error applying referral code:', error);
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
      );
  }
}
