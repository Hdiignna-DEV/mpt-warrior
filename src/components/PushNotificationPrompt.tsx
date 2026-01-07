'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import {
  isPushSupported,
  requestNotificationPermission,
  getNotificationPermission,
  TradingNotifications,
} from '@/utils/pushNotifications';

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if push is supported
    if (!isPushSupported()) {
      return;
    }

    // Get current permission
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Show prompt if not yet decided and user has been active
    if (currentPermission === 'default') {
      // Don't show immediately, wait for user to be engaged
      const timer = setTimeout(() => {
        // Check if user has dismissed before
        const dismissed = localStorage.getItem('push-prompt-dismissed');
        const dismissedAt = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

        // Show if never dismissed or dismissed more than 7 days ago
        if (!dismissed || daysSinceDismissed > 7) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds of activity

      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    setShowPrompt(false);

    if (result === 'granted') {
      // Show welcome notification
      TradingNotifications.dailyReminder(
        'Notifications enabled! You\'ll receive updates on trades, achievements, and more.'
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already decided or not supported
  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg shadow-2xl p-4 border border-amber-400/30">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="bg-white/20 rounded-lg p-2">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-bold text-lg mb-1">Stay Updated, Warrior!</h3>
            <p className="text-sm text-white/90">
              Get real-time alerts for trades, achievements, and daily reminders to maintain your trading discipline.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEnable}
            className="flex-1 bg-white text-amber-600 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Enable Notifications
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            Later
          </button>
        </div>

        <p className="text-xs text-white/70 mt-2 text-center">
          You can change this anytime in settings
        </p>
      </div>
    </div>
  );
}
