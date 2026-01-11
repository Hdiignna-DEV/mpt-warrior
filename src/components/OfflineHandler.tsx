'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * OfflineHandler Component
 * Displays elegant "Connection Lost - Reconnecting..." UI
 * Automatically hides when connection is restored
 */
export function OfflineHandler() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 rounded-full p-4">
            <WifiOff className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-slate-100 mb-2">
          Connection Lost
        </h2>

        {/* Description */}
        <p className="text-center text-slate-400 mb-6">
          Trying to reconnect to the network...
        </p>

        {/* Reconnecting Animation */}
        <div className="flex justify-center gap-1 mb-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            {isOnline ? (
              <span className="text-green-400 font-medium">✓ Connected</span>
            ) : (
              <span>Offline Mode - Limited functionality</span>
            )}
          </p>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            💡 Check your internet connection or try again in a moment
          </p>
        </div>
      </div>
    </div>
  );
}
