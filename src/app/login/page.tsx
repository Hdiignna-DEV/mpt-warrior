'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
      localStorage.setItem('token', data.token);

      // Force page reload to trigger middleware with new token
      window.location.href = data.user.role === 'ADMIN' ? '/admin-hq' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Commander Arka Avatar & Welcome Message */}
        <div className="flex flex-col items-center mb-4 sm:mb-6 px-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 flex items-center justify-center">
            <CommanderArkaFullDisplay pose="onboarding" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Welcome Warrior!</h2>
          <p className="text-amber-400 font-bold text-base sm:text-lg">Siap bertugas, Warrior!</p>
          <p className="text-slate-400 text-xs sm:text-sm">Level 4 - COMMANDER</p>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Masuk ke markas sekarang</p>
        </div>

        {/* Shield Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="text-amber-300 w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400 mb-2 tracking-tight">
            MPT WARRIOR LOGIN
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">Access your tactical dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl mx-3 sm:mx-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-base sm:text-lg flex-shrink-0">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                <Mail size={14} className="text-slate-400 sm:w-4 sm:h-4" />
                Email
              </label>
              <Input
                type="email"
                placeholder="warrior@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full h-11 sm:h-12 bg-slate-800/70 border-slate-700 text-white text-sm sm:text-base placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                <KeyRound size={14} className="text-slate-400 sm:w-4 sm:h-4" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full h-11 sm:h-12 bg-slate-800/70 border-slate-700 text-white text-sm sm:text-base placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all pr-11 sm:pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors touch-manipulation"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 transform active:scale-95 sm:hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                '🔐 LOGIN'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900/80 px-3 text-slate-500">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Belum punya akun?{' '}
              <a 
                href="/register" 
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors touch-manipulation"
              >
                Register di sini
              </a>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 sm:mt-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 sm:p-4 mx-3 sm:mx-0">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="text-xl sm:text-2xl flex-shrink-0">🔒</div>
            <div>
              <p className="font-bold text-blue-400 text-xs sm:text-sm mb-1">Secure Login</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Login hanya untuk anggota yang sudah di-approve oleh Commander.
                Jika status masih PENDING, Anda akan diarahkan ke halaman waiting approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
