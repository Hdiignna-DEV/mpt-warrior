'use client';

import { useState } from 'react';
import { Calendar, X, ChevronUp, AlertTriangle } from 'lucide-react';

export default function WarZoneCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Button - Improved positioning */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 group"
        aria-label="War Zone Economic Calendar"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white px-4 py-3 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider">War Zone Alert</span>
            <span className="text-[10px] text-red-100">Economic Calendar</span>
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 p-4 md:p-6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-white/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-wider">
                      ZONA PERANG
                    </h2>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <p className="text-red-100 text-xs md:text-sm mt-1">
                    Real-Time Economic Events via TradingView
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 p-2"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-slate-900">
              <iframe
                src="https://economic-calendar.tradingview.com?colorTheme=dark&lang=en"
                className="w-full h-full min-h-[500px] md:min-h-[600px]"
                title="Economic Calendar"
              />
            </div>

            {/* Footer Warning */}
            <div className="bg-gradient-to-r from-red-950 to-orange-950 border-t border-red-500/30 p-4 flex items-center gap-3 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-yellow-500 font-bold text-sm">⚠️ NO PLAN, NO TRADE</p>
                <p className="text-slate-400 text-xs mt-1">
                  Stay away during HIGH impact (red flag) events
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}