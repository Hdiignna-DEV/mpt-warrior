# 🧪 Phase 4 & 5: Testing Guide

## ✅ Status: Ready for Testing

All Phase 4 & 5 features are implemented and building successfully.

---

## 🎯 Quick Start Testing

### Step 1: Environment Setup
```bash
# Copy template to actual config
cp .env.local.example .env.local

# Edit .env.local with your credentials:
COSMOS_ENDPOINT=https://YOUR_ACCOUNT.documents.azure.com:443/
COSMOS_KEY=YOUR_PRIMARY_KEY
GEMINI_API_KEY=YOUR_KEY
SENDGRID_API_KEY=YOUR_KEY
```

### Step 2: Start Dev Server
```bash
npm run dev
# Server runs at http://localhost:3000
```

### Step 3: Test Features
```
✓ Leaderboard page (Phase 4)
✓ Quiz grading (Phase 3)
✓ Chat history (Phase 2)
✓ Email notifications (Phase 5)
```

---

## 📊 Phase 4: Leaderboard Auto-Update Testing

### Feature: Real-Time Leaderboard Rankings

**Files to Test:**
- `src/services/leaderboardAutoUpdateService.ts` - Score calculation logic
- `src/hooks/useLeaderboardAutoUpdate.ts` - React integration
- `src/components/LeaderboardWithAutoUpdate.tsx` - UI component
- `src/app/api/leaderboard/update-score/route.ts` - API endpoint

### Test Cases:

#### Test 1: Score Calculation ✓
```typescript
// Expected: Quiz (85%) → 34 points
// Expected: Chat (15 msgs) → 15 points
// Expected: Streak (10 days) → 5 points
// Expected: Achievements (2) → 4 points
// TOTAL: 58 points (0-100 scale)

POST /api/leaderboard/update-score
{
  "quizPercentage": 85,
  "messagesThisWeek": 15,
  "currentStreak": 10,
  "achievements": ["first_quiz", "speed_racer"]
}

Response:
{
  "quizScore": 34,
  "chatActivityScore": 15,
  "streakBonus": 5,
  "achievementBonus": 4,
  "totalScore": 58,
  "period": "2026-W02"
}
```

#### Test 2: Leaderboard Display ✓
```tsx
<LeaderboardWithAutoUpdate 
  userId="user-123"
  refreshInterval={30000}
  limit={10}
/>

Expected:
- Top 10 ranked users visible
- Current user highlighted
- Score breakdown shown
- Real-time updates work
```

#### Test 3: Rank Change Tracking ✓
```
Scenario: User improves from #5 to #2
Expected:
- rankChange = +3
- Trending up indicator (↑)
- Email notification sent
```

#### Test 4: Top 3 Detection ✓
```
Scenario: User reaches rank #1
Expected:
- isTopThree = true
- Medal emoji displayed (🥇)
- Celebration email sent
- Arka reaction triggered
```

---

## 📧 Phase 5: Email Notifications Testing

### Feature: Event-Based Email Alerts

**Files to Test:**
- `src/services/emailNotificationService.ts` - Email service
- `src/hooks/useNotificationTriggers.ts` - Notification hooks
- `src/app/api/notifications/send/route.ts` - API endpoint

### Test Cases:

#### Test 1: Quiz Completion Email ✓
```bash
POST /api/notifications/send
{
  "notification": {
    "type": "quiz_completion",
    "recipient": {
      "userId": "user-123",
      "email": "test@example.com",
      "userName": "TestUser"
    },
    "quizTitle": "Advanced Algorithms",
    "score": 85,
    "percentage": 85,
    "passed": true
  }
}

Expected:
- Email sent successfully
- HTML template rendered
- Score displayed correctly
- Pass/fail status shown
```

#### Test 2: Top 3 Entry Email ✓
```bash
POST /api/notifications/send
{
  "notification": {
    "type": "top_three_entry",
    "recipient": { ... },
    "rank": 1,
    "score": 92,
    "previousRank": 5
  }
}

Expected:
- Medal emoji: 🥇 for rank 1
- Rank improvement highlighted
- Celebration message included
```

#### Test 3: Rank Change Email ✓
```bash
POST /api/notifications/send
{
  "notification": {
    "type": "rank_change",
    "recipient": { ... },
    "newRank": 3,
    "previousRank": 8,
    "rankChange": 5,
    "totalScore": 78
  }
}

Expected:
- Trending indicator (↑ or ↓)
- Position change highlighted
- 5 position improvement shown
```

#### Test 4: Weekly Summary Email ✓
```bash
POST /api/notifications/send
{
  "notification": {
    "type": "weekly_summary",
    "recipient": { ... },
    "weekPeriod": "2026-W02",
    "currentRank": 5,
    "totalScore": 85,
    "weeklyImprovement": 12,
    "topGainers": [
      { "userName": "Champion", "rankChange": 5 }
    ]
  }
}

Expected:
- Week period displayed
- Current ranking shown
- Weekly stats included
- Top gainers listed
```

