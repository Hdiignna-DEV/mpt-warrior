'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Loader, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '@/hooks/useChatHistory';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  error?: string | null;
  currentUserName?: string;
}

/**
 * ChatMessageList Component
 * Displays chat messages with Arka avatar for assistant messages
 * Auto-scrolls to latest message
 */
export function ChatMessageList({
  messages,
  isLoading = false,
  error = null,
  currentUserName = 'Warrior'
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <div className="text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-400 font-semibold">Failed to load messages</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-700/20 border border-slate-600/30 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto opacity-50">
            <Image
              src="/images/mascots/commander-arka-empty.png"
              alt="Commander Arka"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-slate-300 font-semibold mb-2">No messages yet</p>
            <p className="text-slate-400 text-sm">Start a conversation with Commander Arka!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] px-4 py-6 scroll-smooth"
    >
      {messages.map((message) => (
        <ChatMessageBubble
          key={message.id}
          message={message}
          isUser={message.role === 'user'}
          userName={currentUserName}
        />
      ))}

      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-slate-700/20 rounded-lg">
          <Loader className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-slate-300 text-sm">Commander Arka is thinking...</span>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
  userName: string;
}

/**
 * ChatMessageBubble Component
 * Individual message bubble with avatar
 */
function ChatMessageBubble({
  message,
  isUser,
  userName
}: ChatMessageBubbleProps) {
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isUser) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-xs md:max-w-md">
          <div className="bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-3 shadow-md">
            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{timestamp}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-lg">
          🧑
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center border border-slate-600/50">
        <div className="relative w-8 h-8">
          <Image
            src="/images/mascots/commander-arka-vision.png"
            alt="Commander Arka"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex-1 max-w-xs md:max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-blue-400">Commander Arka</p>
          {message.model && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
              {message.model}
            </span>
          )}
        </div>
        <div className="bg-slate-700/30 text-slate-100 rounded-lg rounded-tl-none px-4 py-3 border border-slate-600/30">
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
}
