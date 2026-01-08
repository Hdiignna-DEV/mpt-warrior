'use client';

import { useState } from 'react';
import { Mail, KeyRound, LogIn } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CommanderArkaFullDisplay } from '@/components/ChatUIEnhancers';

export default function LoginSplit({ onSubmit }: { onSubmit?: (data: { email: string; password: string }) => void }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState('Siap bertugas, Warrior?');
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showSalute, setShowSalute] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (onSubmit) onSubmit(formData);

      // simulate success and show salute overlay briefly
      setShowSalute(true);
      setTimeout(() => setShowSalute(false), 700);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[80vh] max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
      {/* Left visual for desktop */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-[#071032] to-[#0b2a44] p-6 relative">
        <div className="w-full h-[85vh] flex items-center justify-center relative">
          <div className="absolute top-8 right-12 bg-slate-800/80 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
            {tooltip}
          </div>
          <div className="w-full h-full flex items-center justify-center pointer-events-none select-none scale-125">
            <CommanderArkaFullDisplay pose="onboarding" size="large" showLabel={false} />
          </div>
        </div>
      </div>

      {/* Right: Action area */}
      <div className="flex items-center justify-center bg-slate-900 p-6">
        <div className="relative w-full max-w-md">
          {/* Salute overlay */}
          {showSalute && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 rounded-lg p-6 flex flex-col items-center gap-3 backdrop-blur-sm transition-opacity duration-500 opacity-100">
                <div className="w-24 h-24">
                  <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />
                </div>
                <p className="text-green-300 font-bold">Akses Diterima</p>
              </div>
            </div>
          )}

          {/* Mobile peeking mascot: positioned at bottom-right corner, peeking */}
          <div className="md:hidden fixed bottom-0 right-0 w-full h-screen pointer-events-none z-0" aria-hidden="true">
            <div className="absolute bottom-0 right-2 w-[160px] h-[200px] transform drop-shadow-[0_12px_24px_rgba(2,6,23,0.8)]">
              <Image
                src="/images/mascots/commander-arka-onboarding.png"
                alt="Commander Arka"
                width={160}
                height={200}
                className="w-full h-full object-contain object-bottom"
                priority={false}
              />
            </div>
          </div>

          {/* Tooltip - positioned near mascot on mobile */}
          <div className="md:hidden fixed bottom-24 right-2 bg-slate-800/90 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg z-30 max-w-[140px]">
            {passwordFocus ? 'Keamanan adalah prioritas utama!' : tooltip}
          </div>

          <div className="flex flex-col items-center gap-2 pt-4 md:pt-0">
            <p className="text-amber-400 font-bold text-2xl md:text-3xl text-center">MPT WARRIOR</p>
            <p className="text-slate-300 text-sm text-center">Access your tactical dashboard</p>
          </div>

          <div className="glass-premium rounded-3xl p-8 mt-6 relative z-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <Input
                  type="email"
                  placeholder="warrior@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <KeyRound size={16} /> Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  required
                  className="w-full bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg py-6 flex items-center justify-center gap-2 transition-all">
                {loading ? (
                  <>
                    <div className="animate-spin">⏳</div> Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} /> LOGIN
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-slate-400">
                Belum punya akun?{' '}
                <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
                  Register di sini
                </a>
              </div>
            </form>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-slate-300">
            <p className="font-bold text-blue-400 mb-2">🔒 Secure Login</p>
            <p className="text-xs">Login hanya untuk anggota yang sudah di-approve oleh Commander. Jika status masih PENDING, Anda akan diarahkan ke halaman waiting approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
