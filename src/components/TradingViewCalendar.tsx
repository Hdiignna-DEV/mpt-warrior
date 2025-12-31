'use client';
import { useState, useEffect } from 'react';
import { TrendingDown, X, ExternalLink } from 'lucide-react';

export default function TradingViewCalendar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isExpanded && isMounted) {
      // Load TradingView widget script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      script.async = true;
      script.type = 'text/javascript';
      
      const container = document.getElementById('tradingview-widget-container');
      if (container && !container.querySelector('script')) {
        container.appendChild(script);
      }
    }
  }, [isExpanded, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-24 left-6 z-40 group hover:scale-110 transition-transform duration-300"
        title="TradingView Economic Calendar"
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300">
            <TrendingDown size={24} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 px-2 py-1 bg-red-600 rounded-full text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            CALENDAR
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-full max-w-sm md:max-w-md lg:max-w-lg animate-in slide-in-from-left duration-300">
      <div className="bg-slate-900 border-2 border-orange-500/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingDown size={20} className="text-white" />
            <div>
              <h3 className="font-bold text-white">ECONOMIC CALENDAR</h3>
              <p className="text-xs text-orange-100">TradingView Real-time</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-red-700/30 rounded transition-all"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* TradingView Widget Container */}
        <div className="overflow-hidden">
          <div id="tradingview-widget-container" className="bg-slate-950">
            <div className="tradingview-widget-container__widget" style={{ height: '500px' }}>
              <script type="text/plain" className="tradingview-widget-scr">
                {`
                  {
                    "colorTheme": "dark",
                    "isTransparent": false,
                    "largeChartUrl": "https://www.tradingview.com/calendar/",
                    "width": "100%",
                    "height": "500"
                  }
                `}
              </script>
            </div>
          </div>

          {/* Fallback Info */}
          <div className="p-5 space-y-4 bg-slate-950 border-t border-slate-800">
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3">
              <p className="text-orange-300 text-xs font-semibold">📊 TRADINGVIEW ECONOMIC CALENDAR</p>
              <p className="text-orange-200/80 text-xs mt-1">Real-time data dari TradingView dengan analytics mendalam</p>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-xs font-semibold">🔍 Features:</p>
              <ul className="text-slate-400 text-xs space-y-1">
                <li>✓ Real-time event updates</li>
                <li>✓ Importance indicators (Red/Orange/Yellow)</li>
                <li>✓ Forecast vs Actual data</li>
                <li>✓ Multi-currency support</li>
                <li>✓ Mobile responsive</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href="https://www.tradingview.com/calendar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-xs transition-colors"
              >
                Open Full Calendar
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-300 text-xs font-semibold">⚠️ TRADING TIP</p>
              <p className="text-yellow-200/80 text-xs mt-1">Avoid trading during HIGH impact events. Plan your trades according to the calendar!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}