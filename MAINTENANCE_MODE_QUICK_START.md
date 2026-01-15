# ⚡ QUICK START: ACTIVATE MAINTENANCE MODE

## 🚀 UNTUK TIM IT - COPY-PASTE CHECKLIST

Tim, segera eksekusi Maintenance Mode untuk migrasi ke Mobile App dengan spesifikasi berikut:

**Status**: Implementation Complete ✅  
**Date**: January 15, 2026  
**Ready to Deploy**: YES 🚀

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Sebelum mengaktifkan maintenance mode, pastikan:

```
☐ Database Backup
  └─ Backup Cosmos DB sudah dibuat
  └─ User data preserved
  └─ Quiz data backed up

☐ Mobile App Ready
  └─ APK/App sudah published
  └─ All features tested
  └─ Performance validated

☐ Admin Access Verified
  └─ Super Admin (deden) bisa login
  └─ Team Admins bisa login
  └─ Test credentials ready

☐ Communication Ready
  └─ Email template prepared
  └─ In-app message ready
  └─ Social media post ready

☐ Support Team Briefed
  └─ Team knows maintenance is happening
  └─ FAQ document ready
  └─ Escalation path defined
```

---

## 🎯 IMPLEMENTATION STEPS (5 MENIT)

### Step 1: Set Environment Variables (2 menit)
Go to **Vercel Dashboard** → Project Settings → Environment Variables

**Add these variables to ALL environments** (Production, Preview, Development):

| Variable | Value | Scope |
|----------|-------|-------|
| `MAINTENANCE_MODE` | `true` | All |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | `true` | All |

**Save and wait for auto-deployment** (2-3 minutes)

### Step 2: Verify Deployment (1 menit)
```bash
# Option A: Wait for auto-deployment
# Check Vercel dashboard for deployment status

# Option B: Manual deployment (if needed)
vercel deploy --prod
```

Check deployment completed:
- Open Vercel dashboard
- Look for green checkmark on latest deployment
- Should show "Production" tag

### Step 3: Test in Incognito Window (1 menit)
```
1. Open https://yoursite.com in Incognito/Private window
2. Should redirect to /maintenance-migration
3. Verify status page displays correctly
4. Verify download links work
```

### Step 4: Test Admin Access (1 menit)
```
1. Login with admin credentials
2. Should see green "Admin Mode Active" banner
3. Click "Show Dashboard" button
4. Verify monitoring dashboard appears
5. Verify "Go to Admin Dashboard" button works
```

---

## ✅ VERIFICATION CHECKLIST

After enabling Maintenance Mode:

```
☐ Regular User Test
  ├─ Open incognito window
  ├─ Try to access /dashboard
  ├─ Should redirect to /maintenance-migration
  └─ Verify maintenance page shows correctly

☐ Admin Login Test
  ├─ Login dengan admin account
  ├─ Should see dashboard normally
  ├─ Green banner visible
  ├─ Admin dashboard works
  └─ Can access all admin routes

☐ Mobile App Test
  ├─ Open mobile app
  ├─ Should work normally
  ├─ API calls succeed
  ├─ Quiz module accessible
  └─ No 401/403 errors

☐ API Test (with curl/Postman)
  POST /api/auth/login
  ├─ Regular user: returns token (but blocked by middleware)
  └─ Admin user: returns token and can access resources

☐ Email & Notifications
  ├─ Send maintenance notification
  ├─ Update in-app banner
  ├─ Verify message clarity
  └─ Confirm users understand
```

---

## 🔐 ADMIN ACCESS DETAILS

### Super Admin (Unlimited Access)
```
Email: deden@mpt-trading.com (or your super admin email)
Role: SUPER_ADMIN
Access:
  ✅ /dashboard
  ✅ /admin-hq
  ✅ /analytics
  ✅ All API endpoints
  ✅ Admin monitoring dashboard
```

### Admin Users (Full Access)
```
Role: ADMIN
Same access as Super Admin during maintenance
Access all protected routes
Monitoring dashboard available
```

### Regular Warriors & Members (BLOCKED)
```
Role: WARRIOR or MEMBER
Access:
  ❌ /dashboard
  ❌ /modules
  ❌ /leaderboard
  ❌ All protected routes
  ✅ /maintenance-migration (info page)
  ✅ /get-app (download page)
  ✅ /api/quiz (quiz API)
```

---

## 🔧 TROUBLESHOOTING (If Issues)

### Issue 1: Maintenance page not showing
```
Solution:
1. Verify env variables set: NEXT_PUBLIC_MAINTENANCE_MODE=true
2. Clear browser cache (Ctrl+Shift+Del)
3. Hard refresh (Ctrl+F5)
4. Check Vercel deployment status
5. Trigger manual redeploy if needed: vercel deploy --prod
```

