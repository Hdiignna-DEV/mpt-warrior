'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Shield } from 'lucide-react';

export default function PanicButton() {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (showModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showModal, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(900);
  };

  return (
    <>
      {/* Floating Button - Improved positioning */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 group"
        aria-label="Panic Button - Emergency Mode"
      >
        <div className="relative">
          {/* Ping animation */}
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          {/* Button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm hidden md:inline">SOS</span>
          </div>
        </div>
      </button>

      {/* Modal - Full Screen */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:rotate-90 transition-all duration-300"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider">
                    🚨 SOS MODE AKTIF
                  </h2>
                  <p className="text-red-100 text-sm mt-1">
                    Protokol Darurat Trading
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Timer */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <p className="text-slate-400 text-sm mb-2">Break Time Wajib:</p>
                <div className="text-5xl font-black text-yellow-500 font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={resetTimer}
                  className="mt-4 text-sm text-slate-400 hover:text-yellow-500 transition-colors"
                >
                  Reset Timer
                </button>
              </div>

              {/* Emergency Protocol */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  PROTOKOL DARURAT
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      step: '1',
                      title: 'STOP TRADING SEKARANG',
                      desc: 'Tutup platform trading. Jangan buka chart 15 menit.',
                    },
                    {
                      step: '2',
                      title: 'TARIK NAFAS DALAM',
                      desc: '4 detik hirup, 4 detik tahan, 4 detik hembuskan (3x).',
                    },
                    {
                      step: '3',
                      title: 'REVIEW JURNAL',
                      desc: 'Baca 3 trade WIN terakhir. Ingat feeling saat profit.',
                    },
                    {
                      step: '4',
                      title: 'RESET MENTAL',
                      desc: 'Walk away. Minum air. Comeback dengan mindset fresh.',
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:border-yellow-500/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center font-black text-slate-900">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                <p className="text-slate-300 italic text-lg leading-relaxed">
                  "Trader yang kalah adalah yang tidak bisa stop saat emosi. Warrior yang menang adalah yang tahu kapan harus mundur dan reset."
                </p>
                <p className="text-yellow-500 font-bold mt-3">— MPT Philosophy</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-black py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/30"
              >
                SAYA SIAP COMEBACK 💪
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}