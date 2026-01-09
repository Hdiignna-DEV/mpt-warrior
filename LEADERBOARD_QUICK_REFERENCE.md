# 🏆 Warrior Leaderboard - Quick Reference Guide

## Struktur Sistem

```
┌─────────────────────────────────────────────┐
│         SIDEBAR MENU                        │
│    "🏆 Warrior Ranking"                     │
│    ↓                                         │
│    /leaderboard (Full Page)                 │
└─────────────────────────────────────────────┘
         ↑
         │ "View All" button
         │
┌─────────────────────────────────────────────┐
│      DASHBOARD (Home)                       │
│  ┌───────────────────────────────────────┐  │
│  │  Warrior Ranking Widget               │  │
│  │  ┌─────────────────────────────────┐ │  │
│  │  │ 🥇 User #1 - 5000 pts          │ │  │
│  │  │ 🥈 User #2 - 4500 pts          │ │  │
│  │  │ 🥉 User #3 - 4000 pts          │ │  │
│  │  └─────────────────────────────────┘ │  │
│  │  YOUR POSITION: #42 | 2500 pts       │  │
│  │  ┌─────────────────────────────────┐ │  │
│  │  │   View All Rankings →            │ │  │
│  │  └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│      LEADERBOARD FULL PAGE                  │
│  ┌───────────────────────────────────────┐  │
│  │         TOP 3 PODIUM                  │  │
│  │  🥇 User #1    🥈 User #2   🥉 User #3│  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  [Search] [Filter Period]             │  │
│  ├───────────────────────────────────────┤  │
│  │ #4  User4  ⭐ Elite Warrior  3000 pts│  │
│  │ #5  User5  🛡️ Commander     2900 pts│  │
│  │ ...                                   │  │
│  │ #42 YOU ✨ (Highlighted)    2500 pts│  │
│  │ ...                                   │  │
│  │ #100 User100 🔷 Recruit     500 pts  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Key Components

### 1. Badge/Tier System

```typescript
enum RankTier {
  RECRUIT = "Recruit",                    // 0-500 pts    🔷
  ELITE_WARRIOR = "Elite Warrior",        // 501-1500    ⭐
  COMMANDER = "Commander",                // 1501-3000   🛡️
  LEGENDARY_MENTOR = "Legendary Mentor",  // 3001+       ⚡
}
```

**File**: `src/utils/badge-system.ts`

### 2. Leaderboard Data Flow

```
Quiz Validation (Admin/Deden)
    ↓
POST /api/leaderboard/sync-points
    ↓
recalculateUserRanking()
    ↓
Update: totalPoints, currentRank, tier
    ↓
Cache invalidation
    ↓
Frontend: useLeaderboardRankTrigger()
    ↓
Check Top 10/5/3/1 milestone
    ↓
Show LeaderboardArkaTrigger notification
```

### 3. API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/leaderboard` | GET | Top 100 leaderboard |
| `/api/leaderboard/user/:id` | GET | User rank info |
| `/api/leaderboard/top-three` | GET | Top 3 users |
| `/api/leaderboard/sync-points` | POST | Update poin user |
| `/api/leaderboard/recalculate` | POST | Recalc all rankings |

---

## Common Tasks

### Task 1: Add User to Leaderboard

```typescript
// User auto-added when role set to 'WARRIOR'
// No manual action needed - happens via registration flow
```

### Task 2: Update User Points (After Quiz)

```typescript
// POST /api/leaderboard/sync-points
{
  userId: "user-123",
  action: "QUIZ_COMPLETED",
  actionId: "quiz-456",
  pointsAdjustment: 50,
  reason: "Quiz validation passed"
}

// Returns:
{
  success: true,
  result: {
    previousRank: 150,
    newRank: 142,
    previousTier: "Recruit",
    newTier: "Elite Warrior",
    tierChanged: true,
    achievedTopTen: false
  },
  arkaTrigger: {
    triggered: false
  }
}
```

### Task 3: Get User Current Rank

```typescript
const fetchUserRank = async (userId: string) => {
  const response = await fetch(`/api/leaderboard/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log(`User rank: #${data.ranking.currentRank}`);
};
```

### Task 4: Trigger Arka Notification

```typescript
// Automatically triggered via useLeaderboardRankTrigger hook
// No manual trigger needed - happens when user enters Top 10

// In component:
import { useLeaderboardRankTrigger } from '@/hooks/useLeaderboardRankTrigger';

const { rankData, trigger } = useLeaderboardRankTrigger();

if (trigger?.showArka) {
  <LeaderboardArkaTrigger message={trigger.message} pose={trigger.arkaPose} />
}
```

---

## Component Usage Examples

### Example 1: Show Top 3 Widget in Dashboard

```tsx
import { WarriorRankingWidget } from '@/components/leaderboard/WarriorRankingWidget';

