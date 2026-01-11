# 🚀 MPT Warrior - Mobile Deployment Quick Start

## ⚡ Tldr - 5 Langkah Build & Deploy

### 1️⃣ Setup EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2️⃣ Build APK
```bash
eas build -p android --profile preview
# Tunggu 5-10 menit, dapat link download
```

### 3️⃣ Deploy ke Vercel
```bash
git push origin main
# Vercel auto-deploy
```

### 4️⃣ Share dengan Users

**Android:**
```
Download link: https://mpt-warrior.vercel.app/downloads/mpt-warrior.apk
```

**iPhone:**
```
1. Open in Safari: https://mpt-warrior.vercel.app
2. Tap Share → "Add to Home Screen"
3. Done! App di home screen
```

**Desktop:**
```
Scan QR Code di website untuk download link
```

### 5️⃣ Monitor Push Notifications
```bash
# Test notification
curl -X POST https://mpt-warrior.vercel.app/api/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello Warrior!","body":"Welcome to MPT"}'
```

---

## 📋 Checklist Sebelum Production

- [ ] Update `app.json` version & versionCode
- [ ] Test APK di Android device
- [ ] Verify PWA di iPhone Safari
- [ ] Check push notifications working
- [ ] Verify offline mode
- [ ] Test device detection (Android/iOS/Desktop)
- [ ] Firebase credentials di Vercel env vars

---

## 🎯 Target Features

### ✅ Completed
- [x] Device detection (Android/iOS/Desktop)
- [x] Android APK build config
- [x] iOS PWA install guide
- [x] Push notifications setup (FCM)
- [x] Landing page with smart CTAs
- [x] Service worker optimization
- [x] Manifest.json iOS compatible

### 📅 Next Phase
- [ ] In-app analytics tracking
- [ ] Crash reporting
- [ ] Performance monitoring
- [ ] User engagement metrics
- [ ] A/B testing for CTAs

---

## 🔗 Useful Links

- **EAS Build Status**: https://expo.dev/builds
- **Firebase Console**: https://console.firebase.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **App Metrics**: [Dashboard Link]

---

**Remember**: Focus on the Plan, Not the Panic! 🎯⚔️
