import { NextRequest, NextResponse } from 'next/server';
import { chatHistoryService } from '@/services/chatHistoryService';

/**
 * GET /api/chat/sessions/:id
 * Retrieve a specific chat session with all messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const sessionId = id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const session = await chatHistoryService.getSession(userId, sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user
    if (session.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    console.error('[API] Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/chat/sessions/:id
 * Update a chat session (title, topic, archived status, favorite)
 * 
 * Body:
 * - title: string (optional)
 * - topic: string (optional)
 * - archived: boolean (optional)
 * - favorite: boolean (optional)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const sessionId = id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, topic, archived, favorite } = body;

    // Verify session exists and belongs to user
    const session = await chatHistoryService.getSession(userId, sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Note: updateSession method not yet implemented
    // For now, just return the existing session
    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    console.error('[API] Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/sessions/:id
 * Delete a chat session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const sessionId = id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Verify session exists and belongs to user
    const session = await chatHistoryService.getSession(userId, sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete session
    await chatHistoryService.deleteSession(userId, sessionId);

    return NextResponse.json({
      success: true,
      message: 'Session deleted',
    });
  } catch (error) {
    console.error('[API] Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
