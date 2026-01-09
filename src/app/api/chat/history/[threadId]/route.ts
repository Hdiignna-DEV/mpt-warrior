/**
 * GET /api/chat/history/[threadId]
 * Load all messages for a specific thread
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getChatThread, getChatMessages } from '@/lib/db/chat-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
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

    // Get all messages in thread
    const messages = await getChatMessages(threadId);

    return NextResponse.json({
      success: true,
      thread: {
        id: thread.id,
        title: thread.title,
        messageCount: thread.messageCount,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
      messages,
    });

  } catch (error: any) {
    console.error('Error loading chat thread:', error);
    return NextResponse.json(
      { error: 'Failed to load chat thread' },
      { status: 500 }
    );
  }
}
