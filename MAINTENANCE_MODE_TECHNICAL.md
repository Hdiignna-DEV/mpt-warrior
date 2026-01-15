# MAINTENANCE MODE - TECHNICAL ARCHITECTURE DOCUMENTATION

**Document Type**: Technical Specification  
**Implementation Date**: January 15, 2026  
**Status**: Production Ready  
**Priority**: HIGH (Migration Critical)

---

## 📐 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Request (GET /dashboard)                              │
│         ↓                                                        │
│  2. Middleware Intercepts (middleware.ts)                      │
│         ├─ Check: MAINTENANCE_MODE environment variable        │
│         ├─ Extract: role from JWT token (cookie)              │
│         └─ Decision Point:                                     │
│                                                                  │
│     ┌─────────────────────────────────────────────────┐        │
│     │   Is MAINTENANCE_MODE enabled?                  │        │
│     └──────────────────┬──────────────────────────────┘        │
│            YES ↙                          ↘ NO                  │
│                                                                  │
│     ┌─────────────────────┐      ┌──────────────────────┐      │
│     │ Check User Role?    │      │ Allow Access        │      │
│     └──────────┬──────────┘      │ (Normal Operation)  │      │
│                │                 └──────────────────────┘      │
│     ┌──────────┴──────────┐                                     │
│     ↙ ADMIN/SUPERADMIN   ↘ MEMBER/PUBLIC                       │
│                                                                  │
│  ✅ BYPASS                    ❌ BLOCK                          │
│  └─ Allow all access         └─ Redirect to /maintenance      │
│  └─ Admin sees full website   └─ Show migration message        │
│  └─ Admin sees admin banner   └─ Admin banner NOT visible      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 REQUEST FLOW DIAGRAM

### Scenario 1: Member Trying to Access Dashboard
```
Member Login → /dashboard
       ↓
middleware.ts checks:
  ├─ token exists? ✅ YES (has valid JWT)
  ├─ MAINTENANCE_MODE? ✅ YES (enabled)
  ├─ user.role = MEMBER? ✅ YES
  └─ Is ADMIN/SUPERADMIN? ❌ NO
       ↓
REDIRECT to /maintenance
       ↓
/maintenance page loads with:
  ├─ "MPT IS EVOLVING" headline
  ├─ Migration explanation
  ├─ Download app links
  ├─ Status timeline
  └─ Admin banner → NOT VISIBLE
```

### Scenario 2: Admin Trying to Access Dashboard
```
Admin Login → /dashboard
       ↓
middleware.ts checks:
  ├─ token exists? ✅ YES (has valid JWT)
  ├─ MAINTENANCE_MODE? ✅ YES (enabled)
  ├─ user.role = ADMIN? ✅ YES
  └─ Is ADMIN/SUPERADMIN? ✅ YES
       ↓
ALLOW ACCESS → Full Dashboard
       ↓
Dashboard loads with:
  ├─ Yellow admin banner at top
  ├─ Text: "Admin Mode Active - Website is hidden from public"
  ├─ All features accessible
  └─ All APIs working normally
```

### Scenario 3: Member Trying to Access API
```
Member API Request → GET /api/leaderboard
       ↓
middleware.ts checks:
  ├─ API route detected? ✅ YES
  ├─ MAINTENANCE_MODE? ✅ YES
  ├─ token exists? ✅ YES
  └─ Check role from JWT token → MEMBER
       ↓
Is ADMIN/SUPERADMIN? ❌ NO
       ↓
Return Response:
  Status: 403 Forbidden
  Message: "Forbidden - Admin only during maintenance"
```

### Scenario 4: Admin Trying to Access API
```
Admin API Request → GET /api/user/profile
       ↓
middleware.ts checks:
  ├─ API route detected? ✅ YES
  ├─ MAINTENANCE_MODE? ✅ YES
  ├─ token exists? ✅ YES
  └─ Check role from JWT token → ADMIN
       ↓
Is ADMIN/SUPERADMIN? ✅ YES
       ↓
Allow API Access
       ↓
Return Response:
  Status: 200 OK
  Data: User profile data
```

---

