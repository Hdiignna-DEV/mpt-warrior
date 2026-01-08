/**
 * Referral System API Endpoints
 * Generate, validate, and track VET-USER referral codes for Veterans
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { generateReferralCode, getReferralCodesByReferrer } from '@/lib/db/code-service';

/**
 * POST /api/referral/generate-code
 * Generate a new VET-USER referral code (VETERAN only)
 */
export async function POST(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const {
        discountPercent = 20,
        expiresAfterDays = 90,
      } = await request.json();

      // Validate discount
      if (discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json(
          { error: 'Discount must be between 0-100' },
          { status: 400 }
        );
      }

      // Generate VET-USER referral code
      const referralCode = await generateReferralCode(
        user.id,
        user.id, // Admin ID = current user for VET-USER codes
        discountPercent,
        expiresAfterDays
      );

      return NextResponse.json({
        success: true,
        code: referralCode,
        message: `VET-USER referral code created: ${referralCode.code}`,
        benefits: {
          discount: `${discountPercent}% for new users`,
          warPointsPerUse: 500,
          expiresIn: `${expiresAfterDays} days`,
        },
      });

    } catch (error: any) {
      console.error('Generate referral code error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate referral code' },
        { status: 500 }
      );
    }
  });
}

/**
 * GET /api/referral/generate-code
 * Get referral statistics for current user
 */
export async function GET(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Get user's referral codes
      const referralCodes = await getReferralCodesByReferrer(user.id);

      // Calculate stats
      const totalRedemptions = referralCodes.reduce((sum, code) => sum + code.used_count, 0);
      const totalWarPoints = referralCodes.reduce((sum, code) => {
        return sum + (code.used_count * (code.benefits?.warPointsOnUse || 0));
      }, 0);

      // Active codes (not expired, have uses left)
      const activeCodes = referralCodes.filter(
        code => code.is_active && code.used_count < code.max_uses && new Date(code.expires_at) > new Date()
      );

      return NextResponse.json({
        success: true,
        codes: referralCodes,
        stats: {
          totalCodes: referralCodes.length,
          activeCodes: activeCodes.length,
          totalRedemptions,
          totalWarPointsEarned: totalWarPoints,
          averageDiscountPercent:
            referralCodes.length > 0
              ? Math.round(
                referralCodes.reduce((sum, code) => sum + (code.benefits?.discountPercent || 0), 0) /
                referralCodes.length
              )
              : 0,
        },
      });

    } catch (error: any) {
      console.error('Get referral stats error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to get referral stats' },
        { status: 500 }
      );
    }
  });
}
