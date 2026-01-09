# 📋 LEADERBOARD IMPLEMENTATION PLAN
**Status**: In Progress - Detailed Specification Document  
**Date**: January 9, 2026

---

## 📌 OVERVIEW

Implementasi Sistem Ranking & Leaderboard Warrior dengan dual-entry system:
- **Full Leaderboard**: Menu Sidebar + dedicated page `/leaderboard`
- **Dashboard Widget**: Mini preview di dashboard dengan Top 3 + user rank
- **Badge System**: Military-style ranks dengan icons (Recruit → Legendary Mentor)
- **Real-time Updates**: Auto-sync dengan quiz validation
- **Arka Trigger**: Celebration untuk top 10 achievements

---

## 🎯 REQUIREMENTS BREAKDOWN

### 1️⃣ SIDEBAR MENU (Dual-Entry #1)
**Location**: Sidebar navigation  
**Label**: "Warrior Ranking" dengan Trophy icon  
**Icon**: `Trophy` atau `Medal` dari lucide-react  
**Link**: `/leaderboard`  
**Visibility**: All authenticated users  

**Implementation**:
- Add menu item to sidebar component
- Use existing `/leaderboard` page
- Show next to other main menus (Dashboard, Journal, etc.)

### 2️⃣ DASHBOARD WIDGET (Dual-Entry #2)
**Location**: Dashboard page, sisi kanan atau bawah ringkasan P&L  
**Content**:
```
┌─────────────────────────────────┐
│  🏆 WARRIOR RANKING PREVIEW      │
├─────────────────────────────────┤
│                                 │
│  Top 3 Global:                  │
│  👑 #1: [Profile] [Name]        │
│  🥈 #2: [Profile] [Name]        │
│  🥉 #3: [Profile] [Name]        │
│                                 │
│  Your Position: #42              │
│  [View All] button              │
│                                 │
└─────────────────────────────────┘
```

**Features**:
- Show top 3 with profile photos
- Show "Your Rank" if user is WARRIOR
- "View All" button → navigate to `/leaderboard`
- Update on every page load (cached 1 hour)

### 3️⃣ BADGE SYSTEM (Military Ranks)
**Tiers**:
| Tier | Name | Points | Icon | Description |
|------|------|--------|------|-------------|
| 1 | Recruit | 0-500 | 🔷 | One silver line (junior) |
| 2 | Elite Warrior | 501-1500 | ⭐ | Two gold lines (experienced) |
| 3 | Commander | 1501-3000 | ⭐⭐ | One star (leader) |
| 4 | Legendary Mentor | 3001+ | ⭐✨ | Gold star with glow (master) |

**Display Locations**:
- Leaderboard table (next to name)
- Dashboard widget (top 3 badges)
- User profile
- AI Mentor interactions
- Chat messages

### 4️⃣ LEADERBOARD PAGE ENHANCEMENTS
**Existing**: ✅ Table layout, Top 3 podium, founder profile  
**Add**:
- [ ] Search by username
- [ ] Filter by period (Weekly/Monthly/All-time)
- [ ] Badge icons display
- [ ] User highlight with orange glow
- [ ] Responsive mobile cards
- [ ] Period-based data (store in leaderboard-history)

### 5️⃣ REAL-TIME UPDATES
**Trigger Points**:
- User completes quiz → scores calculated → rank updated
- Admin validates essay → points added → rank updated
- Daily consistency check → points awarded → rank updated

**Flow**:
```
Quiz Submitted → Grade Submitted → Points Added
  → calculateUserLeaderboardScore()
  → updateLeaderboardRanking()
  → Cache cleared
  → User sees updated rank
```

### 6️⃣ ARKA CELEBRATION (Top 10)
**Trigger**: User's rank changes to ≤10 or moves UP to higher position  
**Action**: Show Arka mascot with victory pose  
**Message**: 
```
"🎉 Selamat! Kamu sudah masuk Top 10 Warrior Rankings! 
Terus tingkatkan poin untuk naik lebih tinggi lagi!"
```

**Implementation**:
- Check rank change in leaderboard update
- Trigger mascot animation if rank ≤ 10
- Show modal/toast notification
- Display victory.png image

---

## 💻 TECHNICAL IMPLEMENTATION

### Files to Create/Modify

