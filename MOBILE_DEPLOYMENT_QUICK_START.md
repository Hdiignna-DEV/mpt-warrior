# 📱 MOBILE APP DEPLOYMENT - QUICK START (FASE 1-4)

**Tanggal:** January 2026  
**Status:** ✅ READY TO DEPLOY

---

## 🎯 YANG SUDAH DIKERJAKAN

### ✅ 1. Android APK Build Configuration
- `app.json` diupdate dengan nama "MPT Command Center"
- EAS project ID configured
- Android permissions sudah set (INTERNET, NOTIFICATIONS, VIBRATE)

### ✅ 2. iOS PWA Optimization
- `manifest.json` dioptimasi untuk iOS
- Service Worker upgraded dengan push notification support
- Meta tags di `layout.tsx` sudah iOS-friendly
- Apple touch icon configured

### ✅ 3. Warrior Access Landing Page (Device Detection)
- **File:** `src/components/WarriorAccessSection.tsx`
- ✅ Android users → Download APK button
- ✅ iOS users → Add to Home Screen guide
- ✅ Desktop users → QR Code untuk scan

### ✅ 4. Firebase Cloud Messaging (FCM) Setup
- **FCM Service:** `src/utils/fcm.ts`
- **FCM Hook:** `src/hooks/useFCM.ts`
- **API Endpoint:** `src/app/api/user/fcm-token/route.ts`
- **Service Worker:** Push notification event handlers
- **Firebase Messaging SW:** `public/firebase-messaging-sw.js`

---

## 🚀 QUICK START GUIDE (5 LANGKAH)

### LANGKAH 1️⃣: Install & Login ke Expo

```bash
# Install EAS CLI (global)
npm install -g eas-cli

# Login ke akun Expo (atau daftar gratis di https://expo.dev)
eas login
```

### LANGKAH 2️⃣: Build Android APK

```bash
# Build APK (mode preview = cepat, 5-10 menit)
eas build -p android --profile preview

# Atau production quality (lebih lama tapi optimized)
eas build -p android --profile production
```

**Output:** APK tersedia di Expo dashboard atau download link dikirim via email.

### LANGKAH 3️⃣: Upload APK ke Vercel

**Option A: Via Git (Recommended)**

```bash
# 1. Download APK dari Expo dashboard
# 2. Copy ke folder
mkdir -p public/downloads
cp ~/Downloads/mpt-warrior.apk public/downloads/

# 3. Commit & push
git add public/downloads/mpt-warrior.apk
git commit -m "📱 Update APK v1.0.1"
git push
```

Vercel otomatis redeploy.

**Option B: Via Vercel CLI**

```bash
npm install -g vercel
vercel --prod
```

### LANGKAH 4️⃣: Test Download Link

Buka di browser:
```
https://mpt-community.vercel.app/get-app
```

Verify:
- ✅ Android users → See download button
- ✅ iOS users → See "Add to Home Screen" guide
- ✅ Desktop users → See QR code

### LANGKAH 5️⃣: (Optional) Setup Firebase FCM

Untuk push notifications:

```bash
# 1. Go to https://console.firebase.google.com
# 2. Create new project → "MPT Command Center"
# 3. Add Web app → copy credentials

# 4. Add to .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
# ... (lihat .env.example)

# 5. Redeploy
git push
```

---

## 📊 DEPLOYMENT STATUS

| Komponen | Status | File |
|----------|--------|------|
| app.json (APK config) | ✅ Done | `app.json` |
| EAS Build config | ✅ Done | `app.json` + `eas.json` |
| PWA manifest | ✅ Done | `public/manifest.json` |
| Service Worker | ✅ Done | `public/service-worker.js` |
| iOS meta tags | ✅ Done | `src/app/layout.tsx` |
| Device detection | ✅ Done | `src/components/WarriorAccessSection.tsx` |
| FCM integration | ✅ Done | `src/utils/fcm.ts` + API |
| Firebase SW | ✅ Done | `public/firebase-messaging-sw.js` |

---

