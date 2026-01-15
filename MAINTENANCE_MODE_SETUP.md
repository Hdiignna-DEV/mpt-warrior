# 🚀 MAINTENANCE MODE & ROLE-BASED ACCESS CONTROL
## Implementation Guide untuk Mobile Migration Phase

---

## 📋 Ringkasan

Dokumentasi ini menjelaskan cara mengaktifkan **Maintenance Mode** untuk menutup akses publik selama migrasi ke aplikasi mobile, sambil mempertahankan akses penuh untuk Admin & Super Admin.

**Status Implementasi**: ✅ COMPLETE
- ✅ Middleware access control
- ✅ Client-side guard components
- ✅ Maintenance page dengan admin dashboard
- ✅ Environment variables setup
- ✅ API route protection

---

## 1️⃣ SETUP ENVIRONMENT VARIABLES

### Di Vercel Dashboard (Recommended)
Tambahkan variable berikut ke semua environments (Production, Preview, Development):

```
MAINTENANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

### Atau di `.env.local` (untuk local development)

```bash
# Enable/disable maintenance mode
# Set to 'true' untuk mengaktifkan, 'false' untuk menonaktifkan
MAINTENANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

**⚠️ PENTING**: 
- Kedua variable harus diset (server-side dan client-side)
- Client-side variable (`NEXT_PUBLIC_`) diperlukan untuk component rendering
- Server-side variable diperlukan untuk middleware validation

---

## 2️⃣ HOW IT WORKS - ALUR AKSES KONTROL

### Fase 1: User Request
```
User Request → Middleware.ts (Server-side check)
```

### Fase 2: Middleware Decision
```
Middleware checks:
├─ Token valid?
├─ User role?
└─ MAINTENANCE_MODE enabled?

Decision:
├─ Admin/SuperAdmin → ✅ ALLOW (bypass redirect)
├─ Regular User → ❌ REDIRECT to /maintenance-migration
└─ Not logged in → Redirect to /login
```

### Fase 3: Client-side Protection
```
MaintenanceModeGuard Component:
├─ Double-check role
├─ Set role cookie for middleware
└─ Redirect if needed
```

---

## 3️⃣ PROTECTED ROUTES

### Routes yang SELALU TERBUKA (Public)
- `/maintenance-migration` - Halaman maintenance (untuk semua)
- `/login` - Login page
- `/register` - Register page
- `/get-app` - App download page
- `/downloads` - Download resources
- `/api/auth` - Authentication API
- `/api/quiz` - Quiz API (for guests)

### Routes yang DILINDUNGI (Admin Only saat Maintenance)
- `/dashboard` - Main dashboard
- `/admin-hq` - Admin headquarters
- `/analytics` - Analytics
- `/profile` - User profile
- `/modules` - Academy modules
- `/academy` - Academy
- `/leaderboard` - Leaderboard
- `/achievements` - Achievements
- `/journal` - Trading journal
- `/ai-mentor` - AI mentor
- `/calculator` - Calculator

### API Routes DILINDUNGI (Admin Only)
- `/api/admin/**` - Admin endpoints
- `/api/cosmos/**` - Database management
- `/api/dashboard/**` - Dashboard data

---

## 4️⃣ CHECKLIST IMPLEMENTASI

### Sebelum Mengaktifkan Maintenance Mode

- [ ] **Database backup** sudah dibuat
  - Backup Cosmos DB containers
  - Backup user data
  - Backup quiz data

- [ ] **Mobile app testing** sudah selesai
  - Semua fitur berfungsi di mobile
  - Performance testing passed
  - Security testing passed

- [ ] **Admin accounts sudah diverifikasi**
  - List semua admin users
  - Verify login credentials
  - Test admin access

- [ ] **Customer communication ready**
  - Email template disiapkan
  - In-app notification message ready
  - Social media announcement ready

### Mengaktifkan Maintenance Mode

1. **Set environment variable di Vercel**
   ```
   MAINTENANCE_MODE=true
   NEXT_PUBLIC_MAINTENANCE_MODE=true
   ```
   ⏱️ Wait 2-3 minutes untuk deployment auto-trigger

