
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, LogIn, Shield } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Lazy load CommanderArka component
const CommanderArkaFullDisplay = dynamic(() => 
  import('@/components/ChatUIEnhancers').then(mod => ({ default: mod.CommanderArkaFullDisplay })),
  { loading: () => <div className="w-full h-full bg-slate-800/30 rounded-lg animate-pulse" /> }
);

export default function LoginSplit({ onSubmit }: { onSubmit?: (data: { email: string; password: string }) => void }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState('Siap bertugas, Warrior?');
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showSalute, setShowSalute] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle pending status
        if (data.status === 'pending') {
          setShowSalute(true);
          setTimeout(() => {
            router.push('/pending-approval');
          }, 1500);
          return;
        }
        throw new Error(data.error || 'Login gagal');
      }

      // Save token
      localStorage.setItem('token', data.token);
      
      // Trigger salute animation
      setShowSalute(true);
      
      // Redirect ke dashboard setelah animasi
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
      if (onSubmit) onSubmit(formData);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  // Update tooltip based on password focus
  useEffect(() => {
    if (passwordFocus) {
      setTooltip('Keamanan adalah prioritas utama!');
    } else {
      setTooltip('Siap bertugas, Warrior?');
    }
  }, [passwordFocus]);

  return (
    <div className="relative min-h-screen bg-slate-900">
      {!isClient ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-slate-300">Loading...</div>
        </div>
      ) : (
        <>
          {/* ========== MOBILE LAYOUT ========== */}
          <div className="md:hidden flex flex-col items-center justify-center bg-slate-900 min-h-screen p-3">
            <div className="relative w-full max-w-sm">
              {/* Salute Animation - Smooth Fade Transition (0.5s) */}
              {showSalute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                  <div className="animate-fadeIn bg-black/70 rounded-2xl p-6 flex flex-col items-center gap-3 backdrop-blur-md border border-green-500/30">
                    <div className="w-24 h-24">
                      {isClient && <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />}
                    </div>
                    <p className="text-green-300 font-bold text-sm">✓ Akses Diterima</p>
                  </div>
                </div>
              )}

              {/* Header - Compact for mobile */}
              <div className="flex flex-col items-center gap-0.5 mb-5">
                <div className="flex items-center gap-1.5">
                  <Shield size={18} className="text-amber-400" />
                  <p className="text-amber-400 font-black text-xl">MPT WARRIOR</p>
                </div>
                <p className="text-slate-400 text-xs">Tactical Command</p>
              </div>

              {/* Form Container - Optimized for mobile */}
              <div className="glass-premium rounded-2xl p-5 relative z-20 mb-4 border border-slate-700/50 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2.5 text-red-400 text-xs flex items-start gap-2">
                      <span className="text-sm">⚠️</span>
                      <span className="flex-1">{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail size={13} /> Email
                    </label>
                    <Input
                      type="email"
                      placeholder="warrior@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-slate-800/50 border-slate-700/50 text-white text-sm py-2.5 px-3 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <KeyRound size={13} /> Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      required
                      className="w-full bg-slate-800/50 border-slate-700/50 text-white text-sm py-2.5 px-3 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all rounded-lg"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm py-2.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin">⏳</div> Masuk...
                      </>
                    ) : (
                      <>
                        <LogIn size={15} /> LOGIN
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-slate-400 pt-1">
                    Belum punya akun?{' '}
                    <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                      Register
                    </a>
                  </div>
                </form>
              </div>

              {/* Secure Login Info + Mascot Peeking - Split 2:1 Layout */}
              <div className="flex gap-3 items-stretch">
                {/* Secure Login Info Box - 2 parts (SAME AS DESKTOP) */}
                <div className="flex-1 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-3 shadow-md">
                  <div className="flex items-start gap-2">
                    <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-blue-400 text-xs mb-1">🔒 Keamanan Terjamin</p>
                      <p className="text-xs text-slate-300 leading-snug">
                        Login tersedia untuk member yang sudah di-approve. Status PENDING akan diarahkan ke halaman waiting approval.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mascot Peeking - 1 part, NO background box, LARGER */}
                <div className="w-32 flex-shrink-0 flex items-end pointer-events-none">
                  <div className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                    {isClient && <CommanderArkaFullDisplay pose="onboarding" size="medium" showLabel={false} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== DESKTOP LAYOUT (Split-Screen) ========== */}
          <div className="hidden md:grid grid-cols-2 min-h-screen bg-slate-900">
            {/* Left Side: Visual Area (Navy/Blue Gradient) */}
            <div className="flex items-center justify-center bg-gradient-to-br from-[#0a1f3f] via-[#0d2a4f] to-[#051620] p-8 relative overflow-hidden group">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>

              {/* Mascot Container */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full">
                {/* Interactive Tooltip/Chat Bubble */}
                <div className="relative">
                  <div className="bg-slate-800/70 border border-slate-700/50 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm min-w-[280px] text-center">
                    <div className="flex items-center justify-center gap-2 h-6">
                      <span className="text-amber-300">›</span>
                      <span className="transition-all duration-300 ease-in-out">
                        {tooltip}
                      </span>
                      <span className="text-amber-300">‹</span>
                    </div>
                  </div>
                  {/* Tooltip pointer */}
                  <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800/70"></div>
                </div>

                {/* Commander Arka - Large Display */}
                <div className="w-64 h-80 relative drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  {isClient && <CommanderArkaFullDisplay pose="onboarding" size="large" showLabel={false} />}
                </div>

                {/* Branding Text */}
                <div className="text-center">
                  <p className="text-slate-300 text-sm font-medium">Dipimpin oleh</p>
                  <p className="text-amber-400 font-black text-xl">COMMANDER ARKA</p>
                  <p className="text-slate-400 text-xs mt-1">Tactical Mentor & Guardian</p>
                </div>
              </div>
            </div>

            {/* Right Side: Action Area (Dark Slate) */}
            <div className="flex items-center justify-center bg-slate-900 p-8">
              <div className="relative w-full max-w-md">
                {/* Salute Animation - Overlay */}
                {showSalute && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="animate-fadeIn bg-black/70 rounded-2xl p-8 flex flex-col items-center gap-4 backdrop-blur-md border border-green-500/30">
                      <div className="w-32 h-32">
                        {isClient && <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />}
                      </div>
                      <p className="text-green-300 font-black text-lg">✓ AKSES DITERIMA</p>
                      <p className="text-slate-300 text-sm">Selamat datang kembali, Warrior!</p>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="flex items-center gap-2">
                    <Shield size={24} className="text-amber-400" />
                    <h1 className="text-amber-400 font-black text-3xl">MPT WARRIOR</h1>
                  </div>
                  <p className="text-slate-400 text-sm">Masuk ke Tactical Command Center</p>
                </div>

                {/* Form */}
                <div className="glass-premium rounded-2xl p-8 relative z-20 border border-slate-700/50 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm flex items-start gap-3">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
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
                        className="w-full bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
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
                        className="w-full bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-lg py-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin">⏳</div> Masuk...
                        </>
                      ) : (
                        <>
                          <LogIn size={20} /> LOGIN
                        </>
                      )}
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                      Belum punya akun?{' '}
                      <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors duration-200">
                        Register di sini
                      </a>
                    </div>
                  </form>
                </div>

                {/* Security Info Box */}
                <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-blue-400 text-sm mb-1">🔒 Keamanan Terjamin</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Login tersedia untuk member yang sudah di-approve. Status PENDING akan diarahkan ke halaman waiting approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}