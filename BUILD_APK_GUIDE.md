# 📱 Build APK Guide - MPT Warrior

## Prerequisites
- Node.js >= 20.9.0
- Android SDK installed
- JAVA_HOME environment variable set
- Capacitor CLI: `npm install -g @capacitor/cli`

## Step 1: Install Capacitor & Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen
npm install --save-dev @types/capacitor
```

## Step 2: Build Next.js (Create out folder)
```bash
npm run build
```

## Step 3: Initialize Capacitor Project
```bash
npx cap init MPT Warrior com.mptwarrior.app
```

## Step 4: Add Android Platform
```bash
npx cap add android
```

## Step 5: Build & Open in Android Studio
```bash
npx cap build android
# atau
npx cap open android
```

## Step 6: Configure Signing Key (for Play Store)
Buat file `android/app/build.gradle`:
```gradle
android {
  signingConfigs {
    release {
      storeFile file("keystore.jks")
      storePassword System.getenv("KEYSTORE_PASSWORD")
      keyAlias System.getenv("KEY_ALIAS")
      keyPassword System.getenv("KEY_PASSWORD")
    }
  }
  
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

## Step 7: Build Release APK
```bash
# Android Studio: Build → Generate Signed Bundle/APK
# atau via command line:
cd android
./gradlew assembleRelease
# APK akan ada di: android/app/release/app-release.apk
```

## Step 8: Upload ke Server/Google Drive
```bash
# Contoh dengan gsutil (Google Cloud Storage):
gsutil cp android/app/release/app-release.apk gs://mpt-warrior-apk/

# atau upload manual ke Google Drive dan buat public link
```

## APK File Location
- Dev: `android/app/debug/app-debug.apk`
- Production: `android/app/release/app-release.apk`

## Testing APK
```bash
# Install ke emulator/device
adb install -r android/app/debug/app-debug.apk

# Uninstall
adb uninstall com.mptwarrior.app
```

## Troubleshooting

### Error: Gradle wrapper not found
```bash
cd android
./gradlew wrapper
```

### Error: Unable to locate Android SDK
```bash
# Set ANDROID_SDK_ROOT
export ANDROID_SDK_ROOT=/path/to/android/sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/tools
```

### Error: Insufficient permissions
```bash
chmod +x gradlew
```

## Quick Build Command
```bash
npm run build && npx cap build android && echo "✅ APK ready at android/app/release/app-release.apk"
```
