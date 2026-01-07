/**
 * Admin API - Invitation Codes Management
 * Get, generate, and manage invitation codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

/**
 * GET - List all invitation codes
 */
export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const database = await getDatabase();
      const codesContainer = database.container('invitation-codes');

      const { resources: codes } = await codesContainer.items
        .query('SELECT * FROM c ORDER BY c.created_at DESC')
        .fetchAll();

      return NextResponse.json({
        success: true,
        codes
      });

    } catch (error) {
      console.error('Error loading invitation codes:', error);
      return NextResponse.json(
        { error: 'Failed to load invitation codes' },
        { status: 500 }
      );
    }
  });
}
