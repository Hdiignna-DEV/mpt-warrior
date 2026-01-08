
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, LogIn, Shield } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AIMentorSidebarLeft } from '@/components/AIMentorSidebar';

// Lazy load CommanderArka component for small displays
const CommanderArkaFullDisplay = dynamic(() => 
  import('@/components/ChatUIEnhancers').then(mod => ({ default: mod.CommanderArkaFullDisplay })),
  { loading: () => <div className="w-full h-full bg-slate-800/30 rounded-lg animate-pulse" /> }
);

export default function LoginPage({ onSubmit }: { onSubmit?: (data: { email: string; password: string }) => void }) {
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.status === 'pending') {
          setShowSalute(true);
          setTimeout(() => router.push('/pending-approval'), 1500);
          return;
        }
        throw new Error(data.error || 'Login gagal');
      }

      localStorage.setItem('mpt_token', data.token);
      localStorage.setItem('mpt_user', JSON.stringify(data.user));
      
      setShowSalute(true);
      setTimeout(() => router.push('/dashboard'), 1500);
      
      if (onSubmit) onSubmit(formData);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passwordFocus) {
      setTooltip('Keamanan adalah prioritas utama!');
    } else {
      setTooltip('Siap bertugas, Warrior?');
    }
  }, [passwordFocus]);

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* ========== MOBILE LAYOUT (<768px) ========== */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* Success Animation */}
          {showSalute && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="animate-fadeIn bg-black/70 rounded-2xl p-6 flex flex-col items-center gap-3 backdrop-blur-md border border-green-500/30">
                <div className="w-20 h-20">
                  {isClient && <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />}
                </div>
                <p className="text-green-300 font-bold text-sm">✓ Akses Diterima</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className="flex items-center gap-1.5">
              <Shield size={20} className="text-amber-400" />
              <p className="text-amber-400 font-black text-2xl">MPT WARRIOR</p>
            </div>
            <p className="text-slate-400 text-xs">Tactical Command</p>
          </div>

          {/* Login Form */}
          <div className="glass-premium rounded-2xl p-5 border border-slate-700/50 shadow-lg mb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2.5 text-red-400 text-xs flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
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
                  className="w-full bg-slate-800/50 border-slate-700/50 text-white text-sm py-2 px-3 rounded-lg"
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
                  className="w-full bg-slate-800/50 border-slate-700/50 text-white text-sm py-2 px-3 rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm py-2 flex items-center justify-center gap-2 rounded-lg"
              >
                {loading ? <>⏳ Masuk...</> : <><LogIn size={15} /> LOGIN</>}
              </Button>

              <div className="text-center text-xs text-slate-400">
                Belum punya akun?{' '}
                <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
                  Register
                </a>
              </div>
            </form>
          </div>

          {/* Info + Mascot Preview */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-blue-400 text-xs mb-0.5">🔒 Keamanan</p>
                  <p className="text-xs text-slate-300 leading-tight">
                    Login untuk member yang sudah di-approve.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-24 h-24 flex-shrink-0 flex items-end">
              <div className="drop-shadow-lg">
                {isClient && <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT (≥768px) WITH SIDEBAR ========== */}
      <div className="hidden md:grid grid-cols-1 min-h-screen">
        {/* Sidebar with Commander Arka */}
        <AIMentorSidebarLeft pose="onboarding" isActive={false} opacity={30} />

        {/* Main Content Area - Form */}
        <div className="flex items-center justify-center lg:pr-1/5 p-8 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950">
          <div className="w-full max-w-md">
            {/* Success Animation */}
            {showSalute && (
              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="animate-fadeIn bg-black/70 rounded-2xl p-8 flex flex-col items-center gap-4 backdrop-blur-md border border-green-500/30">
                  <div className="w-32 h-32">
                    {isClient && <CommanderArkaFullDisplay pose="onboarding" size="small" showLabel={false} />}
                  </div>
                  <p className="text-green-300 font-black text-lg">✓ AKSES DITERIMA</p>
                  <p className="text-slate-300 text-sm">Selamat datang, Warrior!</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <Shield size={28} className="text-amber-400" />
                <h1 className="text-amber-400 font-black text-3xl">MPT WARRIOR</h1>
              </div>
              <p className="text-slate-400">Tactical Command Center</p>
            </div>

            {/* Login Form Card */}
            <div className="glass-premium rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm flex items-start gap-3">
                    <span>⚠️</span>
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
                    className="w-full bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500"
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
                    className="w-full bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-lg py-3 flex items-center justify-center gap-3"
                >
                  {loading ? <>⏳ Masuk...</> : <><LogIn size={20} /> LOGIN</>}
                </Button>

                <div className="text-center text-sm text-slate-400">
                  Belum punya akun?{' '}
                  <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
                    Register di sini
                  </a>
                </div>
              </form>
            </div>

            {/* Security Info */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-blue-400 text-sm mb-1">🔒 Keamanan Terjamin</p>
                  <p className="text-xs text-slate-400">
                    Login tersedia untuk member yang sudah di-approve. Status PENDING akan diarahkan ke halaman waiting approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}