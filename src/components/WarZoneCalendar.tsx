'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export default function WarZoneCalendar() {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <>
      {/* Floating Button - ALWAYS VISIBLE */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-20 left-4 md:left-6 z-40 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 animate-pulse"
          title="Open War Zone Calendar"
        >
          <Calendar className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold">War Zone</span>
        </button>
      )}

      {/* BACKDROP - Full screen (z-50) */}
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsMinimized(true)}
        />
      )}

      {/* MODAL - On top of everything (z-50 + content) */}
      {!isMinimized && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
          <div 
            className="w-full h-[85vh] md:h-[90vh] md:w-full md:max-w-5xl bg-slate-950 border border-red-500/50 rounded-t-3xl md:rounded-2xl shadow-2xl shadow-red-500/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-0 duration-300 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* HEADER */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-red-700/50 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Calendar className="w-5 md:w-6 h-5 md:h-6 text-white flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-black tracking-wider text-white truncate">WAR ZONE CALENDAR</h2>
                  <p className="text-xs text-red-100">📊 Economic Events Calendar</p>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-red-700 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
                title="Close War Zone Calendar"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* CONTENT - TradingView Calendar */}
            <div className="flex-1 overflow-auto w-full bg-slate-900/50">
              <iframe
                title="TradingView Economic Calendar"
                src="https://www.tradingview.com/events/"
                className="w-full h-full"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#030712',
                }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* FOOTER */}
            <div className="bg-red-950/40 border-t border-red-500/30 px-4 md:px-6 py-2 md:py-3 text-xs text-red-200 flex-shrink-0">
              <p className="flex items-center gap-2">
                <span>⚠️</span>
                <span>High Impact Events = Hindari trading! Ketatkan SL atau skip trade!</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}