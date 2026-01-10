'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = async () => {
    if (!user?.email) return;
    
    setChecking(true);
    try {
      const response = await fetch('/api/auth/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update localStorage with latest data
        localStorage.setItem('mpt_user', JSON.stringify(data.user));
        setUser(data.user);
        setLastCheck(new Date());

        // If approved, redirect to login to get token
        if (data.user.status === 'active') {
          alert('🎉 Selamat! Akun Anda telah disetujui. Silakan login kembali.');
          localStorage.removeItem('mpt_user');
          localStorage.removeItem('mpt_token');
          router.push('/login');
        } else if (data.user.status === 'rejected') {
          alert('❌ Maaf, pendaftaran Anda ditolak oleh admin.');
          localStorage.removeItem('mpt_user');
          localStorage.removeItem('mpt_token');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('mpt_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Only redirect if status is ALREADY active (approved while on this page)
      // Don't redirect pending users back to login
      if (parsedUser.status === 'active') {
        // User was approved, redirect to login to get new token
        router.push('/login');
      } else if (parsedUser.status === 'rejected') {
        // User was rejected
        router.push('/login');
      }
    } else {
      // No user data, redirect to login
      router.push('/login');
    }
  }, [router]);

  // Auto-check status every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('mpt_user');
    localStorage.removeItem('mpt_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Main Card */}
        <div className="glass-premium rounded-3xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="inline-block p-6 bg-yellow-500/20 rounded-full mb-6 animate-pulse">
            <Clock className="text-yellow-400" size={64} />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-yellow-400 mb-4">
            PENDING APPROVAL
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            Akun Anda sedang diverifikasi oleh Commander
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-slate-900/60 rounded-2xl p-6 mb-8 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Shield className="text-blue-400" size={32} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-white text-lg">{user.name}</h3>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                  {user.whatsapp && (
                    <p className="text-slate-400 text-xs mt-1">📱 WA: {user.whatsapp}</p>
                  )}
                  {user.telegram_id && (
                    <p className="text-slate-400 text-xs">✈️ TG: {user.telegram_id}</p>
                  )}
                </div>
                <div className="px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <span className="text-yellow-400 font-bold text-sm">PENDING</span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="text-left space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">Pendaftaran Berhasil</h4>
                <p className="text-sm text-slate-400">Data Anda telah tersimpan di sistem</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-yellow-500/20 rounded-lg animate-pulse">
                <Clock className="text-yellow-400" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-400">Menunggu Verifikasi</h4>
                <p className="text-sm text-slate-400">
                  Commander akan memverifikasi data Anda dalam 1x24 jam
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-50">
              <div className="mt-1 p-2 bg-slate-700/20 rounded-lg">
                <Shield className="text-slate-500" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-500">Akses Penuh</h4>
                <p className="text-sm text-slate-500">
                  Setelah di-approve, Anda dapat mengakses semua fitur
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8 text-left">
            <p className="font-bold text-blue-400 mb-3">📧 Notifikasi Approval</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✅ Email notifikasi akan dikirim setelah approval</li>
              <li>✅ Cek email secara berkala</li>
              <li>✅ Hubungi admin jika lebih dari 24 jam belum ada kabar</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Check Status Button */}
            <Button
              onClick={checkStatus}
              disabled={checking}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Check Status'}
            </Button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center text-sm text-slate-400">
            <p>
              Butuh bantuan?{' '}
              <a
                href={`https://wa.me/6285173193389?text=${encodeURIComponent(
                  `Halo Admin MPT Warrior,\n\nSaya ingin menanyakan status approval akun saya:\n\nNama: ${user?.name || '-'}\nEmail: ${user?.email || '-'}\n\nMohon bantuan untuk pengecekan. Terima kasih!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold"
              >
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