#### Test 5: Achievement Email ✓
```bash
POST /api/notifications/send
{
  "notification": {
    "type": "achievement_unlock",
    "recipient": { ... },
    "achievementName": "Perfect Score",
    "achievementDescription": "Score 100% on any quiz",
    "earnedPoints": 2
  }
}

Expected:
- Trophy emoji: 🏆
- Achievement name highlighted
- Description included
- Points earned shown
```

---

## 🔗 Integration Testing

### Scenario 1: Full Quiz → Leaderboard → Email Flow

```
1. User completes quiz
   ↓
2. Quiz score: 92%
   ↓
3. Leaderboard updates
   - Quiz points: +36 (92% × 40)
   - Total score: 78 points
   - New rank: #3 (was #5)
   ↓
4. Rank improved by 2 positions
   ↓
5. Email triggered: Rank Change Alert
   ↓
6. User notified of improvement
```

### Scenario 2: Achievement → Score → Top 3 Flow

```
1. Achievement unlocked
   ↓
2. Points increased: +2
   ↓
3. Total score now: 91 points
   ↓
4. New rank: #2 (was #4)
   ↓
5. Entered top 3!
   ↓
6. Email triggered: Top 3 Celebration
   ↓
7. Medal displayed on leaderboard
```

---

## 🧪 API Testing Commands

### Test Leaderboard Update
```bash
curl -X POST http://localhost:3000/api/leaderboard/update-score \
  -H "Content-Type: application/json" \
  -H "x-user-id: user-123" \
  -d '{
    "quizPercentage": 85,
    "messagesThisWeek": 15,
    "currentStreak": 10,
    "achievements": ["first_quiz"]
  }'
```

### Test Email Notification
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "notification": {
      "type": "quiz_completion",
      "recipient": {
        "userId": "user-123",
        "email": "test@example.com",
        "userName": "TestUser"
      },
      "quizTitle": "Advanced Algorithms",
      "score": 85,
      "percentage": 85,
      "passed": true
    }
  }'
```

---

## 📈 Performance Testing

### Load Testing Script
```bash
# Test with 10 concurrent users
ab -n 100 -c 10 http://localhost:3000/api/leaderboard/update-score

Expected Results:
- Response time: <500ms
- Success rate: 100%
- Errors: 0
```

### Database Query Performance
```bash
Leaderboard query: <100ms
Email send: <2 seconds
Chat history fetch: <200ms
```

---

## ✅ Testing Checklist

### Phase 4: Leaderboard
- [ ] Score calculation formula correct (0-100 total)
- [ ] Leaderboard displays top 10 users
- [ ] Current user highlighted
- [ ] Rank change arrows display correctly
- [ ] Top 3 badge shows for ranks 1-3
- [ ] Real-time refresh works (30s intervals)
- [ ] Mobile responsive display works

### Phase 5: Notifications
- [ ] Quiz completion email sends (score ≥70%)
- [ ] Top 3 email sends only on first entry
- [ ] Rank change email sends (5+ position change)
- [ ] Weekly summary email formats correctly
- [ ] Achievement email displays properly
- [ ] All emails have correct branding
- [ ] Email templates render in all clients

### Integration
- [ ] Quiz → Leaderboard → Email flow works
- [ ] Multiple events don't conflict
- [ ] Arka reactions trigger at right time
- [ ] Error handling graceful
- [ ] Logging captures events

---

## 🐛 Debugging Tips

### Enable Debug Logging
```typescript
// In .env.local
DEBUG=true
LOG_LEVEL=debug
```

### Check Email in Development
```typescript
// Email previews available at:
// Resend: https://resend.com/emails
// SendGrid: SendGrid Dashboard
```

### Test Database Locally
```bash
# Verify Cosmos DB connection
npm run test:cosmos
```

### Browser Console Errors
```javascript
// Check for API errors
console.log('Leaderboard updates:', window.__debug_updates);
```

---

## 📝 Test Report Template

```
Date: January 10, 2026
Tester: [Name]
Environment: Development/Staging

PHASE 4: LEADERBOARD
- Score calculation: [ ] PASS [ ] FAIL
- Display UI: [ ] PASS [ ] FAIL
- Real-time updates: [ ] PASS [ ] FAIL
- Mobile responsive: [ ] PASS [ ] FAIL

PHASE 5: NOTIFICATIONS
- Quiz email: [ ] PASS [ ] FAIL
- Top 3 email: [ ] PASS [ ] FAIL
- Rank change email: [ ] PASS [ ] FAIL
- Weekly summary: [ ] PASS [ ] FAIL
- Achievement email: [ ] PASS [ ] FAIL

INTEGRATION
- Full flow: [ ] PASS [ ] FAIL
- Error handling: [ ] PASS [ ] FAIL
- Performance: [ ] PASS [ ] FAIL

Issues Found:
[List any bugs or issues]

Recommendations:
[Any improvements needed]
```

---

## 🚀 Next Steps

After testing passes:
1. ✅ Fix any bugs found
2. ✅ Optimize performance
3. ✅ Deploy to staging
4. ✅ Run production readiness checks
5. ✅ Deploy to production

---

**Status**: Ready to test  
**Build**: ✅ Passing  
**Files**: ✅ All present  
**Start**: `npm run dev`
