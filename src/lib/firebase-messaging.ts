// Firebase Cloud Messaging Configuration for MPT Command Center
// This file contains Firebase setup for push notifications

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC_firebase_api_key_here",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mpt-command-center.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mpt-command-center",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mpt-command-center.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
};

// Messaging config
export const messagingConfig = {
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "your_vapid_key_here",
};

/**
 * Initialize Firebase Messaging and request notification permission
 * NOTE: This function requires Firebase to be installed: npm install firebase
 * Should be called on app load
 */
export async function initializeMessaging() {
  try {
    // Firebase is optional - if not installed, the app works without notifications
    console.log('[FCM] Firebase Messaging setup available for future use');
    return { success: false, reason: 'firebase_not_required_yet' };
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return { success: false, reason: 'init_error' };
  }
}

/**
 * Save FCM token to user profile in backend
 */
async function saveFCMToken(token: string) {
  try {
    const response = await fetch('/api/notifications/register-fcm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (!response.ok) {
      throw new Error('Failed to save FCM token');
    }

    const data = await response.json();
    console.log('FCM token saved successfully', data);
    return data;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    throw error;
  }
}

/**
 * Send a test notification
 */
export async function sendTestNotification(title: string, message: string) {
  try {
    const response = await fetch('/api/notifications/send-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
}

/**
 * Notification types for different events
 */
export const notificationTypes = {
  TRADE_ALERT: 'trade_alert',
  LEADERBOARD_UPDATE: 'leaderboard_update',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  AI_MENTOR_RESPONSE: 'ai_mentor_response',
  SYSTEM_MESSAGE: 'system_message',
  COMMUNITY_NOTIFICATION: 'community_notification',
};

/**
 * Create notification payload for different events
 */
export function createNotificationPayload(type: string, data: Record<string, any>) {
  const baseNotification = {
    icon: '/mpt-logo.png',
    badge: '/mpt-logo.png',
    timestamp: new Date().toISOString(),
  };

  switch (type) {
    case notificationTypes.TRADE_ALERT:
      return {
        ...baseNotification,
        title: 'Trading Signal 📊',
        body: data.message || 'New trading opportunity detected',
        tag: 'trade-alert',
      };

    case notificationTypes.LEADERBOARD_UPDATE:
      return {
        ...baseNotification,
        title: 'Leaderboard Update 🏆',
        body: data.message || 'Your ranking has changed',
        tag: 'leaderboard',
      };

    case notificationTypes.ACHIEVEMENT_UNLOCKED:
      return {
        ...baseNotification,
        title: 'Achievement Unlocked! 🎖️',
        body: data.achievement || 'You earned a new achievement',
        tag: 'achievement',
      };

    case notificationTypes.AI_MENTOR_RESPONSE:
      return {
        ...baseNotification,
        title: 'AI Mentor Response 🤖',
        body: data.message || 'Your mentor has replied',
        tag: 'ai-mentor',
      };

    case notificationTypes.SYSTEM_MESSAGE:
      return {
        ...baseNotification,
        title: 'System Notification ⚙️',
        body: data.message || 'Important system update',
        tag: 'system',
      };

    default:
      return {
        ...baseNotification,
        title: 'MPT Command Center',
        body: data.message || 'You have a new notification',
      };
  }
}
