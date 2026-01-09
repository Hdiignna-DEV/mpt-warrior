# 🏆 WARRIOR RANKING & LEADERBOARD - COMPLETE IMPLEMENTATION PLAN

**Document Date**: January 9, 2026  
**Status**: Ready for Development  
**Priority**: High (Core User Engagement Feature)

---

## TABLE OF CONTENTS
1. [System Architecture](#1-system-architecture)
2. [Database Schema Updates](#2-database-schema-updates)
3. [Dual-Entry Point System](#3-dual-entry-point-system)
4. [Badge & Rank Tier System](#4-badge--rank-tier-system)
5. [API Endpoints & Services](#5-api-endpoints--services)
6. [Real-Time Point Synchronization](#6-real-time-point-synchronization)
7. [UI/UX Implementation Details](#7-uiux-implementation-details)
8. [Arka Integration (Top 10 Trigger)](#8-arka-integration-top-10-trigger)
9. [Mobile Responsiveness](#9-mobile-responsiveness)
10. [Testing Checklist](#10-testing-checklist)
11. [Deployment Steps](#11-deployment-steps)

---

## 1. SYSTEM ARCHITECTURE

### High-Level Data Flow

```
User Action (Quiz/Journal/Comment)
    ↓
Validation & Scoring Logic
    ↓
Update Points in Cosmos DB
    ↓
Recalculate Rank & Badge
    ↓
Invalidate Redis Cache
    ↓
Update UI Components (Real-time)
    ↓
Check Top 10 → Trigger Arka (if applicable)
    ↓
Notify User (Toast/Email)
```

### Technology Stack
- **Frontend**: Next.js (React) + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes + TypeScript
- **Database**: Azure Cosmos DB (SQL API)
- **Caching**: Redis (for leaderboard rankings)
- **Real-time**: Server-Sent Events (SSE) or WebSocket
- **AI Character**: Commander Arka with victory.png animation

---

## 2. DATABASE SCHEMA UPDATES

### User Profile Collection Enhancement

**Add these fields to existing User document in Cosmos DB:**

```typescript
interface UserProfile {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  
  // ==================== RANKING SYSTEM ====================
  
  // Total Points (cumulative - all time)
  totalPoints: number; // 0-9999+
  
  // Weekly Points (resets every Sunday)
  weeklyPoints: number;
  weeklyPointsLastReset: string; // ISO timestamp
  
  // Breakdown of points from different sources
  pointsBreakdown: {
    quizPoints: number;        // From completed quizzes (40% weight)
    consistencyPoints: number; // From daily journal entries (35% weight)
    communityPoints: number;   // From discussion comments (25% weight)
  };
  
  // Rank & Position
  currentRank: number;         // Current position (1-∞)
  previousRank: number;        // Last week's position
  rankChange: number;          // currentRank - previousRank (negative = improvement)
  lastRankUpdate: string;      // ISO timestamp
  
  // Tier/Badge System
  tier: 'RECRUIT' | 'ELITE_WARRIOR' | 'COMMANDER' | 'LEGENDARY_MENTOR';
  tierUnlockedDate: string;    // ISO timestamp when tier reached
  
  // Achievement Badges
  badges: {
    consistency_king?: boolean;      // 30+ days journal streak
    knowledge_master?: boolean;      // All modules completed with 80%+
    community_champion?: boolean;    // 100+ meaningful comments
    top_performer?: boolean;         // Rank #1-3 for 2+ weeks
    comeback_warrior?: boolean;      // Rose 20+ ranks in 1 week
    top_10_first_time?: boolean;     // Newly added: First time Top 10
  };
  
  // Journal Tracking
  journalEntries: {
    lastEntryDate: string;      // ISO timestamp of most recent entry
    entriesThisWeek: number;    // Count of unique days with entries
    consecutiveDays: number;    // Current streak (max 7)
    allTimeDays: number;        // Total days with journal entries
  };
  
  // Discussion Activity
  commentStats: {
    thisWeek: number;           // Comments in last 7 days
    thisMonth: number;          // Comments in last 30 days
    allTime: number;            // Total comments
    lastCommentDate: string;    // ISO timestamp
  };
  
  // Quiz Statistics
  quizStats: {
    modulesCompleted: number;
    averageScore: number;       // 0-100
    highestScore: number;
    lowestScore: number;
    allTimeAverage: number;
  };
  
  // Trading Statistics (for Win % calculation)
  tradingStats: {
    totalTrades: number;
    winningTrades: number;
    winRate: number;            // 0-100 (percentage)
  };
  
  // System Flags
  isTopTenNotified: boolean;    // Has Arka already greeted this user for Top 10?
  lastArkaTopTenDate?: string;  // When was Arka triggered last?
}
```

### New Collections to Create

#### 1. **leaderboard_snapshots** (for historical tracking)

```typescript
interface LeaderboardSnapshot {
  id: string;
  date: string;                // ISO timestamp
  period: 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  rankings: {
    rank: number;
    userId: string;
    userName: string;
    totalPoints: number;
    tier: string;
    badges: string[];
  }[];
  topThree: {
    rank: number;
    userId: string;
    userName: string;
    avatar: string;
    tier: string;
  }[];
}
```

#### 2. **point_logs** (audit trail for debugging)

```typescript
interface PointLog {
  id: string;
  userId: string;
  timestamp: string;
  action: 'QUIZ_COMPLETED' | 'JOURNAL_ENTRY' | 'COMMENT_ADDED' | 'MANUAL_ADJUSTMENT';
  pointsAdded: number;
  pointsSource: string;         // 'quiz', 'journal', 'comment'
  details: {
    quizId?: string;
    journalDate?: string;
    commentId?: string;
    adminNote?: string;
  };
  previousTotal: number;
  newTotal: number;
  rank: number;                 // User's rank after this transaction
}
```

---

## 3. DUAL-ENTRY POINT SYSTEM

### 3A. SIDEBAR MENU - Full Leaderboard Page

**Route**: `/app/leaderboard` or `/warrior-ranking`

**Features**:
- Display Top 100 rankings with full details
- Table with columns: Rank | Avatar + Name | Tier | Total Points | Win % | Trend | Badges
- Search by user name
- Filter by period: This Week / This Month / All Time
- Sort by: Rank, Points, Win%, or Tier
- Highlight current user's row with orange glow background
- Top 3 displayed with premium podium design (gold, silver, bronze frames)
- Mobile-responsive card list view (no horizontal scroll)
- Refresh button to update real-time

**Component Path**: `src/components/leaderboard/LeaderboardPage.tsx`

**Key Sections**:
```
┌─────────────────────────────────────────────┐
│ 🏆 WARRIOR RANKINGS                  🔄     │
├─────────────────────────────────────────────┤
│ [Search box] [Filter: Period dropdown]      │
│                                              │
│ *** TOP 3 PODIUM (Premium Display) ***     │
│ 👑 #1: [Avatar] Name | Level | Points      │
│ 🥈 #2: [Avatar] Name | Level | Points      │
│ 🥉 #3: [Avatar] Name | Level | Points      │
├─────────────────────────────────────────────┤
│ Regular Table (Rank 4-100)                  │
│ Highlight user's row here                   │
└─────────────────────────────────────────────┘
```

### 3B. DASHBOARD WIDGET - Mini Leaderboard Preview

**Location**: Dashboard main page (right side or below P&L summary)

**Features**:
- Show Top 3 Global with avatars
- Display current user's rank: "Your Rank: #42"
- Quick stat: "Points: 950 | Tier: Elite Warrior"
- "View All Rankings" button → links to full leaderboard page
- Auto-refresh every 30 seconds
- Mobile-friendly card layout

**Component Path**: `src/components/dashboard/LeaderboardWidget.tsx`

**Design**:
```
┌─────────────────────────┐
│ 🏆 WARRIOR RANKINGS     │
├─────────────────────────┤
│ Top Warriors:           │
│ [Ava1] [Ava2] [Ava3]   │
│ Name | Name | Name      │
│                         │
│ Your Rank: #42          │
│ Points: 950 | ⚔️ Elite   │
│                         │
│ [View All Rankings] →   │
└─────────────────────────┘
```

---

## 4. BADGE & RANK TIER SYSTEM

### 4A. Rank Tiers (Based on Cumulative Total Points)

| Tier | Points | Icon | Color | Badge |
|------|--------|------|-------|-------|
| **Recruit** | 0-500 | 🥲 | Gray (#808080) | Single gray line (▮) |
| **Elite Warrior** | 501-1,500 | ⚔️ | Blue (#4A90E2) | Double gold lines (▮▮) |
| **Commander** | 1,501-3,000 | 🎖️ | Gold (#FFD700) | Single gold star (★) |
| **Legendary Mentor** | 3,001+ | 👑 | Platinum (#E5E4E2) | Golden star with glow (✨★) |

### 4B. Special Achievement Badges

```typescript
enum SpecialBadges {
  CONSISTENCY_KING = '🔥',      // 30+ consecutive days with journal entry
  KNOWLEDGE_MASTER = '📚',      // Completed all modules with avg 80%+
  COMMUNITY_CHAMPION = '💬',    // 100+ meaningful discussion comments
  TOP_PERFORMER = '📈',         // Top 1-3 for 2+ consecutive weeks
  COMEBACK_WARRIOR = '🏅',      // Rose 20+ positions within 1 week
}
```

### 4C. Badge Calculation Logic

**Consistency King**:
```typescript
function checkConsistencyKing(journalEntries: JournalEntry[]): boolean {
  const sortedEntries = journalEntries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reverse();
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const dayDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
      if (streak >= 30) return true;
    } else if (dayDiff > streak) {
      break;
    }
  }
  return false;
}
```

**Knowledge Master**:
```typescript
function checkKnowledgeMaster(quizScores: QuizResult[]): boolean {
  if (quizScores.length === 0) return false;
  const totalModules = getAllModulesCount(); // Get from education service
  
  if (quizScores.length < totalModules) return false; // Not all completed
  
  const avgScore = quizScores.reduce((sum, q) => sum + q.score, 0) / quizScores.length;
  return avgScore >= 80;
}
```

**Community Champion**:
```typescript
function checkCommunityChampion(comments: Comment[]): boolean {
  const meaningfulComments = comments.filter(c => c.content.length >= 10);
  return meaningfulComments.length >= 100;
}
```

**Top Performer**:
```typescript
function checkTopPerformer(rankHistory: RankEntry[], weeks: number = 2): boolean {
  const recentHistory = rankHistory.slice(-14); // Last 14 days
  const topRankDays = recentHistory.filter(r => r.rank <= 3).length;
  return topRankDays >= 7; // At least 50% of days in Top 3
}
```

**Comeback Warrior**:
```typescript
function checkComebackWarrior(rankHistory: RankEntry[], days: number = 7): boolean {
  const sevenDaysAgo = rankHistory[rankHistory.length - 8];
  const today = rankHistory[rankHistory.length - 1];
  
  if (!sevenDaysAgo || !today) return false;
  return sevenDaysAgo.rank - today.rank >= 20; // Improved by 20+ ranks
}
```

---

## 5. API ENDPOINTS & SERVICES

### 5A. New API Routes to Create

#### **GET** `/api/leaderboard`
```typescript
/**
 * Get leaderboard rankings with filters
 * Query params:
 *   - period: 'WEEK' | 'MONTH' | 'ALL_TIME' (default: WEEK)
 *   - limit: number (default: 100)
 *   - offset: number (default: 0)
 *   - search: string (optional - search by name)
 * 
 * Response:
 */
interface LeaderboardResponse {
  data: {
    rank: number;
    userId: string;
    userName: string;
    avatar: string;
    tier: string;
    totalPoints: number;
    weeklyPoints?: number;
    badges: string[];
    winRate: number;
    rankChange: number;
    isCurrentUser?: boolean;
  }[];
  metadata: {
    total: number;
    period: string;
    lastUpdated: string;
    generatedAt: string;
  };
}
```

#### **GET** `/api/leaderboard/user/{userId}`
```typescript
/**
 * Get specific user's ranking details
 * Response:
 */
interface UserRankingDetail {
  userId: string;
  userName: string;
  tier: string;
  currentRank: number;
  previousRank: number;
  totalPoints: number;
  weeklyPoints: number;
  pointsBreakdown: {
    quizPoints: number;
    consistencyPoints: number;
    communityPoints: number;
  };
  badges: string[];
  winRate: number;
  journalStats: {
    entriesThisWeek: number;
    consecutiveDays: number;
  };
  quizStats: {
    modulesCompleted: number;
    averageScore: number;
  };
  commentStats: {
    thisWeek: number;
  };
  percentileRank: number; // e.g., top 5%
}
```

#### **GET** `/api/leaderboard/top-three`
```typescript
/**
 * Get Top 3 for dashboard widget (cached)
 * Response: Array of top 3 with full details
 */
```

#### **POST** `/api/leaderboard/recalculate/{userId}`
```typescript
/**
 * Manually recalculate user's points and rank
 * Triggers: After quiz validation, journal entry, comment posting
 * 
 * Body:
 */
interface RecalculateRequest {
  userId: string;
  action: 'QUIZ_COMPLETED' | 'JOURNAL_ENTRY' | 'COMMENT_ADDED';
  actionId?: string; // quizId, journalId, commentId
  pointsAdjustment?: number; // For manual overrides
}

/**
 * Response:
 */
interface RecalculateResponse {
  success: boolean;
  previousRank: number;
  newRank: number;
  pointsChange: number;
  newTotal: number;
  tierChanged: boolean;
  newTier?: string;
  badgesEarned?: string[];
  topTenAchieved?: boolean;
}
```

#### **POST** `/api/leaderboard/batch-recalculate`
```typescript
/**
 * Batch recalculate all users (ADMIN ONLY)
 * Used for daily cron job or cleanup
 */
interface BatchRecalculateRequest {
  reason: string;
  dryRun?: boolean;
}
```

#### **GET** `/api/leaderboard/historical/{period}`
```typescript
/**
 * Get historical leaderboard snapshots
 * For analyzing trends and rank history
 */
```

### 5B. Service Functions to Create

**File**: `src/lib/db/leaderboard-service.ts`

```typescript
// Core Ranking Functions
export async function calculateUserRank(userId: string): Promise<number>
export async function calculateTotalPoints(userId: string): Promise<number>
export async function determineTier(points: number): 'RECRUIT' | 'ELITE_WARRIOR' | 'COMMANDER' | 'LEGENDARY_MENTOR'
export async function calculateBadges(userId: string): Promise<string[]>

// Leaderboard Retrieval
export async function getLeaderboard(
  period: 'WEEK' | 'MONTH' | 'ALL_TIME',
  limit?: number,
  offset?: number
): Promise<LeaderboardEntry[]>

export async function getTopThree(): Promise<TopThreeEntry[]>
export async function getUserRankingDetail(userId: string): Promise<UserRankingDetail>

// Point Calculation
export async function calculateQuizPoints(userId: string): Promise<number>
export async function calculateConsistencyPoints(userId: string): Promise<number>
export async function calculateCommunityPoints(userId: string): Promise<number>

// Cache Management
export async function invalidateLeaderboardCache(): Promise<void>
export async function cacheLeaderboard(period: string): Promise<void>

// Notifications
export async function checkAndNotifyTopTen(userId: string, newRank: number): Promise<void>
```

---

## 6. REAL-TIME POINT SYNCHRONIZATION

### 6A. When Points Update

**1. After Quiz Completion (by admin validation)**
```typescript
// In education-service.ts or new hook
async function onQuizValidated(userId: string, quizId: string, score: number) {
  // 1. Update quiz score
  // 2. Trigger recalculate
  await api.post('/api/leaderboard/recalculate/{userId}', {
    action: 'QUIZ_COMPLETED',
    actionId: quizId,
  });
}
```

**2. After Journal Entry**
```typescript
// In journal service
async function onJournalSubmitted(userId: string, journalEntry: JournalEntry) {
  await api.post('/api/leaderboard/recalculate/{userId}', {
    action: 'JOURNAL_ENTRY',
    actionId: journalEntry.id,
  });
}
```

**3. After Comment Posted**
```typescript
// In forum/discussion service
async function onCommentPosted(userId: string, comment: Comment) {
  // Filter out spam/short comments
  if (comment.content.length >= 10) {
    await api.post('/api/leaderboard/recalculate/{userId}', {
      action: 'COMMENT_ADDED',
      actionId: comment.id,
    });
  }
}
```

### 6B. Real-Time UI Updates

**Option 1: Server-Sent Events (SSE)**
```typescript
// Client-side hook
export function useLeaderboardLive() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/leaderboard/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLeaderboard(data);
    };
    
    return () => eventSource.close();
  }, []);
  
  return leaderboard;
}
```

**Option 2: WebSocket**
```typescript
// More reliable for frequent updates
// Use socket.io or native WebSocket
```

**Option 3: Polling (Simple)**
```typescript
export function useLeaderboardPolling(interval = 30000) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.data);
    }, interval);
    
    return () => clearInterval(poll);
  }, []);
  
  return leaderboard;
}
```

### 6C. Cache Invalidation Strategy

**Redis Keys**:
```
leaderboard:WEEK
leaderboard:MONTH
leaderboard:ALL_TIME
leaderboard:top_three
user:{userId}:ranking
user:{userId}:badges
```

**Invalidate on**:
- User points change
- Rank recalculation
- Badge earned/lost
- Every 1 hour (safety TTL)

---

## 7. UI/UX IMPLEMENTATION DETAILS

### 7A. Rank Badge Display Component

**File**: `src/components/RankBadge.tsx`

```typescript
interface RankBadgeProps {
  tier: 'RECRUIT' | 'ELITE_WARRIOR' | 'COMMANDER' | 'LEGENDARY_MENTOR';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RankBadge({ tier, size = 'md', showLabel = false }: RankBadgeProps) {
  const tierConfig = {
    RECRUIT: { icon: '🥲', label: 'Recruit', color: 'gray' },
    ELITE_WARRIOR: { icon: '⚔️', label: 'Elite Warrior', color: 'blue' },
    COMMANDER: { icon: '🎖️', label: 'Commander', color: 'yellow' },
    LEGENDARY_MENTOR: { icon: '👑', label: 'Legendary Mentor', color: 'purple' },
  };
  
  const config = tierConfig[tier];
  
  return (
    <div className={`inline-flex items-center gap-1`}>
      <span className={`text-${size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px'}`}>
        {config.icon}
      </span>
      {showLabel && <span className={`text-${config.color}-600`}>{config.label}</span>}
    </div>
  );
}
```

### 7B. Achievement Badges Component

```typescript
interface AchievementBadgesProps {
  badges: string[];
  size?: 'sm' | 'md';
}

export function AchievementBadges({ badges, size = 'md' }: AchievementBadgesProps) {
  const badgeEmojis = {
    consistency_king: '🔥',
    knowledge_master: '📚',
    community_champion: '💬',
    top_performer: '📈',
    comeback_warrior: '🏅',
  };
  
  return (
    <div className="flex gap-1">
      {badges.map(badge => (
        <span 
          key={badge} 
          title={badge.replace('_', ' ')}
          className={`text-${size === 'sm' ? '14px' : '18px'}`}
        >
          {badgeEmojis[badge as keyof typeof badgeEmojis]}
        </span>
      ))}
    </div>
  );
}
```

### 7C. Leaderboard Table Desktop View

```typescript
// src/components/leaderboard/LeaderboardTable.tsx
interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
}

export function LeaderboardTable({ 
  entries, 
  currentUserId,
  onUserClick 
}: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">Warrior</th>
            <th className="px-4 py-2 text-center">Tier</th>
            <th className="px-4 py-2 text-right">Points</th>
            <th className="px-4 py-2 text-right">Win %</th>
            <th className="px-4 py-2 text-center">Trend</th>
            <th className="px-4 py-2 text-center">Badges</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.userId}
              className={`
                border-b cursor-pointer hover:bg-gray-50
                ${entry.userId === currentUserId ? 'bg-orange-100 border-l-4 border-orange-500' : ''}
                ${entry.rank <= 3 ? 'bg-yellow-50' : ''}
              `}
              onClick={() => onUserClick?.(entry.userId)}
            >
              {/* Rank with medal emoji */}
              <td className="px-4 py-2 font-bold">
                {entry.rank === 1 ? '👑 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : entry.rank}
              </td>
              
              {/* Avatar + Name */}
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={entry.avatar} 
                    alt={entry.userName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{entry.userName}</span>
                </div>
              </td>
              
              {/* Tier Badge */}
              <td className="px-4 py-2 text-center">
                <RankBadge tier={entry.tier} size="sm" />
              </td>
              
              {/* Points */}
              <td className="px-4 py-2 text-right font-semibold">{entry.totalPoints.toLocaleString()}</td>
              
              {/* Win % */}
              <td className="px-4 py-2 text-right">{entry.winRate}%</td>
              
              {/* Trend */}
              <td className="px-4 py-2 text-center">
                {entry.rankChange < 0 ? '↑' : entry.rankChange > 0 ? '↓' : '→'}
                {` ${Math.abs(entry.rankChange)}`}
              </td>
              
              {/* Badges */}
              <td className="px-4 py-2 text-center">
                <AchievementBadges badges={entry.badges} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 7D. Mobile Card View (Responsive)

```typescript
// src/components/leaderboard/LeaderboardCard.tsx
export function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  return (
    <div
      className={`
        p-4 border rounded-lg mb-2
        ${isCurrentUser ? 'bg-orange-100 border-orange-500 border-2' : 'bg-white border-gray-200'}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold">{entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}</div>
          <div>
            <img 
              src={entry.avatar} 
              alt={entry.userName}
              className="w-10 h-10 rounded-full mb-1"
            />
            <h3 className="font-semibold">{entry.userName}</h3>
          </div>
        </div>
        <RankBadge tier={entry.tier} size="md" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <span className="font-semibold text-gray-900">{entry.totalPoints}</span> pts
        </div>
        <div>
          <span className="font-semibold text-gray-900">{entry.winRate}%</span> win
        </div>
      </div>
      
      {entry.badges.length > 0 && (
        <div className="mt-2">
          <AchievementBadges badges={entry.badges} size="sm" />
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Trend: {entry.rankChange < 0 ? '↑' : entry.rankChange > 0 ? '↓' : '→'} {Math.abs(entry.rankChange)}
      </div>
    </div>
  );
}
```

### 7E. Dashboard Widget

```typescript
// src/components/dashboard/LeaderboardWidget.tsx
export function LeaderboardWidget() {
  const [topThree, setTopThree] = useState<TopThreeEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { userId } = useAuth();
  
  useEffect(() => {
    Promise.all([
      fetch('/api/leaderboard/top-three').then(r => r.json()),
      fetch(`/api/leaderboard/user/${userId}`).then(r => r.json()),
    ]).then(([top, user]) => {
      setTopThree(top.data);
      setUserRank(user.currentRank);
    });
  }, [userId]);
  
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4">🏆 Warrior Rankings</h3>
      
      {/* Top 3 Avatars */}
      <div className="flex justify-center gap-4 mb-6">
        {topThree.map((entry, i) => (
          <div key={entry.userId} className="text-center">
            <div className="relative inline-block">
              <img 
                src={entry.avatar}
                alt={entry.userName}
                className={`w-12 h-12 rounded-full border-2 ${
                  i === 0 ? 'border-yellow-500' : i === 1 ? 'border-gray-400' : 'border-orange-700'
                }`}
              />
              <span className="absolute -top-2 -right-2 text-lg font-bold">
                {i === 0 ? '👑' : i === 1 ? '🥈' : '🥉'}
              </span>
            </div>
            <p className="text-xs font-semibold mt-1">{entry.userName}</p>
          </div>
        ))}
      </div>
      
      {/* User's Rank */}
      <div className="text-center bg-blue-50 rounded p-3 mb-4">
        <p className="text-gray-600 text-sm">Your Rank</p>
        <p className="text-2xl font-bold text-blue-600">#{userRank || '-'}</p>
      </div>
      
      {/* View All Button */}
      <Link href="/app/leaderboard">
        <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          View All Rankings →
        </button>
      </Link>
    </div>
  );
}
```

---

## 8. ARKA INTEGRATION (TOP 10 TRIGGER)

### 8A. Trigger Logic

When user's rank becomes ≤ 10:

```typescript
// In recalculate endpoint
async function checkAndTriggerArkaCelebration(userId: string, newRank: number) {
  if (newRank <= 10) {
    // Get user details
    const user = await getUserProfile(userId);
    
    // Check if already notified today
    if (user.lastArkaTopTenDate) {
      const lastDate = new Date(user.lastArkaTopTenDate);
      const today = new Date();
      
      if (lastDate.toDateString() === today.toDateString()) {
        return; // Already celebrated today
      }
    }
    
    // Trigger Arka celebration
    await triggerArkaCelebration({
      userId,
      userName: user.name,
      newRank,
      rank: user.currentRank,
    });
    
    // Update flag
    await updateUserProfile(userId, {
      lastArkaTopTenDate: new Date().toISOString(),
      isTopTenNotified: true,
    });
  }
}
```

### 8B. Arka Celebration Component

```typescript
// src/components/arka/ArkaCelebration.tsx
interface ArkaCelebrationProps {
  userName: string;
  rank: number;
  onClose: () => void;
}

export function ArkaCelebration({ userName, rank, onClose }: ArkaCelebrationProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        {/* Arka Character - Victory Pose */}
        <img
          src="/images/arka/victory.png"
          alt="Commander Arka"
          className="w-60 h-60 object-contain"
        />
        
        {/* Congratulations Message */}
        <motion.div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 rounded-lg p-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg font-bold text-gray-800">
            🎉 Congratulations, {userName}!
          </p>
          <p className="text-sm text-gray-700 mt-1">
            You've reached the Top 10! 🏆
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Current Rank: #{rank}
          </p>
        </motion.div>
        
        {/* Arka Quote */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-100 rounded-lg p-3 text-center max-w-xs"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm italic text-gray-800">
            "This is the power of disciplined trading and unwavering mindset. You're becoming a true Warrior!"
          </p>
        </motion.div>
        
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
```

### 8C. Integrate into Dashboard/Page

```typescript
// In main dashboard component
const [showArkaCelebration, setShowArkaCelebration] = useState(false);
const [arkaData, setArkaData] = useState(null);

useEffect(() => {
  // Check if user just reached Top 10
  checkUserRank().then(rank => {
    if (rank <= 10 && !hasSeenArkaToday()) {
      setArkaData({ rank, userName: currentUser.name });
      setShowArkaCelebration(true);
    }
  });
}, []);

return (
  <>
    {/* Main dashboard content */}
    {showArkaCelebration && (
      <ArkaCelebration
        userName={arkaData.userName}
        rank={arkaData.rank}
        onClose={() => setShowArkaCelebration(false)}
      />
    )}
  </>
);
```

---

## 9. MOBILE RESPONSIVENESS

### 9A. Responsive Breakpoints

**Desktop** (≥1024px): Full table with all columns  
**Tablet** (768px - 1023px): Simplified table, hide Win%  
**Mobile** (<768px): Card list view

### 9B. Tailwind Classes for Responsive Layout

```typescript
// Leaderboard page responsive wrapper
<div className="
  block md:hidden    // Show card list on mobile
  space-y-2
">
  {/* Card view for mobile */}
</div>

<div className="
  hidden md:block    // Show table on desktop
">
  {/* Table for desktop */}
</div>
```

### 9C. Mobile-Specific Optimizations

- **No horizontal scrolling** → use cards with key metrics
- **Touch-friendly buttons** → min 44px height
- **Reduced avatar sizes** → 32px instead of 48px
- **Simplified badges** → emoji only, no text
- **Collapsible filter section** → search/filter in modal

---

## 10. TESTING CHECKLIST

### 10A. Unit Tests

```typescript
// __tests__/leaderboard-service.test.ts
describe('Leaderboard Service', () => {
  it('should calculate total points correctly', async () => {
    const points = await calculateTotalPoints('user123');
    expect(points).toBeGreaterThanOrEqual(0);
  });
  
  it('should determine correct tier based on points', () => {
    expect(determineTier(250)).toBe('RECRUIT');
    expect(determineTier(1000)).toBe('ELITE_WARRIOR');
    expect(determineTier(2000)).toBe('COMMANDER');
    expect(determineTier(4000)).toBe('LEGENDARY_MENTOR');
  });
  
  it('should identify achieved badges', async () => {
    const badges = await calculateBadges('user123');
    expect(Array.isArray(badges)).toBe(true);
  });
});
```

### 10B. Integration Tests

```typescript
// __tests__/leaderboard-integration.test.ts
describe('Leaderboard Integration', () => {
  it('should update rank after quiz completion', async () => {
    const initialRank = await calculateUserRank('user123');
    
    // Complete quiz
    await submitQuizResult({
      userId: 'user123',
      quizId: 'quiz1',
      score: 90,
    });
    
    const newRank = await calculateUserRank('user123');
    expect(newRank).toBeLessThanOrEqual(initialRank);
  });
  
  it('should sync across all devices in real-time', async () => {
    // Verify cache invalidation
    // Verify API updates
  });
});
```

### 10C. E2E Tests

```typescript
// e2e/leaderboard.spec.ts (Playwright/Cypress)
test('Full leaderboard workflow', async ({ page }) => {
  // Login as user
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('[type="submit"]');
  
  // Navigate to leaderboard
  await page.click('text=Warrior Ranking');
  
  // Verify user's row is highlighted
  await expect(page.locator('[data-test="user-row"]')).toHaveClass(/bg-orange-100/);
  
  // Test search
  await page.fill('[placeholder="Search name"]', 'user');
  await expect(page.locator('[data-test="leaderboard-row"]')).toHaveCount(1);
  
  // Test filter
  await page.selectOption('[name="period"]', 'MONTH');
  
  // Test sorting
  await page.click('text=Points');
  
  // Verify points are sorted descending
  const points = await page.locator('[data-test="points-value"]').allTextContents();
  const values = points.map(p => parseInt(p));
  expect(values).toEqual([...values].sort((a, b) => b - a));
});
```

### 10D. Manual Testing Checklist

- [ ] Quiz completion → Points update → Rank changes
- [ ] Journal entry → Consistency points calculated
- [ ] Comment posted → Community points awarded
- [ ] User reaches Top 10 → Arka celebration shows
- [ ] Mobile view → Cards display correctly, no horizontal scroll
- [ ] Search by name → Results filter correctly
- [ ] Filter by period → Correct points shown
- [ ] Badges display → All achievement types show
- [ ] Real-time updates → Leaderboard refreshes every 30s
- [ ] Cache invalidation → Points update immediately on recalculation
- [ ] Multiple users → Concurrent point updates don't conflict
- [ ] Top 3 podium → Premium design visible
- [ ] Desktop/tablet/mobile → All responsive

---

## 11. DEPLOYMENT STEPS

### 11A. Pre-Deployment Checklist

- [ ] All API endpoints tested locally
- [ ] Database schema migrations run successfully
- [ ] Redis cache configured for Vercel environment
- [ ] Environment variables set in Vercel:
  - `NEXT_PUBLIC_LEADERBOARD_REFRESH_INTERVAL` = 30000
  - `COSMOS_LEADERBOARD_CONTAINER` = "leaderboard"
  - `REDIS_LEADERBOARD_KEY_PREFIX` = "leaderboard:"
- [ ] Unit + integration tests passing
- [ ] E2E tests passing
- [ ] Mobile responsiveness verified
- [ ] Performance baseline established (< 2s page load)

### 11B. Deployment Commands

```bash
# 1. Create database collections
npm run db:init-leaderboard

# 2. Deploy to Vercel
git push origin main  # Auto-deploys via Vercel GitHub integration

# 3. Run initial leaderboard population
npm run leaderboard:populate

# 4. Verify deployment
curl https://yourdomain.com/api/leaderboard?limit=1
```

### 11C. Post-Deployment

1. **Monitor for 24 hours**:
   - Check error logs in Vercel dashboard
   - Monitor Cosmos DB request unit consumption
   - Watch Redis cache hit rates
   
2. **Run smoke tests**:
   ```bash
   npm run test:smoke
   ```

3. **Enable cron job** for daily batch recalculation:
   ```typescript
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/leaderboard-recalculate",
       "schedule": "0 2 * * *"  // 2 AM UTC daily
     }]
   }
   ```

4. **Notify users** about the new Leaderboard feature

---

## QUICK REFERENCE: Point Formula

```
Weekly Points = (Quiz Score × 0.40) + (Consistency Score × 0.35) + (Community Score × 0.25)

Where:
- Quiz Score: Avg of all completed modules that week (0-100)
- Consistency Score: Days with journal entries × 5 (0-35, capped at 7 days)
- Community Score: Min(comments, 10) × 2 (0-20)

Max Weekly: 40 + 35 + 20 = 95 points

Tier Thresholds (Cumulative Total):
- Recruit: 0-500
- Elite Warrior: 501-1,500
- Commander: 1,501-3,000
- Legendary Mentor: 3,001+
```

---

## SUMMARY

This implementation plan provides:

✅ **Dual-entry system** (Sidebar + Dashboard Widget)  
✅ **Accurate ranking** based on weighted points (Quiz/Consistency/Community)  
✅ **Badge system** with 4 tier levels + 5 achievement badges  
✅ **Real-time synchronization** across all devices  
✅ **Arka celebration** for Top 10 achievers  
✅ **Mobile-responsive** design (cards on mobile, table on desktop)  
✅ **Database schema** for all ranking data  
✅ **API endpoints** for leaderboard data retrieval and updates  
✅ **Caching strategy** for performance  
✅ **Testing framework** for quality assurance  
✅ **Deployment checklist** for smooth rollout  

---

**Next Steps:**
1. Review & approve this document
2. Assign tasks to developers
3. Create GitHub issues for each component
4. Setup feature branch: `feature/warrior-ranking-system`
5. Begin Phase 1: Database schema & API endpoints

