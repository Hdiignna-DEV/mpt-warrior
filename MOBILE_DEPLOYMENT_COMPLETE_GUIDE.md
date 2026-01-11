# 🚀 MOBILE APP DEPLOYMENT GUIDE - COMPLETE

Panduan lengkap untuk build dan deploy aplikasi MPT Command Center ke Android (APK via EAS) dan iOS (PWA).

---

## 📋 CHECKLIST SEBELUM MEMULAI

- [ ] EAS CLI terinstall: `npm install -g eas-cli`
- [ ] Akun Expo: https://expo.dev (daftar gratis)
- [ ] Akun Firebase: https://console.firebase.google.com (untuk FCM)
- [ ] GitHub repository connected ke Vercel
- [ ] Environment variables di Vercel sudah lengkap

---

## FASE 1: SETUP EAS CLI & KONFIGURASI

### 1.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 1.2 Login ke Expo Account

```bash
eas login
```

Masukkan email dan password akun Expo Anda.

### 1.3 Initialize EAS Project

```bash
eas init
```

Ini akan create/update `app.json` dengan EAS project ID.

### 1.4 Verify `app.json` Configuration

Pastikan `app.json` sudah benar:

```json
{
  "expo": {
    "name": "MPT Command Center",
    "slug": "mpt-warrior",
    "version": "1.0.1",
    "runtimeVersion": "1.0.1",
    "android": {
      "package": "com.mptcommandcenter.app",
      "versionCode": 2,
      "icon": "./public/mpt-logo.png",
      "splash": {
        "image": "./public/mpt-logo.png",
        "backgroundColor": "#0f172a"
      },
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.VIBRATE"
      ]
    }
  }
}
```

**Penting:**
- `package`: Unique identifier untuk Android (reverse domain format)
- `name`: Nama aplikasi yang muncul di home screen
- `icon`: Path ke logo PNG (192x192 atau lebih)
- `versionCode`: Increment setiap build baru

---

## FASE 2: BUILD APK VIA EAS CLI

### 2.1 Build Android APK (Preview/Development)

```bash
eas build -p android --profile preview
```

**Profile Options:**
- `preview` - Development APK (cepat, 5-10 menit)
- `production` - Release APK untuk Google Play (lebih lama, optimized)

### 2.2 Monitor Build Status

```bash
eas build:list
```

Atau lihat status di: https://expo.dev (login dashboard)

### 2.3 Download APK

Build selesai? APK tersedia di dashboard Expo atau via link download.

File APK akan bernama: `mpt-warrior.apk` atau sesuai slug.

---

## FASE 3: HOST APK DI VERCEL

### 3.1 Tentukan lokasi APK

Pilih salah satu:

**Option A: Host di `/public/downloads/`** (Recommended)

```
public/
├── downloads/
│   └── mpt-warrior.apk          # File APK (~50-80 MB)
├── manifest.json
├── mpt-logo.png
└── service-worker.js
```

**Option B: Host di cloud storage (Azure Blob/Google Cloud)**

Untuk file besar, gunakan cloud storage untuk efficiency.

### 3.2 Upload APK ke Vercel

**Metode 1: Via Git (Simple)**

1. Download APK dari Expo dashboard
2. Copy ke `public/downloads/mpt-warrior.apk`
3. Commit & push ke GitHub
4. Vercel otomatis redeploy

```bash
git add public/downloads/mpt-warrior.apk
git commit -m "📱 Update APK v1.0.1"
git push
```

**Metode 2: Via Vercel CLI**

```bash
# Install vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy dengan APK
vercel --prod
```

### 3.3 Verify APK Download Link

Test link:
```
https://mpt-community.vercel.app/downloads/mpt-warrior.apk
```

Atau di halaman `/get-app`:
```
https://mpt-community.vercel.app/get-app
```

---

## FASE 4: SETUP FIREBASE CLOUD MESSAGING (FCM)

### 4.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project" → "MPT Command Center"
3. Enable Google Analytics (optional)
4. Create project

### 4.2 Setup Web App (untuk PWA)

