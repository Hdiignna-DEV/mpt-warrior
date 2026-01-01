'use client';

import { Github, Linkedin, Twitter, Mail, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-yellow-500/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
              MPT WARRIOR
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Trading Excellence Hub. Mindset, Plan, Risk, Discipline.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-yellow-400">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-yellow-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-yellow-400">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-yellow-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 transition-colors">AI Mentor</Link></li>
              <li><Link href="/calculator" className="hover:text-yellow-400 transition-colors">Risk Calculator</Link></li>
              <li><Link href="/journal" className="hover:text-yellow-400 transition-colors">Trade Journal</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/analytics" className="hover:text-yellow-400 transition-colors">Analytics</Link></li>
              <li><Link href="/achievements" className="hover:text-yellow-400 transition-colors">Achievements</Link></li>
              <li><Link href="/ai-mentor" className="hover:text-yellow-400 transition-colors">Economic Calendar</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> Contact</a></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {currentYear} MPT Warrior. All rights reserved.</p>
          <p className="flex items-center gap-2 mt-4 md:mt-0">
            Built with <Heart className="w-4 h-4 text-red-500" /> for traders
          </p>
        </div>
      </div>
    </footer>
  );
}
