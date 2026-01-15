# MAINTENANCE MODE IMPLEMENTATION GUIDE
## Migrasi Mobile - Role-Based Access Control

**Status**: Ready for Implementation  
**Priority**: HIGH  
**Target**: Website Access Lock for Public | Admin Bypass Active

---

## 📋 RINGKASAN TEKNIS

Maintenance Mode memungkinkan Super Admin untuk:
- ✅ Menutup akses website untuk user biasa (Member)
- ✅ Mempertahankan akses penuh untuk Admin & Super Admin
- ✅ Menjaga akses API untuk operasi migrasi data
- ✅ Menampilkan halaman informatif yang profesional
- ✅ Menunjukkan status migrasi real-time ke public

---

## 🚀 LANGKAH IMPLEMENTASI UNTUK TIM IT

### FASE 1: Konfigurasi Environment Variable

**Lokasi File**: `.env.local` (atau file environment yang digunakan)

```bash
# Tambahkan atau update baris ini:
MAINTENANCE_MODE=false   # Change to 'true' saat akan aktivasi maintenance mode
```

**Catatan Penting**:
- Default adalah `false` (website normal, semua user bisa akses)
- Set ke `true` untuk aktivasi maintenance mode
- Perubahan akan langsung berlaku di deployment berikutnya

### FASE 2: Verifikasi Implementasi

**File-file yang telah diupdate**:
1. ✅ `middleware.ts` - Logic kontrol akses berdasarkan role
2. ✅ `app/maintenance/page.tsx` - Halaman maintenance profesional

**Apa yang sudah diimplementasikan**:

```
┌─────────────────────────────────────────────┐
│     MIDDLEWARE LOGIC - Role-Based Access    │
├─────────────────────────────────────────────┤
│                                             │
│  MAINTENANCE_MODE = false (Default)        │
│  ├─ Semua user bisa akses website          │
│  ├─ API routes freely accessible           │
│  └─ Halaman maintenance tidak ditampilkan  │
│                                             │
│  MAINTENANCE_MODE = true (Activated)       │
│  ├─ Public/Member → Redirect ke /maintenance
│  ├─ Admin/SuperAdmin → Full Access (Bypass)
│  ├─ Admin dapat akses semua API routes     │
│  └─ Halaman maintenance ditampilkan ke public
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔐 ROLE-BASED ACCESS MATRIX

| Role | Website Access | API Access | Melihat Maintenance Page |
|------|---|---|---|
| **Public/Guest** | ❌ Blocked | ❌ Blocked | ✅ Ya |
| **Member** | ❌ Blocked | ❌ Blocked | ✅ Ya |
| **Admin** | ✅ Full | ✅ Full | ✅ Bypass (tidak terlihat) |
| **Super Admin** | ✅ Full | ✅ Full | ✅ Bypass (tidak terlihat) |

---

## 🎯 FITUR HALAMAN MAINTENANCE

**URL**: `/maintenance`

Halaman ini menampilkan:

### 1. **Admin Mode Indicator** (Banner Kuning)
```
┌──────────────────────────────────────────────────┐
│ ⚙️  Admin Mode Active - Website is hidden from  │
│     public                                       │
└──────────────────────────────────────────────────┘
```
- **Ditampilkan hanya untuk**: Admin & Super Admin
- **Tujuan**: Konfirmasi bahwa maintenance mode aktif dan hanya mereka yang bisa akses
- **Hilang otomatis untuk**: Member dan public (mereka tidak akan melihat ini)

### 2. **Informasi Migrasi**
- Headline: "MPT IS EVOLVING - Mobile Migration In Progress"
- Penjelasan profesional tentang upgrade ke mobile app
- Daftar manfaat dan status migrasi

### 3. **Call-to-Action**
- Link ke halaman download app (untuk yang siap)
- Panduan instalasi aplikasi mobile

### 4. **Status Migrasi Real-time**
Timeline menunjukkan:
- ✅ Infrastructure Setup - Complete
- ✅ Mobile App Development - Complete  
- ⏳ Data Migration - In Progress
- ⏸️ Testing & QA - Pending
- ⏸️ Public Launch - Pending

---

## 📝 CHECKLIST AKTIVASI MAINTENANCE MODE

**Ketika siap melakukan migrasi, ikuti checklist ini:**

### ☐ PRE-ACTIVATION (Sebelum Aktivasi)
- [ ] Notifikasi user tentang maintenance melalui push notification/email
- [ ] Backup semua data di Cosmos DB
- [ ] Verifikasi semua admin sudah punya akses yang tepat
- [ ] Test login dengan akun admin/super admin
- [ ] Prepare mobile app release di app stores

### ☐ ACTIVATION (Saat Aktivasi)
1. **Update environment variable**:
   ```bash
   MAINTENANCE_MODE=true
   ```

2. **Deploy ke production** (jika menggunakan CI/CD)
   ```bash
   git add .env.local
   git commit -m "feat: activate maintenance mode for mobile migration"
   git push
   ```

3. **Verifikasi di production**:
   - Login sebagai Super Admin → should see website normally
   - Login sebagai Admin → should see website normally
   - Login sebagai Member → should redirect to /maintenance
   - Try accessing `/api//*` dengan token Member → should get 403 Forbidden

