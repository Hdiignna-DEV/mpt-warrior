'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Users, Send, FileText } from 'lucide-react';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  // Live Clock
  useEffect(() => {
    setMounted(true);
    
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="w-full bg-[#020617] border-t border-amber-500/30 font-mono">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* KOLOM 1: Brand Authority */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0">
                <Image 
                  src="/mpt-logo.png" 
                  alt="MPT Community Logo" 
                  width={56} 
                  height={56}
                  className="object-contain filter drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]"
                  priority
                />
              </div>
              <h3 className="font-black text-base md:text-lg text-amber-400 uppercase tracking-wider">
                MPT COMMUNITY
              </h3>
            </div>
            <p className="text-[11px] md:text-xs text-amber-500/80 font-bold uppercase tracking-widest">
              "Focus on the Plan, Not the Panic."
            </p>
            <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed font-sans">
              Platform ekosistem trading terpadu yang berfokus pada pengembangan disiplin, manajemen risiko, dan mentalitas Warrior.
            </p>
          </div>

          {/* KOLOM 2: Tactical Navigation */}
          <div>
            <h4 className="text-amber-500 text-[10px] md:text-xs mb-4 tracking-[0.2em] uppercase font-bold">
              [ NAVIGATION ]
            </h4>
            <ul className="text-slate-500 text-[10px] md:text-xs space-y-2.5 uppercase tracking-wider">
              <li>
                <Link href="/" className="hover:text-amber-500 transition-colors duration-300 inline-block">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-500 transition-colors duration-300 inline-block">
                  War Zone Calendar
                </Link>
              </li>
              <li>
                <Link href="/ai-mentor" className="hover:text-amber-500 transition-colors duration-300 inline-block">
                  AI Mentor (Intelligence)
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-amber-500 transition-colors duration-300 inline-block">
                  Trade Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: Warrior Resources */}
          <div>
            <h4 className="text-amber-500 text-[10px] md:text-xs mb-4 tracking-[0.2em] uppercase font-bold">
              [ RESOURCES ]
            </h4>
            <ul className="text-slate-500 text-[10px] md:text-xs space-y-2.5 uppercase tracking-wider">
              <li>
                <Link 
                  href="/tutorial"
                  className="hover:text-amber-500 transition-colors duration-300 inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  The MPT Way (Tutorial)
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-amber-500 transition-colors duration-300 inline-flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3 text-amber-400" />
                  Risk Management Rules
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/mptcomtradex" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition-colors duration-300 inline-flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 text-blue-400" />
                  Join the Clan (Community)
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/6285173193389?text=Commander,%20saya%20butuh%20bantuan%20terkait%20akses%20MPT%20Community." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition-colors duration-300 inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3 h-3 text-green-400" />
                  Contact Commander (Support)
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: Live System Status */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-sm space-y-3">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"
                aria-label="System operational"
              />
              <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">
                SYSTEM: OPERATIONAL
              </span>
            </div>

            {/* System Info */}
            <div className="text-[10px] text-slate-500 space-y-1 border-t border-slate-800 pt-3 font-mono">
              <p className="flex justify-between">
                <span className="text-slate-600">SERVER_TIME:</span>
                <span className="text-amber-400 font-bold tabular-nums">{currentTime}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-600">REGION:</span>
                <span className="text-slate-400">JAKARTA, ID</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-600">ENCRYPTION:</span>
                <span className="text-green-400">SSL_SECURED</span>
              </p>
            </div>
          </div>
        </div>

        {/* DISCLAIMER & BOTTOM BAR */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-900 space-y-4">
          {/* Risk Disclaimer */}
          <p className="text-[9px] md:text-[10px] text-slate-600 leading-tight uppercase tracking-widest text-center max-w-4xl mx-auto italic">
            ⚠️ RISK WARNING: Trading instrumen keuangan melibatkan risiko tinggi. MPT Community adalah platform edukasi dan tidak memberikan saran investasi atau sinyal trading. Anda bertanggung jawab penuh atas keputusan transaksi Anda sendiri. No Plan, No Trade.
          </p>

          {/* Copyright Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] md:text-[10px] text-slate-500 font-bold tracking-widest uppercase">
            <p>
              © {currentYear} MPT COMMUNITY // ALL SYSTEMS SECURED
            </p>
            <p className="text-amber-500/50">
              TERMINAL V1.0.2
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
