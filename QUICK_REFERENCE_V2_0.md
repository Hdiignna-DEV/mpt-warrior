# 🎯 MPT V2.0 - QUICK REFERENCE & CODE SNIPPETS

**Last Updated**: January 10, 2026

---

## 🚀 QUICK COMMANDS

### Project Setup
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run migrations
npm run migrate-leaderboard
```

### Asset Conversion (Quick)
```bash
# Convert single PNG to WebP (requires ImageMagick)
magick convert commander-arka-empty.png commander-arka-empty.webp

# Batch convert all PNG in folder
for file in public/images/mascots/*.png; do
  magick convert "$file" "${file%.png}.webp"
done
```

---

## 📁 NEW FILES CREATED

| File | Purpose | Phase |
|------|---------|-------|
| `src/components/ArkaMascotImage.tsx` | WebP image component | 1.1 |
| `src/components/ResponsiveAIMentorLayoutV2.tsx` | Grid-based layout | 1.2 |
| `src/hooks/useArkaPoseController.ts` | Pose management hooks | 1.5 |
| `src/services/chatHistoryService.ts` | Chat DB service | 2.1 |
| `src/hooks/useChatHistoryLoader.ts` | Chat history loader | 2.2 |
| `PHASE_1_ASSET_CONVERSION_PLAN.md` | Asset conversion guide | 1.1 |
| `PHASE_1_2_IMPLEMENTATION_GUIDE.md` | Full implementation guide | 1-2 |

---

## 💻 COMPONENT USAGE EXAMPLES

### 1. Use Responsive Layout

```tsx
// app/dashboard/layout.tsx
import { ResponsiveAIMentorLayoutV2 } from '@/components/ResponsiveAIMentorLayoutV2';

export default function DashboardLayout({ children }) {
  return (
    <ResponsiveAIMentorLayoutV2
      mentorPose="vision"
      mentorActive={false}
      position="right"
      showMobileAvatar={true}
      showDesktopSidebar={true}
    >
      {children}
    </ResponsiveAIMentorLayoutV2>
  );
}
```

### 2. Display Arka Image

```tsx
// components/MyComponent.tsx
import { ArkaMascotImage } from '@/components/ArkaMascotImage';

export function MyComponent() {
  return (
    <div className="flex justify-center">
      <ArkaMascotImage 
        pose="victory"
        className="w-32 h-48"
      />
    </div>
  );
}
```

### 3. Use Pose Controller (Chat)

```tsx
// app/chat/page.tsx
import { useArkaChatController } from '@/hooks/useArkaPoseController';

export function ChatPage() {
  const arka = useArkaChatController();

  const handleSendMessage = async (message: string) => {
    arka.onUserTyping(); // Shows "Listening..."
    
    try {
      arka.onAPICallStart(); // Shows thinking pose
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });

      arka.onAPICallSuccess(100); // Shows victory
      return response.json();
    } catch (error) {
      arka.onAPICallError(error); // Shows warning
      throw error;
    }
  };

  return (
    <div>
      <div className="text-center font-bold mb-4">
        Current pose: {arka.pose}
      </div>
      {/* Chat UI here */}
    </div>
  );
}
```

### 4. Use Pose Controller (Achievements)

```tsx
// components/LeaderboardNotification.tsx
import { useArkaAchievementController } from '@/hooks/useArkaPoseController';

export function LeaderboardNotification({ rank, previousRank }) {
  const arka = useArkaAchievementController();

  useEffect(() => {
    if (rank < previousRank) {
      arka.onRankIncreased(rank, previousRank);
    }
    
    if (rank <= 3) {
      arka.onTopThreeEntry(rank);
    }
  }, [rank, previousRank]);

  return (
    <div className="text-center">
      <p className="text-lg font-bold">{arka.message}</p>
    </div>
  );
}
```

### 5. Load Chat History on Login

```tsx
// app/dashboard/page.tsx
import { useChatHistoryLoader } from '@/hooks/useChatHistoryLoader';