1. Di Firebase Console → "Project Settings"
2. Tab "Service Accounts"
3. Generate new private key → save `firebase-service-key.json`
4. Copy config credentials

### 4.3 Add Web App & Get Config

1. "Project Settings" → "General"
2. Scroll down, click "Add app" → Web
3. Copy config:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### 4.4 Setup Vercel Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=... (lihat step 4.5)
FIREBASE_ADMIN_SDK_KEY=... (server-side)
```

### 4.5 Generate VAPID Key

Di Firebase Console:

1. Messaging → "Cloud Messaging" tab
2. Scroll ke "Web configuration"
3. Copy "Server API Key" (untuk VAPID)

Atau generate via:
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
firebase messaging:get-key <project-id>
```

### 4.6 Install Firebase Packages

```bash
npm install firebase
```

---

## FASE 5: OPTIMIZE PWA UNTUK iOS

### 5.1 Manifest.json Sudah Optimal ✅

- `display: "standalone"` - Full screen tanpa address bar
- `theme_color: "#0f172a"` - Dark theme
- Apple touch icon: `/mpt-logo.png`

### 5.2 Service Worker Support ✅

Service worker sudah configured di:
- `/public/service-worker.js` - Caching & offline support
- Push notification handling built-in

### 5.3 iOS Specific Meta Tags ✅

Di `src/app/layout.tsx`:

```typescript
appleWebApp: {
  capable: true,
  statusBarStyle: "black-translucent",
  title: "MPT Command Center",
  startupImage: [
    { url: "/mpt-logo.png", sizes: "180x180" },
    { url: "/mpt-logo.png", sizes: "192x192" },
  ],
}
```

### 5.4 Test di iOS Safari

1. Buka di iPhone Safari: `https://mpt-community.vercel.app/get-app`
2. Tap Share button → "Add to Home Screen"
3. Pilih nama: "MPT Command Center"
4. Tap "Add"
5. Aplikasi muncul di home screen sebagai app

---

## FASE 6: WARRIOR ACCESS - DEVICE DETECTION

### 6.1 Sudah Implemented ✅

File: `src/components/WarriorAccessSection.tsx`

**Features:**
- ✅ Android detection → Show "Download APK" button
- ✅ iOS detection → Show "Add to Home Screen" guide
- ✅ Desktop detection → Show QR Code

### 6.2 Custom User Detection Hook

```typescript
// src/hooks/useDeviceDetection.ts
export enum DeviceType {
  ANDROID = 'android',
  iOS = 'ios',
  DESKTOP = 'desktop',
}

export interface Device {
  type: DeviceType;
  isAndroid: boolean;
  isIOS: boolean;
  isDesktop: boolean;
  userAgent: string;
}

export const useDeviceDetection = (): Device => {
  // Implementation sudah ada
};
```

### 6.3 Customize Pesan per Device

Edit `src/components/WarriorAccessSection.tsx`:

```tsx
// Android message
{device.isAndroid && (
  <h2 className="...">Download MPT Trading HUB APK</h2>
  // Customize pesan Android
)}

// iOS message  
{device.isIOS && (
  // Customize pesan iOS
)}

// Desktop message
{device.isDesktop && (
  // QR Code shown
)}
```

---

## FASE 7: PUSH NOTIFICATIONS (ADVANCED)

### 7.1 Request Permission

Otomatis request di saat login/onboarding:

```typescript
import { useFCM } from '@/hooks/useFCM';

export function MyComponent() {
  const { requestToken } = useFCM();
  
  useEffect(() => {
    requestToken();
  }, []);
}
```

### 7.2 Send Notification (Backend)

Setup Firebase Admin SDK untuk backend:

```bash
npm install firebase-admin
```

Create `src/utils/fcm-admin.ts`:

```typescript
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK_KEY || '{}'
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (tokens: string[], payload: any) => {
  const message = {
    notification: payload.notification,
    data: payload.data,
    android: { priority: 'high' },
    apns: { headers: { 'apns-priority': '10' } },
  };

  return admin.messaging().sendMulticast({
    tokens,
    ...message,
  });
};
```