## 🔐 ROLE MAPPING & TOKEN STRUCTURE

### JWT Token Structure
```json
{
  "userId": "user-123",
  "email": "admin@mpt.com",
  "role": "ADMIN",      // ← THIS is the key field
  "iat": 1234567890,
  "exp": 1234671890
}
```

### Role Validation Logic
```typescript
// Extract from JWT payload
const userRole = (verified.payload as any).role?.toUpperCase();

// Check against whitelist
if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
  // ✅ Can bypass maintenance mode
  return NextResponse.next();
} else {
  // ❌ Must follow maintenance redirect
  return NextResponse.redirect(new URL('/maintenance', request.url));
}
```

---

## 📝 CODE IMPLEMENTATION DETAILS

### Middleware Entry Point
**File**: `middleware.ts` (Lines 21-55)

```typescript
// Check maintenance mode status
const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

// For API routes with maintenance enabled
if (maintenanceMode && isApiRoute) {
  const token = request.cookies.get('token')?.value;
  
  // Verify token and extract role
  const verified = await jwtVerify(token, JWT_SECRET);
  const userRole = (verified.payload as any).role?.toUpperCase();
  
  // Check if admin
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden - Admin only during maintenance' },
      { status: 403 }
    );
  }
}
```

### Maintenance Page Client-Side Logic
**File**: `app/maintenance/page.tsx`

```typescript
useEffect(() => {
  // Decode JWT token to determine if user is admin
  const token = getCookie('token') as string;
  if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    const userRole = decoded.role?.toUpperCase();
    
    // If ADMIN or SUPER_ADMIN, show banner
    setIsAdmin(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN');
  }
}, []);

// Render admin banner conditionally
{isAdmin && (
  <div className="bg-yellow-500/20 border-b-2 border-yellow-500 text-yellow-300 px-4 py-3">
    <span>Admin Mode Active - Website is hidden from public</span>
  </div>
)}
```

---

## 🔄 ENVIRONMENT VARIABLE MANAGEMENT

### Location of Configuration
- **File**: `.env.local` (or `.env.production`, `.env.staging`)
- **Variable**: `MAINTENANCE_MODE`
- **Values**: 
  - `true` = Maintenance mode ACTIVE
  - `false` = Normal operation (default)

### How It's Used
```typescript
// In middleware.ts
const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

// Strict check for exact string value
// Only 'true' string enables maintenance mode
// Any other value (false, 'false', empty) disables it
```

---

## 🛡️ SECURITY CONSIDERATIONS

### 1. Token Verification
```
✅ All requests require valid JWT token
✅ Token is verified with JWT_SECRET
✅ Invalid tokens return 401 Unauthorized
✅ Expired tokens are rejected
```

### 2. Role-Based Access
```
✅ Role is extracted from JWT payload
✅ Role comparison is case-insensitive (converted to UPPERCASE)
✅ Only exact matches grant admin privileges
✅ Unknown roles are treated as regular users
```

### 3. API Route Protection
```
✅ API routes check MAINTENANCE_MODE first
✅ Maintenance mode enforcement at middleware level
✅ No special permissions needed to access /maintenance page
✅ Public routes bypass role checking
```

### 4. Data Safety
```
✅ No data is deleted during maintenance
✅ All user data remains in Cosmos DB
✅ Admin has full access to all data
✅ Session tokens remain valid
```

---

## 📊 ENVIRONMENT VARIABLE IMPACT

### When MAINTENANCE_MODE=false (Default)
```
Middleware Behavior:
├─ Public routes (/download, /login) → Accessible
├─ Protected routes (/dashboard, /modules) → Require login
├─ API routes (/api/*) → Require token, accessible
├─ /maintenance page → Redirects to /download
└─ Regular operation
```

### When MAINTENANCE_MODE=true
```
Middleware Behavior:
├─ Public routes (/download, /login) → Accessible
├─ Protected routes:
│  ├─ ADMIN/SUPERADMIN → Full access
│  └─ Others → Redirect to /maintenance
├─ API routes:
│  ├─ ADMIN/SUPERADMIN → Full access (200)
│  └─ Others → Forbidden (403)
├─ /maintenance page → Visible to all authenticated users
└─ Migration mode active
```

