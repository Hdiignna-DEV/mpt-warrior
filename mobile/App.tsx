import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { authStore } from '@/store/authStore';
import RootNavigator from '@/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const verifyToken = authStore((state) => state.verifyToken);

  useEffect(() => {
    const setup = async () => {
      try {
        // Verify if user has a valid token
        await verifyToken();
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    setup();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
