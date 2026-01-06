/**
 * API Route: /api/academy/modules/[id]
 * GET - Get single module by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { getModuleById, canAccessModule, Level } from '@/lib/db/education-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check user status
    if (decoded.status === 'pending') {
      return NextResponse.json(
        { error: 'Access denied - Awaiting approval' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const levelParam = searchParams.get('level');

    if (!levelParam || !['RECRUIT', 'WARRIOR', 'VETERAN'].includes(levelParam.toUpperCase())) {
      return NextResponse.json(
        { error: 'Missing or invalid level parameter' },
        { status: 400 }
      );
    }

    const level = levelParam.toUpperCase() as Level;
    const module = await getModuleById(id, level);

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Check if user can access this module
    const canAccess = await canAccessModule(decoded.username, id, level);

    return NextResponse.json({
      success: true,
      module,
      canAccess,
    });

  } catch (error: any) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module', details: error.message },
      { status: 500 }
    );
  }
}
