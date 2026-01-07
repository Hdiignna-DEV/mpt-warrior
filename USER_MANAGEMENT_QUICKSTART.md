# 🚀 USER MANAGEMENT QUICK START GUIDE

## ⚡ Quick Setup (5 Minutes)

### 1. Environment Variables
Add to your `.env.local`:

```bash
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-primary-key
AZURE_COSMOS_DATABASE=MPT

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-key-min-32-chars-long

# Super Admin Email
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@mpt-warrior.com
```

### 2. Install Dependencies
```bash
npm install zustand
```

### 3. Database Initialization
Run this script to create required containers and settings:

```bash
# Create users, settings, and codes containers
npm run db:init

# OR manually create via Azure Portal:
# - Container: users (partition key: /id)
# - Container: settings (partition key: /id)
# - Container: codes (partition key: /code)
```

### 4. Create First Super Admin
Register via `/register` then manually update role in Cosmos DB:

```sql
-- In Azure Cosmos DB Data Explorer
UPDATE c 
SET c.role = "SUPER_ADMIN", c.status = "active" 
WHERE c.email = "admin@mpt-warrior.com"
```

### 5. Test Authentication
```bash
npm run dev

# Navigate to:
# http://localhost:3000/login
# http://localhost:3000/register
```

---

## 🎯 Feature Testing Checklist

### ✅ User Registration & Login
- [ ] Register new account with invite code
- [ ] Login with email/password
- [ ] JWT token stored in localStorage
- [ ] Auto-redirect to dashboard on success

### ✅ Profile System
- [ ] View profile at `/profile`
- [ ] Edit profile at `/profile/edit`
- [ ] Upload avatar image
- [ ] Update personal goal
- [ ] Save trading strategy
- [ ] Profile appears in header

### ✅ Badge Progression
- [ ] New users start as RECRUIT
- [ ] Badge level displays correctly
- [ ] Discipline score updates
- [ ] Badges unlock on achievements

### ✅ Referral System (VETERAN only)
- [ ] Generate LEGACY code button appears
- [ ] Code is unique (LEGACY-XXXXXX)
- [ ] Copy code to clipboard works
- [ ] Referral stats display
- [ ] Discount applies on registration

### ✅ Admin Dashboard
- [ ] Access `/admin-hq/users` (ADMIN+ only)
- [ ] View all users table
- [ ] Filter by role/status
- [ ] Search by name/email
- [ ] Approve pending users
- [ ] Suspend active users
- [ ] Export CSV works

### ✅ Super Admin Settings
- [ ] Access `/admin-hq/settings` (SUPER_ADMIN only)
- [ ] Change referral discount %
- [ ] Update badge thresholds
- [ ] Toggle registration on/off
- [ ] Enable maintenance mode
- [ ] Settings persist in DB

### ✅ Authorization
- [ ] Warriors cannot access `/admin-hq`
- [ ] Admins cannot access `/admin-hq/settings`
- [ ] Suspended users redirected to `/access-denied`
- [ ] Pending users see `/pending-approval`
- [ ] API returns 403 for unauthorized access

### ✅ State Management
- [ ] Profile loads on app start
- [ ] Avatar shows in all pages
- [ ] Warrior ID displays correctly
- [ ] Role badge appears for admins
- [ ] Stats update in real-time

---

## 🔧 Common Issues & Solutions

### Issue: "Failed to load profile"
**Solution:**
```typescript
// Check if Cosmos DB credentials are correct
console.log('Cosmos Endpoint:', process.env.AZURE_COSMOS_ENDPOINT);
console.log('Database:', process.env.AZURE_COSMOS_DATABASE);

// Verify token exists
const token = localStorage.getItem('mpt_token');
console.log('Token:', token ? 'Exists' : 'Missing');
```

### Issue: "Admin access required"
**Solution:**
```sql
-- Update user role in Cosmos DB
UPDATE c SET c.role = "ADMIN" WHERE c.id = "user-id-here"
```

### Issue: "Cannot generate referral code"
**Solution:**
```sql
-- Update badge level to VETERAN
UPDATE c SET c.currentBadgeLevel = "VETERAN" WHERE c.id = "user-id-here"
```

### Issue: Profile not showing in header
**Solution:**
```typescript
// Force reload profile in any component
import { useUserProfileStore } from '@/stores/userProfileStore';

const { refreshProfile } = useUserProfileStore();
useEffect(() => {
  refreshProfile();
}, []);
```

---

## 📝 Quick Code Snippets

### Check User Role in Any Component
```typescript
import { useUserRole } from '@/stores/userProfileStore';

function MyComponent() {
  const { isAdmin, isSuperAdmin } = useUserRole();
  
  return (
    <>
      {isAdmin && <AdminPanel />}
      {isSuperAdmin && <SuperAdminSettings />}
    </>
  );
}
```

### Protect a Page (Client-Side)
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/stores/userProfileStore';

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin } = useUserRole();
  
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin]);
  
  if (!isAdmin) return null;
  
  return <div>Admin Content</div>;
}
```

### Protect an API Route
```typescript
import { requireAdmin } from '@/lib/middleware/role-check';

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req) => {
    // Your admin-only logic here
    return NextResponse.json({ data: 'Admin data' });
  });
}
```

### Display Profile in Header
```tsx
import { ProfileHeader } from '@/components/ProfileHeader';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <ProfileHeader showFullInfo={true} />
      </header>
      {children}
    </div>
  );
}
```

---

## 🎨 UI Customization

### Change Badge Level Colors
Edit `src/components/BadgeSystem.tsx`:

```typescript
const levelColors = {
  RECRUIT: 'from-gray-500 to-gray-700',
  WARRIOR: 'from-blue-500 to-purple-600',
  VETERAN: 'from-amber-500 to-orange-600'  // Customize here
};
```

### Customize Role Badges
Edit `src/components/ProfileHeader.tsx`:

```typescript
const roleBadgeStyle = isSuperAdmin 
  ? 'bg-gradient-to-r from-purple-600 to-pink-600'  // Customize
  : 'bg-gradient-to-r from-blue-600 to-cyan-600';
```

---

## 🚀 Deployment to Vercel

### One-Click Deploy
```bash
# Set environment variables in Vercel dashboard
vercel env add AZURE_COSMOS_ENDPOINT
vercel env add AZURE_COSMOS_KEY
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_SUPER_ADMIN_EMAIL

# Deploy
vercel --prod
```

### Post-Deployment
1. Test login at `https://your-app.vercel.app/login`
2. Create super admin account
3. Configure system settings
4. Generate invite codes for first users

---

## 📚 Next Steps

### Recommended Enhancements
1. **Email Notifications**
   - Send welcome email on approval
   - Notify admins of new registrations
   - Send referral success emails

2. **Advanced Analytics**
   - User growth charts
   - Referral conversion tracking
   - Badge progression analytics

3. **Social Features**
   - Leaderboard for top warriors
   - Community badge showcase
   - Trading insights sharing

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline profile access

---

## 🆘 Need Help?

### Resources
- **Full Documentation:** `/USER_MANAGEMENT_SYSTEM.md`
- **API Reference:** `/API_BEST_PRACTICES.md`
- **Type Definitions:** `src/types/index.ts`
- **Middleware Guide:** `src/lib/middleware/role-check.ts`

### Contact
- **Email:** admin@mpt-warrior.com
- **Telegram:** @mptwarrior
- **GitHub Issues:** Submit bug reports

---

**Happy Coding! 🚀**

*The MPT Warrior Team*
