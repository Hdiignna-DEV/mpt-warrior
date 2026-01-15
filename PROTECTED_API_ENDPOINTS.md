# 🔒 PROTECTED API ENDPOINTS REFERENCE

## Overview

Dokumen ini mendaftarkan semua API endpoints yang di-protect saat maintenance mode aktif.

---

## 📋 PROTECTED ROUTES CONFIGURATION

### File: `middleware.ts`

```typescript
// Routes yang SELALU TERBUKA (Public)
const PUBLIC_ROUTES = [
  '/maintenance-migration',    // Maintenance page untuk semua
  '/login',                   // Login page
  '/register',                // Register page
  '/api/auth',                // Authentication API
  '/get-app',                 // App download
  '/downloads',               // Downloads folder
  '/service-worker.js',       // PWA service worker
  '/api/quiz',                // Quiz API (for guests)
];

// API routes yang HANYA admin bisa akses
const PROTECTED_API_ROUTES = [
  '/api/admin',               // Admin endpoints
  '/api/cosmos',              // Database management
  '/api/dashboard',           // Dashboard data
];

// Page routes yang HANYA admin bisa akses
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin-hq',
  '/analytics',
  '/profile',
  '/modules',
  '/academy',
  '/leaderboard',
  '/achievements',
  '/journal',
  '/ai-mentor',
  '/calculator',
  '/school-report',
];
```

---

## 🟢 PUBLIC API ENDPOINTS (Always Available)

Endpoints ini dapat diakses oleh siapa saja, bahkan saat maintenance mode aktif:

### Authentication
```
POST   /api/auth/login              - Login user
POST   /api/auth/register           - Register user
POST   /api/auth/logout             - Logout
POST   /api/auth/refresh            - Refresh token
GET    /api/auth/me                 - Get current user
POST   /api/auth/forgot-password    - Password reset
```

### Quiz (Guest Access)
```
GET    /api/quiz/modules            - List available quiz modules
GET    /api/quiz/modules/:id        - Get specific module
GET    /api/quiz/questions/:id      - Get quiz questions
POST   /api/quiz/submit             - Submit quiz answers
GET    /api/quiz/results/:id        - Get quiz results
```

### Mobile App
```
GET    /api/app/version             - Check app version
GET    /api/app/download-link       - Get app download URL
POST   /api/app/feedback            - Send app feedback
```

---

## 🔴 PROTECTED API ENDPOINTS (Admin Only During Maintenance)

Endpoints ini HANYA bisa diakses oleh ADMIN & SUPER_ADMIN saat maintenance mode aktif:

### Admin Management
```
GET    /api/admin/users             - List all users
GET    /api/admin/users/:id         - Get user details
PUT    /api/admin/users/:id         - Update user
DELETE /api/admin/users/:id         - Delete user
POST   /api/admin/users/bulk        - Bulk operations

GET    /api/admin/roles             - List roles
POST   /api/admin/roles             - Create role
PUT    /api/admin/roles/:id         - Update role
DELETE /api/admin/roles/:id         - Delete role

GET    /api/admin/permissions       - List permissions
POST   /api/admin/audit-logs        - Get audit logs
```

### Dashboard Data
```
GET    /api/dashboard/stats         - Get dashboard statistics
GET    /api/dashboard/analytics     - Get analytics data
GET    /api/dashboard/reports       - Get reports
GET    /api/dashboard/export        - Export data
```

### Database Management (Cosmos)
```
GET    /api/cosmos/health           - Check Cosmos health
POST   /api/cosmos/backup           - Trigger backup
GET    /api/cosmos/containers       - List containers
GET    /api/cosmos/items/:container - Get items from container
POST   /api/cosmos/items/:container - Create item
PUT    /api/cosmos/items/:container/:id - Update item
DELETE /api/cosmos/items/:container/:id - Delete item

POST   /api/cosmos/query            - Execute query
GET    /api/cosmos/metrics          - Get Cosmos metrics
POST   /api/cosmos/restore          - Restore from backup
```

### System Management
```
GET    /api/admin/system/health     - System health check
GET    /api/admin/system/logs       - Get system logs
POST   /api/admin/system/restart    - Restart service
GET    /api/admin/system/config     - Get system config
PUT    /api/admin/system/config     - Update config

POST   /api/admin/migration/status  - Get migration status
POST   /api/admin/migration/verify  - Verify migration
POST   /api/admin/migration/rollback - Rollback migration
```

### Monitoring & Stats
```
GET    /api/admin/monitoring/metrics    - Get metrics
GET    /api/admin/monitoring/alerts     - Get alerts
POST   /api/admin/monitoring/test-alert - Test alert
GET    /api/admin/monitoring/uptime     - Get uptime stats
```

---

## 🔄 CONDITIONAL API ROUTES

Routes yang memerlukan validation berbeda:

### Depends on User Role
```
GET    /api/profile                - User profile (own or admin)
GET    /api/leaderboard            - Leaderboard data (public scores only)
GET    /api/achievements/:userId   - Achievements (own or admin)
GET    /api/trades/:userId         - Trading history (own or admin)
GET    /api/journal/:userId        - Journal entries (own or admin)
```

**Behavior During Maintenance:**
- Public user: ❌ Blocked (redirect to login/maintenance)
- User accessing own data: ⚠️ Check individual auth
- Admin accessing other user: ✅ Allowed

### Quiz Submission Flow
```
GET    /api/quiz/modules           - ✅ Always public
POST   /api/quiz/submit            - ⚠️ Check token validity
  ├─ If no token: ❌ Blocked
  ├─ If token invalid: ❌ 401 Unauthorized
  ├─ If regular user: ❌ Block (redirect)
  └─ If admin: ✅ Allowed
```

