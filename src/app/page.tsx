'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Brain, Lock, TrendingUp, Users, CheckCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import MptLogo from '@/components/MptLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER */}
      <header className="border-b border-amber-500/20 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <MptLogo size={32} className="sm:w-12 sm:h-12" />
            <div>
              <h1 className="text-sm sm:text-xl font-black text-amber-400">MPT COMMUNITY</h1>
              <p className="text-[10px] sm:text-xs text-amber-500/70 font-mono">TRADING HUB</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs sm:text-sm px-3 py-2 sm:px-4">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs sm:text-sm px-3 py-2 sm:px-4">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-500/30 bg-amber-500/5 mb-4 sm:mb-6">
            <Lock size={14} className="text-amber-400 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-mono text-amber-400">KEANGGOTAAN EKSKLUSIF</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            MINDSET PLAN TRADER
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-amber-400 font-bold mb-3 sm:mb-4">
            "Fokus pada Rencana, Bukan Panik."
          </p>
          <p className="text-sm sm:text-lg text-slate-400 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
            Platform eksklusif untuk 50+ trader elite dengan sistem manajemen trading terpadu, 
            AI Mentor, dan akses ke modul strategi rahasia The MPT Way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Rocket className="mr-2" size={18} />
                Ajukan Akses
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                Login Member
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-white mb-8 sm:mb-12">
          FITUR EKSKLUSIF
          <span className="block text-amber-400 text-base sm:text-lg font-mono mt-2">Khusus Member</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-4 sm:p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 sm:mb-4">
              <Brain className="text-amber-400" size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">AI Mentor</h3>
            <p className="text-sm sm:text-base text-slate-400">
              Dapatkan panduan trading real-time dengan AI. Analisis kondisi pasar dan insights strategis.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Shield className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The MPT Way</h3>
            <p className="text-slate-400">
              Akses modul PDF eksklusif berisi strategi terbukti, framework mindset, dan blueprint manajemen risiko.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Target className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Trading Journal</h3>
            <p className="text-slate-400">
              Catat setiap trade dengan metrik detail, screenshot, dan analisis performa. Belajar dari history Anda.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Zap className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk Calculator</h3>
            <p className="text-slate-400">
              Hitung position size, risk/reward ratio, dan lot sizing secara instant. Tidak pernah over-leverage lagi.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-slate-400">
              Visualisasi performa trading Anda dengan chart advanced, tracking win rate, dan insights profit/loss.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Users className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">War Zone Calendar</h3>
            <p className="text-slate-400">
              Tetap selangkah lebih maju dengan integrasi kalender ekonomi. Tahu kapan berita high-impact akan menggerakkan pasar.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock size={14} className="text-amber-500" />
              <span className="text-xs text-amber-500 font-mono">TERKUNCI</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-slate-900/50 backdrop-blur-sm"
        >
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Siap Bergabung dengan Elite?
          </h2>
          <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8">
            Terbatas untuk 50+ member eksklusif. Ajukan akses dengan kode undangan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 w-full sm:w-auto">
                <CheckCircle className="mr-2" size={18} />
                Ajukan Akses Sekarang
              </Button>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6">
            Sudah menjadi member?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-bold">
              Login di sini
            </Link>
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">
          <p>&copy; 2026 MPT Community. Hak cipta dilindungi.</p>
          <p className="mt-2 text-amber-500/70 font-mono text-xs sm:text-sm">"Fokus pada Rencana, Bukan Panik."</p>
        </div>
      </footer>
    </div>
  );
}
