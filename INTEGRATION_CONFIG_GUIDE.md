# 🔧 Integration Configuration - Website ↔️ Mobile App

## Environment Setup untuk Mobile App

### Step 1: Update mobile/app.json

```json
{
  "expo": {
    "name": "MPT Warrior",
    "slug": "mpt-warrior",
    "version": "1.0.0",
    "appId": "com.dedendev.mptwarrior",
    "runtimeVersion": "1.0.0",
    
    // Tambahkan production API URL
    "extra": {
      "eas": {
        "projectId": "01cbff08-a5b5-4e32-b7d6-11eebe07c986"
      },
      // PENTING: API URL untuk integrasi website
      "apiUrl": "https://mptwarrior.vercel.app",
      "apiTimeout": 10000,
      "environment": "production"
    },
    
    // ... rest of config
  }
}
```

### Step 2: Update mobile/services/api.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL dari app.json (production) atau environment variable
const API_URL = 
  Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000';

console.log('🌐 API Base URL:', API_URL);

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: Constants.expoConfig?.extra?.apiTimeout || 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'MPTWarrior-Mobile/1.0.0',
  },
});

// Request Interceptor - Add JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle Auth Errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      await AsyncStorage.removeItem('jwt_token');
      // Emit logout event here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_URL };
```

### Step 3: Update mobile/services/authService.ts

```typescript
import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  // Login - same as website
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    
    if (response.data.token) {
      await AsyncStorage.setItem('jwt_token', response.data.token);
    }
    
    return response.data;
  },

  // Register - same as website
  async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data
    );
    
    if (response.data.token) {
      await AsyncStorage.setItem('jwt_token', response.data.token);
    }
    
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('jwt_token');
    // Optional: Notify backend
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('jwt_token');
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },
};
```

---

## API Endpoints Integration

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh-token
```

### Chat (AI Mentor)
```
POST /api/chat/message
  Body: { message: string }
  Response: { reply: string, timestamp: number }

GET /api/chat/history/:userId
  Response: [{ id, message, reply, timestamp }]
```

### Journal (Trading)
```
POST /api/journal/add-trade
  Body: { 
    symbol: string,
    type: 'BUY' | 'SELL',
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    notes: string
  }

GET /api/journal/trades/:userId
  Response: [{ id, symbol, type, entryPrice, ... }]

PUT /api/journal/trades/:tradeId
  Body: { ... trade data ... }

DELETE /api/journal/trades/:tradeId
```

### Profile
```
GET /api/profile/:userId
  Response: { id, email, name, avatar, stats, badges }

PUT /api/profile/:userId
  Body: { name, avatar, bio, tradingGoal }
```

### Achievements
```
GET /api/achievements/:userId
  Response: [{ id, name, description, unlockedAt }]
```

### Dashboard
```
GET /api/dashboard/stats/:userId
  Response: {
    totalTrades: number,
    winRate: number,
    totalProfit: number,
    streak: number
  }
```

---

## Environment Variables

### For Development

Create `.env.local` di mobile folder:

```
# Development API
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### For Production

Di Vercel atau hosting Anda, set environment variable:

```
EXPO_PUBLIC_API_URL=https://mptwarrior.vercel.app
```

---

## Data Sync Strategy

### Real-time Sync

1. **User adds trade di mobile app**
   ```typescript
   POST /api/journal/add-trade
   ```

2. **Backend saves to Cosmos DB**
   ```typescript
   // src/app/api/journal/add-trade/route.ts
   db.journal.create({
     userId: user.id,
     ...tradeData,
     createdAt: new Date(),
   });
   ```

3. **Backend returns success**
   ```typescript
   { success: true, trade: { id, ... } }
   ```

4. **Mobile app saves locally (AsyncStorage)**
   ```typescript
   AsyncStorage.setItem(`trade_${id}`, JSON.stringify(trade))
   ```

5. **User opens website**
   - Website fetches from API: `GET /api/journal/trades/:userId`
   - Shows same data ✅

### Offline Support

```typescript
// If no internet connection
const addTradeOffline = async (tradeData) => {
  // Save locally
  const tempId = generateTempId();
  await AsyncStorage.setItem(
    `offline_trade_${tempId}`,
    JSON.stringify(tradeData)
  );
  
  // Show user success (but local only)
  showNotification('Trade saved locally. Will sync when online.');
  
  // Try to sync in background
  syncWhenOnline();
};

