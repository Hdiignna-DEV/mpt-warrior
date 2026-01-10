'use client';

import { useState } from 'react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useChatContext } from '@/hooks/useContextWindow';
import { useArkaController } from '@/hooks/useArkaController';
import { ChatMessageList } from '@/components/ChatMessageList';
import { Send, Plus } from 'lucide-react';

/**
 * ChatIntegrationExample Component
 * Shows how to integrate:
 * - useChatHistory (load/save messages)
 * - useContextWindow (prepare for AI API)
 * - useArkaController (show reactions)
 * 
 * This is a complete working example!
 */
export function ChatWithArka() {
  const [userInput, setUserInput] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  
  // Initialize hooks
  const chatHistory = useChatHistory(selectedThreadId);
  const chatContext = useChatContext(chatHistory.messages, 'gemini');
  const arkaController = useArkaController('vision');

  const handleSendMessage = async () => {
    if (!userInput.trim() || chatHistory.isSaving) return;

    // 1. Add user message
    const userMessage = await chatHistory.addMessage('user', userInput);
    if (!userMessage) {
      arkaController.triggerWarning('Failed to save your message. Try again!');
      return;
    }

    setUserInput('');

    // 2. Show Arka thinking
    arkaController.triggerVision();

    try {
      // 3. Prepare context for AI
      const payload = chatContext.buildAPIPayload();
      
      // 4. Call your AI API (example with Gemini)
      const aiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`
        },
        body: JSON.stringify({
          ...payload,
          userMessage: userInput
        })
      });

      if (!aiResponse.ok) {
        throw new Error('AI response failed');
      }

      const { response } = await aiResponse.json();

      // 5. Save AI response
      const assistantMessage = await chatHistory.addMessage(
        'assistant',
        response,
        'gemini'
      );

      if (assistantMessage) {
        // 6. Show Arka celebration
        arkaController.triggerVictory('Got your answer! 🎯');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      arkaController.triggerWarning('Failed to get AI response. Try again!');
    }
  };

  const handleCreateNewThread = async () => {
    const title = `Chat - ${new Date().toLocaleString()}`;
    const newThread = await chatHistory.createThread(title);
    if (newThread) {
      setSelectedThreadId(newThread.id);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Chat with Commander Arka</h1>
          {chatHistory.currentThread && (
            <p className="text-sm text-slate-400">{chatHistory.currentThread.title}</p>
          )}
        </div>
        <button
          onClick={handleCreateNewThread}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Main Content - Split view */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Threads Sidebar */}
        <div className="hidden lg:flex w-64 bg-slate-800/30 backdrop-blur border border-slate-700/30 rounded-lg flex-col">
          <div className="p-4 border-b border-slate-700/30">
            <h2 className="font-semibold text-white text-sm">Your Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {chatHistory.threads.length === 0 ? (
              <p className="text-xs text-slate-500 p-2">No chats yet. Create one to start!</p>
            ) : (
              chatHistory.threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedThreadId === thread.id
                      ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                      : 'hover:bg-slate-700/30 text-slate-300'
                  }`}
                >
                  <p className="text-sm font-medium truncate">{thread.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {thread.messageCount} messages
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-800/20 backdrop-blur border border-slate-700/30 rounded-lg overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {!chatHistory.currentThread ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-400 mb-4">Select a chat or create a new one</p>
                  <button
                    onClick={handleCreateNewThread}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Start Chatting
                  </button>
                </div>
              </div>
            ) : (
              <ChatMessageList
                messages={chatHistory.messages}
                isLoading={chatHistory.isLoading}
                error={chatHistory.error}
              />
            )}
          </div>

          {/* Input Area */}
          {chatHistory.currentThread && (
            <div className="border-t border-slate-700/30 p-4 bg-slate-900/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Commander Arka anything..."
                  disabled={chatHistory.isSaving}
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatHistory.isSaving || !userInput.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {chatHistory.isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  Send
                </button>
              </div>
              
              {/* Context Info */}
              {chatHistory.messages.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  📊 Context: {chatContext.messageCount} messages, ~{chatContext.estimatedTokens} tokens
                  {!chatContext.isReady && ' (exceeds limit)'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arka Controller - Shows pose and messages */}
      {arkaController.currentMessage && (
        <div className="fixed bottom-6 right-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 max-w-xs backdrop-blur-sm">
          <p className="text-sm text-blue-300">{arkaController.currentMessage.text}</p>
        </div>
      )}
    </div>
  );
}
