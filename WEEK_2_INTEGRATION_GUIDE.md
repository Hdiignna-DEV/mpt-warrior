# Week 2 Chat History - Integration Guide

**Purpose**: Show how to use Week 2 chat system components in your pages  
**Framework**: Next.js 16.1.1 (App Router)  
**Database**: Azure Cosmos DB  
**Status**: Production Ready ✅

---

## Quick Start (5 minutes)

### 1. Import & Use in Your Page
```typescript
// app/ai-mentor/chat/page.tsx
import { ChatWithArka } from '@/components/ChatWithArka';

export default function ChatPage() {
  return <ChatWithArka />;
}
```

That's it! The component handles:
- ✅ Loading user's chat threads
- ✅ Creating new threads
- ✅ Saving messages to Cosmos DB
- ✅ Auto-scrolling
- ✅ Error handling with retry
- ✅ Loading states

---

## Detailed Integration Patterns

### Pattern 1: Basic Chat Page
**Minimal setup - just display messages**

```typescript
'use client';

import { useChatHistory } from '@/hooks/useChatHistory';
import { ChatMessageList } from '@/components/ChatMessageList';
import { useState } from 'react';

export function BasicChat() {
  const threadId = 'some-thread-id';
  const { messages, addMessage, isLoading, error } = useChatHistory(threadId);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    await addMessage('user', input);
    setInput('');
    // AI response would be added here
  };

  return (
    <>
      <ChatMessageList messages={messages} isLoading={isLoading} error={error} />
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </>
  );
}
```

---

### Pattern 2: With AI API Integration
**Call Gemini/Groq/Claude API**

```typescript
'use client';

import { useChatHistory } from '@/hooks/useChatHistory';
import { useContextWindow } from '@/hooks/useContextWindow';
import { ChatMessageList } from '@/components/ChatMessageList';
import { useState } from 'react';

export function ChatWithAI() {
  const { messages, addMessage, isSaving } = useChatHistory();
  const { getGeminiMessages } = useContextWindow(messages);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    // Save user message
    await addMessage('user', input);
    setInput('');

    try {
      // Prepare context for AI
      const payload = {
        messages: getGeminiMessages(),
        systemPrompt: 'You are a helpful trading mentor...'
      };

      // Call your AI endpoint
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`
        },
        body: JSON.stringify(payload)
      });

      const { response } = await res.json();

      // Save AI response
      await addMessage('assistant', response, 'gemini');
    } catch (error) {
      console.error('AI failed:', error);
    }
  };

  return (
    <>
      <ChatMessageList messages={messages} isLoading={isSaving} />
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={isSaving}>
        {isSaving ? 'Thinking...' : 'Send'}
      </button>
    </>
  );
}
```

---

### Pattern 3: With Thread Switching
**Show thread list + messages**

```typescript
'use client';

import { useChatHistory } from '@/hooks/useChatHistory';
import { ChatMessageList } from '@/components/ChatMessageList';
import { useState } from 'react';

export function ChatWithThreads() {
  const [selectedThreadId, setSelectedThreadId] = useState<string>();
  const {
    threads,
    messages,
    currentThread,
    addMessage,
    createThread,
    switchThread,
    isLoading
  } = useChatHistory(selectedThreadId);

  const handleNewThread = async () => {
    const title = `Chat - ${new Date().toLocaleString()}`;
    const newThread = await createThread(title);
    if (newThread) {
      setSelectedThreadId(newThread.id);
    }
  };

  return (
    <div className="flex gap-4 h-screen">
      {/* Sidebar: Thread list */}
      <div className="w-64 border-r p-4">
        <button onClick={handleNewThread} className="w-full mb-4">
          New Chat
        </button>
        <div className="space-y-2">
          {threads.map(thread => (
            <button
              key={thread.id}
              onClick={() => switchThread(thread.id)}
              className={selectedThreadId === thread.id ? 'font-bold' : ''}
            >
              {thread.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main: Messages */}
      <div className="flex-1 flex flex-col">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

---

### Pattern 4: With Arka Controller Integration
**Show Arka reactions during chat**

```typescript
'use client';

import { useChatHistory } from '@/hooks/useChatHistory';
import { useContextWindow } from '@/hooks/useContextWindow';
import { useArkaController } from '@/hooks/useArkaController';
import { ChatWithArka } from '@/components/ChatWithArka';

export function ChatWithArkaReactions() {
  const { messages, addMessage } = useChatHistory();
  const { getGeminiMessages } = useContextWindow(messages);
  const arka = useArkaController('vision');

  const handleMessage = async (text: string) => {
    // Show Arka thinking
    arka.triggerVision();

    await addMessage('user', text);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: getGeminiMessages(),
          userMessage: text
        }),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mpt_token')}`
        }
      });

      const { response } = await res.json();
      await addMessage('assistant', response, 'gemini');

      // Show Arka celebrating
      arka.triggerVictory('Got your answer! 🎯');
    } catch (error) {
      // Show Arka warning
      arka.triggerWarning('Something went wrong. Try again!');
    }
  };

  return <ChatWithArka />;
}
```

---

## Hook Reference

### useChatHistory(threadId?: string)

**State**:
```typescript
{
  threads: ChatThreadPreview[]      // User's chat list
  messages: ChatMessage[]           // Current thread messages
  currentThread: ChatThreadPreview? // Active thread
  isLoading: boolean               // Fetching data
  error: string | null             // Error message
  isSaving: boolean                // Saving message
}
```

**Methods**:
```typescript
// Load user's 20 recent threads
loadThreads(): Promise<void>

