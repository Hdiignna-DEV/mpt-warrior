'use client';

import { useState, useEffect } from 'react';
import { ResponsiveAIMentorLayoutV2 } from '@/components/ResponsiveAIMentorLayoutV2';
import { ArkaMascotImage } from '@/components/ArkaMascotImage';
import { useArkaPoseController } from '@/hooks/useArkaPoseController';
import { useChatHistoryLoader } from '@/hooks/useChatHistoryLoader';
import { ChatWithArka } from '@/components/ChatWithArka';
import { Send, Plus } from 'lucide-react';

/**
 * ChatWithArkaV2 Component
 * Integrated implementation of Phase 1 & 2 features:
 * 
 * Phase 1:
 * - ResponsiveAIMentorLayoutV2: Grid-based layout (20% sidebar / 80% content on desktop)
 * - ArkaMascotImage: WebP image with PNG fallback
 * - useArkaPoseController: Dynamic pose management with auto-reset
 * 
 * Phase 2:
 * - useChatHistoryLoader: Auto-load chat history on mount
 * - Chat persistence in Cosmos DB
 * 
 * Layout:
 * - Desktop (≥768px): Grid layout with sidebar on right
 * - Mobile (<768px): Full-screen with floating avatar bubble
 */
export function ChatWithArkaV2() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize Arka pose controller
  const {
    pose,
    message: poseMessage,
    triggerVision,
    triggerVictory,
    triggerWarning,
    setPose,
  } = useArkaPoseController();

  // Load chat history on mount
  const {
    currentSession,
    allSessions,
    recentMessages: messages,
    isLoading,
    error,
    loadSession,
    createNewSession,
  } = useChatHistoryLoader({
    autoLoad: true,
  });

  // Get user ID on mount (from localStorage or JWT)
  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem('mpt_token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUserId(decoded.userId || decoded.sub);
      } catch (e) {
        console.error('Failed to decode token');
      }
    }
  }, []);

  if (!isHydrated) {
    return null;
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !userId || !currentSession) {
      triggerWarning('Please select a session first');
      return;
    }

    try {
      // Show thinking pose
      triggerVision('Processing your message...');

      // Add user message to Cosmos DB via API
      const response = await fetch(
        `/api/chat/sessions/${currentSession.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({ role: 'user', content: text }),
        }
      );

      if (!response.ok) {
        triggerWarning('Failed to save message');
        return;
      }

      const { data } = await response.json();
      const userMessage = data.message;

      // Simulate AI response (replace with actual API call)
      setTimeout(async () => {
        const aiResponse = `I understand you said: "${text}". This is a demo response!`;
        
        // Add assistant message
        const msgResponse = await fetch(
          `/api/chat/sessions/${currentSession.id}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
            },
            body: JSON.stringify({ role: 'assistant', content: aiResponse }),
          }
        );

        if (msgResponse.ok) {
          triggerVictory('Response saved!');
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      triggerWarning('Error: ' + (error as Error).message);
    }
  };

  // Sidebar Content (Right side on desktop)
  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border-l border-slate-700/30">
      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-3">Sessions</h3>
        
        {isLoading && (
          <div className="text-sm text-slate-400">Loading sessions...</div>
        )}

        {error && (
          <div className="text-sm text-red-400">Error: {error}</div>
        )}

        {allSessions?.length === 0 && !isLoading && (
          <div className="text-sm text-slate-400">No sessions yet</div>
        )}

        {allSessions?.map((session) => (
          <button
            key={session.id}
            onClick={() => loadSession(session.id)}
            className={`w-full text-left p-2 rounded mb-2 transition-colors ${
              currentSession?.id === session.id
                ? 'bg-blue-600/30 border border-blue-500 text-blue-300'
                : 'bg-slate-800/30 hover:bg-slate-700/30 text-slate-300'
            }`}
          >
            <div className="text-xs truncate font-medium">{session.title}</div>
            <div className="text-xs text-slate-500">
              {session.messageCount || 0} messages
            </div>
          </button>
        ))}
      </div>

      {/* New Session Button */}
      <div className="p-4 border-t border-slate-700/30">
        <button
          onClick={() => createNewSession(`Chat - ${new Date().toLocaleString()}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">New Session</span>
        </button>
      </div>

      {/* Arka Mascot (Desktop only) */}
      <div className="px-4 pb-4 flex justify-center">
        <div className="w-32 h-32">
          <ArkaMascotImage
            pose={pose}
            alt={`Commander Arka - ${pose}`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Status Message */}
      {poseMessage && (
        <div className="px-4 pb-4 text-center">
          <p className="text-xs bg-slate-800/50 rounded px-3 py-2 text-slate-300">
            {poseMessage}
          </p>
        </div>
      )}
    </div>
  );

  // Main Chat Content
  const mainContent = (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm p-4">
        <h1 className="text-xl font-bold text-white">Chat with Commander Arka</h1>
        {currentSession && (
          <p className="text-sm text-slate-400">{currentSession.title}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="text-center text-slate-400">Loading chat history...</div>
        )}

        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-700/30 bg-slate-900/50 backdrop-blur-sm p-4">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );

  return (
    <ResponsiveAIMentorLayoutV2
      position="right"
      sidebarContent={sidebarContent}
    >
      {mainContent}
    </ResponsiveAIMentorLayoutV2>
  );
}

/**
 * MessageInput Component
 * Text input with send button
 */
function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
