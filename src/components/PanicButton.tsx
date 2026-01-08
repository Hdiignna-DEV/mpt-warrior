'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Shield, Lock } from 'lucide-react';

const LOCKDOWN_KEY = 'mpt_lockdown_start_time';

export default function PanicButton() {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isLocked, setIsLocked] = useState(false); // Lockdown mode
  const [attemptedClose, setAttemptedClose] = useState(false); // Show warning if try to close
  const lockdownStartTime = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false); // Track if component is mounted

  // Initialize lockdown state from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const storedStartTime = localStorage.getItem(LOCKDOWN_KEY);
    
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = 900 - elapsedSeconds; // 900 = 15 minutes
      
      if (remainingTime > 0) {
        // Lockdown still active
        setIsLocked(true);
        setTimeLeft(remainingTime);
        setShowModal(true);
        lockdownStartTime.current = startTime;
      } else {
        // Lockdown time expired
        localStorage.removeItem(LOCKDOWN_KEY);
      }
    }
  }, []);

  // SPRINT 4: Lockdown mode - prevent any interaction until timer ends
  useEffect(() => {
    if (showModal && isLocked && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev - 1 <= 0) {
            // Timer finished - cleanup
            setIsLocked(false);
            localStorage.removeItem(LOCKDOWN_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showModal, isLocked, timeLeft]);

  // Prevent closing modal during lockdown
  const handleCloseAttempt = () => {
    if (isLocked) {
      setAttemptedClose(true);
      setTimeout(() => setAttemptedClose(false), 2000);
      return;
    }
    setShowModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    if (!isLocked) {
      setTimeLeft(900);
    }
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Floating Button - Improved positioning */}
      <button
        onClick={() => {
          const now = Date.now();
          setShowModal(true);
          setIsLocked(true); // Immediately activate lockdown
          lockdownStartTime.current = now;
          setTimeLeft(900); // Start 15-minute timer
          localStorage.setItem(LOCKDOWN_KEY, now.toString()); // Persist lockdown to survive refresh
        }}
        className="fixed bottom-24 right-3 sm:bottom-6 sm:right-6 z-40 group"
        aria-label="Panic Button - Emergency Mode"
      >
        <div className="relative">
          {/* Ping animation */}
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></span>
          
          {/* Button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
            <span className="font-bold hidden sm:inline">SOS</span>
          </div>
        </div>
      </button>

      {/* Modal - Full Screen - LOCKDOWN MODE */}
      {showModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300 ${
          isLocked ? 'bg-slate-950/98 backdrop-blur-lg' : 'bg-slate-950/95 backdrop-blur-md'
        }`}>
          {/* Prevent closing by clicking outside when locked */}
          {!isLocked && (
            <div 
              className="absolute inset-0" 
              onClick={handleCloseAttempt}
            />
          )}
          
          <div className={`w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col relative z-10 ${
            isLocked ? 'border-red-500/60 shadow-2xl shadow-red-500/30' : 'border-red-500/30'
          }`}>
            {/* Header */}
            <div className={`p-4 sm:p-6 relative flex-shrink-0 ${
              isLocked ? 'bg-gradient-to-r from-red-700 to-red-800' : 'bg-gradient-to-r from-red-600 to-red-700'
            }`}>
              {/* Close button - disabled when locked */}
              <button
                onClick={handleCloseAttempt}
                disabled={isLocked}
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 transition-all duration-300 ${
                  isLocked 
                    ? 'text-red-300 cursor-not-allowed opacity-50' 
                    : 'text-white/80 hover:text-white hover:rotate-90'
                }`}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Attempted close warning */}
              {attemptedClose && isLocked && (
                <div className="absolute top-2 right-12 sm:right-16 bg-red-400 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  ❌ Tidak bisa ditutup!
                </div>
              )}
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                  isLocked ? 'bg-white/30 animate-pulse' : 'bg-white/20'
                }`}>
                  {isLocked ? (
                    <Lock className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  ) : (
                    <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-wider break-words">
                    {isLocked ? '🔒 LOCKDOWN MODE' : '🚨 SOS MODE AKTIF'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    isLocked ? 'text-red-100 font-bold' : 'text-red-100'
                  }`}>
                    {isLocked ? 'Tidak ada yang bisa dilakukan sampai timer selesai' : 'Protokol Darurat Trading'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
              {/* Lockdown Status Indicator */}
              {isLocked && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-2 justify-center">
                    <Lock className="w-5 h-5 text-red-400 animate-bounce" />
                    <p className="text-red-300 font-bold text-sm">SISTEM TERKUNCI HINGGA TIMER SELESAI</p>
                  </div>
                </div>
              )}

              {/* Timer */}
              <div className={`rounded-xl p-4 sm:p-6 text-center border-2 transition-all ${
                isLocked 
                  ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/30' 
                  : 'bg-slate-800/50 border-slate-700'
              }`}>
                <p className={`text-xs sm:text-sm mb-2 font-bold ${
                  isLocked ? 'text-red-300' : 'text-slate-400'
                }`}>
                  {isLocked ? '⏱️ WAKTU ISTIRAHAT WAJIB:' : 'Break Time Wajib:'}
                </p>
                <div className={`text-5xl sm:text-6xl font-black font-mono tracking-wider ${
                  isLocked ? 'text-red-400 animate-pulse' : 'text-yellow-500'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <p className={`text-xs sm:text-sm mt-3 ${
                  isLocked ? 'text-red-300 italic font-semibold' : 'text-slate-400'
                }`}>
                  {isLocked 
                    ? '⚡ Jangan berbuat apapun sampai countdown selesai'
                    : 'Siap untuk emergency break?'
                  }
                </p>
                
                {/* Reset button - only when not locked */}
                {!isLocked && (
                  <button
                    onClick={resetTimer}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-400 hover:text-yellow-500 transition-colors"
                  >
                    Reset Timer
                  </button>
                )}
              </div>

              {/* Emergency Protocol */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${
                  isLocked ? 'text-red-400' : 'text-yellow-500'
                }`}>
                  <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                  {isLocked ? 'PROTOKOL LOCKDOWN' : 'PROTOKOL DARURAT'}
                </h3>

                <div className="space-y-2 sm:space-y-3">
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
                      className={`flex gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
                        isLocked
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-slate-800/30 border-slate-700/50 hover:border-yellow-500/30'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center font-black text-slate-900 text-sm ${
                        isLocked 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                      }`}>
                        {item.step}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold mb-0.5 text-sm sm:text-base ${
                          isLocked ? 'text-red-300' : 'text-white'
                        }`}>{item.title}</h4>
                        <p className={`text-xs sm:text-sm ${
                          isLocked ? 'text-red-200/60' : 'text-slate-400'
                        }`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className={`border-l-4 p-4 sm:p-6 rounded-r-xl ${
                isLocked
                  ? 'bg-red-500/10 border-l-red-500'
                  : 'bg-gradient-to-r from-slate-800 to-slate-700 border-l-yellow-500'
              }`}>
                <p className={`italic text-base sm:text-lg leading-relaxed ${
                  isLocked ? 'text-red-200' : 'text-slate-300'
                }`}>
                  &quot;Trader yang kalah adalah yang tidak bisa stop saat emosi. Warrior yang menang adalah yang tahu kapan harus mundur dan reset.&quot;
                </p>
                <p className={`font-bold mt-2 sm:mt-3 text-sm ${
                  isLocked ? 'text-red-400' : 'text-yellow-500'
                }`}>— MPT Philosophy</p>
              </div>

              {/* Action Buttons */}
              <div className={`space-y-3 sm:space-y-4`}>
                {isLocked ? (
                  <>
                    {/* Locked State - Only show message and comeback button */}
                    <div className="text-center py-3 sm:py-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-300 font-bold mb-1 text-sm sm:text-base">🔒 SISTEM TERKUNCI</p>
                      <p className="text-red-200/60 text-xs sm:text-sm">Tunggu timer hingga 0:00</p>
                    </div>

                    {/* Comeback Button - Try to close but prevented by lockdown */}
                    <button
                      onClick={handleCloseAttempt}
                      className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-slate-500 font-black py-3 sm:py-4 rounded-xl cursor-not-allowed opacity-50 text-sm sm:text-base"
                      disabled
                    >
                      SAYA SIAP COMEBACK 💪
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCloseAttempt}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-black py-3 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/30 text-sm sm:text-base"
                  >
                    SAYA SIAP COMEBACK 💪
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}