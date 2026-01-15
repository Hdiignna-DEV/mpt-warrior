# 🔧 QUIZ ERROR - USER REPORT & FIX

## 📋 Issue Report

**User Complaint:**
- Quiz tidak bisa dikerjakan
- Muncul layar putih dengan error
- Status: Quiz sebelumnya sudah lulus, modul sudah selesai dibaca

---

## 🔍 Root Cause Analysis

**Likely Causes (Priority Order):**

1. **NO QUIZ QUESTIONS IN DATABASE** ⭐ Most Likely
   - Module exists tapi tidak ada quiz questions
   - Container kosong untuk module_id tersebut
   
2. **Token Expiration**
   - User auth token invalid/expired
   - Perlu login ulang

3. **Module ID Mismatch**
   - Module ID tidak sesuai format
   - Parameter tidak terpass dengan benar

4. **Container Not Initialized**
   - Cosmos DB container error
   - Network issue

---

## ✅ Solutions to Try (In Order)

### Solution 1: Check & Seed Quiz Questions (ADMIN)

```bash
# Run via admin dashboard to seed quiz questions
POST /api/admin/quiz/seed

# Or check if questions exist for module:
GET /api/academy/quiz/module-name-here
```

**Steps:**
1. Go to Admin HQ → Quiz Management
2. Select module from dropdown
3. Check if questions are seeded
4. If empty, click "Generate Sample Questions"
5. Test quiz again

### Solution 2: User Re-login

```
1. Clear browser cache/cookies
2. Logout completely
3. Login again
4. Try quiz again
```

This refreshes auth token and loads new session.

### Solution 3: Check Browser Console

**User steps:**
1. Open quiz page
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for error messages
5. Screenshot and report

**Common errors:**
- `404 - Not Found` → Quiz questions not seeded
- `401 - Unauthorized` → Token expired
- `500 - Server Error` → Cosmos DB issue

---

## 🛠️ Technical Quick Fix

### Check which module has issue:

```typescript
// These are the quiz API endpoints:
GET /api/academy/quiz/:moduleId       // Get quiz questions
POST /api/academy/quiz/submit          // Submit answers
GET /api/academy/quiz/score/:moduleId  // Get score

// If 404 - questions don't exist
// If 500 - database error
```

### Debug Steps:

1. **Check if questions exist:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://mpt-warrior.vercel.app/api/academy/quiz/module-1
   ```

2. **Look for error in response:**
   - If empty array → No questions seeded
   - If error → See error message

3. **Seed questions (if needed):**
   ```bash
   POST /api/admin/quiz/seed
   Body: { moduleId: "module-1" }
   ```

---

## 🚀 Immediate Fix for User

### For User:
1. **Try logout & login again**
2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "All time"
   - Delete browsing data
3. **Try quiz again**
4. **If still fails:** Screenshot error and report

### For Admin:
1. **Check Admin HQ**
2. **Go to module management**
3. **Verify quiz questions exist**
4. **If empty, generate sample questions**
5. **Ask user to try again**

---

## 📊 Quiz Data Structure Check

**What we need to verify:**

```
Module exists? ✓
  ↓
Quiz questions seeded for module? ❓
  ↓
User authentication valid? ✓
  ↓
Can fetch questions from Cosmos DB? ❓
  ↓
Questions render in component? ❓
```

---

## 💾 Code References

**Quiz Component:** `src/components/Quiz.tsx`
- Handles loading state
- Fetches from `/api/academy/quiz/[moduleId]`
- Shows error if fetch fails

**Quiz API:** `src/app/api/academy/quiz/[moduleId]/route.ts`
- Returns questions from `quiz-questions` container
- Requires auth token

**Database Service:** `src/lib/db/education-service.ts`
- Function: `getQuizQuestions(moduleId)`
- Queries Cosmos DB for questions

---

## 🔍 To Debug Further

Need to know:
1. **Which module has the issue?** (Module 1, 2, 3, etc.)
2. **Error message shown?** (Screenshot?)
3. **Browser console error?** (F12 → Console)
4. **When did it start?** (Today? After update?)
5. **Other users affected?** (Just this user or all?)

---

## Status: INVESTIGATING

**Next Step:** Confirm which module is affected and check if quiz questions are seeded.

---

**Action Items:**
- [ ] Check Admin Quiz Management
- [ ] Verify questions seeded for module
- [ ] Test as regular user
- [ ] Check browser console
- [ ] Verify Cosmos DB connection

