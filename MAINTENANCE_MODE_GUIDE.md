# Maintenance Mode - User Guide

## Overview
Maintenance mode memungkinkan admin untuk menjalankan update/fix tanpa mempengaruhi admin/super_admin users. Sistem menggunakan role-based access control untuk mengatur siapa yang bisa akses saat maintenance.

## Role-Based Access During Maintenance

| Role | Can Access | Behavior |
|------|-----------|----------|
| **SUPER_ADMIN** | ✅ Full Access | Bypass maintenance page, akses semua fitur |
| **ADMIN** | ✅ Full Access | Bypass maintenance page, akses semua fitur |
| **WARRIOR** | ❌ Blocked | Redirect ke `/maintenance` page |
| **UNAUTHENTICATED** | ✅ Public Routes | Can access `/download`, `/login`, `/register` |

## Cara Mengaktifkan Maintenance Mode

### Opsi 1: Environment Variable (Recommended)
Tambahkan atau update di Vercel environment variables:
```
MAINTENANCE_MODE=true
```

### Opsi 2: Local Development
Tambahkan di `.env.local`:
```
MAINTENANCE_MODE=true
```

Kemudian restart dev server:
```bash
npm run dev
```

## Cara Menonaktifkan Maintenance Mode

### Di Vercel
Edit environment variable:
```
MAINTENANCE_MODE=false
```
(atau hapus variabel sepenuhnya)

### Local Development
```
MAINTENANCE_MODE=false
```

## Testing Maintenance Mode

### Test as Regular User (WARRIOR)
1. Login dengan akun WARRIOR
2. Coba akses dashboard atau fitur apapun
3. Akan redirect ke `/maintenance` page

### Test as Admin
1. Login dengan akun ADMIN atau SUPER_ADMIN
2. Coba akses dashboard
3. Dapat mengakses semua fitur normally

### Test as Unauthenticated User
1. Logout atau gunakan incognito
2. Coba akses `/dashboard` atau protected route
3. Akan redirect ke `/login`
4. Public routes (`/download`, `/login`, `/register`) tetap accessible

## Technical Details

### Middleware Flow
```
Request → Middleware
         ↓
         Is public route? → YES → Allow
         ↓ NO
         Has valid token? → NO → Redirect to /login
         ↓ YES
         Is maintenance mode ON? → NO → Allow
         ↓ YES
         User role is ADMIN/SUPER_ADMIN? → YES → Allow
         ↓ NO
         Redirect to /maintenance
```

### Public Routes (Always Accessible)
- `/download` - Download page
- `/login` - Login page
- `/register` - Registration page
- `/pending-approval` - Pending user page
- `/maintenance` - Maintenance page
- `/api/*` - All API routes (check per endpoint)
- Static files & Next.js internals

### Protected Routes (Check Role During Maintenance)
- `/dashboard`
- `/profile`
- `/trading-journal`
- `/calculator`
- `/analytics`
- `/leaderboard`
- `/academy`
- And all other authenticated routes

## Data Safety

✅ **All user data is safe during maintenance:**
- Data stored in Azure Cosmos DB remains unchanged
- Maintenance mode hanya control access, tidak menghapus data
- Semua database operations tetap intact
- User profiles, trades, journals, dll semua preserved

## Maintenance Page

Users yang diblokir akan melihat halaman profesional:
- Header dengan MPT logo
- Message: "We're currently upgrading our platform"
- Estimated return time
- Contact information

## Important Notes

1. **JWT Token Verification**: Middleware verify token validity sebelum check role
2. **No Data Loss**: Maintenance mode hanya UI-level blocking
3. **Admin Access**: Admin/Super Admin tidak pernah diblock
4. **Public Access**: Public pages selalu accessible
5. **API Routes**: API endpoints independent (check individual route protection)

## Troubleshooting

### Users Can't Login During Maintenance
- ✅ Expected behavior - `/login` is public route, so login should work
- Check MAINTENANCE_MODE is set to `true`

### Admins Also Blocked
- Make sure JWT_SECRET is correct
- Verify token contains correct role field
- Check user role in database is 'ADMIN' or 'SUPER_ADMIN'

### Maintenance Page Not Showing
- Clear browser cache
- Check MAINTENANCE_MODE=true in environment
- Verify middleware is loaded (check build logs)

## Environment Variables Reference

```bash
# Cosmos DB
AZURE_COSMOS_ENDPOINT=<your-endpoint>
AZURE_COSMOS_KEY=<your-key>
AZURE_COSMOS_DATABASE=mpt-warrior

# JWT
JWT_SECRET=<your-secret>

# Maintenance Mode
MAINTENANCE_MODE=true  # or false
```

## API Endpoints for Admin Dashboard

### Check Maintenance Status
```bash
GET /api/admin/maintenance-status
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "maintenanceMode": true,
  "blockedUsers": 45,
  "allowedAdmins": 2,
  "message": "System maintenance in progress"
}
```

## Monitoring

During maintenance, you can monitor:
- ✅ Admin access working normally
- ✅ Public pages accessible
- ✅ User data intact in Cosmos DB
- ✅ Regular users see maintenance page
- ✅ No errors in console/logs

---

**Last Updated**: January 15, 2026
**Maintenance Mode Version**: 1.0
