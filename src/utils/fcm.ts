/**
 * Firebase Cloud Messaging (FCM) Service
 * Handles push notification subscriptions and messaging
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration - should be in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let app: any = null;
let messaging: any = null;

/**
 * Initialize Firebase (only in browser)
 */
export const initializeFirebase = () => {
  if (typeof window === 'undefined') return null;
  
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      console.log('[FCM] Firebase initialized');
    } catch (error) {
      console.error('[FCM] Failed to initialize Firebase:', error);
    }
  }
  
  return messaging;
};

/**
 * Request notification permission and get FCM token
 */
export const requestFCMToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    console.warn('[FCM] Notifications not supported in this browser');
    return null;
  }

  try {
    // Request notification permission
    if (Notification.permission === 'denied') {
      console.log('[FCM] Notification permission denied');
      return null;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('[FCM] Notification permission not granted');
        return null;
      }
    }

    // Initialize Firebase if not done
    const msg = initializeFirebase();
    if (!msg) return null;

    // Get FCM token
    const token = await getToken(msg, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('[FCM] FCM Token received:', token);
      // Save token to database for this user
      await saveFCMTokenToDatabase(token);
      return token;
    }
  } catch (error) {
    console.error('[FCM] Error getting FCM token:', error);
  }

  return null;
};

/**
 * Save FCM token to database
 */
export const saveFCMTokenToDatabase = async (token: string) => {
  try {
    const userData = localStorage.getItem('mpt_user');
    if (!userData) return;

    const user = JSON.parse(userData);
    const jwtToken = localStorage.getItem('mpt_token');

    const response = await fetch('/api/user/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        fcmToken: token,
        userId: user.id,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      }),
    });

    if (response.ok) {
      console.log('[FCM] Token saved to database');
    }
  } catch (error) {
    console.error('[FCM] Error saving token:', error);
  }
};

/**
 * Listen for incoming messages (foreground)
 */
export const listenForMessages = (callback: (message: any) => void) => {
  if (typeof window === 'undefined') return;

  try {
    const msg = initializeFirebase();
    if (!msg) return;

    onMessage(msg, (message) => {
      console.log('[FCM] Message received in foreground:', message);
      callback(message);
    });
  } catch (error) {
    console.error('[FCM] Error listening for messages:', error);
  }
};

/**
 * Request notification with custom options
 */
export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/mpt-logo.png',
        badge: '/mpt-logo.png',
        ...options,
      });
    });
  }
};

/**
 * Send test notification (for development)
 */
export const sendTestNotification = async () => {
  const jwtToken = localStorage.getItem('mpt_token');
  
  try {
    const response = await fetch('/api/notifications/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      console.log('[FCM] Test notification sent');
    }
  } catch (error) {
    console.error('[FCM] Error sending test notification:', error);
  }
};
