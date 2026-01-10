# 🎯 MPT V2.0 DEVELOPMENT CHECKLIST

**Status**: In Progress  
**Last Updated**: January 10, 2026  
**Completion**: 50%

---

## 📋 PHASE 1: VISUAL AI MENTOR UPGRADE

### 1.1 Asset Conversion
- [ ] Download all 5 PNG files from `/public/images/mascots/`
- [ ] Convert to WebP using one of these methods:
  - [ ] Online: convertio.co or cloudconvert.com
  - [ ] Command-line: ImageMagick or Python PIL
  - [ ] Software: Photoshop, GIMP, or paint.net
- [ ] Verify WebP files exist and <100KB each:
  - [ ] commander-arka-empty.webp
  - [ ] commander-arka-onboarding.webp
  - [ ] commander-arka-vision.webp
  - [ ] commander-arka-victory.webp
  - [ ] commander-arka-warning.webp
- [ ] Test transparency in new WebP files (no white backgrounds)
- [ ] Keep PNG files as fallback
- [ ] Create backup of original PNG files (git commit)

### 1.2 Desktop Layout Implementation
- [ ] Review `ResponsiveAIMentorLayoutV2.tsx`
- [ ] Test grid layout at different breakpoints:
  - [ ] Mobile (<640px): Full screen
  - [ ] Tablet (640-1024px): Full screen with floating avatar
  - [ ] Desktop (≥1024px): Grid with sidebar
- [ ] Update main layout files to use `ResponsiveAIMentorLayoutV2`:
  - [ ] `src/app/layout.tsx`
  - [ ] `src/app/dashboard/layout.tsx`
  - [ ] `src/app/leaderboard/layout.tsx`
  - [ ] `src/app/chat/layout.tsx`
- [ ] Test sidebar positioning (left vs right):
  - [ ] Right sidebar on dashboard
  - [ ] Left sidebar on login page
- [ ] Verify sidebar doesn't block content (pointer-events management)
- [ ] Test responsive breakpoint (768px) with DevTools

### 1.3 Mobile Floating Avatar
- [ ] Review `FloatingAIMentorBubble.tsx`
- [ ] Test dragging functionality:
  - [ ] Can drag avatar to all corners
  - [ ] Avatar stays within viewport bounds
  - [ ] Position persists during scroll
- [ ] Test click-to-expand behavior:
  - [ ] Click opens chat panel
  - [ ] Click again closes panel
  - [ ] Animation is smooth
- [ ] Make avatar circular (CSS border-radius: 50%)
- [ ] Test on real mobile devices:
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Tablet landscape/portrait

### 1.4 Dynamic Opacity & Scrolling
- [ ] Test scroll trigger:
  - [ ] Sidebar fades to 30% on scroll start
  - [ ] Returns to 100% after 1s of no scrolling
  - [ ] Smooth transition (300ms)
- [ ] Test hover trigger:
  - [ ] Sidebar brightens to 100% on hover
  - [ ] Fades back on mouse leave
- [ ] Test active trigger:
  - [ ] 100% opacity when `mentorActive={true}`
- [ ] Verify `will-change: opacity` for performance
- [ ] Performance test: 60fps on scroll

### 1.5 Interactive Poses System
- [ ] Test `useArkaPoseController()` hook:
  - [ ] Pose changes to 'vision' on trigger
  - [ ] Auto-resets to default after 3s
  - [ ] Message displays with pose
- [ ] Test `useArkaChatController()` hooks:
  - [ ] `triggerVision()` → Shows "Analyzing..."
  - [ ] `triggerVictory()` → Shows "Victory!"
  - [ ] `triggerWarning()` → Shows "Caution!"
  - [ ] `onAPICallStart()` → Shows thinking
  - [ ] `onAPICallSuccess()` → Shows success
  - [ ] `onAPICallError()` → Shows error
- [ ] Test `useArkaAchievementController()`:
  - [ ] `onRankIncreased()` → Shows rank change
  - [ ] `onTopThreeEntry()` → Shows top 3 message
  - [ ] `onQuizPass()` → Shows pass message
  - [ ] `onQuizFail()` → Shows fail message
- [ ] Test custom timing:
  - [ ] Default 3s auto-reset
  - [ ] Custom durations work
  - [ ] Persistent poses don't auto-reset

---

