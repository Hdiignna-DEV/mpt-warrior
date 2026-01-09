# Warrior Leaderboard & Ranking System - Implementation Plan

## Phase 1: Database & Backend (THIS PHASE)

### 1. Database Schema

#### Tabel: `user-leaderboard` (Cosmos DB)
```
{
  id: string (userId),
  userId: string,
  email: string,
  userName: string,
  totalPoints: number,
  quizPoints: number,
  consistencyPoints: number,
  communityPoints: number,
  badge: 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor',
  winRate: number (0-100),
  rank: number,
  previousRank: number,
  rankTrend: 'UP' | 'DOWN' | 'STABLE',
  lastUpdated: ISO timestamp,
  updatedAt: ISO timestamp
}
```

#### Tabel: `leaderboard-history` (Weekly snapshot)
```
{
  id: string (week identifier),
  week: number,
  year: number,
  rankings: Array<{
    userId: string,
    rank: number,
    totalPoints: number,
    badge: string
  }>,
  timestamp: ISO timestamp
}
```

### 2. Scoring Formula

**Total Points = Quiz Points + Consistency Points + Community Points**

- **Quiz Points (0-100)**: Average dari semua modul quiz scores
- **Consistency Points**: 5 poin per hari (max 35/minggu) jika menulis jurnal
- **Community Points**: 2 poin per comment/discussion di forum (max 20/minggu)

**Badge System:**
- Recruit: 0-500 pts
- Elite Warrior: 501-1500 pts
- Commander: 1501-3000 pts
- Legendary Mentor: 3001+ pts

### 3. API Endpoints

#### GET `/api/leaderboard`
- Return top 100 users dengan ranking
- Support query params: `limit`, `offset`, `level`
- Cached dengan Redis (1 jam TTL)

#### GET `/api/leaderboard/user/[userId]`
- Return detail user stats + ranking
- Include: rank, points breakdown, radar chart data

#### POST `/api/leaderboard/recalculate`
- Trigger manual recalculation (admin only)
- Rebuild cache

#### GET `/api/leaderboard/history/[week]`
- Return historical ranking untuk week tertentu

### 4. Service Functions (education-service.ts)

- `calculateUserLeaderboardScore(userId)` - Calculate total points
- `updateLeaderboardRanking()` - Update all rankings
- `getUserRankingData(userId)` - Get user stats
- `getLeaderboardTop100()` - Get top 100 with caching
- `getLeaderboardHistory(week)` - Get historical data

### 5. Caching Strategy

- **Cache Key**: `leaderboard:top100:v1`
- **TTL**: 1 hour (3600 seconds)
- **Invalidation**: Manual via POST /api/leaderboard/recalculate
- **Fallback**: Query database if cache miss

---

## Phase 2: Frontend (NEXT)

### Components to Create:
1. `src/app/leaderboard/page.tsx` - Main leaderboard page
2. `src/components/LeaderboardTable.tsx` - Responsive table
3. `src/components/Top3Podium.tsx` - Top 3 display
4. `src/components/SchoolReport.tsx` - User detail report
5. `src/components/RadarChart.tsx` - Radar chart for skills
6. `src/components/ArkaMascotFeedback.tsx` - Mascot reactions

### UI Features:
- Responsive tabel dengan highlight user
- Top 3 dengan avatar besar + mahkota effect
- Mobile card layout
- Ranking history arrows (up/down/stable)
- Arka feedback based on rank change

---

## Status: READY FOR IMPLEMENTATION ✅
