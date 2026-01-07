/**
 * Admin API - Generate Invitation Codes
 * Bulk generate invitation codes (ADMIN/SUPER_ADMIN)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

/**
 * Generate unique invitation code
 */
function generateInvitationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 3;
  const segmentLength = 4;
  
  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }).join('-');
  
  return code;
}

export async function POST(request: NextRequest) {
  return requireAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const { user } = req;
      const body = await request.json();
      const { 
        count = 1, 
        role = 'WARRIOR', 
        maxUses = 1,
        description 
      } = body;

      // Validate inputs
      if (count < 1 || count > 100) {
        return NextResponse.json(
          { error: 'Count must be between 1 and 100' },
          { status: 400 }
        );
      }

      if (!['ADMIN', 'WARRIOR'].includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      const database = await getDatabase();
      const codesContainer = database.container('invitation-codes');
      const generatedCodes = [];

      // Generate codes
      for (let i = 0; i < count; i++) {
        let code = generateInvitationCode();
        let isUnique = false;
        let attempts = 0;

        // Ensure uniqueness
        while (!isUnique && attempts < 10) {
          const { resources: existing } = await codesContainer.items
            .query({
              query: 'SELECT * FROM c WHERE c.code = @code',
              parameters: [{ name: '@code', value: code }]
            })
            .fetchAll();

          if (existing.length === 0) {
            isUnique = true;
          } else {
            code = generateInvitationCode();
            attempts++;
          }
        }

        if (!isUnique) {
          continue; // Skip this one
        }

        // Create code record
        const codeId = `code-${Date.now()}-${i}`;
        const codeData = {
          id: codeId,
          code,
          created_by: user?.id,
          max_uses: maxUses,
          used_count: 0,
          expires_at: null,
          is_active: true,
          role: role,
          created_at: new Date().toISOString(),
          description: description || null
        };

        await codesContainer.items.create(codeData);
        generatedCodes.push(codeData);
      }

      return NextResponse.json({
        success: true,
        codes: generatedCodes,
        count: generatedCodes.length
      });

    } catch (error) {
      console.error('Error generating invitation codes:', error);
      return NextResponse.json(
        { error: 'Failed to generate invitation codes' },
        { status: 500 }
      );
    }
  });
}
