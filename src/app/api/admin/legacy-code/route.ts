/**
 * Generate LEGACY Invitation Code
 * Only SUPER_ADMIN can generate LEGACY codes
 * Benefits: Direct Warrior level + Founder badge
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { generateLegacyCode, getCodesByType } from '@/lib/db/code-service';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;

      // Only SUPER_ADMIN can generate LEGACY codes
      if (!user || user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Only SUPER_ADMIN can generate LEGACY codes' },
          { status: 403 }
        );
      }

      const { expiresAfterDays = 365 } = await request.json();

      // Generate LEGACY code with benefits
      const legacyCode = await generateLegacyCode(user.id, expiresAfterDays);

      return NextResponse.json({
        success: true,
        code: legacyCode,
        message: `LEGACY code created: ${legacyCode.code}`,
        benefits: {
          badge: 'LEGACY_BUILDER',
          startLevel: 'WARRIOR',
          discount: 'Gratis (no discount)',
        },
      });
    } catch (error: any) {
      console.error('Generate LEGACY code error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate LEGACY code' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;

      // Only ADMIN+ can view
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      const legacyCodes = await getCodesByType('LEGACY');

      return NextResponse.json({
        success: true,
        codes: legacyCodes,
        total: legacyCodes.length,
      });
    } catch (error: any) {
      console.error('Get LEGACY codes error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch LEGACY codes' },
        { status: 500 }
      );
    }
  });
}
