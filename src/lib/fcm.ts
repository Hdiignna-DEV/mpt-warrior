// Firebase Cloud Messaging (FCM) Service
// Menangani push notifications untuk PWA dan mobile

import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
  MessagePayload,
} from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '@/config/firebase';

let messaging: Messaging | null = null;

// Initialize Firebase Messaging
export const initializeFirebaseMessaging = () => {
  try {
    if (typeof window === 'undefined') return null;

    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    console.log('[FCM] Firebase Messaging initialized');
    return messaging;
  } catch (error) {
    console.error('[FCM] Failed to initialize Firebase:', error);
    return null;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      messaging = initializeFirebaseMessaging();
    }

    if (!messaging) {
      console.warn('[FCM] Firebase Messaging not available');
      return null;
    }

    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('[FCM] Notifications not supported in this browser');
      return null;
    }

    // Request permission if not already granted
    if (Notification.permission === 'denied') {
      console.warn('[FCM] Notification permission denied by user');
      return null;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[FCM] User denied notification permission');
        return null;
      }
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });

    console.log('[FCM] FCM Token obtained:', token.substring(0, 20) + '...');
    return token;
  } catch (error) {
    console.error('[FCM] Error requesting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const listenForForegroundMessages = (
  callback: (title: string, options: NotificationOptions) => void
) => {
  try {
    if (!messaging) {
      messaging = initializeFirebaseMessaging();
    }

    if (!messaging) return;

    onMessage(messaging, (payload: MessagePayload) => {
      console.log('[FCM] Foreground message received:', payload);

      const title = payload.notification?.title || 'MPT Trading HUB';
      const options: NotificationOptions = {
        body: payload.notification?.body || 'Notifikasi baru',
        icon: payload.notification?.icon || '/mpt-logo.png',
        badge: '/mpt-logo.png',
        tag: (payload.data?.tag as string) || 'mpt-warrior',
        data: payload.data,
      };

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }

      // Also call callback for custom handling
      callback(title, options);
    });
  } catch (error) {
    console.error('[FCM] Error setting up foreground message listener:', error);
  }
};

// Save FCM token to backend
export const saveFCMTokenToBackend = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save FCM token: ${response.statusText}`);
    }

    console.log('[FCM] Token saved to backend successfully');
    return true;
  } catch (error) {
    console.error('[FCM] Error saving FCM token to backend:', error);
    return false;
  }
};

// Initialize Firebase Messaging and handle notifications
export const setupPushNotifications = async (): Promise<string | null> => {
  try {
    const token = await requestNotificationPermission();

    if (token) {
      // Save token to backend
      await saveFCMTokenToBackend(token);

      // Listen for foreground messages
      listenForForegroundMessages((title, options) => {
        console.log('[FCM] Notification shown:', title);
      });

      return token;
    }

    return null;
  } catch (error) {
    console.error('[FCM] Error setting up push notifications:', error);
    return null;
  }
};

// Send test notification (for development)
export const sendTestNotification = async (
  title: string = 'Test Notification',
  body: string = 'This is a test notification from MPT Warrior'
): Promise<void> => {
  try {
    const response = await fetch('/api/notifications/send-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send test notification: ${response.statusText}`);
    }

    console.log('[FCM] Test notification sent');
  } catch (error) {
    console.error('[FCM] Error sending test notification:', error);
  }
};
