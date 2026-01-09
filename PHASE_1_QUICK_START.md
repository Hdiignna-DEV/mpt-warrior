# 🚀 PHASE 1 QUICK START - Next Steps

**Status**: Backend ✅ Complete | Ready for Integration

---

## 📋 IMMEDIATE NEXT STEPS (Today)

### Step 1: Run Database Migration
```bash
npm run migrate-leaderboard
```

**Expected Output**:
```
🚀 Starting Warrior Ranking System Database Migration...

📝 Step 1: Updating users collection schema...
   Found 12 users to update
   ✅ Updated 12 users

📝 Step 2: Creating leaderboard_snapshots collection...
   ✅ Created leaderboard_snapshots collection

📝 Step 3: Creating point_logs collection...
   ✅ Created point_logs collection

📝 Step 4: Creating rank_history collection...
   ✅ Created rank_history collection

✅ ===== MIGRATION COMPLETE =====
```

---

### Step 2: Integrate Three Hooks (30 mins each)

#### Hook A: Quiz Completion
**File**: `src/lib/db/education-service.ts`  
**Find**: `submitQuizAnswer` function (line ~427)  
**Add After** (when score is set):

```typescript
import { onQuizCompleted } from '@/lib/integrations/leaderboard-hooks';

// After quiz is graded
if (score !== null) {
  onQuizCompleted(userId, moduleId, score, userAnswer.id, token)
    .catch(err => console.error('Sync error:', err));
}
```

**What It Does**:
- Quiz: 85% → 34 points (85/100 × 40)
- Quiz: 100% → 40 points (max)
- Automatically syncs to user's ranking

---

#### Hook B: Journal Entry
**File**: `src/components/TradeJournal.tsx`  
**Find**: `handleTradeResponse` function (line ~232)  
**Add After** (trade saved):

```typescript
import { onJournalEntrySaved } from '@/lib/integrations/leaderboard-hooks';

// After trade is saved successfully
if (response.ok) {
  const tradeData = await response.json();
  
  // Sync journal points
  onJournalEntrySaved(
    userId,
    tradeData.id,
    new Date().toISOString(),
    token
  ).catch(err => console.error('Sync error:', err));
  
  // Continue with existing code...
  await loadTrades();
}
```

**What It Does**:
- 1 journal entry/day → 5 points
- Multiple entries same day → Still 5 pts (only count once)
- Tracks `journalEntries.consecutiveDays` for badges

---

#### Hook C: Comment Posting
**File**: `src/app/api/chat/route.ts` or discussion API  
**Find**: Comment creation logic  
**Add After** (comment saved):

```typescript
import { onCommentPosted } from '@/lib/integrations/leaderboard-hooks';

// After comment is created
await commentsContainer.items.create(comment);

// Sync community points
onCommentPosted(userId, comment.id, commentText, token)
  .catch(err => console.error('Sync error:', err));
```

**What It Does**:
- Comment (10+ chars) → 2 points
- Comment (<10 chars) → 0 points (spam filter)
- Max 10 comments/week → Max 20 points

---

### Step 3: Verify Hook Integration

**Test Quiz Hook**:
1. Complete a quiz with 80% score
2. Check: `GET /api/leaderboard/user/{userId}`
3. Should see: `pointsBreakdown.quizPoints: 32`

**Test Journal Hook**:
1. Add trade entry
2. Check: `GET /api/leaderboard/user/{userId}`
3. Should see: `pointsBreakdown.consistencyPoints: 5`

**Test Comment Hook**:
1. Post comment (10+ chars)
2. Check: `GET /api/leaderboard/user/{userId}`
3. Should see: `pointsBreakdown.communityPoints: 2`

---

### Step 4: Test Cron Job

**Manual Trigger**:
```bash
curl -X POST http://localhost:3000/api/leaderboard/cron-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Daily leaderboard update complete",
  "date": "2026-01-09",
  "usersUpdated": 12,
  "topThree": [
    { "rank": 1, "userId": "user1", "displayName": "Deden" },
    { "rank": 2, "userId": "user2", "displayName": "John" },
    { "rank": 3, "userId": "user3", "displayName": "Sarah" }
  ]
}
```

---