## 📚 PHASE 2: CHAT HISTORY PERSISTENCE

### 2.1 Chat History Database Schema
- [ ] Verify Cosmos DB connection:
  - [ ] Check `.env.local` has `AZURE_COSMOS_CONNECTION_STRING`
  - [ ] Test connection with `npm run db:check`
- [ ] Create/verify 'chatHistory' container:
  - [ ] Partition key: `/userId`
  - [ ] TTL (optional): 90 days for archives
- [ ] Test `chatHistoryService`:
  - [ ] `createSession()` creates new session
  - [ ] `addMessage()` adds message to session
  - [ ] `getSession()` retrieves session
  - [ ] `getRecentMessages()` gets last N messages
  - [ ] `getUserSessions()` lists all user sessions
  - [ ] `archiveSession()` archives without deleting
  - [ ] `deleteSession()` deletes permanently
- [ ] Test topic extraction:
  - [ ] Topics identified from messages
  - [ ] Correct keywords matched
- [ ] Test context summary generation:
  - [ ] Summary generated from messages
  - [ ] Reflects conversation content

### 2.2 Auto-Fetch Chat History on Login
- [ ] Create `useChatHistoryLoader()` integration:
  - [ ] Add to main layout/auth context
  - [ ] Auto-loads on `user` change
  - [ ] Loading state shows spinner
  - [ ] Error state shows error message
- [ ] Test session loading:
  - [ ] `loadUserSessions()` fetches all sessions
  - [ ] `loadSession()` fetches single session with messages
  - [ ] `loadLastSession()` loads most recent session
  - [ ] Sessions cached in sessionStorage
  - [ ] Cache cleared on logout
- [ ] Test message loading:
  - [ ] Recent 20 messages loaded
  - [ ] Limit parameter works (e.g., 5, 10, 20)
  - [ ] Messages displayed in correct order
- [ ] Test session creation:
  - [ ] New session created with title
  - [ ] Provider (gemini/groq/claude) selectable
  - [ ] Session appears in all sessions list
- [ ] Performance testing:
  - [ ] Load <2s for 20 messages
  - [ ] Load <3s for 100 messages

### 2.3 Send Chat Context to AI API
- [ ] Implement `buildAIPayload()` in API route:
  - [ ] Builds system context from recent messages
  - [ ] Includes topic summary
  - [ ] Formats for AI API consumption
- [ ] Create `/api/chat` route:
  - [ ] Accepts user message + session ID
  - [ ] Calls `buildAIPayload()`
  - [ ] Sends to Gemini/Groq with context
  - [ ] Saves AI response to session
  - [ ] Returns response to frontend
- [ ] Test with Gemini:
  - [ ] Context included in request
  - [ ] AI remembers previous messages
  - [ ] Response is contextually aware
- [ ] Test with Groq:
  - [ ] Same as Gemini
  - [ ] Response time acceptable (<2s)
- [ ] Test error handling:
  - [ ] API errors handled gracefully
  - [ ] User sees error message
  - [ ] Session not corrupted

---

## 🎓 PHASE 3: QUIZ GRADING SYSTEM

### 3.1 AI Co-Mentor Grading Prompt
- [ ] Create grading prompt template:
  - [ ] Takes student answer as input
  - [ ] Returns score (0-100)
  - [ ] Returns analysis
  - [ ] Returns feedback/suggestions
- [ ] Test with sample answers:
  - [ ] High-quality answer → score 90-100
  - [ ] Good answer → score 70-89
  - [ ] Needs improvement → score 50-69
  - [ ] Poor answer → score 0-49
- [ ] Test prompt with multiple AI providers:
  - [ ] Gemini AI grading
  - [ ] Groq grading
  - [ ] Result consistency

### 3.2 Founder Approval Dashboard
- [ ] Create admin dashboard page:
  - [ ] Path: `/admin-hq/quiz-approvals` or similar
  - [ ] Only accessible to founder (`is_founder: true`)
  - [ ] Lists pending quiz submissions
- [ ] Display elements:
  - [ ] Student name and answer
  - [ ] AI-suggested score (0-100)
  - [ ] AI feedback/analysis
  - [ ] Approve button
  - [ ] Reject with manual score input
  - [ ] Edit score option
