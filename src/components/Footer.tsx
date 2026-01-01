'use client';

import { Github, Linkedin, Twitter, Mail, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-slate-950/98 via-slate-900/60 to-slate-900/20 dark:from-slate-950/98 dark:via-slate-900/60 dark:to-slate-900/20 border-t border-yellow-500/25 dark:border-yellow-500/15 w-full backdrop-blur-xl shadow-2xl shadow-black/20">
      <div className="max-w-full px-4 md:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-5 group">
            <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:scale-110 transition-transform duration-300">
              MPT COMMUNITY
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-400 dark:group-hover:text-slate-300 transition-colors">
              Hub Keunggulan Trading. Mentalitas, Rencana, Risk, Disiplin dengan sistem terstruktur.
            </p>
            <div className="flex gap-3">
              <a href="#" className="group/icon relative p-3 rounded-lg bg-gradient-to-br from-slate-800/70 to-slate-800/40 hover:from-slate-800/90 hover:to-slate-700/60 dark:from-slate-800/70 dark:to-slate-800/40 dark:hover:from-slate-800/90 dark:hover:to-slate-700/60 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 border border-slate-700/40 hover:border-yellow-500/60 overflow-hidden group-hover/icon:scale-110">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                <Github className="w-5 h-5 relative z-10" />
              </a>
              <a href="#" className="group/icon relative p-3 rounded-lg bg-gradient-to-br from-slate-800/70 to-slate-800/40 hover:from-slate-800/90 hover:to-slate-700/60 dark:from-slate-800/70 dark:to-slate-800/40 dark:hover:from-slate-800/90 dark:hover:to-slate-700/60 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 border border-slate-700/40 hover:border-yellow-500/60 overflow-hidden group-hover/icon:scale-110">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                <Twitter className="w-5 h-5 relative z-10" />
              </a>
              <a href="#" className="group/icon relative p-3 rounded-lg bg-gradient-to-br from-slate-800/70 to-slate-800/40 hover:from-slate-800/90 hover:to-slate-700/60 dark:from-slate-800/70 dark:to-slate-800/40 dark:hover:from-slate-800/90 dark:hover:to-slate-700/60 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 border border-slate-700/40 hover:border-yellow-500/60 overflow-hidden group-hover/icon:scale-110">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                <Linkedin className="w-5 h-5 relative z-10" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="group">
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-5 uppercase text-xs tracking-widest group-hover:text-yellow-400 transition-colors">Fitur</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Dasbor</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Mentor AI</Link></li>
              <li><Link href="/calculator" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Kalkulasi Risk</Link></li>
              <li><Link href="/journal" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Jurnal Trading</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="group">
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-5 uppercase text-xs tracking-widest group-hover:text-yellow-400 transition-colors">Alat</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/analytics" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Analitik</Link></li>
              <li><Link href="/achievements" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Pencapaian</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Kalender Ekonomi</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="group">
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-5 uppercase text-xs tracking-widest group-hover:text-yellow-400 transition-colors">Dukungan</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium flex items-center gap-2 hover:translate-x-1"><Mail className="w-4 h-4 group-hover:animate-pulse" /> Hubungi</a></li>
              <li><Link href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium hover:translate-x-1 inline-block">Dokumentasi</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 font-medium flex items-center gap-2 hover:translate-x-1"><Shield className="w-4 h-4" /> Privasi</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-500 gap-4">
          <p className="font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-400 dark:hover:text-slate-300 transition-colors">© {currentYear} MPT COMMUNITY. Semua hak dilindungi.</p>
          <p className="flex items-center gap-2 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-400 dark:hover:text-slate-300 transition-colors">
            Dibuat dengan <Heart className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" /> untuk trader
          </p>
        </div>
      </div>
    </footer>
  );
}
