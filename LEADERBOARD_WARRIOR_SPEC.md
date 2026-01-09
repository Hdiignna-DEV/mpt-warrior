# 🏆 Warrior Leaderboard & Ranking System - Complete Specification

## Executive Summary

Sistem Leaderboard komprehensif yang mengukur kualitas trader berdasarkan **Mindset, Plan, Execution** (MPT), bukan hanya profit. System ini mendorong pembelajaran berkelanjutan dan disiplin trading melalui kompetisi sehat yang termotivasi.

---

## I. Logika Perhitungan Skor (Grading Formula)

### Point Sources & Weights

```
Total Points = (Quiz Score × 0.40) + (Consistency Score × 0.35) + (Community Score × 0.25)

Max Weekly Points: 100 + 35 + 20 = 155 points
```

#### 1. Quiz Modul (40% weight = 0-100 points)
- **Source**: Average dari semua modul quiz scores
- **Formula**: `(Total Quiz Score / Number of Modules) × 0.40`
- **Examples**:
  - 5 modul selesai: avg 80% = 32 poin
  - 10 modul selesai: avg 90% = 36 poin
  - Belum ada modul: 0 poin

#### 2. Trading Consistency (35% weight = 0-35 points)
- **Source**: Setiap hari menulis Trading Journal (trades + psychology reflection)
- **Formula**: `5 poin per hari × min(days, 7) × 0.35 = max 35 poin/minggu`
- **Calculation Logic**:
  - Track unique days with journal entries (last 7 days)
  - Each day counts once, max 7 days per week
  - 1 entry = 5 points; 7 entries = 35 points
- **Edge Cases**:
  - Multiple entries same day = 1 entry
  - Empty journal for day = 0 points
  - Carry-over: Reset weekly on Sunday midnight

#### 3. Community Engagement (25% weight = 0-20 points)
- **Source**: Keaktifan berdiskusi di modul/forum
- **Formula**: `2 poin per comment × min(comments, 10) × 0.25 = max 20 poin/minggu`
- **Calculation Logic**:
  - Count discussion comments (last 7 days)
  - Quality gate: Comments must be 10+ characters
  - Duplicate/spam filtered out
  - Max 10 meaningful comments per week

---

## II. Badge & Title System

### Rank Tiers (Based on Total Points - Cumulative)

| Tier | Points Range | Color | Icon | Description |
|------|--------------|-------|------|-------------|
| 🥲 Recruit | 0-500 | Gray | Soldier | Pemula yang belajar basics |
| ⚔️ Elite Warrior | 501-1500 | Blue | Swordsman | Trader konsisten dengan mindset solid |
| 🎖️ Commander | 1501-3000 | Gold | Leader | Mentor dengan discipline tinggi & win rate bagus |
| 👑 Legendary Mentor | 3001+ | Platinum | Crown | Master trader - exemplar dari MPT philosophy |

### Special Badges (Achievement Based)
- 🔥 **Consistency King**: 30+ hari journal berturut-turut
- 📚 **Knowledge Master**: Selesai semua modul dengan avg 80%+
- 💬 **Community Champion**: 100+ meaningful comments
- 📈 **Top Performer**: Rank #1-3 selama 2 minggu berturut-turut
- 🏅 **Comeback Warrior**: Naik 20+ rank dalam 1 minggu

---

## III. Desain UI/UX - Leaderboard Table