export function DashboardPage() {
  const chatLoader = useChatHistoryLoader({ autoLoad: true });

  if (chatLoader.isLoading) {
    return <div>Loading chat history...</div>;
  }

  if (chatLoader.error) {
    return <div>Error: {chatLoader.error}</div>;
  }

  return (
    <div>
      <h2>Chat Sessions ({chatLoader.allSessions.length})</h2>
      {chatLoader.allSessions.map(session => (
        <div key={session.id} onClick={() => chatLoader.loadSession(session.id)}>
          {session.title} - {session.messageCount} messages
        </div>
      ))}

      {chatLoader.currentSession && (
        <div>
          <h3>{chatLoader.currentSession.title}</h3>
          <p>Messages: {chatLoader.recentMessages.length}</p>
        </div>
      )}
    </div>
  );
}
```

### 6. Chat Session Manager

```tsx
// app/chat/page.tsx
import { useChatSessionManager } from '@/hooks/useChatHistoryLoader';

export function ChatPage() {
  const sessionManager = useChatSessionManager();

  const handleNewChat = async () => {
    await sessionManager.createAndSwitchSession('New Chat - Philosophy');
  };

  const handleSwitchChat = async (sessionId: string) => {
    await sessionManager.switchSession(sessionId);
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 h-screen">
      {/* Sidebar: Sessions */}
      <div className="border-r border-slate-700/30 p-4 overflow-y-auto">
        <button 
          onClick={handleNewChat}
          className="w-full mb-4 px-4 py-2 bg-blue-600 rounded-lg"
        >
          + New Chat
        </button>

        {sessionManager.allSessions.map(session => (
          <div
            key={session.id}
            onClick={() => handleSwitchChat(session.id)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              sessionManager.currentSession?.id === session.id
                ? 'bg-blue-500'
                : 'bg-slate-700/50'
            }`}
          >
            {session.title}
          </div>
        ))}
      </div>

      {/* Main: Chat */}
      <div className="flex flex-col">
        <h2>{sessionManager.currentSession?.title}</h2>
        
        {sessionManager.messages.map(msg => (
          <div key={msg.id} className={msg.role === 'user' ? 'ml-auto' : ''}>
            {msg.content}
          </div>
        ))}

        <input
          type="text"
          placeholder="Type message..."
          onKeyPress={async (e) => {
            if (e.key === 'Enter' && sessionManager.currentSession) {
              const content = (e.target as HTMLInputElement).value;
              await sessionManager.addMessage('user', content);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
    </div>
  );
}
```

---

## 🗄️ DATABASE SCHEMA

### Chat History Schema
```typescript
// ChatSession
{
  id: "session_1705xxx_abc123",
  userId: "user_12345",
  title: "Trading Strategy Discussion",
  description: "Understanding Risk Management",
  messages: [
    {
      id: "msg_1705xxx_xyz789",
      role: "user",
      content: "How do I calculate position size?",
      provider: "gemini",
      timestamp: "2026-01-10T10:30:00Z",
      tokenCount: 12
    }
  ],
  provider: "gemini",
  messageCount: 5,
  totalTokens: 245,
  createdAt: "2026-01-10T10:00:00Z",
  updatedAt: "2026-01-10T10:30:00Z",
  lastAccessedAt: "2026-01-10T10:30:00Z",
  isArchived: false,
  isFavorite: false
}
```

### User Profile Additions (Phase 4)
```typescript
{
  id: "user_12345",
  email: "warrior@mpt.com",
  username: "WarriorName",
  
  // NEW FOR V2.0
  is_founder: false,  // TRUE only for Deden
  current_rank: 15,
  total_points: 2450,
  win_rate: 65.5,
  
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2026-01-10T10:30:00Z"
}
```

---

## 🔌 API ENDPOINTS (To be created)

| Method | Endpoint | Purpose | Phase |
|--------|----------|---------|-------|
| GET | `/api/chat/sessions` | Get all user sessions | 2.2 |
| POST | `/api/chat/sessions` | Create new session | 2.2 |
| GET | `/api/chat/sessions/:id` | Get session + messages | 2.2 |
| POST | `/api/chat/sessions/:id/messages` | Add message | 2.2 |
| POST | `/api/ai/chat` | Chat with AI (with context) | 2.3 |
| POST | `/api/quiz/grade` | Grade quiz with AI | 3.1 |
| GET | `/api/leaderboard` | Get ranking | 4.1 |
| PATCH | `/api/user/profile` | Update user profile | 4.2 |

---

## 🎨 CSS CLASSES REFERENCE

### Responsive Breakpoints (Tailwind)
```
- Mobile: <640px (sm)
- Tablet: 640-1024px (md, lg)
- Desktop: ≥1024px (xl)
- Layout switch: 768px (in components)
```

### Dark Mode Colors
```
- Background: from-slate-950 to-slate-900
- Border: border-slate-700/30
- Text: text-slate-400 (muted), text-white (primary)
- Accent: blue-600, amber-600, green-500
```

### Animations
```
- Opacity transition: transition-all duration-300
- Scale on click: active:scale-95
- Fade in: animate-in fade-in duration-200
- Pulse: animate-pulse
```

---

## 🔑 ENVIRONMENT VARIABLES (Existing + New)

```env
# Existing
NEXT_PUBLIC_GEMINI_API_KEY=...
GEMINI_API_KEY=...
AZURE_COSMOS_ENDPOINT=...
AZURE_COSMOS_KEY=...

# Already configured but needed for chat
JWT_SECRET=...

# New for V2.0 (Optional but recommended)
NEXT_PUBLIC_APP_VERSION=2.0.0
CHAT_MAX_HISTORY_DAYS=90
CHAT_CONTEXT_WINDOW_SIZE=5
```

---

## 🧪 QUICK TEST COMMANDS

### Test WebP Support
```javascript
// In browser console
const canvas = document.createElement('canvas');
const webpSupported = canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
console.log('WebP supported:', webpSupported);
```

### Test Chat Session API
```bash
# Create session
curl -X POST http://localhost:3000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Chat","provider":"gemini"}'

# Add message
curl -X POST http://localhost:3000/api/chat/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"role":"user","content":"Hello Arka!"}'
```

---

## 📊 PERFORMANCE TARGETS

| Metric | Target | Current |
|--------|--------|---------|
| WebP file size | <100KB | - (after conversion) |
| Layout render | <300ms | ✓ (grid) |
| Pose transition | <500ms | ✓ (animation) |
| Chat history load | <2s | - (to test) |
| AI response time | <3s | - (API dependent) |

---

## 🚨 COMMON ISSUES & FIXES

### Issue: Images not loading
**Solution**: Check image paths and browser WebP support
```bash
# Verify files exist
ls -la public/images/mascots/commander-arka-*.webp
```

### Issue: Layout breaks at 768px
**Solution**: Check ResponsiveAIMentorLayoutV2 imports
```tsx
// Make sure you're using V2, not old version
import { ResponsiveAIMentorLayoutV2 } from '@/components/ResponsiveAIMentorLayoutV2';
```

### Issue: Chat history not loading
**Solution**: Verify Cosmos DB connection and container
```bash
# Check environment variables
cat .env.local | grep COSMOS

# Verify container exists
az cosmosdb sql container list --resource-group rg-name --account-name cosmos-name
```

---

## 📞 SUPPORT

**Phase 1-2 Complete!** ✅

Next phases in development:
- Phase 2.3: AI Context Integration
- Phase 3: Quiz Grading System
- Phase 4: Leaderboard Enhancement
- Phase 5: Notifications & Deep Linking

**Questions?** Check PHASE_1_2_IMPLEMENTATION_GUIDE.md for detailed walkthroughs.

