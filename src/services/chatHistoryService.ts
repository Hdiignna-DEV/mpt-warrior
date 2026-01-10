/**
 * Chat History Services (Enhanced)
 * Phase 2.1 - 2.3: Persistent Chat Memory System
 * 
 * Features:
 * - Session-based chat organization
 * - Auto-fetch on login (20 last messages)
 * - Context window management for AI
 * - Message search and filtering
 * - Automatic cleanup of old sessions
 */

import { CosmosClient, Container } from "@azure/cosmos";

// Types
export type MessageRole = "user" | "assistant" | "system";
export type AIMentorProvider = "gemini" | "groq" | "claude" | "hybrid";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  provider?: AIMentorProvider;
  timestamp: string;
  tokenCount?: number; // For tracking API usage
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  messages: ChatMessage[];
  provider: AIMentorProvider;
  
  // Metadata
  messageCount: number;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  
  // Settings
  isArchived: boolean;
  isFavorite: boolean;
}

export interface ChatContextWindow {
  recentMessages: ChatMessage[]; // Last 5-10 messages
  summary: string; // AI-generated summary of conversation
  topicsDiscussed: string[];
  userLearningStyle?: string;
}

/**
 * Chat History Database Service
 * Manages all chat-related database operations
 */
class ChatHistoryService {
  private container: Container | null = null;

  /**
   * Initialize container reference
   */
  async initialize(container: Container) {
    this.container = container;
  }

  /**
   * Create new chat session
   */
  async createSession(
    userId: string,
    title: string,
    provider: AIMentorProvider = "gemini",
    description?: string
  ): Promise<ChatSession> {
    if (!this.container) throw new Error("Service not initialized");

    const session: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      description,
      messages: [],
      provider,
      messageCount: 0,
      totalTokens: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      isArchived: false,
      isFavorite: false,
    };

