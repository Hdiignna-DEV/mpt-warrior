# ✅ PRE-DEPLOYMENT VERIFICATION CHECKLIST

## Maintenance Mode & Role-Based Access Control
**Project**: MPT Trading HUB Mobile Migration
**Date**: January 15, 2026
**Status**: Ready for Production

---

## 📋 CODE IMPLEMENTATION VERIFICATION

### Middleware Changes ✓
```
✅ middleware.ts - Updated with:
   ├─ MAINTENANCE_MODE environment variable check
   ├─ PUBLIC_ROUTES whitelist
   ├─ PROTECTED_ROUTES list
   ├─ PROTECTED_API_ROUTES list
   ├─ Role validation logic (ADMIN/SUPER_ADMIN check)
   ├─ Token validation
   ├─ Proper redirect to /maintenance-migration
   └─ 401 responses for API endpoints
```

### Component Changes ✓
```
✅ MaintenanceModeGuard.tsx - Enhanced with:
   ├─ NEXT_PUBLIC_MAINTENANCE_MODE check
   ├─ Role cookie setting (mpt_user_role)
   ├─ Admin bypass logic
   ├─ Redirect on non-admin access
   └─ Proper error handling
```

### Page Changes ✓
```
✅ maintenance-migration/page.tsx - Updated with:
   ├─ Admin banner with "Admin Mode Active"
   ├─ Toggle to show/hide dashboard
   ├─ Admin monitoring dashboard
   ├─ Real-time stats display
   ├─ Migration status tracking
   ├─ Quick action buttons
   ├─ Professional layout
   └─ Mobile responsive design
```

---

## 🔧 ENVIRONMENT VARIABLES

Before deployment, verify in Vercel:

```
Environment Variable: MAINTENANCE_MODE
├─ Value: false (initially OFF)
├─ Production: ☐ Set
├─ Preview: ☐ Set
└─ Development: ☐ Set

Environment Variable: NEXT_PUBLIC_MAINTENANCE_MODE
├─ Value: false (initially OFF)
├─ Production: ☐ Set
├─ Preview: ☐ Set
└─ Development: ☐ Set
```

**Note**: Keep both set to `false` initially. Change to `true` when ready to activate.

---

## 🧪 LOCAL TESTING VERIFICATION

Before deployment, test locally:

```
LOCAL DEVELOPMENT TESTS

☐ Start dev server
  npm run dev

☐ Test Public Routes (should work)
  ├─ GET /login → 200 OK
  ├─ GET /register → 200 OK
  ├─ GET /maintenance-migration → 200 OK
  ├─ GET /get-app → 200 OK
  └─ GET /api/quiz/modules → 200 OK

☐ Test Protected Routes without Auth
  ├─ GET /dashboard → Redirect to /login
  ├─ GET /admin-hq → Redirect to /login
  ├─ GET /analytics → Redirect to /login
  └─ GET /leaderboard → Redirect to /login

☐ Test Protected Routes with Regular User
  ├─ Login as regular user
  ├─ GET /dashboard → 200 (OK, not in maintenance yet)
  ├─ Check localStorage has mpt_user & mpt_token
  └─ Check role cookie is set

☐ Set MAINTENANCE_MODE to true locally
  ├─ Update .env.local: MAINTENANCE_MODE=true
  ├─ Update .env.local: NEXT_PUBLIC_MAINTENANCE_MODE=true
  ├─ Restart dev server: npm run dev

☐ Test Protected Routes with Regular User (Maintenance ON)
  ├─ GET /dashboard → Redirect to /maintenance-migration
  ├─ GET /admin-hq → Redirect to /maintenance-migration
  ├─ Verify maintenance page displays
  ├─ Verify no admin banner (not admin)
  └─ Verify download app section visible

☐ Test Protected Routes with Admin User (Maintenance ON)
  ├─ Login as admin user
  ├─ GET /dashboard → 200 OK (direct access, no redirect)
  ├─ Verify green admin banner displays
  ├─ Click "Show Dashboard" button
  ├─ Verify monitoring dashboard appears
  ├─ Verify stats display correctly
  ├─ Verify quick action buttons work
  └─ Access /admin-hq successfully

☐ Test Admin API Endpoints
  ├─ Admin GET /api/admin/users → 200 OK
  ├─ Regular User GET /api/admin/users → 401 Unauthorized
  ├─ No Auth GET /api/admin/users → 401 Unauthorized
  └─ Check response messages

☐ Test Public API Endpoints
  ├─ No Auth GET /api/quiz/modules → 200 OK
  ├─ No Auth POST /api/auth/login → 200/401 (depends on credentials)
  ├─ Admin GET /api/quiz/modules → 200 OK
  └─ Regular User GET /api/quiz/modules → 200 OK

☐ Test Mobile App Access
  ├─ Mobile app can reach API endpoints
  ├─ Quiz module accessible
  ├─ Authentication works
  └─ No unexpected 401/403 errors
```

