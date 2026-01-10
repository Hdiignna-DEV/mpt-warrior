# Phase 4 & 5 Quick Reference Guide

## 🚀 Quick Start

### Phase 4: Leaderboard Auto-Update
```typescript
import { useLeaderboardAutoUpdate } from '@/hooks/useLeaderboardAutoUpdate';

function MyComponent() {
  const { updateOnEvent } = useLeaderboardAutoUpdate(userId);

  // Update on quiz completion
  await updateOnEvent('quiz_completion', {
    quizPercentage: 85,
    messagesThisWeek: 15,
    currentStreak: 7,
    achievements: ['first_quiz', 'speed_racer']
  });
}
```

### Phase 5: Email Notifications
```typescript
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers';

function MyComponent() {
  const { notifyQuizCompletion, notifyTopThreeEntry } = useNotificationTriggers();

  // Send quiz completion email
  await notifyQuizCompletion(
    { userId, email, userName },
    'Advanced Algorithms',
    85,
    85,
    true
  );
}
```

---

## 📊 Leaderboard Scoring

| Component | Points | How It Works |
|-----------|--------|------------|
| Quiz | 0-40 | (percentage / 100) × 40 |
| Chat | 0-30 | min(messages, 30) |
| Streak | 0-20 | floor(days × 0.5), capped at 20 |
| Achievement | 0-10 | min(count × 2, 10) |
| **TOTAL** | **0-100** | Sum of all components |

### Examples:
- Quiz 100% + Chat 30 msg + Streak 14d + Achievements 3 = **40 + 30 + 7 + 6 = 83 points** ⭐
- Quiz 85% + Chat 20 msg + Streak 10d + Achievements 2 = **34 + 20 + 5 + 4 = 63 points** 
- Quiz 70% + Chat 10 msg + Streak 5d + Achievements 1 = **28 + 10 + 2 + 2 = 42 points**

---

## 📧 Email Notifications

### When Emails Are Sent:
1. **Quiz Completion** - When score ≥ 70% (passed)
2. **Top 3 Entry** - When rank enters #1-3 (first time only)
3. **Rank Change** - When rank changes by ≥ 5 positions
4. **Weekly Summary** - Every Sunday (configurable)
5. **Achievement** - On achievement unlock

### Email Types & Templates:
```
📝 Quiz Completion
  - Score display
  - Pass/fail status
  - Encouragement message
  - Link to dashboard

🏆 Top 3 Entry
  - Medal emoji (🥇🥈🥉)
  - Rank highlight
  - Congratulations
  - Link to leaderboard

📈 Rank Change
  - Trending indicator (↑↓)
  - Position change
  - Score display
  - Motivational message

📊 Weekly Summary
  - Current rank
  - Total points
  - Weekly improvement
  - Top gainers
  - Link to leaderboard

🎖️ Achievement Unlock
  - Achievement name
  - Description
  - Points earned
  - Link to achievements
```

---

## 🔌 API Routes

### Update Leaderboard Score
```
POST /api/leaderboard/update-score
Content-Type: application/json

{
  "quizPercentage": 85,
  "messagesThisWeek": 15,
  "currentStreak": 7,
  "achievements": ["first_quiz"]
}

Response:
{
  "quizScore": 34,
  "chatActivityScore": 15,
  "streakBonus": 3,
  "achievementBonus": 2,
  "totalScore": 54,
  "period": "2026-W02",
  "weekNumber": 2
}
```

### Send Notification
```
POST /api/notifications/send
Content-Type: application/json

{
  "notification": {
    "type": "quiz_completion",
    "recipient": {
      "userId": "user-123",
      "email": "user@example.com",
      "userName": "Champion"
    },
    "quizTitle": "Advanced Algorithms",
    "score": 85,
    "percentage": 85,
    "passed": true
  }
}

Response:
{
  "success": true,
  "message": "Notification sent",
  "type": "quiz_completion",
  "recipient": "user@example.com"
}
```

---

## 🎣 Hooks Reference

### useLeaderboardAutoUpdate
```typescript
const {
  updateOnEvent,        // Main update method
  updateQuizCompletion, // Quiz-specific
  updateAchievementUnlock,
  updateStreakMilestone,
  updateTopThreeEntry
} = useLeaderboardAutoUpdate(userId);

// Events: 'quiz_completion' | 'chat_activity' | 'achievement_unlock' | 'streak_milestone' | 'top_three'
await updateOnEvent(eventType, scoringFactors);
```

### useLeaderboardStats
```typescript
const {
  getUserStats,    // Fetch current stats
  isLoading,
  error
} = useLeaderboardStats(userId);

const stats = await getUserStats();
// Returns: { rank, totalScore, quizScore, ... }
```

### useNotificationTriggers
```typescript
const {
  notifyQuizCompletion,
  notifyTopThreeEntry,
  notifyRankChange,
  notifyWeeklySummary,
  notifyAchievementUnlock
} = useNotificationTriggers();

await notifyQuizCompletion(recipient, title, score, percentage, passed);
```

### useCoordinatedNotifications
```typescript
const {
  handleQuizCompletion,    // Handles multiple notifications
  handleLeaderboardUpdate   // Handles ranking notifications
} = useCoordinatedNotifications();

// Automatically triggers multiple notifications based on context
await handleLeaderboardUpdate(recipient, { newRank, previousRank, totalScore });
```

---

## 🎯 Common Use Cases

