'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Download, BookOpen, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function DownloadPage() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [apkAvailable, setApkAvailable] = useState(false);
  const [apkInfo, setApkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileDevice = /android|iphone|ipad|ipod|mobile/.test(userAgent);
    setIsMobile(mobileDevice);

    // Check APK availability
    const checkApk = async () => {
      try {
        const response = await fetch('/api/apk/latest');
        const data = await response.json();
        setApkAvailable(data.available || false);
        setApkInfo(data);
      } catch (error) {
        console.error('Error checking APK:', error);
        setApkAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkApk();
  }, []);

  const downloadUrl = apkInfo?.downloadUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://mpt-warrior.vercel.app'}/apk/mpt-commandcenter.apk`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-50 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-black">MPT</span>
            </div>
            <h1 className="text-xl font-bold">Command Center</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-amber-500 transition">Kembali ke Web</Link>
            <Link href="/docs" className="hover:text-amber-500 transition">Dokumentasi</Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 mb-6">
              <span className="text-amber-400 text-sm font-semibold">🚀 SEKARANG TERSEDIA</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              MPT Command Center
            </h1>
            <p className="text-xl text-gray-400 mb-2">Platform Trading Profesional untuk Warrior Indonesia</p>
            <p className="text-gray-500">Bawa skill trading Anda ke level berikutnya dengan aplikasi mobile</p>
          </div>

          {/* Status Alert */}
          {!loading && (
            <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
              apkAvailable 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              {apkAvailable ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 font-semibold">✅ APK Siap Download!</p>
                    <p className="text-green-200 text-sm">Versi {apkInfo?.version} | Build Date: {new Date(apkInfo?.buildDate).toLocaleDateString('id-ID')}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-semibold">⏳ Build Sedang Berjalan</p>
                    <p className="text-yellow-200 text-sm">APK akan tersedia dalam beberapa menit. Check kembali sebentar lagi!</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Download Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* APK Download */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-8 hover:border-amber-500/60 transition">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-8 h-8 text-amber-500" />
                <h2 className="text-2xl font-bold">Download APK</h2>
              </div>
              <p className="text-gray-400 mb-6">Unduh langsung tanpa perlu Google Play Store. Kompatibel dengan semua Android 5.0+</p>

              {/* QR Code */}
              {apkAvailable && (
                <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
                  <QRCodeSVG value={downloadUrl} size={200} level="H" includeMargin />
                </div>
              )}

              {/* Download Button */}
              {apkAvailable ? (
                isMobile && isClient ? (
                  <a
                    href={downloadUrl}
                    download="mpt-commandcenter.apk"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 mb-4"
                  >
                    <Download className="w-5 h-5" />
                    Download APK Sekarang
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      const msg = `Download APK di: ${downloadUrl}`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'MPT Command Center',
                          text: msg,
                          url: window.location.href,
                        });
                      } else {
                        alert(msg);
                      }
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 mb-4"
                  >
                    <Smartphone className="w-5 h-5" />
                    Buka di Ponsel Anda
                  </button>
                )
              ) : (
                <button disabled className="w-full bg-gray-600 text-gray-300 font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 mb-4 cursor-not-allowed opacity-50">
                  <AlertCircle className="w-5 h-5" />
                  APK Sedang Diproses...
                </button>
              )}

              <p className="text-xs text-gray-500 text-center">APK Size: ~85MB | Android 5.0+</p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Fitur Unggulan</h2>

              <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4 hover:bg-slate-800/80 transition">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">Dashboard Real-time</h3>
                    <p className="text-sm text-gray-400">Monitor pasar dan portfolio Anda secara langsung</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4 hover:bg-slate-800/80 transition">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">Trading Journal</h3>
                    <p className="text-sm text-gray-400">Catat dan analisis setiap trade Anda</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4 hover:bg-slate-800/80 transition">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">AI Mentor</h3>
                    <p className="text-sm text-gray-400">Dapatkan insights dan coaching dari AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4 hover:bg-slate-800/80 transition">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold">Offline Access</h3>
                    <p className="text-sm text-gray-400">Akses data penting bahkan tanpa internet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Guide */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              Cara Instalasi
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-1">Download APK</h3>
                  <p className="text-gray-400">Klik tombol download atau scan QR code di atas</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-1">Buka File APK</h3>
                  <p className="text-gray-400">Buka file yang sudah didownload dari folder Downloads</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-1">Izinkan Instalasi</h3>
                  <p className="text-gray-400">Ketuk "Install" dan tunggu proses instalasi selesai</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black">
                  4
                </div>
                <div>
                  <h3 className="font-bold mb-1">Buka Aplikasi</h3>
                  <p className="text-gray-400">Ketuk "Buka" atau cari aplikasi di home screen Anda</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-200">
                💡 <strong>Tips:</strong> Jika mendapat peringatan keamanan, pilih "Install anyway" atau "Details" lalu "Install anyway"
              </p>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-amber-500/10">
            <h3 className="font-bold mb-4">Butuh Bantuan?</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 Email: support@mptwarrior.com</p>
              <p>💬 Chat: Hubungi kami di aplikasi web</p>
              <p>📱 WhatsApp: +62 8xx xxxx xxxx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-500/10 bg-black/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 MPT Warrior - Platform Trading Profesional</p>
          <p className="mt-2">Versi 1.0.1 | Android 5.0+ | Size: 85MB</p>
        </div>
      </footer>
    </div>
  );
}
