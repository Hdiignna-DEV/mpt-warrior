/**
 * Hook for Firebase Cloud Messaging
 */

'use client';

import { useEffect, useState } from 'react';
import {
  initializeFirebase,
  requestFCMToken,
  listenForMessages,
  saveFCMTokenToDatabase,
} from '@/utils/fcm';
import { toast } from '@/utils/toast';

interface FCMMessage {
  notification?: {
    title: string;
    body: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if FCM is supported
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'Notification' in window;
    setIsSupported(supported);
  }, []);

  // Request FCM token
  const requestToken = async () => {
    if (!isSupported) {
      console.warn('[FCM] Notifications not supported');
      return null;
    }

    setIsLoading(true);
    try {
      const fcmToken = await requestFCMToken();
      if (fcmToken) {
        setToken(fcmToken);
        console.log('[FCM] Token obtained:', fcmToken);
        
        // Save token to database
        await saveFCMTokenToDatabase(fcmToken);
        console.log('[FCM] Token saved to database');
      }
      return fcmToken;
    } catch (error) {
      console.error('[FCM] Error requesting token:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for messages
  useEffect(() => {
    if (!isSupported || !token) return;

    listenForMessages((message: FCMMessage) => {
      console.log('[FCM] Foreground message:', message);

      if (message.notification) {
        toast.success(message.notification.title);
        
        // Handle specific message types
        if (message.data?.type === 'trading-alert') {
          // Handle trading alert
          console.log('[FCM] Trading alert:', message.data);
        } else if (message.data?.type === 'user-notification') {
          // Handle user notification
          console.log('[FCM] User notification:', message.data);
        }
      }
    });
  }, [isSupported, token]);

  return {
    token,
    isLoading,
    isSupported,
    requestToken,
  };
}
