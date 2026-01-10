# 📱 PHASE 2 QUICK START GUIDE

**Status**: Ready to Start  
**Current**: Phase 1 Complete ✅  
**Next**: Phase 2 Feature Enhancements

---

## 🎯 Phase 2 Goals

### Phase 2A: Core Features (Weeks 1-2)
- [ ] AddTradeScreen - Form to create new trades
- [ ] EditTradeScreen - Modify existing trades
- [ ] TradeDetailScreen - View trade details
- [ ] Push notifications
- [ ] Offline support (cache trades)

### Phase 2B: UI/UX Polish (Week 3)
- [ ] Pull-to-refresh on Journal & Achievements
- [ ] Loading skeletons
- [ ] Infinite scroll pagination
- [ ] Search functionality
- [ ] Filter by date range

### Phase 2C: Testing (Week 4)
- [ ] Unit tests (Jest)
- [ ] Component tests (React Testing Library)
- [ ] Integration tests
- [ ] E2E tests (Detox)

---

## 🚀 Getting Started with Phase 2

### Step 1: Install Additional Dependencies
```bash
cd mobile
npm install expo-notifications expo-permissions react-native-svg
npm install -D @testing-library/react-native jest @testing-library/jest-native
```

### Step 2: Create New Screens Folder
```bash
mkdir src/screens/trades
touch src/screens/trades/AddTradeScreen.tsx
touch src/screens/trades/EditTradeScreen.tsx
touch src/screens/trades/TradeDetailScreen.tsx
```

### Step 3: Update Navigation
Modify `src/navigation/RootNavigator.tsx`:
```typescript
// Add to JournalStack:
<Stack.Screen name="AddTrade" component={AddTradeScreen} />
<Stack.Screen name="EditTrade" component={EditTradeScreen} />
<Stack.Screen name="TradeDetail" component={TradeDetailScreen} />
```

### Step 4: Create Trade Form Component
```bash
touch src/components/TradeForm.tsx
```

This component will be reused by both AddTradeScreen and EditTradeScreen.

---

## 📝 AddTradeScreen Structure

```typescript
interface TradeFormData {
  symbol: string;        // e.g., "EURUSD"
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  result: 'WIN' | 'LOSS'; // Auto-calculated
  pips: number;          // Auto-calculated
  entryTime: string;     // ISO timestamp
  exitTime: string;      // ISO timestamp
  notes: string;
  strategy: string;
}
```

**Features**:
- Date/time picker for entry and exit
- Real-time pips calculation
- WIN/LOSS badge based on entry/exit
- Form validation
- Submit to `/api/trades` POST endpoint

---

## 🔔 Push Notifications Setup

Add to `src/services/notifications.ts`:

```typescript
import * as Notifications from 'expo-notifications';

export const notificationService = {
  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async sendNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  },

  async registerForPushNotifications() {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    // Send token to backend
    return token;
  },
};
```

---

## 💾 Offline Support Pattern

Use AsyncStorage + Zustand for offline caching:

```typescript
// In services/trades.ts
export const tradesService = {
  async getTrades() {
    try {
      return await apiClient.get('/trades');
    } catch (error) {
      // Fall back to cache
      const cached = await AsyncStorage.getItem('trades_cache');
      return JSON.parse(cached || '[]');
    }
  },

  async createTrade(trade: Trade) {
    const response = await apiClient.post('/trades', trade);
    // Update cache
    const cached = await AsyncStorage.getItem('trades_cache');
    const trades = JSON.parse(cached || '[]');
    AsyncStorage.setItem('trades_cache', JSON.stringify([...trades, response.data]));
    return response.data;
  },
};
```

---

## 🧪 Testing Example

**File**: `src/screens/__tests__/LoginScreen.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('should render email and password inputs', () => {
    render(<LoginScreen navigation={{}} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeTruthy();
  });

  it('should disable submit button when fields are empty', () => {
    render(<LoginScreen navigation={{}} />);
    
    const submitButton = screen.getByText('Login');
    expect(submitButton).toBeDisabled();
  });
});
```

---

## 🗂️ New Folder Structure (After Phase 2)

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── JournalScreen.tsx
│   │   │   └── (new)
│   │   ├── AchievementsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── trades/                   🆕
│   │   │   ├── AddTradeScreen.tsx
│   │   │   ├── EditTradeScreen.tsx
│   │   │   └── TradeDetailScreen.tsx
│   │   └── __tests__/                🆕
│   │       ├── LoginScreen.test.tsx
│   │       └── JournalScreen.test.tsx
│   ├── components/
│   │   ├── TradeForm.tsx             🆕
│   │   ├── LoadingSkeleton.tsx       🆕
│   │   └── PullToRefresh.tsx         🆕
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── trades.ts
│   │   └── notifications.ts          🆕
│   ├── store/
│   │   └── useAppStore.ts
│   ├── hooks/
│   │   ├── useNotifications.ts       🆕
│   │   ├── useOfflineMode.ts         🆕
│   │   └── useInfiniteScroll.ts      🆕
│   └── navigation/
│       └── RootNavigator.tsx
└── jest.config.js                    🆕
```

---

## 📋 Phase 2 Checklist

### Week 1: Core Features
- [ ] Create AddTradeScreen
- [ ] Create TradeForm component
- [ ] Test form submission
- [ ] Implement push notifications
- [ ] Setup offline caching

### Week 2: Data Management
- [ ] Create EditTradeScreen
- [ ] Create TradeDetailScreen
- [ ] Implement trade deletion
- [ ] Add search functionality
- [ ] Add date filtering

### Week 3: Polish
- [ ] Add loading skeletons
- [ ] Implement pull-to-refresh
- [ ] Add infinite scroll
- [ ] Improve error messages
- [ ] Optimize performance

### Week 4: Testing & QA
- [ ] Write unit tests
- [ ] Write component tests
- [ ] Test on iOS emulator
- [ ] Test on Android emulator
- [ ] Bug fixes & optimization

---

## 🔗 Useful Commands

```bash
# Start development
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# View logs
npm start -- --clear
```

---

## 🎨 UI Component Pattern

All new components should follow this pattern:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';

interface ComponentProps {
  navigation?: any;
  route?: any;
}

export default function Component({ navigation, route }: ComponentProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call here
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Title</Text>
      {/* Component content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
});
```

---

## 🚨 Common Issues & Solutions

### Issue: Navigation doesn't work
**Solution**: Make sure `RootNavigator.tsx` is properly imported in `App.tsx`

### Issue: API calls fail with 401
**Solution**: Check token expiration - ensure `hydrate()` is called on app startup

### Issue: AsyncStorage returns null
**Solution**: Wrap initialization in `useEffect` and check `isLoading` state

### Issue: FlatList performance is slow
**Solution**: Add `removeClippedSubviews={true}` and `maxToRenderPerBatch={10}`

---

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Expo Docs](https://docs.expo.dev/)
- [Axios](https://axios-http.com/)

---

## ✅ Ready to Start?

All Phase 1 infrastructure is in place. Phase 2 can now:
1. Add new screens without touching existing ones
2. Extend services without breaking current API calls
3. Add features using established patterns
4. Test thoroughly before committing

**Happy coding! 🚀**