    await this.container.items.create(session);
    return session;
  }

  /**
   * Add message to session
   */
  async addMessage(
    userId: string,
    sessionId: string,
    message: Omit<ChatMessage, "id" | "timestamp">
  ): Promise<ChatMessage> {
    if (!this.container) throw new Error("Service not initialized");

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...message,
      timestamp: new Date().toISOString(),
    };

    // Read current session
    const session = await this.container.item(sessionId, userId).read();
    const currentSession = session.resource as ChatSession;

    // Add message
    currentSession.messages.push(newMessage);
    currentSession.messageCount = currentSession.messages.length;
    currentSession.updatedAt = new Date().toISOString();
    currentSession.lastAccessedAt = new Date().toISOString();

    // Update in DB
    await this.container.item(sessionId, userId).replace(currentSession);

    return newMessage;
  }

  /**
   * Get latest messages (for context)
   * Used in Phase 2.3: Send to AI API
   */
  async getRecentMessages(
    userId: string,
    sessionId: string,
    limit: number = 20
  ): Promise<ChatMessage[]> {
    if (!this.container) throw new Error("Service not initialized");

    const session = await this.container.item(sessionId, userId).read();
    const chatSession = session.resource as ChatSession;

    // Return last N messages
    return chatSession.messages.slice(-limit);
  }

  /**
   * Get all sessions for user (with pagination)
   * Used in Phase 2.2: Auto-fetch on login
   */
  async getUserSessions(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<ChatSession[]> {
    if (!this.container) throw new Error("Service not initialized");

    const query = `
      SELECT * FROM c 
      WHERE c.userId = @userId AND c.isArchived = false
      ORDER BY c.lastAccessedAt DESC
    `;

    const { resources } = await this.container.items
      .query({
        query,
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();

    return resources as ChatSession[];
  }

  /**
   * Get session details
   */
  async getSession(userId: string, sessionId: string): Promise<ChatSession | null> {
    if (!this.container) throw new Error("Service not initialized");

    try {
      const session = await this.container.item(sessionId, userId).read();
      const chatSession = session.resource as ChatSession;
      
      // Update last accessed
      chatSession.lastAccessedAt = new Date().toISOString();
      await this.container.item(sessionId, userId).replace(chatSession);
      
      return chatSession;
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  }

  /**
   * Build context window for AI
   * Used in Phase 2.3: Prepare system context
   */
  async buildContextWindow(
    userId: string,
    sessionId: string
  ): Promise<ChatContextWindow> {
    const messages = await this.getRecentMessages(userId, sessionId, 10);

    // Extract topics from recent messages
    const topics = this.extractTopics(messages);

    // Create summary for system context
    const summary = this.generateContextSummary(messages);

    return {
      recentMessages: messages.slice(-5), // Last 5 messages
      summary,
      topicsDiscussed: topics,
    };
  }

  /**
   * Extract topics from messages
   */
  private extractTopics(messages: ChatMessage[]): string[] {
    const topics = new Set<string>();

    const keywords = {
      trading: ["trade", "position", "risk", "profit", "loss", "chart"],
      learning: ["learn", "understand", "explain", "concept", "strategy"],
      technical: ["chart", "technical", "indicator", "support", "resistance"],
      psychology: ["fear", "greed", "emotion", "mindset", "discipline"],
    };

    messages.forEach((msg) => {
      const content = msg.content.toLowerCase();
      Object.entries(keywords).forEach(([topic, keywords]) => {
        if (keywords.some((kw) => content.includes(kw))) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  /**
   * Generate context summary for AI
   */
  private generateContextSummary(messages: ChatMessage[]): string {
    if (messages.length === 0) return "No previous conversation.";

    const userMessages = messages.filter((m) => m.role === "user");
    const topicsCount = userMessages.length;
    const avgLength = Math.round(
      messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
    );

    return `Ongoing conversation with ${topicsCount} user questions. Average message length: ${avgLength} chars.`;
  }

  /**
   * Archive session
   */
  async archiveSession(userId: string, sessionId: string): Promise<void> {
    if (!this.container) throw new Error("Service not initialized");

    const session = await this.container.item(sessionId, userId).read();
    const chatSession = session.resource as ChatSession;

    chatSession.isArchived = true;
    chatSession.updatedAt = new Date().toISOString();

    await this.container.item(sessionId, userId).replace(chatSession);
  }

  /**
   * Delete session
   */
  async deleteSession(userId: string, sessionId: string): Promise<void> {
    if (!this.container) throw new Error("Service not initialized");

    await this.container.item(sessionId, userId).delete();
  }

  /**
   * Mark session as favorite
   */
  async toggleFavorite(userId: string, sessionId: string): Promise<void> {
    if (!this.container) throw new Error("Service not initialized");

    const session = await this.container.item(sessionId, userId).read();
    const chatSession = session.resource as ChatSession;

    chatSession.isFavorite = !chatSession.isFavorite;
    chatSession.updatedAt = new Date().toISOString();

    await this.container.item(sessionId, userId).replace(chatSession);
  }

  /**
   * Cleanup old sessions (older than 30 days)
   * Run periodically (e.g., via Azure Function)
   */
  async cleanupOldSessions(userId: string, daysThreshold: number = 30): Promise<number> {
    if (!this.container) throw new Error("Service not initialized");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const query = `
      SELECT c.id FROM c 
      WHERE c.userId = @userId 
      AND c.isArchived = true
      AND c.updatedAt < @cutoffDate
    `;

    const { resources } = await this.container.items
      .query({
        query,
        parameters: [
          { name: "@userId", value: userId },
          { name: "@cutoffDate", value: cutoffDate.toISOString() },
        ],
      })
      .fetchAll();

    for (const session of resources as any[]) {
      await this.container.item(session.id, userId).delete();
    }

    return resources.length;
  }
}

// Singleton instance
export const chatHistoryService = new ChatHistoryService();

/**
 * API Payload Builder
 * Used in Phase 2.3: Build payload for AI API
 */
export interface AIAPIPayload {
  systemContext: string;
  recentMessages: ChatMessage[];
  provider: AIMentorProvider;
  metadata?: {
    userId: string;
    sessionId: string;
    contextWindow: ChatContextWindow;
  };
}

export async function buildAIPayload(
  userId: string,
  sessionId: string,
  provider: AIMentorProvider
): Promise<AIAPIPayload> {
  const session = await chatHistoryService.getSession(userId, sessionId);
  if (!session) throw new Error("Session not found");

  const contextWindow = await chatHistoryService.buildContextWindow(
    userId,
    sessionId
  );

  return {
    systemContext: `${contextWindow.summary}. Topics discussed: ${contextWindow.topicsDiscussed.join(", ") || "general"}. Remember previous context when responding.`,
    recentMessages: contextWindow.recentMessages,
    provider,
    metadata: {
      userId,
      sessionId,
      contextWindow,
    },
  };
}
