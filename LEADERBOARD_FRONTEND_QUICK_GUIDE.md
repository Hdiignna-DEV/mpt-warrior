# 🎯 LEADERBOARD FRONTEND - QUICK DEVELOPER GUIDE

**Purpose**: Fast reference for building remaining Leaderboard UI components  
**Target Audience**: Frontend developers  
**Created**: January 9, 2026

---

## 📋 COMPONENT CHECKLIST

### Ready to Use (Already Built ✅)

```
✅ RadarChartLeaderboard.tsx
   Location: src/components/RadarChartLeaderboard.tsx
   Import: import { RadarChartLeaderboard } from '@/components/RadarChartLeaderboard'
   
   Usage:
   <RadarChartLeaderboard 
     data={{
       technicalAnalysis: 75,
       riskManagement: 80,
       psychology: 65,
       discipline: 85,
       knowledge: 75
     }}
     userName="Deden"
     size="medium"
     interactive={true}
   />

✅ LeaderboardArkaFeedback.tsx
   Location: src/components/LeaderboardArkaFeedback.tsx
   Import: import { LeaderboardArkaFeedback } from '@/components/LeaderboardArkaFeedback'
   
   Usage:
   <LeaderboardArkaFeedback
     rankChange={3}
     previousRank={12}
     currentRank={9}
     rankTrend="UP"
     consistencyStreak={14}
     showFeedback={true}
   />
```

---

## 🏗️ REMAINING COMPONENTS TO BUILD

### 1. Top3Podium Component
**File**: `src/components/Top3Podium.tsx`

**Props**:
```typescript
interface Top3PodiumProps {
  users: LeaderboardEntry[];  // Top 3 users only
  onProfileClick?: (userId: string) => void;
}
```

**Features**:
- Medal display (👑 🥈 🥉)
- Avatar images with borders
- Level badge prominent
- Rank trend (↑/↓/→)
- Points display
- Win rate
- Click handlers to view profile
- Animated entrance (stagger effect)
- Responsive: Stack vertically on mobile

**Design Reference**:
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

**Key Styling**:
- Rank 1: Gold gradient, large avatar (128px)
- Rank 2: Silver gradient, medium avatar (96px)
- Rank 3: Bronze gradient, medium avatar (96px)
- Shadows & glows for depth
- Animated bounce on load

**Import Examples**:
```typescript
import { ArrowUp, ArrowDown, Trophy, Medal, Crown } from 'lucide-react';
import Image from 'next/image';
```

---

### 2. Enhanced Leaderboard Table
**File**: `src/app/leaderboard/page.tsx` (enhance existing)

**Current State**: Basic table with founder profile

**Enhancements Needed**:

#### Header Section
```typescript
<div className="space-y-4">
  {/* Top 3 Podium */}
  <Top3Podium users={leaderboard.slice(0, 3)} />
  
  {/* Stats Overview */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard label="Total Warriors" value={totalUsers} />
    <StatCard label="Avg Points" value={avgPoints} />
    <StatCard label="Most Active" value={topBadge} />
    <StatCard label="Your Rank" value={userRank || 'N/A'} />
  </div>
  
  {/* Search & Filter */}
  <SearchFilterBar 
    onSearch={handleSearch}
    onFilterChange={handleFilter}
  />
</div>
```

