# 🔴 LEADERBOARD TIDAK TAMPIL - SOLUTION

## Root Cause ❌
**Leaderboard containers exist, BUT data belum dipopulate ke database.**

```
✅ Container: user-leaderboard (exists)
❌ Data: 0 entries (EMPTY!)
```

---

## Solution: Populate Leaderboard Data 🚀

### **Step 1: Ensure SUPER_ADMIN User Exists**

Go to Azure Portal:
1. Cosmos DB → `mpt-warrior` database → `users` container
2. Find or create document dengan struktur:

```json
{
  "id": "super-admin-id",
  "email": "info.mptcommunity@gmail.com",
  "name": "MPT Community",
  "role": "SUPER_ADMIN",
  "status": "active"
}
```

**Important:** `role` harus **exactly** `"SUPER_ADMIN"` (case sensitive)

---

### **Step 2: Run Populate Script**

```bash
# Set environment variable dengan SUPER_ADMIN email
export ADMIN_EMAIL="info.mptcommunity@gmail.com"

# Run populate script
npm run leaderboard:populate
```

**What it does:**
1. ✅ Verify SUPER_ADMIN user exists
2. ✅ Check containers
3. ✅ Count active users
4. ✅ Calculate scores untuk setiap user
5. ✅ Save ke `user-leaderboard`
6. ✅ Show top 3 users

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

### **Step 3: Verify in Application**

1. Go to: `http://localhost:3000/leaderboard` (atau production URL)
2. Should see users ranked by points
3. Check mobile view juga

---

## Alternative: Via Admin Panel

Jika prefer UI:

1. Login sebagai **SUPER_ADMIN** (`info.mptcommunity@gmail.com`)
2. Go to: `/admin-hq/leaderboard-setup`
3. Click **"Initialize Rankings"** button
4. Wait for success ✅

---

## Troubleshooting

### ❌ "No SUPER_ADMIN user found"
**Fix:** Create SUPER_ADMIN user dengan struktur yang benar di Cosmos DB

### ❌ "No active users found"
**Fix:** Users harus punya:
```json
{
  "status": "active",    // ← REQUIRED
  "role": "WARRIOR",     // ← For leaderboard display
  ...
}
```

### ❌ "ADMIN_EMAIL environment variable not set"
**Fix:** Set env variable sebelum run:
```bash
export ADMIN_EMAIL="info.mptcommunity@gmail.com"
npm run leaderboard:populate
```

### ❌ Script runs but leaderboard still empty
**Debug:** Run:
```bash
npx tsx scripts/debug-leaderboard.ts
```

This will show:
- ✅/❌ Containers status
- ✅/❌ Entry count
- ✅/❌ Users in database
- ✅/❌ SUPER_ADMIN verification

---

## Debug Script

If leaderboard still tidak muncul, run debug script:

```bash
npx tsx scripts/debug-leaderboard.ts
```

This shows:
```
1️⃣ Container status
2️⃣ Data count
3️⃣ Sample entries
4️⃣ Active users
5️⃣ User roles
6️⃣ SUPER_ADMIN users
```

---

## Next Steps

✅ Create/verify SUPER_ADMIN user
✅ Run: `npm run leaderboard:populate`
✅ Visit: `/leaderboard`
✅ Check mobile view
✅ Verify top 3 users display correctly

---

**Leaderboard harus visible sekarang!** 🎉
