'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function PanicButton() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 menit = 900 detik

  useEffect(() => {
    if (!isSOSActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsSOSActive(false);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSOSActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSOSActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-gradient-to-b from-slate-900 via-blue-900/30 to-slate-900 flex items-center justify-center p-6 animate-fadeIn">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsSOSActive(false);
              setCountdown(900);
            }}
            className="absolute top-6 right-6 text-slate-400 hover:text-white"
          >
            <X size={32} />
          </button>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-red-500">
            PROTOKOL SOS AKTIF
          </h1>

          {/* Instructions */}
          <div className="space-y-6 text-left bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl font-bold text-yellow-500">1.</span>
              <p className="text-xl text-slate-200">
                <strong className="text-yellow-500">Tarik napas dalam-dalam.</strong> Hitung sampai 5, tahan, lalu hembuskan perlahan.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl font-bold text-yellow-500">2.</span>
              <p className="text-xl text-slate-200">
                <strong className="text-yellow-500">Tutup MetaTrader/Trading View SEKARANG.</strong> Jangan buka lagi sampai timer selesai.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl font-bold text-yellow-500">3.</span>
              <p className="text-xl text-slate-200">
                <strong className="text-yellow-500">Menjauh dari layar.</strong> Jalan kaki, minum air, atau cuci muka.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl font-bold text-yellow-500">4.</span>
              <p className="text-xl text-slate-200">
                <strong className="text-yellow-500">INGAT:</strong> Market akan selalu ada besok. <span className="text-red-500 font-bold">Tapi uangmu belum tentu.</span>
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Waktu Cooldown Tersisa:</p>
            <p className="text-6xl font-bold text-yellow-500 font-mono">
              {formatTime(countdown)}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Gunakan waktu ini untuk reset mental Anda.
            </p>
          </div>

          {/* Quote */}
          <blockquote className="text-slate-300 italic text-lg border-l-4 border-yellow-500 pl-6">
            "The market is not going anywhere. Your capital is. Protect it with your life."
            <br />
            <span className="text-slate-500 text-sm not-italic">— MPT Warrior Principle</span>
          </blockquote>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsSOSActive(true)}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 group"
      title="Panic Button - Klik jika mental sedang kacau"
    >
      <AlertTriangle size={28} className="text-white animate-pulse" />
      <span className="absolute -top-12 right-0 bg-slate-900 border border-slate-700 text-xs text-slate-300 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        SOS Button
      </span>
    </button>
  );
}