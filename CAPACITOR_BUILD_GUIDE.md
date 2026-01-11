# MPT Command Center - Capacitor APK Build Guide

## 📱 Phase 1: Setup & Build APK

### Prerequisites
- Node.js >= 20.9.0
- Android SDK installed (API Level 34+)
- Java Development Kit (JDK 17+)
- Capacitor CLI: `npm install -g @capacitor/cli`

### Step 1: Build Static Web Export
```bash
npm run build
```
This generates the `/out` folder that Capacitor will package into APK.

### Step 2: Sync Capacitor
```bash
npx cap sync android
```
This copies the web build into the Android project.

### Step 3: Build Debug APK (Testing)
```bash
npx cap open android
```
This opens Android Studio. Then:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Wait for build to complete
3. File will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Build Release APK (Production)
```bash
# Generate signing key (if you don't have one)
keytool -genkey -v -keystore mpt-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpt-key

# Build release APK
npx cap build android --keystorepath ./mpt-keystore.jks --keystorealiasname mpt-key --keystorealiaspassword YOUR_PASSWORD --keystorepassword YOUR_PASSWORD
```

### Step 5: Install & Test on Device/Emulator
```bash
# Debug APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or using Android Studio's device manager
```

---

## 🔧 Configuration Files Modified

### 1. **next.config.ts**
- Changed `output` from `'standalone'` → `'export'` (Static Export)
- Set `images.unoptimized = true` (Required for static export)

### 2. **capacitor.config.json**
- Updated `webDir` from `.next/standalone/.next/static` → `out` (Next.js export directory)
- Configured splash screen (3000ms duration, dark background)
- App ID: `com.mpt.commandcenter`
- App Name: `MPT Command Center`

### 3. **src/app/layout.tsx**
- Added viewport meta: `maximumScale: 1, userScalable: false` (Disable pinch-to-zoom)
- Added `CapacitorInit` component for native initialization
- Status bar styling (Dark theme)

### 4. **src/app/globals.css**
- Added mobile touch-friendly button sizing (48px min height)
- Prevented text selection on buttons
- Touch action manipulation for zero-delay click feedback

### 5. **public/manifest.json**
- Updated icon paths to local assets
- Changed orientation to `portrait-primary`
- Set proper display mode: `standalone`

---

## 📋 Troubleshooting

### "Web directory not found"
- Run `npm run build` first to generate `/out` folder
- Then run `npx cap sync android`

### White flash on app startup
- Splash screen is configured in `capacitor.config.json`
- Adjust `launchShowDuration` if needed (in milliseconds)

### Status bar issues
- iOS: Check `StatusBar` plugin in Capacitor config
- Android: Status bar color set to `#0f172a` (dark navy)

### APK is too large
- Check `android/app/build.gradle` for unnecessary dependencies
- Consider enabling minification and ProGuard

---

## 🎯 Next Steps (Phase 2)

1. AI Memory - Persistent Chat History
2. Warrior's Path - Gamification System
3. Download Page with Device Detection

---

## 📞 Support

For Capacitor issues: https://capacitorjs.com/docs/android/build
For Next.js export issues: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
