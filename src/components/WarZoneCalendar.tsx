'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WarZoneCalendar() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme
    setMounted(true);
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40"
        aria-label="War Zone Calendar"
      >
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-danger-600 to-danger-600 hover:from-danger-700 hover:to-danger-700 text-white px-6 py-4 rounded-full shadow-lg shadow-danger-500/50 transition-all duration-300 hover:scale-105">
            <AlertTriangle className="w-6 h-6 animate-pulse flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-red-100" suppressHydrationWarning>{t('warzone.alert')}</p>
              <p className="text-sm font-bold text-secondary-300" suppressHydrationWarning>
                {t('warzone.economicCalendar')}
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* Modal Portal - FULL SCREEN OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Modal Box */}
            <div 
              className="w-full h-[90vh] md:h-auto md:max-w-4xl md:max-h-[90vh] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 md:px-6 py-4 md:py-6 flex-shrink-0 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 text-white hover:text-white/80 transition-all p-1 z-10"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 md:w-7 md:h-7" />
                </button>
                
                <div className="flex items-center gap-2 md:gap-4 pr-10">
                  <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-2xl font-black text-white tracking-wider truncate" suppressHydrationWarning>
                      🚨 {t('warzone.title')}
                    </h2>
                    <p className="text-xs md:text-sm text-red-100 truncate" suppressHydrationWarning>
                      {t('warzone.subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto w-full px-4 md:px-6 py-4 md:py-6">
                <div className="w-full h-[350px] md:h-[500px] border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                  <iframe
                    title="TradingView Economic Calendar"
                    src="https://www.tradingview.com/events/"
                    className="w-full h-full"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: isDark ? '#030712' : '#ffffff',
                    }}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-100/50 dark:bg-slate-950/50 border-t border-red-500/30 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
                <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm text-center" suppressHydrationWarning>
                  <strong className="text-red-400">⚠️ {t('warzone.warning')}</strong> = {t('warzone.warningText')}
                </p>
              </div>

              {/* Action Button */}
              <div className="px-4 md:px-6 pb-4 md:pb-6 flex-shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-slate-900 font-black py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-accent-500/30 text-sm md:text-base"
                  suppressHydrationWarning
                >
                  {t('warzone.close')} ✅
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}