#### Table Structure
```typescript
<table className="w-full">
  <thead>
    <tr>
      <th onClick={() => sort('rank')}>Rank ⬍</th>
      <th onClick={() => sort('name')}>Profile ⬍</th>
      <th onClick={() => sort('badge')}>Level ⬍</th>
      <th onClick={() => sort('points')}>Points ⬍</th>
      <th onClick={() => sort('winRate')}>Win Rate ⬍</th>
      <th>Trend</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {leaderboard.map((entry, idx) => (
      <tr 
        key={entry.userId}
        className={
          entry.userId === currentUserId 
            ? 'bg-orange-500/20 ring-2 ring-orange-500 rounded-lg' 
            : 'hover:bg-gray-800/50'
        }
      >
        {/* Rank column */}
        <td className="py-3 px-4">{entry.rank}</td>
        
        {/* Profile column */}
        <td className="py-3 px-4 flex items-center gap-3">
          <img 
            src={entry.avatar}
            alt={entry.userName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{entry.userName}</p>
            <p className="text-xs text-gray-400">{entry.email}</p>
          </div>
          {entry.userId === currentUserId && (
            <badge className="text-xs bg-orange-500/30">YOU</badge>
          )}
        </td>
        
        {/* Level/Badge column */}
        <td className="py-3 px-4">
          <badge className="px-3 py-1 rounded-full text-sm">
            {entry.badge}
          </badge>
        </td>
        
        {/* Points column */}
        <td className="py-3 px-4 font-bold">{entry.totalPoints}</td>
        
        {/* Win Rate column */}
        <td className="py-3 px-4">{entry.winRate}%</td>
        
        {/* Trend column */}
        <td className="py-3 px-4">
          {entry.rankTrend === 'UP' && <ArrowUp className="text-green-500" />}
          {entry.rankTrend === 'DOWN' && <ArrowDown className="text-red-500" />}
          {entry.rankTrend === 'STABLE' && <MinusIcon className="text-gray-500" />}
        </td>
        
        {/* Action column */}
        <td className="py-3 px-4">
          <button onClick={() => viewSchoolReport(entry.userId)}>
            View Report
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

#### Highlight Current User
```typescript
// Add glow effect
className={
  entry.userId === currentUserId 
    ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-l-4 border-orange-500' 
    : 'border-l-4 border-transparent'
}
```

---

### 3. Mobile Card View
**Location**: Same leaderboard page, conditional rendering

**Responsive Implementation**:
```typescript
{/* Mobile Cards (hidden on md and up) */}
<div className="md:hidden space-y-3">
  {leaderboard.map((entry) => (
    <div 
      key={entry.userId}
      className={`
        p-4 rounded-lg border-2
        ${entry.userId === currentUserId 
          ? 'bg-orange-500/10 border-orange-500' 
          : 'bg-gray-800/50 border-gray-700'
        }
      `}
    >
      {/* Rank & Name */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">#{entry.rank}</span>
          <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <p className="font-semibold text-sm">{entry.userName}</p>
            {entry.userId === currentUserId && <span className="text-xs text-orange-400">YOU</span>}
          </div>
        </div>
        <badge>{entry.badge}</badge>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
        <div>
          <p className="text-gray-400">Points</p>
          <p className="font-bold">{entry.totalPoints}</p>
        </div>
        <div>
          <p className="text-gray-400">Win %</p>
          <p className="font-bold">{entry.winRate}%</p>
        </div>
        <div>
          <p className="text-gray-400">Trend</p>
          <p className="font-bold">
            {entry.rankTrend === 'UP' ? '↑' : entry.rankTrend === 'DOWN' ? '↓' : '→'}
          </p>
        </div>
      </div>
      
      {/* Action */}
      <button 
        onClick={() => viewSchoolReport(entry.userId)}
        className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded text-sm"
      >
        View Profile
      </button>
    </div>
  ))}
</div>

{/* Desktop Table (hidden on mobile) */}
<div className="hidden md:block">
  {/* Table code above */}
</div>
```

---

### 4. School Report Page
**File**: `src/app/school-report/[userId]/page.tsx`

**Route Structure**:
```
/school-report/[userId]          - View any warrior's report (admin)
/school-report/me                - View your own report (user)
```

**Layout Structure**:
```typescript
export default function SchoolReportPage({ params }) {
  const [user, setUser] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [mentorNotes, setMentorNotes] = useState('');
  const [history, setHistory] = useState(null);
  
  useEffect(() => {
    // Fetch user data from /api/leaderboard/user/[userId]
    // Parse and display all sections
  }, [params.userId]);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex justify-between items-start">
        <h1>Warrior School Report</h1>
        <div className="flex gap-2">
          <button>Share</button>
          <button>Export PDF</button>
        </div>
      </header>
      
      {/* Section 1: Profile */}
      <ProfileSection user={user} />
      
      {/* Section 2: Performance Metrics */}
      <MetricsSection 
        totalPoints={user?.totalPoints}
        rank={user?.rank}
        badge={user?.badge}
        quizPoints={user?.quizPoints}
        consistencyPoints={user?.consistencyPoints}
        communityPoints={user?.communityPoints}
        winRate={user?.winRate}
      />
      
      {/* Section 3: Radar Chart */}
      <div className="bg-gray-900 rounded-lg p-6">
        <RadarChartLeaderboard 
          data={radarData}
          userName={user?.userName}
          size="large"
        />
      </div>
      
      {/* Section 4: Mentor Notes */}
      <MentorNotesSection notes={mentorNotes} />
      
      {/* Section 5: Weekly History */}
      <WeeklyHistorySection history={history} />
    </div>
  );
}
```

**Key Sections**:

#### Profile Section
```typescript
<div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
  <div className="flex gap-6 items-center">
    <img src={avatar} alt="" className="w-24 h-24 rounded-full" />
    <div>
      <h2 className="text-3xl font-bold">{userName}</h2>
      <p className="text-gray-300">{email}</p>
      <p className="text-sm text-gray-400">Joined {joinDate}</p>
      <div className="flex gap-4 mt-3">
        <badge className="large">{badge}</badge>
        <badge>Rank #{rank}</badge>
      </div>
    </div>
  </div>
