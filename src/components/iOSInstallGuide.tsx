'use client';

import { X, Share2, Home, Check } from 'lucide-react';
import { useState } from 'react';

interface iOSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallGuide({ isOpen, onClose }: iOSInstallGuideProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: 'Klik tombol Share',
      description: 'Tekan ikon Share di bagian bawah layar (kotak dengan panah keluar)',
      icon: <Share2 className="w-8 h-8 text-blue-400" />,
    },
    {
      number: 2,
      title: 'Pilih "Add to Home Screen"',
      description:
        'Scroll ke bawah dan cari opsi "Add to Home Screen" lalu tekan',
      icon: <Home className="w-8 h-8 text-blue-400" />,
    },
    {
      number: 3,
      title: 'Confirm dan Selesai!',
      description:
        'Tekan "Add" di pojok kanan atas. Aplikasi sekarang ada di home screen',
      icon: <Check className="w-8 h-8 text-green-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-blue-500/30 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Install untuk iPhone</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Current Step */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {steps[step - 1].icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Langkah {step}: {steps[step - 1].title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {steps[step - 1].description}
                </p>
              </div>
            </div>

            {/* Visual Guide */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded flex items-center justify-center text-slate-500 text-sm">
                {step === 1 && '📱 Tekan tombol Share'}
                {step === 2 && '⬇️ Scroll & pilih "Add to Home Screen"'}
                {step === 3 && '✅ Klik tombol "Add" di kanan atas'}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-xs text-amber-300">
                💡 <strong>Tips:</strong> Jika tidak menemukan "Add to Home Screen",
                pastikan Safari adalah browser yang digunakan.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setStep((s) => {
                  const newStep = Math.max(1, s - 1);
                  return newStep as 1 | 2 | 3;
                });
              }}
              disabled={step === 1}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  onClose();
                } else {
                  setStep((s) => {
                    const newStep = Math.min(3, s + 1);
                    return newStep as 1 | 2 | 3;
                  });
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              {step === 3 ? 'Selesai' : 'Selanjutnya'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IOSInstallGuide;
