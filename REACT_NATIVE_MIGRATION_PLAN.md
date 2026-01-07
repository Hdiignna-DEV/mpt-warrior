# 📱 MPT Warrior - React Native Mobile App Plan

## 🎯 Overview

Transform MPT Warrior into a native mobile app using React Native and Expo for maximum performance and native features.

---

## 📊 Project Structure

```
mpt-warrior-mobile/
├── app/                          # Expo Router navigation
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Dashboard
│   │   ├── journal.tsx          # Trading Journal
│   │   ├── calculator.tsx       # Risk Calculator
│   │   ├── ai-mentor.tsx        # AI Mentor
│   │   └── profile.tsx          # Profile
│   ├── achievements.tsx         # Achievements
│   ├── analytics.tsx            # Analytics
│   ├── login.tsx                # Login
│   ├── register.tsx             # Register
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   ├── dashboard/               # Dashboard components
│   ├── journal/                 # Journal components
│   └── shared/                  # Shared components
├── hooks/                        # Custom hooks
├── lib/                          # Libraries & utilities
│   ├── api.ts                   # API client
│   ├── cosmos.ts                # Cosmos DB direct client
│   └── storage.ts               # AsyncStorage wrapper
├── stores/                       # Zustand stores (from web)
├── types/                        # TypeScript types (shared with web)
├── constants/                    # Constants
└── assets/                       # Images, fonts, etc.
```

---

## 🚀 Phase 1: Project Setup (Day 1)

### Step 1: Initialize Expo Project

```bash
# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Create new project
npx create-expo-app mpt-warrior-mobile --template

# Choose: Blank (TypeScript)

cd mpt-warrior-mobile
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install @react-navigation/native
npm install expo-router
npm install react-native-safe-area-context
npm install react-native-screens

# UI & Styling
npm install nativewind
npm install tailwindcss
npm install react-native-reanimated
npm install react-native-gesture-handler

# State Management (reuse from web)
npm install zustand
npm install @tanstack/react-query

# Azure Cosmos DB
npm install @azure/cosmos

# AI Services
npm install @google/generative-ai
npm install axios

# Storage
npm install @react-native-async-storage/async-storage

# Charts
npm install react-native-chart-kit
npm install react-native-svg

# Icons
npm install @expo/vector-icons

# Push Notifications (Expo built-in, FREE!)
npm install expo-notifications
npm install expo-device

# Other utilities
npm install date-fns
npm install expo-haptics
npm install expo-secure-store
```

### Step 3: Configure app.json

```json
{
  "expo": {
    "name": "MPT Warrior",
    "slug": "mpt-warrior",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0ea5e9"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mptwarrior.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0ea5e9"
      },
      "package": "com.mptwarrior.app",
      "versionCode": 1,
      "permissions": [
        "NOTIFICATIONS",
        "VIBRATE"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#0ea5e9"
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "[your-project-id]"
      }
    }
  }
}
```

---

## 🎨 Phase 2: Core Features Migration (Week 1)

### Day 1-2: Dashboard & Navigation

**Files to create:**
- `app/(tabs)/_layout.tsx` - Tab navigation
- `app/(tabs)/index.tsx` - Dashboard home
- `components/dashboard/MetricsCard.tsx`
- `components/dashboard/MPTPhilosophy.tsx`
- `components/dashboard/QuickActions.tsx`

**Key differences from web:**
```typescript
// Web uses Next.js routing
import { useRouter } from 'next/navigation';

// Mobile uses Expo Router
import { useRouter } from 'expo-router';

// Web uses CSS/Tailwind
<div className="bg-blue-500">

// Mobile uses StyleSheet or NativeWind
import { View } from 'react-native';
<View className="bg-blue-500">
```

### Day 3-4: Trading Journal

**Files to create:**
- `app/(tabs)/journal.tsx`
- `components/journal/TradeForm.tsx`
- `components/journal/TradeList.tsx`
- `components/journal/TradeStats.tsx`

**Native features:**
```typescript
// Use AsyncStorage for local data
import AsyncStorage from '@react-native-async-storage/async-storage';

// Export CSV with native share
import * as Sharing from 'expo-sharing';

// Haptic feedback on trade entry
import * as Haptics from 'expo-haptics';
```

### Day 5-6: Risk Calculator

**Files to create:**
- `app/(tabs)/calculator.tsx`
- `components/calculator/CalculatorForm.tsx`
- `components/calculator/ResultsDisplay.tsx`

**Enhancements:**
```typescript
// Native number input with better UX
import { TextInput } from 'react-native';

// Slider for risk percentage
import Slider from '@react-native-community/slider';
```

### Day 7: AI Mentor

**Files to create:**
- `app/(tabs)/ai-mentor.tsx`
- `components/ai-mentor/ChatInterface.tsx`
- `components/ai-mentor/MessageBubble.tsx`

**Mobile optimizations:**
```typescript
// Keyboard-aware scroll view
import { KeyboardAvoidingView } from 'react-native';

// Auto-scroll to bottom on new message
import { FlatList } from 'react-native';
```

---

## 🔔 Phase 3: Native Features (Week 2)

### Push Notifications (FREE with Expo!)

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get push token (FREE, no VAPID needed!)
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  // Get Expo push token (FREE!)
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id',
  });

  return token.data;
}

// Send local notification
export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      vibrate: [0, 250, 250, 250],
    },
    trigger: null, // Send immediately
  });
}

