'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function TradingViewCalendar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Button - RESPONSIVE SIZE */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 group"
        aria-label="War Zone Calendar"
      >
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          <div className="relative flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-3 md:px-6 py-2 md:py-4 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105">
            <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 animate-pulse flex-shrink-0" />
            <div className="text-left hidden md:block">
              <p className="text-xs text-red-100">WAR ZONE ALERT</p>
              <p className="text-sm font-bold text-yellow-300">
                Economic Calendar (Live)
              </p>
            </div>
            <div className="md:hidden text-left">
              <p className="text-xs font-bold text-yellow-300">War Zone</p>
            </div>
          </div>
        </div>
      </button>

      {/* Modal Portal - FULL SCREEN OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-4">
            {/* Modal Box */}
            <div 
              className="w-full max-h-[95vh] md:max-h-[92vh] md:w-full md:max-w-5xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl shadow-red-500/50 border border-red-500/40 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 px-4 md:px-8 py-4 md:py-7 flex-shrink-0 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 md:top-6 md:right-6 text-white hover:text-white/80 transition-all p-2 hover:bg-white/10 rounded-lg z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 md:w-7 md:h-7" />
                </button>
                
                <div className="flex items-center gap-2 md:gap-5 pr-10">
                  <div className="p-2 md:p-4 bg-white/20 rounded-lg md:rounded-2xl flex-shrink-0 backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 md:w-8 md:h-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <h2 className="text-base md:text-3xl font-black text-white tracking-wider drop-shadow-lg">
                        🚨 WAR ZONE
                      </h2>
                      <span className="hidden md:inline text-xs bg-white/30 text-white px-3 py-1 rounded-full font-bold">LIVE</span>
                    </div>
                    <p className="text-xs md:text-sm text-red-100 mt-1 drop-shadow">
                      Real-Time Economic Events
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Calendar */}
              <div className="flex-1 overflow-auto w-full bg-slate-950">
                {/* Investing.com Calendar Embed */}
                <iframe
                  title="Economic Calendar"
                  src="https://www.investing.com/economic-calendar/"
                  className="w-full h-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#030712',
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-t border-red-500/40 px-3 md:px-8 py-2 md:py-4 flex-shrink-0">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-yellow-400 text-base md:text-xl">⚠️</span>
                  <p className="text-slate-300 text-xs md:text-sm font-semibold text-center">
                    <strong className="text-red-400">HIGH IMPACT</strong> = Stay away or tighten SL!
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className="px-3 md:px-8 pb-3 md:pb-6 pt-2 md:pt-4 flex-shrink-0 bg-gradient-to-t from-slate-900 to-transparent">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-slate-900 font-black py-2 md:py-4 rounded-lg md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/40 text-xs md:text-base tracking-wider"
                >
                  ✅ CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}