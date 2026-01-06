/**
 * API Route: /api/academy/modules
 * GET - Get all modules or filter by level
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllModules, getModulesByLevel, Level } from '@/lib/db/education-service';

export async function GET(request: NextRequest) {
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

    // Get level filter from query params
    const { searchParams } = new URL(request.url);
    const levelParam = searchParams.get('level');

    let modules;
    
    if (levelParam && ['RECRUIT', 'WARRIOR', 'VETERAN'].includes(levelParam.toUpperCase())) {
      modules = await getModulesByLevel(levelParam.toUpperCase() as Level);
    } else {
      modules = await getAllModules();
    }

    return NextResponse.json({
      success: true,
      modules,
      count: modules.length,
    });

  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules', details: error.message },
      { status: 500 }
    );
  }
}
