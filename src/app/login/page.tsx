'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CommanderArkaFullDisplay } from '@/components/ChatUIEnhancers';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user is pending, redirect to pending page
        if (data.status === 'pending' && data.user) {
          localStorage.setItem('mpt_user', JSON.stringify(data.user));
          window.location.href = '/pending-approval';
          return;
        }
        throw new Error(data.error || 'Login gagal');
      }

      // Store user data and token in localStorage (for compatibility with Academy pages)
      localStorage.setItem('mpt_user', JSON.stringify(data.user));
      localStorage.setItem('mpt_token', data.token);
      localStorage.setItem('token', data.token); // <-- Tambahkan baris ini

      // Play a short "salute" transition (pose change + fade) before redirect
      setShowSalute(true);
      // wait for animation (500ms) then redirect
      setTimeout(() => {
        window.location.href = data.user.role === 'ADMIN' ? '/admin-hq' : '/dashboard';
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Split screen: left visual, right action. Mobile-first stacks columns */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[80vh] max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
        {/* LEFT: Visual Area (desktop only) */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-[#071032] to-[#0b2a44] p-6 relative">
          <div className="w-full h-[65vh] flex items-center justify-center relative">
            {/* Tooltip near head */}
            <div className="absolute top-8 right-12 bg-slate-800/80 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
              {tooltip}
            </div>
            <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
              <CommanderArkaFullDisplay pose={showSalute ? 'onboarding' : 'onboarding'} size="large" showLabel={false} />
            </div>
          </div>
        </div>

        {/* RIGHT: Action Area (form) */}
        <div className="flex items-center justify-center bg-slate-900 p-6">
          <div className="relative w-full max-w-md">
            {/* Salute overlay shown briefly after successful login */}
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
            {/* Mobile peeking mascot */}
            <div className="md:hidden absolute -bottom-6 right-4 w-28 h-28 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 right-0 w-[160px] h-[180px] transform translate-y-6">
                <CommanderArkaFullDisplay pose={showSalute ? 'onboarding' : 'onboarding'} size="large" showLabel={false} />
              </div>
              {/* Mobile tooltip */}
              <div className="absolute -top-8 right-0 bg-slate-800/90 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                {passwordFocus ? 'Keamanan adalah prioritas utama!' : tooltip}
              </div>
            </div>

            {/* Header for desktop/mobile */}
            <div className="flex flex-col items-center gap-2 pt-4 md:pt-0">
              <p className="text-amber-400 font-bold text-2xl md:text-3xl text-center">MPT WARRIOR</p>
              <p className="text-slate-300 text-sm text-center">Access your tactical dashboard</p>
            </div>

            {/* Login Form */}
            <div className="glass-premium rounded-3xl p-8 mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <KeyRound size={16} /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => { setPasswordFocus(true); setTooltip('Keamanan adalah prioritas utama!'); }}
                onBlur={() => { setPasswordFocus(false); setTooltip('Siap bertugas, Warrior?'); }}
                required
                className="w-full bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg py-6 flex items-center justify-center gap-2 transition-all"
                onClick={() => {
                  // small animation trigger for salute; handled after successful login
                }}
              >
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

            {/* Register Link */}
            <div className="text-center text-sm text-slate-400">
              Belum punya akun?{' '}
              <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
                Register di sini
              </a>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-slate-300">
          <p className="font-bold text-blue-400 mb-2">🔒 Secure Login</p>
          <p className="text-xs">
            Login hanya untuk anggota yang sudah di-approve oleh Commander.
            Jika status masih PENDING, Anda akan diarahkan ke halaman waiting approval.
          </p>
        </div>
      </div>
    </div>
  );
}
