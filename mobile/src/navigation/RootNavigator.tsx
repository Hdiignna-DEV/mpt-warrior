import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authStore } from '@/store/authStore';
import SplashScreen from '@/screens/SplashScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import MainTabs from '@/navigation/MainTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const { setUser } = authStore();

  useEffect(() => {
    // Restore token dari secure storage
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        setUserToken(token);
        
        if (token) {
          // Verify token dengan backend
          try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
              // Token invalid, clear it
              await SecureStore.deleteItemAsync('userToken');
              setUserToken(null);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken == null ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
