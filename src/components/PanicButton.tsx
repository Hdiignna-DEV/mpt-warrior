'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function PanicButton() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes = 900 seconds

  useEffect(() => {
    if (!isSOSActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsSOSActive(false);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSOSActive]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (isSOSActive) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0">
        {/* Close Button */}
        <button
          onClick={() => setIsSOSActive(false)}
          className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={32} />
        </button>

        {/* Main Content - Scrollable for mobile */}
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 md:p-12 border border-red-900/50 shadow-2xl">
            
            {/* Header with icon */}
            <div className="text-center mb-8 md:mb-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/20 rounded-full border-2 border-red-500 animate-pulse">
                  <AlertTriangle size={48} className="text-red-500" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-red-500 mb-2">
                PROTOKOL SOS AKTIF
              </h1>
              <p className="text-yellow-400 text-lg md:text-xl font-bold">⚠️ EMERGENCY MODE ⚠️</p>
            </div>

            {/* Instructions */}
            <div className="space-y-4 md:space-y-6 mb-10 md:mb-14">
              <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border-l-4 border-yellow-500">
                <div className="flex gap-3 md:gap-4">
                  <span className="text-yellow-500 font-black text-2xl md:text-3xl shrink-0">1.</span>
                  <div>
                    <p className="text-yellow-400 font-bold text-base md:text-lg mb-1">Tarik napas dalam-dalam</p>
                    <p className="text-slate-300 text-sm md:text-base">Hitungan 5 detik, tahan, lalu hembuskan perlahan. Ulangi 3-5 kali.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border-l-4 border-red-500">
                <div className="flex gap-3 md:gap-4">
                  <span className="text-red-500 font-black text-2xl md:text-3xl shrink-0">2.</span>
                  <div>
                    <p className="text-red-400 font-bold text-base md:text-lg mb-1">Tutup MetaTrader SEKARANG</p>
                    <p className="text-slate-300 text-sm md:text-base">Jangan lihat chart. Jangan open posisi baru. STOP semua aktivitas trading.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border-l-4 border-blue-500">
                <div className="flex gap-3 md:gap-4">
                  <span className="text-blue-500 font-black text-2xl md:text-3xl shrink-0">3.</span>
                  <div>
                    <p className="text-blue-400 font-bold text-base md:text-lg mb-1">Menjauh dari layar</p>
                    <p className="text-slate-300 text-sm md:text-base">Jalan kaki, minum air, atau mandi. Biarkan otak Anda cool down.</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/40 rounded-xl p-4 md:p-6 border-2 border-red-500">
                <div className="flex gap-3 md:gap-4">
                  <span className="text-red-500 font-black text-2xl md:text-3xl shrink-0">⚡</span>
                  <div>
                    <p className="text-red-300 font-bold text-base md:text-lg mb-1">INGAT: Penting Banget!</p>
                    <p className="text-slate-200 text-sm md:text-base font-bold">Market akan SELALU ada besok. Tapi uangmu belum tentu aman jika Anda revenge trade sekarang. <span className="text-yellow-400">Tapi uangmu belum tentu.</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="text-center mb-10 md:mb-14">
              <p className="text-slate-400 text-sm md:text-base mb-3">Waktu cooldown tersisa:</p>
              <div className="text-5xl md:text-7xl font-black text-yellow-500 font-mono tracking-wider">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-4">Gunakan waktu ini untuk reset mental Anda.</p>
            </div>

            {/* MPT Philosophy Quote */}
            <div className="bg-slate-800/40 rounded-xl p-4 md:p-6 border border-yellow-500/30 text-center mb-8 md:mb-10">
              <p className="text-yellow-400 italic text-base md:text-lg font-semibold">
                "Mindset → Plan → Trader"
              </p>
              <p className="text-slate-400 text-sm md:text-base mt-2">
                Discipline adalah competitive advantage terbesar Anda di market. Jangan sakiti diri sendiri.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsSOSActive(false)}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 md:py-4 px-6 rounded-xl transition-all text-base md:text-lg active:scale-95"
            >
              ✓ Saya Sudah Tenang, Lanjut Trading Disiplin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Floating Button
  return (
    <button
      onClick={() => {
        setIsSOSActive(true);
        setCountdown(900);
      }}
      className="fixed bottom-6 md:bottom-8 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 border-2 border-red-400 animate-pulse"
      title="Emergency Protocol - Klik jika sedang tilt/revenge"
    >
      <AlertTriangle size={28} className="md:block" />
    </button>
  );
}