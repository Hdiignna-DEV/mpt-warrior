'use client';

import { useMemo } from 'react';
import type { ChatMessage } from './useChatHistory';

/**
 * useContextWindow Hook
 * Prepares chat messages for AI API consumption
 * Provides long-term context for coherent responses
 * 
 * Features:
 * - Format messages for Gemini/Groq/Claude APIs
 * - Extract recent messages for context window
 * - Summary of older conversations
 * - Token estimation
 */

export interface AIContextMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ContextWindowConfig {
  recentMessages?: number;  // How many recent messages to include (default: 10)
  includeSummary?: boolean; // Include summary of older messages (default: true)
  maxTokens?: number;       // Max tokens for context (default: 4000)
}

export function useContextWindow(
  messages: ChatMessage[],
  config: ContextWindowConfig = {}
) {
  const {
    recentMessages = 10,
    includeSummary = true,
    maxTokens = 4000
  } = config;

  const contextMessages = useMemo(() => {
    if (!messages || messages.length === 0) {
      return [];
    }

    let formattedMessages: AIContextMessage[] = [];

    // If we have fewer messages than context window, include all
    if (messages.length <= recentMessages) {
      formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    } else {
      // Include summary of older messages if enabled
      if (includeSummary && messages.length > recentMessages * 2) {
        const olderMessages = messages.slice(0, -recentMessages);
        const summary = generateSummary(olderMessages);
        
        if (summary) {
          formattedMessages.push({
            role: 'user',
            content: `[Previous conversation summary: ${summary}]`
          });
        }
      }

      // Include recent messages
      const recentMsgs = messages.slice(-recentMessages);
      formattedMessages = [
        ...formattedMessages,
        ...recentMsgs.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
    }

    return formattedMessages;
  }, [messages, recentMessages, includeSummary]);

  /**
   * Get messages formatted for Gemini API
   */
  const getGeminiMessages = useMemo(() => {
    return contextMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
  }, [contextMessages]);

  /**
   * Get messages formatted for Groq API
   */
  const getGroqMessages = useMemo(() => {
    return contextMessages;
  }, [contextMessages]);

  /**
   * Get messages formatted for Claude API
   */
  const getClaudeMessages = useMemo(() => {
    return contextMessages;
  }, [contextMessages]);

  /**
   * Estimate token count (rough approximation)
   * 1 token ≈ 4 characters
   */
  const estimatedTokens = useMemo(() => {
    return Math.ceil(
      contextMessages.reduce((sum, msg) => sum + msg.content.length, 0) / 4
    );
  }, [contextMessages]);

  /**
   * Check if context fits within token limit
   */
  const fitsInContext = estimatedTokens < maxTokens;

  /**
   * Get context readiness for AI
   */
  const isReady = contextMessages.length > 0 && fitsInContext;

  return {
    // Raw messages
    contextMessages,
    messageCount: contextMessages.length,
    estimatedTokens,
    fitsInContext,
    isReady,

    // Formatted for different APIs
    getGeminiMessages,
    getGroqMessages,
    getClaudeMessages,

    // Helper method to get for specific model
    getMessagesForModel(model: 'gemini' | 'groq' | 'claude'): AIContextMessage[] {
      switch (model) {
        case 'gemini':
          return getGeminiMessages as unknown as AIContextMessage[];
        case 'groq':
          return getGroqMessages;
        case 'claude':
          return getClaudeMessages;
        default:
          return contextMessages;
      }
    }
  };
}

/**
 * Generate a summary of older messages for context
 * Extracts key topics and themes
 */
function generateSummary(messages: ChatMessage[]): string {
  if (messages.length === 0) return '';

  // Extract key topics from first and last messages
  const firstUserMsg = messages.find(m => m.role === 'user');
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

  if (!firstUserMsg) return '';

  // Create a concise summary
  const preview = firstUserMsg.content.substring(0, 100);
  const topicCount = messages.filter(m => m.role === 'user').length;

  return `${topicCount} topics discussed, starting with: "${preview}..."`;
}

/**
 * useChatContext Hook Variant
 * For use in components that specifically need AI API integration
 */
export function useChatContext(messages: ChatMessage[], model: 'gemini' | 'groq' | 'claude' = 'gemini') {
  const context = useContextWindow(messages);

  return {
    // Get properly formatted messages for this model
    messages: context.getMessagesForModel(model),
    
    // Metadata
    messageCount: context.messageCount,
    estimatedTokens: context.estimatedTokens,
    isReady: context.isReady,
    
    // System message to include before context
    getSystemPrompt: () => `You are Commander Arka, an AI Trading Mentor for the MPT Academy.
Your role is to provide guidance, answer questions, and celebrate victories.
Use past conversation context to maintain continuity.
Be encouraging, professional, and focused on trading education.`,
    
    // Build complete message array for API call
    buildAPIPayload() {
      return {
        systemPrompt: this.getSystemPrompt(),
        messages: context.getMessagesForModel(model),
        metadata: {
          model,
          messageCount: context.messageCount,
          estimatedTokens: context.estimatedTokens,
          timestamp: new Date().toISOString()
        }
      };
    }
  };
}
