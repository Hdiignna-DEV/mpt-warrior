# 🚀 MPT COMMAND CENTER V2.0 - IMPLEMENTATION GUIDE

**Status**: ✅ Phase 1.1-1.5 & Phase 2.1-2.2 COMPLETE  
**Date**: January 10, 2026  
**Progress**: 50% Complete (9/18 tasks)

---

## 📊 PROGRESS SUMMARY

### ✅ COMPLETED (Phases 1 & 2.1-2.2)

#### Phase 1: Visual AI Mentor Upgrade
- [x] **1.1: Asset Conversion Strategy** 
  - Created `ArkaMascotImage.tsx` component for WebP + PNG fallback
  - Asset plan: `PHASE_1_ASSET_CONVERSION_PLAN.md`
  - 5 PNG files ready for conversion (50% size reduction expected)

- [x] **1.2: Desktop Anti-Blocking Layout**
  - Created `ResponsiveAIMentorLayoutV2.tsx`
  - Grid-based layout: [Sidebar 20%] [Content 80%]
  - Smooth responsive breakpoints at 768px (md)
  - Left/right sidebar positioning support

- [x] **1.4: Dynamic Opacity & Scrolling**
  - `AIMentorSidebar.tsx` already implements:
    - Scroll trigger: 30% opacity
    - Hover: 100% opacity
    - Smooth transitions with `will-change: opacity`
    - Pointer-events management for zero-obstruction

- [x] **1.5: Interactive Poses System**
  - Created `useArkaPoseController.ts` hook family:
    - `useArkaPoseController()` - Core pose management
    - `useArkaChatController()` - Chat-specific triggers
    - `useArkaAchievementController()` - Achievement triggers
  - Automatic pose transitions with custom timings
  - Message displays with poses

#### Phase 2: Chat History Persistence
- [x] **2.1: Chat History Database Schema**
  - Created `chatHistoryService.ts` with:
    - `ChatSession` interface (full session management)
    - `ChatMessage` interface (message structure)
    - `ChatContextWindow` (AI context building)
    - CRUD operations: create, read, update, delete
    - Session archiving and cleanup

- [x] **2.2: Auto-Fetch Chat History on Login**
  - Created `useChatHistoryLoader.ts` hook family:
    - `useChatHistoryLoader()` - Session loading + caching
    - `useChatMessages()` - Message management
    - `useChatSessionManager()` - Combined manager
  - Auto-load on mount
  - SessionStorage caching
  - Error handling and loading states

---

## 🔧 INTEGRATION CHECKLIST

### Step 1: Convert PNG Assets to WebP

**Timeline**: Today (1-2 hours)

```bash
# Option A: Online converter (easiest)
# Visit: https://convertio.co/png-webp/
# Upload: /public/images/mascots/*.png
# Download as WebP (lossless)

# Option B: Command-line (if ImageMagick installed)
magick convert commander-arka-empty.png commander-arka-empty.webp

# Option C: Python script
python3 -c "
from PIL import Image
for pose in ['empty', 'onboarding', 'vision', 'victory', 'warning']:
    img = Image.open(f'commander-arka-{pose}.png')
    img.save(f'commander-arka-{pose}.webp', 'WebP')
"
```

**Verify**:
- [ ] All 5 .webp files in `/public/images/mascots/`
- [ ] PNG fallbacks remain
- [ ] File sizes <100KB each
- [ ] Transparent backgrounds (no white/gray)

---

### Step 2: Update Component Imports

**Files to update**:

#### 1. AIMentorSidebar.tsx
Replace PNG import:
```tsx
// OLD
<Image
  src={`/images/mascots/commander-arka-${pose}.png`}
  ...
/>

// NEW
<ArkaMascotImage 
  pose={pose}
  width={96}
  height={144}
/>
```

#### 2. FloatingAIMentor.tsx
Update image sources to use WebP with fallback:
```tsx
<picture>
  <source srcSet={`/images/mascots/commander-arka-${pose}.webp`} type="image/webp" />
  <img src={`/images/mascots/commander-arka-${pose}.png`} />
</picture>
```

#### 3. Integrate ResponsiveAIMentorLayoutV2.tsx
Replace in your main layout:
```tsx
// In src/app/layout.tsx or app/dashboard/layout.tsx
import { ResponsiveAIMentorLayoutV2 } from '@/components/ResponsiveAIMentorLayoutV2';

export default function RootLayout({ children }) {
  return (
    <ResponsiveAIMentorLayoutV2
      mentorPose="vision"
      mentorActive={false}
      position="right"
    >
      {children}
    </ResponsiveAIMentorLayoutV2>
  );
}
```

---

### Step 3: Implement Chat History API Routes

