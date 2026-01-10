# App Update System - Architecture Documentation

## 🎯 Overview

MPT Warrior memiliki sistem update yang terintegrasi antara web dan mobile app:
- **Website** (`mpt-community.vercel.app`) - Mengelola versi dan push update notifications
- **Mobile App** - Automatically checks for updates saat startup

---

## 🔄 Update Flow

```
Mobile App Start
    ↓
updateService.initializeUpdateChecks()
    ↓
GET /api/app/version?version=X.X.X&platform=android
    ↓
Backend Returns:
  - currentVersion
  - forceUpdate (boolean)
  - downloadUrl
  - releaseNotes
    ↓
If forceUpdate:
    → Show Alert Dialog (Cannot dismiss)
    → User clicks "Update Now"
    → Opens Download Page
    ↓
If Optional Update:
    → Show Dialog (Can dismiss)
    → User can choose Update or Later
    ↓
Setup 24-hour Periodic Check
```

---

## 📁 File Structure

### Backend (Web)
```
src/app/api/app/version/
└── route.ts           # GET /api/app/version endpoint
```

### Mobile
```
mobile/src/services/
├── updates.ts         # Update checking service
└── notifications.ts   # Notification handling (updated)

mobile/
└── App.tsx            # Initialize updates on app start
```

---

## 🔧 API Endpoint

### Request
```
GET /api/app/version?version=1.0.0&platform=android
```

**Parameters:**
- `version` (required): Current app version (e.g., "1.0.0")
- `platform` (optional): "android" or "ios" (default: android)

### Response
```json
{
  "currentVersion": "1.0.0",
  "minRequiredVersion": "0.9.0",
  "hasUpdate": false,
  "updateAvailable": false,
  "forceUpdate": false,
  "downloadUrl": "https://mpt-community.vercel.app/downloads",
  "releaseNotes": "Release notes...",
  "releasedAt": "2026-01-10T12:00:00Z"
}
```

**Response Fields:**
- `currentVersion`: Latest app version on server
- `minRequiredVersion`: Minimum version required to use the app
- `hasUpdate`: If user's version has update available
- `updateAvailable`: Same as hasUpdate
- `forceUpdate`: If user MUST update (below min required version)
- `downloadUrl`: Where to download the update
- `releaseNotes`: What's new in the update
- `releasedAt`: When this version was released

---

## 📱 Mobile Service (updates.ts)

### Main Functions

#### `checkForUpdates()`
Calls `/api/app/version` and gets latest update info.

```typescript
const updateInfo = await updateService.checkForUpdates();
```

#### `checkAndNotifyUpdate()`
Checks for updates and shows appropriate dialog.

```typescript
await updateService.checkAndNotifyUpdate();
```

#### `initializeUpdateChecks()`
Setup automatic update checking when app starts.
- Checks once on startup
- Sets up 24-hour periodic checks
- Handles Expo OTA updates (if available)

#### `showForceUpdateDialog()`
Shows non-dismissible alert for required updates.

#### `showOptionalUpdateDialog()`
Shows dismissible alert for optional updates.

---

## 🔔 Notification Integration

When update is available, system can send push notification:

```typescript
await updateService.sendUpdateNotification(updateInfo);
```

Notification includes:
- Update available message
- Version number
- Download link
- Force/optional status

When user taps the notification:
- Opens download page
- Or triggers update flow

---

## 🚀 How to Release Updates

### Step 1: Update Backend Version
Edit `src/app/api/app/version/route.ts`:

```typescript
const CURRENT_VERSION = '1.1.0'; // New version
const MIN_REQUIRED_VERSION = '1.0.0'; // Minimum required
```

Update release notes in `getReleaseNotes()` function.

### Step 2: Build & Test

```bash
npm run build
npm run dev  # Test locally
```

Test with mobile app:
```bash
# In mobile folder
npm start  # Scan QR code
```

### Step 3: Push to GitHub

```bash
git add -A
git commit -m "release: Update to v1.1.0"
git push origin main
```

### Step 4: Vercel Auto-Deploy
Vercel will automatically deploy the changes to production.

### Step 5: Build & Release Mobile APK

```bash
cd mobile
bash build-apk.sh  # Build APK
# Upload to GitHub Releases
```

---

## 🔄 Update Behavior

### Scenario 1: User has OLD version (< minRequired)
- ⚠️ Force update alert appears
- Cannot dismiss
- Must click "Update Now"
- Opens download page
- After download/install, app works again

### Scenario 2: User has CURRENT version
- ✅ App is up to date
- No update dialog shown
- Message logged: "App is up to date"

### Scenario 3: User has NEW version (next release)
- 📦 Optional update alert
- Can dismiss or update
- "Update Later" button allows user to skip

---

## 🧪 Testing

### Test Endpoint Locally

```bash
# Test force update (old version)
curl "http://localhost:3000/api/app/version?version=0.8.0"

# Test optional update (slightly older)
curl "http://localhost:3000/api/app/version?version=0.9.5"

# Test up to date
curl "http://localhost:3000/api/app/version?version=1.0.0"
```

### Test Mobile App

1. Modify mobile app's version in `mobile/App.tsx`:
```typescript
const APP_VERSION = '0.8.0'; // Simulate old version
```

2. Run app and check console for update checks

3. Should see alert dialog for force update

---

## 📊 Version Comparison Logic

```
1.0.0 vs 1.0.0 = up to date (equal)
0.9.9 vs 1.0.0 = update available (older)
1.1.0 vs 1.0.0 = newer version (edge case, no update)
1.0 vs 1.0.0 = equal (zero padding)
```

---

## 🔐 Security Considerations

1. **No authentication required** for version check
   - Public information (latest version)
   - Safe to expose

2. **Version numbers are compared on client** (mobile)
   - Simple string comparison with semantic versioning
   - No external dependencies for logic

3. **Download URLs are fixed**
   - Links to public pages (GitHub Releases, download page)
   - No sensitive data in URLs

4. **Update notifications can be trusted**
   - Sent from verified backend
   - Can be used to trigger app update

---

## 🚨 Troubleshooting

### Update check hangs
- Check internet connection
- Verify API endpoint is working: `curl http://localhost:3000/api/app/version?version=1.0.0`

### Dialog not appearing
- Check console logs in mobile app
- Verify updateService is initialized in App.tsx
- Check notification permissions

### Wrong download URL
- Verify platform parameter is correct (android/ios)
- Check getDownloadUrl() function logic
- For Android: should point to GitHub Releases or direct APK link

### Force update stuck
- Cannot dismiss force update dialog (by design)
- User must tap "Update Now"
- Download app from provided URL
- Install and retry

---

## 📈 Future Enhancements

1. **Staged Rollout**: Release updates to 10% → 50% → 100% of users
2. **Beta Channel**: Separate beta version for testing
3. **Instant Update**: Use Expo Updates for instant OTA patches
4. **Analytics**: Track update adoption rates
5. **Rollback**: Ability to revert to previous version if issues found
6. **A/B Testing**: Test new features with subset of users

---

## 📞 Support

For update system issues:
1. Check `/api/app/version` endpoint (dev tools)
2. Check mobile app console logs
3. Verify version numbers match semantic versioning
4. Check network connectivity

---

**Current Version**: 1.0.0  
**Min Required**: 0.9.0  
**Last Updated**: 2026-01-10
