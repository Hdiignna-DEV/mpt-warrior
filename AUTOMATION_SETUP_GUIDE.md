# 🚀 SETUP AUTOMATION - Website → Mobile App

## Status: COMPLETE AUTOMATION SETUP

Saya akan setup full automation untuk:
1. ✅ Mobile app sama persis dengan website
2. ✅ Otomatis download dari vercel.app
3. ✅ Otomatis build & deploy APK
4. ✅ UI mobile-first

---

## 📊 Step-by-Step Automation

### STEP 1: Setup Mobile App to Mirror Website Structure

**Copy website pages ke mobile app screens:**

```
Website Pages → Mobile App Screens

src/app/dashboard/          → mobile/app/(dashboard)/
src/app/ai-mentor/          → mobile/app/(chat)/
src/app/journal/            → mobile/app/(journal)/
src/app/profile/            → mobile/app/(profile)/
src/app/achievements/       → mobile/app/(achievements)/
src/app/leaderboard/        → mobile/app/(leaderboard)/
src/app/calculator/         → mobile/app/(calculator)/
```

### STEP 2: Setup Shared Services

**Create shared API services** untuk digunakan website & mobile:

```
Website:  src/services/
Mobile:   mobile/services/

API Client     (Axios)
Auth Service   (Login/Register)
Chat Service   (AI Mentor)
Journal Service (Trades)
Profile Service
Achievements Service
```

### STEP 3: Build Pipeline Setup

**Automated build & upload:**

```
Code Push
  ↓
GitHub Workflow
  ↓
EAS Build (APK)
  ↓
Upload to Vercel
  ↓
Available for download
  ↓
Users download from website ✅
```

### STEP 4: Download Link Integration

**Add download page ke website:**

```
Website: src/app/downloads/page.tsx

Shows:
  • Latest APK version
  • Download button
  • Features list
  • Requirements
  • Changelog
```

---

## 🔧 Implementation Guide

### Part 1: Sync Mobile App with Website

**Step 1.1: Copy Components**

Website components yang bisa reuse di mobile:
- Button, Input, Card, Modal, etc
- Copy dari `src/components/` ke `mobile/components/`

**Step 1.2: Copy Hooks**

- `useAuth()` → Login/Register logic
- `useChat()` → Chat logic
- `useJournal()` → Trading journal logic
- Copy dari `src/hooks/` ke `mobile/hooks/`

**Step 1.3: Create Mobile Screens**

```
mobile/app/
├── (tabs)/
│   ├── (dashboard)/
│   │   └── index.tsx          (from src/app/dashboard/)
│   ├── (chat)/
│   │   └── index.tsx          (from src/app/ai-mentor/)
│   ├── (journal)/
│   │   └── index.tsx          (from src/app/journal/)
│   ├── (profile)/
│   │   └── index.tsx          (from src/app/profile/)
│   └── (more)/
│       ├── achievements.tsx   (from src/app/achievements/)
│       ├── leaderboard.tsx    (from src/app/leaderboard/)
│       └── calculator.tsx     (from src/app/calculator/)
├── login.tsx                   (from src/app/login/)
├── register.tsx                (from src/app/register/)
└── _layout.tsx                 (Navigation setup)
```

### Part 2: Setup API Endpoints Access

**mobile/services/api.ts:**