---

## 🛡️ MIDDLEWARE LOGIC FOR API ROUTES

```typescript
// In middleware.ts
if (pathname.startsWith('/api/')) {
  // Check if it's a protected admin API
  const isProtectedApi = PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedApi) {
    // PROTECTED ADMIN API - Strict validation
    const token = request.cookies.get('mpt_token')?.value;
    const userRole = request.cookies.get('mpt_user_role')?.value;

    if (!token || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      // Return 401 with error message
      return NextResponse.json(
        { error: 'Unauthorized - Maintenance Mode Active' },
        { status: 401 }
      );
    }
  }

  // Other public APIs allowed
  return NextResponse.next();
}
```

---

## 📊 API RESPONSE CODES

### Success
```
200 OK              - Request successful
201 Created         - Resource created
204 No Content      - Success, no response body
```

### Client Errors
```
400 Bad Request     - Invalid parameters
401 Unauthorized    - Missing/invalid token (maintenance)
403 Forbidden       - Insufficient permissions
404 Not Found       - Resource not found
409 Conflict        - Data conflict
```

### Server Errors
```
500 Internal Server Error
503 Service Unavailable (during migration)
```

---

## 🔐 AUTHENTICATION HEADERS

All API requests should include:

```
Authorization: Bearer <JWT_TOKEN>

Example:
curl -X GET https://api.mpt-trading.com/api/dashboard/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Validation
- Token di-send oleh `/api/auth/login`
- Token stored di localStorage dan cookies
- Middleware validates token di setiap request
- Token includes user role untuk role checking

---

## 🧪 TESTING PROTECTED ENDPOINTS

### Test dengan Admin Token
```bash
# Get admin token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mpt.com","password":"password"}' \
  # Dapatkan token dari response

# Test protected endpoint
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return: 200 OK dengan user list
```

### Test dengan Regular User Token
```bash
# Get regular user token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mpt.com","password":"password"}' \
  # Dapatkan token dari response

# Test protected endpoint (should fail)
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return: 401 Unauthorized - Maintenance Mode Active
```

### Test Public Endpoints (No Token)
```bash
# Should work without token
curl -X GET http://localhost:3000/api/quiz/modules
# Should return: 200 OK dengan quiz modules

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mpt.com","password":"password"}'
# Should return: 200 OK dengan token
```

---

## 📋 ENDPOINT CHECKLIST FOR TESTING

Before going live, test these endpoints:

```
PUBLIC ENDPOINTS (Should all work)
☐ GET    /api/quiz/modules              → 200
☐ POST   /api/auth/login                → 200/401
☐ GET    /api/app/version               → 200

ADMIN ENDPOINTS (Regular user should get 401)
☐ GET    /api/admin/users               → 401
☐ GET    /api/dashboard/stats           → 401
☐ POST   /api/cosmos/backup             → 401

ADMIN ENDPOINTS (Admin user should get 200)
☐ GET    /api/admin/users               → 200
☐ GET    /api/dashboard/stats           → 200
☐ POST   /api/cosmos/backup             → 200

PAGE ROUTES (Regular user should redirect)
☐ GET    /dashboard                     → 307 to /maintenance-migration
☐ GET    /admin-hq                      → 307 to /maintenance-migration
☐ GET    /leaderboard                   → 307 to /maintenance-migration

PAGE ROUTES (Admin user should get 200)
☐ GET    /dashboard                     → 200
☐ GET    /admin-hq                      → 200
☐ GET    /leaderboard                   → 200
```

---

## 🚨 COMMON ERRORS & SOLUTIONS

### Error: 401 Unauthorized - Maintenance Mode Active
**Cause**: User is not admin or token is invalid
**Solution**: 
- Verify user role is ADMIN or SUPER_ADMIN
- Verify token is valid (not expired)
- Re-authenticate if needed

### Error: 307 Temporary Redirect
**Cause**: Middleware redirecting to maintenance page
**Solution**:
- This is expected for regular users
- Check response Location header for redirect target
- Should redirect to /maintenance-migration

### Error: CORS Error
**Cause**: Cross-origin request being blocked
**Solution**:
- Check CORS headers in API response
- Verify request origin is whitelisted
- Check if mobile app has access to API

### Error: Token Expired
**Cause**: JWT token has expired
**Solution**:
- Use refresh token to get new token
- Implement auto-refresh in client
- Clear old tokens from storage

---

## 📈 MONITORING API ENDPOINTS

### What to Monitor
```
1. Request Count by Route
   └─ Track which endpoints get most traffic

2. Response Time by Route
   └─ Alert if response time > 2 seconds

3. Error Rate
   └─ Alert if error rate > 5%
   └─ Track 401/403 spikes (expected during maintenance)

4. Admin API Usage
   └─ Log all admin API calls (security audit)
   └─ Alert on unusual patterns

5. Public API Health
   └─ Ensure quiz API always accessible
   └─ Monitor download API performance
```

### Recommended Monitoring Tools
- **Vercel Analytics**: Built-in endpoint monitoring
- **Datadog/New Relic**: APM for detailed metrics
- **Azure Monitor**: Cosmos DB specific metrics
- **CloudFlare**: CDN and WAF analytics

---

## 🔄 POST-MAINTENANCE CHANGES

When disabling maintenance mode:

```
1. All endpoints immediately accessible
2. Regular users can access protected routes
3. Admin dashboard still works
4. No more redirects to /maintenance-migration
5. Remove or update monitoring rules
```

---

**Last Updated**: January 15, 2026
**Version**: 1.0
**Status**: Production Ready

