'use client';

import { useEffect, useState } from 'react';
import { Shield, Download, Smartphone, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import MptLogo from '@/components/MptLogo';

export default function MaintenanceMigrationPage() {
  const { user, loading } = useAuth(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setIsAdmin(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Admin Banner */}
      {isAdmin && (
        <div className="bg-green-900/30 border-b border-green-500/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Shield size={20} className="text-green-400" />
            <span className="text-green-300 font-semibold">
              Admin Mode Active - Website is hidden from public
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <MptLogo size={64} className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-amber-400">
              MPT IS EVOLVING
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
              MOBILE MIGRATION IN PROGRESS
            </h2>
          </div>

          {/* Description */}
          <div className="space-y-4 text-slate-300">
            <p className="text-lg">
              Kami sedang memindahkan seluruh ekosistem <span className="text-amber-400 font-bold">MPT Trading HUB</span> ke aplikasi mobile native untuk pengalaman yang lebih stabil, cepat, dan responsif.
            </p>
            <p className="text-sm sm:text-base">
              Platform web akan kembali segera setelah proses migrasi selesai. Sementara itu, semua fitur tersedia di aplikasi mobile kami yang baru.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap size={20} className="text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">Update Status</h3>
            </div>
            <div className="space-y-3 text-left text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-slate-300">Database Migration: <span className="text-green-400 font-semibold">Completed</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-slate-300">Mobile App Build: <span className="text-green-400 font-semibold">Completed</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-slate-300">Final Testing: <span className="text-amber-400 font-semibold">In Progress</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full" />
                <span className="text-slate-300">Web Restoration: <span className="text-slate-400 font-semibold">Pending</span></span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Dapatkan Aplikasi Mobile Kami
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-app" target="_blank" rel="noopener noreferrer">
                <Button className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold flex items-center justify-center gap-2">
                  <Smartphone size={20} />
                  <span>Download App</span>
                </Button>
              </a>
              <a href="/downloads/HOW_TO_GET_APP.txt" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex items-center justify-center gap-2">
                  <Download size={20} />
                  <span>Installation Guide</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Why Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Zap size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Lebih Cepat</h4>
              <p className="text-xs text-slate-400">Performa native app jauh lebih optimal</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Smartphone size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Mobile First</h4>
              <p className="text-xs text-slate-400">Dioptimalkan khusus untuk perangkat mobile</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Lock size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Lebih Aman</h4>
              <p className="text-xs text-slate-400">Enkripsi dan keamanan tingkat enterprise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-6 text-center">
        <p className="text-sm text-slate-500">
          MPT Trading HUB © 2026 | Maintenance Mode
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Pertanyaan? Hubungi support@mpt-trading.com
        </p>
      </div>
    </div>
  );
}