### Step 5: Configure Vercel Cron

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/leaderboard/cron-update",
      "schedule": "0 2 * * *"
    }
  ]
}
```

This runs the cron job every day at 2 AM UTC.

---

## 🧪 Testing Checklist

### Database
- [ ] Migration ran successfully
- [ ] Collections created: `leaderboard_snapshots`, `point_logs`, `rank_history`
- [ ] Indexes created on `totalPoints`, `currentRank`
- [ ] 12 fields added to users

### APIs
- [ ] `GET /api/leaderboard` → Top 100 users
- [ ] `GET /api/leaderboard/top-three` → Top 3 with medals
- [ ] `GET /api/leaderboard/user/{userId}` → User details
- [ ] `POST /api/leaderboard/sync-points` → Points synced
- [ ] `POST /api/leaderboard/recalculate` → Manual update
- [ ] `POST /api/leaderboard/cron-update` → Daily update

### Hooks
- [ ] Quiz completion → Points awarded
- [ ] Journal entry → Consistency points
- [ ] Comment posted → Community points
- [ ] Cache invalidated after each
- [ ] No errors in console

### Calculations
- [ ] Points capped at limits (40 quiz, 35 journal, 20 comments)
- [ ] Tiers assigned correctly (RECRUIT/ELITE/COMMANDER/LEGENDARY)
- [ ] Ranks updated daily
- [ ] Snapshots created

---

## 📊 Expected Results (Sample Data)

After integration, viewing `/api/leaderboard/user/deden`:

```json
{
  "success": true,
  "user": {
    "userId": "deden",
    "displayName": "Deden",
    "totalPoints": 85,
    "weeklyPoints": 42,
    "currentRank": 1,
    "tier": "ELITE_WARRIOR",
    "badges": ["Consistency King"],
    "pointsBreakdown": {
      "quizPoints": 32,
      "consistencyPoints": 5,
      "communityPoints": 5
    },
    "stats": {
      "journalEntries": {
        "entriesThisWeek": 1,
        "consecutiveDays": 3
      },
      "commentStats": {
        "thisWeek": 2,
        "allTime": 12
      },
      "quizStats": {
        "modulesCompleted": 4,
        "averageScore": 85
      }
    }
  }
}
```

---

## 🔧 Troubleshooting

### Problem: Migration fails
**Solution**:
1. Check Cosmos DB connection: `echo $AZURE_COSMOS_ENDPOINT`
2. Verify user has SUPER_ADMIN role
3. Check database exists: `mpt-warrior`

### Problem: Hook not syncing points
**Solution**:
1. Check token is valid: `echo $TOKEN`
2. Verify user exists in database
3. Check `/api/leaderboard/sync-points` returns success
4. Look at browser console for errors

### Problem: Cron job not running
**Solution**:
1. Check `vercel.json` has cron config
2. Verify CRON_SECRET environment variable
3. Deploy to Vercel: `git push`
4. Check Vercel logs: `vercel logs`

### Problem: Cache not updating
**Solution**:
1. Manually clear: `POST /api/leaderboard/recalculate`
2. Wait 5-60 mins for auto-expire
3. Check Redis connection

---

## 📚 Documentation Files

**Read These**:
1. ✅ `PHASE_1_COMPLETION_REPORT.md` - What was built
2. ✅ `PHASE_1_3_INTEGRATION_GUIDE.md` - How to integrate
3. ✅ `LEADERBOARD_WARRIOR_SPEC.md` - Full specification
4. ✅ `WARRIOR_RANKING_QUICK_REFERENCE.md` - Formula & tiers

---

## ⏱️ Time Estimates

| Task | Time | Status |
|------|------|--------|
| Run migration | 5 mins | Ready |
| Quiz hook | 20 mins | Ready |
| Journal hook | 20 mins | Ready |
| Comment hook | 20 mins | Ready |
| Testing | 30 mins | Ready |
| Cron config | 10 mins | Ready |
| **TOTAL** | **~2 hours** | Ready |

---

## 🎯 Success Criteria

✅ All points syncing correctly  
✅ Ranks updating daily  
✅ Caches invalidating  
✅ No errors in console  
✅ Sample user has correct tier  
✅ Top 3 showing in widget  

---

## 🚀 Next Phase After This

Once Phase 1 is complete & verified:

**Phase 2: Frontend Components**
- Leaderboard page (`src/app/leaderboard/page.tsx`)
- Dashboard widget (`src/components/LeaderboardWidget.tsx`)
- User profile card (`src/components/RankingCard.tsx`)

---

**Ready to start? Run this:**
```bash
npm run migrate-leaderboard
```

**Questions?** Check `PHASE_1_3_INTEGRATION_GUIDE.md`