#### 1. Components
- [ ] `components/leaderboard/RankBadge.tsx` - Badge icon component
- [ ] `components/leaderboard/RankingBadges.tsx` - Badge display variations
- [ ] `components/dashboard/WarriorRankingWidget.tsx` - Dashboard widget
- [ ] `components/leaderboard/LeaderboardSearch.tsx` - Search component
- [ ] `components/leaderboard/LeaderboardFilter.tsx` - Filter component

#### 2. Sidebar
- [ ] `components/Sidebar.tsx` - Add "Warrior Ranking" menu item

#### 3. Pages
- [ ] `src/app/leaderboard/page.tsx` - Add search/filter/badges (modify existing)
- [ ] `src/app/dashboard/page.tsx` - Add widget (modify existing)

#### 4. Database/Services
- [ ] `src/lib/db/education-service.ts` - Add filter functions:
  - `getLeaderboardByPeriod(period: 'weekly' | 'monthly' | 'all')`
  - `searchLeaderboard(query: string)`
  - `getUserRankAchievement(userId: string)` - check if top 10

#### 5. API Routes
- [ ] `src/app/api/leaderboard/search` - Search endpoint
- [ ] `src/app/api/leaderboard/filter` - Filter by period
- [ ] `src/app/api/leaderboard/top-3` - Get top 3 (for widget)

#### 6. Assets
- [ ] Badge icons (svg or components)
- [ ] Verify victory.png exists

---

## 📊 DATABASE CHANGES

### Existing Containers
- ✅ `user-leaderboard` (partition: /userId)
- ✅ `leaderboard-history` (partition: /week) - for weekly snapshots

### Fields to Add/Verify
```typescript
// In LeaderboardEntry
badge: 'Recruit' | 'Elite Warrior' | 'Commander' | 'Legendary Mentor'
totalPoints: number
previousRank: number | null
rankTrend: 'UP' | 'DOWN' | 'STABLE'
achievedTop10: boolean // Track if user ever reached top 10
topTenDate: string | null // When first achieved top 10
```

---

## 🎨 UI/UX SPECIFICATIONS

### Badge Display
```
Recruit: 🔷 or [v] silver icon
Elite Warrior: ⭐ or [vv] gold icons  
Commander: ⭐⭐ or [★]
Legendary Mentor: ⭐✨ or [★ with glow]
```

### Leaderboard Highlights
- **Your Rank**: Orange/gold glow background
- **Top 3**: Gold/Silver/Bronze frames
- **Badges**: Display to left or right of name
- **Mobile**: Cards instead of table

### Dashboard Widget
- Compact design
- Profile photos (circular, 40px)
- Clean typography
- "View All" CTA button

---

## ✅ COMPLETION CHECKLIST

- [ ] Sidebar menu item added
- [ ] Dashboard widget created
- [ ] Badge component built
- [ ] Search functionality added
- [ ] Filter by period added
- [ ] Badges display in all locations
- [ ] Mobile responsive verified
- [ ] Arka celebration trigger tested
- [ ] Real-time updates working
- [ ] All pages updated
- [ ] Build passing
- [ ] Git commits pushed
- [ ] Documentation updated

---

## 🚀 EXECUTION ORDER

1. **Phase 1: Components** (Sidebar + Dashboard Widget)
2. **Phase 2: Badge System** (Create & display)
3. **Phase 3: Search & Filter** (Add functionality)
4. **Phase 4: Arka Celebration** (Trigger & animation)
5. **Phase 5: Testing & Polish** (Responsive, performance)
6. **Phase 6: Deploy** (Build, commit, push)

---

## 📝 NOTES FOR DEVELOPER

**Important**:
- Keep leaderboard auto-update (cron job) working
- Don't break existing functionality
- Maintain performance with caching
- Mobile-first responsive design
- Use existing UI components (Card, Badge, Button)
- Keep typography consistent

**Reference**:
- Current leaderboard: `/src/app/leaderboard/page.tsx`
- Education service: `/src/lib/db/education-service.ts`
- Sidebar: Look for navigation component structure
- Dashboard: Find where P&L widget is placed
- Arka mascot: Already exists, check `ArkaMascotFeedback` component

---

**Status**: Ready for implementation  
**Priority**: High (core feature)  
**Estimated Time**: 2-3 days  
**Complexity**: Medium
