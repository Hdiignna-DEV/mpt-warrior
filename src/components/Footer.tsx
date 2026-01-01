'use client';

import { Github, Linkedin, Twitter, Mail, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-slate-900/30 dark:from-slate-950/95 dark:via-slate-900/50 dark:to-slate-900/30 border-t border-yellow-500/15 dark:border-yellow-500/10 w-full backdrop-blur-md">
      <div className="max-w-full px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition-transform duration-300">
              MPT COMMUNITY
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
              Hub Keunggulan Trading. Mentalitas, Rencana, Risk, Disiplin dengan sistem terstruktur.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-800/30 hover:from-slate-800 hover:to-slate-700 dark:from-slate-800/60 dark:to-slate-800/30 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-lg hover:shadow-yellow-500/20 border border-slate-700/30 hover:border-yellow-500/40">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-800/30 hover:from-slate-800 hover:to-slate-700 dark:from-slate-800/60 dark:to-slate-800/30 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-lg hover:shadow-yellow-500/20 border border-slate-700/30 hover:border-yellow-500/40">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-800/30 hover:from-slate-800 hover:to-slate-700 dark:from-slate-800/60 dark:to-slate-800/30 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-yellow-400 dark:hover:text-yellow-300 hover:shadow-lg hover:shadow-yellow-500/20 border border-slate-700/30 hover:border-yellow-500/40">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-4 uppercase text-xs tracking-widest">Fitur</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Dasbor</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Mentor AI</Link></li>
              <li><Link href="/calculator" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Kalkulasi Risk</Link></li>
              <li><Link href="/journal" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Jurnal Trading</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-4 uppercase text-xs tracking-widest">Alat</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/analytics" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Analitik</Link></li>
              <li><Link href="/achievements" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Pencapaian</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Kalender Ekonomi</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-200 dark:text-slate-300 mb-4 uppercase text-xs tracking-widest">Dukungan</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium flex items-center gap-2"><Mail className="w-4 h-4" /> Hubungi</a></li>
              <li><Link href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium">Dokumentasi</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-300 font-medium flex items-center gap-2"><Shield className="w-4 h-4" /> Privasi</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-500">
          <p className="font-medium">© {currentYear} MPT COMMUNITY. Semua hak dilindungi.</p>
          <p className="flex items-center gap-2 mt-4 md:mt-0 font-medium">
            Dibuat dengan <Heart className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" /> untuk trader
          </p>
        </div>
      </div>
    </footer>
  );
}