2. **Redeploy aplikasi** (jika tidak auto-trigger)
   ```bash
   # Di project root
   npm run build
   # Deploy via Vercel dashboard atau CLI
   vercel deploy --prod
   ```

3. **Verify maintenance mode aktif**
   - Open website di incognito/private window
   - Harusnya redirect ke `/maintenance-migration`
   - Verify dari mobile app tetap berfungsi

4. **Test admin access**
   - Login dengan admin account
   - Verify bisa access dashboard
   - Verify bisa access admin-hq
   - Check admin monitoring dashboard

5. **Broadcast notification**
   - Send email ke semua users
   - Update in-app notification
   - Post di social media

### Mendeaktifkan Maintenance Mode

1. **Set environment variable ke false**
   ```
   MAINTENANCE_MODE=false
   NEXT_PUBLIC_MAINTENANCE_MODE=false
   ```

2. **Redeploy aplikasi**
   ```bash
   vercel deploy --prod
   ```

3. **Verify website accessible**
   - Test dari incognito window
   - Verify login flow working
   - Verify all features accessible

4. **Send "We're Back" notification**

---

## 5️⃣ ADMIN MONITORING DASHBOARD

### Features
Admin users akan melihat:

1. **Green Banner di Top**
   - Menunjukkan "Admin Mode Active"
   - Toggle untuk show/hide monitoring dashboard

2. **Monitoring Dashboard** (saat di-toggle)
   - Active admins count
   - Blocked users count
   - API health status
   - Last checked timestamp
   - Quick links ke admin panel
   - Refresh button untuk update stats

3. **System Status Display**
   - Database migration status
   - Mobile app build status
   - Final testing progress
   - Web restoration status

### API for Stats (Optional)
Buat API endpoint untuk real-time monitoring:

```typescript
// app/api/admin/migration-stats.ts
export async function GET(request: NextRequest) {
  // Check admin authorization
  const token = request.headers.get('authorization');
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Return migration stats
  return Response.json({
    activeAdmins: 2,
    usersBlocked: 0,
    apiHealth: 'healthy',
    lastChecked: new Date().toISOString(),
  });
}
```

---

## 6️⃣ USER EXPERIENCE

### Regular User sees:
```
┌─────────────────────────────────────────┐
│   MPT IS EVOLVING                       │
│   MOBILE MIGRATION IN PROGRESS          │
├─────────────────────────────────────────┤
│                                         │
│   Status: Database Migration Completed  │
│   Status: Mobile App Build Completed    │
│   Status: Final Testing In Progress     │
│   Status: Web Restoration Pending       │
│                                         │
│   [Download App] [Installation Guide]  │
│                                         │
│   Why Mobile?                           │
│   • Lebih Cepat                        │
│   • Mobile First                       │
│   • Lebih Aman                         │
└─────────────────────────────────────────┘
```

### Admin User sees:
```
┌─────────────────────────────────────────────────────┐
│ 🔐 Admin Mode Active - Website is hidden from public│
│                              [Show Dashboard]       │
├─────────────────────────────────────────────────────┤
│ (Same as regular user + additional section below)   │
├─────────────────────────────────────────────────────┤
│ 📊 ADMIN MONITORING DASHBOARD                       │
│                                                     │
│ Active Admins: 2 │ Users Blocked: 0                 │
│ API Health: ✅ Healthy │ Last Checked: 15:30:45    │
│                                                     │
│ [Go to Admin Dashboard] [Refresh Stats]            │
│                                                     │
│ ⚠️ Warning: Maintenance Mode Active                 │
│    Only Admin accounts have access during migration │
└─────────────────────────────────────────────────────┘
```

---

## 7️⃣ SECURITY CONSIDERATIONS

### ✅ What's Protected
- All protected routes redirect to login or maintenance page
- Middleware validates role before allowing access
- Token validation di server-side
- API endpoints check authorization

