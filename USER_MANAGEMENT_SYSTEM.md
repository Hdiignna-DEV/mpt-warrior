# 🛡️ USER MANAGEMENT & PROFILE SYSTEM DOCUMENTATION

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [UI Components](#ui-components)
7. [State Management](#state-management)
8. [Security](#security)
9. [Usage Guide](#usage-guide)
10. [Deployment](#deployment)

---

## 🎯 Overview

The MPT Warrior User Management & Profile System is a comprehensive role-based access control (RBAC) system with three-tier user hierarchy, warrior profiles, badge progression, and referral system.

### Key Features
✅ **3-Tier Role System** (Warrior, Admin, Super Admin)  
✅ **Badge Progression** (Recruit → Warrior → Veteran)  
✅ **Referral System** (LEGACY codes for Veterans)  
✅ **Profile Management** (Avatar, goals, settings)  
✅ **Admin Dashboard** (User management, settings)  
✅ **Real-time Stats** (Win rate, trades, discipline score)  
✅ **Global State** (Zustand for profile sync)

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
├─────────────────────────────────────────────────────┤
│  - Profile Pages (/profile, /profile/edit)          │
│  - Admin Dashboard (/admin-hq/*)                    │
│  - ProfileHeader Component (global)                 │
│  - Zustand Store (userProfileStore)                 │
└──────────────────┬──────────────────────────────────┘
                   │ JWT Token
                   ↓
┌─────────────────────────────────────────────────────┐
│                MIDDLEWARE LAYER                      │
├─────────────────────────────────────────────────────┤
│  - requireAuth()      - Validates JWT               │
│  - requireAdmin()     - Checks ADMIN/SUPER_ADMIN    │
│  - requireSuperAdmin()- Checks SUPER_ADMIN only     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│                  API LAYER                           │
├─────────────────────────────────────────────────────┤
│  /api/profile              - Get/Update profile     │
│  /api/profile/update       - Update profile         │
│  /api/referral/generate-code - Generate LEGACY code │
│  /api/admin/users          - List all users         │
│  /api/admin/approve-user   - Approve pending user   │
│  /api/admin/suspend-user   - Suspend user           │
│  /api/admin/settings       - System settings (SUPER)│
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│             AZURE COSMOS DB LAYER                    │
├─────────────────────────────────────────────────────┤
│  Container: users     (Partition Key: id)           │
│  Container: settings  (System-wide config)          │
│  Container: trades    (User trading data)           │
└─────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Permissions

### 1. WARRIOR (The Fighter)
**Default role for all approved users**

**Access:**
- ✅ Dashboard, Academy, Trading Journal
- ✅ Personal profile & stats
- ✅ AI Mentor, Calculator, Analytics
- ✅ Generate referral codes (VETERAN level only)

**Cannot:**
- ❌ Access Admin Panel
- ❌ Manage other users
- ❌ Change system settings

### 2. ADMIN (The Commander)
**Trusted moderators and managers**

**Access:**
- ✅ All WARRIOR features
- ✅ Admin Dashboard (`/admin-hq`)
- ✅ View all users & their progress
- ✅ Approve/Reject/Suspend users
- ✅ Generate invitation codes
- ✅ View system analytics

**Cannot:**
- ❌ Add/remove other admins
- ❌ Change system settings (e.g., referral discount %)
- ❌ Delete users permanently

### 3. SUPER_ADMIN (The Founder)
**Mas Deden - Full system control**

**Access:**
- ✅ All ADMIN features
- ✅ System Settings Panel (`/admin-hq/settings`)
- ✅ Add/remove admins
- ✅ Configure referral discount %
- ✅ Set badge progression thresholds
- ✅ Enable/disable registration
- ✅ Maintenance mode control
- ✅ Financial reports & growth stats

---

## 💾 Database Schema

### Users Container
```typescript
{
  id: string;                    // Partition key (same as user ID)
  email: string;
  name: string;
  password: string;              // bcrypt hashed
  
  // Warrior Identity
  warriorId: string;             // MPT-YYYY-XXXXX
  displayName?: string;
  avatar?: string;               // Azure Blob Storage URL
  
  // Access Control
  role: 'SUPER_ADMIN' | 'ADMIN' | 'WARRIOR' | 'PENDING';
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  
  // Badge System
  currentBadgeLevel: 'RECRUIT' | 'WARRIOR' | 'VETERAN';
  badges: Badge[];
  disciplineScore: number;       // 0-1000
  
  // Referral System (VETERAN only)
  referralCode?: string;         // LEGACY-XXXXXX
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
    conversionRate: number;
  };
  
  // Profile Settings
  profileSettings: {
    personalGoal?: string;
    tradingStrategy?: 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'POSITION_TRADING';
    preferredTimeframe?: string;
    bio?: string;
    showEmail: boolean;
    showStats: boolean;
    allowReferrals: boolean;
  };
  
  // Stats
  stats: {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPips: number;
  };
  
  // Contact
  whatsapp?: string;
  telegram_id?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  last_login?: Date;
}
```

### Settings Container
```typescript
{
  id: 'system-settings';         // Fixed ID
  referralDiscountPercent: number;      // Default: 20
  maxReferralsPerVeteran: number;       // Default: 50
  minTradesForVeteran: number;          // Default: 100
  minDisciplineScoreForVeteran: number; // Default: 750
  enableRegistration: boolean;          // Default: true
  maintenanceMode: boolean;             // Default: false
  updatedAt: string;
  updatedBy: string;             // Admin email who updated
}
```

---

## 🔌 API Endpoints

### Public Routes
```typescript
POST /api/auth/login           // Login with email/password
POST /api/auth/register        // Register new account (requires invite code)
```

### Protected Routes (requireAuth)
```typescript
GET  /api/profile              // Get current user profile
PUT  /api/profile/update       // Update profile data
POST /api/referral/generate-code // Generate LEGACY code (VETERAN only)
GET  /api/referral/validate    // Validate referral code
```

### Admin Routes (requireAdmin)
```typescript
GET  /api/admin/users          // List all users with filters
POST /api/admin/approve-user   // Approve pending user
POST /api/admin/reject-user    // Reject pending user
POST /api/admin/suspend-user   // Suspend active user
POST /api/admin/generate-codes // Bulk generate invite codes
```

### Super Admin Routes (requireSuperAdmin)
```typescript
GET  /api/admin/settings       // Get system settings
PUT  /api/admin/settings       // Update system settings
POST /api/admin/add-admin      // Add new admin
POST /api/admin/remove-admin   // Remove admin
```

### API Response Format
```typescript
// Success
{
  success: true,
  data: { ... },
  message?: string
}

// Error
{
  error: string,
  details?: any
}
```

---

## 🎨 UI Components

### ProfileHeader
**Location:** `src/components/ProfileHeader.tsx`

Displays user avatar, name, and warrior ID in app header.

```tsx
import { ProfileHeader } from '@/components/ProfileHeader';

// Usage
<ProfileHeader showFullInfo={true} />
```

### ProfileBadge
Compact avatar with badge level indicator for sidebars.

```tsx
import { ProfileBadge } from '@/components/ProfileHeader';

<ProfileBadge onClick={() => router.push('/profile')} />
```

### ProfileStatsCard
Dashboard card showing user stats.

```tsx
import { ProfileStatsCard } from '@/components/ProfileHeader';

<ProfileStatsCard />
```

### BadgeLevelDisplay
Shows badge level with icon and color.

```tsx
import { BadgeLevelDisplay } from '@/components/BadgeSystem';

<BadgeLevelDisplay level="VETERAN" size="sm" />
```

---

## 🗄️ State Management

### Zustand Store
**Location:** `src/stores/userProfileStore.ts`

Global state for user profile data with localStorage persistence.

```typescript
import { useUserProfileStore } from '@/stores/userProfileStore';

function MyComponent() {
  const { profile, loadProfile, updateProfile } = useUserProfileStore();
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  // Access profile data
  console.log(profile?.warriorId);
}
```

### Helper Hooks

```typescript
// Check user role
import { useUserRole } from '@/stores/userProfileStore';

const { isAdmin, isSuperAdmin, canAccessAdmin } = useUserRole();

// Check badge level
import { useBadgeLevel } from '@/stores/userProfileStore';

const { isVeteran, canGenerateReferrals } = useBadgeLevel();

// Check user status
import { useUserStatus } from '@/stores/userProfileStore';

const { isActive, isPending, canAccessPlatform } = useUserStatus();
```

---

## 🔐 Security

### JWT Authentication
- Token stored in `localStorage` as `mpt_token`
- Validated on every API request via middleware
- Expires after 7 days (configurable)
- Contains: `id`, `email`, `role`, `warriorId`

### Password Security
- Bcrypt hashing with salt rounds: 10
- Minimum 8 characters required
- No plain text passwords stored

### Authorization Checks
```typescript
// Middleware checks role before API access
export async function requireAdmin(request, handler) {
  return requireAuth(request, async (req) => {
    if (!hasAdminAccess(req.user.role)) {
      return 403 Forbidden;
    }
    return handler(req);
  });
}
```

### CORS & Rate Limiting
- Vercel edge functions handle CORS
- Rate limiting via Vercel Pro plan
- Consider implementing custom rate limiting for public APIs

---

## 📖 Usage Guide

### For Warriors (Users)

#### View Profile
1. Click on avatar in header
2. Navigate to `/profile`
3. View stats, badges, and referral code (if VETERAN)

#### Edit Profile
1. Go to `/profile`
2. Click "Edit Profile" button
3. Update info and save

#### Generate Referral Code (VETERAN only)
1. Navigate to `/profile`
2. Scroll to Referral section
3. Click "Generate Code"
4. Share LEGACY-XXXXXX code with friends

### For Admins

#### Access Admin Panel
1. Navigate to `/admin-hq`
2. Click "Users" for user management

#### Approve/Reject Users
1. Go to `/admin-hq/users`
2. Filter pending users
3. Click ✅ to approve or ❌ to reject

#### Suspend User
1. Find user in list
2. Click 🚫 suspend button
3. Confirm action

### For Super Admin (Founder)

#### Configure System Settings
1. Navigate to `/admin-hq/settings`
2. Adjust referral discount %
3. Set badge progression thresholds
4. Enable/disable features
5. Save changes

#### Enable Maintenance Mode
1. Go to `/admin-hq/settings`
2. Toggle "Maintenance Mode"
3. All non-admin users will be blocked

---

## 🚀 Deployment

### Environment Variables
```bash
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-key-here
AZURE_COSMOS_DATABASE=MPT

# JWT Secret
JWT_SECRET=your-super-secret-key-change-in-production

# Super Admin Email
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@mpt-warrior.com

# App URL
NEXT_PUBLIC_APP_URL=https://mpt-warrior.vercel.app
```

### Vercel Deployment
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Post-Deployment Checklist
- [ ] Verify all API endpoints work
- [ ] Test authentication flow
- [ ] Check admin access control
- [ ] Validate database connections
- [ ] Test referral code generation
- [ ] Confirm email notifications (if enabled)

---

## 🎓 Best Practices

### For Developers
1. **Always use middleware** for protected routes
2. **Never expose passwords** in API responses
3. **Validate input** on both client and server
4. **Use TypeScript types** from `src/types/index.ts`
5. **Test role-based access** before deployment
6. **Sanitize user data** before storing/displaying

### For Database
1. **Use partition keys efficiently** (id as partition key)
2. **Avoid cross-partition queries** when possible
3. **Implement error handling** for all Cosmos DB calls
4. **Monitor RU consumption** in Azure portal
5. **Backup data regularly** via Azure automation

### For Security
1. **Rotate JWT secrets** periodically
2. **Use HTTPS only** in production
3. **Implement rate limiting** on public APIs
4. **Log security events** (failed logins, suspensions)
5. **Regular security audits** of admin actions

---

## 📞 Support

For issues or questions:
- **Email:** admin@mpt-warrior.com
- **Telegram:** @mptwarrior
- **Documentation:** `/docs/USER_MANAGEMENT_SYSTEM.md`

---

## 📝 Changelog

### v1.0.0 (2026-01-07)
- ✅ Initial implementation
- ✅ 3-tier role system (Warrior/Admin/Super Admin)
- ✅ Badge progression (Recruit/Warrior/Veteran)
- ✅ Referral system with LEGACY codes
- ✅ Profile management with avatar upload
- ✅ Admin dashboard for user management
- ✅ Super Admin settings panel
- ✅ Zustand global state management
- ✅ JWT authentication middleware
- ✅ Complete API endpoints
- ✅ Azure Cosmos DB integration

---

**Built with ❤️ by The MPT Warrior Team**