**Create**: `src/app/api/chat/sessions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { chatHistoryService } from '@/services/chatHistoryService';
import { verifyAuth } from '@/lib/auth';

// GET: Fetch all sessions
export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const sessions = await chatHistoryService.getUserSessions(user.id);
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create new session
export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, provider } = await request.json();
    const session = await chatHistoryService.createSession(user.id, title, provider);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Create**: `src/app/api/chat/sessions/[sessionId]/route.ts`

```typescript
// GET: Fetch session with recent messages
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = parseInt(request.headers.get('x-message-limit') || '20');

  try {
    const session = await chatHistoryService.getSession(user.id, params.sessionId);
    const recentMessages = await chatHistoryService.getRecentMessages(
      user.id,
      params.sessionId,
      limit
    );

    return NextResponse.json({ session, recentMessages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Create**: `src/app/api/chat/sessions/[sessionId]/messages/route.ts`

```typescript
// POST: Add message to session
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { role, content, provider } = await request.json();
    const message = await chatHistoryService.addMessage(user.id, params.sessionId, {
      role,
      content,
      provider,
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### Step 4: Integrate Pose Controllers in Components

#### ChatWithArka.tsx
```tsx
import { useArkaChatController } from '@/hooks/useArkaPoseController';

export function ChatWithArka() {
  const arkaController = useArkaChatController();
  const { addMessage } = useChatMessages();

  const handleSendMessage = async (userInput: string) => {
    // Save user message
    await addMessage('user', userInput);
    
    // Show Arka thinking
    arkaController.onUserTyping();

    try {
      // Call AI API
      arkaController.onAPICallStart();
      const response = await fetch('/api/ai/chat', { /* ... */ });
      
      if (!response.ok) throw new Error('API failed');
      
      const { message } = await response.json();
      arkaController.onAPICallSuccess(message.length);
      
      await addMessage('assistant', message);
    } catch (error) {
      arkaController.onAPICallError(error as Error);
    }
  };

  return (
    <div>
      {/* Arka pose display */}
      <div>{arkaController.pose}</div>
      {/* Chat UI */}
    </div>
  );
}
```

#### LeaderboardArkaTrigger.tsx (for Phase 4)
```tsx
import { useArkaAchievementController } from '@/hooks/useArkaPoseController';

export function LeaderboardArkaTrigger({ userRank, previousRank }: Props) {
  const arkaController = useArkaAchievementController();

  useEffect(() => {
    if (userRank < previousRank) {
      // Rank improved
      arkaController.onRankIncreased(userRank, previousRank);
    }

    if (userRank <= 3) {
      // Top 3 achievement
      arkaController.onTopThreeEntry(userRank);
    }
  }, [userRank, previousRank]);

  return null; // Pose changes are triggered via controller
}
```

---

## 📋 NEXT STEPS (In Priority Order)

### Immediate (This Week)
1. **Convert PNG → WebP** (4 hours)
   - Use online converter or ImageMagick
   - Verify transparency and file sizes
   - Test in browsers

2. **Update Component Imports** (2 hours)
   - Replace PNG paths with WebP
   - Test responsive layout at 768px breakpoint
   - Verify Dark Mode appearance

3. **Create API Routes** (4 hours)
   - Implement chat session endpoints
   - Test with Postman/curl
   - Add error handling

4. **Integrate Pose Controllers** (3 hours)
   - Update ChatWithArka.tsx
   - Test pose transitions
   - Verify message displays

### Next Week
5. **Phase 2.3: AI Context Integration** (5 hours)
   - Integrate buildAIPayload() in /api/ai/chat routes
   - Test with Gemini and Groq
   - Verify context window is sent correctly

6. **Phase 3.1-3.3: Quiz Grading** (8 hours)
   - Create AI grading prompt
   - Build admin approval dashboard
   - Add quiz feedback visuals

7. **Phase 4: Leaderboard Enhancement** (6 hours)
   - Add is_founder flag
   - Implement founder badge
   - Add Top 3 glow effect

8. **Phase 5: Notifications** (6 hours)
   - Implement notification triggers
   - Setup deep linking
   - Add on-entry animations

---

## 🔍 VERIFICATION CHECKLIST

### Phase 1 Verification
- [ ] WebP assets display correctly in all browsers
- [ ] Layout grid adjusts properly at 768px breakpoint
- [ ] Sidebar opacity changes on scroll (30%) and hover (100%)
- [ ] Pose transitions are smooth (3s auto-reset)
- [ ] Mobile floating avatar is draggable and clickable

### Phase 2 Verification
- [ ] Chat sessions created and stored in Cosmos DB
- [ ] Recent messages load on login
- [ ] Session caching works (sessionStorage)
- [ ] Context window builds correctly for AI
- [ ] AI receives context in system prompt

### Performance Metrics
- [ ] Page load: <2s (with assets)
- [ ] Pose transition: <500ms
- [ ] API response: <2s (with context)
- [ ] Asset size per file: <100KB

---

## 📞 TROUBLESHOOTING

### WebP Not Loading
```typescript
// In browser console
document.createElement('canvas').toDataURL('image/webp').indexOf('image/webp') === 0
// Should return true
```

### Chat History Not Persisting
- Check Cosmos DB connection string in .env
- Verify container "chatHistory" exists with partition key "/userId"
- Check user authentication token validity

### Pose Not Changing
- Verify pose name matches CommanderArkaPose type
- Check useArkaPoseController is imported from correct path
- Ensure component is wrapped with <ArkaMascotImage>

### Layout Not Responsive
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check media query breakpoint (768px)
- Verify grid-cols classes in Tailwind config

---

## 📚 REFERENCE LINKS

- Next.js Image Optimization: https://nextjs.org/docs/app/api-reference/components/image
- WebP Format Guide: https://developers.google.com/speed/webp
- Azure Cosmos DB: https://learn.microsoft.com/azure/cosmos-db/
- Tailwind CSS Grid: https://tailwindcss.com/docs/grid-template-columns

---

**Next Session**: Implement Phase 2.3 (AI Context) + Phase 3 (Quiz Grading)  
**Estimated Timeline**: 40 hours of development + testing

