/**
 * PUT /api/chat/thread
 * Create or update a chat thread
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createChatThread, updateChatThread } from '@/lib/db/chat-service';

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId;
    const { threadId, title } = await request.json();

    // Validate inputs
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    let thread;

    if (!threadId) {
      // Create new thread
      thread = await createChatThread(userId, title);
    } else {
      // Update existing thread
      thread = await updateChatThread(threadId, userId, { title });
    }

    return NextResponse.json({
      success: true,
      thread,
    });

  } catch (error: any) {
    console.error('Error managing chat thread:', error);
    
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to manage chat thread' },
      { status: 500 }
    );
  }
}