---

## 🔍 TESTING CHECKLIST

### Unit Test: Role Extraction
```typescript
✅ Test extracting role from JWT payload
✅ Test role case conversion (Admin → ADMIN)
✅ Test invalid JWT tokens
✅ Test expired tokens
✅ Test missing role field
```

### Integration Test: Maintenance Mode OFF
```typescript
✅ Member can access /dashboard (200 OK)
✅ Member can access /modules (200 OK)
✅ Member can access /api/leaderboard (200 OK)
✅ /maintenance redirects to /download
```

### Integration Test: Maintenance Mode ON
```typescript
✅ Member redirected to /maintenance
✅ Admin can access /dashboard (200 OK)
✅ Admin can access /api/* (200 OK)
✅ Member gets 403 on /api/* calls
✅ Admin sees yellow banner on /maintenance (if visits)
✅ Member doesn't see admin banner
```

---

## 🚨 ERROR HANDLING

### Error Case 1: Missing Token During Maintenance
```
Request: GET /api/leaderboard
Status: 401 Unauthorized
Body: { error: 'Unauthorized - Maintenance mode active' }
```

### Error Case 2: Invalid Token
```
Request: GET /dashboard (with corrupted token)
Status: Redirects to /login
Reason: jwtVerify() throws error → catch block
```

### Error Case 3: Member API Access
```
Request: GET /api/user/profile (Member token)
Status: 403 Forbidden
Body: { error: 'Forbidden - Admin only during maintenance' }
```

### Error Case 4: Missing JWT_SECRET
```
Fallback: 'your-secret-key'
Status: All tokens fail verification
Action: Check .env.local for JWT_SECRET
```

---

## 📈 DEPLOYMENT FLOW

```
┌─────────────────────────────────────────┐
│ 1. Edit .env.local                     │
│    MAINTENANCE_MODE=true               │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ 2. Commit Changes                      │
│    git add .env.local                  │
│    git commit -m "activate maintenance" │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ 3. Push to Repository                  │
│    git push origin main                │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ 4. CI/CD Pipeline Triggers             │
│    (GitHub Actions / Azure DevOps)     │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ 5. Build & Deploy to Production        │
│    npm run build                       │
│    Deploy to Vercel / Azure            │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ 6. Verify in Production                │
│    - Test with admin account           │
│    - Verify member is blocked          │
│    - Check API access                  │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ MAINTENANCE MODE ACTIVE ✅             │
│ Migration Can Begin                    │
└─────────────────────────────────────────┘
```

---

## 📞 TROUBLESHOOTING GUIDE

| Issue | Cause | Solution |
|-------|-------|----------|
| Admin still blocked | Wrong role in token | Verify JWT token has role='ADMIN' or 'SUPER_ADMIN' |
| Member can access API | MAINTENANCE_MODE not set | Check .env.local, set to 'true' |
| Maintenance page doesn't load | Missing /maintenance route | Verify app/maintenance/page.tsx exists |
| Admin banner not showing | Client-side token decode fails | Check jwt-decode package installed |
| Environment not updating | Cache issue | Clear .next folder: `rm -rf .next` |

---

## ✅ SIGN-OFF

**Implementation Verified**: ✅  
**Security Reviewed**: ✅  
**Testing Complete**: ✅  
**Documentation Complete**: ✅  
**Ready for Production**: ✅

**Approved by**: Tim Development  
**Date**: January 15, 2026  
**Status**: READY TO DEPLOY 🚀

---

## 📚 RELATED FILES

1. [Maintenance Mode Implementation Guide](./MAINTENANCE_MODE_IMPLEMENTATION.md)
2. [Quick Start Checklist](./MAINTENANCE_MODE_QUICK_START.md)
3. [Middleware Implementation](./middleware.ts)
4. [Maintenance Page Component](./app/maintenance/page.tsx)
5. [Environment Configuration](../.env.maintenance)

---

**Last Updated**: January 15, 2026  
**Revision**: 1.0  
**Status**: Final Version - Production Ready
