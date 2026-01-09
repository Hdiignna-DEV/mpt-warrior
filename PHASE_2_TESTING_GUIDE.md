# 🧪 PHASE 2.1: TESTING & VERIFICATION GUIDE

**Date**: January 9, 2026  
**Status**: Ready for Testing  
**Duration**: ~2-3 hours  

---

## ✅ TEST CHECKLIST

### 1️⃣ API ENDPOINTS (6 Total)

#### Endpoint 1: GET /api/leaderboard
- **Purpose**: Fetch top 100 leaderboard
- **Test Command**:
```bash
curl -X GET "http://localhost:3000/api/leaderboard?limit=10&period=ALL_TIME" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- **Expected Response**:
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user123",
      "userName": "John Doe",
      "totalPoints": 2500,
      "tier": "COMMANDER",
      "badges": ["top_performer"],
      "weeklyPoints": 85
    }
  ],
  "metadata": {
    "total": 245,
    "period": "ALL_TIME",
    "hasMore": true
  }
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ Leaderboard sorted by totalPoints DESC
  - ✓ Each entry has rank, userId, userName, tier
  - ✓ Metadata includes total count

---

#### Endpoint 2: GET /api/leaderboard/user/[userId]
- **Purpose**: Get user's detailed ranking info
- **Test Command**:
```bash
curl -X GET "http://localhost:3000/api/leaderboard/user/user123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- **Expected Response**:
```json
{
  "success": true,
  "user": {
    "userId": "user123",
    "userName": "John Doe",
    "currentRank": 5,
    "previousRank": 7,
    "totalPoints": 2500,
    "tier": "COMMANDER",
    "pointsBreakdown": {
      "quizPoints": 40,
      "consistencyPoints": 35,
      "communityPoints": 20
    },
    "badges": ["top_performer", "consistency_king"],
    "journalStats": {
      "entriesThisWeek": 7,
      "consecutiveDays": 35
    },
    "quizStats": {
      "modulesCompleted": 12,
      "averageScore": 87
    },
    "commentStats": {
      "thisWeek": 8,
      "allTime": 156
    },
    "percentileRank": 98
  }
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ User data complete
  - ✓ Points breakdown accurate (quiz+consistency+community = totalPoints)
  - ✓ Percentile calculated correctly

---

#### Endpoint 3: GET /api/leaderboard/top-three
- **Purpose**: Get top 3 for dashboard widget
- **Test Command**:
```bash
curl -X GET "http://localhost:3000/api/leaderboard/top-three" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- **Expected Response**:
```json
{
  "success": true,
  "topThree": [
    {
      "rank": 1,
      "userId": "user1",
      "userName": "Rank 1 User",
      "totalPoints": 5000,
      "tier": "LEGENDARY_MENTOR",
      "medal": "👑"
    },
    {
      "rank": 2,
      "userId": "user2",
      "userName": "Rank 2 User",
      "totalPoints": 4500,
      "tier": "COMMANDER",
      "medal": "🥈"
    },
    {
      "rank": 3,
      "userId": "user3",
      "userName": "Rank 3 User",
      "totalPoints": 4000,
      "tier": "COMMANDER",
      "medal": "🥉"
    }
  ],
  "cached": false
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ Exactly 3 entries
  - ✓ Sorted by totalPoints DESC
  - ✓ Medals correct (👑 🥈 🥉)

---

#### Endpoint 4: POST /api/leaderboard/sync-points
- **Purpose**: Sync points after quiz/journal/comment
- **Test Command**:
```bash
curl -X POST "http://localhost:3000/api/leaderboard/sync-points" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "pointType": "quiz",
    "points": 32,
    "sourceId": "quiz-module-5"
  }'
```
- **Expected Response**:
```json
{
  "success": true,
  "message": "Points synced for quiz",
  "userId": "user123",
  "pointsAdded": 32,
  "totalPoints": 2532,
  "tier": "COMMANDER",
  "tierChanged": false
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ Points added correctly
  - ✓ totalPoints incremented
  - ✓ Tier updated if threshold crossed

---

#### Endpoint 5: POST /api/leaderboard/recalculate
- **Purpose**: Batch recalculation (admin only)
- **Test Command**:
```bash
curl -X POST "http://localhost:3000/api/leaderboard/recalculate" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "batchMode": false
  }'
```
- **Expected Response**:
```json
{
  "success": true,
  "message": "User ranking recalculated",
  "userId": "user123",
  "newRank": 5,
  "rankChange": -2,
  "totalPoints": 2500
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ Rank recalculated
  - ✓ rankChange accurate (negative = improved)
  - ✓ Admin auth required

---

#### Endpoint 6: GET /api/leaderboard (with search)
- **Purpose**: Search by name
- **Test Command**:
```bash
curl -X GET "http://localhost:3000/api/leaderboard?search=john&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- **Expected Response**:
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 5,
      "userId": "user123",
      "userName": "John Doe",
      "totalPoints": 2500,
      "tier": "COMMANDER"
    }
  ],
  "metadata": {
    "total": 1,
    "period": "ALL_TIME"
  }
}
```
- **Validation**:
  - ✓ Response code: 200
  - ✓ Results filtered by search
  - ✓ Case-insensitive search

---

### 2️⃣ POINT CALCULATIONS

#### Test: Quiz Points
```
Input: Average score 87%
Expected: 87% × 40 = 34.8 ≈ 35 points (max 40)
Test: POST /api/leaderboard/sync-points with pointType=quiz, points=35
Verify: Points added correctly
```

#### Test: Consistency Points
```
Input: 7 journal entries this week
Expected: 7 × 5 = 35 points (max 35)
Test: POST /api/leaderboard/sync-points 7 times with pointType=journal, points=5
Verify: Total 35 points, no overflow
```

#### Test: Community Points
```
Input: 10 comments this week
Expected: 10 × 2 = 20 points (max 20)
Test: POST /api/leaderboard/sync-points 10 times with pointType=comment, points=2
Verify: Total 20 points, no overflow
```

#### Test: Weekly Points Formula
```
Formula: (Quiz × 0.40) + (Consistency × 0.35) + (Community × 0.25)