---

## 🔒 SECURITY VERIFICATION

```
SECURITY CHECKS

☐ Token Validation
  ├─ Invalid token returns 401
  ├─ Expired token returns 401
  ├─ Missing token redirects appropriately
  └─ Token includes user role

☐ Role-Based Access
  ├─ ADMIN role has full access
  ├─ SUPER_ADMIN role has full access
  ├─ WARRIOR role is blocked
  ├─ MEMBER role is blocked
  └─ Unknown role is blocked

☐ Middleware Security
  ├─ Middleware checks run on every request
  ├─ Client-side redirect after server validation
  ├─ No bypassing with URL manipulation
  └─ No sensitive data leakage

☐ Cookie Security
  ├─ mpt_user_role cookie set with correct scope
  ├─ mpt_token cookie is httpOnly (if used)
  ├─ Cookies cleared on logout
  └─ No cookie vulnerabilities

☐ Data Protection
  ├─ No user data visible on maintenance page
  ├─ Admin dashboard shows only necessary stats
  ├─ No API keys in client-side code
  ├─ No sensitive data in localStorage
  └─ CORS properly configured
```

---

## 📱 BROWSER COMPATIBILITY

```
CROSS-BROWSER TESTING

☐ Chrome/Chromium
  ├─ Maintenance page displays correctly
  ├─ Admin banner visible for admins
  ├─ Dashboard toggle works
  ├─ Responsive on desktop/mobile
  └─ No console errors

☐ Firefox
  ├─ Same as Chrome
  └─ No specific issues

☐ Safari
  ├─ Same as Chrome
  ├─ Test on iOS
  └─ Test on macOS

☐ Edge
  ├─ Same as Chrome
  └─ No IE support required

☐ Mobile Browsers
  ├─ Responsive layout working
  ├─ Touch interactions working
  ├─ Download links accessible
  └─ Admin dashboard accessible
```

---

## 🚀 PRODUCTION DEPLOYMENT VERIFICATION

Before going live:

```
PRE-PRODUCTION CHECKLIST

☐ Code Review
  ├─ middleware.ts reviewed
  ├─ MaintenanceModeGuard.tsx reviewed
  ├─ maintenance-migration/page.tsx reviewed
  └─ No security vulnerabilities found

☐ Build Success
  npm run build
  ├─ No build errors
  ├─ No TypeScript errors
  ├─ All imports resolved
  ├─ Bundle size acceptable
  └─ Production build works locally

☐ Database Backup
  ├─ Cosmos DB backup created
  ├─ User data backed up
  ├─ Quiz data backed up
  ├─ Admin accounts preserved
  └─ Backup tested and verified

☐ Team Notification
  ├─ Developers informed
  ├─ Super Admin notified
  ├─ Admin team briefed
  ├─ Support team ready
  └─ FAQ document distributed

☐ Communication Ready
  ├─ Email template prepared
  ├─ In-app message ready
  ├─ Social media post scheduled
  ├─ Support team briefed
  └─ FAQ available

☐ Mobile App Verification
  ├─ Mobile app fully tested
  ├─ All features working
  ├─ API endpoints tested
  ├─ Performance acceptable
  └─ No critical bugs

☐ Admin Access Verified
  ├─ Super Admin credentials ready
  ├─ Admin accounts verified in DB
  ├─ Test logins successful
  ├─ Dashboard access confirmed
  └─ Admin APIs callable

☐ Documentation Ready
  ├─ MAINTENANCE_MODE_SETUP.md complete
  ├─ MAINTENANCE_MODE_QUICK_START.md complete
  ├─ PROTECTED_API_ENDPOINTS.md complete
  ├─ This checklist complete
  └─ Team has access to docs
```

