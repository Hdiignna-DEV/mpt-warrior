# 🔐 Firebase & Environment Setup Guide

## Step-by-Step Setup untuk Push Notifications

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Project name: `MPT Warrior`
4. Enable Google Analytics (optional)
5. Create project

### 2. Get Firebase Credentials

#### A. Web App Configuration

1. Go to **Project Settings** (gear icon)
2. Click **"Your apps"** → **"</>"** (Add web app)
3. Register app name: `mpt-warrior-web`
4. Copy your `firebaseConfig`:

```javascript
// Your Firebase config looks like this:
{
  apiKey: "AIzaSyD...",
  authDomain: "mpt-warrior-123.firebaseapp.com",
  projectId: "mpt-warrior-123",
  storageBucket: "mpt-warrior-123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
}
```

#### B. Get VAPID Key (for Web Push)

1. Go to **Cloud Messaging** tab
2. Under "Web configuration", you'll see **VAPID keys**
3. If not there, click "Generate key pair"
4. Copy the VAPID key

#### C. Get Service Account (for Backend)

1. **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file securely
4. This is your `FIREBASE_ADMIN_SDK_KEY`

---

## 3. Add to Environment Variables

### Local Development (.env.local)

Create file `.env.local` di project root:

```
# Firebase Web Config (Public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mpt-warrior-123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mpt-warrior-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mpt-warrior-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=ABC123...XYZ789

# Firebase Admin SDK (Private - server-side only)
FIREBASE_ADMIN_SDK_KEY={...full json...}
```

### Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select project: `mpt-warrior`
3. Settings → Environment Variables
4. Add same variables as above
5. Make sure Production/Preview/Development are set correctly

**Recommended:**
- **All Environments** for NEXT_PUBLIC_* variables
- **Production only** for sensitive keys

---

## 4. Enable Cloud Messaging

1. Firebase Console → **Cloud Messaging** tab
2. Should show:
   - [ ] Sender ID
   - [ ] VAPID keys
   - [ ] Server key

If not enabled:
1. Go to APIs & Services
2. Search for "Cloud Messaging"
3. Enable it

---

## 5. Test Credentials

```bash
# 1. Start dev server
npm run dev

# 2. Check credentials are loaded
# Open browser console (F12)
# Paste in console:
console.log({
  apiKey: typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  vapidKey: typeof process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
})
# Should show all as "string"

# 3. Test service worker registration
# DevTools → Application → Service Workers
# Should show "activated and running"

# 4. Test notification permission
# Should see prompt to allow notifications
```

---

## 6. Android Specific Setup

### Android App Configuration in Firebase

1. Firebase Console → **Project Settings**
2. Click **"Add App"** → **Android**
3. Enter:
   - Package name: `com.mptcommandcenter.app`
   - SHA-1 certificate: (optional for development)
4. Download `google-services.json` (if needed)

### For EAS Build

The `eas.json` configuration sudah support FCM automatically.

---

## 7. iOS Specific Setup

### iOS doesn't need Firebase native integration!

PWA di iOS sudah support:
- ✅ Web Push API
- ✅ Service Workers
- ✅ Offline access
- ✅ Install to home screen

Cukup pastikan manifest.json benar (sudah done ✓)

---

## 8. Firebase Security Rules

### Firestore Rules (jika pakai Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow read for leaderboard
    match /leaderboard/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Server-side only
    }
  }
}
```

### Realtime Database Rules

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "leaderboard": {
      ".write": false
    }
  }
}
```

---

## 9. Testing Notifications

### Local Test

```bash
# Build server
npm run build

# Start
npm start

# In another terminal, send test notification:
curl -X POST http://localhost:3000/api/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test from MPT Warrior"
  }'
```

### Production Test

```bash
curl -X POST https://mpt-warrior.vercel.app/api/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Production Test",
    "body": "Notification system working!"
  }'
```

---

## 10. Troubleshooting

### Issue: Credentials not loading

```bash
# Check .env.local is in gitignore
cat .gitignore | grep env

# Restart dev server
npm run dev

# Check console for errors
```

### Issue: VAPID key error

```
Error: "VAPID key not found"

Solution:
1. Make sure NEXT_PUBLIC_FIREBASE_VAPID_KEY is set
2. Verify it's correct (long string starting with letters)
3. Check in Firebase Console Cloud Messaging tab
```

### Issue: Service Worker not registering

```bash
# Check:
1. https:// is used (not http://)
2. Public folder has service-worker.js
3. manifest.webmanifest is accessible
4. Browser allows service workers
```

### Issue: Notifications not showing

```
Check:
1. Notification.permission === 'granted' (in DevTools console)
2. FCM token is saved (POST /api/notifications/register-token)
3. Browser is not in Do Not Disturb mode
4. Notification sound settings
```

---

## 📚 Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Cloud Messaging**: https://firebase.google.com/docs/cloud-messaging
- **Web Push Guide**: https://web.dev/push-notifications-overview/
- **Service Worker**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

**Status**: ✅ Ready for Production
**Last Updated**: January 2026