// Trading-specific notifications
export const TradingNotifications = {
  tradeClosed: (pair: string, result: 'WIN' | 'LOSS', pips: number) => {
    const emoji = result === 'WIN' ? '🎯' : '📊';
    sendLocalNotification(
      `${emoji} Trade Closed: ${pair}`,
      `Result: ${result} | ${pips > 0 ? '+' : ''}${pips} pips`
    );
  },

  achievementUnlocked: (name: string) => {
    sendLocalNotification('🏆 Achievement Unlocked!', name);
  },

  dailyReminder: () => {
    sendLocalNotification(
      '⚔️ MPT Warrior Daily',
      'Time to review your trading plan!'
    );
  },
};

// Schedule daily reminder
export async function scheduleDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚔️ MPT Warrior Daily',
      body: 'Time to review your trading plan!',
    },
    trigger: {
      hour: 8, // 8 AM
      minute: 0,
      repeats: true,
    },
  });
}
```

### Biometric Authentication

```typescript
// lib/biometric.ts
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export async function authenticateWithBiometric(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return false;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access MPT Warrior',
    fallbackLabel: 'Use passcode',
  });

  return result.success;
}

// Store sensitive data securely
export async function storeSecure(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecure(key: string) {
  return await SecureStore.getItemAsync(key);
}
```

### Haptic Feedback

```typescript
// lib/haptics.ts
import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  impact: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};
```

---

## 🗄️ Phase 4: Backend Integration

### Option 1: Direct Cosmos DB Connection (Recommended)

```typescript
// lib/cosmos.ts
import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.EXPO_PUBLIC_AZURE_COSMOS_ENDPOINT!;
const key = process.env.EXPO_PUBLIC_AZURE_COSMOS_KEY!;

const client = new CosmosClient({ endpoint, key });
const database = client.database('mpt-warrior');

// Trade operations
export const TradesAPI = {
  async getAll(userId: string) {
    const container = database.container('trades');
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.userId = @userId',
        parameters: [{ name: '@userId', value: userId }],
      })
      .fetchAll();
    return resources;
  },

  async create(trade: any) {
    const container = database.container('trades');
    const { resource } = await container.items.create(trade);
    return resource;
  },
};
```

### Option 2: Azure Functions API (More secure)

```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
api.interceptors.request.use(async (config) => {
  const token = await getSecure('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TradesAPI = {
  getAll: () => api.get('/trades'),
  create: (trade: any) => api.post('/trades', trade),
  update: (id: string, trade: any) => api.put(`/trades/${id}`, trade),
  delete: (id: string) => api.delete(`/trades/${id}`),
};
```

---

## 📦 Phase 5: Build & Deploy

### Local Development

```bash
# Start development server
npx expo start

# Run on Android emulator
npx expo run:android

# Run on iOS simulator (Mac only)
npx expo run:ios

# Run on physical device
# Scan QR code with Expo Go app
```

### Build for Production

```bash
# Initialize EAS (Expo Application Services)
eas init

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS (requires Apple Developer account)
eas build --platform ios

# Build both platforms
eas build --platform all
```

### Submit to Stores

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

---

## 💰 Cost Breakdown

### FREE Tier (Expo)

- ✅ **Push Notifications**: UNLIMITED (Expo Push)
- ✅ **OTA Updates**: Up to 50 active users
- ✅ **Build minutes**: 30 builds/month
- ✅ **Storage**: 5 GB

### Azure Backend (Student)

- ✅ **Cosmos DB**: $0 (free tier 1000 RU/s)
- ✅ **Functions**: $0 (1M executions free)
- ✅ **Storage**: $0 (5 GB free first year)

### Store Fees

- 🍎 **Apple**: $99/year (developer account)
- 🤖 **Google Play**: $25 one-time fee

**Total: ~$124 first year, ~$99/year after**

---

## 🎯 Features Comparison

| Feature | Web (PWA) | Mobile (React Native) |
|---------|-----------|----------------------|
| **Installation** | Via browser | App Store / Play Store |
| **Offline** | Service Worker | Full native |
| **Push Notifications** | Web Push (limited iOS) | Native (full support) |
| **Performance** | Good | Excellent |
| **Native Features** | Limited | Full access |
| **Update Speed** | Instant | OTA updates (instant with Expo) |
| **Development Time** | ✅ Done | 1-2 weeks |
| **Maintenance** | Single codebase | Separate from web |
| **User Trust** | Good | Excellent (verified stores) |

---

## ✅ Migration Checklist

### Week 1: Core Features
- [ ] Setup Expo project
- [ ] Create navigation structure
- [ ] Migrate Dashboard
- [ ] Migrate Journal
- [ ] Migrate Calculator
- [ ] Migrate AI Mentor
- [ ] Migrate Achievements

### Week 2: Native Features
- [ ] Push notifications setup
- [ ] Biometric authentication
- [ ] Haptic feedback
- [ ] Local data persistence
- [ ] Offline support
- [ ] Share functionality

### Week 3: Polish & Testing
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Error handling
- [ ] Testing on devices
- [ ] Beta testing with community

### Week 4: Deployment
- [ ] Build for production
- [ ] App Store assets (screenshots, descriptions)
- [ ] Submit to Google Play
- [ ] Submit to Apple App Store

---

## 🚀 Next Steps

1. **Now**: Review this plan
2. **Day 1**: Initialize Expo project
3. **Week 1**: Build core features
4. **Week 2**: Add native features
5. **Week 3-4**: Polish and deploy

**Want me to start creating the React Native project now?**
