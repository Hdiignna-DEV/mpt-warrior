import { NextRequest, NextResponse } from 'next/server';
import { chatHistoryService } from '@/services/chatHistoryService';

/**
 * GET /api/chat/sessions/:id/messages
 * Retrieve recent messages from a chat session with pagination
 * 
 * Query params:
 * - limit: number (default: 20, max: 100)
 * - offset: number (default: 0)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const sessionId = id;
    
    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get('limit') || '20'),
      100
    );

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

    // Get recent messages (limit only, no offset - returns last N messages)
    const messages = await chatHistoryService.getRecentMessages(
      userId,
      sessionId,
      limit
    );

    return NextResponse.json({
      success: true,
      data: {
        messages,
        count: messages.length,
        limit,
        sessionId,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/sessions/:id/messages
 * Add a new message to a chat session
 * 
 * Body:
 * - role: 'user' | 'assistant'
 * - content: string
 * - metadata: object (optional)
 */
export async function POST(
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
    const { role, content, metadata } = body;

    // Validate required fields
    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user or assistant' },
        { status: 400 }
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

    // Add message
    const message = await chatHistoryService.addMessage(
      userId,
      sessionId,
      {
        role,
        content,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: { message },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
