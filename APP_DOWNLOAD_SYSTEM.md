# 📱 MPT Warrior - App Download System (Non-Store)

## 🎯 Overview

Sistem yang memungkinkan user mengunduh MPT Warrior app langsung dari website tanpa perlu App Store/Play Store.

**3 Metode:**
1. **Android**: Direct APK download
2. **iOS**: Smart PWA (Progressive Web App)
3. **Web**: Full website access

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Landing Page: /get-app              │
│  (Auto-detect device, show buttons)     │
└──────────┬──────────────────────────────┘
           │
    ┌──────┴────────┬──────────────┐
    │               │              │
    ▼               ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│ Android APK │ │ iOS PWA  │ │   Web    │
│  Download   │ │ Add Home │ │  Access  │
└─────────────┘ └──────────┘ └──────────┘
```

---

## 📋 Components Created

### 1. **Landing Page** (`/src/app/get-app/page.tsx`)
- Device detection (Android/iOS/Web)
- Download button untuk Android
- Panduan instalasi untuk iOS
- FAQ/Troubleshooting
- Feature highlights

### 2. **PWA Configuration** 
- Updated `/public/manifest.json`
- Service Worker ready at `/public/service-worker.js`
- Icons configured
- Splash screen support

### 3. **Capacitor Setup** (`capacitor.config.json`)
- Android app configuration
- Splash screen settings
- App metadata

### 4. **APK Building Tools**
- `BUILD_APK_GUIDE.md` - Detailed step-by-step guide
- `setup-app-download.sh` - Bash setup script
- `setup-app-download.ps1` - PowerShell setup script

### 5. **Splash Screen** (`/src/components/app-splash-screen.tsx`)
- 3-second loading screen saat app dibuka
- Animated MPT logo
- Hanya tampil di native app (Capacitor)

---

## 🚀 Deployment Steps

### Step 1: Build Web App
```bash
npm run build
npm run start
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Build APK (Choose One)

**Option A: Using Android Studio (Recommended)**
```bash
# Initialize Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android --save
npx cap init "MPT Warrior" "com.mptwarrior.app"
npx cap add android

# Open in Android Studio
npx cap open android
# → Select Build → Generate Signed Bundle/APK
```

**Option B: Using Command Line**
```bash
cd android
./gradlew assembleRelease
# APK: android/app/release/app-release.apk
```

**Option C: Using Setup Script**
```bash
# Windows
.\setup-app-download.ps1

# Linux/Mac
bash setup-app-download.sh
```

### Step 4: Upload APK to Server
```bash
# Copy to public/downloads/
cp android/app/release/app-release.apk public/downloads/mpt-warrior.apk

# Or upload to Google Drive, AWS S3, atau Vercel Blob
```

### Step 5: Update Download URL
Edit `/src/app/get-app/page.tsx`:
```tsx
const apkUrl = "https://mpt-community.vercel.app/downloads/mpt-warrior.apk";
// atau ke CDN lain
```

---

## 📱 User Experience Flow

### Android Users
```
1. Visit /get-app
2. Page detects Android
3. Click "Download APK"
4. File downloads (~65MB)
5. Tap file → Install
6. Grant permissions
7. App opens with splash screen
8. Full app experience
```

### iOS Users
```
1. Visit /get-app via Safari
2. Page detects iOS
3. Show instructions
4. Tap Share → Add to Home Screen
5. Ikon app muncul di home screen
6. Tap ikon → App opens
7. Full web app experience (offline capable)
```

### Web Users
```
1. Visit website normally
2. Full web experience
3. Can install PWA if supported
```

---

## 🔧 Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Build | Next.js 14 | React web app |
| Deploy | Vercel | Global CDN |
| Native Wrapper | Capacitor | Android APK wrapper |
| PWA | Web APIs | iOS/offline support |
| Icons | Lucide React | UI icons |
| Styling | Tailwind CSS | Responsive design |

---

## 📦 File Structure

```
mpt-warrior/
├── src/
│   ├── app/
│   │   ├── get-app/
│   │   │   └── page.tsx          ← Download page
│   │   ├── page.tsx               ← Updated with app link
│   │   └── layout.tsx
│   └── components/
│       └── app-splash-screen.tsx  ← Splash component
├── public/
│   ├── manifest.json              ← PWA config
│   ├── service-worker.js          ← Offline support
│   ├── downloads/                 ← APK storage
│   │   └── mpt-warrior.apk
│   └── images/
├── capacitor.config.json          ← Capacitor config
├── BUILD_APK_GUIDE.md             ← APK build guide
├── setup-app-download.sh          ← Setup script (bash)
├── setup-app-download.ps1         ← Setup script (PowerShell)
└── package.json
```

---

## 🔐 Security Considerations

1. **APK Signing**
   - Generate keystore: `keytool -genkey -v -keystore mpt.keystore ...`
   - Sign APK dengan private key
   - Store keystore securely (not in git)

2. **Distribution**
   - Host APK di HTTPS (required by Android 11+)
   - Use CDN untuk download cepat
   - Verify SHA256 checksum

3. **Updates**
   - Manual update untuk sekarang
   - Dalam-app update notification
   - Version checking via API

---

## 📊 Monitoring

### Download Analytics
```typescript
// Track downloads
const trackDownload = (platform: 'android' | 'ios' | 'web') => {
  fetch('/api/analytics/download', {
    method: 'POST',
    body: JSON.stringify({ platform, timestamp: new Date() })
  });
}
```

### App Health
```bash
# Check if APK is accessible
curl -I https://mpt-community.vercel.app/downloads/mpt-warrior.apk

# Check PWA capabilities
npm run build  # Check manifest.json is served
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| APK tidak terunduh | Pastikan file ada di `public/downloads/` |
| iOS tidak bisa "Add to Home" | Gunakan Safari, bukan Chrome. Pastikan PWA manifest valid |
| App crash saat buka | Check Capacitor plugin config. Rebuild: `npx cap sync android` |
| Splash screen tidak tampil | Pastikan SplashScreen plugin installed: `npm install @capacitor/splash-screen` |
| Android install error | Enable "Unknown Sources" di Settings > Security |

---

## 🎯 Next Steps

1. ✅ Setup landing page
2. ✅ Configure PWA
3. ✅ Setup Capacitor
4. ⏳ Build APK
5. ⏳ Upload APK to server
6. ⏳ Deploy to Vercel
7. ⏳ Monitor downloads
8. ⏳ Setup auto-update system

---

## 📞 Support

For issues:
1. Check BUILD_APK_GUIDE.md for detailed APK building
2. Check /get-app page troubleshooting section
3. Review Capacitor docs: https://capacitorjs.com/docs

---

## 📅 Version History

- **v1.0.0** (2025-01-11)
  - Initial setup
  - Landing page with device detection
  - PWA configuration
  - Capacitor integration
  - APK building guide

