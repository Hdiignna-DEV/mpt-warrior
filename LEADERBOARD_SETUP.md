# Leaderboard Setup Guide

## Prerequisites - Cosmos DB Containers

Sebelum leaderboard berfungsi, pastikan containers berikut exist di Azure Cosmos DB:

### 1. Create Container: `user-leaderboard`
```
Database: mpt-db
Container Name: user-leaderboard
Partition Key: /userId
RU: 400 (atau autoscale 400-4000)
```

**Document Schema:**
```json
{
  "id": "user-123",
  "userId": "user-123",
  "email": "user@example.com",
  "userName": "John Warrior",
  "totalPoints": 750,
  "quizPoints": 60,
  "consistencyPoints": 35,
  "communityPoints": 0,
  "badge": "Elite Warrior",
  "winRate": 60,
  "rank": 5,
  "previousRank": 8,
  "rankTrend": "UP",
  "lastUpdated": "2026-01-09T10:30:00Z",
  "updatedAt": "2026-01-09T10:30:00Z"
}
```

### 2. Create Container: `leaderboard-history`
```
Database: mpt-db
Container Name: leaderboard-history
Partition Key: /year (string format: "2026")
RU: 200 (atau autoscale 200-2000)
```

**Document Schema:**
```json
{
  "id": "2026-w2",
  "year": "2026",
  "week": 2,
  "snapshot": [
    {
      "userId": "user-123",
      "userName": "John Warrior",
      "totalPoints": 750,
      "rank": 5,
      "badge": "Elite Warrior"
    }
  ],
  "createdAt": "2026-01-09T10:30:00Z"
}
```

## Populate Leaderboard - First Run

Setelah containers created, trigger leaderboard calculation dengan **POST request**:

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Using Postman:
1. Method: **POST**
2. URL: `http://localhost:3000/api/leaderboard`
3. Headers:
   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`
4. Send

### Success Response:
```json
{
  "success": true,
  "message": "Leaderboard recalculated successfully"
}
```

## How It Works

### Scoring System
- **Quiz Points**: Average of all module quiz scores (0-100)
- **Consistency Points**: 5 per day journal entry (max 35/week)
- **Community Points**: 2 per discussion (placeholder, currently 0)
- **Total Points** = Quiz + Consistency + Community

### Badge Levels
| Points | Badge |
|--------|-------|
| 0-500 | Recruit |
| 501-1500 | Elite Warrior |
| 1501-3000 | Commander |
| 3001+ | Legendary Mentor |

### User Visibility
- **Leaderboard shows**: Only WARRIOR role users (regular users)
- **Can view leaderboard**: All authenticated users (including Admin/Super Admin)
- **Can trigger POST**: Admin/Super Admin only

### Ranking Trends
- **UP**: User ranked higher than previous period
- **DOWN**: User ranked lower than previous period
- **STABLE**: User in same rank position

## Features

✅ **All Warriors Included**: Even users with 0 quiz history appear in leaderboard (ranked at bottom with 0 points)

✅ **Responsive Design**:
- Desktop: Table view with full details
- Mobile: Card view with essential info

✅ **Top 3 Podium**: Special styling for rank 1, 2, 3

✅ **Founder Profile**: Shows at top of leaderboard with expertise badges and stats

✅ **User Highlighting**: Your own rank highlighted with orange glow

✅ **Rank Trends**: Visual indicators (up/down/stable arrows) showing performance change

✅ **In-Memory Caching**: 1-hour TTL (production-ready for Redis integration)

## Maintenance

### Manual Recalculation
Trigger POST `/api/leaderboard` whenever you need to update rankings (Admin only)

### Weekly Snapshots
`saveLeaderboardSnapshot()` archives weekly state to `leaderboard-history` (implement via scheduled job)

### Recommended Schedule
- **Immediate**: Every quiz submission updates user score
- **Daily**: Daily consistency check for journal entries
- **Weekly**: Archive snapshot to history (every Sunday)
- **Manual**: Admin can trigger anytime via POST endpoint

## Troubleshooting

**Problem**: Empty leaderboard (no users showing)
- **Solution**: Check if `user-leaderboard` container exists and has documents
- **Action**: Run `POST /api/leaderboard` to populate

**Problem**: Users with no quiz history not showing
- **Solution**: By design, all active users appear even with 0 points
- **Check**: Verify user status = 'active' in users container

**Problem**: Error "Container not found"
- **Solution**: Create missing containers following schema above
- **Check**: Verify partition keys match exactly

## Next Phases

**Phase 2**: School Report page with radar chart showing:
- Technical Analysis skill
- Risk Management skill
- Psychology understanding
- Discipline score
- Knowledge mastery

**Phase 3**: Arka mascot contextual feedback:
- Victory message when rank improves
- Warning when rank decreases

**Phase 4**: Redis caching integration for better performance

**Phase 5**: WebSocket real-time leaderboard updates
