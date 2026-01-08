/**
 * POST /api/chat/save
 * Save a new message to chat thread
 * Non-blocking async operation - responds immediately
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/jwt';
import { getChatThread, saveChatMessage } from '@/lib/db/chat-service';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.userId!;
    const { threadId, role, content, model } = await request.json();

    // Validate inputs
    if (!threadId || !role || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: threadId, role, content' },
        { status: 400 }
      );
    }

    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role: must be "user" or "assistant"' },
        { status: 400 }
      );
    }

    // Verify thread ownership
    const thread = await getChatThread(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    if (thread.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - thread does not belong to user' },
        { status: 403 }
      );
    }

    // Save message (fire-and-forget pattern)
    // Don't await - respond immediately while saving in background
    saveChatMessage(threadId, userId, role, content, model)
      .catch(err => {
        console.error('Background error saving message:', err);
        // Silent fail - message already showed in UI, just not persisted
      });

    return NextResponse.json({
      success: true,
      message: 'Message queued for persistence',
    });

  } catch (error: any) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}
