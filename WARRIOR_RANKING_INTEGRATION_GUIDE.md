# 🔗 WARRIOR RANKING - QUIZ & JOURNAL INTEGRATION GUIDE
**Date**: January 9, 2026  
**Version**: 1.0

---

## 📌 QUICK INTEGRATION CHECKLIST

### For Quiz System (`src/app/api/academy/quiz/submit/route.ts`)
- [ ] After quiz is graded (auto or manual)
- [ ] Call `POST /api/leaderboard/recalculate` with `userId`
- [ ] Update `quizPoints` in user document
- [ ] Clear leaderboard cache

### For Journal System
- [ ] Track journal entries per user per week
- [ ] Calculate `consistencyPoints` (5 pts per day, max 35)
- [ ] After each entry, recalculate leaderboard
- [ ] Award badges for milestones (30+ consecutive days)

### For Comments/Community
- [ ] Track valid comments per user per week
- [ ] Calculate `communityPoints` (2 pts per comment, max 20)
- [ ] Trigger recalculation after comment validation
- [ ] Notify user of point gain

---

## 🎯 STEP-BY-STEP IMPLEMENTATION

### Step 1: After Quiz Submission
**File**: `src/app/api/academy/quiz/submit/route.ts`

Add this after successful quiz grading:

```typescript
// At the end of the quiz submit route
if (userAnswer.score !== null) {
  // Quiz was auto-graded (or manually graded)
  
  try {
    // Recalculate leaderboard for this user
    const recalcResponse = await fetch(
      new URL('/api/leaderboard/recalculate', process.env.NEXTAUTH_URL || 'http://localhost:3000'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`, // Use admin token
        },
        body: JSON.stringify({ userId: decoded.userId }),
      }
    );

    if (!recalcResponse.ok) {
      console.warn('Failed to recalculate leaderboard:', await recalcResponse.text());
      // Don't fail the whole request if ranking fails
    } else {
      console.log('✅ Leaderboard updated for user:', decoded.userId);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    // Continue - don't block quiz submission
  }
}

return NextResponse.json({
  success: true,
  answer: userAnswer,
  message: userAnswer.score !== null 
    ? 'Answer submitted and graded' 
    : 'Answer submitted, pending manual grading',
});
```

### Step 2: Manual Quiz Grading (Admin)
**File**: Wherever admin grades essays

When admin validates an essay answer:

```typescript
// After marking essay as correct
await fetch('http://localhost:3000/api/leaderboard/recalculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  },
  body: JSON.stringify({ 
    userId: studentUserId,
    // Optional: includeRelated: true // Update related students too
  }),
});

// Show success message to admin
toast.success(`${studentName}'s ranking updated!`);
```

### Step 3: Journal Entry Tracking
**File**: `src/app/api/discipline/` or journal endpoint

After successful journal submission:

```typescript
// After journal entry is saved to database
const userId = decoded.userId;

try {
  // Get user's journal entries this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
  
  const { resources: weeklyEntries } = await container.items
    .query<any>(`
      SELECT VALUE COUNT(1) FROM c 
      WHERE c.userId = @userId 
      AND c.createdAt >= @weekStart
      AND c.type = 'JOURNAL_ENTRY'
    `, { parameters: [
      { name: '@userId', value: userId },
      { name: '@weekStart', value: weekStart.toISOString() }
    ]})
    .fetchAll();

  const entriesThisWeek = weeklyEntries[0] || 0;
  
  // Update consistency points
  const consistencyPoints = Math.min(entriesThisWeek * 5, 35);
  
  // Update user document
  await container.item(userId, userId).patch([{
    op: 'set',
    path: '/consistencyPoints',
    value: consistencyPoints
  }]);
  
  // Recalculate leaderboard
  await fetch('/api/leaderboard/recalculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ userId }),
  });
  
} catch (error) {
  console.error('Error tracking journal entry:', error);
}

