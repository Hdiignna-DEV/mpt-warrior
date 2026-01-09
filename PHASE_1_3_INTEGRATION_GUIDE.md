# 🚀 Phase 1.3 Implementation Guide - Integration Hooks

## Overview
This guide explains how to integrate the ranking system into existing services:
1. **Quiz Completion** → Points sync
2. **Journal Entry** → Consistency points
3. **Comments** → Community points

## Files Created
- ✅ `scripts/migrate-leaderboard-schema.ts` - Database migration
- ✅ `src/app/api/leaderboard/user/[userId]/route.ts` - Get user ranking
- ✅ `src/app/api/leaderboard/top-three/route.ts` - Top 3 widget
- ✅ `src/app/api/leaderboard/recalculate/route.ts` - Manual recalculation
- ✅ `src/app/api/leaderboard/sync-points/route.ts` - Point syncing
- ✅ `src/lib/integrations/leaderboard-hooks.ts` - Integration hooks

## Integration Points

### 1. Quiz Completion Hook

**Location**: `src/lib/db/education-service.ts` - After quiz is graded

**Current Code** (around line 427):
```typescript
export async function submitQuizAnswer(
  userId: string,
  moduleId: string,
  questionId: string,
  answer: string
): Promise<UserQuizAnswer> {
  // ... existing code ...
  await container.items.upsert(userAnswer);
  return userAnswer;
}
```

**Add This Integration**:
```typescript
import { onQuizCompleted } from '@/lib/integrations/leaderboard-hooks';

// After quiz is graded (when score is set)
if (score !== null) {
  // Non-blocking: Call leaderboard integration
  onQuizCompleted(
    userId,
    moduleId,
    score,
    userAnswer.id,
    token // pass from request context
  ).catch(err => console.error('Leaderboard sync error:', err));
}
```

**Expected Output**:
- Quiz score 85% → 34 points (85/100 * 40)
- Quiz score 100% → 40 points max
- Points added to user's `pointsBreakdown.quizPoints`

---

### 2. Journal Entry Hook

**Location**: `src/app/api/trades` or `src/components/TradeJournal.tsx`

**Current Code** (around line 232 in TradeJournal):
```typescript
const response = await fetch('/api/trades', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(body),
});
```

**Add This Integration** (After successful save):
```typescript
import { onJournalEntrySaved } from '@/lib/integrations/leaderboard-hooks';

// After trade is saved successfully
if (response.ok) {
  const tradeData = await response.json();
  
  // Sync journal points (non-blocking)
  onJournalEntrySaved(
    userId,
    tradeData.id,
    new Date().toISOString(),
    token
  ).catch(err => console.error('Leaderboard sync error:', err));
  
  // Reload trades...
  await loadTrades();
}
```

**Expected Output**:
- 1 journal entry today → 5 points (1st entry of day)
- Multiple entries same day → Still 5 points (only count once per day)
- Points added to `pointsBreakdown.consistencyPoints` (max 35/week)

---

### 3. Comment Posting Hook

**Location**: `src/app/api/chat` or discussion comment endpoint

**Current Code Structure**:
```typescript
// When comment is saved to database
const comment = {
  id: commentId,
  userId,
  content: commentText,
  timestamp: new Date().toISOString(),
};

await commentsContainer.items.create(comment);
```

**Add This Integration** (After comment saved):
```typescript
import { onCommentPosted } from '@/lib/integrations/leaderboard-hooks';

// After comment is created
await commentsContainer.items.create(comment);

// Sync community points (non-blocking)
onCommentPosted(
  userId,
  comment.id,
  commentText,
  token
).catch(err => console.error('Leaderboard sync error:', err));
```

**Expected Output**:
- Comment posted (10+ chars) → 2 points
- Comment too short (<10 chars) → 0 points (spam filter)
- Max 10 comments/week → Max 20 points
- Points added to `pointsBreakdown.communityPoints` (max 20/week)

---

## Verification Checklist

### Step 1: Run Migration Script
```bash
# Migrate database schema
npm run migrate-leaderboard

# Output should show:
# ✅ Updated N users
# ✅ Created leaderboard_snapshots collection
# ✅ Created point_logs collection
# ✅ Created rank_history collection
```

### Step 2: Test Each Hook

**Test Quiz Hook**:
1. Complete a quiz with score 80%
2. Check user profile → Should show +32 points
3. Check leaderboard → User should be ranked

**Test Journal Hook**:
1. Add a new trade/journal entry
2. Check leaderboard → Should show consistency points
3. Add another entry same day → Should still be 5 points (not 10)

**Test Comment Hook**:
1. Post a comment (10+ chars)
2. Check ranking → Should show +2 points
3. Post comment <10 chars → No points

### Step 3: Verify Point Calculations

```typescript
// Total points formula:
totalPoints = quizPoints + consistencyPoints + communityPoints

// Example:
// Quiz: 32 points (80% of 40)
// Journal: 15 points (3 days × 5)
// Comments: 10 points (5 comments × 2)
// Total: 57 points

// Should show in /api/leaderboard/user/[userId]
{
  totalPoints: 57,
  pointsBreakdown: {
    quizPoints: 32,
    consistencyPoints: 15,
    communityPoints: 10
  },
  tier: "RECRUIT" // 0-500 points
}
```

### Step 4: Check Cron Job

The cron job at `/api/leaderboard/cron-update` should:
- Run daily (configure in `vercel.json`)
- Update all user rankings
- Create daily snapshots
- Clear caches

**Configure in `vercel.json`**:
```json
{
  "crons": [{
    "path": "/api/leaderboard/cron-update",
    "schedule": "0 2 * * *"
  }]
}
```

---

## Integration Implementation Order

1. **Phase 1.3a** - Add hook to education-service (quiz)
2. **Phase 1.3b** - Add hook to TradeJournal component (journal)
3. **Phase 1.3c** - Add hook to chat/comment API (community)
4. **Phase 1.4** - Test cron job
5. **Phase 1.5** - Unit tests

---

## Non-Blocking Error Handling

All hooks use `.catch()` to prevent blocking:

```typescript
// If leaderboard sync fails, user won't be affected
onQuizCompleted(...).catch(err => {
  console.error('Leaderboard sync failed:', err);
  // Quiz still completes successfully
  // Points will sync on next cron run
});
```

---

## Troubleshooting

### Issue: Points not appearing after quiz
**Solution**:
1. Check browser console for errors
2. Verify token is being passed
3. Check `/api/leaderboard/user/{userId}` endpoint
4. Run cron manually: `POST /api/leaderboard/cron-update`

### Issue: Duplicate points
**Solution**:
- Each hook checks sourceId to prevent duplicates
- Cosmos DB upsert handles idempotency
- Safe to retry without side effects

### Issue: Cache not updating
**Solution**:
- Each hook invalidates relevant caches
- Worst case: caches expire in 5-60 mins
- Admin can manually clear: `POST /api/leaderboard/recalculate`

---

## Next Steps

1. ✅ Phase 1.3: **Integrate hooks** ← YOU ARE HERE
2. 🔄 Phase 1.4: Run migration script
3. 📝 Phase 1.5: Unit tests
4. 🎨 Phase 2: Frontend components
5. 🚀 Phase 6: Production deployment
