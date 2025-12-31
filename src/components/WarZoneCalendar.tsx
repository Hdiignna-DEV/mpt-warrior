'use client';

import { useState } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';

export default function WarZoneCalendar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Button - BESAR & PROMINENT SEPERTI SOS */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 group"
        aria-label="War Zone Calendar"
      >
        <div className="relative">
          {/* Ping animation */}
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          {/* Button BESAR */}
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-4 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <div className="text-left">
              <p className="text-xs text-red-100">WAR ZONE ALERT</p>
              <p className="text-sm font-bold text-yellow-300">
                Economic Calendar (Live)
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* Modal - SAMA SEPERTI SOS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden">
            {/* Header - SAMA SEPERTI SOS */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:rotate-90 transition-all duration-300"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider">
                    🚨 WAR ZONE CALENDAR
                  </h2>
                  <p className="text-red-100 text-sm mt-1">
                    Economic Events Real-Time
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="w-full h-[500px] border border-slate-700 rounded-xl overflow-hidden">
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
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-t border-red-500/30 p-6">
              <p className="text-slate-300 text-center">
                <strong className="text-red-400">⚠️ HIGH IMPACT EVENTS</strong> = Hindari trade atau ketatkan SL
              </p>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-black py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/30"
              >
                TUTUP ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}