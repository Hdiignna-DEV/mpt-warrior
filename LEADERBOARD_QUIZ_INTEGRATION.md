# 🎓 Quiz to Leaderboard Integration Guide

## Overview

Ketika admin (Mas Deden) memvalidasi jawaban quiz seorang user, sistem harus:

1. **Hitung poin** berdasarkan score quiz
2. **Update poin user** di leaderboard
3. **Recalculate ranking** jika ada perubahan
4. **Trigger Arka** jika user masuk milestone
5. **Notify user** tentang perubahan rank

---

## Integration Points

### 1. Quiz Validation Flow

```
Admin validates quiz answer
    ↓
[Quiz Service] Calculate score
    ↓
POST /api/leaderboard/sync-points
    {
      userId: string,
      action: "QUIZ_COMPLETED",
      actionId: quizId,
      pointsAdjustment: scorePoints,
      reason: "Quiz validation"
    }
    ↓
[Leaderboard Service] Update user points
    ↓
Recalculate user rank
    ↓
Check for Top 10/5/3/1
    ↓
Return result with arkaTrigger info
    ↓
Frontend: Show Arka if triggered
```

### 2. Points Calculation Strategy

```typescript
// Points from Quiz (0-40 points max per quiz)
const quizPoints = Math.round((correctAnswers / totalQuestions) * 40);

// Example:
// Score 100% = 40 pts
// Score 80%  = 32 pts
// Score 60%  = 24 pts
// Score 40%  = 16 pts
```

---

## Code Integration

### Step 1: Quiz Service Updates

**Location**: `src/lib/db/education-service.ts` (or quiz service)

When quiz is approved by admin:

```typescript
export async function approveQuizAnswer(
  quizId: string,
  userId: string,
  score: number,
  totalQuestions: number
) {
  // 1. Update quiz record
  const correctAnswers = Math.ceil((score / 100) * totalQuestions);
  const quizPoints = Math.round((correctAnswers / totalQuestions) * 40);
  
  // Update quiz in database
  await quizContainer.item(quizId, quizId).patch({
    operations: [
      { op: 'set', path: '/status', value: 'APPROVED' },
      { op: 'set', path: '/approvedAt', value: new Date() },
      { op: 'set', path: '/approvedBy', value: adminId },
      { op: 'set', path: '/score', value: score },
    ]
  });

  // 2. Sync points to leaderboard
  const syncResponse = await syncPointsToLeaderboard(
    userId,
    'QUIZ_COMPLETED',
    quizId,
    quizPoints
  );

  // 3. Return response with Arka trigger info
  return {
    success: true,
    quizId,
    points: quizPoints,
    newRank: syncResponse.result.newRank,
    arkaTrigger: syncResponse.arkaTrigger,
  };
}

// Helper function
async function syncPointsToLeaderboard(
  userId: string,
  action: string,
  actionId: string,
  points: number
) {
  const response = await fetch('/api/leaderboard/sync-points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      action,
      actionId,
      pointsAdjustment: points,
      reason: `${action} - ${actionId}`
    })
  });

  return await response.json();
}
```

### Step 2: Admin Dashboard Updates

**Location**: Admin HQ page where quiz answers are validated

