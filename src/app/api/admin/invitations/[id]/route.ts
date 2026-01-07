/**
 * Admin API - Update Invitation Code
 * Toggle code status, update settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const codeId = params.id;
      const body = await request.json();
      const { isActive } = body;

      const database = await getDatabase();
      const codesContainer = database.container('invitation-codes');

      // Get existing code
      const { resource: existingCode } = await codesContainer.item(codeId, codeId).read();

      if (!existingCode) {
        return NextResponse.json(
          { error: 'Code not found' },
          { status: 404 }
        );
      }

      // Update code
      const updatedCode = {
        ...existingCode,
        is_active: isActive !== undefined ? isActive : existingCode.is_active
      };

      await codesContainer.item(codeId, codeId).replace(updatedCode);

      return NextResponse.json({
        success: true,
        code: updatedCode
      });

    } catch (error) {
      console.error('Error updating invitation code:', error);
      return NextResponse.json(
        { error: 'Failed to update invitation code' },
        { status: 500 }
      );
    }
  });
}