---

## 🎯 ACTIVATION DAY PROCEDURE

### T-1 Hour: Final Checks
```
☐ All code merged and deployed to Vercel
☐ Verify deployment successful
☐ Test on preview URL
☐ Admin accounts ready
☐ Team standing by
☐ Support team online
```

### T-0 (Activation):
```
☐ Final full system backup
☐ Notify team: "Starting maintenance mode activation"
☐ Update Vercel environment variables:
   - MAINTENANCE_MODE=true
   - NEXT_PUBLIC_MAINTENANCE_MODE=true
☐ Wait for auto-deployment (2-3 minutes)
☐ Verify deployment complete (green checkmark)
```

### T+1 Minute: Verification
```
☐ Open website in incognito window
☐ Verify redirect to /maintenance-migration
☐ Check maintenance page displays
☐ Verify status indicators visible
☐ Test download links
```

### T+2 Minutes: Admin Test
```
☐ Login with admin credentials
☐ Verify dashboard accessible
☐ Verify green admin banner
☐ Show monitoring dashboard
☐ Verify all admin functions work
```

### T+3 Minutes: API Test
```
☐ Test public endpoints (should work)
☐ Test admin endpoints with admin token (should work)
☐ Test admin endpoints with regular token (should fail 401)
☐ Check no unexpected errors
```

### T+5 Minutes: Communication
```
☐ Send maintenance notification email
☐ Update in-app banner
☐ Post on social media
☐ Update status page
☐ Inform support team
```

### Ongoing: Monitoring
```
☐ Monitor Vercel logs
☐ Check error rates
☐ Monitor mobile app traffic
☐ Review support tickets
☐ Check API performance
```

---

## 🛑 ROLLBACK PROCEDURE

If critical issues occur:

```
EMERGENCY ROLLBACK (5 minutes)

☐ Stop accepting new traffic if possible
☐ Notify team immediately
☐ Update Vercel environment:
   - MAINTENANCE_MODE=false
   - NEXT_PUBLIC_MAINTENANCE_MODE=false
☐ Wait for auto-deployment
☐ Test website accessibility
☐ Verify user access restored
☐ Send "We're Back" notification
☐ Post-mortem review
```

---

## 📊 SUCCESS CRITERIA

Maintenance Mode is successful when:

```
✅ Regular users are redirected to maintenance page
✅ Admin users can access dashboard normally
✅ Admin can see monitoring dashboard
✅ Mobile app continues working
✅ API endpoints return expected status codes
✅ No unexpected errors in logs
✅ Support team reports minimal inquiries
✅ Email notifications sent successfully
✅ Download links working
✅ Performance metrics normal
```

---

## 🔄 POST-MAINTENANCE VERIFICATION

When ready to restore public access:

```
☐ Verify migration complete
☐ Verify all data migrated successfully
☐ Test all mobile app features
☐ Update status page
☐ Update environment variables:
   - MAINTENANCE_MODE=false
   - NEXT_PUBLIC_MAINTENANCE_MODE=false
☐ Deploy and verify
☐ Test public access
☐ Send "We're Back" notification
☐ Monitor for issues
☐ Celebrate success!
```

---

## 📞 CONTACTS & ESCALATION

```
LEVEL 1: Technical Team
- Monitor logs
- Check errors
- Verify deployments
- Contact: [Team Lead Email]

LEVEL 2: Admin Team
- Test admin access
- Verify monitoring dashboard
- Check API endpoints
- Contact: [Admin Email]

LEVEL 3: Super Admin
- Emergency decisions
- Rollback authorization
- Executive notification
- Contact: [Super Admin Email]

LEVEL 4: Executive
- Business decisions
- Public communication
- Contact: [Executive Email]
```

---

## 📝 SIGN-OFF

This checklist must be completed and signed off before production deployment.

```
Technical Lead: _____________________  Date: ___________
Admin Responsible: _________________  Date: ___________
Super Admin Approval: ______________  Date: ___________
```

---

**Document Version**: 1.0
**Last Updated**: January 15, 2026
**Status**: Ready for Use
**Review Date**: Before Each Deployment

