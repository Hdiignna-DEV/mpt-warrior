'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, KeyRound, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      // Store user data in localStorage
      localStorage.setItem('mpt_user', JSON.stringify(data.user));
      localStorage.setItem('mpt_token', data.token);

      // Force page reload to trigger middleware with new token
      window.location.href = data.user.role === 'ADMIN' ? '/admin-hq' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-amber-500/20 rounded-2xl mb-4">
            <Shield className="text-amber-400" size={48} />
          </div>
          <h1 className="text-4xl font-black text-amber-400 mb-2">MPT WARRIOR LOGIN</h1>
          <p className="text-slate-300">Access your tactical dashboard</p>
        </div>

        {/* Login Form */}
        <div className="glass-premium rounded-3xl p-8">
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
                required
                className="w-full bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg py-6 flex items-center justify-center gap-2"
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