</div>
```

#### Metrics Section
```typescript
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <MetricCard label="Total Points" value={totalPoints} />
  <MetricCard label="Quiz Score" value={quizPoints + '/100'} />
  <MetricCard label="Consistency" value={consistencyPoints + '/35'} />
  <MetricCard label="Win Rate" value={winRate + '%'} />
</div>
```

#### Mentor Notes
```typescript
<div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6">
  <h3>📝 Mentor Assessment</h3>
  <p className="mt-4 whitespace-pre-line text-gray-300">
    {mentorNotes}
  </p>
  <p className="text-xs text-gray-500 mt-4">
    Last Updated: {lastUpdated}
  </p>
</div>
```

#### Weekly History
```typescript
<div className="space-y-3">
  <h3>📊 Performance History (Last 4 Weeks)</h3>
  {history?.map((week) => (
    <div key={week.week} className="flex justify-between items-center p-3 bg-gray-800 rounded">
      <span>Week {week.week} - {week.year}</span>
      <span>Rank #{week.rank}</span>
      <span className="font-bold">{week.totalPoints} pts</span>
    </div>
  ))}
</div>
```

---

## 🎨 STYLING UTILITIES

### Color Scheme
```typescript
// Badge colors by tier
const badgeColors = {
  'Recruit': 'bg-gray-500 text-white',
  'Elite Warrior': 'bg-blue-600 text-white',
  'Commander': 'bg-amber-600 text-white',
  'Legendary Mentor': 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
};

// Trend colors
const trendColors = {
  'UP': 'text-green-400',
  'DOWN': 'text-red-400',
  'STABLE': 'text-gray-400'
};

// Performance colors (radar)
const performanceColors = {
  excellent: '#22c55e',  // Green
  good: '#3b82f6',       // Blue
  fair: '#f59e0b',       // Amber
  poor: '#ef4444'        // Red
};
```

### Tailwind Classes
```typescript
// Glow effect
'shadow-lg shadow-orange-500/50'

// Gradient backgrounds
'bg-gradient-to-r from-blue-900 to-purple-900'

// Responsive grid
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'

// Card styling
'bg-gray-900/50 border border-gray-700/50 rounded-lg p-4'

