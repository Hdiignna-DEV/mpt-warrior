'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * useChatHistory Hook
 * Manages chat thread and messages state
 * Auto-fetches history on mount
 * 
 * Features:
 * - Load user's chat threads
 * - Fetch recent messages
 * - Add new messages to state
 * - Error handling & retry logic
 */

export interface ChatThreadPreview {
  id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    role: 'user' | 'assistant';
    preview: string;
    createdAt: string;
  } | null;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  createdAt: string;
}

export function useChatHistory(threadId?: string) {
  const [threads, setThreads] = useState<ChatThreadPreview[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThreadPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  /**
   * Load user's chat threads
   */
  const loadThreads = useCallback(async (retry = 0) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('mpt_token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/chat/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load threads: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.threads)) {
        throw new Error('Invalid response format');
      }

      setThreads(data.threads);
      setError(null);
      retryCountRef.current = 0;

    } catch (err) {
      console.error('Error loading threads:', err);
      
      if (retry < MAX_RETRIES) {
        // Retry with exponential backoff
        setTimeout(() => {
          loadThreads(retry + 1);
        }, Math.pow(2, retry) * 1000);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load chat threads');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load messages for a specific thread
   */
  const loadMessages = useCallback(async (tId: string, retry = 0) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('mpt_token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/chat/thread/${tId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.messages)) {
        throw new Error('Invalid response format');
      }

      setMessages(data.messages);
      
      // Find and set current thread
      const thread = threads.find(t => t.id === tId);
      if (thread) {
        setCurrentThread(thread);
      }

      setError(null);
      retryCountRef.current = 0;

    } catch (err) {
      console.error('Error loading messages:', err);
      
      if (retry < MAX_RETRIES) {
        setTimeout(() => {
          loadMessages(tId, retry + 1);
        }, Math.pow(2, retry) * 1000);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      }
    } finally {
      setIsLoading(false);
    }
  }, [threads]);

  /**
   * Save a new message to chat
   */
  const addMessage = useCallback(async (
    role: 'user' | 'assistant',
    content: string,
    model?: string
  ) => {
    if (!currentThread) {
      setError('No thread selected');
      return null;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('mpt_token');
      
      if (!token) {
        setError('No authentication token found');
        return null;
      }

      const response = await fetch('/api/chat/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          threadId: currentThread.id,
          role,
          content,
          model
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save message: ${response.status}`);
      }

      const message: ChatMessage = await response.json();
      
      // Add to local state (optimistic update)
      setMessages(prev => [...prev, message]);
      setError(null);
      
      return message;

    } catch (err) {
      console.error('Error adding message:', err);
      setError(err instanceof Error ? err.message : 'Failed to save message');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [currentThread]);

  /**
   * Create a new chat thread
   */
  const createThread = useCallback(async (title: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('mpt_token');
      
      if (!token) {
        setError('No authentication token found');
        return null;
      }

      const response = await fetch('/api/chat/thread', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.thread) {
        throw new Error('Invalid response format');
      }

      const newThread = data.thread;
      
      // Add to threads list
      setThreads(prev => [newThread, ...prev]);
      setCurrentThread(newThread);
      setMessages([]);
      setError(null);
      
      return newThread;

    } catch (err) {
      console.error('Error creating thread:', err);
      setError(err instanceof Error ? err.message : 'Failed to create thread');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Switch to a different thread
   */
  const switchThread = useCallback(async (tId: string) => {
    setMessages([]); // Clear current messages
    await loadMessages(tId);
  }, [loadMessages]);

  /**
   * Auto-load threads on mount
   */
  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  /**
   * Load specific thread if ID provided
   */
  useEffect(() => {
    if (threadId && threads.length > 0) {
      loadMessages(threadId);
    }
  }, [threadId, threads.length, loadMessages]);

  return {
    // State
    threads,
    messages,
    currentThread,
    isLoading,
    error,
    isSaving,

    // Actions
    loadThreads,
    loadMessages,
    addMessage,
    createThread,
    switchThread,
    
    // Helpers
    hasMessages: messages.length > 0,
    isEmpty: threads.length === 0 && messages.length === 0
  };
}

export type ChatHistoryState = ReturnType<typeof useChatHistory>;
