'use client';
import { useState, useEffect } from 'react';
import { Siren, X } from 'lucide-react';

export default function TradingViewCalendar() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded && typeof window !== 'undefined') {
      // Load TradingView widget script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: 'dark',
        isTransparent: true,
        width: '100%',
        height: '500',
        locale: 'en',
        importanceFilter: '0,1',
        countryFilter: 'us,gb,jp,eu,au,ca,ch,cn'
      });

      const container = document.getElementById('tradingview-calendar-widget');
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
      }
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 hover:border-yellow-500 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3">
            <Siren size={20} className="text-red-500 animate-pulse" />
            <div className="text-left">
              <p className="text-xs text-slate-400">WAR ZONE ALERT</p>
              <p className="text-sm font-bold text-yellow-500">
                Economic Calendar (Live)
              </p>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[450px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren size={20} className="text-red-500 animate-pulse" />
            <h3 className="font-bold text-red-500">ZONA PERANG</h3>
            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">
              LIVE
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-white text-xl"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Real-Time Economic Events via TradingView
        </p>
      </div>

      {/* TradingView Calendar Widget */}
      <div className="bg-slate-950 p-4">
        <div id="tradingview-calendar-widget" className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      {/* Warning Footer */}
      <div className="bg-slate-950 border-t border-slate-800 p-4">
        <p className="text-xs text-slate-400 text-center">
          ⚠️ <strong className="text-yellow-500">NO PLAN, NO TRADE</strong>
        </p>
        <p className="text-xs text-slate-400 text-center mt-1">
          Stay away during HIGH impact (red flag) events
        </p>
      </div>
    </div>
  );
}