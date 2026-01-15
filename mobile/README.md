# MPT Warrior Mobile App

React Native mobile application for MPT Command Center - platform trading profesional.

## Features

- 📱 Native Android & iOS app
- 🔐 Secure authentication with JWT
- 📊 Real-time dashboard
- 📝 Trading journal
- 💬 AI mentor chat
- 🏆 Leaderboard
- 👤 User profile
- 🔄 Data sync with website
- 📴 Offline support (coming soon)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Build APK
npm run build:android
```

## Project Structure

```
src/
├── screens/          # UI screens
│   ├── auth/        # Login/Register
│   └── main/        # Dashboard, Journal, Chat, etc.
├── navigation/      # Navigation config
├── store/           # State management (Zustand)
├── utils/           # Helper functions
└── types/           # TypeScript types

App.tsx             # Entry point
app.json            # Expo configuration
eas.json            # EAS Build config
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure API endpoint:
```
EXPO_PUBLIC_API_URL=https://mpt-warrior.vercel.app/api
```

## Building APK

### Prerequisites
- Expo account (free at expo.dev)
- EAS CLI installed

### Build Steps

```bash
# Login to Expo
eas login

# Build APK
eas build --platform android --profile production

# Check status
eas build:list --limit 5

# Download APK from dashboard
```

**Build time**: 15-20 minutes

## Architecture

This mobile app shares the **same backend** as the website:

- **Backend**: Next.js API routes (`app/api/*`)
- **Database**: Azure Cosmos DB (shared)
- **Authentication**: JWT tokens
- **Data**: Real-time sync between web and mobile

## User Data Safety

✅ All existing user data remains safe:
- Stored in Cosmos DB
- Not deleted or modified
- Accessible from both web and mobile
- Same login credentials work everywhere

## Development

### Add a New Screen

1. Create file in `src/screens/`
2. Add to navigation in `src/navigation/MainTabs.tsx`
3. Import and use

### Add API Integration

```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const { data, isLoading } = useQuery({
  queryKey: ['trades'],
  queryFn: async () => {
    const response = await axios.get('/api/trades', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
});
```

### Update State

```typescript
import { authStore } from '@/store/authStore';

const { user, logout } = authStore();
```

## Testing

### Local Testing (Web)
```bash
npm start
# Press 'w' to open web preview
```

### Android Emulator
```bash
npm run android
# Requires Android SDK installed
```

### Physical Device
```bash
npm start
# Scan QR code with Expo Go app
```

## Common Issues

### Build Fails
- Check Node.js version (20+)
- Run `npm install --legacy-peer-deps`
- Ensure EAS CLI logged in: `eas login`

### Login Fails
- Verify API endpoint correct
- Check network connectivity
- Ensure user exists in database

### Data Not Syncing
- Check same API URL used
- Verify JWT token valid
- Check network logs

## Documentation

- [Setup Guide](../MOBILE_APP_SETUP_GUIDE.md)
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)

## Support

For issues or questions:
1. Check logs: Run with `--verbose` flag
2. Check EAS dashboard: https://expo.dev
3. Review documentation links above

## License

Part of MPT Warrior project