// Animation
'animate-in fade-in slide-in-from-bottom-4 duration-300'
```

---

## 🔌 API INTEGRATION

### Fetch Leaderboard
```typescript
const fetchLeaderboard = async () => {
  const response = await fetch('/api/leaderboard?limit=100', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.leaderboard;
};
```

### Fetch User Details
```typescript
const fetchUserDetails = async (userId: string) => {
  const response = await fetch(`/api/leaderboard/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.user;
};
```

### Trigger Recalculation (Admin)
```typescript
const recalculateLeaderboard = async () => {
  const response = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const data = await response.json();
  return data;
};
```

---

## 📱 RESPONSIVE BREAKPOINTS

```typescript
// Mobile first approach
xs: 0px
sm: 640px    // Small phones
md: 768px    // Tablets
lg: 1024px   // Desktop
xl: 1280px   // Large desktop

// Example usage
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

---

## ✨ ANIMATIONS

### Entrance Animations
```typescript
// Stagger effect for podium
<div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">

// For list items
{items.map((item, idx) => (
  <div key={idx} style={{ animationDelay: `${idx * 50}ms` }}>
))}
```

### Hover Effects
```typescript
className="hover:bg-gray-700/50 hover:shadow-lg transition-all duration-200 cursor-pointer"

// With scale
className="hover:scale-105 hover:shadow-xl transition-transform duration-200"
```

### Loading States
```typescript
{loading ? (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-800 rounded"></div>
    <div className="h-10 bg-gray-800 rounded"></div>
  </div>
) : (
  // Content
)}
```

---

## 🧪 TESTING CHECKLIST

- [ ] Desktop view loads correctly
- [ ] Mobile view shows cards (not table)
- [ ] Search/filter work
- [ ] Sorting works
- [ ] Current user highlighted
- [ ] Click "View Report" navigates to school report
- [ ] Radar chart displays correctly
- [ ] Mentor notes show
- [ ] Weekly history loads
- [ ] Arka feedback triggers
- [ ] PDF export works
- [ ] Share functionality works
- [ ] Responsive on 320px, 768px, 1024px viewports
- [ ] Images load correctly
- [ ] No console errors
- [ ] Performance: page loads < 2s

---

## 📚 COMPONENT DEPENDENCIES

```typescript
// Required imports
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// UI Components
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Icons
import { ArrowUp, ArrowDown, Trophy, Medal, Crown } from 'lucide-react';

// Our components
import { RadarChartLeaderboard } from '@/components/RadarChartLeaderboard';
import { LeaderboardArkaFeedback } from '@/components/LeaderboardArkaFeedback';
import { Top3Podium } from '@/components/Top3Podium';

// Charts
import { ResponsiveContainer, RadarChart, ... } from 'recharts';
```

---

## 🎯 IMPLEMENTATION PRIORITY

**Priority 1** (Must have):
1. Enhanced Leaderboard Table
2. Mobile Card View
3. Top 3 Podium

**Priority 2** (Should have):
1. School Report Page
2. Arka Feedback Integration
3. Weekly History Trends

**Priority 3** (Nice to have):
1. PDF Export
2. Share functionality
3. Search/Filter enhancements
4. Achievement badges

---

## 📞 QUICK HELP

### Need to show user's rank position?
```typescript
const userRank = leaderboard.find(e => e.userId === currentUserId)?.rank;
```

### Need to highlight current user's row?
```typescript
className={entry.userId === currentUserId ? 'bg-orange-500/20 ring-2 ring-orange-500' : ''}
```

### Need to format large numbers?
```typescript
const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
```

### Need to sort leaderboard?
```typescript
const sorted = [...leaderboard].sort((a, b) => {
  if (sortBy === 'rank') return a.rank - b.rank;
  if (sortBy === 'points') return b.totalPoints - a.totalPoints;
  if (sortBy === 'winRate') return b.winRate - a.winRate;
  return 0;
});
```

---

**Last Updated**: January 9, 2026  
**Status**: Ready for implementation  
**Next Steps**: Build Top3Podium → Enhance Table → School Report