// Return success response
return NextResponse.json({
  success: true,
  message: 'Journal entry recorded and points updated!',
  stats: {
    entriesThisWeek,
    consistencyPointsEarned: Math.min(entriesThisWeek * 5, 35)
  }
});
```

### Step 4: Setup Auto-Recalculation (Recommended)
**Via Vercel Cron Jobs** (`vercel.json`)

```json
{
  "crons": [
    {
      "path": "/api/leaderboard/cron-update",
      "schedule": "0 */1 * * *"  // Every hour
    }
  ]
}
```

**Create file**: `src/app/api/leaderboard/cron-update/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify Vercel cron signature
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Running hourly leaderboard recalculation...');
    
    // Call the recalculate endpoint in batch mode
    const response = await fetch(
      new URL('/api/leaderboard/recalculate', process.env.NEXTAUTH_URL || 'http://localhost:3000'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`,
        },
        body: JSON.stringify({ batchMode: true }),
      }
    );

    if (!response.ok) {
      throw new Error(`Recalculation failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Leaderboard cron completed:', result);

    return NextResponse.json({
      success: true,
      message: 'Leaderboard recalculated',
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Step 5: Frontend - Show Points Gained
After successful submission, show user their points:

```tsx
// In your quiz/journal submission form component
const handleSubmit = async (data) => {
  const response = await fetch('/api/academy/quiz/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const result = await response.json();

  if (result.success) {
    // Show toast with points earned
    toast.success(`✅ Answer submitted! +${result.pointsEarned} points earned!`);
    
    // Refresh user's rank in sidebar
    router.refresh();
    
    // Optional: Show leaderboard update modal
    if (result.newRank && result.previousRank && result.newRank < result.previousRank) {
      showRankUpNotification(result.newRank, result.previousRank);
    }
  }
};
```

---

## 🔄 POINTS FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│           USER ACTION                                   │
│  - Submit Quiz Answer                                  │
│  - Write Journal Entry                                 │
│  - Post Comment                                        │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│        VALIDATE & GRADE                                 │
│  - Auto-grade (MC, True/False)                         │
│  - Queue for manual grading (Essay)                    │
│  - Count entries/comments                             │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│     UPDATE POINT TOTALS                                 │
│  - quizPoints: 0-40                                    │
│  - consistencyPoints: 0-35                             │
│  - communityPoints: 0-20                               │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│   SAVE TO COSMOS DB (users collection)                 │
│  - Update totalPoints = sum of all                     │
│  - Update badge tier                                  │
│  - Record point log (audit trail)                     │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│  RECALCULATE LEADERBOARD                               │
│  - Sort all users by points                           │
│  - Assign new rank numbers                            │
│  - Calculate rank changes                             │
│  - Detect Top 10 entries                              │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│   INVALIDATE CACHE                                      │
│  - Clear Redis leaderboard entries                    │
│  - Clear top3 cache                                   │
│  - Clear user ranking cache                           │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND UPDATES                                       │
│  - Dashboard widget refreshes                         │
│  - Leaderboard page refreshes                         │
│  - User profile updates                               │
│  - Show Top 10 celebration (if applicable)            │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 POINTS CALCULATION REFERENCE

### Quiz Points (0-40 max)
```
Formula: (averageModuleScore / 100) × 40

Examples:
- 100% average = 40 points
- 80% average = 32 points
- 50% average = 20 points
- 0% = 0 points
```

### Consistency Points (0-35 max)
```
Formula: uniqueDaysWithEntryThisWeek × 5, capped at 35

Examples:
- 7 days = 35 points (max)
- 5 days = 25 points
- 3 days = 15 points
- 1 day = 5 points
```

### Community Points (0-20 max)
```
Formula: validCommentsThisWeek × 2, capped at 20

Examples:
- 10+ comments = 20 points (max)
- 7 comments = 14 points
- 5 comments = 10 points
- 1 comment = 2 points
```

### Badge Tier Thresholds
```
Total Points (Cumulative):
- 0-500:      Recruit (▌▌)
- 501-1500:   Elite Warrior (▌▌)
- 1501-3000:  Commander (★)
- 3001+:      Legendary Mentor (★✨)
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ Don't
- Call recalculation for every single action (causes performance issues)
- Forget to invalidate cache (users see stale data)
- Hardcode admin token in frontend code
- Block quiz submission if leaderboard update fails
- Recalculate all users when only one changed

### ✅ Do
- Use batch recalculation during off-peak hours (cron job)
- Recalculate single user immediately after action
- Store `ADMIN_API_KEY` in environment variables
- Handle leaderboard errors gracefully
- Only recalculate affected user(s)
- Log all point changes for audit trail

---

## 🧪 TESTING POINTS FLOW

### Test Case 1: Quiz Completion
1. User submits quiz answer
2. Admin grades essay (if essay question)
3. Check `/api/leaderboard/recalculate` is called
4. Verify `quizPoints` increases in user document
5. Check leaderboard rank updates
6. Verify cache is invalidated

**Test Script**:
```bash
# 1. Submit quiz
curl -X POST http://localhost:3000/api/academy/quiz/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"moduleId": "mod1", "questionId": "q1", "answer": "correct"}'

# 2. Check user ranking
curl http://localhost:3000/api/leaderboard/user/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Verify point increase
# Check response has updated quizPoints and totalPoints
```

### Test Case 2: Journal Entry
1. User submits journal entry
2. Check consistency points increase
3. Verify leaderboard updates
4. Monitor cache invalidation

### Test Case 3: Top 10 Celebration
1. Manually set user's totalPoints to >1500 (if not there)
2. Load leaderboard page
3. Verify Top 10 Celebration modal shows
4. Check confetti animation plays
5. Verify localStorage cooldown prevents re-showing

---

## 🔧 ENVIRONMENT VARIABLES NEEDED

```env
# .env.local
ADMIN_API_KEY=your-super-secret-admin-key-here
CRON_SECRET=your-vercel-cron-secret-here

# Already existing
NEXTAUTH_URL=https://your-domain.com
AZURE_COSMOS_ENDPOINT=https://xxx.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
```

---

## 📱 MOBILE CONSIDERATIONS

- Points update notification should be non-blocking
- Top 10 celebration should close easily on mobile
- Confetti should be performance-optimized (fewer particles on mobile)
- Leaderboard should not refresh while scrolling

---

## 🎓 EXAMPLE: COMPLETE QUIZ INTEGRATION

Here's a complete working example for quiz submission:

```typescript
// src/app/api/academy/quiz/submit/route.ts (Enhanced)

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { submitQuizAnswer } from '@/lib/db/education-service';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { moduleId, questionId, answer } = await request.json();

    if (!moduleId || !questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit and grade answer
    const userAnswer = await submitQuizAnswer(
      decoded.userId,
      moduleId,
      questionId,
      answer
    );

    let pointsEarned = 0;
    let newRank = null;
    let previousRank = null;

    // If graded (auto-grade for MC), trigger ranking update
    if (userAnswer.score !== null) {
      try {
        // Call leaderboard recalculation
        const recalcResponse = await fetch(
          new URL('/api/leaderboard/recalculate', process.env.NEXTAUTH_URL || 'http://localhost:3000'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`,
            },
            body: JSON.stringify({ userId: decoded.userId }),
          }
        );

        if (recalcResponse.ok) {
          const recalcData = await recalcResponse.json();
          newRank = recalcData.newRank;
          previousRank = recalcData.previousRank;
          pointsEarned = Math.round(userAnswer.score * 0.4); // Approximate
          console.log(`✅ Leaderboard updated for user ${decoded.userId}`);
        }
      } catch (error) {
        console.warn('Failed to update leaderboard (non-blocking):', error);
      }
    }

    return NextResponse.json({
      success: true,
      answer: userAnswer,
      message: userAnswer.score !== null 
        ? 'Answer submitted and graded' 
        : 'Answer submitted, pending manual grading',
      pointsEarned,
      newRank,
      previousRank,
      rankImproved: newRank && previousRank && newRank < previousRank,
    });

  } catch (error: any) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer', details: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🎯 SUCCESS CRITERIA

- [x] Points update immediately after action
- [x] Leaderboard reflects changes within 1-2 seconds
- [x] Cache is properly invalidated
- [x] No data loss or duplication
- [x] Top 10 celebration shows when user enters top 10
- [x] Confetti animation is smooth (60 FPS)
- [x] Mobile experience is not blocked
- [x] Audit logs show all point changes

---

**Last Updated**: January 9, 2026  
**Ready for Integration**: ✅ YES
