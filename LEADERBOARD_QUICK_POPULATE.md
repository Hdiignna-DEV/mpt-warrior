# 🚀 LEADERBOARD QUICK START - POPULATE DATA

**⚠️ SUPER_ADMIN ONLY** - Only SUPER_ADMIN users can populate/manage leaderboard

Containers sudah ada, sekarang perlu populate data. Pilih salah satu metode:

---

## **METODE 1: Command Line (FASTEST) ⚡**

```bash
# Set SUPER_ADMIN email
export ADMIN_EMAIL="info.mptcommunity@gmail.com"

# Run populate script
npm run leaderboard:populate
```

**Requirements:**
- ✅ SUPER_ADMIN email: `info.mptcommunity@gmail.com`
- ✅ User harus exist di database dengan `role: "SUPER_ADMIN"`

**Apa yang terjadi:**
1. ✅ Verify SUPER_ADMIN user exists
2. ✅ Verify kedua containers exist
3. 📊 Count active users di database
4. 🔄 Calculate scores untuk setiap user
5. 💾 Save ke `user-leaderboard` container
6. 📈 Show top 3 users sebagai verification

**Expected output:**
```
🚀 Starting leaderboard population...

🔐 Verifying SUPER_ADMIN access...
✅ SUPER_ADMIN verified: MPT Community

📦 Checking containers...
✅ user-leaderboard container exists
✅ leaderboard-history container exists

📊 Counting active users...
📝 Found 12 active users

🔄 Calculating leaderboard scores for all users...
   Initiated by: SUPER_ADMIN - info.mptcommunity@gmail.com

✅ Leaderboard population complete!

📊 Leaderboard entries created: 12

🏆 Top 3 users:
   #1: Deden - 2850 points (Commander)
   #2: John - 2100 points (Elite Warrior)
   #3: Sarah - 1850 points (Elite Warrior)

✨ You can now view the leaderboard at: /leaderboard
🎉 Success!
```

---

## **METODE 2: Admin Panel (WITH UI)**

**SUPER_ADMIN Only:**

1. Login as **SUPER_ADMIN**
2. Buka: `/admin-hq/leaderboard-setup`
3. Klik **"Initialize Rankings"** button
4. Tunggu status menjadi ✅

**Note:** Panel automatically checks for SUPER_ADMIN role

---

## **METODE 3: Direct API (Advanced)**

```bash
# 1. Login as SUPER_ADMIN
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info.mptcommunity@gmail.com","password":"your-password"}' \
  | jq -r '.token')

# 2. Trigger population
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Requirements:**
- SUPER_ADMIN: info.mptcommunity@gmail.com
- API will reject if user bukan SUPER_ADMIN

---

## **SETUP SUPER_ADMIN ACCOUNT (If Not Yet)**

Pastikan SUPER_ADMIN user exist di database dengan struktur:

```json
{
  "id": "super-admin-id",
  "email": "info.mptcommunity@gmail.com",
  "name": "MPT Community",
  "role": "SUPER_ADMIN",
  "status": "active",
  "password": "hashed_password",
  ...
}
```

**Struktur user di Cosmos DB:**
- Email: `info.mptcommunity@gmail.com`
- Role: `SUPER_ADMIN`
- Status: `active`

---

## **VERIFIKASI HASIL**

Setelah populate, check:

### 1️⃣ **Visit Leaderboard Page**
- URL: `http://localhost:3000/leaderboard`
- Should see users ranked by points

### 2️⃣ **Check Cosmos DB**
- Open Azure Portal → Cosmos DB Data Explorer
- Navigate: `mpt-warrior` → `user-leaderboard`
- Should see documents for each user

### 3️⃣ **View Sample Entry**
```json
{
  "id": "user-123",
  "userId": "user-123",
  "userName": "John Trader",
  "email": "john@example.com",
  "totalPoints": 850,
  "quizPoints": 60,
  "consistencyPoints": 32,
  "communityPoints": 12,
  "badge": "Elite Warrior",
  "winRate": 68,
  "rank": 5,
  "previousRank": 7,
  "rankTrend": "UP",
  "lastUpdated": "2026-01-09T10:30:00.000Z"
}
```

---

## **TROUBLESHOOTING**

### ❌ "No SUPER_ADMIN user found"
**Fix:** Update user dengan `role: "SUPER_ADMIN"` di Cosmos DB

```json
// User document harus punya:
{
  "id": "user-id",
  "email": "admin@example.com",
  "role": "SUPER_ADMIN",      // ← REQUIRED FOR LEADERBOARD MANAGEMENT
  "status": "active",
  ...
}
```

### ❌ "ADMIN_EMAIL environment variable not set"
**Fix:** Set environment variable sebelum run script

```bash
# Unix/Mac/Linux
export ADMIN_EMAIL="info.mptcommunity@gmail.com"
npm run leaderboard:populate

# Windows PowerShell
$env:ADMIN_EMAIL="info.mptcommunity@gmail.com"
npm run leaderboard:populate

# Windows Command Prompt
set ADMIN_EMAIL=info.mptcommunity@gmail.com
npm run leaderboard:populate
```

### ❌ "Unauthorized - Super Admin only" (API error)
**Fix:** User token harus dari SUPER_ADMIN account

### ❌ "No active users found!"
**Fix:** Users harus memiliki `status: "active"` dan `role: "WARRIOR"` di database

---

## **NEXT STEPS**

✅ Setup SUPER_ADMIN user if needed
✅ Populate data dengan `npm run leaderboard:populate`
✅ Visit `/leaderboard` untuk lihat hasil
✅ SUPER_ADMIN access `/admin-hq/leaderboard-setup` untuk advanced options
✅ Setup auto-update scheduler (optional)

---

## **ROLE-BASED ACCESS**

| Role | Can View | Can Populate | Can Manage |
|------|----------|--------------|-----------|
| WARRIOR | ✅ Yes | ❌ No | ❌ No |
| ADMIN | ✅ Yes | ❌ No | ❌ No |
| SUPER_ADMIN | ✅ Yes | ✅ Yes | ✅ Yes |

---

## **AUTO-UPDATE SETUP (SUPER_ADMIN Only)**

Jika ingin automatic hourly updates:

1. SUPER_ADMIN login
2. Admin panel: `/admin-hq/leaderboard-setup`
3. Klik **"Start Auto-Scheduler"**
4. Status akan update setiap jam

---

**Happy competing! 🏆**
