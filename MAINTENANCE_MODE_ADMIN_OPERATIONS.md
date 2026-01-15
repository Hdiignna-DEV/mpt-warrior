# MAINTENANCE MODE - ADMIN OPERATIONS MANUAL

**Document Type**: Administrator Guide  
**Target Audience**: Super Admin & System Administrators  
**Status**: Ready for Use  
**Date**: January 15, 2026

---

## 🎯 OVERVIEW UNTUK SUPER ADMIN

Sebagai Super Admin, Anda memiliki kemampuan khusus selama maintenance mode:

| Capability | Status | Notes |
|---|---|---|
| **Full Dashboard Access** | ✅ | Tidak ada redirection |
| **All API Access** | ✅ | Dapat retrieve/modify data |
| **See Admin Mode Banner** | ✅ | Yellow banner di /maintenance page |
| **Data Migration Monitoring** | ✅ | Akses penuh ke Cosmos DB |
| **User Data Access** | ✅ | Lihat semua user data |
| **System Health Check** | ✅ | Monitor database & APIs |

---

## 🚀 ACTIVATION PROCEDURES

### Step-by-Step Activation

#### Phase 1: Pre-Activation (24 hours before)
```bash
# 1. Notify all team members
   → Slack announcement
   → Email to admins
   → Update status page

# 2. Backup database
   npm run db:check                    # Check database health
   
# 3. Verify system health
   npm run db:check
   npm run quiz:verify
   npm run leaderboard:populate --dry-run

# 4. Test with test accounts
   → Login as TEST_ADMIN
   → Verify dashboard works
   → Verify API access works
```

#### Phase 2: Activation (Time Zero)
```bash
# 1. Update environment variable
   Edit .env.local
   Change: MAINTENANCE_MODE=false → MAINTENANCE_MODE=true

# 2. Commit and push
   git add .env.local
   git commit -m "feat: activate maintenance mode - migration phase 1"
   git push origin main

# 3. Verify in production (5 minutes)
   → Open website in incognito mode
   → Try login with Member account
   → Verify redirect to /maintenance

# 4. Test admin access (5 minutes)
   → Login with YOUR admin account
   → Should see full dashboard
   → Should see admin yellow banner
   → Verify all APIs respond with data

# 5. Announce activation
   → Update status page
   → Send notification to team
   → Monitor logs for errors
```

#### Phase 3: During Migration (Hours/Days)
```bash
# Monitor database and APIs
npm run db:check              # Check database health every hour
npm run quiz:verify           # Verify data integrity
npm run leaderboard:populate  # Verify data migrations

# Check API logs for any admin-only access issues
tail -f logs/api-errors.log

# Monitor user feedback channel
# If issues: Immediately deactivate (see Emergency Procedures)
```

#### Phase 4: Deactivation (After Migration Complete)
```bash
# 1. Final verification
   npm run db:check           # All systems go
   npm run quiz:verify        # Data integrity confirmed

# 2. Deactivate maintenance mode
   Edit .env.local
   Change: MAINTENANCE_MODE=true → MAINTENANCE_MODE=false

# 3. Commit and push
   git add .env.local
   git commit -m "feat: deactivate maintenance mode - migration complete"
   git push origin main

# 4. Verify in production (5 minutes)
   → Open website normally
   → Login with Member account
   → Should see dashboard (not maintenance page)

# 5. Announce public launch
   → Update status page
   → Send success notification
   → Celebrate! 🎉
```

---

## 🔍 MONITORING DASHBOARD

### Real-Time Health Checks (During Maintenance)

```bash
# Database Health
npm run db:check
# Output should show:
# ✅ Connected to Cosmos DB
# ✅ All containers accessible
# ✅ No timeout errors

# Quiz Data Verification
npm run quiz:verify
# Output should show:
# ✅ Quiz 1: 100/100 questions
# ✅ Quiz 2: 95/100 questions
# (Some data loss is normal during migration)

# Leaderboard Status
npm run leaderboard:populate --dry-run
# Output should show:
# ✅ Top 100 users loaded
# ✅ Rankings calculated
# ✅ No missing data
```