### ⚠️ Important Notes
- **localStorage tidak aman untuk session** - hanya digunakan untuk local fallback
- **Cookies used for middleware** validation (more secure)
- **Always validate role di server-side** sebelum returning sensitive data
- **User tidak bisa bypass** dengan URL manipulation

### Recommended Additional Security
1. Enable WAF (Web Application Firewall) di Azure/Cloudflare
2. Implement rate limiting untuk API
3. Enable 2FA untuk admin accounts
4. Monitor admin access logs

---

## 8️⃣ TROUBLESHOOTING

### Problem: Maintenance page tidak muncul
**Solution:**
1. Check environment variables di Vercel
2. Trigger redeploy (`vercel deploy --prod`)
3. Clear browser cache (Ctrl+Shift+Del)
4. Check localStorage (F12 → Application → Storage)

### Problem: Admin tidak bisa login
**Solution:**
1. Verify admin account role di database
2. Check `mpt_user_role` cookie di browser
3. Verify `mpt_token` is valid
4. Try incognito window (fresh session)

### Problem: API routes returning 401
**Solution:**
1. Verify token in Authorization header
2. Check user role in middleware
3. Verify route is in PROTECTED_API_ROUTES list
4. Check token expiration

### Problem: Mobile app dapat akses tapi web tertutup
**Solution:**
1. Mobile app punya bypass logic (jika sudah implemented)
2. Check API routes listed di PROTECTED_API_ROUTES
3. Verify quiz API (`/api/quiz`) masih accessible
4. Verify mobile app using correct API endpoints

---

## 9️⃣ FILE CHANGES MADE

### Files Modified:
1. **middleware.ts** - Server-side access control
   - Added `MAINTENANCE_MODE` check
   - Protected routes list
   - Protected API routes list
   - Role validation logic

2. **src/components/MaintenanceModeGuard.tsx** - Enhanced
   - Added role cookie setting
   - Added `NEXT_PUBLIC_MAINTENANCE_MODE` check
   - Better error handling

3. **src/app/maintenance-migration/page.tsx** - Enhanced
   - Added admin dashboard section
   - Migration status display
   - Admin monitoring features
   - Quick action buttons

### Files to Create (Optional):
```typescript
// app/api/admin/migration-stats.ts - Real-time stats API
// app/api/admin/check-maintenance.ts - Check maintenance status
```

---

## 🔟 ENVIRONMENT VARIABLES REFERENCE

```bash
# Required for Maintenance Mode
MAINTENANCE_MODE=true                      # Server-side check
NEXT_PUBLIC_MAINTENANCE_MODE=true          # Client-side check

# Existing variables (keep as is)
NEXT_PUBLIC_GEMINI_API_KEY=...
GEMINI_API_KEY=...
AZURE_COSMOS_ENDPOINT=...
AZURE_COSMOS_KEY=...
JWT_SECRET=...
# ... etc
```

---

## 📞 SUPPORT & CONTACTS

- **Technical Issues**: Check logs in browser console (F12)
- **Admin Access Issues**: Verify role in database
- **Deployment Issues**: Check Vercel deployment logs
- **Questions**: Refer to this documentation

---

## 📝 NOTES FOR TEAM

### Untuk Super Admin:
- Anda akan selalu bisa login dan access dashboard
- Admin dashboard akan menampilkan monitoring info
- Use "Refresh Stats" button untuk check current status

### Untuk Admin:
- Anda akan tetap bisa login dan work normally
- All admin functions accessible
- Monitoring dashboard available untuk check stats

### Untuk Regular Users:
- Website akan redirect ke maintenance page
- Instructions provided untuk download mobile app
- Email notifications akan dikirim
- Can view installation guide

---

## ✅ CHECKLIST BEFORE GOING LIVE

- [ ] All environment variables set di Vercel
- [ ] Local testing passed
- [ ] Admin accounts verified working
- [ ] Mobile app fully tested
- [ ] Backup of data completed
- [ ] Team notification sent
- [ ] Support documentation ready
- [ ] Monitoring dashboard tested
- [ ] Rollback plan prepared

---

**Last Updated**: January 15, 2026
**Status**: ✅ Ready for Implementation
**Version**: 1.0