```typescript
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = 'https://mpt-community.vercel.app';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// Interceptor untuk JWT token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Part 3: Setup Download Page on Website

**src/app/downloads/page.tsx:**

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function DownloadsPage() {
  const [latestVersion, setLatestVersion] = useState('1.0.0');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    // Fetch latest APK version from Vercel
    fetch('/api/downloads/latest')
      .then(res => res.json())
      .then(data => {
        setLatestVersion(data.version);
        setDownloadUrl(data.downloadUrl);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* APK Download Card */}
        <div className="bg-slate-700 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">
            📱 Download Android App
          </h1>
          
          <p className="text-gray-300 mb-6">
            MPT Warrior Mobile v{latestVersion}
          </p>

          {/* Download Button */}
          <a
            href={downloadUrl}
            download
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg mb-6 transition"
          >
            📥 Download APK
          </a>

          {/* Features */}
          <div className="text-left mt-8">
            <h2 className="text-xl font-bold mb-4">Features:</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✅ AI Mentor Chat (24/7)</li>
              <li>✅ Trading Journal</li>
              <li>✅ Performance Analytics</li>
              <li>✅ Achievement System</li>
              <li>✅ Real-time Sync with Website</li>
              <li>✅ Offline Support</li>
            </ul>
          </div>

          {/* Requirements */}
          <div className="text-left mt-8">
            <h2 className="text-xl font-bold mb-4">Requirements:</h2>
            <ul className="space-y-2 text-gray-300">
              <li>📱 Android 8.0+</li>
              <li>💾 ~150-200 MB storage</li>
              <li>🌐 Internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Part 4: Setup API Endpoint for Download

**src/app/api/downloads/latest/route.ts:**

```typescript
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get latest APK from public folder
    const apkPath = path.join(process.cwd(), 'public', 'downloads', 'mpt-warrior.apk');
    const apkExists = fs.existsSync(apkPath);

    if (!apkExists) {
      return Response.json({
        error: 'APK not found',
        version: 'N/A',
        downloadUrl: null
      }, { status: 404 });
    }

    // Get file stats
    const stats = fs.statSync(apkPath);
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2); // MB

    return Response.json({
      success: true,
      version: '1.0.0',
      downloadUrl: '/downloads/mpt-warrior.apk',
      fileSize: `${fileSize} MB`,
      lastUpdated: stats.mtime.toISOString(),
      downloadCount: 0 // Could track this in database
    });
  } catch (error) {
    return Response.json({
      error: 'Failed to fetch APK info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

### Part 5: Setup GitHub Actions for Automated Builds

**.github/workflows/build-apk.yml:**

```yaml
name: Build APK

on:
  push:
    branches:
      - main
    paths:
      - 'mobile/**'
      - '.github/workflows/build-apk.yml'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies (mobile)
        working-directory: ./mobile
        run: npm install

      - name: Build APK with EAS
        working-directory: ./mobile
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: |
          npm install -g eas-cli
          eas build --platform android --non-interactive

      - name: Download APK
        run: |
          # EAS build will output APK path
          # Download and move to public/downloads/
          mkdir -p public/downloads
          # APK will be downloaded from EAS and placed here
          echo "APK build complete"

      - name: Commit and push APK
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/downloads/mpt-warrior.apk
          git commit -m "Update APK - $(date +%Y-%m-%d)"
          git push

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npx vercel deploy --prod --token $VERCEL_TOKEN
```

### Part 6: Create Mobile-Optimized Components

**mobile/app/_layout.tsx** (Tab Navigation):

```typescript
import { Tabs } from 'expo-router';
import { Home, MessageCircle, BookOpen, User, MoreHorizontal } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(journal)"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <MoreHorizontal size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## 📋 Automation Checklist

### Setup Phase
- [ ] Clone website components ke mobile
- [ ] Setup mobile/services/api.ts dengan API_URL
- [ ] Create mobile screens dari website pages
- [ ] Setup tab navigation

### Website Integration
- [ ] Create src/app/downloads/page.tsx
- [ ] Create src/app/api/downloads/latest/route.ts
- [ ] Add download link ke homepage
- [ ] Setup folder public/downloads/

### Build Automation
- [ ] Setup EAS CLI
- [ ] Create GitHub Actions workflow
- [ ] Set EXPO_TOKEN secret di GitHub
- [ ] Set VERCEL_TOKEN secret di GitHub
- [ ] Test manual build first

### Deployment
- [ ] Build APK locally: npm run build:apk
- [ ] Upload to public/downloads/
- [ ] Push ke GitHub
- [ ] GitHub Actions triggers automatically
- [ ] APK available on website

---

## ⚙️ Configuration Files Needed

### mobile/app.json (Update)
```json
{
  "expo": {
    "name": "MPT Warrior",
    "slug": "mpt-warrior",
    "version": "1.0.0",
    "appId": "com.dedendev.mptwarrior",
    "extra": {
      "apiUrl": "https://mpt-community.vercel.app"
    }
  }
}
```

### mobile/.env
```
EXPO_PUBLIC_API_URL=https://mpt-community.vercel.app
EXPO_TOKEN=your_token_here
```

### .github/workflows/build-apk.yml
(See above - create this file)

---

## 🚀 Quick Start Automation

```powershell
# 1. Setup GitHub Secrets
# Go to: GitHub → Settings → Secrets and variables → Actions
# Add:
#   EXPO_TOKEN=your_expo_token
#   VERCEL_TOKEN=your_vercel_token

# 2. Build APK locally first (test)
cd mobile
npm run build:apk

# 3. Upload APK to public folder
Copy-Item release.apk ../public/downloads/mpt-warrior.apk

# 4. Push to GitHub
git add .
git commit -m "Add APK download"
git push origin main

# 5. GitHub Actions runs automatically
# 6. APK available on https://mpt-community.vercel.app/downloads/mpt-warrior.apk
```

---

## 📊 End Result

**Users can:**
1. Visit https://mpt-community.vercel.app
2. Click "Download App" button
3. Download APK directly from website
4. Install on Android phone
5. Login with same account
6. All data automatically synced ✅

**Automation:**
1. Code changes → Git push
2. GitHub Actions → Builds APK
3. APK uploaded → Vercel
4. Website updated → Ready for download
5. Repeat for updates ✅

---

**Next**: Implement these setup steps in order
