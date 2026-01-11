'use client';

import { ChevronDownIcon, Download, Apple, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GetAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
            Get MPT Warrior App
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Download langsung ke perangkat Anda. Tanpa perlu App Store atau Play Store.
          </p>
        </div>

        {/* Device Detector Component */}
        <DeviceDetector />
      </div>

      {/* Features Section */}
      <div className="bg-slate-800/50 py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Keuntungan Aplikasi Langsung</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Akses Cepat',
                desc: 'Buka aplikasi langsung tanpa membuka browser'
              },
              {
                icon: '📱',
                title: 'Full Features',
                desc: 'Semua fitur tersedia dengan performa optimal'
              },
              {
                icon: '🔔',
                title: 'Push Notifications',
                desc: 'Notifikasi real-time untuk alert trading'
              },
              {
                icon: '💾',
                title: 'Offline Mode',
                desc: 'Akses data bahkan tanpa koneksi internet'
              },
              {
                icon: '🔒',
                title: 'Secure',
                desc: 'Enkripsi end-to-end untuk data Anda'
              },
              {
                icon: '🎨',
                title: 'Native Feel',
                desc: 'Pengalaman seperti aplikasi native'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 hover:border-sky-500 transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Panduan Instalasi</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Android Instructions */}
          <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
            <div className="flex items-center mb-6">
              <Smartphone className="w-8 h-8 text-sky-400 mr-3" />
              <h3 className="text-2xl font-bold">Android</h3>
            </div>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">1</span>
                <span>Klik tombol "Download APK" di atas</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">2</span>
                <span>Tunggu file selesai diunduh (~50MB)</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">3</span>
                <span>Buka folder Downloads</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">4</span>
                <span>Tap file APK untuk install</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">5</span>
                <span>Klik "Install" dan tunggu selesai</span>
              </li>
            </ol>
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
              <p className="text-sm text-yellow-200">
                💡 Jika muncul warning "Install dari sumber tidak dikenal", tekan "Settings" → "Install Anyway"
              </p>
            </div>
          </div>

          {/* iOS Instructions */}
          <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
            <div className="flex items-center mb-6">
              <Apple className="w-8 h-8 text-slate-300 mr-3" />
              <h3 className="text-2xl font-bold">iPhone/iPad</h3>
            </div>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">1</span>
                <span>Buka Safari dan kunjungi website kami</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">2</span>
                <span>Tap tombol "Share" (panah ke atas)</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">3</span>
                <span>Scroll dan tap "Add to Home Screen"</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">4</span>
                <span>Edit nama (opsional)</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">5</span>
                <span>Tap "Add" dan aplikasi siap digunakan!</span>
              </li>
            </ol>
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded p-4">
              <p className="text-sm text-blue-200">
                ℹ️ Aplikasi akan muncul di home screen seperti app biasa tanpa address bar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-slate-800/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Troubleshooting</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Mengapa APK tidak bisa diinstall?',
                a: 'Pastikan Anda telah mengaktifkan "Unknown Sources" di Settings > Security. APK hanya untuk Android 10 ke atas.'
              },
              {
                q: 'Berapa ukuran file APK?',
                a: 'Sekitar 50-70MB tergantung versi. Pastikan Anda memiliki ruang kosong yang cukup.'
              },
              {
                q: 'Apakah aman menginstall dari file APK?',
                a: 'Ya, file APK kami ditandatangani secara digital. File ini aman dan tidak mengandung malware.'
              },
              {
                q: 'Apakah bisa update otomatis?',
                a: 'Saat ini update manual. Kami akan notifikasi jika ada versi baru tersedia untuk download.'
              },
              {
                q: 'Aplikasi iOS tidak muncul di home screen?',
                a: 'Pastikan Anda menggunakan Safari, bukan Chrome. Proses "Add to Home Screen" khusus untuk Safari.'
              }
            ].map((item, idx) => (
              <details key={idx} className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 cursor-pointer group">
                <summary className="flex items-center justify-between font-semibold text-lg">
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
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mulai?</h2>
          <p className="text-lg mb-8 opacity-90">Download aplikasi MPT Warrior sekarang juga dan mulai trading dengan confidence</p>
          <button className="bg-white text-sky-600 font-bold py-3 px-8 rounded-lg hover:bg-slate-100 transition transform hover:scale-105">
            Download Sekarang
          </button>
        </div>
      </div>
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
      <div className={`bg-slate-800/70 p-8 rounded-lg border-2 transition ${
        device === 'android' ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-700'
      }`}>
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-sky-400" />
          <h3 className="text-2xl font-bold mb-2">Android App</h3>
          <p className="text-slate-400 mb-6">File APK untuk direct install</p>
          
          {device === 'android' && (
            <div className="bg-sky-500/20 border border-sky-500 rounded-lg p-3 mb-4 text-sm">
              ✅ Kami deteksi Anda pakai Android
            </div>
          )}
          
          <a 
            href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
            download="mpt-warrior.apk"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download APK (v1.0)
          </a>
          
          <div className="mt-4 text-xs text-slate-400">
            <p>⚠️ Ukuran: 65MB</p>
            <p>📱 Android 10+</p>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Card */}
      <div className={`bg-slate-800/70 p-8 rounded-lg border-2 transition ${
        device === 'ios' ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-700'
      }`}>
        <div className="text-center">
          <Apple className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-2xl font-bold mb-2">iPhone/iPad</h3>
          <p className="text-slate-400 mb-6">Add to Home Screen (PWA)</p>
          
          {device === 'ios' && (
            <div className="bg-sky-500/20 border border-sky-500 rounded-lg p-3 mb-4 text-sm">
              ✅ Kami deteksi Anda pakai iPhone
            </div>
          )}
          
          <button 
            onClick={() => {
              const instructions = document.getElementById('ios-instructions');
              if (instructions) {
                instructions.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 w-full justify-center"
          >
            <ChevronDownIcon className="w-5 h-5" />
            Lihat Panduan
          </button>
          
          <div className="mt-4 text-xs text-slate-400">
            <p>📖 Ikuti 5 langkah</p>
            <p>⏱️ Hanya 1 menit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