### 7.3 Send Dari Backend API

```typescript
// src/app/api/notifications/send/route.ts
import { sendNotification } from '@/utils/fcm-admin';

export async function POST(request: NextRequest) {
  const { recipients, title, body } = await request.json();

  try {
    const result = await sendNotification(recipients, {
      notification: { title, body },
      data: { timestamp: Date.now().toString() },
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
```

---

## 📊 TESTING CHECKLIST

### Android APK

- [ ] APK download berhasil via `/get-app`
- [ ] Instalasi APK di Android device
- [ ] App membuka dengan UI intact
- [ ] Semua fitur accessible (journal, calculator, etc)
- [ ] Push notification works (jika enabled)
- [ ] Offline mode works (caching)

### iOS PWA

- [ ] Website accessible di Safari iOS
- [ ] "Add to Home Screen" prompt appears
- [ ] App membuka tanpa address bar
- [ ] UI responsive
- [ ] Push notification works
- [ ] Offline mode works

### Desktop Web

- [ ] QR Code scannable
- [ ] Website responsive
- [ ] Install prompt appears (PWA banner)

---

## 🔄 UPDATE WORKFLOW (UNTUK UPDATE VERSI BARU)

### Update APK Versi Baru

1. Update `app.json`:
   ```json
   {
     "version": "1.0.2",
     "runtimeVersion": "1.0.2",
     "android": {
       "versionCode": 3  // Increment!
     }
   }
   ```

2. Build baru:
   ```bash
   eas build -p android --profile production
   ```

3. Download APK baru

4. Upload ke `/public/downloads/mpt-warrior.apk`

5. Push ke GitHub (Vercel auto-redeploy)

6. Users akan auto-prompted untuk update di app

---

## 🆘 TROUBLESHOOTING

### APK Terlalu Besar (>100MB)

**Solution:**
- Enable ProGuard/R8 obfuscation di `app.json`
- Remove unused dependencies
- Use dynamic imports di Next.js

### iOS "Add to Home Screen" Tidak Muncul

**Checklist:**
- ✅ manifest.json present di `/public`
- ✅ Meta tags di head (checked di `layout.tsx`)
- ✅ HTTPS enabled (Vercel = auto HTTPS)
- ✅ Service Worker registered

**Force Install:**
```
Safari → Share → Add to Home Screen
```

### Push Notification Tidak Masuk

**Checklist:**
- ✅ Firebase config benar
- ✅ FCM token saved di database
- ✅ VAPID key di env vars
- ✅ Service worker handling push event

---

## 📞 COMMAND REFERENCE

```bash
# EAS Commands
eas login                          # Login ke Expo
eas init                          # Initialize project
eas build -p android --profile preview    # Build debug APK
eas build -p android --profile production # Build release APK
eas build:list                    # Lihat semua build
eas build:view <build-id>         # Detail build tertentu
eas device:create                 # Create physical device profile

# Testing APK Lokal
npm install -g eas-cli-build-testing
eas build --local -p android      # Build di local machine

# Git Commands
git add public/downloads/mpt-warrior.apk
git commit -m "📱 Update APK v1.0.2"
git push                          # Trigger Vercel deploy

# Vercel CLI
npm install -g vercel
vercel --prod                     # Deploy to production
vercel env:list                   # Lihat env vars
```

---

## 📈 NEXT STEPS

1. ✅ **Build APK** via EAS
2. ✅ **Host APK** di Vercel
3. ✅ **Setup Firebase** untuk FCM
4. ✅ **Test PWA** di iOS
5. ✅ **Enable Push Notifications**
6. 🔜 **Submit to Google Play Store** (optional)
7. 🔜 **Submit to Apple App Store** (optional, requires more setup)

---

## 📚 RESOURCES

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/eas-update/introduction/
- Firebase FCM: https://firebase.google.com/docs/cloud-messaging
- PWA Manifest: https://web.dev/add-manifest/
- Service Workers: https://web.dev/service-workers-cache-storage/

---

**Build Date:** January 2026  
**Status:** ✅ Production Ready
