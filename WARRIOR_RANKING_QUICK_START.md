# 🚀 WARRIOR RANKING SYSTEM - QUICK START GUIDE

**Date Created**: January 9, 2026  
**Status**: Ready for Development  
**Priority**: HIGH - Core User Engagement Feature

---

## 📋 WHAT HAS BEEN CREATED

### Phase 1: Documentation & Architecture ✅

1. **WARRIOR_RANKING_IMPLEMENTATION_PLAN.md** (Main Document)
   - Complete system architecture
   - Database schema design
   - Dual-entry system (sidebar + dashboard)
   - Badge & tier system
   - All API endpoints specification
   - Real-time synchronization strategy
   - UI/UX components breakdown
   - Arka trigger integration
   - Mobile responsiveness guide
   - Testing checklist
   - Deployment steps

### Phase 2: TypeScript Types & Interfaces ✅

2. **src/types/leaderboard.ts**
   - `RankTier` enum (RECRUIT, ELITE_WARRIOR, COMMANDER, LEGENDARY_MENTOR)
   - `AchievementBadge` enum (5 types)
   - `LeaderboardEntry`, `TopThreeEntry`, `UserRankingDetail` interfaces
   - Point calculation interfaces
   - Filter & response interfaces
   - Tier & Badge configurations

### Phase 3: Utility Functions ✅

3. **src/utils/ranking.ts**
   - `determineTier()` - Calculate rank based on points
   - `calculateWeeklyPoints()` - Point formula implementation
   - `calculateQuizPointsContribution()` - Quiz scoring
   - `calculateConsistencyPointsContribution()` - Journal tracking
   - `calculateCommunityPointsContribution()` - Discussion scoring
   - `formatRankTrend()`, `formatWinRate()`, `formatPoints()` - UI formatting
   - Badge qualification checks (all 5 types)
   - Percentile calculation
   - Leaderboard sorting utilities

### Phase 4: Database Service ✅

4. **src/lib/db/leaderboard-service.ts**
   - `calculateTotalPoints()` - Sum all point sources
   - `recalculateUserRanking()` - Main ranking recalculation
   - `calculateUserRank()` - User's position in rankings
   - `getLeaderboard()` - Fetch filtered/paginated leaderboard
   - `getTopThree()` - Dashboard widget data
   - `getUserRankingDetail()` - Detailed user stats
   - Cache management (Redis fallback)
   - Point logging & audit trail
   - Batch operations for daily recalculation

---

## 🎯 NEXT STEPS (IMPLEMENTATION ROADMAP)

### PHASE 1: Backend Setup (Week 1)

**1. Database Schema Migration**
- [ ] Create/update User profile in Cosmos DB with new ranking fields
- [ ] Create `leaderboard_snapshots` collection
- [ ] Create `point_logs` collection
- [ ] Create indexes for performance optimization
- [ ] Run migration script: `npm run db:migrate`

**2. API Endpoints**
- [ ] Create: `POST /api/leaderboard/recalculate/{userId}`
- [ ] Create: `GET /api/leaderboard/user/{userId}`
- [ ] Create: `GET /api/leaderboard/top-three`
- [ ] Create: `POST /api/leaderboard/batch-recalculate`
- [ ] Update existing: `GET /api/leaderboard` (enhance with filters)

**File locations to create:**
```
src/app/api/leaderboard/recalculate/route.ts
src/app/api/leaderboard/[userId]/route.ts
src/app/api/leaderboard/top-three/route.ts
src/app/api/leaderboard/batch-recalculate/route.ts
```

**3. Test Database Seeding**
- [ ] Run: `npm run leaderboard:populate` to test with sample data
- [ ] Verify point calculations are correct
- [ ] Test ranking recalculation logic

### PHASE 2: Frontend Components (Week 2)

**1. Leaderboard Page Component**
- [ ] Create: `src/components/leaderboard/LeaderboardPage.tsx`
- [ ] Create: `src/components/leaderboard/LeaderboardTable.tsx`
- [ ] Create: `src/components/leaderboard/LeaderboardCard.tsx` (mobile)
- [ ] Create: `src/components/leaderboard/PodiumDisplay.tsx` (Top 3)
- [ ] Create: `src/components/leaderboard/SearchAndFilter.tsx`
- [ ] Route: `/app/leaderboard`

**2. Badge Components**
- [ ] Create: `src/components/RankBadge.tsx`
- [ ] Create: `src/components/AchievementBadges.tsx`
- [ ] Create: `src/components/TierDisplay.tsx`

