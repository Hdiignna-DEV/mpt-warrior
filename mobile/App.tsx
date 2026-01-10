import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { notificationService } from './src/services/notifications';
import { updateService } from './src/services/updates';

export default function App() {
  useEffect(() => {
    // Setup push notifications on app start
    const setupNotifications = async () => {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        await notificationService.sendTokenToBackend(token);
      }
    };

    // Check for app updates
    const setupUpdates = async () => {
      await updateService.initializeUpdateChecks();
    };

    setupNotifications();
    setupUpdates();

    // Setup notification listeners
    const unsubscribe = notificationService.setupNotificationListeners();

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
