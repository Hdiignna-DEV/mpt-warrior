# Warrior Profile System

## 📋 Overview

The Warrior Profile System adalah sistem identitas pengguna komprehensif yang terbagi dalam 3 tingkatan akses (Role) untuk mengelola data, progres edukasi, dan hak akses fitur aplikasi MPT Warrior.

## 🎯 Key Features

- **3-Tier Role System**: USER, ADMIN, SUPER_ADMIN
- **Warrior ID**: Format MPT-YYYY-XXXXX (unique identifier)
- **Badge Progression**: 3 levels (Recruit, Warrior, Veteran) × 6 badge types
- **Discipline Score**: 0-1000 points dengan auto-tracking per trade
- **Referral System**: LEGACY-XXXXXX codes untuk Veterans
- **Admin Dashboard**: User management, invitation control, global settings
- **Global State Management**: React Context API untuk akses user data di semua komponen

---

## 🏗️ Architecture

### Database Schema (Azure Cosmos DB)

#### 1. Users Container (Extended)
```typescript
{
  id: string;
  email: string;
  name: string;
  displayName?: string;
  avatar?: string;
  
  // Warrior Profile Fields
  warriorId: string;              // MPT-2025-12345
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  currentBadgeLevel: 'RECRUIT' | 'WARRIOR' | 'VETERAN';
  badges: Badge[];
  disciplineScore: number;        // 0-1000
  
  profileSettings: {
    personalGoal: string;
    tradingStrategy: 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'POSITION_TRADING';
    preferredTimeframe: string;   // e.g., "1H", "4H", "1D"
    bio: string;
  };
  
  // Referral System
  referralCode?: string;          // LEGACY-123456 (only for Veterans)
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    successfulReferrals: number;
  };
  
  stats: {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    activeDays: number;
  };
  
  onboardingCompleted: boolean;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Referrals Container
```typescript
{
  id: string;                     // Auto-generated
  referralCode: string;           // LEGACY-123456
  referrerId: string;             // User ID who owns the code
  referredUserId?: string;        // User ID who used the code
  status: 'available' | 'used';
  discountPercentage: number;     // From global settings
  usedAt?: string;
  createdAt: string;
}
```

#### 3. Discipline Logs Container
```typescript
{
  id: string;
  userId: string;
  tradeId?: string;
  action: string;                 // e.g., "FOLLOWED_STRATEGY", "REVENGE_TRADE"
  points: number;                 // Positive or negative
  reason: string;
  timestamp: string;
}
```

#### 4. Global Settings Container
```typescript
{
  id: 'global-settings';
  referralDiscount: number;       // Flat discount % (0-100)
  maxReferralsPerUser: number;
  systemAnnouncement: string;
  maintenanceMode: boolean;
  updatedAt: string;
}
```

#### 5. Invitation Codes Container
```typescript
{
  id: string;
  code: string;                   // XXXX-XXXX-XXXX format
  role: 'USER' | 'ADMIN';
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  description?: string;
  createdBy: string;              // Admin user ID
  createdAt: string;
}
```

---

## 👥 Role Hierarchy

### 1. USER (Default)
**Capabilities:**
- Access all trading features (dashboard, journal, calculator, AI mentor)
- View own profile and stats
- Earn badges and discipline points
- Generate referral codes (when reaching Veteran level)
- Edit own profile

**Restrictions:**
- Cannot access admin pages
- Cannot manage other users
- Cannot modify global settings

### 2. ADMIN
**Capabilities:**
- All USER capabilities
- Access `/admin-hq` dashboard
- View and manage all users
- Generate and manage invitation codes
- Export user data (CSV)

**Restrictions:**
- Cannot modify global settings
- Cannot access super admin settings

### 3. SUPER_ADMIN
**Capabilities:**
- All ADMIN capabilities
- Access `/admin-hq/settings`
- Modify global settings (referral discount, announcements)
- Enable/disable maintenance mode
- Promote/demote user roles

---

## 🏅 Badge System

### Badge Levels
- **RECRUIT**: Starting level (all new users)
- **WARRIOR**: Intermediate level (earned through progress)
- **VETERAN**: Expert level (highest achievement)

### Badge Types & Earning Criteria

#### 1. First Blood (⚔️)
**Purpose:** Winning trades achievement
- **Recruit → Warrior**: 10 winning trades
- **Warrior → Veteran**: 100 winning trades

#### 2. Consistent Warrior (🔥)
**Purpose:** Trading consistency
- **Recruit → Warrior**: 30 active trading days
- **Warrior → Veteran**: 90 active trading days

#### 3. Discipline Master (🎯)
**Purpose:** Discipline score achievement
- **Recruit → Warrior**: 600 discipline points
- **Warrior → Veteran**: 850 discipline points

#### 4. Profit Master (💰)
**Purpose:** Total profit milestone
- **Recruit → Warrior**: $5,000 total profit
- **Warrior → Veteran**: $25,000 total profit

#### 5. Educator (📚)
**Purpose:** Academy module completion
- **Recruit → Warrior**: 5 modules completed
- **Warrior → Veteran**: 15 modules completed

#### 6. Legacy Builder (👥)
**Purpose:** Successful referrals
- **Recruit → Warrior**: N/A
- **Warrior → Veteran**: 10 successful referrals

### Overall Badge Level
User's `currentBadgeLevel` upgrades when **ALL** individual badges reach that level:
- All badges at Warrior → User becomes WARRIOR
- All badges at Veteran → User becomes VETERAN

---

## 📊 Discipline Score Algorithm

### Score Range
- **Minimum**: 0 points
- **Maximum**: 1000 points
- **Starting**: 500 points (after onboarding)

### Point System

#### Positive Actions
| Action | Points | Trigger |
|--------|--------|---------|
| Followed Strategy | +5 | Trade marked with "followed strategy" |
| Logged Trade with Notes | +3 | Trade has detailed journal entry |

#### Negative Actions (Auto-detected)
| Action | Points | Detection Logic |
|--------|--------|-----------------|
| Revenge Trade | -10 | Trade within 15 min of loss |
| Overtrading | -5 | More than 5 trades in 1 day |
| No Stop Loss | -8 | Trade without SL defined |
| Exceeded Risk | -6 | Risk > 2% of account |

### Auto-Tracking Flow
1. User closes a trade
2. System calls `/api/discipline/analyze-trade`
3. Algorithm checks for violations
4. Discipline score updated automatically
5. Badge progress updated
6. Notifications triggered if milestones reached

---

## 🔗 Referral System

### Referral Code Generation
- **Eligibility**: Only VETERAN level users
- **Format**: `LEGACY-XXXXXX` (6 random digits)
- **Limit**: Based on `maxReferralsPerUser` global setting

### Workflow
1. Veteran user requests code via `/api/referral/generate-code`
2. System generates unique code
3. Code stored in `referrals` container with status `available`
4. Veteran shares code with new users
5. New user enters code during registration
6. System validates via `/api/referral/validate`
7. Discount applied from global settings
8. Code marked as `used`
9. Referrer's stats updated
10. Notification sent to referrer

### Discount Configuration
- Flat percentage discount (0-100%)
- Configured in Super Admin Settings
- Applied uniformly to all referral codes

---

## 🛡️ Route Protection

### Middleware (`middleware.ts`)

#### Public Routes (No Auth Required)
- `/` (Landing page)
- `/login`
- `/register`
- `/pending-approval`
- `/access-denied`

#### Protected Routes (Auth Required)
- `/dashboard`
- `/ai-mentor`
- `/journal`
- `/calculator`
- `/achievements`
- `/analytics`
- `/tutorial`
- `/profile`
- `/profile/edit`
- `/onboarding`

#### Admin Routes (ADMIN or SUPER_ADMIN)
- `/admin-hq/*` (all admin pages)

#### Super Admin Routes (SUPER_ADMIN Only)
- `/admin-hq/settings`

### API Route Protection

All API routes use middleware from `lib/middleware/role-check.ts`:

```typescript
// Require authentication
await requireAuth(req);

// Require admin role
await requireAdmin(req);

// Require super admin role
await requireSuperAdmin(req);

// Require ownership or admin
await requireOwnershipOrAdmin(req, resourceOwnerId);
```

---

## 🌐 Global State Management

### UserContext

Located in `src/contexts/UserContext.tsx`:

```typescript
interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}
```

### Usage in Components

```typescript
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { user, refreshUser } = useUser();
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Warrior ID: {user.warriorId}</p>
      <p>Discipline Score: {user.disciplineScore}</p>
    </div>
  );
}
```

### Auto-Loading
- UserProvider wraps entire app in `layout.tsx`
- Profile loaded from `/api/profile` on mount
- Token from localStorage used for authentication

---

## 🚀 Onboarding Flow

### Steps

#### Step 1: Avatar Upload
- User uploads profile photo
- Image validated (max 5MB, image formats only)
- Converted to base64 for storage

#### Step 2: Personal Goal
- User sets trading goal (motivational)
- Optional step (can skip)

#### Step 3: Trading Preferences
- Select strategy: Scalping, Day Trading, Swing Trading, Position Trading
- Set preferred timeframe (e.g., 1H, 4H, 1D)

#### Step 4: Complete
- System calls `/api/onboarding/complete`
- Actions performed:
  1. Generate Warrior ID (MPT-YYYY-XXXXX)
  2. Assign all badges at RECRUIT level
  3. Set discipline score to 500
  4. Mark `onboardingCompleted: true`
  5. Redirect to dashboard

---

## 🔔 Achievement Notifications

### Notification Service (`lib/notifications.ts`)

#### Triggers

1. **Badge Upgrade**
   - Toast: "⚔️ Badge Upgraded! First Blood → WARRIOR"
   - Triggered after trade analysis

2. **Discipline Milestone**
   - Milestones: 100, 250, 500, 750, 850, 1000
   - Toast: "⭐ Discipline Milestone! Reached 750 points"

3. **Overall Level Up**
   - Toast: "👑 VETERAN ACHIEVED! You've been promoted to VETERAN"
   - Triggered when all badges reach Veteran level

4. **Referral Success**
   - Toast: "🎉 Referral Success! John Doe joined using your code"
   - Triggered when referral code is used

### Integration with Trade Flow

```typescript
import { processTrade } from '@/lib/notifications';

// After closing a trade
await processTrade(trade, userId);
// This will:
// 1. Analyze trade for discipline violations
// 2. Update discipline score
// 3. Check badge progress
// 4. Trigger notifications
```

---

## 📡 API Endpoints

### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile/update` - Update profile fields

### Onboarding
- `POST /api/onboarding/complete` - Complete onboarding flow

### Discipline System
- `POST /api/discipline/analyze-trade` - Analyze trade and update score

### Referral System
- `GET /api/referral/generate-code` - Get referral stats
- `POST /api/referral/generate-code` - Generate new code (Veteran only)
- `POST /api/referral/validate` - Validate code during registration
- `PUT /api/referral/validate` - Mark code as used

### Admin - User Management
- `GET /api/admin/users` - Get all users (Admin only)

### Admin - Invitations
- `GET /api/admin/invitations` - Get all invitation codes
- `POST /api/admin/invitations/generate` - Bulk generate codes
- `PATCH /api/admin/invitations/[id]` - Toggle code active status

### Admin - Settings
- `GET /api/admin/settings` - Get global settings
- `PUT /api/admin/settings` - Update global settings (Super Admin only)

---

## 🎨 UI Components

### Badge System Components

Located in `src/components/BadgeSystem.tsx`:

#### 1. BadgeDisplay
Shows single badge with icon, gradient, progress bar
```tsx
<BadgeDisplay
  type="FIRST_BLOOD"
  level="WARRIOR"
  progress={15}
  maxProgress={100}
/>
```

#### 2. BadgeLevelDisplay
Shows overall badge level pill
```tsx
<BadgeLevelDisplay level="VETERAN" />
```

#### 3. BadgeGrid
Grid layout for all 6 badges
```tsx
<BadgeGrid badges={user.badges} />
```

### Pages

#### Profile Page (`/profile`)
- Avatar header with Warrior ID
- 3 stat cards (Win Rate, Total Trades, Discipline Score)
- Badge grid showing all 6 badges
- Referral box (Veteran only)
- Personal goal display

#### Profile Edit Page (`/profile/edit`)
- Avatar upload
- Display name input
- Bio textarea
- Trading strategy selector
- Preferred timeframe input
- Personal goal textarea

#### Onboarding Page (`/onboarding`)
- Multi-step wizard (3 steps)
- Progress indicator
- Avatar upload
- Goal setting
- Strategy selection

#### Admin - Users Page (`/admin-hq/users`)
- User table with search
- Filters: role, badge level, status
- Displays: Warrior ID, email, role, badge level, stats, discipline score
- Actions: View, Edit, More options

#### Admin - Invitations Page (`/admin-hq/invitations`)
- Bulk code generator (1-100 codes)
- Role selector (USER/ADMIN)
- CSV export
- Stats cards
- Table with toggle active/inactive

#### Admin - Settings Page (`/admin-hq/settings`)
- Referral discount slider (0-100%)
- Max referrals per user
- System announcement textarea with preview
- Maintenance mode toggle
- Content manager (placeholder)

---

## 🧪 Testing Guidelines

### Role-Based Access Testing

#### Test Scenario 1: USER Access
1. Login as USER
2. Try accessing `/admin-hq` → Should redirect to `/access-denied`
3. Access `/dashboard` → Should work
4. Access `/profile` → Should work

#### Test Scenario 2: ADMIN Access
1. Login as ADMIN
2. Access `/admin-hq` → Should work
3. Access `/admin-hq/users` → Should work
4. Access `/admin-hq/settings` → Should redirect to `/access-denied`

#### Test Scenario 3: SUPER_ADMIN Access
1. Login as SUPER_ADMIN
2. Access all routes → All should work
3. Modify global settings → Should persist

### Badge Progression Testing

1. Create test user
2. Add 10 winning trades → First Blood should upgrade to WARRIOR
3. Add 90 more winning trades → First Blood should upgrade to VETERAN
4. Verify notifications appear

### Discipline Score Testing

1. Close trade with no stop loss → Score should decrease by 8
2. Close trade after following strategy → Score should increase by 5
3. Make 6 trades in 1 day → Last trade should deduct 5 points (overtrading)
4. Verify score never goes below 0 or above 1000

---

## 📝 Developer Notes

### Database Initialization

Run migration script to create containers:
```bash
npm run init:profile-system
```

This creates:
- `referrals` container
- `discipline-logs` container
- `global-settings` container
- `invitation-codes` container

### Azure Cosmos DB Best Practices

1. **Partition Key**: Use `userId` for user-scoped data
2. **Hierarchical Partition Keys**: For referrals use `/referrerId/{referrerId}/referralCode/{referralCode}`
3. **Indexing**: Enable automatic indexing for query performance
4. **TTL**: Not used (keep all historical data)

### Future Enhancements

1. **Badge Progress API**: Real-time badge progress tracking
2. **Leaderboard**: Top warriors by discipline score
3. **Achievement History**: Timeline of all earned badges
4. **Referral Dashboard**: Detailed stats for referrers
5. **Mobile App Integration**: Sync profile across platforms

---

## 🐛 Troubleshooting

### Issue: User not redirected after onboarding
**Solution**: Check `onboardingCompleted` flag in user document

### Issue: Badge not upgrading after meeting criteria
**Solution**: Verify `/api/discipline/analyze-trade` is called after trade closure

### Issue: Referral code not validating
**Solution**: Check code status in `referrals` container, ensure `status: 'available'`

### Issue: Admin routes accessible to USER
**Solution**: Verify middleware.ts has correct role checks

---

## 📚 References

- [Azure Cosmos DB Documentation](https://learn.microsoft.com/azure/cosmos-db/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Last Updated**: 2025-01-07  
**Version**: 1.0  
**Maintained by**: MPT Warrior Team