### Issue 2: Admin cannot login
```
Solution:
1. Verify admin role in database
2. Check localStorage has mpt_token
3. Check mpt_user_role cookie exists
4. Try different browser/incognito
5. Check Vercel logs for errors
```

### Issue 3: Mobile app getting 401 errors
```
Solution:
1. Verify token included in API requests
2. Check /api/quiz is in PUBLIC_ROUTES
3. Verify CORS headers correct
4. Check mobile app using correct endpoints
5. Verify admin user making the requests
```

### Issue 4: Cannot access admin API endpoints
```
Solution:
1. Verify Authorization header has valid token
2. Check user role is ADMIN or SUPER_ADMIN
3. Verify route in PROTECTED_API_ROUTES
4. Check middleware config
5. Review server logs for validation errors
```

---

## 📊 MONITORING DURING MAINTENANCE

### What to Watch
```
1. Error Rates
   └─ Should NOT increase for authenticated users
   └─ Regular users expected to see 307 redirects

2. API Performance
   └─ Admin API calls should have normal latency
   └─ No unusual 401/403 spikes

3. Mobile App Traffic
   └─ Should increase significantly
   └─ Monitor for errors in app logs

4. Support Tickets
   └─ Monitor for confusion
   └─ Be ready to clarify in in-app messages
```

### Monitoring URLs
```
Vercel Dashboard:
  https://vercel.com/projects/[your-project]

Cosmos DB Health:
  Azure Portal → Cosmos DB → Metrics

Server Logs:
  Vercel → Logs tab
  Filter by errors and 401/403 status codes
```

---

## 🛑 EMERGENCY: DISABLE MAINTENANCE MODE

If something goes wrong and you need to immediately restore public access:

```bash
# Option 1: Via Vercel Dashboard (30 seconds)
1. Go to Environment Variables
2. Change MAINTENANCE_MODE to false
3. Change NEXT_PUBLIC_MAINTENANCE_MODE to false
4. Wait for auto-deployment

# Option 2: Via Vercel CLI (1 minute)
vercel env rm MAINTENANCE_MODE production
vercel env rm NEXT_PUBLIC_MAINTENANCE_MODE production
vercel deploy --prod
```

**Test Verification After Disabling:**
```
1. Open incognito window
2. Access /dashboard directly
3. Should load normally (not redirect)
4. Verify login works
5. Monitor error rates
```

---

## 📧 COMMUNICATION TEMPLATES

### Email to Users
```
Subject: MPT Platform Maintenance - Migration to Mobile App

Dear Warriors,

We're excited to announce that we're moving the entire MPT Trading HUB 
platform to our new mobile application for a better experience.

During this migration period (Jan 15-20), the web platform will be temporarily 
unavailable. However, all features are available in our new mobile app.

📱 Download the app: [link to /get-app]
📖 Installation guide: [link to guide]

We appreciate your patience as we work to make MPT better!

Best regards,
MPT Team
```

### In-App Banner
```
🚀 MPT IS EVOLVING
We're migrating to mobile for better performance.
Download the app and get started: [Download]
```

### Status Page Content
```
All features have moved to our mobile app.
The web platform is temporarily offline for migration.

Status:
✅ Database Migration: Completed
✅ Mobile App Build: Completed
🔄 Final Testing: In Progress
⏳ Web Restoration: Coming Soon

Download app now: [Get App]
```

---

## 📞 SUPPORT ESCALATION

```
Level 1 - User Question
  ├─ Direct to /maintenance-migration page
  └─ Provide download link

Level 2 - Technical Issue
  ├─ Check error logs
  ├─ Verify user role in database
  └─ Contact development team

Level 3 - Critical Issue
  ├─ Escalate to Super Admin
  ├─ Consider emergency disable
  └─ Review EMERGENCY section above
```

---

## ✨ SUCCESS INDICATORS

Maintenance Mode is working correctly when:

```
✅ Regular users see maintenance page
✅ Admin users see dashboard normally
✅ Admin banner shows "Admin Mode Active"
✅ Admin dashboard displays stats
✅ Mobile app works normally
✅ API endpoints return correct status codes
✅ No error spikes in Vercel logs
✅ Support requests are minimal
```

---

## 🎉 COMPLETING MAINTENANCE MODE

When ready to restore web platform:

```
1. Verify migration complete
2. Update status page
3. Set MAINTENANCE_MODE=false
4. Deploy
5. Test public access
6. Send "We're Back" notification
7. Monitor for issues
```

---

**Deployment Date**: [Insert Date]
**Expected Duration**: [Insert Duration]
**Contact**: [Your Contact]
**Escalation**: [Escalation Contact]

---

**Last Updated**: January 15, 2026
**Version**: 1.0 - Quick Start Edition