### Scenario 1: User Completes Quiz
```typescript
// 1. Grade quiz (Phase 3)
const score = await gradeAnswer(...);  // 85%

// 2. Update leaderboard (Phase 4)
await updateOnEvent('quiz_completion', {
  quizPercentage: score.percentage,
  messagesThisWeek: 15,
  currentStreak: 7,
  achievements: []
});

// 3. Get updated rank
const stats = await getUserStats();  // #5, 63 points

// 4. Send notifications (Phase 5)
await handleQuizCompletion(recipient, {
  title: 'Quiz Title',
  score: 85,
  percentage: 85,
  passed: true
});
// ✉️ Email sent to user
```

### Scenario 2: User Reaches Top 3
```typescript
// Leaderboard auto-detects top 3 entry
// Arka reaction: Victory pose + celebration
// Email: Top 3 notification with medal

await updateOnEvent('achievement_unlock', {...});
// Automatically triggers:
// 1. Leaderboard update
// 2. Arka celebration animation
// 3. Email notification (if first time)
```

### Scenario 3: Weekly Leaderboard Update
```typescript
// Scheduled job (e.g., Sunday 8am)
const allUsers = await fetchWeeklyUsers();

for (const user of allUsers) {
  // Update each user's leaderboard
  await updateOnEvent('weekly_summary', {
    quizPercentage: user.weeklyQuizPercentage,
    messagesThisWeek: user.messageCount,
    currentStreak: user.streak,
    achievements: user.weeklyAchievements
  });

  // Send weekly summary email
  await notifyWeeklySummary(
    { userId: user.id, email: user.email, userName: user.name },
    '2026-W02',
    user.rank,
    user.score,
    user.scoreImprovement,
    user.topGainers
  );
}
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Leaderboard
COSMOS_ENDPOINT=https://[account].documents.azure.com:443/
COSMOS_KEY=***
COSMOS_DB=mpt-db
COSMOS_CONTAINER_LEADERBOARD=leaderboard

# Notifications
NOTIFICATION_PROVIDER=sendgrid # or 'resend'
SENDGRID_API_KEY=***
RESEND_API_KEY=***
NOTIFICATION_FROM_EMAIL=noreply@mpt-warrior.com
```

### Notification Triggers Configuration
```typescript
// In your API route or scheduled job
export const NOTIFICATION_CONFIG = {
  QUIZ_COMPLETION_MIN_PERCENTAGE: 70,    // Only ≥70% gets email
  RANK_CHANGE_THRESHOLD: 5,              // ≥5 position change
  TOP_THREE_ENTRY_ONCE: true,            // Only first entry
  WEEKLY_SUMMARY_DAY: 0,                 // 0 = Sunday
  WEEKLY_SUMMARY_TIME: '08:00',          // 8am UTC
};
```

---

## 🧪 Testing Examples

### Test Quiz → Leaderboard → Email Flow
```typescript
// See: Phase45IntegrationExample.tsx
// Click buttons to simulate:
// - Complete Quiz → Update leaderboard → Send email
// - Chat Activity → Rank update → Email notification
// - Unlock Achievement → Points increase → Celebration
```

### Manual Testing
```bash
# Test API directly
curl -X POST http://localhost:3000/api/leaderboard/update-score \
  -H "Content-Type: application/json" \
  -H "x-user-id: user-123" \
  -d '{
    "quizPercentage": 85,
    "messagesThisWeek": 15,
    "currentStreak": 7,
    "achievements": ["first_quiz"]
  }'

# Response includes score breakdown
```

---

## 🚀 Deployment Checklist

- [ ] Set `NOTIFICATION_PROVIDER` (sendgrid/resend)
- [ ] Configure SendGrid or Resend API key
- [ ] Set `NOTIFICATION_FROM_EMAIL`
- [ ] Configure Cosmos DB endpoint and key
- [ ] Set Cosmos DB database and container names
- [ ] Test email notifications in staging
- [ ] Deploy to Azure App Service
- [ ] Monitor email delivery rates
- [ ] Set up leaderboard update scheduler
- [ ] Configure weekly summary email timing

---

## 📈 Monitoring & Logs

### Check Email Notifications
```bash
# In application logs
[API] notification sent: quiz_completion to user@example.com
[API] rank_change detected: #5 → #2 (improvement +3)
[API] top_three entry: user-123 entered rank #1
```

### Check Leaderboard Updates
```bash
[Leaderboard] score updated: user-123 = 63 points
[Leaderboard] ranking calculated: period 2026-W02
[Leaderboard] top_three detected: rank #3
```

### Check Hook Triggers
```typescript
// In component console
[useLeaderboardAutoUpdate] event: quiz_completion
[useNotificationTriggers] sending: quiz_completion email
[useCoordinatedNotifications] handling: leaderboard_update
```

---

## 🎨 UI Components

### Leaderboard Display
```typescript
import { LeaderboardWithAutoUpdate } from '@/components/LeaderboardWithAutoUpdate';

<LeaderboardWithAutoUpdate
  userId="user-123"
  refreshInterval={30000}  // 30 seconds
  limit={10}
/>
```

### Integration Demo
```typescript
import { Phase45IntegrationExample } from '@/components/Phase45IntegrationExample';

<Phase45IntegrationExample userId="user-123" />
```

---

## 🔗 Related Files

- Service: `src/services/leaderboardAutoUpdateService.ts`
- Service: `src/services/emailNotificationService.ts`
- Hook: `src/hooks/useLeaderboardAutoUpdate.ts`
- Hook: `src/hooks/useNotificationTriggers.ts`
- API: `src/app/api/leaderboard/update-score/route.ts`
- API: `src/app/api/notifications/send/route.ts`
- Component: `src/components/LeaderboardWithAutoUpdate.tsx`
- Component: `src/components/Phase45IntegrationExample.tsx`

---

**Last Updated**: January 10, 2026  
**Status**: Production Ready ✅  
**Questions?** See PHASE_4_5_COMPLETION_SUMMARY.md