- [ ] Database updates:
  - [ ] Store founder's approval decision
  - [ ] Store actual score (AI or manually adjusted)
  - [ ] Timestamp of approval
- [ ] Notification to student:
  - [ ] Score published to student
  - [ ] Feedback displayed in course

### 3.3 Quiz Feedback Visual System
- [ ] Victory pose for passing quiz:
  - [ ] Score ≥70% → trigger `triggerVictory()`
  - [ ] Victory pose + "✅ Passed!" message
  - [ ] Confetti animation on screen
  - [ ] Celebration sound (optional)
- [ ] Warning pose for failing:
  - [ ] Score <70% → trigger `triggerWarning()`
  - [ ] Warning pose + "📚 Review needed!" message
  - [ ] Encourage retake message
  - [ ] Link to review materials
- [ ] Update Quiz.tsx:
  - [ ] Import pose controller
  - [ ] Trigger appropriate pose after grading
  - [ ] Display feedback message

---

## 🏆 PHASE 4: LEADERBOARD & FOUNDER IDENTITY

### 4.1 Leaderboard & Ranking System
- [ ] Verify leaderboard container in Cosmos DB:
  - [ ] Container: 'leaderboard'
  - [ ] Partition key: '/userId'
  - [ ] TTL: optional (never expire)
- [ ] Implement ranking calculation:
  - [ ] Points from trades
  - [ ] Quiz scores
  - [ ] Achievement bonuses
  - [ ] Streak multipliers
- [ ] Create leaderboard views:
  - [ ] Sidebar page: "Warrior Ranking" (full page)
  - [ ] Dashboard widget: Top 3 global + user rank
  - [ ] Pagination for Top 100
- [ ] Real-time updates:
  - [ ] WebSocket or polling for live ranking
  - [ ] Reflect rank changes immediately

### 4.2 Founder Identity & Badge
- [ ] Add to user profile schema:
  - [ ] `is_founder: boolean` field
  - [ ] Set to `true` for Deden's account only
- [ ] Create founder badge:
  - [ ] Gold badge with "FOUNDER" text
  - [ ] Crown or special icon
  - [ ] Display on profile
  - [ ] Display in leaderboard
- [ ] Founder positioning:
  - [ ] Pinned at top of leaderboard
  - [ ] OR special section above Top 100
  - [ ] OR rank #0 with special styling
- [ ] Database flag check:
  - [ ] Query includes `is_founder` field
  - [ ] Badge renders when true

### 4.3 Elite Top 3 Reward System
- [ ] Profile glow effect:
  - [ ] Users ranked #1-3 get gold border/glow
  - [ ] CSS: `box-shadow: 0 0 20px rgba(gold)`
  - [ ] Animation: subtle pulsing
- [ ] Leaderboard highlighting:
  - [ ] Top 3 rows have special background color
  - [ ] Different colors for 1st/2nd/3rd place
  - [ ] Gold/Silver/Bronze theme
- [ ] Notifications:
  - [ ] User notified when entering Top 3
  - [ ] Message: "🏆 Congratulations! You're in Top 3!"
  - [ ] Trigger `onTopThreeEntry()` pose

---

## 🔔 PHASE 5: NOTIFICATIONS & DEEP LINKING

### 5.1 Notification Trigger Logic
- [ ] Achievement notifications:
  - [ ] Quiz passed → Notify
  - [ ] Quiz with high score → Notify
  - [ ] Streak milestone → Notify
- [ ] Rank notifications:
  - [ ] Rank increased → Notify
  - [ ] Entered Top 10 → Notify
  - [ ] Entered Top 3 → Notify with special badge
- [ ] Weekend missions:
  - [ ] Friday 6 PM: Mission available
  - [ ] Monday 9 AM: Reminder for weekend mission
  - [ ] Push notification to active users
- [ ] Storage:
  - [ ] Notifications stored in database
  - [ ] Mark as read/unread
  - [ ] Archive old notifications

### 5.2 Deep Linking Setup
- [ ] Notification click handling:
  - [ ] Click on quiz notification → `/academy/quiz/quiz-id`
  - [ ] Click on leaderboard → `/leaderboard`
  - [ ] Click on achievement → `/achievements`
- [ ] URL parameter handling:
  - [ ] `?from=notification` parameter
  - [ ] Auto-scroll to relevant section
  - [ ] Restore previous scroll position on back
