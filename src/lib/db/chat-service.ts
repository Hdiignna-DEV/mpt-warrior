/**
 * Chat Service - Manages chat threads and messages in Cosmos DB
 * Provides persistence layer for AI Mentor conversation history
 */

import { getChatThreadsContainer, getChatMessagesContainer } from './cosmos-client';

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string; // Which AI model responded (e.g., 'Warrior Vision', 'Warrior Buddy')
  createdAt: Date | string;
}

/**
 * Create a new chat thread
 */
export async function createChatThread(
  userId: string,
  title: string
): Promise<ChatThread> {
  const container = getChatThreadsContainer();
  
  const thread: ChatThread = {
    id: `thread_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    title,
    messageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(thread);
  return resource as ChatThread;
}

/**
 * Get user's chat threads (recent first)
 */
export async function getUserChatThreads(
  userId: string,
  limit: number = 20
): Promise<ChatThread[]> {
  const container = getChatThreadsContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC",
    parameters: [{ name: "@userId", value: userId }],
  };

  const { resources } = await container.items.query<ChatThread>(query).fetchAll();
  return resources.slice(0, limit);
}

/**
 * Get a specific chat thread
 */
export async function getChatThread(
  threadId: string
): Promise<ChatThread | null> {
  try {
    const container = getChatThreadsContainer();
    // Note: We need userId for partition key, but we can query by ID
    const query = {
      query: "SELECT * FROM c WHERE c.id = @threadId",
      parameters: [{ name: "@threadId", value: threadId }],
    };

    const { resources } = await container.items.query<ChatThread>(query).fetchAll();
    return resources[0] || null;
  } catch (error: any) {
    console.error('Error getting chat thread:', error);
    return null;
  }
}

/**
 * Update thread metadata
 */
export async function updateChatThread(
  threadId: string,
  userId: string,
  updates: Partial<Omit<ChatThread, 'id' | 'userId'>>
): Promise<ChatThread> {
  const container = getChatThreadsContainer();
  
  const thread = await getChatThread(threadId);
  if (!thread) {
    throw new Error('Thread not found');
  }

  if (thread.userId !== userId) {
    throw new Error('Unauthorized - thread does not belong to user');
  }

  const updated: ChatThread = {
    ...thread,
    ...updates,
    id: thread.id,
    userId: thread.userId,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(threadId, userId).replace(updated);
  return resource as ChatThread;
}

/**
 * Save a single message to chat thread
 * Async operation - doesn't block user
 */
export async function saveChatMessage(
  threadId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  model?: string
): Promise<ChatMessage> {
  const container = getChatMessagesContainer();
  
  const message: ChatMessage = {
    id: `msg_${threadId}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    threadId,
    userId,
    role,
    content,
    model,
    createdAt: new Date().toISOString(),
  };

  console.log('[saveChatMessage] Saving message to Cosmos DB:', {
    messageId: message.id,
    threadId,
    userId,
    role,
    contentLength: content.length,
  });

  const { resource } = await container.items.create(message);
  
  console.log('[saveChatMessage] ✓ Message saved successfully:', {
    savedId: resource?.id,
    savedRole: resource?.role,
  });
  
  // Update thread message count (non-blocking)
  updateChatThread(threadId, userId, { messageCount: (await getChatMessages(threadId)).length })
    .catch(err => console.error('[saveChatMessage] Error updating thread message count:', err));

  return resource as ChatMessage;
}

/**
 * Get all messages in a thread (ordered by creation time)
 */
export async function getChatMessages(
  threadId: string,
  limit?: number
): Promise<ChatMessage[]> {
  const container = getChatMessagesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.threadId = @threadId ORDER BY c.createdAt ASC",
    parameters: [{ name: "@threadId", value: threadId }],
  };

  const { resources } = await container.items.query<ChatMessage>(query).fetchAll();
  
  if (limit) {
    // Return last N messages (most recent)
    return resources.slice(-limit);
  }
  
  return resources;
}

/**
 * Get recent messages for context loading
 * Returns last N messages to provide context to AI
 */
export async function getRecentChatMessages(
  threadId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  const container = getChatMessagesContainer();
  
  const query = {
    query: "SELECT TOP @limit * FROM c WHERE c.threadId = @threadId ORDER BY c.createdAt DESC",
    parameters: [
      { name: "@threadId", value: threadId },
      { name: "@limit", value: limit },
    ],
  };

  const { resources } = await container.items.query<ChatMessage>(query).fetchAll();
  
  // Reverse to get chronological order
  return resources.reverse();
}

/**
 * Delete a chat thread and all its messages
 */
export async function deleteChatThread(
  threadId: string,
  userId: string
): Promise<void> {
  const threadsContainer = getChatThreadsContainer();
  const messagesContainer = getChatMessagesContainer();
  
  // Verify ownership
  const thread = await getChatThread(threadId);
  if (!thread || thread.userId !== userId) {
    throw new Error('Unauthorized - cannot delete this thread');
  }

  // Delete all messages in thread
  const messages = await getChatMessages(threadId);
  for (const message of messages) {
    await messagesContainer.item(message.id, threadId).delete();
  }

  // Delete thread
  await threadsContainer.item(threadId, userId).delete();
}

/**
 * Delete a single message from thread
 */
export async function deleteChatMessage(
  messageId: string,
  threadId: string,
  userId: string
): Promise<void> {
  const container = getChatMessagesContainer();
  
  // Verify ownership by checking thread
  const thread = await getChatThread(threadId);
  if (!thread || thread.userId !== userId) {
    throw new Error('Unauthorized - cannot delete from this thread');
  }

  await container.item(messageId, threadId).delete();
  
  // Update message count
  const messages = await getChatMessages(threadId);
  updateChatThread(threadId, userId, { messageCount: messages.length })
    .catch(err => console.error('Error updating message count:', err));
}

/**
 * Search messages in a thread by keyword
 */
export async function searchChatMessages(
  threadId: string,
  keyword: string
): Promise<ChatMessage[]> {
  const container = getChatMessagesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.threadId = @threadId AND CONTAINS(LOWER(c.content), LOWER(@keyword)) ORDER BY c.createdAt DESC",
    parameters: [
      { name: "@threadId", value: threadId },
      { name: "@keyword", value: keyword },
    ],
  };

  try {
    const { resources } = await container.items.query<ChatMessage>(query).fetchAll();
    return resources;
  } catch (error: any) {
    console.error('Error searching messages:', error);
    return [];
  }
}

/**
 * Get conversation context for AI (last N messages for context window)
 * Optimized for passing to LLM APIs
 */
export async function getConversationContext(
  threadId: string,
  contextWindow: number = 20
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const messages = await getRecentChatMessages(threadId, contextWindow);
  
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
}
