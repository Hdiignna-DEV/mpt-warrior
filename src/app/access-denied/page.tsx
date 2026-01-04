'use client';

import { Shield, XCircle } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="glass-premium rounded-3xl p-12">
          {/* Icon */}
          <div className="inline-block p-6 bg-red-500/20 rounded-full mb-6">
            <XCircle className="text-red-400" size={64} />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-red-400 mb-4">ACCESS DENIED</h1>

          <p className="text-xl text-slate-300 mb-8">
            Anda tidak memiliki akses ke halaman ini
          </p>

          {/* Info */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 text-left">
            <p className="font-bold text-red-400 mb-3">⚠️ Restricted Area</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✖️ Halaman ini hanya untuk Admin</li>
              <li>✖️ Akun Anda tidak memiliki permission</li>
              <li>✖️ Hubungi Commander jika ada pertanyaan</li>
            </ul>
          </div>

          {/* Back Button */}
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