### Desktop View (Tabel)
```
┌─────────────────────────────────────────────────────────────────────────┐
│ WARRIOR LEADERBOARD RANKINGS                                    🔄 Refresh │
├─────┬──────────────┬────────┬──────────┬───────┬──────────┬────────────┤
│Rank │   Profile    │ Level  │ Points   │ Win % │  Trend   │ Badges     │
├─────┼──────────────┼────────┼──────────┼───────┼──────────┼────────────┤
│ 👑1 │ Avatar Name  │Command │ 2,850 pt │ 78%   │ ↑ +5     │ 🔥 🏅      │
│ 🥈2 │ Avatar Name  │Command │ 2,620 pt │ 75%   │ ↓ -2     │ 🏅        │
│ 🥉3 │ Avatar Name  │Elite   │ 2,100 pt │ 72%   │ → ±0     │ 📈        │
├─────┼──────────────┼────────┼──────────┼───────┼──────────┼────────────┤
│ 4   │ Avatar Name  │Elite   │ 1,850 pt │ 68%   │ ↑ +3     │ 💬        │
│ 5   │ Avatar Name  │Warrior │ 1,620 pt │ 65%   │ → ±0     │           │
│..YOU│ [Your Name]  │Warrior │   950 pt │ 62%   │ ↑ +2     │ 📚        │
│...  │ ...          │ ...    │   ...    │  ...  │   ...    │ ...        │
│100  │ Avatar Name  │Recruit │   120 pt │ 45%   │ ↓ -1     │           │
└─────┴──────────────┴────────┴──────────┴───────┴──────────┴────────────┘

USER DETAIL BREAKDOWN (User's own row - expanded on click/hover)
├─ Quiz Score: 75/100 (30 poin)
├─ Consistency: 6/7 days (30 poin)
├─ Community: 8/10 comments (8 poin)
└─ Weekly Change: +2 rank (from #12 → #10)
```

