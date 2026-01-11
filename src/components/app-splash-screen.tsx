import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Splash Screen Component
 * Menampilkan logo MPT Trading HUB selama 3 detik saat app dibuka
 * Hanya ditampilkan di Capacitor/native app
 */
export function AppSplashScreen({ onLoadComplete }: { onLoadComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cek jika running di Capacitor (native app)
    const isNativeApp = typeof (window as any).capacitor !== 'undefined';

    if (isNativeApp) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoadComplete();
      }, 3000); // 3 detik

      return () => clearTimeout(timer);
    } else {
      // Jika web browser, skip splash screen
      onLoadComplete();
    }
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center z-50">
      {/* Logo Animation */}
      <div className="text-center animate-fade-in">
        <div className="mb-8 animate-bounce">
          <Image 
            src="/mpt-logo.png" 
            alt="MPT Logo" 
            width={120} 
            height={120}
            priority
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-amber-400 mb-2">MPT TRADING HUB</h1>
        <p className="text-lg text-amber-500/70 font-mono">Mindset Plan Trader</p>

        {/* Loading Bar */}
        <div className="mt-8 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <p className="text-slate-500 text-sm mt-4 animate-pulse">Mempersiapkan aplikasi...</p>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-8 text-slate-600 text-xs">
        <p>v1.0.0</p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}