// Load specific thread's messages
loadMessages(threadId: string): Promise<void>

// Save & display message
addMessage(role: 'user' | 'assistant', content: string, model?: string): Promise<ChatMessage | null>

// Create new thread
createThread(title: string): Promise<ChatThreadPreview | null>

// Switch active thread
switchThread(threadId: string): Promise<void>
```

**Auto-fetch**: Loads threads on mount, re-loads on threadId change

**Retry Logic**: 3 retries with exponential backoff (2^retry × 1000ms)

---

### useContextWindow(messages: ChatMessage[], config?: ContextWindowConfig)

**Config**:
```typescript
{
  recentMessages?: number;      // Default: 10
  includeSummary?: boolean;     // Default: true
  maxTokens?: number;           // Default: 4000
  summarizeOlderThan?: number;  // Default: 5 messages
}
```

**Return**:
```typescript
{
  contextMessages: ContextMessage[]   // Recent messages only
  messageCount: number               // Count of context messages
  estimatedTokens: number            // Rough token estimate
  fitsInContext: boolean             // Within token limit?
  isReady: boolean                   // Safe to use?
  
  // Formatters for different AI APIs
  getGeminiMessages(): ContextMessage[]
  getGroqMessages(): ContextMessage[]
  getClaudeMessages(): ContextMessage[]
  getMessagesForModel(model: 'gemini' | 'groq' | 'claude'): ContextMessage[]
  
  // Build complete API payload
  buildAPIPayload(systemPrompt?: string): {
    messages: ContextMessage[]
    systemPrompt: string
    messageCount: number
    estimatedTokens: number
  }
}
```

**Token Estimation**: 1 token ≈ 4 characters (simple approximation)

---

### useChatContext(messages: ChatMessage[], model: 'gemini' | 'groq' | 'claude')

**Variant** of `useContextWindow` with simplified API:

```typescript
const {
  messages,              // Already formatted for model
  messageCount,
  estimatedTokens,
  isReady,
  
  // Get system prompt for model
  getSystemPrompt(): string
  
  // Build complete request payload
  buildAPIPayload(userMessage?: string): APIPayload
} = useChatContext(messages, 'gemini');
```

---

## Component Reference

### ChatMessageList

**Props**:
```typescript
interface ChatMessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  error?: string | null
  currentUserName?: string
}
```

**Features**:
- Auto-scrolls to latest message
- User messages: blue, right-aligned
- Assistant messages: slate, left-aligned with avatar
- Loading spinner with "thinking..." text
- Error display with icon
- Empty state with onboarding
- Timestamps & model badges
- Responsive width
- Max height: 60vh with scroll

**Example**:
```typescript
<ChatMessageList
  messages={messages}
  isLoading={loading}
  error={error}
  currentUserName="Warrior"
/>
```

---

### ChatWithArka

**Features**:
- Complete chat interface (sidebar + messages + input)
- Thread management (create, switch, list)
- Automatic message sending with AI API call
- Arka controller integration
- Context info display (tokens, message count)
- Error handling with retry
- Responsive layout

**Example** (just drop in!):
```typescript
import { ChatWithArka } from '@/components/ChatWithArka';

export default function Page() {
  return <ChatWithArka />;
}
```

**Requires**:
- `Authorization` header support in `/api/ai/chat`
- localStorage with `mpt_token` key
- Active chat-service Cosmos DB setup

---

## API Endpoints (Use These)

### POST /api/chat/save
**Save a message**

```bash
curl -X POST http://localhost:3000/api/chat/save \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "thread-123",
    "role": "user",
    "content": "Hello Commander Arka!",
    "model": "gemini"
  }'
