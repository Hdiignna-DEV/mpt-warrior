/**
 * GET /api/chat/thread/[threadId]
 * Load a specific thread with all its messages
 * 
 * DELETE /api/chat/thread/[threadId]
 * Delete a chat thread and all its messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getChatThread, getChatMessages, deleteChatThread } from '@/lib/db/chat-service';
import { initializeContainers } from '@/lib/db/cosmos-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  try {
    // Ensure containers exist (idempotent operation)
    try {
      await initializeContainers();
    } catch (initError) {
      console.error('[GET /api/chat/thread] Container initialization warning:', initError);
      // Don't fail here - containers might already exist
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

    if (!threadId) {
      return NextResponse.json(
        { error: 'Missing threadId parameter' },
        { status: 400 }
      );
    }

    // Get thread (verify it exists and belongs to user)
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

    // Get all messages in thread
    const messages = await getChatMessages(threadId, userId);

    return NextResponse.json({
      success: true,
      thread,
      messages
    });

  } catch (error: any) {
    console.error('Error loading thread:', error);
    return NextResponse.json(
      { error: 'Failed to load thread' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  try {
    // Ensure containers exist (idempotent operation)
    try {
      await initializeContainers();
    } catch (initError) {
      console.error('[DELETE /api/chat/thread] Container initialization warning:', initError);
      // Don't fail here - containers might already exist
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

    if (!threadId) {
      return NextResponse.json(
        { error: 'Missing threadId parameter' },
        { status: 400 }
      );
    }

    // Delete thread (will verify ownership)
    await deleteChatThread(threadId, userId);

    return NextResponse.json({
      success: true,
      message: 'Thread deleted successfully',
    });

  } catch (error: any) {
    console.error('Error deleting chat thread:', error);
    
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete chat thread' },
      { status: 500 }
    );
  }
}
