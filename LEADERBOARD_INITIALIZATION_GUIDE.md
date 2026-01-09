# 🚀 Leaderboard Initialization Guide

**Problem**: Leaderboard page exists but shows empty data  
**Solution**: Initialize the leaderboard with user data (one-time setup required)

---

## Why is the Leaderboard Empty?

The leaderboard system is **data-driven**. Here's what happens:

1. **Page exists** ✅ - `/leaderboard` is accessible to all users
2. **API exists** ✅ - `/api/leaderboard` endpoint works
3. **Backend functions exist** ✅ - `calculateUserLeaderboardScore()` and other functions ready
4. **Database is empty** ❌ - `user-leaderboard` container hasn't been populated yet

**Solution**: Populate the `user-leaderboard` container by triggering `updateLeaderboardRanking()`

---

## Option 1: Use Admin Panel (RECOMMENDED) 🎛️

### Step 1: Go to Admin Setup Page
Navigate to: **`/admin-hq/leaderboard-setup`**

### Step 2: Sign In as Super Admin
- Use your super admin account
- Make sure you have `role: 'SUPER_ADMIN'` in your user profile

### Step 3: Run Setup Steps
The page shows 3 setup steps:
1. **Create Leaderboard Containers** - Sets up Cosmos DB containers
2. **Initialize Rankings** - Calculates scores for all users
3. **Start Auto-Scheduler** - (Optional) Enable hourly automatic updates

### Step 4: Click Each Button
Each step has an "Execute" button. Click them in order:
- 📦 Setup Containers
- 🔄 Initialize Rankings  
- ⏰ Start Scheduler

The page will show:
- `⏳ Loading...` while processing
- `✅ Success` when complete
- `❌ Error` if something fails

**Result**: Leaderboard will populate with all users' scores! 🎉

---

## Option 2: Direct API Call (FOR TESTING)

If you prefer to use a script or curl:

```bash
# 1. Get your auth token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your_password"}' \
  | jq -r '.token')

# 2. Trigger setup
curl -X POST http://localhost:3000/api/admin/setup-leaderboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 3. Trigger initialization
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## Option 3: Node.js Script (FOR BATCH OPERATIONS)

Create `scripts/init-leaderboard.ts`:

```typescript
import { getCosmosClient } from '@/lib/db/cosmos-client';
import { updateLeaderboardRanking } from '@/lib/db/education-service';

async function initializeLeaderboard() {
  console.log('🚀 Initializing leaderboard...');
  
  try {
    // Step 1: Create containers
    const client = getCosmosClient();
    const db = client.database('mpt-warrior');
    
    console.log('📦 Creating user-leaderboard container...');
    await db.containers.createIfNotExists({
      id: 'user-leaderboard',
      partitionKey: '/userId',
      throughput: 100
    });
    console.log('✅ Container created');
    
    // Step 2: Calculate and populate rankings
    console.log('🔄 Calculating user rankings...');
    await updateLeaderboardRanking();
    console.log('✅ Rankings calculated and saved');
    
    console.log('🎉 Leaderboard initialized successfully!');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

initializeLeaderboard();
```

Run with:
```bash
npx ts-node scripts/init-leaderboard.ts
```

---

## What Happens During Initialization?

### Step 1: Create Containers
```
Database: mpt-warrior
Containers:
  - user-leaderboard (partition key: /userId)
  - leaderboard-history (partition key: /userId)
```

### Step 2: Calculate Rankings
For **each active user**:
1. Get quiz scores (40% weight)
2. Get consistency score (35% weight)
3. Get community points (25% weight)
4. Calculate total: `(quiz × 0.40) + (consistency × 0.35) + (community × 0.25)`
5. Assign badge tier based on points:
   - **Recruit**: 0-500 points
   - **Elite Warrior**: 501-1500 points
   - **Commander**: 1501-3000 points
   - **Legendary Mentor**: 3001+ points
6. Calculate win rate from trades
7. Assign rank (1st, 2nd, 3rd, etc.)
8. Determine trend (UP/DOWN/STABLE)

### Step 3: Save to Database
All calculated data saved to `user-leaderboard` container

### Result
✅ Leaderboard page will now show:
- Founder profile card
- Your position card (if logged in)
- Top 3 podium
- Full leaderboard table/cards
- Mobile responsive layout

---

## After Initialization

### Auto-Refresh Setup (Optional)
To automatically update leaderboard hourly, click "Start Auto-Scheduler" in admin panel.

This will:
- Recalculate all rankings every hour
- Update Redis cache
- Clear stale data

### Manual Refresh
If you need to manually refresh:
- Admin: Go to `/admin-hq/leaderboard-setup` and click "Initialize Rankings"
- Or call: `POST /api/leaderboard` with super admin token

### Viewing Leaderboard
Once initialized:
- **Users**: Visit `/leaderboard` to see full rankings
- **Admins**: Can also see admin stats and recalculation options

---

## Troubleshooting

### Issue: "Unauthorized - Super Admin access required"
**Solution**: Make sure your user account has `role: 'SUPER_ADMIN'`
- Check Cosmos DB `users` container for your user doc
- Set `role: "SUPER_ADMIN"`

### Issue: "Container already exists"
**Solution**: This is okay! The setup handles this gracefully
- Containers may already exist from previous setup
- The leaderboard data will be updated, not recreated

### Issue: "Failed to fetch leaderboard"
**Solution**: Check these:
1. Are you logged in? (token in localStorage)
2. Is the API endpoint working? (check browser console)
3. Are there active users in the system?
4. Is Cosmos DB configured correctly?

### Issue: Empty leaderboard after initialization
**Solution**:
1. Make sure there are active users in the database
2. Users must have `status: 'active'`
3. Check Cosmos DB `users` container for user count
4. Re-run initialization after adding more users

---

## Next Steps

After initialization, the leaderboard will automatically:
- ✅ Display all WARRIOR users (not admins)
- ✅ Show founder profile at top
- ✅ Display top 3 podium with medals
- ✅ Show your rank and position
- ✅ Calculate and update scores hourly
- ✅ Display radar chart in school reports

Enjoy your competitive leaderboard system! 🏆

---

## Quick Checklist

- [ ] I am logged in as SUPER_ADMIN
- [ ] I have access to `/admin-hq/leaderboard-setup`
- [ ] I clicked "Setup Containers" and got ✅
- [ ] I clicked "Initialize Rankings" and got ✅
- [ ] I can see leaderboard at `/leaderboard`
- [ ] I see data populating (founder, podium, users)
- [ ] Mobile view looks good
- [ ] No console errors

**All checked?** Leaderboard is ready! 🚀
