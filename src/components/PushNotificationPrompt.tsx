'use client';

import { useEffect, useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { setupPushNotifications } from '@/lib/fcm';

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      return;
    }

    // Get current permission
    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    // Show prompt if not yet decided
    if (currentPermission === 'default') {
      // Show prompt after user has been engaged for a bit
      const timer = setTimeout(() => {
        // Check if user has dismissed before
        const dismissed = localStorage.getItem('push-prompt-dismissed');
        const dismissedAt = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

        // Show if never dismissed or dismissed more than 7 days ago
        if (!dismissed || daysSinceDismissed > 7) {
          setShowPrompt(true);
        }
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const token = await setupPushNotifications();
      if (token) {
        setPermission('granted');
        setShowPrompt(false);
        localStorage.removeItem('push-prompt-dismissed');
        console.log('[Push Notifications] Enabled successfully');
      } else {
        console.warn('[Push Notifications] No token received');
      }
    } catch (error) {
      console.error('[Push Notifications] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    localStorage.setItem('push-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-xl overflow-hidden border border-blue-500/50">
        <div className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-blue-200 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-6">
              <h3 className="font-bold text-base mb-1">Stay Updated!</h3>
              <p className="text-sm text-blue-100 mb-3">
                Get real-time notifications untuk trading updates, achievements, dan insights dari AI mentor.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleEnable}
                  disabled={isLoading}
                  className="flex-1 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm px-3 py-2 rounded"
                >
                  {isLoading ? (
                    <>
                      <div className="inline-block w-3 h-3 border-2 border-white border-t-blue-700 rounded-full animate-spin mr-1" />
                      Enabling...
                    </>
                  ) : (
                    <>
                      <Check size={14} className="mr-1" />
                      Aktifkan
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="border border-blue-300/50 text-blue-100 hover:bg-blue-500/20 text-sm px-3 py-2 rounded"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