```

**Response**:
```json
{
  "id": "msg-456",
  "threadId": "thread-123",
  "userId": "user-789",
  "role": "user",
  "content": "Hello Commander Arka!",
  "model": "gemini",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### GET /api/chat/history
**Load user's threads**

```bash
curl http://localhost:3000/api/chat/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "threads": [
    {
      "id": "thread-123",
      "userId": "user-789",
      "title": "Trading Strategy Discussion",
      "messageCount": 12,
      "lastMessage": "How can I improve my risk management?",
      "createdAt": "2024-01-10T14:20:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET /api/chat/thread/[threadId]
**Load specific thread with messages**

```bash
curl http://localhost:3000/api/chat/thread/thread-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "thread": {
    "id": "thread-123",
    "userId": "user-789",
    "title": "Trading Strategy Discussion",
    "createdAt": "2024-01-10T14:20:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "messages": [
    {
      "id": "msg-123",
      "threadId": "thread-123",
      "role": "user",
      "content": "How do I trade forex?",
      "createdAt": "2024-01-10T14:20:00Z"
    },
    {
      "id": "msg-124",
      "threadId": "thread-123",
      "role": "assistant",
      "content": "Forex trading requires...",
      "model": "gemini",
      "createdAt": "2024-01-10T14:25:00Z"
    }
  ]
}
```

---

## Environment Setup

**Required in `.env.local`**:
```
AZURE_COSMOS_CONNECTION_STRING=your_connection_string
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Optional**:
```
# AI API keys for Week 3
GOOGLE_GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
```

---

## Testing Checklist

### Unit Tests (Optional)
```typescript
describe('useChatHistory', () => {
  it('should load threads on mount', async () => {
    const { result } = renderHook(() => useChatHistory());
    await waitFor(() => expect(result.current.threads).not.toEqual([]));
  });

  it('should add message and update state', async () => {
    const { result } = renderHook(() => useChatHistory('thread-123'));
    await result.current.addMessage('user', 'Hello');
    expect(result.current.messages.length).toBe(1);
  });
});
```

### Integration Tests
1. Load page `/ai-mentor/chat`
2. Type message in input
3. Click Send
4. Verify message appears in chat
5. Check Cosmos DB for saved message
6. Create new thread
7. Switch between threads
8. Verify persistence on refresh

---

## Debugging Tips

### Issue: Messages not loading
```typescript
// Check if localStorage has token
console.log(localStorage.getItem('mpt_token'));

// Check network tab - should see GET /api/chat/history
// Check response for errors
```

### Issue: Message send fails
```typescript
// Check thread exists
// Check authentication token is valid
// Check Cosmos DB connection
// Check /api/chat/save response for error details
```

### Issue: Context window too large
```typescript
// Use config to limit:
const context = useContextWindow(messages, {
  recentMessages: 5,  // Reduce window size
  maxTokens: 2000,    // Strict limit
});
```

### Enable Debug Logging
```typescript
// Add to hooks
const debug = true;

if (debug) {
  console.log('Threads loaded:', threads);
  console.log('Token estimate:', estimatedTokens);
  console.log('API payload:', buildAPIPayload());
}
```

---

## Performance Tips

1. **Pagination**: Load threads 20 at a time (default)
   ```typescript
   const { threads } = useChatHistory(); // 20 recent threads
   ```

2. **Context Window**: Limit to 10 recent messages
   ```typescript
   const context = useContextWindow(messages, {
     recentMessages: 10  // Keep context small
   });
   ```

3. **Memoization**: Wrap in React.memo if in list
   ```typescript
   const ChatBubble = React.memo(ChatMessageBubble);
   ```

4. **Virtualization**: For 100+ messages, use react-virtual
   ```typescript
   // Install: npm install react-virtual
   import { useVirtualizer } from '@tanstack/react-virtual';
   ```

---

## Production Checklist

Before deploying:

- [ ] Cosmos DB connection string set in Azure
- [ ] Authentication tokens properly validated
- [ ] Error handling works (retry logic tested)
- [ ] Context window fits within AI API token limits
- [ ] Auto-scroll works on mobile
- [ ] Message input accessible on mobile
- [ ] Loading states show properly
- [ ] No console errors in production build
- [ ] API rate limits considered
- [ ] User token expires and refreshes properly

---

## Next Steps (Week 3)

With Week 2 complete, Week 3 focuses on:

1. **Create AI Endpoints**
   - `POST /api/ai/chat` - Call Gemini/Groq/Claude
   - `POST /api/ai/essay-grade` - Grade essays with AI
   - Implement system prompts per use case

2. **Add Chat Pages**
   - `/ai-mentor/chat` - Main chat interface
   - `/ai-mentor/essays` - Essay submission/grading
   - `/ai-mentor/history` - Chat history viewer

3. **Enhance Context**
   - Load leaderboard context automatically
   - Include user's recent trades in context
   - Add quiz performance context

4. **Polish UI**
   - Mobile responsiveness
   - Loading animations
   - Error messages
   - Thread management UI

---

*Integration Guide | Week 2 Chat History System | Production Ready ✅*