**3. Dashboard Widget**
- [ ] Create: `src/components/dashboard/LeaderboardWidget.tsx`
- [ ] Add to dashboard page
- [ ] Auto-refresh every 30 seconds

**4. Arka Celebration Component**
- [ ] Create: `src/components/arka/ArkaCelebration.tsx`
- [ ] Integrate victory.png animation
- [ ] Add to main layout for trigger

### PHASE 3: Integration & Hooks (Week 2-3)

**1. Point Update Triggers**
- [ ] Hook: `useLeaderboardUpdate()` - Auto-recalculate after actions
- [ ] Hook: `useLeaderboardLive()` - Real-time updates
- [ ] Integrate with education service (after quiz validation)
- [ ] Integrate with journal service (after entry submission)
- [ ] Integrate with forum/discussion service (after comment)

**2. Real-Time Synchronization**
- [ ] Setup Server-Sent Events (SSE) or WebSocket
- [ ] Client-side polling fallback (30s interval)
- [ ] Cache invalidation logic

### PHASE 4: Mobile Responsive Design (Week 3)

- [ ] Test mobile view (< 768px)
- [ ] Convert table to card list
- [ ] Optimize badge display
- [ ] Touch-friendly UI elements
- [ ] No horizontal scrolling

### PHASE 5: Testing (Week 3-4)

**Unit Tests**:
```
__tests__/ranking.test.ts
__tests__/leaderboard-service.test.ts
```

**Integration Tests**:
```
__tests__/leaderboard-integration.test.ts
```

**E2E Tests**:
```
e2e/leaderboard.spec.ts
```

**Manual Testing Checklist**:
- [ ] Points update correctly after quiz completion
- [ ] Rank changes when points change
- [ ] Badges appear/disappear based on criteria
- [ ] Top 10 trigger shows Arka celebration
- [ ] Mobile cards display correctly
- [ ] Search and filter work
- [ ] Real-time updates work

### PHASE 6: Deployment (Week 4)

- [ ] Set environment variables in Vercel
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor logs and metrics
- [ ] Setup daily cron job for batch recalculation

---

## 💻 QUICK CODE SNIPPETS

### Trigger Point Recalculation After Quiz

```typescript
// In education service or quiz completion handler
import { recalculateUserRanking } from '@/lib/db/leaderboard-service';

async function onQuizValidated(userId: string, quizId: string, score: number) {
  // Update quiz result...
  
  // Trigger ranking recalculation
  const result = await recalculateUserRanking({
    userId,
    action: 'QUIZ_COMPLETED',
    actionId: quizId,
  });
  
  // Check if reached Top 10
  if (result.achievedTopTen && !user.isTopTenNotified) {
    // Show Arka celebration
    showArkaCelebration({ rank: result.newRank, userName: user.name });
  }
}
```

### Display Leaderboard in Dashboard

```typescript
// In dashboard component
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PnLSummary />
      <LeaderboardWidget /> {/* Add here */}
      <MoreStats />
    </div>
  );
}
```

### Add Menu Item to Sidebar

```typescript
// In sidebar navigation config
const menuItems = [
  { icon: 'Home', label: 'Dashboard', href: '/app/dashboard' },
  { icon: 'Book', label: 'Modules', href: '/app/modules' },
  { icon: 'Trophy', label: 'Warrior Ranking', href: '/app/leaderboard' }, // Add this
  // ... other items
];
```

### Show Rank Badge Next to User Name

```typescript
import { RankBadge } from '@/components/RankBadge';
import { AchievementBadges } from '@/components/AchievementBadges';

export function UserProfile({ user }) {
  return (
    <div className="flex items-center gap-2">
      <img src={user.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <h3>{user.name}</h3>
        <div className="flex items-center gap-1">
          <RankBadge tier={user.tier} />
          <AchievementBadges badges={user.badges} size="sm" />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 KEY METRICS & CALCULATIONS

### Point Formula
```
Weekly Points = (Quiz × 0.40) + (Consistency × 0.35) + (Community × 0.25)

Max Weekly: 40 + 35 + 20 = 95 points