- [ ] Browser history:
  - [ ] Notification links add to history
  - [ ] Back button works correctly

### 5.3 On-Entry Animation & Motivation
- [ ] Onboarding pose display:
  - [ ] Deep link page opens with `arka-onboarding.webp`
  - [ ] Smooth entrance animation
  - [ ] Speech bubble with motivational message
- [ ] Motivation messages:
  - [ ] Different messages for different contexts
  - [ ] Store message pool in database
  - [ ] Rotate messages for variety
- [ ] Animation details:
  - [ ] Fade-in entrance (200ms)
  - [ ] Scale-in with bounce (300ms)
  - [ ] Auto-hide after 5s (optional)

---

## 🧪 TESTING CHECKLIST

### Unit Tests
- [ ] `ArkaMascotImage.tsx` - Component renders with correct props
- [ ] `useArkaPoseController()` - Pose changes and resets correctly
- [ ] `chatHistoryService.ts` - All CRUD operations work
- [ ] `useChatHistoryLoader()` - Loading and caching work

### Integration Tests
- [ ] Chat flow: Send message → Save to DB → Load on reload
- [ ] Pose flow: API call → Pose change → Auto-reset
- [ ] Layout flow: Resize window → Switch layout → No errors

### E2E Tests
- [ ] User login → Chat history loads → Send message → Pose triggers
- [ ] Responsive design → Mobile → Tablet → Desktop
- [ ] Leaderboard rank change → Notification → Pose triggers

### Performance Tests
- [ ] Lighthouse score >90
- [ ] Load time <2s
- [ ] Chat history load <2s
- [ ] Pose transition 60fps
- [ ] Layout shift <0.1

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Browser compatibility verified
- [ ] Security review complete

### Deployment
- [ ] Build successfully: `npm run build`
- [ ] No build errors
- [ ] Environment variables configured:
  - [ ] NEXT_PUBLIC_GEMINI_API_KEY
  - [ ] AZURE_COSMOS_CONNECTION_STRING
  - [ ] Others as needed
- [ ] Deploy to Vercel
- [ ] Test production build

### Post-Deployment
- [ ] All features working in production
- [ ] Performance acceptable
- [ ] Error tracking (Sentry) setup
- [ ] Monitoring active
- [ ] Ready for user testing

---

## 📊 PROGRESS TRACKING

| Phase | Task | Status | Due Date | Notes |
|-------|------|--------|----------|-------|
| 1.1 | Asset Conversion | ⏳ | Today | Needs manual conversion |
| 1.2 | Desktop Layout | ✅ | - | ResponsiveAIMentorLayoutV2 ready |
| 1.3 | Mobile Avatar | 🟡 | Week 1 | Styling improvements needed |
| 1.4 | Dynamic Opacity | ✅ | - | AIMentorSidebar implements |
| 1.5 | Pose System | ✅ | - | All hooks created |
| 2.1 | Chat DB | ✅ | - | Service ready |
| 2.2 | Auto-Load History | ✅ | - | Hooks ready |
| 2.3 | AI Context | 🟡 | Week 2 | Needs API route implementation |
| 3.1 | Grading Prompt | ⏳ | Week 2 | Not started |
| 3.2 | Admin Dashboard | ⏳ | Week 2 | Not started |
| 3.3 | Quiz Feedback | ⏳ | Week 2 | Not started |
| 4.1 | Leaderboard | ⏳ | Week 3 | Not started |
| 4.2 | Founder Badge | ⏳ | Week 3 | Not started |
| 4.3 | Top 3 Rewards | ⏳ | Week 3 | Not started |
| 5.1 | Notifications | ⏳ | Week 4 | Not started |
| 5.2 | Deep Linking | ⏳ | Week 4 | Not started |
| 5.3 | On-Entry Animation | ⏳ | Week 4 | Not started |

**Legend**: ✅ Complete | 🟡 In Progress | ⏳ Not Started | ❌ Blocked

---

## 📝 NOTES

- All code follows TypeScript best practices
- Components use Tailwind CSS for styling
- Next.js 14+ conventions used
- Accessibility (WCAG) compliant
- Error handling implemented
- Loading states included
- Mobile-first approach

---

**Last Updated**: January 10, 2026  
**Next Review**: January 14, 2026  
**Questions?** Check the documentation files or implementation guide.

