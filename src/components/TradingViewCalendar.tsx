'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TradingViewCalendar() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    if (isExpanded && typeof window !== 'undefined') {
      console.log('Loading TradingView widget with theme:', isDark ? 'dark' : 'light');
      
      // Load TradingView widget script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: isDark ? 'dark' : 'light',
        isTransparent: false,
        width: '100%',
        height: '500',
        locale: 'en',
        importanceFilter: '0,1',
        countryFilter: 'us,gb,jp,eu,au,ca,ch,cn'
      });

      const container = document.getElementById('tradingview-calendar-widget');
      if (container) {
        // Force complete reload
        container.innerHTML = '';
        
        // Small delay to ensure clean state
        setTimeout(() => {
          const widgetDiv = document.createElement('div');
          widgetDiv.className = 'tradingview-widget-container__widget';
          container.appendChild(widgetDiv);
          container.appendChild(script);
        }, 50);
      }
    }
  }, [isExpanded, isDark]);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-3 md:px-6 py-2 md:py-4 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
            <AlertTriangle size={16} className="md:w-6 md:h-6 text-white animate-pulse relative" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs text-red-100" suppressHydrationWarning>{t('warzone.alert')}</p>
            <p className="text-sm font-bold text-yellow-300" suppressHydrationWarning>
              {t('warzone.economicCalendar')}
            </p>
          </div>
          <div className="md:hidden text-left">
            <p className="text-xs font-bold text-yellow-300" suppressHydrationWarning>{t('warzone.alert')}</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        onClick={() => setIsExpanded(false)}
      />

      {/* Modal - Full Screen */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-4">
        <div className="w-full max-h-[95vh] md:max-h-[92vh] md:max-w-4xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl shadow-red-500/50 border border-red-500/40 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 px-4 md:px-6 py-4 md:py-6 flex-shrink-0 relative">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-white hover:text-white/80 transition-all p-2 hover:bg-white/10 rounded-lg z-10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="flex items-center gap-2 md:gap-4 pr-10">
              <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl flex-shrink-0">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-2xl font-black text-white tracking-wider truncate" suppressHydrationWarning>
                  🚨 {t('warzone.title')}
                </h2>
                <p className="text-xs md:text-sm text-red-100 mt-1" suppressHydrationWarning>
                  {t('warzone.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* TradingView Calendar Widget */}
          <div className="flex-1 overflow-auto w-full bg-white dark:bg-slate-950 p-4">
            <div id="tradingview-calendar-widget" className="tradingview-widget-container h-full">
              <div className="tradingview-widget-container__widget h-full"></div>
            </div>
          </div>

          {/* Warning Footer */}
          <div className="bg-slate-100/50 dark:bg-slate-950 border-t border-red-500/30 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 text-center" suppressHydrationWarning>
              <span className="text-yellow-500">⚠️</span> <strong className="text-red-400">{t('warzone.warning')}</strong> = {t('warzone.warningText')}
            </p>
          </div>

          {/* Close Button */}
          <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 md:pt-4 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-slate-900 font-black py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/40 text-xs md:text-base"
              suppressHydrationWarning
            >
              ✅ {t('warzone.close')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}