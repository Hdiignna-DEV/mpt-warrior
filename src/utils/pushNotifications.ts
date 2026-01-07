// Push Notification Service for MPT Warrior
// Uses Web Push API for trading alerts

export interface PushNotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

// Check if browser supports push notifications
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// Subscribe to push notifications
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Subscribe to push
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      console.log('Push subscription created:', subscription);
    }

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
}

// Show local notification (doesn't require server)
export async function showLocalNotification(config: PushNotificationConfig): Promise<void> {
  if (!isPushSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(config.title, {
      body: config.body,
      icon: config.icon || '/images/logo-192.png',
      badge: config.badge || '/images/badge-72.png',
      tag: config.tag || 'mpt-warrior',
      data: config.data,
      ...(config.actions && { actions: config.actions }),
      vibrate: [200, 100, 200],
      requireInteraction: false,
    } as NotificationOptions);

    console.log('Notification shown:', config.title);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Trading-specific notification helpers
export const TradingNotifications = {
  // Notify when trade is closed
  tradeClosed: (pair: string, result: 'WIN' | 'LOSS', pips: number) => {
    const emoji = result === 'WIN' ? '🎯' : '📊';
    const color = result === 'WIN' ? 'success' : 'info';

    return showLocalNotification({
      title: `${emoji} Trade Closed: ${pair}`,
      body: `Result: ${result} | ${pips > 0 ? '+' : ''}${pips} pips`,
      tag: `trade-${Date.now()}`,
      data: { type: 'trade', pair, result, pips },
      icon: result === 'WIN' ? '/images/win-icon.png' : '/images/loss-icon.png',
    });
  },

  // Notify on achievement unlock
  achievementUnlocked: (achievement: string, description: string) => {
    return showLocalNotification({
      title: '🏆 Achievement Unlocked!',
      body: `${achievement}: ${description}`,
      tag: 'achievement',
      data: { type: 'achievement', achievement },
      icon: '/images/trophy-icon.png',
    });
  },

  // Daily reminder
  dailyReminder: (message: string) => {
    return showLocalNotification({
      title: '⚔️ MPT Warrior Daily',
      body: message,
      tag: 'daily-reminder',
      data: { type: 'reminder' },
    });
  },

  // Win streak notification
  winStreak: (streak: number) => {
    return showLocalNotification({
      title: '🔥 Win Streak!',
      body: `You're on a ${streak}-trade winning streak! Keep it up, Warrior!`,
      tag: 'win-streak',
      data: { type: 'streak', count: streak },
    });
  },

  // Risk alert
  riskAlert: (message: string) => {
    return showLocalNotification({
      title: '⚠️ Risk Alert',
      body: message,
      tag: 'risk-alert',
      data: { type: 'risk' },
      actions: [
        { action: 'view', title: 'View Calculator' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
  },
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Save subscription to server (for future use)
export async function saveSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving subscription to server:', error);
    return false;
  }
}

// Initialize push notifications
export async function initializePushNotifications(): Promise<void> {
  if (!isPushSupported()) {
    console.log('Push notifications not supported on this device');
    return;
  }

  // Request permission on first load (only if not already asked)
  const currentPermission = Notification.permission;

  if (currentPermission === 'default') {
    console.log('Notification permission not yet requested');
    // Don't auto-request, let user trigger it
    return;
  }

  if (currentPermission === 'granted') {
    console.log('Notifications already enabled');

    // Optional: Subscribe to push server
    // const vapidKey = 'YOUR_VAPID_PUBLIC_KEY';
    // const subscription = await subscribeToPush(vapidKey);
    // if (subscription) {
    //   await saveSubscriptionToServer(subscription);
    // }
  }
}

// Export notification permission status
export function getNotificationPermission(): NotificationPermission {
  return Notification.permission;
}
