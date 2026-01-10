/**
 * POST /api/chat/thread
 * Create or update a chat thread
 * 
 * PUT /api/chat/thread
 * Create or update a chat thread (alias for POST)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createChatThread, updateChatThread } from '@/lib/db/chat-service';
import { initializeContainers } from '@/lib/db/cosmos-client';

async function handleThreadRequest(request: NextRequest) {
  try {
    // Ensure containers exist
    try {
      await initializeContainers();
    } catch (initError) {
      console.error('[/api/chat/thread] Container initialization warning:', initError);
    }

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

export async function POST(request: NextRequest) {
  return handleThreadRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleThreadRequest(request);
}
