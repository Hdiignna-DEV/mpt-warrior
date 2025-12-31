'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X, Heart, Wind } from 'lucide-react';

const affirmations = [
  "The market will always be there tomorrow. Preserve your capital today.",
  "Emotions lead to losses. Logic leads to profits. Stay calm.",
  "1% risk per trade. That's the discipline that builds empires.",
  "A loss is just data. Use it to improve, not to revenge trade.",
  "Breathe. Step back. Analyze. Only then, trade.",
  "Your biggest enemy is not the market. It's your own emotions.",
  "Protect your capital like a warrior protects their homeland.",
  "Patience in trading is like patience in meditation. Master both.",
];

export default function PanicButton() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    if (isSOSActive) {
      setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
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
    }
  }, [isSOSActive]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (isSOSActive) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-300">
          {/* SOS Header */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 rounded-2xl bg-red-500/20 border border-red-500/50 animate-pulse">
              <AlertTriangle size={48} className="text-red-400 mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-red-400">SYSTEM PAUSE</h1>
            <p className="text-slate-300 text-lg">You're in PANIC MODE. Let's reset your mind.</p>
          </div>

          {/* Instructions */}
          <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Wind size={24} className="text-cyan-400" />
              Follow This Protocol
            </h2>
            <ol className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">1</span>
                <span className="text-lg">Take 5 deep breaths. In through nose, out through mouth.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">2</span>
                <span className="text-lg">Stand up and walk away from your screen.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">3</span>
                <span className="text-lg">Drink water. Step outside if possible.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">4</span>
                <span className="text-lg">Don't make any trading decisions until timer ends.</span>
              </li>
            </ol>
          </div>

          {/* Affirmation */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
            <p className="text-yellow-300 text-lg font-semibold italic">"{affirmation}"</p>
            <p className="text-yellow-400/60 text-sm mt-3">- MPT Warrior Philosophy</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm mb-2">COOLDOWN TIMER</p>
            <div className="text-6xl font-bold text-cyan-400 font-mono mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${(countdown / 900) * 100}%` }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-4">Take this time to reflect and reset your mindset</p>
          </div>

          {/* Heart Beat Icon */}
          <div className="flex justify-center">
            <Heart size={40} className="text-red-400 animate-pulse" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsSOSActive(false)}
            className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-semibold transition-all text-sm"
          >
            I'm Ready to Continue (Timer Still Running)
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsSOSActive(true)}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 hover:shadow-red-500/75 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group animate-bounce"
      title="Emergency SOS Button"
    >
      <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
      <AlertTriangle size={24} className="text-white relative z-10" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
    </button>
  );
}