Components:
- Quiz Score: 0-100 (weekly average)
- Consistency: 5 points per journal day (0-35, max 7 days)
- Community: 2 points per comment (0-20, max 10)
```

### Tier Thresholds (Cumulative)
```
RECRUIT: 0-500 pts (🥲)
ELITE_WARRIOR: 501-1,500 pts (⚔️)
COMMANDER: 1,501-3,000 pts (🎖️)
LEGENDARY_MENTOR: 3,001+ pts (👑)
```

### Badge Requirements
```
🔥 Consistency King: 30+ consecutive days with journal
📚 Knowledge Master: All modules completed with 80%+ avg
💬 Community Champion: 100+ meaningful comments
📈 Top Performer: Rank #1-3 for 2+ weeks
🏅 Comeback Warrior: +20 rank improvement in 1 week
```

---

## 📊 EXAMPLE API RESPONSES

### GET /api/leaderboard?period=ALL_TIME&limit=10

```json
{
  "data": [
    {
      "rank": 1,
      "userId": "user123",
      "userName": "Muhammad Deden",
      "avatar": "https://...",
      "tier": "COMMANDER",
      "totalPoints": 2850,
      "weeklyPoints": 85,
      "pointsBreakdown": {
        "quizPoints": 35,
        "consistencyPoints": 30,
        "communityPoints": 20
      },
      "badges": ["consistency_king", "top_performer"],
      "winRate": 78,
      "rankChange": -2,
      "isCurrentUser": false
    },
    // ... more entries
  ],
  "metadata": {
    "total": 245,
    "period": "ALL_TIME",
    "lastUpdated": "2026-01-09T10:30:00Z",
    "generatedAt": "2026-01-09T10:35:22Z",
    "hasMore": true,
    "offset": 0,
    "limit": 10
  }
}
```

### GET /api/leaderboard/user/user123

```json
{
  "userId": "user123",
  "userName": "Muhammad Deden",
  "tier": "COMMANDER",
  "currentRank": 5,
  "previousRank": 7,
  "totalPoints": 2850,
  "weeklyPoints": 85,
  "monthlyPoints": 320,
  "pointsBreakdown": {
    "quizPoints": 35,
    "consistencyPoints": 30,
    "communityPoints": 20
  },
  "badges": ["consistency_king", "top_performer"],
  "winRate": 78,
  "journalStats": {
    "entriesThisWeek": 7,
    "consecutiveDays": 35,
    "allTimeDays": 120
  },
  "quizStats": {
    "modulesCompleted": 12,
    "averageScore": 87,
    "highestScore": 95,
    "lowestScore": 72
  },
  "commentStats": {
    "thisWeek": 8,
    "thisMonth": 28,
    "allTime": 156
  },
  "percentileRank": 98
}
```

---

## 🔧 CONFIGURATION & ENV VARIABLES

Add to `.env.local`:

```
# Leaderboard System
NEXT_PUBLIC_LEADERBOARD_REFRESH_INTERVAL=30000
LEADERBOARD_CACHE_TTL=300
LEADERBOARD_TOP_USERS=100
LEADERBOARD_RECALC_BATCH_SIZE=100
```

---

## 📞 SUPPORT & TROUBLESHOOTING

### Points Not Updating?
1. Check if quiz was validated by admin
2. Verify Cosmos DB connection
3. Check point_logs for audit trail
4. Run manual recalculation: `npm run leaderboard:recalculate`

### Rank Not Changing?
1. Verify total points calculated correctly
2. Check rank history in database
3. Run batch recalculation
4. Clear Redis cache

### Arka Not Showing?
1. Verify user reached Top 10
2. Check `isTopTenNotified` flag
3. Verify victory.png image exists in public folder
4. Check browser console for errors

### Cache Issues?
1. Clear Redis cache manually
2. Restart application
3. Use fallback in-memory cache
4. Check `getCachedValue` logs

---

## 🎓 LEARNING RESOURCES

- [Azure Cosmos DB Best Practices](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Framer Motion for Animations](https://www.framer.com/motion/)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

## 📈 SUCCESS METRICS

Track these to measure system success:

- ✅ 95%+ users have visible rank/tier
- ✅ Real-time updates within 5 seconds
- ✅ 99.9% uptime for leaderboard API
- ✅ < 2s page load time
- ✅ 80%+ daily active users check leaderboard
- ✅ Top 10 trigger shows within 30s of rank change

---

## 🎉 READY TO START?

1. **Review this document** with your development team
2. **Assign Phase 1 tasks** (Database + API)
3. **Create GitHub issues** for each component
4. **Setup feature branch**: `git checkout -b feature/warrior-ranking`
5. **Track progress** with project board
6. **Test thoroughly** before deployment
7. **Deploy to production** with monitoring

**Let's build an awesome ranking system! 🚀**

---

**Document Maintainer**: AI Development Team  
**Last Updated**: January 9, 2026  
**Version**: 1.0.0
