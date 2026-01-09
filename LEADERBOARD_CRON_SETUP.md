# 🔄 Leaderboard Automatic Update Setup

## Status: ✅ CONFIGURED

Leaderboard sekarang akan **otomatis update setiap jam** tanpa perlu intervensi manual.

---

## How It Works

### 1️⃣ Vercel Cron Job
- **Schedule**: Setiap jam (0 * * * *)
- **Endpoint**: `POST /api/leaderboard/cron-update`
- **Aksi**:
  - Recalculate ranking untuk semua users
  - Update leaderboard dengan scores terbaru
  - Clear Redis cache untuk serve fresh data
  - Log activity untuk monitoring

### 2️⃣ Local Development
Test cron endpoint secara manual:

```bash
# Set cron secret
export CRON_SECRET="mpt_warrior_cron_secret_12345"

# Test dengan curl
curl -X POST http://localhost:3000/api/leaderboard/cron-update \
  -H "Authorization: Bearer mpt_warrior_cron_secret_12345" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "success": true,
#   "message": "Leaderboard rankings updated successfully",
#   "updatedAt": "2026-01-09T12:00:00.000Z",
#   "duration": "1234ms",
#   "cacheCleared": true
# }
```

### 3️⃣ Production (Vercel)
- Cron job otomatis berjalan setiap jam
- Vercel akan mengirim request dengan `Authorization` header
- Endpoint memverify secret token sebelum update
- Logs visible di Vercel dashboard

---

## Configuration

### Environment Variables

```bash
# In .env.local (development) and Vercel dashboard (production)
CRON_SECRET=mpt_warrior_cron_secret_12345
```

### Vercel Config

```json
{
  "crons": [
    {
      "path": "/api/leaderboard/cron-update",
      "schedule": "0 * * * *"
    }
  ]
}
```

> 📝 **Note**: Update `vercel.json` jika ingin ubah schedule
> - Format: `minute hour day month weekday`
> - Contoh: `30 2 * * *` = setiap hari jam 2:30 AM

---

## Update Flow

```
┌─────────────────────┐
│  Vercel Cron (1x)   │
│  per jam            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ POST /api/leaderboard/cron-update   │
│ (Verify CRON_SECRET token)          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ updateLeaderboardRanking()          │
│ - Loop all active users             │
│ - Calculate scores                  │
│ - Sort by total points              │
│ - Assign ranks & trends             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Update Cosmos DB                    │
│ - Save rankings to user-leaderboard │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Clear Redis Cache                   │
│ - Delete: leaderboard:top100:v1     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Return Success Response             │
│ - Timestamp, duration, status       │
└─────────────────────────────────────┘
```

---

## What Gets Updated

✅ **Updated Every Hour**:
- 📊 Leaderboard rankings (rank #1, #2, etc.)
- 🎯 Total points per user
- 🏅 Badge tiers (Recruit → Legendary Mentor)
- 📈 Rank trends (UP/DOWN/STABLE)
- 📱 WhatsApp contact info

### Calculated From
- **Quiz Points** (40%): Average of all quiz scores
- **Consistency Points** (35%): Weekly journal entries
- **Community Points** (25%): Discussion engagement

---

## Manual Trigger (Alternative)

Jika ingin update leaderboard tanpa menunggu jam:

```bash
# Via admin panel
1. Login as SUPER_ADMIN
2. Go to /admin-hq/leaderboard-setup
3. Click "Recalculate Rankings" button

# Via CLI (with ADMIN_EMAIL env var)
export ADMIN_EMAIL="info.mptcommunity@gmail.com"
npm run leaderboard:populate
```

---

## Monitoring

### Check Last Update
```bash
# Visit Vercel dashboard
# Settings → Crons → check execution logs
```

### View Leaderboard
```bash
# All users can view at:
https://mpt-community.vercel.app/leaderboard

# Display includes:
- Founder profile (Deden)
- Top 3 podium
- Your position (if logged in as WARRIOR)
- Full rankings table with WhatsApp contact
```

---

## Troubleshooting

### Rankings not updating?
1. Check if Vercel cron is enabled (Pro plan or higher)
2. Verify CRON_SECRET is set in Vercel dashboard
3. Check Vercel logs for errors
4. Manually trigger: `npm run leaderboard:populate`

### WhatsApp not showing?
1. Check if user documents have `whatsapp` field
2. Run populate script to refresh data
3. Clear browser cache
4. Check Redis is working: `npm run cache:check`

### Stale cache?
- Cron automatically clears Redis
- Or manually: Delete `leaderboard:top100:v1` from Redis

---

## Security

✅ **Protected by**:
- `CRON_SECRET` token verification
- Vercel's built-in cron authentication
- Only accepts `POST` requests
- Secrets not exposed in logs

❌ **Not allowed**:
- No token = Unauthorized
- No CRON_SECRET = Request rejected
- Different secret = Request rejected

---

## Performance

⚡ **Typical execution time**: 500ms - 2s
- Depends on number of users
- Azure Cosmos DB query time
- Redis cache clear

📊 **Metrics**:
- Requests: 1 per hour
- Cosmos DB RUs: ~100 per update
- Redis operations: 1 delete per update
- Cost impact: Minimal

---

## Future Enhancements

🎯 Possible improvements:
- [ ] Real-time updates (WebSocket)
- [ ] More frequent updates (every 15 min)
- [ ] Email notifications for top 10
- [ ] Discord notifications
- [ ] Weekly leaderboard reports

---

**Last Updated**: January 9, 2026
**Status**: ✅ Active & Running