### API Endpoint Checks (For Admin Access)

```bash
# Check authentication endpoint
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Cookie: token=YOUR_ADMIN_JWT_TOKEN"
# Should return: { valid: true, role: 'ADMIN' }

# Check user profile endpoint
curl -X GET http://localhost:3000/api/user/profile \
  -H "Cookie: token=YOUR_ADMIN_JWT_TOKEN"
# Should return: { userId: '...', email: '...', role: 'ADMIN' }

# Check leaderboard endpoint
curl -X GET http://localhost:3000/api/leaderboard \
  -H "Cookie: token=YOUR_ADMIN_JWT_TOKEN"
# Should return: { topUsers: [...], updated: '2026-01-15T...' }
```

---

## ⚠️ EMERGENCY PROCEDURES

### Quick Deactivation (If Something Goes Wrong)

```bash
# IMMEDIATE ACTION (takes ~2 minutes):

# 1. Edit environment
   Edit .env.local
   Change: MAINTENANCE_MODE=true → MAINTENANCE_MODE=false

# 2. Push change
   git add .env.local
   git commit -m "emergency: deactivate maintenance mode"
   git push origin main

# 3. Verify recovery (within 5 minutes)
   → Open website
   → Login with Member account
   → Verify dashboard is accessible

# STATUS: Website is back online for all users
# All data is safe (nothing was deleted)
```

### If Database Connection Lost

```bash
# 1. Check Cosmos DB status
   npm run db:check
   
   # If connection fails:
   → Check Azure Portal for database status
   → Verify connection string in .env
   → Check firewall rules

# 2. If cannot recover quickly:
   DEACTIVATE maintenance mode (see above)
   This prevents public from getting locked out

# 3. Investigate root cause:
   → Review Azure Cosmos DB logs
   → Check network connectivity
   → Verify JWT_SECRET configuration
```

### If Admin Access Fails

```bash
# 1. Verify your token
   → Logout and login again
   → Check that JWT token is saved in cookie

# 2. Check token validity
   npm run db:check user_id=YOUR_USER_ID
   # Verify that your account has ADMIN role

# 3. Check middleware logs
   tail -f .next/server/logs
   # Look for JWT verification errors

# 4. If can't be resolved:
   DEACTIVATE maintenance mode
   Re-verify configuration
```

---

## 📊 MONITORING CHECKLIST

### Hourly Checks (During Active Migration)
```
☐ Database is responding to queries
☐ API endpoints return 200/403 (not 500)
☐ No spike in error rates
☐ Admin login still works
☐ No complaints from team in chat
```

### Daily Checks (For Multi-Day Migrations)
```
☐ Cosmos DB storage growth is expected
☐ No data corruption issues detected
☐ All batch jobs completed successfully
☐ Backup integrity verified
☐ Logs show normal operation
```

### Pre-Deactivation Checks
```
☐ All data migration completed 100%
☐ Data validation passed for all tables
☐ Mobile app tested in production
☐ No pending issues in error logs
☐ Team confirmed ready for public launch
☐ Communications ready (announcement, support)
```

---

## 🔐 ACCESS VERIFICATION

### Verify Your Admin Token

When logged in as Super Admin:

1. **Open Browser Console** (F12 → Console)
   ```javascript
   // Check if token exists
   document.cookie
   // Should show: token=eyJ...
   
   // Decode token (requires jwt-decode)
   jwtDecode(token)
   // Should show role: 'SUPER_ADMIN' or 'ADMIN'
   ```

2. **Check Network Requests**
   - Open DevTools → Network tab
   - Refresh page
   - Look for requests to `/api/*`
   - All should return 200 (not 403)
   - Response should contain data

3. **Verify Admin Banner**
   - Should see yellow banner at top: "Admin Mode Active..."
   - If not visible, your token might be invalid
   - Logout and login again

---

## 🔧 ADVANCED OPERATIONS

### Manual Data Verification

