# MPT Warrior - Mobile App Deployment Guide

Complete guide untuk build dan deploy Android APK melalui EAS CLI, serta PWA optimization untuk iOS.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Android APK Build dengan EAS](#android-apk-build-dengan-eas)
3. [iOS PWA Installation](#ios-pwa-installation)
4. [Deployment ke Vercel/Server](#deployment-ke-vercelserver)
5. [Firebase Push Notifications Setup](#firebase-push-notifications-setup)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

### Diperlukan:
- ✅ Node.js >= 20.9.0
- ✅ npm atau yarn
- ✅ EAS CLI (`npm install -g eas-cli`)
- ✅ Expo account (https://expo.dev)
- ✅ Firebase project (https://console.firebase.google.com)

### Installation:
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login ke Expo/EAS
eas login
# Masukkan credentials Expo Anda

# Verify installation
eas --version
```

---

## 🚀 Android APK Build dengan EAS

### Step 1: Configure EAS Build Profile

File `eas.json` sudah ada di project root. Pastikan konfigurasi benar:

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "promptToConfigurePushNotifications": false
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "path/to/service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 2: Verify app.json Configuration

Check `app.json` untuk memastikan semua benar:

```json
{
  "expo": {
    "name": "MPT Command Center",
    "slug": "mpt-warrior",
    "version": "1.0.1",
    "android": {
      "package": "com.mptcommandcenter.app",
      "versionCode": 2
    }
  }
}
```

**Penting:**
- `name`: Nama yang tampil di app store/home screen
- `slug`: Unique identifier untuk Expo
- `package`: Package name Android (reverse domain notation)
- `versionCode`: Integer yang increment setiap build

### Step 3: Build APK untuk Preview (Recommended First)

```bash
# Build APK untuk testing (development build)
eas build -p android --profile preview

# Output: Akan mendapat download link untuk file .apk
```

**Process:**
1. EAS akan melakukan queue build
2. Build runs di cloud (5-10 menit)
3. Download link akan dikirim via email & ditampilkan di terminal
4. File APK siap untuk test di device

### Step 4: Build APK untuk Production

```bash
# Production build dengan full optimization
eas build -p android --profile production

# Atau untuk App Bundle (recommended untuk Google Play)
eas build -p android --profile production
```

### Step 5: Download & Distribute APK

```bash
# List recent builds
eas build:list

# Download specific build
eas build:download <build-id>
```

**Deployment Options:**

#### A. Direct Download (Simplest)
```bash
# Copy APK ke public folder
cp mpt-warrior.apk public/downloads/mpt-warrior.apk

# Deploy ke Vercel
vercel deploy
```

#### B. GitHub Releases
```bash
# Create release di GitHub
gh release create v1.0.1 ./mpt-warrior.apk --title "MPT Warrior v1.0.1"
```

#### C. Google Play Store
```bash
# Submit ke Google Play
eas submit -p android --latest
```

---

## 📱 iOS PWA Installation

iOS **tidak support** native APK, tetapi PWA bekerja sempurna sebagai app substitute.

### How iOS Users Install:

**Step 1: Open in Safari**
```
1. User buka website di Safari (MUST BE SAFARI)
2. Website load dengan service worker
```

**Step 2: Click Share Button**
```
1. Tap share icon (kotak dengan panah keluar)
2. Scroll down dan cari "Add to Home Screen"
3. Tap "Add to Home Screen"
```

**Step 3: App Added**
```
1. Tekan "Add" di pojok kanan atas
2. App sekarang ada di home screen seperti native app
3. Dapat diakses tanpa address bar
4. Bekerja offline with cached data
```

### PWA Features untuk iOS:
- ✅ Standalone mode (no address bar)
- ✅ Splash screen on launch
- ✅ App icon on home screen
- ✅ Push notifications (via Web Push API)
- ✅ Offline access (via Service Worker)
- ✅ Full screen experience

### Verification:
Check PWA readiness:
```bash
npm run mobile:check
```

---

## 🌐 Deployment ke Vercel/Server

### Option 1: Deploy ke Vercel (Recommended)

#### Prerequisites:
- GitHub repository terconnect
- Vercel account (https://vercel.com)

#### Steps:

1. **Connect GitHub**
```bash
# Already connected, push ke GitHub
git add .
git commit -m "Mobile app deployment: EAS build + PWA + FCM"
git push origin main
```

2. **Vercel Auto-Deploy**
- Vercel automatically deploy saat push ke main
- Environment variables sudah ter-setup

3. **Verify Deployment**
```bash
# Open deployed URL
open https://mpt-warrior.vercel.app
```

#### Set Environment Variables di Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=***
NEXT_PUBLIC_FIREBASE_APP_ID=***
NEXT_PUBLIC_FIREBASE_VAPID_KEY=***
```

### Option 2: Deploy ke Server Manual

```bash
# Build project
npm run build

# Start server
npm run start

# Atau gunakan PM2 untuk production
pm2 start "npm start" --name mpt-warrior
```

### Option 3: Docker Deployment

```bash
# Build image
docker build -t mpt-warrior .

# Run container
docker run -p 3000:3000 \
  -e FIREBASE_API_KEY=$FIREBASE_API_KEY \
  mpt-warrior
```

---

## 🔔 Firebase Push Notifications Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create new project: "MPT Warrior"
3. Enable Cloud Messaging

### Step 2: Get Credentials

1. **Go to Project Settings** → Service Accounts
2. **Generate new private key** (save untuk backend)
3. **Get VAPID Key**:
   - Cloud Messaging → Web configuration
   - Copy VAPID key

### Step 3: Add to Environment Variables

**Vercel:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
FIREBASE_ADMIN_SDK_KEY=... (for server-side)
```

**Local .env.local:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_VAPID_KEY=xxx
```

### Step 4: Generate Service Worker Config

Already done! Check `/public/service-worker.js`

### Step 5: Test Push Notifications

```bash
# Development
npm run dev

# Open app di browser
# Should see notification permission prompt

# Test sending:
curl -X POST http://localhost:3000/api/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Hello!"}'
```

---

## ✅ Testing & Verification

### Android APK Testing

```bash
# 1. Download APK dari EAS
eas build:download <build-id>

# 2. Install ke device/emulator
adb install mpt-warrior.apk

# 3. Test fitur:
# - Login
# - Navigation
# - Notifications
# - Offline mode
```

### PWA Testing

```bash
# 1. Local testing
npm run dev

# 2. Test di browser DevTools
# - Application tab → Service Workers
# - Check offline functionality

# 3. Test di Safari (iOS)
# - Open https://localhost:3000
# - Share → Add to Home Screen
```

### Push Notification Testing

```bash
# 1. Request permission (prompt should appear)
# 2. Test send:
curl -X POST https://mpt-warrior.vercel.app/api/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"MPT Warrior!"}'

# 3. Receive notification on device
```

### Device Detection Testing

```bash
# Test Android detection
# Open on Android device → Should show "Download APK" button

# Test iOS detection  
# Open on iPhone → Should show "Install on iPhone" button

# Test Desktop detection
# Open on laptop → Should show QR Code
```

---

## 🔧 Troubleshooting

### Issue: EAS Build Fails

```bash
# Clean cache
eas build:clean

# Rebuild with verbose
eas build -p android --profile preview --verbose
```

### Issue: APK Won't Install

```bash
# Check package name consistency
grep -r "mptcommandcenter" .

# Uninstall previous version first
adb uninstall com.mptcommandcenter.app

# Reinstall
adb install mpt-warrior.apk
```

### Issue: Service Worker Not Working

```bash
# Check Chrome DevTools:
# - Application tab
# - Service Workers section
# - Should show "activated and running"

# Clear cache:
chrome://settings/siteData
```

### Issue: Push Notifications Not Working

```bash
# Check browser console for errors
# Verify Notification.permission === 'granted'

# Check Firebase config:
console.log(firebaseConfig);

# Test token registration:
curl -X POST http://localhost:3000/api/notifications/register-token \
  -H "Content-Type: application/json" \
  -d '{"token":"your-fcm-token"}'
```

### Issue: iOS Install Not Showing Prompt

```
1. MUST use Safari (not Chrome)
2. MUST be full URL (https://...)
3. Check that:
   - manifest.webmanifest is accessible
   - Icons exist in public folder
   - Service worker is registered
```

---

## 📊 Version Management

### Update Version Numbers:

**app.json** (for EAS):
```json
{
  "version": "1.0.2",  // Semver
  "android": {
    "versionCode": 3   // Integer (must increment)
  }
}
```

**package.json**:
```json
{
  "version": "1.0.2"
}
```

### Tag Release:
```bash
git tag -a v1.0.2 -m "Release v1.0.2: Mobile deployment complete"
git push origin v1.0.2
```

---

## 📞 Support & Resources

- **EAS Documentation**: https://docs.expo.dev/eas
- **Firebase Console**: https://console.firebase.google.com
- **Vercel Docs**: https://vercel.com/docs
- **PWA Guide**: https://web.dev/progressive-web-apps
- **Service Worker API**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

## ✨ Next Steps

1. ✅ Build APK dengan EAS
2. ✅ Test di Android device
3. ✅ Deploy ke Vercel
4. ✅ Share download link dengan users
5. ✅ Monitor notifications & engagement
6. ✅ Gather user feedback
7. 🔄 Iterate & improve

---

**Last Updated**: January 2026
**Status**: Ready for Production