Example:
- Quiz: 35 points
- Consistency: 35 points
- Community: 20 points

Expected: (35 × 0.40) + (35 × 0.35) + (20 × 0.25)
        = 14 + 12.25 + 5
        = 31.25 ≈ 31 weekly points

Test in database or via sync-points
```

---

### 3️⃣ TIER SYSTEM

#### Test Tier Thresholds
```
RECRUIT:            0-500 pts      (🥲 Gray)
ELITE_WARRIOR:      501-1,500 pts  (⚔️ Blue)
COMMANDER:          1,501-3,000 pts (🎖️ Gold)
LEGENDARY_MENTOR:   3,001+ pts     (👑 Platinum)

Verification:
1. Create user with 500 pts → tier = RECRUIT
2. Add 1 pt → tier = ELITE_WARRIOR
3. Add 1000 pts (total 1501) → tier = COMMANDER
4. Add 1500 pts (total 3001) → tier = LEGENDARY_MENTOR
```

---

### 4️⃣ BADGE SYSTEM

#### Test Badges
```
Badge 1: Consistency King (🔥)
  Requirement: 30+ consecutive days
  Test: Check user with journalEntries.consecutiveDays = 30

Badge 2: Knowledge Master (📚)
  Requirement: 80%+ modules + all modules completed
  Test: Check user with modulesCompleted = total AND averageScore ≥ 80

Badge 3: Community Champion (💬)
  Requirement: 100+ comments
  Test: Check user with commentStats.allTime = 100

Badge 4: Top Performer (📈)
  Requirement: #1-3 for 2+ weeks
  Test: Check rank_history for pattern

Badge 5: Comeback Warrior (🏅)
  Requirement: +20 rank improvement in 1 week
  Test: Check rank improvement in 7 days
```

---

### 5️⃣ DATABASE SCHEMA

#### Verify Collections Created
```bash
# Check in Azure Portal:
1. leaderboard_snapshots (partition key: /date)
2. point_logs (partition key: /userId)
3. rank_history (partition key: /userId)

# Check users collection updated with fields:
- totalPoints
- currentRank
- previousRank
- rankChange
- tier
- badges
- pointsBreakdown
- journalEntries
- commentStats
- quizStats
```

---

## 🧪 HOW TO RUN TESTS

### Option 1: Manual Testing
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run curl commands from section above
curl -X GET "http://localhost:3000/api/leaderboard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 2: Postman Collection
1. Import the test collection
2. Set variables: {{base_url}}, {{token}}
3. Run all tests

### Option 3: Jest Tests (if available)
```bash
npm run test
```

---

## ✅ VALIDATION CHECKLIST

- [ ] All 6 endpoints respond with 200 OK
- [ ] Point calculations accurate (quiz+consistency+community)
- [ ] Weekly points formula correct
- [ ] Tier system working (4 tiers)
- [ ] Badges unlocking correctly
- [ ] Database collections created
- [ ] Users collection updated
- [ ] Indexes created for performance
- [ ] Caching working
- [ ] Auth middleware blocking unauthorized

---

## 📊 EXAMPLE TEST DATA

If you need to test without real data:

```json
{
  "userId": "test-user-001",
  "displayName": "Test Warrior",
  "email": "test@example.com",
  "totalPoints": 2500,
  "weeklyPoints": 85,
  "tier": "COMMANDER",
  "currentRank": 5,
  "pointsBreakdown": {
    "quizPoints": 40,
    "consistencyPoints": 35,
    "communityPoints": 20
  },
  "badges": ["top_performer", "consistency_king"],
  "journalEntries": {
    "entriesThisWeek": 7,
    "consecutiveDays": 35,
    "allTimeDays": 120
  },
  "quizStats": {
    "modulesCompleted": 12,
    "averageScore": 87,
    "highestScore": 95,
    "lowestScore": 72
  },
  "commentStats": {
    "thisWeek": 8,
    "thisMonth": 28,
    "allTime": 156
  }
}
```

---

## 🔗 NEXT STEPS

After testing passes:
1. Fix any bugs found
2. Document issues
3. Proceed to Phase 2.2: Frontend Integration

---

**Document**: PHASE_2_TESTING_GUIDE.md  
**Created**: January 9, 2026  
**Status**: Ready for Testing
