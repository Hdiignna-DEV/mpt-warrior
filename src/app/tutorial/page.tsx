'use client';

import { useState } from 'react';
import { Download, FileText, Shield, Sword, Brain, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TutorialPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    // Open PDF in new tab
    window.open('/MINDSET PLAN TRADER - MODULE.pdf', '_blank');
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNDUsIDE2NiwgMzUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      
      {/* Classification Header */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-[9px] md:text-[10px] font-mono text-amber-500/50 uppercase tracking-widest">
        CLASSIFIED // MISSION_PROTOCOL_001
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 md:top-8 md:right-8 px-4 py-2 bg-slate-800/50 border border-amber-500/30 hover:border-amber-500/60 rounded text-[10px] font-mono text-slate-400 hover:text-amber-400 uppercase tracking-wider transition-all"
      >
        [ EXIT BRIEFING ]
      </button>

      {/* Main Content Card */}
      <div className="bg-slate-950/90 backdrop-blur-xl border border-amber-500/50 p-6 md:p-8 rounded-sm max-w-5xl w-full mx-auto shadow-[0_0_50px_rgba(245,166,35,0.2)] relative z-10 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          
          {/* LEFT: Document Preview */}
          <div className="flex-1 flex flex-col items-center space-y-6">
            {/* PDF Cover Mockup */}
            <div className="w-48 md:w-56 h-64 md:h-72 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500 shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Cover Design */}
              <div className="p-6 text-center flex flex-col items-center justify-center h-full relative z-10">
                <div className="w-12 h-12 mb-6 relative">
                  <Image 
                    src="/mpt-logo.png" 
                    alt="MPT Warrior Logo" 
                    width={48} 
                    height={48}
                    className="object-contain filter drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]"
                  />
                </div>
                <p className="text-[10px] text-amber-500/80 font-mono tracking-widest mb-2">MPT WARRIOR</p>
                <h2 className="text-2xl md:text-3xl font-black text-amber-400 mt-4 tracking-wider uppercase">THE<br/>DOCTRINE</h2>
                <div className="mt-auto pt-8 border-t border-amber-500/30 w-full">
                  <p className="text-[9px] text-slate-500 font-mono">MINDSET // PLAN // TRADER</p>
                </div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/50" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/50" />
            </div>

            {/* File Info */}
            <div className="text-center space-y-1">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                [ DOWNLOAD READY: 10.4 MB ]
              </p>
              <div className="flex items-center justify-center gap-2 text-[9px] text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span className="font-mono uppercase">VERIFIED SECURE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Mission Briefing */}
          <div className="flex-[1.5] space-y-6">
            {/* Title */}
            <div className="border-l-4 border-amber-500 pl-4">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2">
                The MPT Way
              </h1>
              <p className="text-xs text-amber-500/80 font-mono uppercase tracking-wider">
                Tactical Trading Protocol
              </p>
            </div>

            {/* Objective */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
                [ OBJECTIVE ]
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Protokol ini berisi strategi operasional lengkap untuk menaklukkan market. Pelajari cara bergerak dengan presisi dan bertahan dengan disiplin.
              </p>
            </div>

            {/* Modules */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
                [ MODULES ]
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 text-slate-300">
                  <Sword className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Core Strategy (The Sword)</p>
                    <p className="text-xs text-slate-500">Teknik entry, exit, dan pattern recognition</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <Shield className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Risk Management (The Shield)</p>
                    <p className="text-xs text-slate-500">Position sizing, stop loss, dan money management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <Brain className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Psychology Reset (The Armor)</p>
                    <p className="text-xs text-slate-500">Mental discipline dan emotional control</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-sm">
              <div className="flex items-center gap-2 text-amber-500">
                <Lock className="w-4 h-4" />
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Classification: FOR WARRIOR EYES ONLY
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black py-4 tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>DOWNLOADING...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Protocol</span>
                </>
              )}
            </button>

            {/* Security Footer */}
            <div className="text-[9px] md:text-[10px] text-slate-600 text-center font-mono space-y-1 pt-4 border-t border-slate-800">
              <p className="uppercase tracking-widest">
                FORMAT: PDF // ACCESS: AUTHORIZED // SECURITY: SSL_SECURED
              </p>
              <p className="text-slate-700">
                © 2026 MPT WARRIOR // CONFIDENTIAL MATERIAL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent animate-pulse opacity-20" style={{ height: '200%', animation: 'scan 8s linear infinite' }} />
      </div>
    </div>
  );
}
