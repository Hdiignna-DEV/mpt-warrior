'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Smartphone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER */}
      <header className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft size={20} className="text-blue-400" />
            <h1 className="text-lg sm:text-xl font-black text-blue-400">Download App</h1>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* MAIN SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* APK DOWNLOAD */}
          <section className="p-6 sm:p-10 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-slate-900/50 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Download className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Android (APK)</h2>
                <p className="text-slate-400">Download dan install langsung di smartphone Android Anda</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold mb-4">Langkah-langkah Install:</h3>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Klik tombol <span className="text-blue-400 font-bold">"Download APK"</span> di bawah</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>File akan tersimpan di folder <span className="text-slate-200 font-mono">Downloads</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Buka file manager dan cari file <span className="text-slate-200 font-mono">mpt-warrior.apk</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Tap file untuk mulai install (jika error soal "Unknown sources", aktifkan di Settings → Security)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>Setelah selesai, buka app dan login dengan akun MPT Anda</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <a href="https://github.com/Hdiignna-DEV/mpt-warrior/releases" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="bg-blue-500 text-white hover:bg-blue-400 font-bold w-full py-4">
                  <Download className="mr-2" size={18} />
                  Download APK (GitHub Releases)
                </Button>
              </a>
              <a href="https://github.com/Hdiignna-DEV/mpt-warrior" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold w-full py-4">
                  Clone Repository
                </Button>
              </a>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex gap-3">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                <p className="font-semibold mb-1">Requirements:</p>
                <p>Android 10 atau lebih tinggi • Minimum 100MB storage • Internet connection</p>
              </div>
            </div>
          </section>

          {/* FEATURES HIGHLIGHT */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white">Apa yang Anda Dapatkan?</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-green-500/20 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Trading Journal</h3>
                    <p className="text-sm text-slate-400">Catat dan analisis setiap trade dengan detail metrics</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl border border-green-500/20 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-2">AI Mentor</h3>
                    <p className="text-sm text-slate-400">Chat dengan AI untuk feedback dan analisis trading</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl border border-green-500/20 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Real-time Notifications</h3>
                    <p className="text-sm text-slate-400">Get alerts untuk trading events dan reminders</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl border border-green-500/20 bg-green-500/5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Offline Mode</h3>
                    <p className="text-sm text-slate-400">Berfungsi tanpa internet dengan auto-sync</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* TROUBLESHOOTING */}
          <section className="p-6 sm:p-10 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <h2 className="text-2xl font-black text-white mb-6">Troubleshooting</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-bold mb-2">❌ "Installation blocked" error?</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Go to <span className="text-slate-200 font-mono">Settings → Security → Unknown sources</span> dan aktifkan, kemudian coba install lagi.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2">❌ App crash saat buka?</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Pastikan Android versi 10+. Coba uninstall dan install ulang. Jika masih error, email support@mpt-community.app
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2">❌ Tidak bisa download?</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Cek koneksi internet. Kalau masih tidak bisa, <Link href="/" className="text-blue-400 hover:text-blue-300 font-bold">kembali ke home</Link> dan coba lagi.
                </p>
              </div>
            </div>
          </section>

          {/* BACK TO HOME */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-6"
          >
            <Link href="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <ArrowLeft className="mr-2" size={18} />
                Kembali ke Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-xl mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">
          <p>&copy; 2026 MPT Community. All rights reserved.</p>
          <p className="mt-2 text-blue-500/70 font-mono text-xs sm:text-sm">"Focus on the Plan, Not the Panic."</p>
        </div>
      </footer>
    </div>
  );
}
