import { useEffect, useState } from 'react';

/**
 * Splash Screen Component
 * Menampilkan logo MPT Warrior selama 2-3 detik saat app dibuka
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-50">
      {/* Logo Animation */}
      <div className="text-center animate-fade-in">
        <div className="mb-8 animate-bounce">
          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
            {/* MPT Logo SVG */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="#0284c7" strokeWidth="2" />
            <text x="60" y="70" textAnchor="middle" className="text-white font-bold text-4xl" fill="#ffffff">
              MPT
            </text>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">MPT Warrior</h1>
        <p className="text-lg text-slate-400">Trading Hub</p>

        {/* Loading Bar */}
        <div className="mt-8 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <p className="text-slate-500 text-sm mt-4 animate-pulse">Loading...</p>
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
