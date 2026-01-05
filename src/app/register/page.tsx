'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserPlus, KeyRound, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    telegram_id: '',
    invitation_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter!');
      setLoading(false);
      return;
    }

    if (!formData.whatsapp && !formData.telegram_id) {
      setError('Isi minimal WhatsApp atau Telegram ID!');
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending (only used for client validation)
      const { confirmPassword, ...registrationData } = formData;
      
      console.log('[REGISTER] Sending registration data:', {
        ...registrationData,
        password: '[HIDDEN]'
      });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();
      
      console.log('[REGISTER] Response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/pending-approval');
      }, 2000);
    } catch (err: any) {
      console.error('[REGISTER] Error:', err);
      setError(err.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ShieldCheck className="text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-green-400 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-slate-300 mb-6">
            Akun Anda sedang diverifikasi oleh Commander.
            <br />
            Mohon tunggu 1x24 jam untuk approval.
          </p>
          <div className="text-sm text-slate-400">
            Redirecting to pending page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-amber-500/20 rounded-2xl mb-4">
            <UserPlus className="text-amber-400" size={48} />
          </div>
          <h1 className="text-4xl font-black text-amber-400 mb-2">MPT WARRIOR ENLISTMENT</h1>
          <p className="text-slate-300">Bergabung dengan 50+ warrior elite</p>
        </div>

        {/* Registration Form */}
        <div className="glass-premium rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Personal Info */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Nama Lengkap *</label>
              <Input
                type="text"
                placeholder="Sesuai dengan grup WA/Telegram"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email *</label>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Password *</label>
                <Input
                  type="password"
                  placeholder="Min. 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Konfirmasi Password *</label>
                <Input
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={8}
                  className="w-full bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Phone size={20} /> Kontak Verifikasi
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">WhatsApp</label>
                  <Input
                    type="tel"
                    placeholder="08123456789"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-800/50 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Format: 08xx atau +62xx</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Telegram ID</label>
                  <Input
                    type="text"
                    placeholder="@username"
                    value={formData.telegram_id}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
                    className="w-full bg-slate-800/50 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Gunakan @ di depan username</p>
                </div>
              </div>
              <p className="text-xs text-amber-400/70 mt-2">* Isi minimal salah satu untuk verifikasi</p>
            </div>

            {/* Invitation Code */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <KeyRound size={20} /> Invitation Code
              </h3>
              <Input
                type="text"
                placeholder="MPT-XXXX-2026"
                value={formData.invitation_code}
                onChange={(e) => setFormData({ ...formData, invitation_code: e.target.value.toUpperCase() })}
                required
                className="w-full bg-slate-800/50 border-slate-700 text-white font-mono text-lg"
              />
              <p className="text-xs text-slate-400 mt-2">
                📢 Dapatkan code dari grup Telegram atau WhatsApp MPT Community
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg py-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div> Processing...
                </>
              ) : (
                <>
                  <Send size={20} /> SUBMIT REGISTRATION
                </>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-slate-400">
              Sudah punya akun?{' '}
              <a href="/login" className="text-amber-400 hover:text-amber-300 font-bold">
                Login di sini
              </a>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-slate-300">
          <p className="font-bold text-blue-400 mb-2">ℹ️ Proses Verifikasi:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Submit form pendaftaran dengan invitation code</li>
            <li>Tunggu approval dari Commander (maksimal 1x24 jam)</li>
            <li>Cek email untuk notifikasi approval</li>
            <li>Login dan akses semua fitur MPT Warrior</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