export function Dashboard() {
  return (
    <div>
      {/* Other widgets... */}
      <WarriorRankingWidget />
      {/* Other widgets... */}
    </div>
  );
}
```

### Example 2: Display Tier Badge

```tsx
import { RankBadge } from '@/components/leaderboard/RankBadge';
import { getBadgeByPoints } from '@/utils/badge-system';

export function UserCard({ points }) {
  const badge = getBadgeByPoints(points);
  
  return (
    <div>
      <RankBadge badge={badge.label} size="lg" showLabel />
      <p>{points} points</p>
    </div>
  );
}
```

### Example 3: Custom Leaderboard Table

```tsx
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export function MyLeaderboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard?limit=100')
      .then(r => r.json())
      .then(data => setEntries(data.leaderboard));
  }, []);

  return (
    <LeaderboardTable
      entries={entries}
      currentUserId={user.id}
      isLoading={false}
      period="all"
    />
  );
}
```

---

## Styling/Customization

### Adjust Cache TTL

**File**: `src/app/api/leaderboard/route.ts`

```typescript
const LEADERBOARD_CACHE_KEY = 'leaderboard:top100:v1';
const CACHE_TTL = 3600; // Change this (in seconds)
```

### Change Badge Colors

**File**: `src/components/leaderboard/LeaderboardTable.tsx`

```typescript
function getBadgeStyle(badge: string) {
  const styles = {
    'Recruit': {
      bg: 'bg-gray-500/20',        // Change color
      text: 'text-gray-300',       // Change text
      border: 'border-gray-500/30', // Change border
      glow: 'group-hover:shadow-gray-500/20',
    },
    // ... other tiers
  };
  return styles[badge];
}
```

### Customize Arka Pose Messages

**File**: `src/hooks/useLeaderboardRankTrigger.ts`

```typescript
const arkaPoseMessages = {
  'RANK_1': '🏆 WOW! Anda adalah JUARA #1!',
  'TOP_3_ENTRY': '🥏 Hebat! Anda masuk Top 3!',
  // ... customize messages
};
```

---

## Debugging

### Check Leaderboard in Console

```javascript
// Fetch and log leaderboard
fetch('/api/leaderboard?limit=100', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('mpt_token')}` }
})
.then(r => r.json())
.then(data => console.log(data.leaderboard));
```

### Monitor Rank Changes

```javascript
// Open DevTools → Network tab
// Filter by "leaderboard" requests
// Watch for automatic updates every 30 seconds
```

### Check Cache Status

```javascript
// In API response, look for:
// "cached": true/false
// "cacheSource": "redis", "memory", or "database"
```

---

## Performance Tips

1. **Reduce Update Frequency**
   - Change `fetchLeaderboard()` interval from 30s to 60s
   - Reduces server load

2. **Implement Pagination**
   - Load first 10 entries, lazy load more on scroll
   - Better mobile performance

3. **Use Virtual Scrolling**
   - For large lists (100+ items)
   - Only render visible items

4. **Optimize Images**
   - Use Next.js Image component (already done)
   - Compress avatar images to < 50KB

---

## Monitoring Checklist

Daily:
- [ ] Check API response times (target < 500ms)
- [ ] Monitor error rates
- [ ] Verify cache hit rate > 80%

Weekly:
- [ ] Review leaderboard data accuracy
- [ ] Check for invalid entries
- [ ] Verify badge calculations

Monthly:
- [ ] Analyze engagement metrics
- [ ] Optimize slow queries
- [ ] Review user feedback

---

## Support Links

- **Leaderboard Types**: `src/types/leaderboard.ts`
- **Main Service**: `src/lib/db/leaderboard-service.ts`
- **Ranking Utils**: `src/utils/ranking.ts`
- **Badge System**: `src/utils/badge-system.ts`
- **Education Service**: `src/lib/db/education-service.ts`

---

## Emergency Procedures

### Leaderboard Data Looks Wrong

1. Check Cosmos DB for corrupt entries
2. Run recalculation: `POST /api/leaderboard/recalculate`
3. Clear cache: Redis or fallback memory cache
4. Verify user role = 'WARRIOR'

### Widget Not Updating

1. Verify `useLeaderboardRankTrigger` hook mounted
2. Check fetch interval and API response
3. Clear browser localStorage
4. Reload page

### Arka Not Appearing

1. Verify user entered Top 10
2. Check `LeaderboardArkaTrigger` component rendered
3. Verify framer-motion animations working
4. Check z-index (set to 50, should be on top)

---

**Quick Commands**

```bash
# Test API locally
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/leaderboard?limit=5

# Check database health
npm run db:check

# Verify leaderboard setup
npm run phase1:verify
```

---

*Version 1.0 | Last Updated: 9 Jan 2026*
