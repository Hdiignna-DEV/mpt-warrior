'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Only show prompt if not installed and not dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    if (!standalone && daysSinceDismissed > 7) {
      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        
        // Show custom prompt after 3 seconds
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // For iOS, show custom install instructions
      if (ios && !standalone) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slideUp">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-sky-500/30 rounded-2xl shadow-2xl p-6">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Install MPT Warrior App
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {isIOS 
                ? 'Tambahkan ke Home Screen untuk akses cepat & pengalaman lebih baik!'
                : 'Install sebagai aplikasi untuk akses cepat & offline support!'}
            </p>

            {isIOS ? (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2">
                  <span className="text-xl">1️⃣</span>
                  Tap tombol <strong>Share</strong> di Safari
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">2️⃣</span>
                  Pilih <strong>"Add to Home Screen"</strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">3️⃣</span>
                  Tap <strong>"Add"</strong>
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Install Sekarang
              </button>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">
              ✨ Offline support • 🚀 Fast loading • 📱 Native experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
