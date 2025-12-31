'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export default function WarZoneCalendar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Button - SAMA SEPERTI SOS */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-32 left-4 md:bottom-6 md:left-6 z-40 group"
        aria-label="War Zone Calendar"
      >
        <div className="relative">
          {/* Ping animation */}
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          {/* Button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-3 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105">
            <Calendar className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm hidden md:inline">War Zone</span>
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
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider">
                    📊 WAR ZONE CALENDAR
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
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-black py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
              >
                CLOSE ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}