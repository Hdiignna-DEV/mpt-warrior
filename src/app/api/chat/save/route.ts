/**
 * POST /api/chat/save
 * Save a new message to chat thread
 * Non-blocking async operation - responds immediately
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getChatThread, saveChatMessage } from '@/lib/db/chat-service';
import { initializeContainers } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/chat/save] Request received');
    
    // Ensure containers exist (idempotent operation)
    try {
      await initializeContainers();
    } catch (initError) {
      console.error('[POST /api/chat/save] Container initialization warning:', initError);
      // Don't fail here - containers might already exist
    }

    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      console.log('[POST /api/chat/save] Unauthorized - no user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId;
    const { threadId, role, content, model } = await request.json();

    console.log('[POST /api/chat/save] Inputs validated:', {
      userId,
      threadId,
      role,
      contentLength: content?.length,
      model,
    });

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

    // Save message - wait for it to be saved to DB
    console.log('[POST /api/chat/save] Saving message to Cosmos DB...');
    const savedMessage = await saveChatMessage(threadId, userId, role, content, model);

    if (!savedMessage) {
      console.log('[POST /api/chat/save] ❌ saveChatMessage returned null/undefined');
      return NextResponse.json(
        { error: 'Failed to save message to database' },
        { status: 500 }
      );
    }

    console.log('[POST /api/chat/save] ✓ Message saved successfully:', {
      savedId: savedMessage.id,
      savedRole: savedMessage.role,
    });

    // Return the saved message so client can display it
    return NextResponse.json(savedMessage);

  } catch (error: any) {
    console.error('[POST /api/chat/save] ❌ ERROR:', error);
    console.error('[POST /api/chat/save] Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack?.substring(0, 200),
    });
    return NextResponse.json(
      { error: 'Failed to save message', details: error.message },
      { status: 500 }
    );
  }
}
