# 📥 MPT Warrior - Download & Install

**Get the app running in 5 minutes - No app store needed!**

---

## 🎯 Pick Your Way

### 🟢 **Way 1: Expo (EASIEST - Recommended)**
Scan QR code or click link → App opens instantly

```bash
1. Install Expo Go app (free)
2. Scan QR code or click link
3. Done!
```

### 🔵 **Way 2: Android APK (DIRECT)**
Download file → Install on phone

```bash
1. Download MPT-Warrior.apk
2. Open on Android phone
3. Tap Install
4. Done!
```

### 🟣 **Way 3: iOS TestFlight**
Email link → Download on iPhone

```bash
1. Get TestFlight link via email
2. Tap on iPhone
3. Install from TestFlight
4. Done!
```

### 🟡 **Way 4: Run Locally**
For developers - run on your computer

```bash
npm install && npm start
```

---

## 📱 Download Links

| Platform | Method | Link |
|----------|--------|------|
| **Any Phone** | Expo QR | [Generate with eas publish] |
| **Android** | APK File | [Upload to drive] |
| **iOS** | TestFlight | [Create in App Store Connect] |
| **Any** | Source Code | https://github.com/Hdiignna-DEV/mpt-warrior |

---

## ⚡ Quick Start (For Developers)

```bash
cd mobile
npm install
npm start
```

Then:
- Scan QR code on your phone
- Or choose iOS/Android emulator

---

## 🏗️ Build Your Own APK

**On Windows:**
```bash
cd mobile
build-apk.bat
```

**On Mac/Linux:**
```bash
cd mobile
bash build-apk.sh
```

Takes 10-15 minutes. Then you'll have a `.apk` file to download and share!

---

## 💡 Which Option For Me?

**Fastest (users)?** → Expo QR code
**Offline install?** → Android APK
**Best for iPhone?** → TestFlight
**For testing?** → Run locally

---

## ✅ Requirements

### Minimum
- Phone: Android 10+ or iOS 13+
- Internet connection (for first sync)
- ~100MB storage

### For Building
- Node.js 18+
- npm
- EAS CLI

---

## 🆘 Having Issues?

### "App won't install on Android"
- ✅ Check Android version (need 10.0+)
- ✅ Settings → Security → Unknown Sources ON
- ✅ Delete old version first

### "Expo link doesn't work"  
- ✅ Install Expo Go app first
- ✅ Check internet connection
- ✅ Scan QR code instead

### "Can't build APK locally"
- ✅ Run: `npm install`
- ✅ Run: `eas login`
- ✅ Run: `npx expo prebuild`

---

## 🔗 Setup Your Own Distribution

### Option A: Use Expo (Easiest)
```bash
eas publish
# Get public link to share
```

### Option B: Host APK File
```bash
eas build --platform android --local
# Upload .apk to Google Drive/Dropbox
# Share download link
```

### Option C: TestFlight (iOS)
```bash
eas build --platform ios
# Setup in App Store Connect
# Share TestFlight link
```

---

## 📞 Need Help?

- **GitHub**: https://github.com/Hdiignna-DEV/mpt-warrior
- **Issues**: GitHub Issues section
- **Email**: support@mpt-warrior.app

---

## 🚀 You're Ready!

Pick an option above and start using MPT Warrior today!

**No app store. No waiting for approval. Just download and run.** ✅

---

**Last Updated**: January 10, 2026