// When connection returns
const syncWhenOnline = async () => {
  const offlineTrades = await AsyncStorage.getAllKeys()
    .filter(key => key.startsWith('offline_trade_'));
  
  for (const key of offlineTrades) {
    try {
      const trade = await AsyncStorage.getItem(key);
      const response = await apiClient.post('/api/journal/add-trade', trade);
      
      // Remove offline copy
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};
```

---

## Security Considerations

### JWT Token Storage

```typescript
// ✅ Good - Store in AsyncStorage with encryption
const storeToken = async (token: string) => {
  // Optional: Encrypt before storing
  const encrypted = await encryptToken(token);
  await AsyncStorage.setItem('jwt_token', encrypted);
};

// ❌ Bad - Don't store in plain text or globals
// ❌ Bad - Don't send as query parameter
```

### HTTPS Only

```typescript
// ✅ Always use HTTPS for API calls
const API_URL = 'https://mptwarrior.vercel.app';

// ❌ Never use HTTP in production
// const API_URL = 'http://mptwarrior.com';
```

### Token Expiration

```typescript
// Implement token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const newToken = await refreshToken();
        await AsyncStorage.setItem('jwt_token', newToken);
        
        // Retry original request
        return apiClient.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        logout();
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Testing Integration

### Manual Testing

```typescript
// Test login works
1. Open mobile app
2. Click Login
3. Enter website credentials
4. Should succeed and show dashboard

// Test data sync
5. Open mobile app
6. Go to Journal
7. Add new trade
8. Open website in browser
9. Go to Journal
10. See same trade ✅

// Test chat
11. Open mobile app
12. Send message to AI mentor
13. Should receive response
14. Check chat history on website ✅
```

### Automated Testing

```typescript
// Example test
import { describe, it, expect } from '@jest/globals';

describe('Mobile-Website Integration', () => {
  it('should login and sync data', async () => {
    // 1. Login via mobile
    const loginResponse = await apiClient.post('/auth/login', {
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.token).toBeDefined();
    
    // 2. Add trade
    const tradeResponse = await apiClient.post('/journal/add-trade', {
      symbol: 'BTC/USD',
      type: 'BUY',
      entryPrice: 50000,
      exitPrice: 51000,
      quantity: 1
    });
    
    expect(tradeResponse.status).toBe(200);
    
    // 3. Fetch trades (should see the new trade)
    const tradesResponse = await apiClient.get('/journal/trades/user123');
    
    expect(tradesResponse.data.length).toBeGreaterThan(0);
    expect(tradesResponse.data[0].symbol).toBe('BTC/USD');
  });
});
```

---

## Troubleshooting

### "Cannot connect to API"

```
Solution: Check API_URL in app.json matches your website URL
- Development: http://localhost:3000
- Production: https://mptwarrior.vercel.app
```

### "401 Unauthorized"

```
Solution: Token expired or invalid
- Implement token refresh logic
- Clear AsyncStorage and re-login
```

### "Data not syncing"

```
Solution: Check network connection
- Implement offline detection
- Queue requests for later sync
- Show user status indicator
```

### "CORS error"

```
Solution: Configure CORS in website backend
// src/middleware.ts or CORS headers in API route
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
}
```

---

## Monitoring & Logging

```typescript
// Log API requests
apiClient.interceptors.request.use(config => {
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Log API responses
apiClient.interceptors.response.use(
  response => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(
      `❌ ${error.response?.status || 'Network'} ${error.config?.url}`
    );
    return Promise.reject(error);
  }
);
```

---

## Next Steps

1. ✅ Update `mobile/app.json` dengan API URL
2. ✅ Update `mobile/services/api.ts` dengan interceptors
3. ✅ Test login dari mobile app
4. ✅ Test data sync antara website & mobile
5. ✅ Build APK: `npm run build:apk`
6. ✅ Upload ke website
7. ✅ Share link untuk download

---

**Status**: Configuration complete and ready for integration!