### ☐ MONITORING (Selama Migrasi)
- [ ] Monitor API logs untuk memastikan admin dapat mengakses data
- [ ] Check Cosmos DB untuk progress migrasi
- [ ] Monitor error logs untuk potential issues
- [ ] Keep communication channel open dengan users

### ☐ POST-ACTIVATION (Setelah Migrasi Selesai)
1. **Test dengan mobile app** di production
2. **Verify semua data** telah ter-migrate dengan sempurna
3. **Deactivate maintenance mode**:
   ```bash
   MAINTENANCE_MODE=false
   ```
4. **Deploy final release**
5. **Announce public launch** ke semua users

---

## 🔍 TESTING & VERIFICATION

### Test 1: Admin Access (Bypass Maintenance)
```bash
# Sebagai Super Admin, buka:
1. Buka dashboard → Should work normally
2. Buka /api/user/profile → Should return data (200 OK)
3. Buka /api/leaderboard → Should return data (200 OK)
4. NOT melihat maintenance page
```

### Test 2: Member Access (Blocked)
```bash
# Sebagai Member, buka:
1. Redirect otomatis ke /maintenance
2. Maintenance page ditampilkan dengan benar
3. Lihat admin mode indicator → NOT terlihat untuk member
4. Tidak bisa akses /api/* → 403 Forbidden
```

### Test 3: Public Access (Not Authenticated)
```bash
# Tanpa login:
1. Redirect ke /login
2. Setelah login sebagai member → redirect to /maintenance
3. Tidak bisa akses protected pages
```

---

## 🔧 API ROUTES YANG TETAP TERBUKA (UNTUK ADMIN)

Saat MAINTENANCE_MODE=true, API routes berikut tetap accessible HANYA untuk Admin/SuperAdmin:

```
✅ /api/user/*                    (Profile, data user)
✅ /api/leaderboard/*             (Ranking data)
✅ /api/modules/*                 (Course content)
✅ /api/quiz/*                    (Quiz data)
✅ /api/admin/*                   (Admin operations)
✅ /api/cosmos-health/*           (Database health check)
```

**Untuk Member**: Semua route di atas akan return `403 Forbidden`

---

## ⚠️ TROUBLESHOOTING

### Problem: Admin masih di-redirect ke /maintenance
**Solution**: 
- Verifikasi token JWT memiliki field `role` dengan value `ADMIN` atau `SUPER_ADMIN`
- Pastikan tidak ada typo di field role (case-sensitive: `ADMIN` bukan `Admin`)
- Clear browser cache dan login ulang

### Problem: API masih bisa diakses oleh Member
**Solution**:
- Middleware mungkin belum di-reload
- Restart development server: `npm run dev`
- Verify MAINTENANCE_MODE environment variable sudah di-set ke `true`

### Problem: Halaman maintenance tidak muncul
**Solution**:
- Clear Next.js cache: `rm -rf .next`
- Rebuild project: `npm run build`
- Restart dev server

---

## 📊 MONITORING & LOGGING

**Untuk track status migrasi, monitor logs berikut**:

```typescript
// Admin bisa check di console:
// 1. Cosmos DB health
npm run db:check

// 2. Verify data migration
npm run migrate-leaderboard

// 3. Check specific user data
npm run quiz:verify
```

---

## 🚨 EMERGENCY DEACTIVATION

Jika ada issue atau ingin membatalkan maintenance mode:

```bash
# Ubah environment variable:
MAINTENANCE_MODE=false

# Deploy ulang
git add .env.local
git commit -m "fix: deactivate maintenance mode"
git push
```

Website akan langsung accessible kembali untuk semua users.

---

## 📞 CONTACT & SUPPORT

**Issues/Questions?**
- Check API logs: `/logs/api-*.log`
- Check Cosmos DB: Monitor Azure Portal
- Check Next.js build: `npm run build`

---

## ✅ SIGN-OFF CHECKLIST

**Ketika siap go-live, pastikan semua sudah tercek**:

- [ ] Environment variable MAINTENANCE_MODE sudah di-set dengan benar
- [ ] Admin akun sudah verified bisa access semua fitur
- [ ] Halaman /maintenance sudah di-test dan tampilannya OK
- [ ] API routes yang diperlukan admin sudah verified working
- [ ] Backup data sudah dilakukan
- [ ] Mobile app sudah ready untuk public release
- [ ] Communication message sudah siap untuk users
- [ ] Monitoring tools sudah di-setup
- [ ] Team sudah briefing tentang proses migrasi

**Approval untuk go-live**: ____________________  (Tanda Super Admin)

---

## 📚 DOKUMENTASI LENGKAP

- Implementation Details: See `middleware.ts` (lines 21-55)
- Maintenance Page: See `app/maintenance/page.tsx`
- Environment Setup: See `.env.local`

---

**Last Updated**: January 15, 2026  
**Status**: Production Ready  
**Tested & Verified**: ✅