### Key Features
- **Highlight Current User**: Baris user sendiri punya background glow orange (#FF6B35)
- **Top 3 Podium**: Rank 1-3 dipajang di atas dengan efek khusus
- **Sorting**: Default by Rank, sortable by Points/Level/Win%
- **Pagination**: 20 rows per halaman
- **Search**: Cari user by name
- **Filter**: By Level/Badge

### Mobile View (Card)
```
┌─────────────────────────────────┐
│  #1 👑 Deden (Founder)         │
│  Commander • 2,850 pts          │
│  Win Rate: 78% | Trend: ↑ +5   │
│  [View Profile] [School Report] │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  #2 🥈 Warrior Name             │
│  Commander • 2,620 pts          │
│  Win Rate: 75% | Trend: ↓ -2   │
│  [View Profile]                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  #YOUR_RANK 🔶 YOUR NAME (You) │
│  Elite Warrior • 950 pts        │
│  Win Rate: 62% | Trend: ↑ +2   │
│  [View School Report]           │
│  [Journal] [Profile]            │
└─────────────────────────────────┘
```

---

## IV. Top 3 Podium Section

### Desktop Podium Display
```
                        👑
                      [Avatar]
                    Position #1
                    Name: Deden
                    2,850 pts
                    78% Win Rate
                    
         🥈                      🥉
       [Avatar]                [Avatar]
     Position #2            Position #3
     Name: Warrior          Name: Trader
     2,620 pts              2,100 pts
     75% Win Rate           72% Win Rate
```

### Visual Effects
- **Animations**: Gold particles falling for #1, subtle glow for #2/#3
- **Trophy Icons**: Crown (1), Silver medal (2), Bronze medal (3)
- **Ranking Frame**: Gold/Silver/Bronze border
- **Level Badge**: Display level badge prominently
- **Click Action**: Go to School Report or Profile

---

## V. Maskot Arka - Contextual Feedback

### Integration Points

#### 1. Naik Peringkat (Victory Scenario)
**Trigger**: User's rank decreased (improved) compared to last week
```
Image: commander-arka-victory.png
Message: "Selamat Warrior! 🎉 Anda naik ke peringkat {newRank} besar! 
          Terus pertahankan konsistensi & kedisiplinan!"
Position: Bottom-right corner (floating)
Duration: 5 seconds (auto-hide) or click to dismiss
Sound: Optional victory chime
```

#### 2. Peringkat Turun/Stagnan (Warning Scenario)
**Trigger**: User's rank increased (worsened) or stayed same for 2+ weeks
```
Image: commander-arka-warning.png
Message: "Waspada Warrior! ⚠️ Kompetisi semakin ketat. 
         Peringkat Anda turun ke {newRank}. 
         Review kembali strategimu di modul & tingkatkan 
         konsistensi jurnal trading!"
Position: Bottom-right corner (floating)
Duration: 8 seconds or dismissible
Sound: Optional alert sound
Color Tone: Warm orange/amber background
```

#### 3. Consistency Milestone
**Trigger**: User reaches 7, 14, 30 days consistent journaling
```
Message: "Luar Biasa! 🔥 {days} hari konsisten menulis jurnal! 
         Ini adalah disiplin sejati dari Warrior!"
Animation: Confetti effect + mascot celebration pose
```

### Implementation Details
- **Component**: `LeaderboardArkaFeedback.tsx`
- **State Management**: Show/hide based on rank changes
- **Toast Integration**: Use existing Toast system for consistency
- **Mobile**: Same as desktop (scale appropriately)
- **Accessibility**: Alt text for images, clear messages for screen readers

---

## VI. Weekly History & Trend Indicator

### Weekly Snapshot Feature
```
Current Week:
Rank: #10
Points: 950
Trend: ↑ (up 2 places from last week)

Last Week:
Rank: #12
Points: 870
Points Gained: +80 this week

Trend Calculation:
- Green (↑): Rank improved (number decreased)
- Red (↓): Rank worsened (number increased)  
- Gray (→): Rank unchanged
- Intensity: Based on % change magnitude
```

### Visual Indicators
- **Arrow Color**: Green for up, Red for down, Gray for stable
- **Arrow Size**: Proportional to rank change magnitude
- **Tooltip**: Show full details on hover
  - "Up 3 positions from last week"
  - "Down 1 position from last week"
  - "Stable for 4 weeks"

### Weekly Comparison Data
- Current vs Previous week
- Points gained/lost
- Rank change direction
- Consistency streak
- Best performing week (all-time)

---

## VII. School Report (Rapor Trader) - Detail Page

### URL Structure
```
/school-report/[userId]
/school-report/me (current user's own report)
```

### Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  WARRIOR SCHOOL REPORT                    [Share] [PDF Export]│
├──────────────────────────────────────────────────────────────┤
│
│  👤 PROFILE SECTION
│  ├─ Avatar (Large)
│  ├─ Name, Email, Join Date
│  ├─ Current Rank: #10 Elite Warrior
│  ├─ Total Points: 950
│  └─ Badges: 🔥 📚 💬
│
├──────────────────────────────────────────────────────────────┤
│
│  📊 PERFORMANCE METRICS
│  ├─ Quiz Score: 75/100 (30 poin)
│  ├─ Consistency: 6/7 days (30 poin) 
│  ├─ Community: 8/10 comments (8 poin)
│  ├─ Win Rate: 62%
│  └─ Weekly Trend: ↑ +2 positions
│
├──────────────────────────────────────────────────────────────┤
│
│  🎯 RADAR CHART (5 Dimensions)
│  
│        Technical
│            ◇
│           ╱ ╲
│      Risk   Psychology
│         ╲   ╱
│          ◊
│       Discipline --- Knowledge
│
│  (Interactive - hover to see scores)
│
├──────────────────────────────────────────────────────────────┤
│
│  📝 MENTOR NOTES (from Deden/AI)
│  ├─ Overall Assessment: "Strong consistency in journaling"
│  ├─ Strengths: [Psychology, Discipline]
│  ├─ Areas to Improve: [Technical Analysis]
│  ├─ Recommended Actions:
│  │  1. Focus on Technical Analysis module
│  │  2. Maintain 7-day journal streak
│  │  3. Increase community engagement
│  └─ Last Updated: 2025-01-09
│
├──────────────────────────────────────────────────────────────┤
│
│  📈 WEEKLY HISTORY (Last 4 weeks)
│  ├─ Week 1 (Jan 6): Rank #10, 950 pts
│  ├─ Week 2 (Dec 30): Rank #12, 870 pts ↑
│  ├─ Week 3 (Dec 23): Rank #14, 750 pts ↑
│  └─ Week 4 (Dec 16): Rank #18, 650 pts ↑
│
│  [Show All History]
│
└──────────────────────────────────────────────────────────────┘
```

### Radar Chart Dimensions Calculation

```
DIMENSIONS (Normalized 0-100):

1. Technical Analysis
   = (Quiz Score × 0.8) + (Win Rate × 0.2)
   = (75 × 0.8) + (62 × 0.2) = 60 + 12.4 = 72.4

2. Risk Management  
   = (Consistency Score × 0.9) + (Journal Notes Quality × 0.1)
   = (85 × 0.9) + (70 × 0.1) = 76.5 + 7 = 83.5

3. Psychology
   = Emotional Stability + Discipline
   = Parse from journal sentiment + consistency streak
   = Estimate based on patterns: 65

4. Discipline
   = Consistency Score (directly)
   = 85 (6/7 days = 85%)

5. Knowledge
   = Quiz Score (directly)
   = 75
```

### Data Sources for Mentor Notes
- **AI Analysis**: From AI Mentor chat analysis (stored with trades)
- **Manual Notes**: From admin/mentor dashboard
- **Automatic Suggestions**: Based on radar scores
- **Update Frequency**: Weekly or on-demand

---

## VIII. Backend Architecture

### Database Collections

#### 1. `user-leaderboard` Container
```typescript
{
  id: string;                    // userId (partition key)
  userId: string;                // User ID
  email: string;                 // User email (for search)
  userName: string;              // Display name
  
  // Scoring Components
  totalPoints: number;           // Sum of all point sources
  quizPoints: number;            // 0-100 (weighted 40%)
  consistencyPoints: number;     // 0-35 (weighted 35%)  
  communityPoints: number;       // 0-20 (weighted 25%)
  
  // Ranking
  badge: string;                 // Recruit|Elite Warrior|Commander|Legendary Mentor
  winRate: number;               // Calculated win % from trades
  rank: number;                  // Current rank (1-N)
  previousRank: number | null;   // Rank from previous week
  rankTrend: 'UP' | 'DOWN' | 'STABLE';
  
  // Metadata
  lastUpdated: string;           // ISO timestamp
  updatedAt: string;             // ISO timestamp
  radarChartData?: {
    technicalAnalysis: number;
    riskManagement: number;
    psychology: number;
    discipline: number;
    knowledge: number;
  };
  
  // Achievement Tracking
  achievements: {
    consistencyStreak: number;   // Days
    totalComments: number;       // Lifetime
    modulesCompleted: number;    // Count
  };
}
```

#### 2. `leaderboard-history` Container (Weekly Snapshots)
```typescript
{
  id: string;                    // Format: "2025-w02" (partition key)
  week: number;                  // Week number (1-52)
  year: number;                  // Year (2025)
  
  rankings: Array<{
    userId: string;
    userName: string;
    rank: number;
    totalPoints: number;
    badge: string;
    quizPoints: number;
    consistencyPoints: number;
    communityPoints: number;
  }>;
  
  timestamp: string;             // ISO timestamp
}
```

### API Endpoints

#### GET `/api/leaderboard`
```
Query Params:
  - limit: number (default: 100, max: 500)
  - offset: number (default: 0)
  - level: string (optional: Recruit|Elite Warrior|Commander|Legendary Mentor)
  - search: string (optional: search by name)
  - sortBy: string (default: rank, options: rank|points|winRate)

Response:
{
  success: boolean;
  leaderboard: LeaderboardEntry[];
  total: number;
  cached: boolean;
  timestamp: ISO;
}

Caching:
  - Redis cache key: "leaderboard:top100:v1"
  - TTL: 3600 seconds (1 hour)
  - Invalidated on: POST /api/leaderboard (manual recalc)
```

#### GET `/api/leaderboard/user/[userId]`
```
Response:
{
  success: boolean;
  user: {
    userId: string;
    userName: string;
    email: string;
    
    // Current Stats
    totalPoints: number;
    rank: number;
    badge: string;
    quizPoints: number;
    consistencyPoints: number;
    communityPoints: number;
    winRate: number;
    
    // Radar Data
    radarChartData: {
      technicalAnalysis: number;
      riskManagement: number;
      psychology: number;
      discipline: number;
      knowledge: number;
    };
    
    // Trend
    previousRank: number | null;
    rankTrend: 'UP' | 'DOWN' | 'STABLE';
    
    // History
    weeklyHistory: Array<{
      week: number;
      rank: number;
      points: number;
    }>;
    
    // Notes
    mentorNotes: string | null;
  };
}
```

#### GET `/api/leaderboard/history/[week]`
```
Query Params:
  - year: number (default: current year)

Response:
{
  success: boolean;
  history: {
    week: number;
    year: number;
    rankings: Array<{...}>;
    timestamp: ISO;
  };
}
```

#### POST `/api/leaderboard/recalculate`
```
Auth: Super Admin only

Body: (optional)
{
  userId?: string;   // Recalc specific user (admin only)
  force?: boolean;   // Force even if recently updated
}

Response:
{
  success: boolean;
  message: string;
  usersUpdated: number;
  cacheCleared: boolean;
  timestamp: ISO;
}

Side Effects:
  - Updates all user-leaderboard entries
  - Clears Redis cache
  - Logs audit trail
```

#### POST `/api/leaderboard/snapshot`
```
Auth: Super Admin only (or scheduled job)

Body: (optional)
{
  week?: number;
  year?: number;
}

Response:
{
  success: boolean;
  message: string;
  snapshotId: string;
  timestamp: ISO;
}

Side Effects:
  - Creates leaderboard-history entry for week
  - Preserves historical rankings
```

### Service Functions (education-service.ts)

```typescript
// Calculate total points for a user
calculateUserLeaderboardScore(userId: string): Promise<{
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  totalPoints: number;
  winRate: number;
}>

// Update rankings for all users
updateLeaderboardRanking(): Promise<void>

// Get top N users
getLeaderboardTop(limit: number, offset: number): Promise<LeaderboardEntry[]>

// Get user's complete ranking data
getUserLeaderboardData(userId: string): Promise<UserRankingData | null>

// Get badge from points
getBadgeFromPoints(points: number): Badge

// Save weekly snapshot
saveLeaderboardSnapshot(): Promise<void>

// Get historical ranking for week
getLeaderboardHistory(week: number, year?: number): Promise<HistorySnapshot | null>

// Calculate radar chart data
calculateRadarChartData(userId: string): Promise<RadarData>

// Get mentor notes for user
getMentorNotes(userId: string): Promise<string | null>
```

---

## IX. Frontend Components

### 1. Leaderboard Page (`src/app/leaderboard/page.tsx`)
- Main leaderboard view
- Display Top 3 Podium
- Display Leaderboard Table
- Search & Filter
- User's position highlight
- Arka feedback integration

### 2. LeaderboardTable Component (`src/components/LeaderboardTable.tsx`)
- Responsive table (desktop) / cards (mobile)
- Sortable columns
- Pagination
- Highlight current user
- Click to view School Report

### 3. Top3Podium Component (`src/components/Top3Podium.tsx`)
- Top 3 display with animations
- Gold/silver/bronze styling
- Click to view profiles
- Rank trend indicators

### 4. School Report Page (`src/app/school-report/[userId]/page.tsx`)
- User profile section
- Performance metrics
- Radar chart visualization
- Mentor notes
- Weekly history
- Export to PDF option

### 5. RadarChart Component (`src/components/RadarChart.tsx`)
- 5-dimensional radar visualization
- Interactive tooltips
- Legend
- Responsive sizing
- Color-coded dimensions

### 6. Arka Feedback Component (`src/components/LeaderboardArkaFeedback.tsx`)
- Victory notification with mascot
- Warning notification with mascot
- Milestone notifications
- Smooth animations
- Mobile responsive

---

## X. Automated Scoring Job

### Cron Configuration
```
Schedule: Every day at 00:00 UTC (adjustable)
Or: Every hour (for real-time updates)

Task: POST /api/leaderboard/recalculate
- No auth needed (internal scheduler)
- Recalculates all users' scores
- Saves weekly snapshot on Sundays
- Sends notifications on rank changes
```

### Implementation Options
1. **Vercel Cron**: Using `cron` package in Next.js
2. **External Service**: EasyCron, AWS Lambda
3. **Background Job**: Bull queue with Redis

---

## XI. Performance Optimization

### Caching Strategy
- **Redis Cache**: Top 100 leaderboard (1 hour TTL)
- **Browser Cache**: Leaderboard component (5 minutes)
- **Invalidation**: On-demand via POST recalculate

### Database Optimization
- Partition key: `/id` (userId) on user-leaderboard
- Index on `rank` and `totalPoints` for sorting
- Query optimization: Use offset+limit for pagination
- Avoid N+1 queries: Batch user fetches

### Query Optimization
```sql
-- Efficient: Get top 20 with single query
SELECT * FROM c ORDER BY c.rank ASC LIMIT 20

-- Inefficient: Loop through all users
SELECT * FROM c (then sort in app)
```

---

## XII. Gamification Elements

### Motivation Systems
1. **Visual Ranking**: Clear position in hierarchy
2. **Badge Collection**: Visible achievement symbols
3. **Trend Indicators**: See weekly progress
4. **Mentor Feedback**: Personalized guidance
5. **Milestone Celebrations**: Arka mascot celebrations
6. **Community Recognition**: See peers' progress

### Competitive Elements
- Top 3 podium display
- Rank trending
- Weekly changes
- Achievement showcase
- Leaderboard comparison

---

## XIII. Security & Access Control

### Authentication
- Verify JWT token on all endpoints
- Check user role (WARRIOR/ADMIN/SUPER_ADMIN)

### Authorization
- **View Leaderboard**: All authenticated users (filters WARRIOR role users)
- **View Own School Report**: User or Admin
- **View Others' School Report**: Admin/Super Admin (or owner)
- **Recalculate**: Super Admin only
- **Export Data**: Admin only

### Data Privacy
- Don't expose personal data in list view (only name/email with consent)
- School Report accessible only to self/admins
- Historical data preserved but aggregated for privacy

---

## XIV. Testing Checklist

### Unit Tests
- ✅ `calculateUserLeaderboardScore()` with various inputs
- ✅ `getBadgeFromPoints()` for all tier boundaries
- ✅ `updateLeaderboardRanking()` sort accuracy
- ✅ Radar chart calculations

### Integration Tests
- ✅ Full leaderboard recalculation flow
- ✅ Cache invalidation on update
- ✅ Weekly snapshot creation
- ✅ API response formats

### E2E Tests
- ✅ User views leaderboard
- ✅ User finds themselves in list
- ✅ User clicks to view School Report
- ✅ User sees radar chart correctly
- ✅ Admin triggers recalculation
- ✅ Rank changes trigger Arka feedback

### Performance Tests
- ✅ Leaderboard loads < 2s for 1000+ users
- ✅ Redis cache hit rate > 90%
- ✅ Radar chart renders smoothly on mobile
- ✅ Pagination handles large datasets

---

## XV. Rollout Plan

### Phase 1: Backend (Week 1)
- ✅ Verify database schema
- ✅ Implement scoring functions
- ✅ Setup caching
- ✅ Create API endpoints
- ✅ Deploy to staging

### Phase 2: Frontend (Week 2)
- ⏳ Leaderboard page
- ⏳ Components (Table, Podium, Radar)
- ⏳ School Report page
- ⏳ Arka integration
- ⏳ Mobile responsiveness

### Phase 3: Testing & Refinement (Week 3)
- ⏳ Full testing suite
- ⏳ Performance optimization
- ⏳ Bug fixes
- ⏳ User feedback incorporation

### Phase 4: Launch (Week 4)
- ⏳ Production deployment
- ⏳ Monitoring setup
- ⏳ Documentation
- ⏳ User communication

---

## XVI. Key Metrics & Monitoring

### Success Metrics
- Leaderboard page load time: < 2 seconds
- User engagement: 80%+ of warriors check leaderboard weekly
- Motivation impact: 40%+ increase in journal entries
- Cache hit rate: > 90%

### Monitoring
- API response times
- Cache performance
- Database query times
- Error rates
- User engagement (analytics)

---

## XVII. Future Enhancements

- Real-time leaderboard updates (WebSocket)
- Advanced filtering (time range, level, badges)
- Export leaderboard to CSV/PDF
- Leaderboard comparisons (clans/groups)
- Seasonal leaderboards (monthly/yearly)
- Leaderboard achievements (best week ever, etc.)
- Social features (follow, chat with peers)
- Mobile app integration
- GraphQL API alternative
- Advanced analytics dashboard for admins