## 🔗 DOWNLOAD LINKS (SETELAH DEPLOYMENT)

| Platform | Link | Type |
|----------|------|------|
| Android | `/downloads/mpt-warrior.apk` | Direct download |
| iOS | `/get-app` → "Add to Home Screen" | PWA |
| Website | `/get-app` | Smart detection |
| QR Code | `/get-app` (desktop) | Scan di phone |

---

## 📋 TESTING CHECKLIST

### Android APK Testing

- [ ] Download APK dari `/get-app` (Android device)
- [ ] Install berhasil
- [ ] App opening screen OK
- [ ] UI responsive
- [ ] All features accessible
- [ ] Push notifications work (optional)

### iOS PWA Testing

- [ ] Open `/get-app` di Safari iOS
- [ ] "Add to Home Screen" prompt appears
- [ ] Add to home screen berhasil
- [ ] App opens fullscreen (no address bar)
- [ ] Offline mode works
- [ ] Push notifications work (optional)

### Desktop Testing

- [ ] QR code visible & scannable
- [ ] Website fully responsive
- [ ] Install prompt appears (PWA banner)

---

## 🆘 TROUBLESHOOTING

### "APK not found" atau download link broken

**Solution:**
```bash
# Verify APK location
ls -la public/downloads/

# Rebuild if needed
npm run build
git push  # Vercel redeploys
```

### iOS "Add to Home Screen" tidak muncul

**Checklist:**
- [ ] manifest.json exists di `/public`
- [ ] Service worker registered (check console)
- [ ] HTTPS enabled (✅ Vercel = auto HTTPS)
- [ ] Clear Safari cache & try again

**Force method:**
```
Safari → Share button → Add to Home Screen
```

### FCM Token tidak saved

**Check:**
1. Firebase credentials di `.env.local`
2. Service Worker registered (console)
3. User logged in (token akan request saat login)
4. Check browser console untuk errors

---

## 🔄 UPDATE WORKFLOW

Untuk update aplikasi ke versi baru:

```bash
# 1. Update version di app.json
# "version": "1.0.2"
# "android": { "versionCode": 3 }

# 2. Build baru
eas build -p android --profile production

# 3. Download & upload
cp ~/Downloads/mpt-warrior-v1.0.2.apk public/downloads/mpt-warrior.apk

# 4. Push
git add .
git commit -m "📱 Update APK to v1.0.2"
git push
```

Users akan notif untuk update (di Android app).

---

## 📚 FULL DOCUMENTATION

Untuk detail lengkap, lihat:
```
📄 MOBILE_DEPLOYMENT_COMPLETE_GUIDE.md
```

Berisi:
- EAS CLI installation & setup
- APK build process lengkap
- Firebase FCM configuration
- Push notification implementation
- iOS PWA configuration
- Troubleshooting guide
- Google Play Store submission (optional)

---

## ✨ NEXT STEPS

**Immediate:**
1. Run `eas login`
2. Run `eas build -p android --profile preview`
3. Download APK & upload ke Vercel

**Coming Soon:**
- [ ] Google Play Store submission
- [ ] Apple App Store submission (requires Apple Developer account)
- [ ] App Store Optimization (ASO)
- [ ] Analytics integration (Firebase Analytics)

---

## 📞 QUICK COMMANDS

```bash
# Expo/EAS
eas login
eas build -p android --profile preview
eas build:list
eas build:view <build-id>

# Git (APK upload)
git add public/downloads/mpt-warrior.apk
git commit -m "📱 Update APK"
git push

# Vercel CLI
npm install -g vercel
vercel --prod
vercel env:list

# Next.js
npm run build
npm run dev
npm run lint
```

---

## 🎉 YOU'RE READY!

Semua infrastructure sudah siap. Tinggal:
1. Build APK via EAS
2. Upload ke Vercel
3. Users bisa download dari `/get-app`

**Good luck! 🚀**

---

**Last Updated:** January 2026  
**Version:** 1.0.1  
**Made with ❤️ for MPT Warriors**
