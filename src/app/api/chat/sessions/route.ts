import { NextRequest, NextResponse } from 'next/server';
import { chatHistoryService } from '@/services/chatHistoryService';

/**
 * GET /api/chat/sessions
 * Retrieve all chat sessions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // In a real implementation, query Cosmos DB for all sessions by userId
    // For now, return empty list as placeholder
    const sessions: any[] = [];

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        count: sessions.length,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/sessions
 * Create a new chat session
 * 
 * Body:
 * - title: string (optional)
 * - topic: string (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, topic } = body;

    // Create new session in Cosmos DB
    const session = await chatHistoryService.createSession(
      userId,
      title,
      topic
    );

    return NextResponse.json(
      {
        success: true,
        data: { session },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
