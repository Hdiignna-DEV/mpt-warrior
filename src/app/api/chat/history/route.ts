/**
 * GET /api/chat/history
 * Load user's chat threads and recent messages
 * Returns threads with preview of last message
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserChatThreads, getChatMessages } from '@/lib/db/chat-service';

export async function GET(request: NextRequest) {
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

    // Get user's chat threads (ordered by recent)
    const threads = await getUserChatThreads(userId, 20);

    // Enrich threads with last message preview
    const threadPreviews = await Promise.all(
      threads.map(async (thread) => {
        const messages = await getChatMessages(thread.id, userId);
        const lastMessage = messages[messages.length - 1];

        return {
          id: thread.id,
          title: thread.title,
          messageCount: thread.messageCount,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
          lastMessage: lastMessage ? {
            role: lastMessage.role,
            preview: lastMessage.content.substring(0, 100),
            createdAt: lastMessage.createdAt,
          } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      threads: threadPreviews,
      count: threadPreviews.length,
    });

  } catch (error: any) {
    console.error('Error loading chat history:', error);
    return NextResponse.json(
      { error: 'Failed to load chat history' },
      { status: 500 }
    );
  }
}
