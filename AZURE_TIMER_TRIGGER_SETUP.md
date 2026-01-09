# ⚙️ AZURE TIMER TRIGGER - LEADERBOARD CRON SETUP

**Duration:** 30 minutes  
**Cost:** Free (using student credit)  
**Result:** Hourly leaderboard auto-update

---

## 📋 PREREQUISITES

- ✅ Azure Student account (registered)
- ✅ $100/month credit available
- ✅ Project URL: https://mpt-community.vercel.app
- ✅ Cron API: `/api/leaderboard/cron-update`
- ✅ Cron Secret: `mpt_warrior_cron_secret_12345` (from .env.local)

---

## STEP 1: CREATE AZURE FUNCTION APP (10 MIN)

### 1.1 Go to Azure Portal
```
https://portal.azure.com
```

### 1.2 Create Function App
1. Click: **"Create a resource"**
2. Search: **"Function App"**
3. Click: **"Create"**

### 1.3 Fill in Details

| Field | Value |
|-------|-------|
| Subscription | Azure for Students |
| Resource Group | Create new: `mpt-warrior-rg` |
| Function App name | `mpt-warrior-cron` |
| Runtime | Node.js |
| Version | 20 LTS |
| Region | Closest to you (e.g., Southeast Asia) |
| Plan type | Consumption (Free) |

4. Click: **"Review + Create"**
5. Click: **"Create"**
6. Wait 2-3 minutes for creation

---

## STEP 2: CREATE TIMER TRIGGER FUNCTION (10 MIN)

### 2.1 Open Function App
1. Click: Your new `mpt-warrior-cron` app
2. Left sidebar → **"Functions"**
3. Click: **"Create"**

### 2.2 Create Trigger
1. Select: **"Timer trigger"**
2. Function name: `LeaderboardUpdateCron`
3. Schedule: `0 * * * * *` (setiap jam)
4. Click: **"Create"**

### 2.3 Edit Function Code

The timer trigger function will be auto-created. Edit the code:

**Path:** `HttpTriggerCron/index.js`

```javascript
const axios = require('axios');

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();
    
    try {
        context.log(`⏰ Timer trigger function executed at ${timeStamp}`);
        
        // Call your Vercel API
        const response = await axios.post(
            'https://mpt-community.vercel.app/api/leaderboard/cron-update',
            {},
            {
                headers: {
                    'x-cron-token': process.env.CRON_SECRET,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        context.log(`✅ Leaderboard update successful: ${response.status}`);
        context.res = {
            status: 200,
            body: 'Leaderboard update triggered successfully'
        };
        
    } catch (error) {
        context.log(`❌ Error calling leaderboard cron: ${error.message}`);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    }
};
```

Click: **"Save"**

---

## STEP 3: ADD ENVIRONMENT VARIABLES (5 MIN)

### 3.1 Go to Configuration
1. Left sidebar → **"Configuration"**
2. Click: **"+ New application setting"**

### 3.2 Add CRON_SECRET
| Field | Value |
|-------|-------|
| Name | `CRON_SECRET` |
| Value | `mpt_warrior_cron_secret_12345` |

3. Click: **"OK"**
4. Click: **"Save"** (top)

---

## STEP 4: VERIFY SCHEDULE (5 MIN)

### 4.1 Check Timer Schedule
1. Your function → **"Integrate"** (left sidebar)
2. Find: **"Trigger"** section
3. Should show: **`0 * * * * *`** (every hour, every minute 0)

### 4.2 Manual Test
1. Your function → **"Code + Test"**
2. Click: **"Test/Run"**
3. Should show green checkmark ✅

---

## STEP 5: MONITOR EXECUTIONS (5 MIN)

### 5.1 Check Logs
1. Your function → **"Monitor"** (left sidebar)
2. Should see execution history
3. Green = Success, Red = Error

### 5.2 View Details
1. Click any execution
2. Should see:
   ```
   ✅ Leaderboard update successful: 200
   ```

---

## 📊 WHAT HAPPENS NOW

```
Every hour (0 * * * * *):
  ↓
Azure Timer Trigger fires
  ↓
Calls: https://mpt-community.vercel.app/api/leaderboard/cron-update
  ↓
Includes: CRON_SECRET header
  ↓
API validates token & updates leaderboard
  ↓
✅ Complete in 2-5 seconds
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Function App created successfully
- [ ] Timer Trigger function created
- [ ] Function code updated with axios call
- [ ] CRON_SECRET environment variable set
- [ ] Schedule shows: `0 * * * * *`
- [ ] Manual test shows green ✅
- [ ] Monitor page shows executions

---

## 🚀 AFTER SETUP COMPLETE

Your setup is:
```
Vercel (Next.js app)
  ↑
  └─ Called every hour by Azure Timer Trigger
  
Azure Function (Free tier)
  └─ Scheduled every hour
  └─ Calls Vercel API
  └─ Leaderboard updates automatically
```

---

## 🔧 IF SOMETHING GOES WRONG

### Error: "axios not found"
**Fix:** Install axios
```bash
# In Function App terminal
npm install axios
```

### Error: "401 Unauthorized"
**Fix:** Check CRON_SECRET
```
1. Verify .env.local has correct secret
2. Add same value to Azure Configuration
3. Restart function app
```

### Error: "Connection timeout"
**Fix:** Check API endpoint
```
1. Verify: https://mpt-community.vercel.app/api/leaderboard/cron-update works
2. Test manually in browser
3. Check Vercel logs for errors
```

---

## 📞 SUPPORT

**Monitor page** shows all execution logs.
Check there first if anything fails.

---

**Created:** January 9, 2026  
**Status:** Ready to setup  
**Estimated time:** 30 minutes  
**Cost:** FREE
