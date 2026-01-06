/**
 * API Route: /api/academy/progress
 * GET - Get user's progress
 * POST - Mark lesson as completed
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getUserProgress,
  getUserModuleSummary,
  markLessonComplete,
  updateLessonAccess,
} from '@/lib/db/education-service';

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

    const decoded = await verifyToken(request);
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

    const { searchParams } = new URL(request.url);
    const summaryOnly = searchParams.get('summary') === 'true';

    if (summaryOnly) {
      const summary = await getUserModuleSummary(decoded.userId);
      return NextResponse.json({
        success: true,
        summary,
      });
    }

    const progress = await getUserProgress(decoded.userId);
    return NextResponse.json({
      success: true,
      progress,
      count: progress.length,
    });

  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { moduleId, lessonId, action, timeSpent } = body;

    if (!moduleId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing moduleId or lessonId' },
        { status: 400 }
      );
    }

    if (action === 'complete') {
      const progress = await markLessonComplete(
        decoded.username,
        moduleId,
        lessonId,
        timeSpent || 0
      );

      return NextResponse.json({
        success: true,
        message: 'Lesson marked as completed',
        progress,
      });
    } else if (action === 'access') {
      const progress = await updateLessonAccess(
        decoded.username,
        moduleId,
        lessonId
      );

      return NextResponse.json({
        success: true,
        message: 'Lesson access updated',
        progress,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "complete" or "access"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}
