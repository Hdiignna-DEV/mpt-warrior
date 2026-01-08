/**
 * DELETE /api/chat/thread/[threadId]
 * Delete a chat thread and all its messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/jwt';
import { deleteChatThread } from '@/lib/db/chat-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
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
    const { threadId } = params;

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