```tsx
// src/app/admin-hq/[section]/QuizValidation.tsx

import { toast } from '@/utils/toast';

export function QuizValidationCard({ quiz }) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApproveQuiz = async () => {
    setIsApproving(true);
    try {
      // 1. Calculate score
      const score = calculateQuizScore(quiz);
      const totalQuestions = quiz.questions.length;

      // 2. Call approval endpoint
      const response = await fetch(`/api/admin/quizzes/${quiz.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: quiz.userId,
          score,
          totalQuestions,
          approved: true,
          notes: 'Quiz validated'
        })
      });

      if (!response.ok) throw new Error('Failed to approve');

      const result = await response.json();

      // 3. Show toast notification
      toast.success(
        'Quiz Approved! ✅',
        `${quiz.userName} gained ${result.points} points!`
      );

      // 4. Show Arka trigger if applicable
      if (result.arkaTrigger?.triggered) {
        showArkaNotification(result.arkaTrigger.message);
      }

      // 5. Refresh list
      onQuizApproved(quiz.id);

    } catch (error) {
      toast.error('Error approving quiz', error.message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card>
      {/* Quiz details */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm text-gray-600">Student: {quiz.userName}</p>
          <p className="text-sm text-gray-600">Quiz: {quiz.quizTitle}</p>
          <p className="text-sm text-gray-600">Score: {calculateQuizScore(quiz)}%</p>
        </div>

        {/* Action button */}
        <Button
          onClick={handleApproveQuiz}
          disabled={isApproving}
          variant="success"
        >
          {isApproving ? 'Approving...' : 'Approve & Update Leaderboard'}
        </Button>
      </div>
    </Card>
  );
}
```

### Step 3: Frontend Leaderboard Sync

**Location**: User's quiz page or dashboard

```tsx
// src/app/academy/[module]/quiz/page.tsx

import { useLeaderboardRankTrigger } from '@/hooks/useLeaderboardRankTrigger';
import { LeaderboardArkaTrigger } from '@/components/LeaderboardArkaTrigger';

export function QuizPage() {
  const { rankData, trigger, refreshRank } = useLeaderboardRankTrigger();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // When admin validates quiz, backend triggers sync
  // Frontend polls every 30 seconds via hook
  
  useEffect(() => {
    // After quiz submission, wait for admin validation
    // Hook will detect rank change and trigger Arka
    const pollInterval = setInterval(() => {
      refreshRank();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div>
      {/* Quiz content */}
      {quizCompleted && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <p>Quiz submitted! Waiting for admin validation...</p>
          <p className="text-sm text-gray-600">
            Your current rank: #{rankData.rank} ({rankData.points} pts)
          </p>
        </div>
      )}

      {/* Arka trigger notification */}
      {trigger && (
        <LeaderboardArkaTrigger
          message={trigger.message}
          pose={trigger.arkaPose}
          isVisible={trigger.showArka}
        />
      )}
    </div>
  );
}
```

---

## API Endpoint Details

### POST /api/leaderboard/sync-points

**Request Body**:
```json
{
  "userId": "user-123",
  "action": "QUIZ_COMPLETED",
  "actionId": "quiz-456",
  "pointsAdjustment": 35,
  "reason": "Quiz answer approved by admin"
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "userId": "user-123",
    "previousRank": 150,
    "newRank": 142,
    "pointsChange": 35,
    "totalPointsChange": 85,
    "previousTotal": 815,
    "newTotal": 850,
    "previousTier": "Recruit",
    "newTier": "Elite Warrior",
    "tierChanged": true,
    "badgesEarned": [],
    "badgesLost": [],
    "achievedTopTen": false,
    "timestamp": "2026-01-09T10:30:00Z"
  },
  "arkaTrigger": {
    "triggered": false
  }
}
```

**Success Case - User enters Top 10**:
```json
{
  "success": true,
  "result": {
    "previousRank": 15,
    "newRank": 8,
    "achievedTopTen": true,
    // ... other fields
  },
  "arkaTrigger": {
    "triggered": true,
    "message": "👍 Luar biasa! Anda masuk Top 10! Posisi #8!",
    "showArka": true
  }
}
```

---

## Testing Integration

### Test Quiz Approval Flow

```bash
# 1. Get user ID
USER_ID="user-123"

# 2. Simulate quiz completion
curl -X POST http://localhost:3000/api/leaderboard/sync-points \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "'$USER_ID'",
    "action": "QUIZ_COMPLETED",
    "actionId": "quiz-001",
    "pointsAdjustment": 35,
    "reason": "Test quiz"
  }'

# 3. Check user rank
curl http://localhost:3000/api/leaderboard/user/$USER_ID \
  -H "Authorization: Bearer $TOKEN"

# 4. Check leaderboard update
curl http://localhost:3000/api/leaderboard?limit=100 \
  -H "Authorization: Bearer $TOKEN" | jq '.leaderboard[] | select(.userId == "'$USER_ID'")'
```

### Automated Test

```typescript
// test/leaderboard-quiz-integration.test.ts

describe('Quiz to Leaderboard Integration', () => {
  it('should update user rank when quiz approved', async () => {
    const userId = 'test-user-001';
    const initialRank = 100;

    // 1. Check initial rank
    const initialResponse = await fetch(`/api/leaderboard/user/${userId}`);
    const initial = await initialResponse.json();
    expect(initial.ranking.currentRank).toBe(initialRank);

    // 2. Simulate quiz completion
    const syncResponse = await fetch('/api/leaderboard/sync-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        action: 'QUIZ_COMPLETED',
        actionId: 'test-quiz',
        pointsAdjustment: 50
      })
    });
    const result = await syncResponse.json();

    // 3. Verify rank improved
    expect(result.result.newRank).toBeLessThan(initialRank);
    expect(result.result.pointsChange).toBe(50);

    // 4. Verify database updated
    const updatedResponse = await fetch(`/api/leaderboard/user/${userId}`);
    const updated = await updatedResponse.json();
    expect(updated.user.totalPoints).toBe(
      initial.user.totalPoints + 50
    );
  });

  it('should trigger Arka when entering Top 10', async () => {
    const userId = 'test-user-top10';
    
    // Set user rank to 15, add enough points to reach top 10
    const response = await fetch('/api/leaderboard/sync-points', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        action: 'QUIZ_COMPLETED',
        actionId: 'test-quiz',
        pointsAdjustment: 200
      })
    });

    const result = await response.json();
    expect(result.arkaTrigger.triggered).toBe(true);
    expect(result.arkaTrigger.message).toContain('Top 10');
  });
});
```

---

## Troubleshooting

### Points Not Updating
1. Check quiz approval endpoint called correctly
2. Verify sync-points request has correct userId
3. Check database for concurrent writes
4. Verify cache cleared after update

### Wrong Points Calculation
1. Verify quiz score calculation logic
2. Check point weighting formula
3. Ensure no double-counting
4. Validate with admin

### Arka Not Showing
1. Check rankTrigger hook properly mounted
2. Verify user actually entered Top 10
3. Check component rendering
4. Verify z-index not hidden

### Rank Out of Sync
1. Check for database inconsistencies
2. Run recalculation: POST `/api/leaderboard/recalculate`
3. Clear Redis cache
4. Verify all quiz records have correct points

---

## Performance Considerations

1. **Batch Updates**: If validating multiple quizzes, batch the sync-points calls
2. **Cache Invalidation**: Only invalidate affected cache keys
3. **Database Indexes**: Ensure indexes on `totalPoints` and `currentRank`
4. **Async Processing**: Use background jobs for ranking recalculation

---

## Related Files

- Quiz Service: `src/lib/db/education-service.ts`
- Leaderboard Service: `src/lib/db/leaderboard-service.ts`
- Admin Quiz Module: `src/app/admin-hq/[section]/`
- Integration Tests: `__tests__/leaderboard-integration.test.ts`

---

*Last Updated: 9 Jan 2026*
