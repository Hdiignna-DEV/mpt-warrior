'use client';

import { ChevronDownIcon, Download, Apple, Smartphone, CheckCircle, TrendingUp, BarChart3, MessageSquare, Target, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GetAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/mpt-logo.png" alt="MPT Logo" width={40} height={40} />
              <div>
                <h1 className="text-lg sm:text-xl font-black text-amber-400">MPT COMMAND CENTER</h1>
                <p className="text-xs text-amber-500/70 font-mono">DOWNLOAD APP</p>
              </div>
            </div>
            <a 
              href="/"
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition"
            >
              ← Kembali
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <Image 
              src="/mpt-logo.png" 
              alt="MPT Trading HUB" 
              width={80} 
              height={80}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white">
            MPT Command Center
          </h1>
          <p className="text-xl md:text-2xl text-amber-400 font-bold mb-4">
            Platform Trading Profesional untuk Warrior Indonesia
          </p>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Download aplikasi mobile MPT Command Center. Dashboard lengkap, trading journal, AI mentor, risk calculator, leaderboard real-time, dan achievement system untuk mengembangkan skill trading Anda.
          </p>
        </div>

        {/* Device Detector Component */}
        <DeviceDetector />
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 py-16 md:py-24 border-y border-amber-500/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Fitur Unggulan Aplikasi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-amber-400" />,
                title: 'Dashboard Real-time',
                desc: 'Monitor semua statistik trading Anda dengan update real-time'
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-amber-400" />,
                title: 'Trading Journal',
                desc: 'Catat setiap trade dan analisis performa Anda secara detail'
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-amber-400" />,
                title: 'AI Mentor',
                desc: 'Dapatkan saran & insight dari AI mentor yang cerdas'
              },
              {
                icon: <Target className="w-8 h-8 text-amber-400" />,
                title: 'Risk Calculator',
                desc: 'Hitung risk & position size dengan akurat sebelum trade'
              },
              {
                icon: <Trophy className="w-8 h-8 text-amber-400" />,
                title: 'Leaderboard',
                desc: 'Kompetisi dengan trader lain di komunitas MPT'
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-400" />,
                title: 'Achievements',
                desc: 'Raih badge & milestone untuk setiap pencapaian trading'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-800/50 p-6 rounded-lg border border-amber-500/30 hover:border-amber-500/80 hover:bg-slate-800/80 transition duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Detector Component */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Download Sekarang</h2>
        <DeviceDetector />
      </div>

      {/* Installation Guide */}
      <div className="bg-slate-800/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Panduan Instalasi</h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Android Instructions */}
            <div className="bg-slate-800/60 p-8 rounded-lg border border-amber-500/30 hover:border-amber-500/80 transition">
              <div className="flex items-center mb-6">
                <Smartphone className="w-8 h-8 text-amber-400 mr-3" />
                <h3 className="text-2xl font-bold">Android</h3>
              </div>
              <ol className="space-y-4 text-slate-300">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">1</span>
                  <span>Klik tombol "Download APK" di atas</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">2</span>
                  <span>Tunggu file selesai diunduh (~75MB)</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">3</span>
                  <span>Buka folder Downloads dan tap file APK</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">4</span>
                  <span>Tap "Install" dan tunggu proses selesai</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">5</span>
                  <span>Buka app dan login dengan akun Anda</span>
                </li>
              </ol>
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded p-4">
                <p className="text-sm text-amber-200">
                  ⚠️ Jika ada warning "Install dari sumber tidak dikenal", tap Settings → Install Anyway
                </p>
              </div>
            </div>

            {/* iOS Instructions */}
            <div className="bg-slate-800/60 p-8 rounded-lg border border-amber-500/30 hover:border-amber-500/80 transition">
              <div className="flex items-center mb-6">
                <Apple className="w-8 h-8 text-amber-400 mr-3" />
                <h3 className="text-2xl font-bold">iPhone/iPad</h3>
              </div>
              <ol className="space-y-4 text-slate-300">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">1</span>
                  <span>Buka Safari dan kunjungi website kami</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">2</span>
                  <span>Tap tombol Share (panah ke atas)</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">3</span>
                  <span>Scroll dan tap "Add to Home Screen"</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">4</span>
                  <span>Edit nama ke "MPT Command Center"</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500/30 border border-amber-500/50 rounded-full flex items-center justify-center font-bold text-amber-400">5</span>
                  <span>Tap "Add" dan aplikasi siap digunakan!</span>
                </li>
              </ol>
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded p-4">
                <p className="text-sm text-amber-200">
                  ℹ️ Aplikasi akan muncul di home screen seperti native app
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 py-16 md:py-24 border-y border-amber-500/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Pertanyaan Umum (FAQ)</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Berapa ukuran file APK?',
                a: 'File APK sekitar 75-80MB. Pastikan perangkat Anda memiliki ruang kosong minimal 200MB untuk instalasi.'
              },
              {
                q: 'Apakah aman download dari link ini?',
                a: 'Ya, 100% aman. File APK kami ditandatangani secara digital dan tidak mengandung malware apapun. Kami selalu mengutamakan keamanan data Anda.'
              },
              {
                q: 'Bagaimana jika saya ingin update aplikasi?',
                a: 'Kami akan memberikan notifikasi ketika ada versi baru. Download file APK terbaru dan install ulang untuk mendapatkan versi terbaru dengan fitur-fitur baru.'
              },
              {
                q: 'Apakah bisa menggunakan di browser saja?',
                a: 'Bisa! Aplikasi juga dapat diakses melalui browser. Namun aplikasi mobile memberikan performa lebih baik, offline access, dan push notifications.'
              },
              {
                q: 'Berapa ruang storage yang dibutuhkan?',
                a: 'Aplikasi butuh ~150MB storage. Pastikan perangkat memiliki ruang kosong minimal 200-300MB untuk instalasi dan data cache.'
              },
              {
                q: 'Aplikasi tersedia untuk sistem operasi apa saja?',
                a: 'Tersedia untuk Android (APK) dan iPhone/iPad (PWA via Add to Home Screen). Download sekarang dari halaman ini!'
              }
            ].map((item, idx) => (
              <details key={idx} className="bg-slate-800/60 p-6 rounded-lg border border-amber-500/30 hover:border-amber-500/80 cursor-pointer group transition">
                <summary className="flex items-center justify-between font-semibold text-lg text-amber-300 group-open:text-amber-200">
                  {item.q}
                  <ChevronDownIcon className="w-5 h-5 transform group-open:rotate-180 transition" />
                </summary>
                <p className="text-slate-300 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Siap Memulai Trading Lebih Smart?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-95 text-white max-w-2xl mx-auto">
            Download MPT Command Center sekarang dan kelola semua trading Anda dengan dashboard lengkap, AI mentor cerdas, dan komunitas warrior yang supportif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/apk/mpt-trading-hub-v1.0.apk"
              download="mpt-trading-hub-v1.0.apk"
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 font-bold py-4 px-8 rounded-lg hover:bg-amber-50 transition transform hover:scale-105 text-lg"
            >
              <Download size={22} />
              Download Sekarang
            </a>
            <a 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/30 transition border border-white/50 text-lg"
            >
              Kembali ke Website
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-amber-500/20 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/mpt-logo.png" alt="MPT Logo" width={32} height={32} />
                <span className="font-black text-amber-400">MPT COMMAND CENTER</span>
              </div>
              <p className="text-slate-400 text-sm">Platform trading profesional dengan AI mentor dan komunitas warrior</p>
            </div>
            <div>
              <h3 className="font-bold text-amber-400 mb-4">Fitur Utama</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="/" className="hover:text-amber-400 transition">Dashboard Trading</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Journal Analisis</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Risk Calculator</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-amber-400 mb-4">Informasi</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="/" className="hover:text-amber-400 transition">Hubungi Kami</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Privacy Policy</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Terms of Service</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Dokumentasi</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p className="mb-2">MPT Command Center - Mindset Plan Trader</p>
            <p className="text-sm">© 2025 MPT Community. All rights reserved. | Dibuat dengan ❤️ untuk warrior Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DeviceDetector() {
  const [device, setDevice] = useState<'android' | 'ios' | 'unknown'>('unknown');

  useEffect(() => {
    // Detect device
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      setDevice('android');
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setDevice('ios');
    }
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Android Download Card */}
      <div className={`bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-8 rounded-lg border-2 transition ${
        device === 'android' ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/20' : 'border-slate-700'
      }`}>
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h3 className="text-2xl font-bold mb-2">Android App</h3>
          <p className="text-slate-400 mb-6">Download file APK untuk instalasi langsung</p>
          
          {device === 'android' && (
            <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-3 mb-4 text-sm flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-amber-400" />
              <span className="text-amber-300 font-semibold">Anda menggunakan Android</span>
            </div>
          )}
          
          <a 
            href="/apk/mpt-command-center-v1.0.apk"
            download="mpt-command-center-v1.0.apk"
            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download APK (v1.0)
          </a>
          
          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>📦 Size: ~75MB</p>
            <p>📱 Android 10+</p>
            <p>⚡ Offline Ready</p>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Card */}
      <div className={`bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-8 rounded-lg border-2 transition ${
        device === 'ios' ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/20' : 'border-slate-700'
      }`}>
        <div className="text-center">
          <Apple className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h3 className="text-2xl font-bold mb-2">iPhone/iPad</h3>
          <p className="text-slate-400 mb-6">Add to Home Screen (PWA)</p>
          
          {device === 'ios' && (
            <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-3 mb-4 text-sm flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-amber-400" />
              <span className="text-amber-300 font-semibold">Anda menggunakan iPhone</span>
            </div>
          )}
          
          <button 
            onClick={() => {
              const instructions = document.getElementById('ios-instructions');
              if (instructions) {
                instructions.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
          >
            <ChevronDownIcon className="w-5 h-5" />
            Lihat Panduan
          </button>
          
          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>📖 5 Langkah Mudah</p>
            <p>⏱️ Hanya 1 Menit</p>
            <p>⚡ No Installation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
