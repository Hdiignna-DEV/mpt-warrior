/**
 * useChatHistoryLoader Hook
 * Phase 2.2: Auto-fetch chat history on login
 * 
 * Features:
 * - Fetch last 20 messages from active session
 * - Load all sessions for user
 * - Cache in context/state
 * - Handle loading states and errors
 * - Auto-restore session on app reload
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ChatSession, ChatMessage } from '@/services/chatHistoryService';

// Use browser localStorage to get user info instead of context
const useAuthUser = () => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    // Get user from localStorage or parse JWT token
    const token = typeof window !== 'undefined' ? localStorage.getItem('mpt_token') : null;
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUser({ id: decoded.userId || decoded.sub });
      } catch (e) {
        // Token invalid, user will be null
      }
    }
  }, []);
  
  return { user };
};

interface ChatHistoryLoaderState {
  currentSession: ChatSession | null;
  allSessions: ChatSession[];
  recentMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

interface UseChatHistoryLoaderOptions {
  autoLoad?: boolean;
  cacheKey?: string;
}

/**
 * useChatHistoryLoader Hook
 * Manages loading and caching of chat history
 */
export function useChatHistoryLoader(
  options: UseChatHistoryLoaderOptions = {}
) {
  const { autoLoad = true, cacheKey = 'mpt_chat_history' } = options;
  const { user } = useAuthUser();

  const [state, setState] = useState<ChatHistoryLoaderState>({
    currentSession: null,
    allSessions: [],
    recentMessages: [],
    isLoading: false,
    error: null,
  });

  /**
   * Load all chat sessions for user
   */
  const loadUserSessions = useCallback(async () => {
    if (!user?.id) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load sessions');

      const { sessions } = await response.json();
      
      // Cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(sessions));

      setState((prev) => ({
        ...prev,
        allSessions: sessions,
        isLoading: false,
      }));

      return sessions;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw error;
    }
  }, [user?.id, cacheKey]);

  /**
   * Load specific session with last N messages
   */
  const loadSession = useCallback(
    async (sessionId: string, messageLimit: number = 20) => {
      if (!user?.id) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/chat/sessions/${sessionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`,
            'X-Message-Limit': messageLimit.toString(),
          },
        });

        if (!response.ok) throw new Error('Failed to load session');

        const { session, recentMessages } = await response.json();

        setState((prev) => ({
          ...prev,
          currentSession: session,
          recentMessages,
          isLoading: false,
        }));

        return { session, recentMessages };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        throw error;
      }
    },
    [user?.id]
  );

  /**
   * Load most recent session (or last opened session)
   */
  const loadLastSession = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get from cache first
      const cached = sessionStorage.getItem(cacheKey);
      if (!cached) {
        const sessions = await loadUserSessions();
        if (sessions && sessions.length > 0) {
          return loadSession(sessions[0].id);
        }
      } else {
        const sessions = JSON.parse(cached) as ChatSession[];
        if (sessions.length > 0) {
          return loadSession(sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading last session:', error);
    }
  }, [user?.id, cacheKey, loadUserSessions, loadSession]);

  /**
   * Create new session
   */
  const createNewSession = useCallback(
    async (title: string, provider: 'gemini' | 'groq' | 'claude' = 'gemini') => {
      if (!user?.id) return;

      try {
        const response = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`,
          },
          body: JSON.stringify({ title, provider }),
        });

        if (!response.ok) throw new Error('Failed to create session');

        const newSession = await response.json();

        setState((prev) => ({
          ...prev,
          currentSession: newSession,
          recentMessages: [],
        }));

        // Update cache
        setState((prev) => ({
          ...prev,
          allSessions: [newSession, ...prev.allSessions],
        }));

        return newSession;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }));
        throw error;
      }
    },
    [user?.id]
  );

  /**
   * Auto-load on mount when user is authenticated
   */
  useEffect(() => {
    if (autoLoad && user?.id) {
      // Try to load last session first
      loadLastSession().catch((error) => {
        console.error('Auto-load failed:', error);
        // Silently fail - not critical
      });
    }
  }, [user?.id, autoLoad, loadLastSession]);

  return {
    // State
    currentSession: state.currentSession,
    allSessions: state.allSessions,
    recentMessages: state.recentMessages,
    isLoading: state.isLoading,
    error: state.error,

    // Methods
    loadUserSessions,
    loadSession,
    loadLastSession,
    createNewSession,
  };
}

/**
 * Hook to manage message updates in real-time
 */
export function useChatMessages(sessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  /**
   * Add message to session
   */
  const addMessage = useCallback(
    async (role: 'user' | 'assistant', content: string, provider?: string) => {
      if (!sessionId) return;

      setIsAdding(true);

      try {
        const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`,
          },
          body: JSON.stringify({ role, content, provider }),
        });

        if (!response.ok) throw new Error('Failed to save message');

        const newMessage = await response.json();

        // Add to local state
        setMessages((prev) => [...prev, newMessage]);

        return newMessage;
      } catch (error) {
        console.error('Error adding message:', error);
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [sessionId]
  );

  /**
   * Add multiple messages (e.g., from context)
   */
  const setMessagesFromContext = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    isAdding,
    addMessage,
    setMessages: setMessagesFromContext,
  };
}

/**
 * Hook for chat session management
 */
export function useChatSessionManager() {
  const loader = useChatHistoryLoader();
  const messageManager = useChatMessages(loader.currentSession?.id);

  /**
   * Switch to different session
   */
  const switchSession = useCallback(
    async (sessionId: string) => {
      const result = await loader.loadSession(sessionId);
      if (result && result.recentMessages) {
        messageManager.setMessages(result.recentMessages);
      }
    },
    [loader, messageManager]
  );

  /**
   * Create and switch to new session
   */
  const createAndSwitchSession = useCallback(
    async (title: string, provider?: string) => {
      const newSession = await loader.createNewSession(title, provider as any);
      if (newSession) {
        messageManager.setMessages([]);
      }
      return newSession;
    },
    [loader, messageManager]
  );

  return {
    ...loader,
    ...messageManager,
    switchSession,
    createAndSwitchSession,
  };
}