```bash
# Check specific user data
npm run find-deden        # Find user by username

# Verify leaderboard rankings
npm run leaderboard:populate

# Verify all quiz questions migrated
npm run quiz:verify

# Check admin users list
npm run find-superadmin
```

### Rolling Back Changes

If you made accidental changes during maintenance:

```bash
# 1. Identify the issue
   npm run db:check

# 2. Restore from backup
   # Contact Azure team or use Azure Portal
   # Restore to snapshot from before migration started

# 3. Deactivate maintenance mode
   MAINTENANCE_MODE=false

# 4. Retry migration with correct procedures
```

---

## 📞 ESCALATION PATH

### If You Can't Resolve An Issue

**Level 1: Quick Fixes**
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev/production server
3. Check environment variables (.env.local)
4. Verify network connectivity
```

**Level 2: Database Issues**
```
1. Check Cosmos DB in Azure Portal
2. Verify connection string is correct
3. Check firewall rules
4. Review recent database operations
```

**Level 3: Token/Auth Issues**
```
1. Logout and login again
2. Verify your user account has ADMIN role
3. Check JWT_SECRET in .env
4. Review auth logs
```

**Level 4: If Still Blocked**
```
→ DEACTIVATE maintenance mode immediately
→ Notify your team lead
→ Document the issue for root cause analysis
→ Retry migration after investigating
```

---

## ✅ SIGN-OFF TEMPLATE

Use this when confirming phases are complete:

```
═══════════════════════════════════════════════════════════════

MAINTENANCE MODE STATUS UPDATE

Date: [YYYY-MM-DD HH:MM UTC]
Phase: [PRE-ACTIVATION / DURING MIGRATION / DEACTIVATION]
Status: [IN PROGRESS / COMPLETED]
Issues: [NONE / <description>]

Verified By: [Your Name]
Admin Account: [Your Email]
Timestamp: [Date & Time]

═══════════════════════════════════════════════════════════════
```

---

## 📚 QUICK REFERENCE

### Environment Variable to Control Maintenance
```
File: .env.local
Variable: MAINTENANCE_MODE
Value: 'true' or 'false'
Change takes effect on: Next deployment/restart
```

### Key Files You'll Monitor
```
.env.local                          → Configuration
logs/api-errors.log                 → API errors
logs/database-*.log                 → Database logs
app/maintenance/page.tsx            → Maintenance page
middleware.ts                       → Access control
```

### Important npm Commands
```
npm run dev                         → Start local server
npm run build                       → Build for production
npm run db:check                    → Database health
npm run quiz:verify                 → Quiz data integrity
npm run leaderboard:populate        → Leaderboard data
```

---

## 🎓 TROUBLESHOOTING QUICK TIPS

| Symptom | Likely Cause | Fix |
|---------|---|---|
| Admin still redirected to /maintenance | Invalid JWT role | Re-login, check token |
| Member can access /api/* | MAINTENANCE_MODE not set properly | Check .env.local value |
| Maintenance page looks broken | CSS cache issue | Clear browser cache |
| Database timeouts | Connection issues | Check firewall, restart |
| Can't find user data | Query syntax error | Use provided npm commands |

---

## 📋 PRE-LAUNCH VERIFICATION CHECKLIST

**24 Hours Before Public Launch:**

```
DATABASE & DATA:
☐ All user data successfully migrated
☐ Quiz scores calculated correctly
☐ Leaderboard rankings verified
☐ No data corruption detected
☐ Backup confirmed

SYSTEM:
☐ All APIs responding correctly
☐ Admin access working perfectly
☐ Error logs clean (no critical errors)
☐ Performance metrics acceptable
☐ Mobile app tested with production data

COMMUNICATION:
☐ Team notified about deactivation time
☐ Status page ready to update
☐ Success announcement prepared
☐ Support team briefed
☐ Customer communication ready

FINAL CHECK:
☐ Everything above verified TWICE
☐ Rollback plan in place (just in case)
☐ Ready to deactivate
```

---

**Last Updated**: January 15, 2026  
**Status**: Ready for Use by Admins  
**Version**: 1.0 Final

For questions or issues, refer to the comprehensive technical documentation.
